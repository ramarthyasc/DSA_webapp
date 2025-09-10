import { Outlet } from 'react-router-dom';
import Navigate from './components/Navigate.jsx';
import JwtFetcher from './components/JwtFetcher.jsx';
import './styles/App.css'
import { useState } from 'react';
function App() {

  // Check if the session has jwt. If no, then render Signin component.
  // If yes, then access the route with the jwt to get new JWT, and render NAV bar with signin/ with profile pic.

  // Helper State : 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Secure State:
  const [jsonWebToken, setJsonWebToken] = useState(null);

  // Display State : 
  const [user, setUser] = useState(null);


  return (
    <JwtFetcher setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} setJsonWebToken={setJsonWebToken} setUser={setUser}>
      <div className='app'>
        <Navigate setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} setJsonWebToken={setJsonWebToken} setUser={setUser} user={user} />
        <Outlet />
        {/* In the Outlet, we have Pages : Home & drawboard */}
      </div>
    </JwtFetcher>
  )
}

export default App;
