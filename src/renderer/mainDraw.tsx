import figures from './figures.json';
import { Coordinate } from './canvas';


interface Figure {
    type: string,
    color: string,
    X: number, 
    Y: number, 
    radius: number 
}

const draw = (ctx: CanvasRenderingContext2D, originalMousePosition: Coordinate | null, newMousePosition: Coordinate | null): null => {
    console.log(originalMousePosition, newMousePosition);

    const drawCircle = (fig: Figure) => {
        ctx.fillStyle = fig.color;
        ctx.beginPath()
        ctx.arc(fig.X, fig.Y, fig.radius, 0, 2*Math.PI)
        ctx.fill()
    }

    const figArray:Figure[] = figures as Figure[];

    if (originalMousePosition && newMousePosition ) {
        for (var i = 0; i < figArray.length; i++ ) {
            if(Math.abs(figArray[i].X - originalMousePosition.x) < figArray[i].radius &&
            Math.abs(figArray[i].Y - originalMousePosition.y) < figArray[i].radius) {
                figArray[i].X += newMousePosition.x - originalMousePosition.x;
                figArray[i].Y += newMousePosition.y - originalMousePosition.y;
            }
        }
    }

    figArray.forEach(fig => {
           drawCircle(fig);
    });
    return null;
}

export default draw;
