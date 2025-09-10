import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './routes.jsx';

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Renders App component in the root - as defined in routes */}
    <RouterProvider router={router} />
  </StrictMode>
)
