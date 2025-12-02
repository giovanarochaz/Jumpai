
import { ContainerDesktop, ContainerMobile } from './estilos/app.estilos';
import TelaDeAvisoMobile from './pages/avisoMobile';
import { Outlet } from 'react-router-dom';
import CameraFlutuante from './componentes/CameraFlutuante';


function App() {
  return (
    <>
      <ContainerDesktop>
        <CameraFlutuante />
        <Outlet />
      </ContainerDesktop>
      <ContainerMobile>
        <TelaDeAvisoMobile />
      </ContainerMobile>
    </>
  );
}

export default App;