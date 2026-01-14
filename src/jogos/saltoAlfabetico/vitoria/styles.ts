import styled, { keyframes, css } from 'styled-components';

const TEMA = {
  madeiraClara: '#DEB887',
  madeiraEscura: '#8B4513',
  ouro: '#FBBF24',
  ouroEscuro: '#B45309',
  marromTexto: '#3E2723',
  branco: '#FFFFFF',
  verdeFolha: '#4ADE80'
};

const popIn = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0px ${TEMA.ouro}; }
  50% { transform: scale(1.08); box-shadow: 0 0 20px 8px rgba(251, 191, 36, 0.5); }
  100% { transform: scale(1); box-shadow: 0 0 0 0px ${TEMA.ouro}; }
`;

const particles = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(2.5); opacity: 0; }
`;

export const FundoVitoria = styled.div`
  position: fixed; inset: 0; z-index: 300;
  background-image: url('/assets/saltoAlfabetico/fundo_lagoa.png');
  background-size: cover;
  background-position: center;
  display: flex; justify-content: center; align-items: center;
  overflow: hidden;

  &::before {
    content: ''; position: absolute; inset: 0;
    background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);
  }
`;

export const PlacaVitoria = styled.div`
  position: relative;
  background-color: ${TEMA.madeiraClara};
  background-image: linear-gradient(180deg, ${TEMA.madeiraClara} 0%, ${TEMA.madeiraEscura} 100%);
  border: 8px solid ${TEMA.ouro};
  border-radius: 40px;
  padding: 50px;
  width: 90%; max-width: 600px;
  text-align: center;
  box-shadow: 0 15px 0px ${TEMA.marromTexto}, 0 25px 50px rgba(0,0,0,0.5);
  animation: ${popIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex; flex-direction: column; align-items: center;
`;

export const TituloVitoria = styled.h1`
  font-size: 2.8rem;
  color: ${TEMA.ouro};
  font-weight: 900;
  text-transform: uppercase;
  margin: 15px 0;
  text-shadow: 3px 3px 0px ${TEMA.marromTexto};
`;

export const MensagemVitoria = styled.p`
  font-size: 1.3rem;
  color: ${TEMA.branco};
  margin-bottom: 35px;
  line-height: 1.5;
  background: rgba(0,0,0,0.2);
  padding: 15px;
  border-radius: 15px;
  border: 2px dashed ${TEMA.ouro};
  
  strong { color: ${TEMA.ouro}; font-weight: 900; }
`;

export const IconeContainer = styled.div`
  background: ${TEMA.ouro};
  color: ${TEMA.marromTexto};
  width: 120px; height: 120px;
  border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
  border: 6px solid ${TEMA.branco};
  box-shadow: 0 8px 0 ${TEMA.ouroEscuro};
  margin-bottom: 10px;
`;

export const ContainerBotoes = styled.div`
  display: flex; gap: 20px; justify-content: center;
`;

export const BotaoVitoria = styled.button<{ $isFocused: boolean }>`
  padding: 18px 30px;
  font-size: 1.1rem;
  font-weight: 900;
  border-radius: 20px;
  border: 4px solid ${TEMA.marromTexto};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
  background: ${TEMA.madeiraEscura};
  color: ${TEMA.branco};
  box-shadow: 0 6px 0px ${TEMA.marromTexto};

  &:hover {
    background: ${TEMA.ouro};
    color: ${TEMA.marromTexto};
    transform: translateY(-3px);
  }

  ${props => props.$isFocused && css`
    animation: ${pulse} 1.5s infinite;
    background: ${TEMA.ouro} !important;
    color: ${TEMA.marromTexto} !important;
    border-color: ${TEMA.branco} !important;
    transform: scale(1.1);
  `}
`;

export const ContainerFogos = styled.div` position: absolute; width: 10px; height: 10px; `;

export const ParticulaFogos = styled.div`
  position: absolute; width: 100%; height: 100%; border-radius: 50%;
  background: var(--color);
  animation: ${particles} 2s infinite ease-out;
  animation-delay: var(--delay);
`;