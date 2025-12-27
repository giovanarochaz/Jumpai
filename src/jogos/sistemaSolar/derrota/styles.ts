import styled, { keyframes, css } from 'styled-components';

// --- PALETA DE ALERTA ESPACIAL ---
const TEMA_ERRO = {
   vermelhoNeon: '#ef4444',
   vermelhoEscuro: '#7f1d1d',
   pretoEspaco: '#0f172a',
   branco: '#f8fafc',
   laranjaAlerta: '#f97316',
   vidroQuebrado: 'rgba(127, 29, 29, 0.85)', // Fundo translúcido avermelhado
   sombraNeon: '0 0 20px #ef4444, inset 0 0 30px rgba(239, 68, 68, 0.2)'
};

// --- ANIMAÇÕES ---

const tremer = keyframes`
  0% { transform: translate(0, 0); }
  20% { transform: translate(-4px, 4px); }
  40% { transform: translate(4px, -4px); }
  60% { transform: translate(-2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0, 0); }
`;

const piscarAlerta = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
`;

const flutuarDetrito = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(100px) rotate(360deg); opacity: 0; }
`;

const popIn = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

// --- COMPONENTES ---

export const FundoDerrota = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  /* Fundo preto com gradiente radial vermelho (núcleo do erro) */
  background: radial-gradient(circle at center, #450a0a 0%, #020617 80%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 300;
  overflow: hidden;
  
  /* Shake inicial para simular impacto */
  animation: ${tremer} 0.5s ease-out;
`;

// Luz vermelha pulsante sobre a tela inteira
export const LuzEmergencia = styled.div`
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle, transparent 60%, ${TEMA_ERRO.vermelhoNeon} 150%);
  pointer-events: none;
  animation: ${piscarAlerta} 2s infinite;
  z-index: 1;
`;

export const ConteudoDerrota = styled.div`
   /* Painel de vidro escuro e avermelhado */
   background: linear-gradient(145deg, ${TEMA_ERRO.vidroQuebrado}, #1a0505);
   color: ${TEMA_ERRO.branco};
   padding: 50px;
   border-radius: 20px;
   
   /* Borda de Alerta */
   border: 3px solid ${TEMA_ERRO.vermelhoNeon};
   box-shadow: ${TEMA_ERRO.sombraNeon}, 0 20px 50px rgba(0,0,0,0.8);
   
   text-align: center;
   position: relative;
   z-index: 10;
   max-width: 600px;
   width: 90%;
   animation: ${popIn} 0.4s ease-out;

   /* Linhas de scanline de erro */
   &::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: repeating-linear-gradient(
         0deg,
         transparent,
         transparent 2px,
         rgba(239, 68, 68, 0.1) 3px
      );
      pointer-events: none;
      border-radius: 16px;
   }
`;

export const IconeContainer = styled.div`
   position: relative;
   width: 100px;
   height: 100px;
   margin: 0 auto 20px;
   display: flex; justify-content: center; align-items: center;

   .icone-sombra {
      position: absolute;
      width: 100%; height: 100%;
      background: ${TEMA_ERRO.vermelhoNeon};
      border-radius: 50%;
      filter: blur(20px);
      opacity: 0.5;
      animation: ${piscarAlerta} 1s infinite;
   }
`;

export const IconeAlerta = styled.div`
   position: relative;
   z-index: 2;
   color: ${TEMA_ERRO.branco};
   background-color: ${TEMA_ERRO.vermelhoEscuro};
   padding: 20px;
   border-radius: 50%;
   border: 4px solid ${TEMA_ERRO.vermelhoNeon};
`;

export const TituloDerrota = styled.h1`
   font-size: 3rem;
   color: ${TEMA_ERRO.vermelhoNeon};
   font-family: 'Orbitron', sans-serif; /* Fonte Tech */
   font-weight: 900;
   text-transform: uppercase;
   letter-spacing: 3px;
   text-shadow: 0 0 10px ${TEMA_ERRO.vermelhoNeon};
   margin: 10px 0;
`;

export const MensagemDerrota = styled.p`
   font-size: 1.2rem;
   color: #cbd5e1;
   margin: 20px auto 30px;
   line-height: 1.6;
   border-top: 1px solid rgba(239, 68, 68, 0.3);
   border-bottom: 1px solid rgba(239, 68, 68, 0.3);
   padding: 15px 0;
   background: rgba(0,0,0,0.2);

   strong {
      color: ${TEMA_ERRO.laranjaAlerta};
   }
`;

export const ContainerBotoes = styled.div`
   display: flex;
   justify-content: center;
   gap: 20px;
   margin-top: 10px;
`;

export const BotaoDerrota = styled.button<{ $focado?: boolean }>`
   min-width: 180px;
   min-height: 60px;
   background-color: transparent;
   color: ${TEMA_ERRO.vermelhoNeon};
   border: 2px solid ${TEMA_ERRO.vermelhoNeon};
   border-radius: 12px;
   cursor: pointer;
   font-size: 1.1rem;
   font-weight: bold;
   text-transform: uppercase;
   transition: all 0.2s ease-out;
   box-shadow: 0 0 10px rgba(239, 68, 68, 0.2);

   ${({ $focado }) => $focado && css`
      background-color: ${TEMA_ERRO.vermelhoNeon};
      color: ${TEMA_ERRO.pretoEspaco};
      box-shadow: 0 0 20px ${TEMA_ERRO.vermelhoNeon};
      transform: scale(1.05);
      border-color: ${TEMA_ERRO.branco};
   `}

   &:hover {
      background-color: ${TEMA_ERRO.vermelhoEscuro};
      color: ${TEMA_ERRO.branco};
      border-color: ${TEMA_ERRO.vermelhoNeon};
   }
`;

// --- COMPONENTE DETRITO (Partículas) ---

export const Detrito = styled.div`
  position: absolute;
  top: var(--top);
  left: var(--left);
  width: var(--size);
  height: var(--size);
  background-color: var(--cor);
  border-radius: var(--radius); /* Redondo ou Quadrado */
  
  opacity: 0;
  pointer-events: none;
  z-index: 5;
  box-shadow: 0 0 5px rgba(0,0,0,0.5);

  animation: ${flutuarDetrito} 3s linear infinite;
  animation-delay: var(--delay);
`;