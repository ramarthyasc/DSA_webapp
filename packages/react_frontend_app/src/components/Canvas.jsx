import '../styles/Canvas.css';
import { useRef } from 'react';
import { useEffect } from 'react';
import { setDrawProps, buttonRender, startPencilDraw, drawPencil, drawDot, drawRectangle, clearCanvas, isInsideButtonRegion, buttonFinder, isOutsideButton }
  from '../services/canvasService.js';
export const Canvas = props => {
  const canvasRef = useRef();
  const contextRef = useRef();

  //whichShapeRef helps isDrawingRef identify which shape to draw when i click and hold on the canvas
  /// by default, pencil is true
  const whichShapeRef = useRef({ pencil: true, rectangle: false, circle: false, line: false });
  //isDrawingRef is for allowing to draw any shapes on the canvas - this is general for all shapes
  const isDrawingRef = useRef(false);

  const buttonIsWhiteRef = useRef(false);
  const mouseDownCoordRef = useRef({});
  const shapesRef = useRef({ x: "x", rectangle: "rectangle", circle: "circle", line: "line", pencil: "pencil", color: "color" });
  const buttonCoordRef = useRef({
    rectangle: { x0: 0, x1: 30, y0: 0, y1: 30 },
    circle: { x0: 32, x1: 62, y0: 0, y1: 30 }, line: { x0: 64, x1: 94, y0: 0, y1: 30 }, pencil: { x0: 96, x1: 126, y0: 0, y1: 30 },
    color: { x0: 128, x1: 158, y0: 0, y1: 30 },
  })

  // Drawing helpers : 
  const rectInitialCoordRef = useRef({});
  const imgDataRef = useRef(null);


  const handleMouseMove = ({ nativeEvent }) => {

    const rect = canvasRef.current.getBoundingClientRect();
    const { offsetX, offsetY } = nativeEvent;

    if (isInsideButtonRegion({ x0: rect.width - 30, x1: rect.width, y0: 0, y1: 30 }, { offsetX, offsetY })
      || isInsideButtonRegion({ x0: 0, x1: 158, y0: 0, y1: 30 }, { offsetX, offsetY })) {

      isDrawingRef.current = false;

      if (buttonIsWhiteRef.current) {
        const prevMouseDownButton = buttonFinder(mouseDownCoordRef.current, rect, isInsideButtonRegion);
        if (!prevMouseDownButton) return;
        const isOutsidePrevMouseDownButton = isOutsideButton(prevMouseDownButton, { offsetX, offsetY }, rect, isInsideButtonRegion);
        if (isOutsidePrevMouseDownButton) {
          buttonRender(contextRef.current, rect, { shape: prevMouseDownButton });
          buttonIsWhiteRef.current = false;
        }
      }

    } else {
      //when i hold a button and slide out of that to the canvas
      if (buttonIsWhiteRef.current) {
        buttonRender(contextRef.current, rect, { shape: "all" });
        /// color the active shape (in whichShapeRef) to darkgrey
        Object.keys(whichShapeRef.current).forEach((key) => {
          if (whichShapeRef.current[key]) { buttonRender(contextRef.current, rect, { bgcolor: "darkgrey", shape: key }) }
        })
        buttonIsWhiteRef.current = false;
      }


      // Drawing of shapes on the Canvas : (The continuation from OnMouseDown)
      //
      if (isDrawingRef.current) {

        if (whichShapeRef.current.pencil) { /// by default, pencil is true
          /// for pencil === true
          drawPencil(contextRef.current, { offsetX, offsetY });
        }

        if (whichShapeRef.current.rectangle) {
          /// for rectangle === true
          clearCanvas(contextRef.current, rect);
          contextRef.current.putImageData(imgDataRef.current, 0, 0);
          drawRectangle(contextRef.current, rect, { offsetX, offsetY }, rectInitialCoordRef.current, clearCanvas);
        }

        //
        //
        //
        //Other shapes to be implemented
        //
        //

      }


    }

  }

  const handleMouseDown = ({ nativeEvent }) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const { offsetX, offsetY } = nativeEvent;
    mouseDownCoordRef.current = { offsetX, offsetY };

    if (nativeEvent.button !== 0) return;

    // button highlighting: start
    for (let shape in shapesRef.current) {
      if (isInsideButtonRegion({
        x0: buttonCoordRef.current[shape].x0, x1: buttonCoordRef.current[shape].x1,
        y0: buttonCoordRef.current[shape].y0, y1: buttonCoordRef.current[shape].y1
      }, { offsetX, offsetY })) {

        buttonRender(contextRef.current, rect, { textcolor: "white", shape: shape });
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
      drawDot(contextRef.current, { offsetX, offsetY });
      startPencilDraw(contextRef.current, { offsetX, offsetY });
    }

    if (whichShapeRef.current.rectangle) {
      /// if rectangle is selected

      /// screenshotting the canvas before drawing the rectangle
      imgDataRef.current = contextRef.current.getImageData(0, 0, rect.width, rect.height);
      /// Saving the clicked coordinates
      rectInitialCoordRef.current = { x: offsetX, y: offsetY };

    }

    //
    //
    // Other shapes to be implemented
    //
    //
    //

    isDrawingRef.current = true; // entry point for any shape drawing on canvas

  }

  const handleMouseUp = ({ nativeEvent }) => {

    const rect = canvasRef.current.getBoundingClientRect();
    const { offsetX, offsetY } = nativeEvent;

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

          buttonRender(contextRef.current, rect, { shape: shape });
          buttonIsWhiteRef.current = false;

          // Setting state on what is to be drawn

          if (shape === "rectangle") {
            whichShapeRef.current.rectangle = true; //setting state : rectangle is selected to be drawn now on
            Object.keys(whichShapeRef.current).forEach((key) => {
              whichShapeRef.current[key] = (key === shape); // turning all others false except the shape rectangle
            })
            /// Changing background color of shape's button when selected
            buttonRender(contextRef.current, rect, { bgcolor: "darkgrey", shape: shape })
            ///
          } else if (shape === "pencil") {
            whichShapeRef.current.pencil = true;
            Object.keys(whichShapeRef.current).forEach((key) => {
              whichShapeRef.current[key] = (key === shape);
            })
            /// Changing background color of shape's button when selected
            buttonRender(contextRef.current, rect, { bgcolor: "darkgrey", shape: shape })
            ///
          }
          //
          //
          // other shapes to be implemented
          //
          //

          return;
        }
      }
    }



    isDrawingRef.current = false;
  }

  const handleMouseLeave = ({ nativeEvent }) => {

    const rect = canvasRef.current.getBoundingClientRect();
    const { offsetX, offsetY } = nativeEvent;
    //When mouse leaves the canvas element, isDrawingRef = false
    isDrawingRef.current = false;

    if (buttonIsWhiteRef.current) {
      buttonRender(contextRef.current, rect, { shape: "all" });
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

    buttonCoordRef.current['x'] = {
      x0: canvasRef.current.getBoundingClientRect().width - 30,
      x1: canvasRef.current.getBoundingClientRect().width, y0: 0, y1: 30
    }

    // Buttons
    for (let shape in shapesRef.current) {
      buttonRender(contextRef.current, rect, { shape: shape });
    }

    // drawPencil is default. So color the button bg
    buttonRender(contextRef.current, rect, { bgcolor: "darkgrey", shape: "pencil" });



  }, [])


  // onMouseMove is a mine
  return <canvas ref={canvasRef} {...props} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseLeave} />
}
