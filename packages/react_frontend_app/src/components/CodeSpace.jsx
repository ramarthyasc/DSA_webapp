import "../styles/CodeSpace.css";

export function CodeSpace() {
  return (
    // implement uneditable numbers along the left side +
    // backend verification
    <form id="code-form" action="/draw-submit" method="POST">
      <textarea name="coding" id="coding" ></textarea>
      <button type="submit"> Run </button>
    </form>
  )
}
