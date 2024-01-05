import React, { useRef, useEffect, useState, useCallback } from 'react'

interface CanvasProps {
  width: number;
  height: number;
  draw(context: CanvasRenderingContext2D, originalMousePosition: Coordinate | null, newMousePosition: Coordinate | null): null;
}

export type Coordinate = {
  x: number;
  y: number;
};


const Canvas = (props: CanvasProps) => {
  const [isPressed, setisPressed] = useState(false);
  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);  
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { draw, ...rest } = props; 

  const startPaint = useCallback((event: MouseEvent) => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
        setisPressed(true);
        setMousePosition(coordinates);
    }
  }, []);

  const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    if (canvas == null) return; // current may be null
    return {x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop};
  };

  const paint = useCallback(
    (event: MouseEvent) => {
        if (isPressed) {
            const newMousePosition = getCoordinates(event);
            if (mousePosition && newMousePosition) {
                drawFigures(mousePosition, newMousePosition);
                setMousePosition(newMousePosition);
            }
        }
    },
    [isPressed, mousePosition]
  );

  const drawFigures = (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
    if (!canvasRef.current) return;
      const canvas: HTMLCanvasElement = canvasRef.current;
      if (canvas == null) return; // current may be null
      const context = canvas.getContext('2d');
      if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          draw(context, originalMousePosition, newMousePosition);
        }
    };

    const exitPaint = useCallback(() => {
      setisPressed(false);
    }, []);

    useEffect(() => {
      if (!canvasRef.current) return;
      const canvas: HTMLCanvasElement = canvasRef.current;
      if (canvas == null) return; // current may be null      
      canvas.addEventListener('mouseup', exitPaint);
      canvas.addEventListener('mouseleave', exitPaint);
      return () => {
          canvas.removeEventListener('mouseup', exitPaint);
          canvas.removeEventListener('mouseleave', exitPaint);
      };
  }, [exitPaint]);



  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (canvas == null) return; // current may be null
    canvas.addEventListener('mousemove', paint);
    return () => {
        canvas.removeEventListener('mousemove', paint);
    };
}, [paint]); 



  useEffect(() => {

    if (!canvasRef.current) return;

    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (canvas == null) return; // current may be null
    canvas.addEventListener('mousedown', startPaint);

    const context: CanvasRenderingContext2D | null  = canvas.getContext('2d');
    if (context == null) return; // context may be null

    // Draw
   draw(context, null, null);

  }, [startPaint])
  
  return <canvas ref={canvasRef} {...props}/>
}

Canvas.defaultProps = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export default Canvas
