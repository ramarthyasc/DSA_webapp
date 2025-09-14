import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';


function Drawboard() {
  const user = useOutletContext();


  return (
    <>
      <h1>Welcome to Algogame {user && `${user.name}`}</h1>
      <Link to='/'>Home</Link>
    </>


  )
}

export default Drawboard;
