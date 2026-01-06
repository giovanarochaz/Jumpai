import styled, { keyframes, css } from 'styled-components';

export const TEMA = {
   espacoProfundo: '#020617',
   azulIon: '#22d3ee',        
   laranjaFoguete: '#f97316', 
   laranjaBrilhante: '#fb923c',
   verdeSucesso: '#22c55e',
   azulAço: '#1e293b',
   vidroEscuro: 'rgba(7, 10, 25, 0.98)', 
   brancoEstrela: '#f8fafc',
};

const aparecer = keyframes` from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } `;

const tremer = keyframes`
  0% { transform: translate(0, 0); }
  25% { transform: translate(-3px, 3px); }
  50% { transform: translate(3px, -3px); }
  75% { transform: translate(-3px, -3px); }
  100% { transform: translate(0, 0); }
`;

const piscarAlerta = keyframes`
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.3; }
`;

const flutuarDetrito = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  20% { opacity: 0.6; }
  100% { transform: translateY(150px) rotate(360deg); opacity: 0; }
`;

const pulse = keyframes` 
  0% { box-shadow: 0 0 0 0px ${TEMA.laranjaFoguete}; border-color: white; transform: scale(1); } 
  50% { box-shadow: 0 0 20px 5px rgba(249, 115, 22, 0.5); border-color: white; transform: scale(1.05); } 
  100% { box-shadow: 0 0 0 0px ${TEMA.laranjaFoguete}; border-color: white; transform: scale(1); } 
`;

export const FundoDerrota = styled.div`
  position: fixed; inset: 0;
  display: flex; justify-content: center; align-items: center;
  z-index: 300; overflow: hidden;
  background-color: ${TEMA.espacoProfundo};
  background-image: radial-gradient(circle at center, #1e0a0a 0%, ${TEMA.espacoProfundo} 100%);
  animation: ${tremer} 0.4s ease-out;
`;

export const LuzEmergencia = styled.div`
  position: absolute; inset: 0;
  background: radial-gradient(circle, transparent 50%, ${TEMA.laranjaFoguete} 180%);
  pointer-events: none; animation: ${piscarAlerta} 2s infinite; z-index: 1;
`;

export const ConteudoDerrota = styled.div`
   background: ${TEMA.vidroEscuro};
   border: 3px solid ${TEMA.laranjaFoguete};
   border-radius: 24px;
   padding: clamp(1.5rem, 4vh, 3rem);
   text-align: center; 
   display: flex;
   flex-direction: column;
   align-items: center;
   position: relative; z-index: 10;
   max-width: 650px; width: 90%;
   box-shadow: 0 0 50px rgba(249, 115, 22, 0.2);
   animation: ${aparecer} 0.5s ease-out;
`;

export const IconeContainer = styled.div`
   color: ${TEMA.laranjaFoguete};
   margin-bottom: 20px;
   display: flex;
   justify-content: center;
   align-items: center;
   filter: drop-shadow(0 0 15px ${TEMA.laranjaFoguete});
`;

export const TituloDerrota = styled.h1`
   font-size: clamp(2rem, 5vw, 3.5rem);
   color: ${TEMA.laranjaFoguete};
   text-transform: uppercase; letter-spacing: 4px;
   margin-bottom: 1rem; font-weight: 900;
`;

export const MensagemDerrota = styled.p`
   font-size: clamp(1rem, 2vw, 1.25rem);
   color: #cbd5e1; margin-bottom: 2.5rem;
   line-height: 1.6; max-width: 500px;
`;

export const ContainerBotoes = styled.div`
   display: flex; justify-content: center;
   gap: clamp(1rem, 3vw, 2rem);
   @media (max-width: 600px) { flex-direction: column; align-items: center; }
`;

export const BotaoDerrota = styled.button<{ $isFocused?: boolean }>`
   display: flex; align-items: center; justify-content: center; gap: 10px;
   min-width: 220px; min-height: 65px;
   background: transparent; color: white;
   border: 2px solid ${TEMA.azulIon};
   border-radius: 12px; font-size: 1rem; font-weight: 800;
   text-transform: uppercase; cursor: pointer; transition: all 0.2s ease;

   &:hover {
      background: ${TEMA.azulIon};
      color: ${TEMA.espacoProfundo};
      box-shadow: 0 0 20px ${TEMA.azulIon};
   }

   ${({ $isFocused }) => $isFocused && css`
      background: ${TEMA.laranjaFoguete} !important;
      border-color: white !important;
      color: white !important;
      animation: ${pulse} 1.5s infinite;
      transform: scale(1.1);
      box-shadow: 0 0 30px ${TEMA.laranjaFoguete};
   `}
`;

export const Detrito = styled.div`
  position: absolute; border-radius: 2px;
  opacity: 0; pointer-events: none; z-index: 5;
  animation: ${flutuarDetrito} 4s linear infinite;
`;