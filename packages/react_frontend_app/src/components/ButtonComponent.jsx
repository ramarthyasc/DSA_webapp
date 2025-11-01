import { useId, useRef } from "react"
import "../styles/ButtonComponent.css"

export function ButtonComponent(props) {

  const buttonId = useId();
  const mouseDownRef = useRef(false);
  const buttonSelectedRef = useRef(false);

  function handleMouseDown() {
    window.getSelection().removeAllRanges();
    mouseDownRef.current = true;
    document.getElementById(buttonId).className = "button-general button-highlight";
    props.buttonSpecial && document.getElementById(buttonId).classList.add(props.buttonSpecial); // for code-Button

  }
  function handleMouseUp() {
    if (props.buttonName === "Question") {
      // change the question component using a state
      // turn all other selected buttons to normal

    } else if (props.buttonName === "Solution") {
      //...
      // turn all other selected buttons to normal
    } else if (props.buttonSpecial === "codeSpace") {
      // turn all other selected buttons to normal

    }
    if (mouseDownRef.current) {
      if (buttonSelectedRef.current) {
        document.getElementById(buttonId).className = "button-general button-normal";
        props.buttonSpecial && document.getElementById(buttonId).classList.add(props.buttonSpecial); // for code-Button
        buttonSelectedRef.current = false;
      } else {
        document.getElementById(buttonId).className = "button-general button-select";
        props.buttonSpecial && document.getElementById(buttonId).classList.add(props.buttonSpecial); // for code-Button
        buttonSelectedRef.current = true;
      }
      mouseDownRef.current = false;
    }
  }

  function handleMouseLeave() {
    if (mouseDownRef.current) {
      mouseDownRef.current = false;
    }

    if (!buttonSelectedRef.current) {
      document.getElementById(buttonId).className = "button-general button-normal";
      props.buttonSpecial && document.getElementById(buttonId).classList.add(props.buttonSpecial); // for code-Button
    } else {
      document.getElementById(buttonId).className = "button-general button-select";
      props.buttonSpecial && document.getElementById(buttonId).classList.add(props.buttonSpecial); // for code-Button
    }
  }

  return (
    <div id={buttonId} className={"button-general " + (props.buttonSpecial ? "button-normal " + props.buttonSpecial : "button-normal")}
      onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp}>{props.buttonName}</div>

  )
}
