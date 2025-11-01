import "../styles/Buttons.css";
import { ButtonComponent } from "./ButtonComponent";

export function Buttons() {
  return (
    <div className="question-buttons">
      <div className="left-buttons">
        <ButtonComponent buttonName="Question" />
        <ButtonComponent buttonName="Solution" />
      </div>
      <div className="code-button">
        <ButtonComponent buttonName="CODE-SPACE ------>" buttonSpecial="code-space" />
        {/* <div>CODE-SPACE ------&gt;</div> */}
      </div>
    </div>
  )
}
