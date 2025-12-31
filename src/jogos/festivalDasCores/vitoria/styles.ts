import styled, { keyframes, css } from 'styled-components';

// --- CORES DO ATELIÊ (Igual ao Jogo) ---
const TEMA = {
  parede: '#FFF8E1',        // Cornsilk
  madeiraClara: '#DEB887',
  madeiraEscura: '#8B4513',
  chao1: '#D2691E',
  chao2: '#A0522D',
  rodape: '#5D4037',
  branco: '#FFFFFF',
  ouro: '#FFD700',
  laranja: '#FF6B00',
};

// --- ANIMAÇÕES ---
const popIn = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
`;

const brilhoGiratorio = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const cairConfete = keyframes`
  0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
`;

const pulso = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// --- ESTRUTURA ---

export const FundoVitoria = styled.div`
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  
  /* 1. PAREDE COM MANCHAS DE TINTA (FESTA) */
  background-color: ${TEMA.parede};
  background-image: 
    /* Manchas coloridas */
    radial-gradient(circle at 10% 20%, rgba(255, 0, 0, 0.15) 0%, transparent 15%),
    radial-gradient(circle at 90% 10%, rgba(0, 0, 255, 0.15) 0%, transparent 15%),
    radial-gradient(circle at 20% 80%, rgba(0, 255, 0, 0.15) 0%, transparent 20%),
    radial-gradient(circle at 80% 70%, rgba(255, 215, 0, 0.2) 0%, transparent 25%),
    /* Textura da parede */
    linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px);
  background-size: 100% 100%, 100% 100%, 100% 100%, 100% 100%, 40px 100%;

  display: flex; justify-content: center; align-items: center;
  z-index: 300;
  overflow: hidden;

  /* 2. CHÃO DE MADEIRA (Igual ao Jogo) */
  &::after {
    content: '';
    position: absolute; bottom: 0; left: 0; width: 100%; height: 35%;
    z-index: -1;
    background: repeating-linear-gradient(
      90deg,
      ${TEMA.chao2} 0px, ${TEMA.chao2} 2px,
      ${TEMA.chao1} 2px, ${TEMA.chao1} 40px
    );
    box-shadow: inset 0 20px 50px rgba(0,0,0,0.3);
  }

  /* 3. RODAPÉ */
  &::before {
    content: '';
    position: absolute; bottom: 35%; left: 0; width: 100%; height: 15px;
    background-color: ${TEMA.rodape};
    border-top: 2px solid rgba(255,255,255,0.2);
    z-index: 0;
    box-shadow: 0 2px 5px rgba(0,0,0,0.5);
  }
`;

export const PlacaVitoria = styled.div`
  position: relative;
  background-color: ${TEMA.branco};
  width: 90%; max-width: 600px;
  padding: 40px;
  
  /* Borda estilo Quadro */
  border: 10px solid ${TEMA.ouro};
  border-radius: 30px;
  
  /* Sombra forte para destacar do fundo */
  box-shadow: 
    0 0 0 10px ${TEMA.madeiraEscura}, /* Moldura de madeira externa */
    0 30px 60px rgba(0,0,0,0.5);
    
  display: flex; flex-direction: column; align-items: center; text-align: center;
  z-index: 10;
  animation: ${popIn} 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

// --- ÍCONE E BRILHO ---

export const IconeContainer = styled.div`
  position: relative;
  width: 140px; height: 140px;
  display: flex; justify-content: center; align-items: center;
  margin-bottom: 20px;
  
  /* Fundo circular atrás do ícone */
  background-color: ${TEMA.parede};
  border-radius: 50%;
  border: 4px solid ${TEMA.ouro};
`;

export const HaloLuz = styled.div`
  position: absolute; width: 100%; height: 100%;
  border-radius: 50%;
  border: 4px dashed ${TEMA.ouro};
  animation: ${brilhoGiratorio} 10s linear infinite;
`;

export const IconePrincipal = styled.div`
  z-index: 2;
  color: ${TEMA.laranja};
  filter: drop-shadow(2px 4px 0px rgba(0,0,0,0.1));
  animation: ${pulso} 2s infinite;
`;

// --- TEXTOS ---

export const Titulo = styled.h1`
  font-family: 'Comic Sans MS', sans-serif;
  font-size: 3rem;
  color: ${TEMA.madeiraEscura};
  text-transform: uppercase;
  font-weight: 900;
  margin: 0;
  text-shadow: 2px 2px 0px ${TEMA.parede};
`;

export const Mensagem = styled.div`
  margin: 20px 0 30px;
  font-size: 1.3rem;
  color: #555;
  line-height: 1.5;
  
  strong {
    color: ${TEMA.laranja};
    font-size: 1.4rem;
  }
`;

// --- BOTÕES ---

export const ContainerBotoes = styled.div`
  display: flex; gap: 20px; width: 100%; justify-content: center;
`;

export const Botao = styled.button<{ $focado?: boolean }>`
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1.1rem; font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  
  /* Estilo Madeira */
  background-color: ${TEMA.madeiraClara};
  color: ${TEMA.madeiraEscura};
  border: 3px solid ${TEMA.madeiraEscura};
  box-shadow: 0 5px 0 ${TEMA.madeiraEscura};
  transition: all 0.2s;

  /* Estilo Focado (Eye Tracking) */
  ${({ $focado }) => $focado && css`
    background-color: ${TEMA.ouro};
    transform: scale(1.1);
    box-shadow: 0 8px 0 ${TEMA.laranja};
    border-color: ${TEMA.branco};
  `}

  &:active { transform: translateY(4px); box-shadow: none; }
`;

// --- CONFETES DE TINTA ---

export const ConfeteTinta = styled.div`
  position: absolute;
  top: -50px;
  left: var(--left);
  width: var(--size);
  height: var(--size);
  background-color: var(--color);
  border-radius: 50%; /* Bolinhas de tinta */
  opacity: 0.8;
  z-index: 1; /* Atrás da placa, mas na frente do fundo */
  
  animation: ${cairConfete} var(--duration) linear infinite;
  animation-delay: var(--delay);
`;