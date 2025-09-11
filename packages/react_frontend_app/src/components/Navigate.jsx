import '../styles/Navigate.css';
import Signin from './Signin.jsx';
import Userin from './Userin.jsx';

function Navigate({ setIsLoggedIn, isLoggedIn, setJsonWebToken, setUser, user }) {



  let render;
  if (!isLoggedIn) {
    render = <Signin setIsLoggedIn={setIsLoggedIn} setJsonWebToken={setJsonWebToken} setUser={setUser} />
  } else {
    render = <Userin setIsLoggedIn={setIsLoggedIn} setJsonWebToken={setJsonWebToken} setUser={setUser} user={user} />
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
