import '../styles/Navigate.css';
import Signin from './Signin.jsx';
import { useEffect, useState } from 'react';

function Navigate() {

  // Check if the session has jwt. If no, then render Signin component.
  // If yes, then access the route with the jwt to get new JWT, and render NAV bar with signin/ with profile pic.
  const { isLoggedIn, setIsLoggedIn } = useState(false);
  const { jsonWebToken, setJsonWebToken } = useState(null);



  let render;
  if (!isLoggedIn) {
    render = <Signin setisloggedin={setIsLoggedIn} setJsonWebToken={setJsonWebToken} />
  } else {
    render = <Userbar isloggedin={isLoggedIn} setisloggedin={setIsLoggedIn} />
  }
  return (
    <div>
      <nav className='nav'>
        {render}
      </nav>
    </div>

  )
}

export default Navigate;
