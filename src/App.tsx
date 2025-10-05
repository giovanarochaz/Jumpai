
import { ContainerDesktop, ContainerMobile } from './estilos/app.estilos';
import TelaDeAvisoMobile from './pages/avisoMobile';
import { Outlet } from 'react-router-dom';
import IluminacaoGlobal from './componentes/IluminacaoGlobal';
import CameraFlutuante from './componentes/CameraFlutuante';


function App() {
  return (
    <>
      <ContainerDesktop>
        <IluminacaoGlobal />
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