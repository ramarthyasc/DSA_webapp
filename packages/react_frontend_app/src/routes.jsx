import Home from './pages/Home.jsx'
import Drawboard from './pages/Drawboard.jsx';
import App from './App.jsx'
import JwtAuthorizedRoutes from './utils/JwtAuthorizedRoutes.jsx';

//MANAGE ALL YOUR ROUTES HERE : THIS IS THE WHOLE WEBSITE WORKING FLOW :

const routes = [
  // NOTE:  The Parent element always render again (From the root itself) when the user routes to any of it's children (all nested children too).
  // So here, JwtAuthorizedRoutes component runs each time a child path is triggered. So we get secure routes.
  {
    path: "/",
    element: <App />,
    // Children are the things that are presented in the <Outlet/>
    // Children means - The Children prop of the Parent Component. Here, <App />
    children: [
      {
        element: <JwtAuthorizedRoutes />,
        //This Children is the Outlet of <JwtAuthorizedRoutes/> component.
        children: [

          { index: true, element: <Home /> }, //index: true - means it takes the same path as parent App component
          { path: "drawboard", element: <Drawboard /> },

        ]

      }
    ]
  },
]

export default routes;
