import '../styles/Navbar.css';
import Signin from './Signin.jsx';
import Userin from './Userin.jsx';
import { Link } from 'react-router-dom';
import logo from "../assets/logo.webp";

function Navbar({ setIsLoggedIn, isLoggedIn, setJsonWebToken, setUser, user }) {


  let render;
  if (!isLoggedIn) {
    render = <Signin setIsLoggedIn={setIsLoggedIn} setJsonWebToken={setJsonWebToken} setUser={setUser} />
  } else {
    render = <Userin setIsLoggedIn={setIsLoggedIn} setJsonWebToken={setJsonWebToken} setUser={setUser} user={user} />
  }
  return (


    <div>
      <nav className='nav'>
        <Link to='/'><img src={logo} alt="home" className='logo' /></Link>
        {render}
      </nav>
    </div>

  )
}

export default Navbar;
