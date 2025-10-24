import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { Canvas } from '../components/Canvas';
import { Question } from '../components/Question';
import Slider from '../components/Slider';
import '../styles/Drawboard.css';
import { useRef, useState } from 'react';


function Drawboard() {
  const user = useOutletContext();


  const canvasRef = useRef();
  const [canvasEdgeMotionCoord, setCanvasEdgeMotionCoord] = useState(null);


  return (
    <>
      <div className='space'>
        <Question />
        <Slider canvasRef={canvasRef} setCanvasEdgeMotionCoord={setCanvasEdgeMotionCoord} />
        <Canvas ref={canvasRef} canvasEdgeMotionCoord={canvasEdgeMotionCoord} />
        {/* <div className='rightMargin'></div> */}
      </div>
    </>


  )
}

export default Drawboard;
