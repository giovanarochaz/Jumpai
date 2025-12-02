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
    padding: 0 1rem;
  }
`;

export const NavLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${CORES.roxoPrincipal};
  font-weight: 900;
  font-size: 1.5rem;
  cursor: pointer;
  
  span {
    @media (max-width: 400px) {
      display: none; 
    }
  }
`;

export const NavMenu = styled.div`
  display: flex;
  gap: 10px;
`;

export const NavItem = styled.div`
  background: transparent;
  display: flex;
  align-items: center;
  gap: 8px;
  
  font-family: inherit;
  font-weight: 600;
  color: ${CORES.preto};
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9rem;

  span {
    display: none;
    @media (min-width: 500px) {
      display: block;
    }
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
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const GameTitle = styled.h1`
  position: relative;
  font-size: clamp(3rem, 10vw, 5rem);
  font-weight: 900;
  color: ${CORES.amarelo};
  margin: 0;
  letter-spacing: 2px;
  text-shadow: 4px 4px 0px ${CORES.preto};
  
  .decor-icon {
    position: absolute;
    top: -10px;
    right: -30px;
    color: ${CORES.branco};
    animation: ${spin} 4s linear infinite;
  }
`;

export const DescriptionText = styled.p`
  font-size: 1.1rem;
  line-height: 1.4;
  max-width: 400px;
  margin-top: 1rem;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
`;

export const WarningCard = styled.div`
  width: 100%;
  max-width: 380px;
  /* Altura automática para caber o texto */
  min-height: 280px; 
  
  padding: 0;
  
  .card-content {
    width: 100%;
    height: 100%;
    background-color: ${CORES.branco};
    border-radius: 30px;
    padding: 30px 20px;
    
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    
    border: 4px solid ${CORES.preto};
    box-shadow: 10px 10px 0px ${CORES.preto};
    
    animation: ${float} 4s ease-in-out infinite;
  }
`;

export const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  color: ${CORES.preto};

  .arrow {
    font-size: 2rem;
    font-weight: 900;
    color: ${CORES.amarelo};
  }
  
  .mobile-icon {
    opacity: 0.5;
    transform: scale(0.9);
  }

  .monitor-icon {
    filter: drop-shadow(3px 3px 0px rgba(0,0,0,0.2));
  }
`;

export const CardTitle = styled.h2`
  font-size: 2rem;
  font-weight: 900;
  color: ${CORES.preto};
  text-transform: uppercase;
  margin: 0;
`;

export const CardText = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: #4B5563; 
  text-align: center;
  line-height: 1.5;

  strong {
    color: ${CORES.roxoPrincipal};
    font-weight: 800;
  }
`;