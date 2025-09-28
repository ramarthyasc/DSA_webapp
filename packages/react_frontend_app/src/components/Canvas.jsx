import '../styles/Canvas.css';
import { useRef } from 'react';
import { useEffect } from 'react';
import {
  setDrawProps, buttonImagesCreator, buttonRender, startPencilDraw, drawPencil, drawDot, drawRectangle, drawCircle, drawLine,
  clearCanvas, isInsideButtonRegion, buttonFinder, isOutsideButton
}
  from '../services/canvasService.js';
export const Canvas = () => {
  const canvasRef = useRef();
  const contextRef = useRef();
  //whichShapeRef helps isDrawingRef identify which shape to draw when i click and hold on the canvas
  /// by default, pencil is true
  const whichShapeRef = useRef({ pencil: true, rectangle: false, circle: false, line: false });
  //isDrawingRef is for allowing to draw any shapes on the canvas - this is general for all shapes
  //mouseUpRef decides if isDrawingRef is enabled or not. So this is the entry point for drawing
  const isDrawingRef = useRef(false);
  const mouseUpRef = useRef(true);
  const buttonIsWhiteRef = useRef(false);
  const mouseDownCoordRef = useRef({});
  const shapesRef = useRef({ x: "x", rectangle: "rectangle", circle: "circle", line: "line", pencil: "pencil", color: "color" });
  const buttonCoordRef = useRef({
    rectangle: { x0: 0, x1: 30, y0: 0, y1: 30 },
    circle: { x0: 32, x1: 62, y0: 0, y1: 30 }, line: { x0: 64, x1: 94, y0: 0, y1: 30 }, pencil: { x0: 96, x1: 126, y0: 0, y1: 30 },
    color: { x0: 128, x1: 158, y0: 0, y1: 30 },
  })
  const buttonsRef = useRef({});
  // Drawing helpers : 
  const shapeInitialCoordRef = useRef({});
  const imgDataRef = useRef(null);



  const handleMouseMove = ({ nativeEvent }) => {

    const rect = canvasRef.current.getBoundingClientRect();
    const { offsetX, offsetY } = nativeEvent;



    if (buttonIsWhiteRef.current) {
      mouseUpRef.current = true; // if there was any white button displayed, then we are starting a new drawing(not continuation). So it acts like
      //mouseup

      const prevMouseDownButton = buttonFinder(mouseDownCoordRef.current, rect, isInsideButtonRegion);
      if (!prevMouseDownButton) return;
      const isOutsidePrevMouseDownButton = isOutsideButton(prevMouseDownButton, { offsetX, offsetY }, rect, isInsideButtonRegion);

      // If Mouse pointer is outside anywhere that button where previous mouse down happened, then rerender the button to normal
      if (isOutsidePrevMouseDownButton) {
        buttonRender(contextRef.current, rect, buttonsRef.current, { normal: true }, prevMouseDownButton);
        Object.keys(whichShapeRef.current).forEach((key) => {
          if (whichShapeRef.current[key]) { buttonRender(contextRef.current, rect, buttonsRef.current, { select: true }, key); }
        })
        buttonIsWhiteRef.current = false;
      }

    }


    // ENTRY POINT OF DRAWING ON CANVAS :

    /// If mouse up or button is white(where we gave mouseUp there too), 
    //you have to stop any kind of drawing (continuation or anything else). Other wise, You have access to draw
    isDrawingRef.current = mouseUpRef.current ? false : true;

  }

  const handleMouseDown = ({ nativeEvent }) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const { offsetX, offsetY, clientX, clientY } = nativeEvent;

    mouseDownCoordRef.current = { offsetX, offsetY };

    if (nativeEvent.button !== 0) return;

    /// If mouse up, you have to stop any kind of drawing (continuation or anything else) Here, it's false. So you have entry to Draw
    mouseUpRef.current = false; // entry point for any shape drawing on canvas
    ///

    // button highlighting: start
    for (let shape in shapesRef.current) {
      if (isInsideButtonRegion({
        x0: buttonCoordRef.current[shape].x0, x1: buttonCoordRef.current[shape].x1,
        y0: buttonCoordRef.current[shape].y0, y1: buttonCoordRef.current[shape].y1
      }, { offsetX, offsetY })) {

        buttonRender(contextRef.current, rect, buttonsRef.current, { highlight: true }, shape);
        buttonIsWhiteRef.current = true;
        return;
      }
    }


    // Initiating the Drawing on drawable canvas when clicking on the drawable canvas

    /// Set properties before drawing
    setDrawProps(contextRef.current, { lineWidth: 4 });
    ///


    if (whichShapeRef.current.pencil) {
      /// if pencil is selected
      shapeInitialCoordRef.current = { xOffset: offsetX, yOffset: offsetY, xClient: clientX, yClient: clientY };
      drawDot(contextRef.current, { offsetX, offsetY });
      startPencilDraw(contextRef.current, { offsetX, offsetY });
    }

    if (whichShapeRef.current.rectangle) {
      /// if rectangle is selected

      /// screenshotting the canvas before drawing the rectangle
      imgDataRef.current = contextRef.current.getImageData(0, 0, rect.width, rect.height);
      /// Saving the clicked coordinates
      shapeInitialCoordRef.current = { xOffset: offsetX, yOffset: offsetY, xClient: clientX, yClient: clientY };

    }

    if (whichShapeRef.current.circle) {
      imgDataRef.current = contextRef.current.getImageData(0, 0, rect.width, rect.height);
      /// Saving the clicked coordinates
      shapeInitialCoordRef.current = { xOffset: offsetX, yOffset: offsetY, xClient: clientX, yClient: clientY };

    }

    if (whichShapeRef.current.line) {
      imgDataRef.current = contextRef.current.getImageData(0, 0, rect.width, rect.height);
      /// Saving the clicked coordinates
      shapeInitialCoordRef.current = { xOffset: offsetX, yOffset: offsetY, xClient: clientX, yClient: clientY };

    }
    //
    //
    // Other shapes to be implemented
    //
    //
    //

  }

  const handleMouseUp = ({ nativeEvent }) => {

    const rect = canvasRef.current.getBoundingClientRect();
    const { offsetX, offsetY } = nativeEvent;

    // If mouse up, you have to stop any kind of drawing (continuation or anything else) - set isDrawingRef = false in MouseMove
    mouseUpRef.current = true;
    //

    for (let shape in shapesRef.current) {

      if (isInsideButtonRegion({
        x0: buttonCoordRef.current[shape].x0, x1: buttonCoordRef.current[shape].x1,
        y0: buttonCoordRef.current[shape].y0, y1: buttonCoordRef.current[shape].y1
      }, { offsetX, offsetY })) {


        if (buttonIsWhiteRef.current) {
          //ie; if the onMouseUp is done on the button without leaving the button after onMouseDown on that button (ie; Button is White on mouseup)

          if (shape === "x") {
            clearCanvas(contextRef.current, rect);
          }

          buttonRender(contextRef.current, rect, buttonsRef.current, { normal: true });
          buttonIsWhiteRef.current = false;

          // Setting state on what is to be drawn

          if (shape === "rectangle") {
            whichShapeRef.current.rectangle = true; //setting state : rectangle is selected to be drawn now on
            Object.keys(whichShapeRef.current).forEach((key) => {
              whichShapeRef.current[key] = (key === shape); // turning all others false except the shape rectangle
            })
          } else if (shape === "pencil") {
            whichShapeRef.current.pencil = true;
            Object.keys(whichShapeRef.current).forEach((key) => {
              whichShapeRef.current[key] = (key === shape);
            })
          } else if (shape === "circle") {
            whichShapeRef.current.circle = true;
            Object.keys(whichShapeRef.current).forEach((key) => {
              whichShapeRef.current[key] = (key === shape);
            })
          } else if (shape === "line") {
            whichShapeRef.current.line = true;
            Object.keys(whichShapeRef.current).forEach((key) => {
              whichShapeRef.current[key] = (key === shape);
            })
          }
          //
          // other shapes to be implemented
          //
          //

          /// Changing background color of selected shape's button 
          Object.keys(whichShapeRef.current).forEach((key) => {
            if (whichShapeRef.current[key]) { buttonRender(contextRef.current, rect, buttonsRef.current, { select: true }, key); }
          })
          ///
          return;
        }


      }
    }


  }



  const handleMouseLeave = () => {

    const rect = canvasRef.current.getBoundingClientRect();

    if (buttonIsWhiteRef) {
      buttonRender(contextRef.current, rect, buttonsRef.current, { normal: true });
      Object.keys(whichShapeRef.current).forEach((key) => {
        if (whichShapeRef.current[key]) { buttonRender(contextRef.current, rect, buttonsRef.current, { select: true }, key); }
      })
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


    // This is put here, becasue canvasRef won't get initiated before canvas element is rendered
    buttonCoordRef.current['x'] = {
      x0: canvasRef.current.getBoundingClientRect().width - 30,
      x1: canvasRef.current.getBoundingClientRect().width, y0: 0, y1: 30
    }


    // create and store buttons in an object datastructure
    buttonsRef.current = buttonImagesCreator(shapesRef.current, contextRef.current, rect);

    // Buttons Render
    buttonRender(contextRef.current, rect, buttonsRef.current, { normal: true });
    /// drawPencil is active by default. So color the button bg
    buttonRender(contextRef.current, rect, buttonsRef.current, { select: true }, "pencil");



  }, [])

  // Event listener attacher - after the useEffects above is run
  useEffect(() => {

    const rect = canvasRef.current.getBoundingClientRect();

    // on mouseUpRef on any place on window or if the user leaves the browser, turn mouseUpRef = true
    function handleMouseUpOrLeaveWindow() {
      mouseUpRef.current = true;
      //obviously, the below is true. But i wrote it for making the mouseUp control the isDrawingRef (even outside the canvas).
      isDrawingRef.current = mouseUpRef.current ? false : true;
    }

    window.addEventListener("mouseleave", handleMouseUpOrLeaveWindow);
    window.addEventListener("mouseup", handleMouseUpOrLeaveWindow);

    function handleMouseMoveWindow(e) {
      // Drawing of shapes on the Canvas : (The continuation from OnMouseDown)
      //
      if (isDrawingRef.current) {

        if (whichShapeRef.current.pencil) { /// by default, pencil is true
          /// for pencil === true
          drawPencil(contextRef.current, { clientX: e.clientX, clientY: e.clientY }, shapeInitialCoordRef.current);
        }

        if (whichShapeRef.current.rectangle) {
          /// for rectangle === true /// getImageData is done on MouseDown
          clearCanvas(contextRef.current, rect);
          contextRef.current.putImageData(imgDataRef.current, 0, 0);
          drawRectangle(contextRef.current, { clientX: e.clientX, clientY: e.clientY }, shapeInitialCoordRef.current);
        }

        if (whichShapeRef.current.circle) {
          clearCanvas(contextRef.current, rect);
          contextRef.current.putImageData(imgDataRef.current, 0, 0);
          drawCircle(contextRef.current, { clientX: e.clientX, clientY: e.clientY }, shapeInitialCoordRef.current);
        }

        if (whichShapeRef.current.line) {
          // clearCanvas(contextRef.current, rect);
          contextRef.current.putImageData(imgDataRef.current, 0, 0);
          drawLine(contextRef.current, { clientX: e.clientX, clientY: e.clientY }, shapeInitialCoordRef.current);
        }
        //
        //
        //
        //Other shapes to be implemented
        //
        //

        buttonRender(contextRef.current, rect, buttonsRef.current, { normal: true });
        Object.keys(whichShapeRef.current).forEach((key) => {
          if (whichShapeRef.current[key]) { buttonRender(contextRef.current, rect, buttonsRef.current, { select: true }, key); }
        })

      }


    }
    window.addEventListener("mousemove", handleMouseMoveWindow)

    //cleanup the event handlers
    return () => {
      window.removeEventListener("mouseleave", handleMouseUpOrLeaveWindow);
      window.removeEventListener("mouseup", handleMouseUpOrLeaveWindow);
      window.addEventListener("mousemove", handleMouseMoveWindow)
    }
  }, [])

  // onMouseMove is a mine
  return <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseLeave} />
}
