import styled, { keyframes, css } from 'styled-components';

const shake = keyframes`
  0% { transform: translate(0, 0); }
  20% { transform: translate(-3px, 0); }
  40% { transform: translate(3px, 0); }
  60% { transform: translate(-3px, 0); }
  80% { transform: translate(3px, 0); }
  100% { transform: translate(0, 0); }
`;

const fadeOut = keyframes`
  0% { opacity: 1; filter: brightness(1); }
  100% { opacity: 0; filter: brightness(1.5); }
`;

export const ContainerAtelie = styled.div`
  /* 1. Ocupa a tela toda */
  width: 100vw;
  height: 100vh;
  
  /* 2. Sobe para trás do menu, anulando o padding de 110px do pai */
  margin-top: -110px; 
  
  /* 3. Empurra o Título e os Quadros de volta para o lugar certo */
  padding-top: 110px; 
  
  background: #FFF8E1; /* Cor da Parede */
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  overflow: hidden;
  position: relative;

  &::after {
    /* Chão de madeira */
    content: ''; 
    position: absolute; 
    bottom: 0; 
    width: 100%; 
    height: 32%;
    background: repeating-linear-gradient(90deg, #A0522D 0, #A0522D 2px, #D2691E 2px, #D2691E 60px);
    box-shadow: inset 0 20px 40px rgba(0,0,0,0.2); 
    z-index: 0;
  }
`;

export const TituloFase = styled.h2`
  /* Ajuste a margem para não ficar colado no Menu */
  margin-top: 20px; 
  margin-bottom: 10px;
  
  padding: 10px 40px; 
  background: white; 
  z-index: 10;
  border: 4px solid #8B4513; 
  border-radius: 50px; 
  color: #8B4513;
  text-transform: uppercase; 
  box-shadow: 0 4px 0 rgba(0,0,0,0.1);
  font-size: clamp(1rem, 2vw, 1.3rem);
  position: relative;
`;

export const AreaCavaletes = styled.div`
  display: flex; 
  gap: 4vw; 
  flex: 1; 
  z-index: 5; 
  align-items: center;
  /* Garante que os quadros fiquem bem distribuídos */
  margin-bottom: 60px; 
`;

export const CavaleteContainer = styled.div`
  width: 38vw; height: 55vh; background: #DEB887; border: 4px solid #8B4513;
  border-radius: 8px; display: flex; flex-direction: column; align-items: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2); position: relative;
`;

export const Quadro = styled.div`
  width: 90%; height: 85%; background: white; margin-top: 4%;
  border: 4px solid #333; position: relative; overflow: hidden;
`;

export const BarraFerramentas = styled.div`
  position: relative; bottom: 4vh; z-index: 20;
  background: #8B4513; padding: 15px 40px; border-radius: 60px;
  display: flex; gap: 1.5vw; border: 4px solid #DEB887;
`;

export const Tinta = styled.div<{ $cor: string; $selecionada: boolean; $podeClicar: boolean }>`
  width: clamp(45px, 7.5vh, 75px); height: clamp(45px, 7.5vh, 75px);
  border-radius: 50%; background: ${props => props.$cor};
  border: 4px solid white; transition: all 0.2s;
  cursor: ${props => props.$podeClicar ? 'pointer' : 'default'};
  ${props => props.$selecionada && css`
    transform: scale(1.3) translateY(-12px);
    border-color: #FACC15; box-shadow: 0 10px 20px rgba(0,0,0,0.4);
  `}
`;

export const SvgContainer = styled.svg`
  width: 100%; height: 100%;
  .limpando {
    animation: ${shake} 0.3s ease-in-out, ${fadeOut} 0.8s ease-out forwards;
    pointer-events: none;
  }
`;

export const OverlayStart = styled.div`
  position: absolute; /* Mude de fixed para absolute */
  inset: 0; 
  z-index: 90; 
  background: rgba(0,0,0,0.7);
  display: flex; 
  justify-content: center; 
  align-items: center; 
  color: white;
  font-size: 2rem; 
  font-weight: 900; 
  text-align: center; 
  text-shadow: 0 4px 10px black;
  padding: 20px;
`;
