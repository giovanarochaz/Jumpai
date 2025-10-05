import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { EstiloGlobal } from './estilos/global';

import Controle from './pages/controle';
import Jogo from './pages/jogo';
import Dificuldade from './pages/dificuldade';
import SistemaSolar from './jogos/sistemaSolar/app';
import CalibragemOcular from './pages/calibragem/calibragem';
import CalibragemTeste from './pages/calibragem/teste';

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
      {
        path: '/calibragemOcular',
        element: <CalibragemOcular />,
      },
      {
        path: '/calibragem-teste',
        element: <CalibragemTeste />,
      },
    ],
  },
]);

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <EstiloGlobal />
    <RouterProvider router={router} />
  </StrictMode>
);