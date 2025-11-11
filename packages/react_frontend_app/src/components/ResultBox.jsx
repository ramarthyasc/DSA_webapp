import { forwardRef } from "react";

export const ResultBox = forwardRef((props, resultBoxRef) => {

  return (
    <div ref={resultBoxRef} id="resultbox" className="h-81">
      {props.result || ""}
    </div>
  )
})
