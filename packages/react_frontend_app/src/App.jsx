import Home from './pages/Home.jsx';
import Drawboard from './pages/drawboard.jsx';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <nav>Navbar component here </nav>
      <Outlet />
    </>
  )
}

export default App;
