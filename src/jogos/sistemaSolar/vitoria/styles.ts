import styled, { keyframes, css } from 'styled-components';

const TEMA = {
   espacoProfundo: '#020617',
   azulIon: '#22d3ee',        
   laranjaFoguete: '#f97316', 
   laranjaBrilhante: '#fb923c',
   azulAço: '#1e293b',
   vidroEscuro: 'rgba(7, 10, 25, 0.98)', 
   brancoEstrela: '#f8fafc',
};

const aparecer = keyframes` from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } `;
const pulse = keyframes` 
  0% { box-shadow: 0 0 0 0px ${TEMA.laranjaFoguete}; border-color: white; transform: scale(1); } 
  50% { box-shadow: 0 0 20px 5px rgba(249, 115, 22, 0.5); border-color: white; transform: scale(1.05); } 
  100% { box-shadow: 0 0 0 0px ${TEMA.laranjaFoguete}; border-color: white; transform: scale(1); } 
`;

const explodir = keyframes`
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--x, 50px), var(--y, 50px)) scale(0); opacity: 0; }
`;

export const FundoVitoria = styled.div`
  position: fixed; inset: 0;
  display: flex; justify-content: center; align-items: center;
  z-index: 300; overflow: hidden;
  background-color: ${TEMA.azulAço};
  background-image: 
      radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px),
      radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 2px);
  background-size: 550px 550px, 350px 350px;
`;

export const ConteudoVitoria = styled.div`
   background: ${TEMA.vidroEscuro};
   border: 3px solid ${TEMA.azulIon};
   border-radius: 30px;
   padding: clamp(2rem, 5vh, 4rem);
   text-align: center;
   position: relative;
   z-index: 10;
   max-width: 700px;
   width: 90%;
   max-height: 90vh;
   overflow-y: auto;
   animation: ${aparecer} 0.5s ease-out;
   box-shadow: 0 0 50px rgba(34, 211, 238, 0.2);
`;

export const IconeContainer = styled.div`
   color: ${TEMA.azulIon};
   margin-bottom: 20px;
   filter: drop-shadow(0 0 15px ${TEMA.azulIon});
   display: flex;
   justify-content: center;
   align-items: center;
`;

export const TituloVitoria = styled.h1`
   font-size: clamp(2rem, 5vw, 3.5rem);
   color: ${TEMA.azulIon};
   text-transform: uppercase;
   letter-spacing: 4px;
   margin-bottom: 1rem;
   font-weight: 900;
`;

export const MensagemVitoria = styled.p`
   font-size: clamp(1rem, 2vw, 1.25rem);
   color: #e2e8f0;
   margin-bottom: 2.5rem;
   line-height: 1.6;
   max-width: 550px;
   margin-left: auto;
   margin-right: auto;
`;

export const ContainerBotoes = styled.div`
   display: flex;
   justify-content: center;
   gap: clamp(1rem, 3vw, 2rem);
   @media (max-width: 600px) { flex-direction: column; align-items: center; }
`;

export const BotaoVitoria = styled.button<{ $isFocused?: boolean }>`
   display: flex; align-items: center; justify-content: center; gap: 10px;
   min-width: 220px; min-height: 65px;
   background: transparent;
   color: white;
   border: 2px solid ${TEMA.laranjaFoguete};
   border-radius: 15px;
   font-size: 1rem; font-weight: 800; text-transform: uppercase;
   cursor: pointer;
   transition: all 0.2s ease;

   &:hover {
      background: ${TEMA.laranjaFoguete};
      box-shadow: 0 0 20px ${TEMA.laranjaFoguete};
      transform: translateY(-3px);
   }

   ${({ $isFocused }) => $isFocused && css`
      background: ${TEMA.laranjaFoguete} !important;
      border-color: white !important;
      animation: ${pulse} 1.5s infinite;
      transform: scale(1.1);
   `}
`;

export const ContainerFogos = styled.div`
   position: absolute; width: 1px; height: 1px; z-index: 1;
`;

export const ParticulaFogos = styled.div`
   position: absolute; width: 6px; height: 6px; border-radius: 50%;
   background-color: var(--color);
   box-shadow: 0 0 10px var(--color);
   opacity: 0;
   animation: ${explodir} 1.5s ease-out forwards;
   animation-delay: var(--delay);

   &:nth-child(1) { --x: 100px; --y: 0px; }
   &:nth-child(2) { --x: -100px; --y: 0px; }
   &:nth-child(3) { --x: 0px; --y: 100px; }
   &:nth-child(4) { --x: 0px; --y: -100px; }
   &:nth-child(5) { --x: 70px; --y: 70px; }
   &:nth-child(6) { --x: -70px; --y: -70px; }
   &:nth-child(7) { --x: 70px; --y: -70px; }
   &:nth-child(8) { --x: -70px; --y: 70px; }
   &:nth-child(9) { --x: 40px; --y: 90px; }
   &:nth-child(10) { --x: -40px; --y: -90px; }
`;