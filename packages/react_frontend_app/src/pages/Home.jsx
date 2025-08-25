import { useState, useEffect } from 'react';
import '../styles/Home.css';
import GameDetail from '../components/GameDetail';




function Home() {

  const [algogame, setAlgogame] = useState([]);

  // 2 Render pass happens here. useEffect is called after Rendering the null array as initial state. useEffect have set function called -
  // which queues the state change- due to which,
  // the App function called again, causes 2nd render (In the 2nd pass of the function only, is the state changed).
  useEffect(() => {
    const newData = async () => {
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
    newData();

  }, [])

  //Handling the Click event.
  async function changeState(id) {
    const res = await fetch(`/algogame/${id}`);
    const algogame = await res.json();

    setAlgogame(algogame);
  }



  return (
    <div className='home'>
      <button onClick={() => changeState(1)}>1</button>
      <button onClick={() => changeState(2)}>2</button>
      <div className='table-container'>
        <table className='table'>
          <thead>
            <tr>
              <th id="width">Game</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {/* for each object in a list/array, we map it to a component(ie; an html integrated with the object). For each component, we give a key. */}
            {algogame.map(gameDetail => <GameDetail key={gameDetail.game} game={gameDetail.game} difficulty={gameDetail.difficulty} />)}
          </tbody>
        </table>
      </div>
    </div>
  )
}



export default Home;
