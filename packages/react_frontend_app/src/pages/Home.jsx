import { useOutletContext } from "react-router-dom";
import '../styles/Home.css';
import { Link } from 'react-router-dom';




function Home() {

  const user = useOutletContext();

  return (
    <div className='home'>
      {user && `Hello ! ${user.name}`}
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
