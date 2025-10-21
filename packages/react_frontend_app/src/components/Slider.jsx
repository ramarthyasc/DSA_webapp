import { useEffect, useRef } from "react";
import "../styles/Slider.css";

function Slider(props) {
  const onSliderRef = useRef(false)
  const mouseDownCoordSliderRef = useRef([]);
  const widthRef = useRef(null);
  const pendingRef = useRef(false);

  function handleMouseDown({ nativeEvent }) {
    const { clientX, clientY } = nativeEvent;
    onSliderRef.current = true;
    mouseDownCoordSliderRef.current = [clientX, clientY];
  }

  useEffect(() => {
    const canvas = props.canvasRef.current;
    // we use getComputedStyle to get style instead of using canvas.style- bcs, canvas.style only works if the DOM element has inline styles,
    // not if it has external stylesheet. getComputedStyle gives us Realtime computed Style ie; width or height of the realtime canvas
    const style = getComputedStyle(canvas);
    // We only need the initial style.width. 
    widthRef.current = parseFloat(style.width);
    document.body.style.userSelect = "none"; // don't allow to select text - which can allow dragging of text. Which will interfere with resizing
    // of canvas when i select text and then try to drag the slider, instead of the slider, the text is moved/dragged 


    function handleWindowMouseUp() {
      const canvas = props.canvasRef.current;
      const style = getComputedStyle(canvas);

      onSliderRef.current = false;
      widthRef.current = parseFloat(style.width); //Update the canvas width after stopping the resizing
    }

    function handleWindowMouseMove(e) {
      if (!pendingRef.current) {

        pendingRef.current = true;
        requestAnimationFrame(() => {
          if (onSliderRef.current) {
            const { clientX } = e;
            const canvas = props.canvasRef.current;
            // we use getComputedStyle to get style instead of using canvas.style- bcs, canvas.style only works if the DOM element has inline styles,
            // not if it has external stylesheet
            const style = getComputedStyle(canvas);

            if (parseFloat(style.width) < 410) {
              if (clientX - mouseDownCoordSliderRef.current[0] <= 0) {
                // resize the canvas element in the direction of mouse movement
                canvas.style.width = (widthRef.current - (clientX - mouseDownCoordSliderRef.current[0])) + "px";
                props.setCanvasEdgeMotionCoord(e.clientX);
              } else {
                onSliderRef.current = false;
              }
            } else {
              // resize the canvas element in the direction of mouse movement
              canvas.style.width = (widthRef.current - (clientX - mouseDownCoordSliderRef.current[0])) + "px";
              props.setCanvasEdgeMotionCoord(e.clientX);
            }
          }

          pendingRef.current = false;

        });


      }

    }


    window.addEventListener("mouseup", handleWindowMouseUp);
    window.addEventListener("mousemove", handleWindowMouseMove);

    return () => {
      window.removeEventListener("mouseup", handleWindowMouseUp);
      window.removeEventListener("mousemove", handleWindowMouseMove);
      document.body.style.userSelect = "";
    }

  }, [])

  return (
    <div className="handler" onMouseDown={handleMouseDown} ></div>
  )
}

export default Slider;
