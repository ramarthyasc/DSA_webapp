import '../styles/Canvas.css';
import { useRef } from 'react';
import { useEffect, useState } from 'react';


export const Canvas = props => {
  const canvasRef = useRef();
  const contextRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const buttonIsWhiteRef = useRef(false);


  const startDrawing = (ctx, { offsetX, offsetY }) => {
    //native event is the event of DOM
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(offsetX, offsetY)
  }


  const draw = (ctx, { offsetX, offsetY }) => {
    if (!isDrawing) return;

    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  }
  const drawDot = (ctx, { offsetX, offsetY }) => {
    ctx.fillRect(offsetX, offsetY, 3, 3);
  }

  const clearCanvas = (ctx, rect) => {
    ctx.clearRect(0, 0, rect.width, rect.height);
  }

  const isInsideButtonRegion = ({ x0, x1, y0, y1 }, { offsetX, offsetY }) => {
    if (offsetX >= x0 && offsetX <= x1 && offsetY >= y0 && offsetY <= y1) {
      return true;
    }
  }
  const handleMouseMove = ({ nativeEvent }) => {

    const rect = canvasRef.current.getBoundingClientRect();
    const { offsetX, offsetY } = nativeEvent;

    if (isInsideButtonRegion({ x0: rect.width - 30, x1: rect.width, y0: 0, y1: 30 }, { offsetX, offsetY })
      || isInsideButtonRegion({ x0: 0, x1: 158, y0: 0, y1: 30 }, { offsetX, offsetY })) {
      setIsDrawing(false);

    } else {
      buttonRender(contextRef.current, rect, { shape: "all" });
      buttonIsWhiteRef.current = false;
      draw(contextRef.current, { offsetX, offsetY });
    }

  }

  const handleMouseDown = ({ nativeEvent }) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const { offsetX, offsetY } = nativeEvent;

    if (nativeEvent.button !== 0) return;

    if (isInsideButtonRegion({ x0: rect.width - 30, x1: rect.width, y0: 0, y1: 30 }, { offsetX, offsetY })) {
      // X button
      buttonRender(contextRef.current, rect, { textcolor: "white", shape: "x" });
      buttonIsWhiteRef.current = true;
    } else if (isInsideButtonRegion({ x0: 0, x1: 30, y0: 0, y1: 30 }, { offsetX, offsetY })) {
      // button bar in the top left
      buttonRender(contextRef.current, rect, { textcolor: "white", shape: "rectangle" });
      buttonIsWhiteRef.current = true;
    } else if (isInsideButtonRegion({ x0: 32, x1: 62, y0: 0, y1: 30 }, { offsetX, offsetY })) {
      buttonRender(contextRef.current, rect, { textcolor: "white", shape: "circle" });
      buttonIsWhiteRef.current = true;
    } else if (isInsideButtonRegion({ x0: 64, x1: 94, y0: 0, y1: 30 }, { offsetX, offsetY })) {
      buttonRender(contextRef.current, rect, { textcolor: "white", shape: "line" });
      buttonIsWhiteRef.current = true;
    } else if (isInsideButtonRegion({ x0: 96, x1: 126, y0: 0, y1: 30 }, { offsetX, offsetY })) {
      buttonRender(contextRef.current, rect, { textcolor: "white", shape: "pencil" });
      buttonIsWhiteRef.current = true;
    } else if (isInsideButtonRegion({ x0: 128, x1: 158, y0: 0, y1: 30 }, { offsetX, offsetY })) {
      buttonRender(contextRef.current, rect, { textcolor: "white", shape: "color" });
    } else {
      buttonIsWhiteRef.current = true; startDrawing(contextRef.current, { offsetX, offsetY });
      drawDot(contextRef.current, { offsetX, offsetY });
      setIsDrawing(true);
    }


  }

  const handleMouseUp = ({ nativeEvent }) => {

    const rect = canvasRef.current.getBoundingClientRect();
    const { offsetX, offsetY } = nativeEvent;

    if (isInsideButtonRegion({ x0: rect.width - 30, x1: rect.width, y0: 0, y1: 30 }, { offsetX, offsetY })) {
      if (buttonIsWhiteRef.current) {
        //ie; if the onMouseUp is done without leaving the button after onMouseDown on that button
        clearCanvas(contextRef.current, rect);
        buttonRender(contextRef.current, rect, { shape: "x" });
        buttonIsWhiteRef.current = false;
      }
    } else if (isInsideButtonRegion({ x0: 0, x1: 30, y0: 0, y1: 30 }, { offsetX, offsetY })) {
      if (buttonIsWhiteRef.current) {
        buttonRender(contextRef.current, rect, { shape: "rectangle" });
        buttonIsWhiteRef.current = false;
      }
    } else if (isInsideButtonRegion({ x0: 32, x1: 62, y0: 0, y1: 30 }, { offsetX, offsetY })) {
      if (buttonIsWhiteRef.current) {
        buttonRender(contextRef.current, rect, { shape: "circle" });
        buttonIsWhiteRef.current = false;
      }
    } else if (isInsideButtonRegion({ x0: 64, x1: 94, y0: 0, y1: 30 }, { offsetX, offsetY })) {
      if (buttonIsWhiteRef.current) {
        buttonRender(contextRef.current, rect, { shape: "line" });
        buttonIsWhiteRef.current = false;
      }
    } else if (isInsideButtonRegion({ x0: 96, x1: 126, y0: 0, y1: 30 }, { offsetX, offsetY })) {
      if (buttonIsWhiteRef.current) {
        buttonRender(contextRef.current, rect, { shape: "pencil" });
        buttonIsWhiteRef.current = false;
      }
    } else if (isInsideButtonRegion({ x0: 128, x1: 158, y0: 0, y1: 30 }, { offsetX, offsetY })) {
      if (buttonIsWhiteRef.current) {
        buttonRender(contextRef.current, rect, { shape: "x" });
        buttonIsWhiteRef.current = false;
      }
    }





    setIsDrawing(false);

  }

  const handleMouseLeave = ({ nativeEvent }) => {
    //When mouse leaves the canvas element, setIsDrawing(false)
    setIsDrawing(false);
  }


  const buttonRender = (ctx, rect, { bgcolor = "lightgrey", textcolor = "black", color = "black", shape = "all" } = {}) => {
    ctx.fillStyle = `${bgcolor}`;

    if (shape === "rectangle" || shape === "all") {
      ctx.fillRect(0, 0, 30, 30);
      ctx.strokeStyle = `${textcolor}`;
      ctx.strokeRect(5, 5, 20, 20);

    }
    if (shape === "circle" || shape === "all") {
      ctx.fillRect(32, 0, 30, 30);
      ctx.strokeStyle = `${textcolor}`;
      ctx.beginPath();
      ctx.arc(47, 15, 10, 0, 2 * Math.PI);
      ctx.stroke();

    }
    if (shape === "line" || shape === "all") {
      ctx.fillRect(64, 0, 30, 30);
      ctx.strokeStyle = `${textcolor}`;
      ctx.beginPath();
      ctx.moveTo(69, 5);
      ctx.lineTo(89, 25);
      ctx.stroke();

    }
    if (shape === "pencil" || shape === "all") {
      ctx.fillRect(96, 0, 30, 30);
      ctx.strokeStyle = `${textcolor}`;
      ctx.beginPath();
      ctx.moveTo(101, 13);
      ctx.lineTo(117, 13);
      ctx.lineTo(121, 15);
      ctx.lineTo(117, 17);
      ctx.lineTo(101, 17);
      ctx.lineTo(101, 13);

      ctx.moveTo(104, 13);
      ctx.lineTo(104, 17);
      ctx.stroke();

    }
    if (shape === "color" || shape === "all") {
      ctx.fillRect(128, 0, 30, 30);
      ctx.fillStyle = `${color}`;
      ctx.fillRect(133, 5, 20, 20);

    }
    if (shape === "x" || shape === "all") {
      ctx.fillStyle = `${bgcolor}`;
      ctx.fillRect(rect.width - 30, 0, 30, 30);
      ctx.font = "20px georgia";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillStyle = textcolor;
      ctx.fillText("x", rect.width - 15, 15);

    }
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
    buttonRender(contextRef.current, rect, { shape: "x" });
    buttonRender(contextRef.current, rect, { shape: "rectangle" });
    buttonRender(contextRef.current, rect, { shape: "circle" });
    buttonRender(contextRef.current, rect, { shape: "line" });
    buttonRender(contextRef.current, rect, { shape: "pencil" });
    buttonRender(contextRef.current, rect, { shape: "color" });



  }, [])


  // onMouseMove is a mine
  return <canvas ref={canvasRef} {...props} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseLeave} />
}
