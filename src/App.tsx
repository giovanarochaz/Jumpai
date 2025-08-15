import { ContainerDesktop, ContainerMobile } from './styles/app.styles';
import TelaDeAvisoMobile from './pages/avisoMobile';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
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