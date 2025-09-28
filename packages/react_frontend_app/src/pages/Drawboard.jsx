import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { Canvas } from '../components/Canvas';
import { Question } from '../components/Question';
import '../styles/Drawboard.css';
import { useRef } from 'react';

function Drawboard() {
  const user = useOutletContext();



  return (
    <>
      <div >
        <Link to='/'>Home</Link>
      </div>
      <div className='space'>
        <Question />
        <Canvas />
      </div>
    </>


  )
}

export default Drawboard;
