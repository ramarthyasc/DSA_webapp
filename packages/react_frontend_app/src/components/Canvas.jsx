import '../styles/Canvas.css';
import { useRef } from 'react';
import { useEffect, useState } from 'react';


export const Canvas = props => {
  const canvasRef = useRef();
  const contextRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);


  const startDrawing = ({ offsetX, offsetY }) => {
    //native event is the event of DOM
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY)
  }


  const draw = ({ offsetX, offsetY }) => {
    if (!isDrawing) return;

    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  }


  const clearCanvas = (rect) => {
    contextRef.current.clearRect(0, 0, rect.width, rect.height);
    buttonRender(rect, { textcolor: "white" });
  }

  const handleMouseMove = ({ nativeEvent }) => {

    const rect = canvasRef.current.getBoundingClientRect();
    const { offsetX, offsetY } = nativeEvent;
    if (offsetX >= rect.width / 2 && offsetX <= rect.width / 2 + 30 && offsetY >= 10 && offsetY <= 40) {
      buttonRender(rect, { textcolor: "white" });
      setIsDrawing(false);
    } else {
      buttonRender(rect);
      draw({ offsetX, offsetY });
    }

  }

  const handleMouseDown = ({ nativeEvent }) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const { offsetX, offsetY } = nativeEvent;
    if (offsetX >= rect.width / 2 && offsetX <= rect.width / 2 + 30 && offsetY >= 10 && offsetY <= 40) {
      clearCanvas(rect);
    } else {
      startDrawing({ offsetX, offsetY });
      setIsDrawing(true);
    }
  }

  const handleMouseUp = ({ nativeEvent }) => {
    setIsDrawing(false);
  }

  const buttonRender = (rect, { bgcolor = "lightgrey", textcolor = "black" } = {}) => {
    //draw a Poof! rectangle
    contextRef.current.fillStyle = `${bgcolor}`;
    contextRef.current.fillRect(rect.width / 2, 10, 30, 30);

    contextRef.current.font = "20px Georgia";
    contextRef.current.textBaseline = "middle";
    contextRef.current.textAlign = "center";
    contextRef.current.fillStyle = textcolor;
    contextRef.current.fillText("X", rect.width / 2 + 15, 25);

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

    // When we draw anything in the context, it scales it realtime
    ctx.scale(scale, scale);


    // setting the context to ContextRef
    contextRef.current = ctx;

    // Buttons
    buttonRender(rect);



  }, [])


  // onMouseMove is a mine
  return <canvas ref={canvasRef} {...props} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}
  />
}
