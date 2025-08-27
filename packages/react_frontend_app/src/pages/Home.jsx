import { useState, useEffect } from 'react';
import '../styles/Home.css';
import GameDetail from '../components/GameDetail';
import { Link } from 'react-router-dom';




function Home() {

  // const [algogame, setAlgogame] = useState([]);

  // 2 Render pass happens here. useEffect is called after Rendering the null array as initial state. useEffect have set function called -
  // which queues the state change- due to which,
  // the App function called again, causes 2nd render (In the 2nd pass of the function only, is the state changed).
  // useEffect(() => {
  //   const newData = async () => {
  //     let res;
  //
  //     try {
  //       res = await fetch("/algogame/1");
  //       if (!res.ok) {
  //         throw new Error(`Response status: ${res.status})`)
  //       }
  //     } catch (err) {
  //       console.error(err.message);
  //     }
  //     try {
  //       const algogame1 = await res.json();
  //       setAlgogame(algogame1);
  //
  //     } catch (err) {
  //       console.log(`json error: ${err.message}`)
  //     }
  //   }
  //   newData();
  //
  // }, [])
  //
  // //Handling the Click event.
  // async function changeState(id) {
  //   const res = await fetch(`/algogame/${id}`);
  //   const algogame = await res.json();
  //
  //   setAlgogame(algogame);
  // }
  //


  return (
    <div className='home'>
      <div className='container'>
        <div className='text'>
          <h1>Draw & Solve</h1>
          <p>Solve algorithms with drawing pad, then code</p>
        </div>
        <div className='play'>
          <Link to="/drawboard">
            <button >Play</button>
          </Link>
        </div>
      </div>

      <div className='design'></div>

    </div>
  )
}



export default Home;
