import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import JwtFetcher from './utils/JwtFetcher.jsx';
import './styles/App.css'
import { useState } from 'react';
import { QuestionContext } from './context/QuestionContext.jsx';

function App() {
  console.log("App")

  // Check if the session has jwt. If no, then render Signin component.
  // If yes, then access the route with the jwt to get new JWT, and render NAV bar with signin/ with profile pic.

  // Helper State : 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Secure State:
  const [jsonWebToken, setJsonWebToken] = useState(null);

  // Display State : 
  const [user, setUser] = useState(null);

  const [isCoding, setIsCoding] = useState(false);

  return (
    <JwtFetcher setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} jsonWebToken={jsonWebToken} setJsonWebToken={setJsonWebToken} setUser={setUser}>
      <div className='app'>
        <Navbar setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} setJsonWebToken={setJsonWebToken} setUser={setUser} user={user} />
        <QuestionContext.Provider value={{ isCoding, setIsCoding }} >
          {/* Outlet is Authorization Protected only if isLoggedIn == true (That we did in JwtFetcher). Otherwise, you are free to explore both pages. */}
          <Outlet context={[isLoggedIn, setIsLoggedIn, jsonWebToken, setJsonWebToken, setUser, user]} />
          {/* In the Outlet, we have JwtAuthorizedRoute utils component, and it's Outlet = Pages : Home & Drawboard & CodeSpace*/}
        </QuestionContext.Provider>
      </div>
    </JwtFetcher>
  )
}

export default App;
