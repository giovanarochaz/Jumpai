import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { GlobalStyle } from './styles/global';

import Controle from './pages/controle';
import Jogo from './pages/jogo';
import Dificuldade from './pages/dificuldade';
import SistemaSolar from './jogos/sistemaSolar/app';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [
      {
        path: '/', 
        element: <Controle />,
      },
      {
        path: '/jogos/:controle',
        element: <Jogo />,
      },
      {
        path: '/dificuldade', 
        element: <Dificuldade />,
      },
      {
        path: '/sistemaSolar', 
        element: <SistemaSolar />,
      },


    ],
  },
]);

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <GlobalStyle />
    <RouterProvider router={router} />
  </StrictMode>,
);