import { useEffect, useState, useRef, forwardRef } from "react";
import { HorizVertSlider } from "./HorizVertSlider.jsx";
import { ResultBox } from "./ResultBox.jsx";

// store scrollHeight as localStorage, so that the Height is always there even when changing pages and unmounted


export const CodeSpace = forwardRef((props, codespaceRef) => {
  const textAreaRef = useRef(null);
  const numberAreaRef = useRef(null);
  const pastScrollHeightRef = useRef();
  const maxLineNumberRef = useRef();
  const [result, setResult] = useState();
  const resultBoxRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formDataObject = Object.fromEntries(formData.entries());
    const res = fetch("/draw-submit", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formDataObject),
    })

    res
      .then((res) => {
        // res.json is res.text + JSON.parse().
        // res.text is the promise in which it internally receives buffer streams from the server, and then it concats it, parses to a string,
        // then sends the resolve
        // ie; the concated string parsed version.
        return res.text();
      })
      .then((text) => {
        setResult(text);
      })
      .catch((error) => {
        console.error(error);
      })

  }

  function handleScroll(e) {
    numberAreaRef.current.scrollTop = e.target.scrollTop;

    const computedStyle = window.getComputedStyle(textAreaRef.current);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    const scrollDiff = textAreaRef.current.scrollHeight - pastScrollHeightRef.current;
    const maxScrollHeight = lineHeight * maxLineNumberRef.current; //maxLineNumber = 300 initially


    if (scrollDiff > 0 && textAreaRef.current.scrollHeight > maxScrollHeight) {
      maxLineNumberRef.current += 1;
      // when i press enter, i only move one line height downwards at a time - so don't need a loop
      numberAreaRef.current.value += "\n" + maxLineNumberRef.current;
    }

    pastScrollHeightRef.current = Math.max(pastScrollHeightRef.current, e.target.scrollHeight);
  }

  useEffect(() => {
    if (textAreaRef.current) {

      // When we full zoomout the browser, it accomodates less than 300 numbers. So we can put 300 as the maximum number.

      maxLineNumberRef.current = 300;
      numberAreaRef.current.value = "";
      for (let i = 0; i <= maxLineNumberRef.current; i++) {
        if (i === maxLineNumberRef.current) {
          numberAreaRef.current.value += i;
          break;
        }
        numberAreaRef.current.value += i + "\n";
      }
    }

    pastScrollHeightRef.current = textAreaRef.current.scrollHeight;

    // numbers showing when scrolling - control the scrolling of numberArea programmatically when i scroll the text area = concept
  }, [])



  return (
    // implement uneditable numbers along the left side +
    // backend verification
    <div ref={codespaceRef} className="flex flex-col outline-1 outline-green-400 font-(family-name:--jet-brains) ">
      {/* change language */}
      <div className="text-left ">
        <select name="language" id="drop" className="border border-black hover:cursor-pointer">
          <option value="js" className="hover:cursor-pointer">Javascript</option>
          <option value="c" className="hover:cursor-pointer">C</option>
        </select>
      </div>
      <form className="flex flex-col flex-2" id="code-form" onSubmit={handleSubmit}>

        <div className="flex flex-2">
          <textarea ref={numberAreaRef} disabled id="row-number" className=" text-right border border-black w-10 
          overflow-hidden resize-none pt-3" cols="1" >
          </textarea>
          <textarea ref={textAreaRef} onScroll={handleScroll} className="flex-2 border border-black resize-none pl-3 pt-3 "
            cols="130" name="code" id="code" ></textarea>
        </div>
        <HorizVertSlider resultBoxRef={resultBoxRef} />
        <ResultBox ref={resultBoxRef} result={result} />
        <button className="px-5 text-blue-700 border rounded " type="submit" >run</button>
      </form>
    </div>
  )
});

