import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import './App2.css'

const algogame1 = [
  {
    game: "Catching twin bounty targets",
    difficulty: "Easy"
  },
  {
    game: "Leopard has trapped you in a tree",
    difficulty: "Medium"
  },
  {
    game: "Searching for a key in the Heystack",
    difficulty: "Medium"
  },
]

const algogame2 = [
  {
    game: "Catching twin bounty targets",
    difficulty: "Easy"
  },
  {
    game: "Finding the thief in a large population",
    difficulty: "Easy"
  },
  {
    game: "Running through a Train",
    difficulty: "Easy"
  },
]

function App() {
  const [algogame, setAlgogame] = useState(algogame1);

  return (
    <div>
      <button onClick={() => setAlgogame(algogame => algogame1)}>1</button>
      <button onClick={() => { setAlgogame(algogame => algogame2) }}>2</button>
      <div>
        <table>
          <tr>
            <th id="width">Game</th>
            <th>Difficulty</th>
          </tr>
          {algogame.map(gameDetail => <GamesList game={gameDetail.game} difficulty={gameDetail.difficulty} />)}
        </table>
      </div>
    </div>
  )
}

//a game description component
function GamesList(props) {
  const game = props.game;
  const difficulty = props.difficulty;
  return (
    <tr key={game}>
      <td>{game}</td>
      <td>{difficulty}</td>
    </tr>
  )
}


export default App
