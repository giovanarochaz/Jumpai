import styled, { keyframes, css } from 'styled-components';

// --- CORES DA VITÓRIA ---
const TEMA = {
  madeiraClara: '#DEB887', // Burlywood
  madeiraEscura: '#8B4513', // SaddleBrown
  ouro: '#FBBF24',
  ouroEscuro: '#B45309',
  marromTexto: '#3E2723',
  branco: '#FFFFFF',
};

// --- ANIMAÇÕES ---
const popIn = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
`;

const brilho = keyframes`
  0%, 100% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.1); filter: brightness(1.2); }
`;

// --- COMPONENTES ---

export const FundoVitoria = styled.div`
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  
  /* IMAGEM DA LAGOA DE FUNDO */
  background-image: url('/assets/saltoAlfabetico/fundo_lagoa.png');
  background-size: cover;
  background-position: center;

  /* Overlay dourado para indicar vitória */
  &::before {
    content: '';
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(251, 191, 36, 0.3); /* Amarelo translúcido */
    backdrop-filter: blur(3px);
  }

  display: flex; justify-content: center; align-items: center;
  z-index: 300;
`;

export const PlacaVitoria = styled.div`
  position: relative;
  
  /* Textura de Madeira */
  background-color: ${TEMA.madeiraClara};
  background-image: repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 2px, transparent 2px, transparent 4px);
  
  border: 8px solid ${TEMA.ouro};
  border-radius: 40px;
  padding: 40px;
  width: 90%; max-width: 600px;
  
  display: flex; flex-direction: column; align-items: center; text-align: center;
  
  box-shadow: 
    0 0 0 8px ${TEMA.madeiraEscura}, /* Borda dupla (Ouro + Madeira) */
    0 20px 40px rgba(0,0,0,0.6);
    
  animation: ${popIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

export const IconeContainer = styled.div`
  background-color: ${TEMA.ouro};
  width: 120px; height: 120px;
  border-radius: 50%;
  border: 5px solid ${TEMA.branco};
  display: flex; justify-content: center; align-items: center;
  box-shadow: 0 8px 0 ${TEMA.ouroEscuro};
  margin-bottom: 20px;
  z-index: 1;
  animation: ${brilho} 2s infinite;
  
  svg { color: ${TEMA.marromTexto}; }
`;

export const Titulo = styled.h1`
  font-family: 'Comic Sans MS', cursive, sans-serif;
  font-size: 3rem;
  color: ${TEMA.ouroEscuro};
  text-transform: uppercase;
  margin: 0;
  text-shadow: 2px 2px 0 ${TEMA.branco};
  z-index: 1;
`;

export const Mensagem = styled.div`
  margin: 20px 0;
  font-size: 1.3rem;
  color: ${TEMA.marromTexto};
  background-color: rgba(255, 255, 255, 0.5);
  padding: 15px;
  border-radius: 15px;
  border: 2px dashed ${TEMA.madeiraEscura};
  z-index: 1;
  
  strong { color: ${TEMA.ouroEscuro}; font-weight: 900; }
`;

export const ContainerBotoes = styled.div`
  display: flex; gap: 20px; margin-top: 20px; z-index: 1;
`;

export const Botao = styled.button<{ $focado?: boolean }>`
  display: flex; align-items: center; gap: 10px;
  padding: 15px 30px;
  border-radius: 20px;
  font-size: 1.1rem; font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.2s;

  background-color: ${TEMA.madeiraEscura};
  color: ${TEMA.branco};
  border: 3px solid ${TEMA.marromTexto};
  box-shadow: 0 6px 0 ${TEMA.marromTexto};

  /* Estilo Focado (Eye Tracking) */
  ${({ $focado }) => $focado && css`
    background-color: ${TEMA.ouro};
    color: ${TEMA.marromTexto};
    transform: scale(1.1);
    box-shadow: 0 10px 0 ${TEMA.ouroEscuro};
    border-color: ${TEMA.branco};
  `}

  &:active { transform: translateY(4px); box-shadow: none; }
`;