import Home from './pages/Home.jsx'
import Drawboard from './pages/drawboard.jsx';
import App from './App.jsx'

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> }, //index: true - means it takes the same path as parent App component
      { path: "drawboard", element: <Drawboard /> },
    ]
  },
]

export default routes;
