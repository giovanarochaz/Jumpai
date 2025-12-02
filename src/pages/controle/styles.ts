import styled, { keyframes } from 'styled-components';

const CORES = {
  roxoPrincipal: '#8B5CF6',
  roxoEscuro: '#6D28D9',
  amarelo: '#FBBF24',
  branco: '#F1F1F1',
  preto: '#111827',
};

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
`;

export const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  
  background: radial-gradient(circle at center, ${CORES.roxoPrincipal} 0%, ${CORES.roxoEscuro} 100%);
  background-image: 
    radial-gradient(circle at center, ${CORES.roxoPrincipal} 0%, ${CORES.roxoEscuro} 100%),
    radial-gradient(${CORES.branco} 1px, transparent 1px);
  background-size: 100% 100%, 40px 40px;
  background-position: center, 0 0;
  
  color: ${CORES.branco};
  overflow-x: hidden;
`;

export const NavBar = styled.header`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 1200px;
  height: 70px;
  background-color: ${CORES.branco};
  border-radius: 50px;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  z-index: 100;

  @media (max-width: 600px) {
    top: 0;
    width: 100%;
    border-radius: 0 0 20px 20px;
  }
`;

export const NavLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${CORES.roxoEscuro};
  font-weight: 900;
  font-size: 1.5rem;
  cursor: pointer;
  
  &:hover { transform: scale(1.05); }
`;

export const NavMenu = styled.div` display: flex; gap: 20px; `;

export const NavItem = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
  font-weight: 600;
  color: ${CORES.preto};
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${CORES.amarelo};
  }
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100px 20px 40px;
  animation: ${fadeIn} 0.8s ease-out;
`;

export const HeaderSection = styled.section`
  text-align: center;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const GameTitle = styled.h1`
  position: relative;
  font-size: clamp(4rem, 8vw, 6rem);
  font-weight: 900;
  color: ${CORES.amarelo};
  margin: 0;
  letter-spacing: 4px;
  text-shadow: 6px 6px 0px ${CORES.preto};
  
  .decor-icon {
    position: absolute;
    top: -10px; right: -40px;
    color: ${CORES.branco};
    animation: ${spin} 4s linear infinite;
  }
`;

export const DescriptionText = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 600px;
  margin-top: 1.5rem;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
`;

export const SubtitleWrapper = styled.div`
  margin-top: 2.5rem;
  background-color: rgba(255,255,255, 0.2);
  padding: 10px 30px;
  border-radius: 50px;
  border: 2px solid ${CORES.branco};
  font-size: 1.4rem;
  font-weight: 700;
  color: ${CORES.branco};
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  animation: ${float} 3s ease-in-out infinite;
`;

export const NavigationSection = styled.div`
  display: flex;
  gap: clamp(1rem, 4vw, 2.5rem);
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
`;

export const SelectionCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  
  width: clamp(250px, 30vw, 320px);
  height: clamp(200px, 20vw, 260px);
  
  background-color: ${CORES.branco};
  border: 4px solid ${CORES.preto};
  border-radius: 20px;
  cursor: pointer;
  
  box-shadow: 6px 6px 0px ${CORES.preto};
  transition: all 0.15s ease-out;
  color: ${CORES.preto}; /* Garante cor do texto preta */

  svg {
    transition: transform 0.2s;
  }

  &:hover {
    background-color: ${CORES.amarelo};
    transform: translate(3px, 3px);
    box-shadow: 3px 3px 0px ${CORES.preto};
    color: ${CORES.preto};
    
    svg {
      transform: scale(1.1);
    }
  }

  &:active {
    transform: translate(6px, 6px); 
    box-shadow: 0px 0px 0px ${CORES.preto};
  }

  @media (max-width: 600px) {
    width: 90%;
    height: 160px;
    flex-direction: row; /* Ajuste para mobile ficar lado a lado ícone/texto */
    gap: 1.5rem;
  }
`;

export const CardText = styled.span`
  font-size: 1.6rem;
  font-weight: 800;
  text-transform: uppercase;
`;

export const CardDescription = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.8;
`;

export const ContainerDaTela = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  padding: clamp(1rem, 4vw, 2rem);
  gap: clamp(1.5rem, 5vw, 3rem);
  background-color: ${CORES.roxoEscuro};
`;

export const BlocoDeDescricao = styled.div`
  max-width: 950px;
  text-align: center;
`;
