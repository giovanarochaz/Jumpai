import styled, { keyframes, css } from 'styled-components';

// --- PALETA TEMÁTICA (Consistência com o Manual) ---
const TEMA = {
   vermelho: '#ef4444',
   vermelhoEscuro: '#b91c1c',
   amarelo: '#fbbf24',
   marrom: '#78350f',
   branco: '#ffffff',
   fundoRosa: '#fff1f2',
   grid: 'rgba(239, 68, 68, 0.2)'
};

// --- ANIMAÇÕES ---

const popIn = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

const cairConfete = keyframes`
  0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
`;

const brilhoEstrela = keyframes`
  0%, 100% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.2); filter: brightness(1.3); drop-shadow(0 0 10px ${TEMA.amarelo}); }
`;

const flutuarCard = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// --- COMPONENTES ---

export const FundoVitoria = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  /* Gradiente radial para dar foco no centro */
  background: radial-gradient(circle, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.9) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 300;
  overflow: hidden;
  animation: ${popIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

export const ConteudoVitoria = styled.div`
   /* Fundo Quadriculado Temático */
   background-color: ${TEMA.fundoRosa};
   background-image:
      linear-gradient(${TEMA.grid} 1px, transparent 1px),
      linear-gradient(90deg, ${TEMA.grid} 1px, transparent 1px);
   background-size: 30px 30px;
   
   color: ${TEMA.marrom};
   padding: 50px;
   border-radius: 40px;
   border: 8px solid ${TEMA.vermelho};
   text-align: center;
   position: relative;
   z-index: 10;
   box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 5px ${TEMA.branco};
   max-width: 600px;
   width: 90%;
   animation: ${flutuarCard} 4s ease-in-out infinite;

   /* Faixa decorativa no topo */
   &::after {
      content: '';
      position: absolute;
      top: -15px; left: 50%; transform: translateX(-50%);
      width: 60%; height: 15px;
      background-color: ${TEMA.marrom};
      border-radius: 10px;
   }
`;

export const EstrelasContainer = styled.div`
   display: flex;
   justify-content: center;
   gap: 15px;
   margin-bottom: 20px;
`;

export const IconeEstrela = styled.div<{ $delay: string }>`
   color: ${TEMA.amarelo};
   filter: drop-shadow(2px 2px 0px ${TEMA.marrom});
   
   /* Animação de entrada e brilho contínuo */
   animation: 
      ${popIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards,
      ${brilhoEstrela} 2s infinite ease-in-out;
      
   animation-delay: ${({ $delay }) => $delay}, ${({ $delay }) => `calc(${$delay} + 0.5s)`};
`;

export const TituloVitoria = styled.h1`
   font-size: 3.5rem;
   color: ${TEMA.vermelho};
   font-weight: 900;
   text-transform: uppercase;
   letter-spacing: 2px;
   text-shadow: 4px 4px 0px ${TEMA.branco}, 6px 6px 0px ${TEMA.marrom};
   margin: 10px 0;
   transform: rotate(-2deg); /* Leve inclinação divertida */
`;

export const MensagemVitoria = styled.p`
   font-size: 1.3rem;
   font-weight: 500;
   margin: 20px auto 30px;
   line-height: 1.6;
   background: ${TEMA.branco};
   padding: 15px;
   border-radius: 15px;
   border: 2px dashed ${TEMA.marrom};
   box-shadow: 4px 4px 0 rgba(0,0,0,0.1);
`;

export const ContainerBotoes = styled.div`
   display: flex;
   justify-content: center;
   gap: 20px;
   margin-top: 10px;
`;

export const BotaoVitoria = styled.button<{ $focado?: boolean }>`
   min-width: 180px;
   min-height: 60px;
   background-color: ${({ $focado }) => ($focado ? TEMA.amarelo : TEMA.branco)};
   color: ${TEMA.marrom};
   border: 4px solid ${TEMA.marrom};
   border-radius: 25px;
   cursor: pointer;
   box-shadow: 6px 6px 0px ${TEMA.marrom};
   font-size: 1.1rem;
   font-weight: 800;
   text-transform: uppercase;
   transition: all 0.15s ease-out;

   ${({ $focado }) => $focado && css`
      transform: scale(1.1);
      box-shadow: 8px 8px 0px ${TEMA.vermelho};
      border-color: ${TEMA.vermelho};
      background-color: ${TEMA.amarelo};
      z-index: 5;
   `}

   &:hover {
      background-color: ${TEMA.amarelo};
      transform: translate(2px, 2px);
      box-shadow: 4px 4px 0px ${TEMA.marrom};
   }

   &:active {
      transform: translate(6px, 6px);
      box-shadow: none;
   }
`;

// --- CONFETES ---

export const Confete = styled.div`
   position: absolute;
   top: -20px;
   left: var(--left);
   width: var(--size);
   height: var(--size);
   background-color: var(--color);
   border-radius: var(--radius);
   opacity: 0;
   z-index: 1; /* Atrás do card */
   
   animation: ${cairConfete} var(--duration) linear infinite;
   animation-delay: var(--delay);
`;