import "../styles/Question.css";

export function Question(props) {
  const question = props.question;
  return (
    <div id="question">
      <h2 id="q-title">{question.title}</h2>
      <p id={question.difficulty.toLowerCase()}>{question.difficulty}</p>
      <br />
      <p className="line" >{question.description}</p>

      {/* Examples */}
      <ul id="examples">
        {Object.keys(question.examples).length !== 0 ? question.examples.map((example) => {
          return (
            <li key={example.id}>
              <h4>{example.title}:</h4>
              <div className="example">
                <p ><span className="io">Input</span>: {example.input}</p>
                <p><span className="io">Output</span>: {example.output}</p>
              </div>
              {example.explanation.length !== 0 ? <p>Explanation: {example.explanation}</p> : <p></p>}
            </li>
          )
        }) : <p></p>}
      </ul>

      <h4>Constraints:</h4>
      <ul id="constraints">
        {/* Constraints */}
        {question.constraints.map((constraint, index) => {
          // here i gave index, because the whole thing will be anyway remounted when i change the question
          return (
            <li key={index}>
              {constraint}
            </li>
          )
        })}
      </ul>

      <br />
      {/* Tips */}
      <ul id="tips">
        {question.tips.map((tip, index) => {
          return (
            <li className="tip" key={index}>
              <details>
                <summary className="tip-title">{tip.title}</summary>
                <p style={{ paddingTop: "10px" }}>{tip.description}</p>
              </details>
            </li>
          )
        })}
      </ul>

    </div>
  )
}
