import { ContainerDesktop, ContainerMobile } from './estilos/app.estilos';
import TelaDeAvisoMobile from './pages/avisoMobile';
import { Outlet } from 'react-router-dom';
import IluminacaoGlobal from './componentes/IluminacaoGlobal';

function App() {
  return (
    <>
      <IluminacaoGlobal />
      <ContainerDesktop>
        <Outlet /> 
      </ContainerDesktop>
      <ContainerMobile>
        <TelaDeAvisoMobile />
      </ContainerMobile>
    </>
  );
}

export default App;