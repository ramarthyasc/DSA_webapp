import '../styles/Navigate.css';
import Signin from './Signin.jsx';
import Userin from './Userin.jsx';
import { useEffect, useState } from 'react';

function Navigate() {

  // Check if the session has jwt. If no, then render Signin component.
  // If yes, then access the route with the jwt to get new JWT, and render NAV bar with signin/ with profile pic.

  // Helper State : 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jsonWebToken, setJsonWebToken] = useState(null);

  // Display State : 
  const [user, setUser] = useState(null);


  let render;
  if (!isLoggedIn) {
    render = <Signin setIsLoggedIn={setIsLoggedIn} setJsonWebToken={setJsonWebToken} setUser={setUser} />
  } else {
    render = <Userin setIsLoggedIn={setIsLoggedIn} user={user} />
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
