import '../styles/Canvas.css';
import { useRef, useEffect, useMemo } from 'react';
import {
  setDrawProps, buttonImagesCreator, buttonRender, startPencilDraw, drawPencil, drawDot, drawRectangle, drawCircle, drawLine,
  clearCanvas, isInsideButtonRegion, buttonFinder, isOutsideButton, colorPaletteImagesCreator, colorPaletteRender, copyDrawableCanvas,
  pasteDrawableCanvas, colorPaletteIndexFinder, isOutsideColorButton, isEqualImgDatas
}
  from '../services/canvasService.js';
export const Canvas = () => {
  const canvasRef = useRef();
  const contextRef = useRef();
  //whichShapeSelectedRef helps isDrawingRef identify which shape to draw when i click and hold on the canvas
  /// by default, pencil is true
  const whichShapeSelectedRef = useRef({ pencil: true, rectangle: false, circle: false, line: false });
  //isDrawingRef is for allowing to draw any shapes on the canvas - this is general for all shapes
  //mouseUpRef decides if isDrawingRef is enabled or not. So this is the entry point for drawing
  const isDrawingRef = useRef(false);
  const mouseUpRef = useRef(true);
  const buttonIsWhiteRef = useRef(false);
  const mouseDownCoordRef = useRef({});
  const buttonsRef = useRef({
    x: "x", redo: "redo", undo: "undo", rectangle: "rectangle",
    circle: "circle", line: "line", pencil: "pencil", color: "color"
  });
  // we have implicit positioning - as colors is an Array -> in order of color palette presentation in the canvas
  const colorsRef = useRef(["black", "red", "green", "blue", "orange"]);
  // x, redo, undo put in buttonCoordRef in useEffects - because rect.width won't become visible before rendering the canvas element
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
  // Undo :
  // [1,2,3,4,5,6,7,8,9,10]
  const undoRef = useRef([]);
  const redoRef = useRef([]);
  const xPressedNoOtherChangesRef = useRef(false);
  const activeUndoRedoChainRef = useRef(false);


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

        Object.keys(whichShapeSelectedRef.current).forEach((key) => {
          if (whichShapeSelectedRef.current[key]) {
            buttonRender(contextRef.current, rect, buttonsImgDataRef.current, { select: true },
              colorPaletteImgDataRef.current, colorsRef.current[0], key);
          }
        })
        buttonIsWhiteRef.current = false;
      }

      if (colorPaletteIsOnRef.current) {
        // when you go outside the canvas, then the mouseDownCoordRef is set as {offsetX: -1,offsetY: -1}. So the bottom thing will become null.
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

    // Iam giving coordinates with negatives for the canvas here.
    mouseDownCoordRef.current = { offsetX, offsetY };

    if (nativeEvent.button !== 0) return;

    /// If mouse up, you have to stop any kind of drawing (continuation or anything else) Here, it's false. So you have entry to Draw
    mouseUpRef.current = false; // entry point for any shape drawing on canvas
    ///

    // button highlighting: start
    if (isInsideButtonRegion({ x0: 0, x1: 158, y0: 0, y1: 30 }, { offsetX, offsetY }) ||
      isInsideButtonRegion({ x0: rect.width - 94, x1: rect.width, y0: 0, y1: 30 }, { offsetX, offsetY })) {
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

    // If inside the color palette area when color palette is active
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

    if (whichShapeSelectedRef.current.pencil) {
      /// if pencil is selected
      shapeInitialCoordRef.current = { xOffset: offsetX, yOffset: offsetY, xClient: clientX, yClient: clientY };
      drawDot(contextRef.current, { offsetX, offsetY });
      startPencilDraw(contextRef.current, { offsetX, offsetY });
    }

    if (whichShapeSelectedRef.current.rectangle || whichShapeSelectedRef.current.circle || whichShapeSelectedRef.current.line) {
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

    if (nativeEvent.button !== 0) return;


    // If mouse up, you have to stop any kind of drawing (continuation or anything else) - set isDrawingRef = false in MouseMove
    // The below two lines are given in the window's mouseup eventhandler function; So don't need them in the canvas - redundant
    // mouseUpRef.current = true;
    // isDrawingRef.current = mouseUpRef.current ? false : true;

    // cut the previous path when you do mouseup for pencil (Otherwise the cleared paths will get displayed)
    if (whichShapeSelectedRef.current.pencil) { contextRef.current.beginPath(); }
    //

    // Capture dots in the undo array when you mouseDown inside the drawable canvas
    // -( dots are pushed only if you didn't draw a pencil curve in continuation)
    if (!isDrawingRef.current && whichShapeSelectedRef.current.pencil) {

      if (!((!colorPaletteIsOnRef.current && (!isInsideButtonRegion({ x0: 158, x1: rect.width - 94, y0: 0, y1: 30 },
        { offsetX: mouseDownCoordRef.current.offsetX, offsetY: mouseDownCoordRef.current.offsetY }) &&
        !isInsideButtonRegion({ x0: 0, x1: rect.width, y0: 30, y1: rect.height },
          { offsetX: mouseDownCoordRef.current.offsetX, offsetY: mouseDownCoordRef.current.offsetY }))) ||
        (colorPaletteIsOnRef.current && (!isInsideButtonRegion({ x0: 278, x1: rect.width - 94, y0: 0, y1: 30 },
          { offsetX: mouseDownCoordRef.current.offsetX, offsetY: mouseDownCoordRef.current.offsetY }) &&
          !isInsideButtonRegion({ x0: 0, x1: rect.width, y0: 30, y1: rect.height },
            { offsetX: mouseDownCoordRef.current.offsetX, offsetY: mouseDownCoordRef.current.offsetY }))))) {

        if (activeUndoRedoChainRef.current) {
          redoRef.current.length = 0;
          activeUndoRedoChainRef.current = false;
        }
        undoRef.current.push(copyDrawableCanvas(contextRef.current, rect));
        xPressedNoOtherChangesRef.current = false;
        console.log(undoRef.current);
      }
    }

    if (buttonIsWhiteRef.current) {
      //ie; if the onMouseUp is done on the button without leaving the button after onMouseDown on that button (ie; Button is White on mouseup)

      for (let button in buttonsRef.current) {
        if (isInsideButtonRegion({
          x0: buttonCoordRef.current[button].x0, x1: buttonCoordRef.current[button].x1,
          y0: buttonCoordRef.current[button].y0, y1: buttonCoordRef.current[button].y1
        }, { offsetX, offsetY })) {

          if (button === "x") {
            clearCanvas(contextRef.current, rect);

            if (undoRef.current.length && !xPressedNoOtherChangesRef.current) {
              console.log(activeUndoRedoChainRef.current);
              if (activeUndoRedoChainRef.current) {
                // compare the previous and the last one of the undo array, then, if they are same, then don't push
                const isSameImgDatas = isEqualImgDatas({ imgData1: undoRef.current.at(-1), imgData2: copyDrawableCanvas(contextRef.current, rect) });
                console.log(isSameImgDatas);
                if (!isSameImgDatas) {
                  undoRef.current.push(copyDrawableCanvas(contextRef.current, rect));
                  console.log(undoRef.current);
                  redoRef.current.length = 0;
                  activeUndoRedoChainRef.current = false;
                }
              } else {
                undoRef.current.push(copyDrawableCanvas(contextRef.current, rect));
                console.log(undoRef.current);
              }
            }

            // To avoid pasteDrawableCanvas happening - when i click X, and click on any shape , the previous drawing comes into display.
            colorPaletteIsOnRef.current = false;
            xPressedNoOtherChangesRef.current = true;
          }


          //
          // Rerender the buttons which are unselected to normal mode. ie; Render all buttons in normal mode
          buttonRender(contextRef.current, rect, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);

          // Setting state on what is to be drawn

          if (button === "rectangle" || button === "pencil" || button === "circle" || button === "line") {
            Object.keys(whichShapeSelectedRef.current).forEach((key) => {
              whichShapeSelectedRef.current[key] = (key === button); // turning all others false and turning on the active button
            })
            if (colorPaletteIsOnRef.current) {
              pasteDrawableCanvas(contextRef.current, imgDataRef.current);
              colorPaletteIsOnRef.current = false;
            }
          } else if (button === "color") {
            // don't lightgrey the selected whichShapeSelectedRef buttons. let it be there.

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

          // The below code is put below others because, "undo" have to pasteDrawableCanvas by overwriting others above if any ( Nothing of that
          // is there above right now)

          //UndoRedo chain is activated-when you press undo button. It deactivates when :1) redo has reached it's end (no items in redo array)
          //2) When you push to the undoRef stack (when you draw something or dot) except when redoing
          //3) Initially, When there is nothing in the undoRef stack. ie; You didn't draw anything on canvas initially
          if (button === "undo") {
            const currentContent = undoRef.current.pop();
            xPressedNoOtherChangesRef.current = false;

            if (currentContent) {
              // if there is something in the undo array and i pressed undo button, then make the Undo-Redo chain Active
              activeUndoRedoChainRef.current = true;
              redoRef.current.push(currentContent);

              if (undoRef.current.length) {
                pasteDrawableCanvas(contextRef.current, undoRef.current.at(-1));
              } else {
                clearCanvas(contextRef.current, rect);
                colorPaletteIsOnRef.current = false;
              }
            } else {
              if (colorPaletteIsOnRef.current) {
                clearCanvas(contextRef.current, rect);
                colorPaletteIsOnRef.current = false;
              }
            }
          }

          // NOTE : 
          // if you draw something, then press X, then undo, then redo, then press X again, then you will not have 2 stacked blank pages
          // The System of Undo - Redo works perfectly right now.
          if (button === "redo") {

            if (redoRef.current.length) {
              xPressedNoOtherChangesRef.current = false;
              const currentContent = redoRef.current.pop();


              undoRef.current.push(currentContent);
              pasteDrawableCanvas(contextRef.current, currentContent);

            }
          }

          /// Changing background color of selected button's button ((removed "color" button from whichShapeSelectedRef -because it's "select" &
          // "highlight"(when palette is on) is handled by color palette. (highlight when colorPalette is off - is handled by color in buttonsRef)
          //by colorPalette))
          Object.keys(whichShapeSelectedRef.current).forEach((key) => {
            if (whichShapeSelectedRef.current[key]) {
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

      Object.keys(whichShapeSelectedRef.current).forEach((key) => {
        if (whichShapeSelectedRef.current[key]) {
          buttonRender(contextRef.current, rect, buttonsImgDataRef.current, { select: true },
            colorPaletteImgDataRef.current, colorsRef.current[0], key);
        }
      })
      buttonIsWhiteRef.current = false;
    }

    if (colorPaletteIsOnRef.current) {
      colorPaletteRender(contextRef.current, colorsRef.current, colorPaletteCoords, colorPaletteImgDataRef.current);
    }

    //  We don't want any mouseDowns outside the canvas to affect the undo array pushes -
    // when you do mouseUp in canvas just after mouseDown outside the canvas. So we set mouseDownCoords to (-1,-1) 
    // when you leave canvas
    mouseDownCoordRef.current = { offsetX: -1, offsetY: -1 };
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
    buttonCoordRef.current["redo"] = { x0: rect.width - 62, x1: rect.width - 32, y0: 0, y1: 30 }
    buttonCoordRef.current["undo"] = { x0: rect.width - 94, x1: rect.width - 64, y0: 0, y1: 30 }


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
      if (isDrawingRef.current) {// works only for 1 mouse up outside the canvas

        if (activeUndoRedoChainRef.current) {
          redoRef.current.length = 0;
          activeUndoRedoChainRef.current = false;
        }

        undoRef.current.push(copyDrawableCanvas(contextRef.current, rect));
        xPressedNoOtherChangesRef.current = false;
        console.log(undoRef.current);
      }

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

        if (whichShapeSelectedRef.current.pencil) { /// by default, pencil is true
          /// for pencil === true
          drawPencil(contextRef.current, { clientX: e.clientX, clientY: e.clientY }, shapeInitialCoordRef.current);
        }

        if (whichShapeSelectedRef.current.rectangle) {
          /// for rectangle === true /// getImageData is done on MouseDown
          //The pasteDrawableCanvas is for not rendering many rectangles
          pasteDrawableCanvas(contextRef.current, imgDataRef.current);
          drawRectangle(contextRef.current, { clientX: e.clientX, clientY: e.clientY }, shapeInitialCoordRef.current);
        }

        if (whichShapeSelectedRef.current.circle) {
          pasteDrawableCanvas(contextRef.current, imgDataRef.current);
          drawCircle(contextRef.current, { clientX: e.clientX, clientY: e.clientY }, shapeInitialCoordRef.current);
        }

        if (whichShapeSelectedRef.current.line) {
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
        Object.keys(whichShapeSelectedRef.current).forEach((key) => {
          if (whichShapeSelectedRef.current[key]) {
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
      window.removeEventListener("mousemove", handleMouseMoveWindow)
    }
  }, [])

  // onMouseMove is a mine
  return <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseLeave} />
}
