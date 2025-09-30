import '../styles/Canvas.css';
import { useRef, useEffect, useMemo } from 'react';
import {
  setDrawProps, buttonImagesCreator, buttonRender, startPencilDraw, drawPencil, drawDot, drawRectangle, drawCircle, drawLine,
  clearCanvas, isInsideButtonRegion, buttonFinder, isOutsideButton, colorPaletteImagesCreator, colorPaletteRender, copyDrawableCanvas,
  pasteDrawableCanvas, colorPaletteIndexFinder, isOutsideColorButton
}
  from '../services/canvasService.js';
export const Canvas = () => {
  const canvasRef = useRef();
  const contextRef = useRef();
  //whichShapeRef helps isDrawingRef identify which shape to draw when i click and hold on the canvas
  /// by default, pencil is true
  const whichShapeRef = useRef({ pencil: true, rectangle: false, circle: false, line: false, x: false });
  //isDrawingRef is for allowing to draw any shapes on the canvas - this is general for all shapes
  //mouseUpRef decides if isDrawingRef is enabled or not. So this is the entry point for drawing
  const isDrawingRef = useRef(false);
  const mouseUpRef = useRef(true);
  const buttonIsWhiteRef = useRef(false);
  const mouseDownCoordRef = useRef({});
  const buttonsRef = useRef({ x: "x", rectangle: "rectangle", circle: "circle", line: "line", pencil: "pencil", color: "color" });
  // we have implicit positioning - as colors is an Array -> in order of color palette presentation in the canvas
  const colorsRef = useRef(["black", "red", "green", "blue", "orange"]);
  const buttonCoordRef = useRef({
    rectangle: { x0: 0, x1: 30, y0: 0, y1: 30 },
    circle: { x0: 32, x1: 62, y0: 0, y1: 30 }, line: { x0: 64, x1: 94, y0: 0, y1: 30 }, pencil: { x0: 96, x1: 126, y0: 0, y1: 30 },
    color: { x0: 128, x1: 158, y0: 0, y1: 30 },
  })
  // we have implicit positioning - as colors is an Array -> in order of color palette presentation in the canvas
  const colorPaletteCoords = useMemo(() => {
    const colorCoords = [];
    for (let i = 0; i < colorsRef.current.length; i++) {
      if (i === 0) {
        colorCoords.push([128, 0])
      } else {
        colorCoords.push([colorCoords[i - 1][0] + 30, 0]);
      }
    }
    return colorCoords;
  }, []);

  const buttonsImgDataRef = useRef({});
  const colorPaletteImgDataRef = useRef({});
  const colorPaletteIsOnRef = useRef(false);
  // Drawing helpers : 
  const shapeInitialCoordRef = useRef({});
  const imgDataRef = useRef([]);



  const handleMouseMove = ({ nativeEvent }) => {

    const rect = canvasRef.current.getBoundingClientRect();
    const { offsetX, offsetY } = nativeEvent;



    if (buttonIsWhiteRef.current) {
      const prevMouseDownButton = buttonFinder(mouseDownCoordRef.current, rect, isInsideButtonRegion);
      const isOutsidePrevMouseDownButton = isOutsideButton(prevMouseDownButton, { offsetX, offsetY }, rect, isInsideButtonRegion);

      // If Mouse pointer is outside that button where previous mouse down happened, then rerender the button to normal
      if (isOutsidePrevMouseDownButton) {
        buttonRender(contextRef.current, rect, buttonsImgDataRef.current, { normal: true },
          colorPaletteImgDataRef.current, colorsRef.current[0], prevMouseDownButton);

        Object.keys(whichShapeRef.current).forEach((key) => {
          if (whichShapeRef.current[key]) {
            buttonRender(contextRef.current, rect, buttonsImgDataRef.current, { select: true },
              colorPaletteImgDataRef.current, colorsRef.current[0], key);
          }
        })
        buttonIsWhiteRef.current = false;
      }

      if (colorPaletteIsOnRef.current) {
        const prevMouseDownColorIndex = colorPaletteIndexFinder(mouseDownCoordRef.current, colorPaletteCoords, isInsideButtonRegion);
        const isOutsidePrevMouseDownColor = isOutsideColorButton(prevMouseDownColorIndex, { offsetX, offsetY },
          colorPaletteCoords, isInsideButtonRegion);
        // If Mouse pointer is outside that color where previous mouse down happened, then rerender that color's image or whole pallete to normal
        if (isOutsidePrevMouseDownColor) {
          colorPaletteRender(contextRef.current, colorsRef.current, colorPaletteCoords, colorPaletteImgDataRef.current);
          buttonIsWhiteRef.current = false;
        }
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
    if (isInsideButtonRegion({ x0: 0, x1: 158, y0: 0, y1: 30 }, { offsetX, offsetY }) ||
      isInsideButtonRegion({ x0: rect.width - 30, x1: rect.width, y0: 0, y1: 30 }, { offsetX, offsetY })) {
      //if the cursor is inside any button area
      for (let button in buttonsRef.current) {
        if (isInsideButtonRegion({
          x0: buttonCoordRef.current[button].x0, x1: buttonCoordRef.current[button].x1,
          y0: buttonCoordRef.current[button].y0, y1: buttonCoordRef.current[button].y1
        }, { offsetX, offsetY })) {

          buttonRender(contextRef.current, rect, buttonsImgDataRef.current, { highlight: true }, colorPaletteImgDataRef.current,
            colorsRef.current[0], button);

          buttonIsWhiteRef.current = true;
          mouseUpRef.current = true; // if there was any white button displayed, then we are starting a new drawing(not continuation). So it acts like
          //mouseup
        }
      }
      return;
    }


    /// We can use isInsideButtonRegion here. (Here, button is a general area)

    if (colorPaletteIsOnRef.current && isInsideButtonRegion({
      x0: colorPaletteCoords[0][0], x1: colorPaletteCoords.at(-1)[0] + 30, y0: 0, y1: 30
    }, { offsetX, offsetY })) {

      for (let i = 0; i < colorPaletteCoords.length; i++) {
        if (isInsideButtonRegion({
          x0: colorPaletteCoords[i][0], x1: colorPaletteCoords[i][0] + 30,
          y0: colorPaletteCoords[i][1], y1: colorPaletteCoords[i][1] + 30
        }, { offsetX, offsetY })) {
          colorPaletteRender(contextRef.current, colorsRef.current, colorPaletteCoords, colorPaletteImgDataRef.current, i);
          buttonIsWhiteRef.current = true;
          mouseUpRef.current = true; // if there was any white button displayed, then we are starting a new drawing(not continuation). So it acts like
          //mouseup
        }
      }
      return;
    }

    // THE CODE BELOW ONLY APPLIES FOR DRAWABLE CANVAS !!!
    //
    // As there are 'return's above if cursor is in the button area/ color area[when activated], the code below WORKS ONLY FOR DRAWABLE CANVAS !!!
    // Initiating the Drawing on drawable canvas when clicking on the drawable canvas


    if (colorPaletteIsOnRef.current) {
      // Paste the previous drawable canvas if there is palette present
      pasteDrawableCanvas(contextRef.current, imgDataRef.current);
      // Then normalize the background color of just "color" button
      buttonRender(contextRef.current, rect, buttonsImgDataRef.current, { normal: true },
        colorPaletteImgDataRef.current, colorsRef.current[0], "color");

      colorPaletteIsOnRef.current = false;
    }

    /// Set properties before drawing
    setDrawProps(contextRef.current, { lineWidth: 4, color: colorsRef.current[0] });
    ///

    if (whichShapeRef.current.pencil) {
      /// if pencil is selected
      shapeInitialCoordRef.current = { xOffset: offsetX, yOffset: offsetY, xClient: clientX, yClient: clientY };
      drawDot(contextRef.current, { offsetX, offsetY });
      startPencilDraw(contextRef.current, { offsetX, offsetY });
    }

    if (whichShapeRef.current.rectangle || whichShapeRef.current.circle || whichShapeRef.current.line) {
      /// if rectangle or one of other shapes is selected

      /// screenshotting the canvas before drawing the rectangle
      imgDataRef.current = copyDrawableCanvas(contextRef.current, rect);
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
    // cut the previous path when you do mouseup for pencil (Otherwise the cleared paths will get displayed)
    if (whichShapeRef.current.pencil) { contextRef.current.beginPath(); }
    //

    if (buttonIsWhiteRef.current) {
      //ie; if the onMouseUp is done on the button without leaving the button after onMouseDown on that button (ie; Button is White on mouseup)

      for (let button in buttonsRef.current) {
        if (isInsideButtonRegion({
          x0: buttonCoordRef.current[button].x0, x1: buttonCoordRef.current[button].x1,
          y0: buttonCoordRef.current[button].y0, y1: buttonCoordRef.current[button].y1
        }, { offsetX, offsetY })) {

          if (button === "x") {
            clearCanvas(contextRef.current, rect);
            // To avoid pasteDrawableCanvas happening - when i click X, and click on any shape , the previous drawing comes into display.
            colorPaletteIsOnRef.current = false;
          }

          // Rerender the buttons which are unselected to normal mode. ie; Render all buttons in normal mode
          buttonRender(contextRef.current, rect, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);

          // Setting state on what is to be drawn

          if (button === "rectangle" || button === "pencil" || button === "circle" || button === "line") {
            Object.keys(whichShapeRef.current).forEach((key) => {
              whichShapeRef.current[key] = (key === button); // turning all others false and turning on the active button
            })
            if (colorPaletteIsOnRef.current) {
              pasteDrawableCanvas(contextRef.current, imgDataRef.current);
              colorPaletteIsOnRef.current = false;
            }
          } else if (button === "color") {
            // don't lightgrey the selected whichShapeRef buttons. let it be there.

            if (colorPaletteIsOnRef.current) {
              pasteDrawableCanvas(contextRef.current, imgDataRef.current);
              colorPaletteIsOnRef.current = false;
            } else {
              /// copy the contents - before displaying the color palette
              imgDataRef.current = copyDrawableCanvas(contextRef.current, rect);
              // Render the color palette including the first selected dark grey bg color
              colorPaletteRender(contextRef.current, colorsRef.current, colorPaletteCoords, colorPaletteImgDataRef.current);
              colorPaletteIsOnRef.current = true
            }
          }
          //
          // other shapes to be implemented
          //
          //

          /// Changing background color of selected button's button ((removed "color" button from whichShapeRef -because it's "select" &
          // "highlight"(when palette is on) is handled by color palette. (highlight when colorPalette is off - is handled by color in buttonsRef)
          //by colorPalette))
          Object.keys(whichShapeRef.current).forEach((key) => {
            if (whichShapeRef.current[key]) {
              buttonRender(contextRef.current, rect, buttonsImgDataRef.current, { select: true }, colorPaletteImgDataRef.current,
                colorsRef.current[0], key);
            }
          })
          ///

          buttonIsWhiteRef.current = false;
          return;


        }
      }

      // Color Picking 

      if (colorPaletteIsOnRef.current) {

        // get the index in which i am upping the mouse - use colorPaletteIndexFinder()
        // In 'colorsRef.current', swap the ith index color with the 0th index.
        // setDrawProps color to colorsRef.current[0];
        // pasteDrawableCanvas, & colorPaletteIsOnRef = false;
        // render the "color" button only - from the buttonRender function
        const mouseUpColorIndex = colorPaletteIndexFinder({ offsetX, offsetY }, colorPaletteCoords, isInsideButtonRegion);
        //// swapping
        [colorsRef.current[0], colorsRef.current[mouseUpColorIndex]] = [colorsRef.current[mouseUpColorIndex], colorsRef.current[0]];
        pasteDrawableCanvas(contextRef.current, imgDataRef.current);

        colorPaletteIsOnRef.current = false;

        buttonRender(contextRef.current, rect, buttonsImgDataRef.current, { normal: true },
          colorPaletteImgDataRef.current, colorsRef.current[0], "color");

      }

    }

  }



  const handleMouseLeave = () => {

    const rect = canvasRef.current.getBoundingClientRect();

    if (buttonIsWhiteRef.current) {
      buttonRender(contextRef.current, rect, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);

      Object.keys(whichShapeRef.current).forEach((key) => {
        if (whichShapeRef.current[key]) {
          buttonRender(contextRef.current, rect, buttonsImgDataRef.current, { select: true },
            colorPaletteImgDataRef.current, colorsRef.current[0], key);
        }
      })
    }

    if (colorPaletteIsOnRef.current) {
      colorPaletteRender(contextRef.current, colorsRef.current, colorPaletteCoords, colorPaletteImgDataRef.current);
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
    buttonsImgDataRef.current = buttonImagesCreator(buttonsRef.current, contextRef.current, rect);
    // create and store color palette imgs data in an object datastructure
    colorPaletteImgDataRef.current = colorPaletteImagesCreator(contextRef.current, colorsRef.current);

    // Buttons Render
    buttonRender(contextRef.current, rect, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);
    /// drawPencil is active by default. So color the button bg
    buttonRender(contextRef.current, rect, buttonsImgDataRef.current, { select: true }, colorPaletteImgDataRef.current, null, "pencil");



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
          pasteDrawableCanvas(contextRef.current, imgDataRef.current);
          drawRectangle(contextRef.current, { clientX: e.clientX, clientY: e.clientY }, shapeInitialCoordRef.current);
        }

        if (whichShapeRef.current.circle) {
          pasteDrawableCanvas(contextRef.current, imgDataRef.current);
          drawCircle(contextRef.current, { clientX: e.clientX, clientY: e.clientY }, shapeInitialCoordRef.current);
        }

        if (whichShapeRef.current.line) {
          pasteDrawableCanvas(contextRef.current, imgDataRef.current);
          drawLine(contextRef.current, { clientX: e.clientX, clientY: e.clientY }, shapeInitialCoordRef.current);
        }
        //
        //
        //
        //Other shapes to be implemented
        //
        //

        buttonRender(contextRef.current, rect, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);
        Object.keys(whichShapeRef.current).forEach((key) => {
          if (whichShapeRef.current[key]) {
            buttonRender(contextRef.current, rect, buttonsImgDataRef.current, { select: true },
              colorPaletteImgDataRef.current, colorsRef.current[0], key);
          }
        })
        // if (colorPaletteIsOnRef.current) {
        //   colorPaletteRender(contextRef.current, colorsRef.current, colorPaletteCoords, colorPaletteImgDataRef.current);
        // }

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
