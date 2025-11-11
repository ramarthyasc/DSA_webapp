import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { Canvas } from '../components/Canvas';
import { QuestionTab } from '../components/QuestionTab';
import Slider from '../components/Slider';
import '../styles/Drawboard.css';
import { useRef, useState } from 'react';
import { QuestionContext } from '../context/QuestionContext';
import { CodeSpace } from '../components/CodeSpace';
import { HorizVertSlider } from '../components/HorizVertSlider.jsx';

function Drawboard() {
  const user = useOutletContext();


  const canvasRef = useRef();
  const codespaceRef = useRef();
  const [canvasEdgeMotionCoord, setCanvasEdgeMotionCoord] = useState(null);



  const [isCoding, setIsCoding] = useState(false);

  if (!isCoding) {
    return (
      <>
        <div className='space'>
          <QuestionContext.Provider value={{ isCoding, setIsCoding }} >
            <QuestionTab />
          </QuestionContext.Provider>
          <Slider canvasRef={canvasRef} setCanvasEdgeMotionCoord={setCanvasEdgeMotionCoord} />
          <Canvas ref={canvasRef} canvasEdgeMotionCoord={canvasEdgeMotionCoord} />
        </div>
      </>
    )

  } else {
    return (

      <>
        <div className='space'>
          <QuestionContext.Provider value={{ isCoding, setIsCoding }} >
            <QuestionTab />
          </QuestionContext.Provider>
          <HorizVertSlider codespaceRef={codespaceRef} />
          <CodeSpace ref={codespaceRef} />
        </div>
      </>
    )
  }


}

export default Drawboard;
