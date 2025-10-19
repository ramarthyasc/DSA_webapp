import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { Canvas } from '../components/Canvas';
import { Question } from '../components/Question';
import Slider from '../components/Slider';
import '../styles/Drawboard.css';
import { useRef } from 'react';


function Drawboard() {
  const user = useOutletContext();


  const canvasRef = useRef();


  return (
    <>
      <div className='space'>
        <Question />
        <Slider canvasRef={canvasRef} />
        <Canvas ref={canvasRef} />
      </div>
    </>


  )
}

export default Drawboard;
