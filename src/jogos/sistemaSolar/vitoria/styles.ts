import styled, { keyframes, css } from 'styled-components';

// --- PALETA ESPACIAL (Mesma do Menu) ---
const TEMA = {
   roxoFundo: '#2e1065',
   roxoNeon: '#a855f7',
   azulEscuro: '#172554',
   amareloOuro: '#fbbf24', // Dourado para vitória
   branco: '#ffffff',
   vidroHolografico: 'rgba(23, 37, 84, 0.95)', // Fundo azulado deep
   sombraNeon: '0 0 20px #fbbf24, inset 0 0 20px rgba(168, 85, 247, 0.5)'
};

// --- ANIMAÇÕES ---

const popIn = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

const flutuar = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;

const girarBrilho = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const explodirEnergia = keyframes`
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--x), var(--y)) scale(0); opacity: 0; }
`;

// --- COMPONENTES ---

export const FundoVitoria = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background-color: rgba(10, 10, 20, 0.95);
  display: flex; justify-content: center; align-items: center;
  z-index: 300;
  overflow: hidden;

  /* Estrelas de fundo */
  background-image: 
      radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px),
      radial-gradient(white, rgba(255,255,255,.1) 1px, transparent 2px);
  background-size: 550px 550px, 350px 350px;
  
  animation: ${popIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

export const ConteudoVitoria = styled.div`
   background: linear-gradient(180deg, ${TEMA.vidroHolografico}, #0f172a);
   color: ${TEMA.branco};
   padding: 50px;
   border-radius: 30px;
   
   /* Borda Dourada/Neon */
   border: 3px solid ${TEMA.amareloOuro};
   box-shadow: 0 0 30px ${TEMA.amareloOuro}, inset 0 0 20px rgba(251, 191, 36, 0.2);
   
   text-align: center;
   position: relative;
   z-index: 10;
   max-width: 600px;
   width: 90%;

   /* Efeito de scanline holográfica */
   &::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: repeating-linear-gradient(
         0deg,
         transparent,
         transparent 2px,
         rgba(168, 85, 247, 0.05) 3px
      );
      pointer-events: none;
      border-radius: 26px;
   }
`;

export const IconeContainer = styled.div`
   position: relative;
   width: 140px;
   height: 140px;
   margin: 0 auto 20px;
   display: flex;
   justify-content: center;
   align-items: center;
   animation: ${flutuar} 3s ease-in-out infinite;

   /* Halo de luz atrás do ícone */
   &::after {
      content: '';
      position: absolute;
      width: 100%; height: 100%;
      border-radius: 50%;
      border: 2px dashed ${TEMA.amareloOuro};
      animation: ${girarBrilho} 10s linear infinite;
   }
`;

export const IconeTrofeu = styled.div`
   color: ${TEMA.amareloOuro};
   filter: drop-shadow(0 0 15px ${TEMA.amareloOuro});
   z-index: 2;
`;

export const TituloVitoria = styled.h1`
   font-size: 3rem;
   color: ${TEMA.amareloOuro};
   text-transform: uppercase;
   letter-spacing: 2px;
   text-shadow: 0 0 10px ${TEMA.amareloOuro};
   margin: 0;
   font-family: 'Orbitron', sans-serif; /* Fonte tech se disponível */
`;

export const MensagemVitoria = styled.p`
   font-size: 1.2rem;
   color: #e2e8f0;
   margin: 20px auto 30px;
   line-height: 1.6;
   max-width: 450px;
   text-shadow: 0 2px 4px rgba(0,0,0,0.5);
   
   strong {
      color: ${TEMA.roxoNeon};
   }
`;

export const ContainerBotoes = styled.div`
   display: flex;
   justify-content: center;
   gap: 20px;
`;

export const BotaoVitoria = styled.button<{ $focado?: boolean }>`
   display: flex; align-items: center; justify-content: center;
   min-width: 200px; min-height: 60px;
   
   background: linear-gradient(135deg, ${TEMA.roxoNeon}, #7c3aed);
   color: ${TEMA.branco};
   border: 2px solid ${TEMA.branco};
   border-radius: 15px;
   
   font-size: 1.1rem; font-weight: bold; text-transform: uppercase;
   cursor: pointer;
   transition: all 0.2s ease-out;
   box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);

   &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(124, 58, 237, 0.6);
   }

   ${({ $focado }) => $focado && css`
      background: ${TEMA.amareloOuro};
      color: #1e1b4b; /* Texto escuro no fundo dourado */
      border-color: ${TEMA.roxoNeon};
      transform: scale(1.1);
      box-shadow: 0 0 25px ${TEMA.amareloOuro};
      font-weight: 900;
   `}
`;

// --- FOGOS DE ARTIFÍCIO / ENERGIA ---

export const ContainerFogos = styled.div`
   position: absolute;
   top: var(--top);
   left: var(--left);
   transform: translate(-50%, -50%);
   width: 1px; height: 1px;
   z-index: 1;
`;

export const ParticulaFogos = styled.div`
   position: absolute;
   top: 0; left: 0;
   width: 6px; height: 6px;
   border-radius: 50%;
   background-color: var(--color);
   box-shadow: 0 0 10px var(--color); /* Brilho na partícula */
   opacity: 0;
   
   animation: ${explodirEnergia} 1.2s ease-out forwards;
   animation-delay: var(--delay);

   /* Coordenadas de explosão */
   &:nth-child(1) { --x: 80px; --y: 0px; }
   &:nth-child(2) { --x: -80px; --y: 0px; }
   &:nth-child(3) { --x: 0px; --y: 80px; }
   &:nth-child(4) { --x: 0px; --y: -80px; }
   &:nth-child(5) { --x: 60px; --y: 60px; }
   &:nth-child(6) { --x: -60px; --y: -60px; }
   &:nth-child(7) { --x: 60px; --y: -60px; }
   &:nth-child(8) { --x: -60px; --y: 60px; }
   &:nth-child(9) { --x: 100px; --y: 30px; }
   &:nth-child(10) { --x: -100px; --y: -30px; }
   &:nth-child(11) { --x: 30px; --y: -100px; }
   &:nth-child(12) { --x: -30px; --y: 100px; }
`;