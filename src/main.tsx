import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { EstiloGlobal } from './estilos/global';

import Controle from './pages/controle';
import SistemaSolar from './jogos/sistemaSolar/app';
import CalibragemOcular from './pages/calibragem/calibragem';
import CalibragemTeste from './pages/calibragem/teste';
import PiramideDoSabor from './jogos/piramideSabor/app';
import SaltoAlfabetico from './jogos/saltoAlfabetico/app';
import SelecaoJogos from './pages/selecaoJogos';
import FestivalDasCores from './jogos/festivalDasCores/app';

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
        path: '/jogos',
        element: <SelecaoJogos />,
      },
      {
        path: '/sistemaSolar', 
        element: <SistemaSolar />,
      },
      {
        path: '/piramideDoSabor', 
        element: <PiramideDoSabor />,
      },
      {
        path: '/saltoAlfabetico', 
        element: <SaltoAlfabetico />,
      },
      {
        path: '/festivalDasCores',
        element: <FestivalDasCores />,
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