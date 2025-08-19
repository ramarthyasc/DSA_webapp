import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

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
        <GamesList algogame={algogame} />
      </div>
    </div>
  )
}

function GamesList({ algogame }) {
  return (
    <table>
      {
        algogame.map(content =>
        (
          <tr key={content.game}>
            <td>{content.game}</td>
            <td>{content.difficulty}</td>
          </tr>
        )
        )
      }
    </table>
  )
}


export default App
