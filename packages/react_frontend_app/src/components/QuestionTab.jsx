import '../styles/QuestionTab.css';
import { useRef, useState, useEffect } from 'react';
import { Question } from '../components/Question.jsx';

export function QuestionTab() {
  const questionsListRef = useRef(null);
  const [question, setQuestion] = useState(null);


  useEffect(() => {
    async function questionFetcher() {
      let res = await fetch("/draw-question", {
        method: "GET",
        credentials: 'include',
      })
      let questionsList;

      if (res.ok) {
        try {
          questionsList = await res.json();
          questionsListRef.current = JSON.parse(questionsList);
        } catch (err) {
          console.log(err);
          return;
        }
      } else {
        console.log("HTTP Status: ", res.status);
        console.log("Status Text: ", res.statusText);
        return;
      }

      res = await fetch(`/draw-question/${questionsListRef.current[0]}`, {
        method: "GET",
        credentials: 'include',
      });

      let question;
      if (res.ok) {
        try {
          question = await res.json();
          setQuestion(JSON.parse(question));
        } catch (err) {
          console.log(err);
          return;
        }
      } else {
        console.log("HTTP Status: ", res.status);
        console.log("Status Text: ", res.statusText);
        return;
      }
    }

    questionFetcher();


  }, []);


  if (!question) {
    return (
      <div className="question">
        loading...
      </div>
    )

  } else {
    return (
      <div className="question">
        {/* <Buttons /> */}
        <Question question={question} />
      </div>
    )
  }
}
