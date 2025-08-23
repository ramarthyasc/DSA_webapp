import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import './App2.css'
import Drawboard from './drawboard.jsx'




function App() {

  const [algogame, setAlgogame] = useState([]);
  //State for switching between pages
  const [nextpage, setNextpage] = useState(0);

  // 2 Render pass happens here. useEffect is called after Rendering the null array as initial state. useEffect have set function called -
  // which queues the state change- due to which,
  // the App function called again, causes 2nd render (In the 2nd pass of the function only, is the state changed).
  useEffect(() => {
    const setNewData = async () => {
      let res;

      try {
        res = await fetch("/algogame/1");
        if (!res.ok) {
          throw new Error(`Response status: ${res.status})`)
        }
      } catch (err) {
        console.error(err.message);
      }

      try {
        const algogame1 = await res.json();
        setAlgogame(algogame1);

      } catch (err) {
        console.log(`json error: ${err.message}`)
      }
    }
    setNewData();

  }, [])

  //This handles the path for both the Parent (this component) and the child component respectively - look at the  History Stack -
  //where the stack pointer moves whenever there is a history.pushState
  useEffect(() => {

    if (nextpage === 0) {
      //push a path for this page and give a state property ie; 0 for this page ->  after Real DOM creation.
      history.replaceState(nextpage, "", document.location.href);
    } else if (nextpage === 1) {
      history.pushState(nextpage, "", "/1");
      console.log("Hello")
    }


    function handlePop(event) {
      setNextpage(event.state);
    }

    //add the event handler function to registry. 
    window.addEventListener("popstate", handlePop);

    //cleanup function
    return () => {
      window.removeEventListener("popstate", handlePop);
    }

  });


  //Handling the Click event.
  async function changeState(id) {
    const res = await fetch(`/algogame/${id}`);
    const algogame = await res.json();

    setAlgogame(algogame);
  }




  if (nextpage === 1) {
    return (
      < Drawboard nextpage={nextpage} />
    )
  }

  function handleTableClick() {
    setNextpage(1);
  }


  return (
    <div>
      <button onClick={() => changeState(1)}>1</button>
      <button onClick={() => changeState(2)}>2</button>
      <div>
        <table>
          <thead>
            <tr>
              <th id="width">Game</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {/* for each object in a list/array, we map it to a component(ie; an html integrated with the object). For each component, we give a key. */}
            {algogame.map(gameDetail => <GameDetail key={gameDetail.game} game={gameDetail.game} difficulty={gameDetail.difficulty} onClick={handleTableClick} />)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

//a game description component
function GameDetail(props) {
  const game = props.game;
  const difficulty = props.difficulty;
  return (
    <tr onClick={props.onClick}>
      <td>{game}</td>
      <td>{difficulty}</td>
    </tr>
  )
}


export default App;
