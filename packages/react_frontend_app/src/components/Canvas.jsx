import '../styles/Canvas.css';
import { useRef } from 'react';
import { useEffect, useState } from 'react';


export const Canvas = props => {
  const canvasRef = useRef();
  const contextRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);


  const startDrawing = ({ nativeEvent }) => {
    //native event is the event of DOM
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY)
    setIsDrawing(true);
  }

  const endDrawing = () => {
    setIsDrawing(false);
  }

  const draw = (nativeEvent) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  }

  const handleMouseMove = ({ nativeEvent }) => {
    draw(nativeEvent);

    // when you move your mouse over a certain region (where your button will be located), then your button or that region should change color.
    // create that button - which when clicked upon (OnMouseClick in that region), then it should clear the canvas.

  }

  useEffect(() => {
    // Initialize the Canvas
    //
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    //get the size of the canvas right now
    const rect = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio;
    // This gives the pixel density of the canvas
    canvas.width = Math.floor(rect.width * scale);
    canvas.height = Math.floor(rect.height * scale);
    ctx.scale(scale, scale);


    // setting the context to ContextRef
    contextRef.current = ctx;




  }, [])

  // onMouseMove is a mine
  return <canvas ref={canvasRef} {...props} onMouseDown={startDrawing} onMouseUp={endDrawing} onMouseMove={handleMouseMove} />
}
