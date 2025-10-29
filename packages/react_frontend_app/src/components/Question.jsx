import "../styles/Question.css";

export function Question(props) {
  const question = props.question;
  return (
    <div id="question">
      <h2 id="q-title">{question.title}</h2>
      <p>{question.difficulty}</p>
    </div>
  )
}
