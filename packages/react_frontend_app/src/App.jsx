import { Outlet } from 'react-router-dom';
import Navigate from './components/Navigate.jsx';
import './styles/App.css'
function App() {
  return (
    <div className='app'>
      <Navigate />
      <Outlet />
    </div>
  )
}

export default App;
