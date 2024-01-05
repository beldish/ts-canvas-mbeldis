import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import Canvas from './canvas'
import draw from './mainDraw';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Canvas draw={draw}/>} />
      </Routes>
    </Router>
  );
}
