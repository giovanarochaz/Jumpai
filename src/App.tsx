import { ContainerDesktop, ContainerMobile } from './styles/app.styles';
import TelaDeAvisoMobile from './pages/avisoMobile';
import { Outlet } from 'react-router-dom';
import IluminacaoGlobal from './components/IluminacaoExtra';

function App() {
  return (
    <>
      {/* O componente de iluminação vive aqui, de forma global,
          e aparecerá em qualquer tela quando ativado. */}
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