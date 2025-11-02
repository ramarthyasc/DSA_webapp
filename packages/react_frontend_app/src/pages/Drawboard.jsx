import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { Canvas } from '../components/Canvas';
import { QuestionTab } from '../components/QuestionTab';
import Slider from '../components/Slider';
import '../styles/Drawboard.css';
import { useRef, useState } from 'react';
import { DrawboardContext } from '../context/DrawboardContext';


function Drawboard() {
  const user = useOutletContext();


  const canvasRef = useRef();
  const [canvasEdgeMotionCoord, setCanvasEdgeMotionCoord] = useState(null);



  const [isCoding, setIsCoding] = useState(false);

  if (!isCoding) {
    return (
      <>
        <div className='space'>
          <DrawboardContext.Provider value={{ isCoding, setIsCoding }} >
            <QuestionTab />
          </DrawboardContext.Provider>
          <Slider canvasRef={canvasRef} setCanvasEdgeMotionCoord={setCanvasEdgeMotionCoord} />
          <Canvas ref={canvasRef} canvasEdgeMotionCoord={canvasEdgeMotionCoord} />
        </div>
      </>
    )

  } else {
    return (

      <>
        <div className='space'>
          <DrawboardContext.Provider value={{ isCoding, setIsCoding }} >
            <QuestionTab />
          </DrawboardContext.Provider>
          <textarea name="coding" id="coding"></textarea>
        </div>
      </>
    )
  }


}

export default Drawboard;
