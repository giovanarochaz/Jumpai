import styled, { keyframes, css } from 'styled-components';

const TEMA = {
   vermelhoErro: '#dc2626',
   vermelhoFundo: '#7f1d1d',
   marromQueimado: '#451a03',
   amareloMostarda: '#d97706',
   branco: '#fecaca', // Branco rosado para o fundo do papel
   brancoPuro: '#ffffff', // Branco puro para texto/icone
   grid: 'rgba(0, 0, 0, 0.3)'
};

const tremerTela = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  10% { transform: translate(-5px, -5px) rotate(-1deg); }
  20% { transform: translate(5px, 5px) rotate(1deg); }
  30% { transform: translate(-5px, 5px) rotate(0deg); }
  40% { transform: translate(5px, -5px) rotate(1deg); }
  50% { transform: translate(0, 0) rotate(0deg); }
`;

const carimbar = keyframes`
  0% { transform: scale(3); opacity: 0; }
  50% { transform: scale(0.8); opacity: 1; }
  70% { transform: scale(1.1); }
  100% { transform: scale(1) rotate(-5deg); }
`;

const splatLiquido = keyframes`
  0% { transform: scale(0); opacity: 0.5; }
  50% { transform: scale(1.2) skew(10deg); opacity: 1; }
  80% { transform: scale(0.9) skew(-5deg); }
  100% { transform: scale(1); opacity: 0.9; }
`;

const balancoTriste = keyframes`
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
`;

export const FundoDerrota = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: radial-gradient(circle, #991b1b 0%, #450a0a 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 300;
  overflow: hidden;
  animation: ${tremerTela} 0.5s ease-out;
`;

export const ConteudoDerrota = styled.div`
   background-color: ${TEMA.branco};
   background-image:
      linear-gradient(${TEMA.grid} 1px, transparent 1px),
      linear-gradient(90deg, ${TEMA.grid} 1px, transparent 1px);
   background-size: 40px 40px;
   
   color: ${TEMA.marromQueimado};
   padding: 50px;
   border-radius: 10px;
   border: 6px dashed ${TEMA.vermelhoErro};
   text-align: center;
   position: relative;
   z-index: 10;
   box-shadow: 0 20px 50px rgba(0,0,0,0.7);
   max-width: 600px;
   width: 90%;
   transform: rotate(1deg);

   &::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: radial-gradient(circle, transparent 50%, rgba(0,0,0,0.05) 100%);
      pointer-events: none;
   }
`;

// --- ÍCONE AJUSTADO ---
export const IconeDerrota = styled.div`
   animation: ${balancoTriste} 3s ease-in-out infinite;
   
   /* Centralização e Tamanho */
   margin: 0 auto 20px; 
   width: 120px;
   height: 120px;
   display: flex;
   justify-content: center;
   align-items: center;

   /* Estilo Badge/Escudo */
   background-color: ${TEMA.vermelhoErro};
   color: ${TEMA.brancoPuro}; /* Ícone Branco */
   border-radius: 50%;
   border: 4px solid ${TEMA.marromQueimado};
   box-shadow: 4px 4px 0px rgba(0,0,0,0.2);
`;

// --- TÍTULO AJUSTADO ---
export const TituloDerrota = styled.h1`
   font-size: 3.5rem;
   font-family: 'Courier New', Courier, monospace;
   font-weight: 900;
   text-transform: uppercase;
   
   /* Estilo Carimbo Sólido */
   color: ${TEMA.brancoPuro}; /* Texto Branco */
   background-color: ${TEMA.vermelhoErro}; /* Fundo Vermelho */
   border: 5px solid ${TEMA.vermelhoErro};
   border-radius: 8px;
   
   padding: 10px 30px;
   display: inline-block;
   margin: 10px 0 20px;
   
   /* Textura do carimbo */
   mask-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=');
   
   animation: ${carimbar} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
   animation-delay: 0.2s;
   transform: rotate(-5deg); /* Leve inclinação */
`;

export const MensagemDerrota = styled.p`
   font-size: 1.3rem;
   font-weight: bold;
   margin: 15px auto 30px;
   line-height: 1.6;
   color: ${TEMA.marromQueimado};
`;

export const ContainerBotoes = styled.div`
   display: flex;
   justify-content: center;
   gap: 20px;
   margin-top: 20px;
`;

export const BotaoDerrota = styled.button<{ $focado?: boolean }>`
   min-width: 180px;
   min-height: 60px;
   background-color: ${({ $focado }) => ($focado ? TEMA.amareloMostarda : '#e5e7eb')};
   color: ${TEMA.marromQueimado};
   border: 4px solid ${TEMA.marromQueimado};
   border-radius: 15px;
   cursor: pointer;
   box-shadow: 6px 6px 0px ${TEMA.marromQueimado};
   font-size: 1.1rem;
   font-weight: 800;
   text-transform: uppercase;
   transition: all 0.15s ease-out;

   ${({ $focado }) => $focado && css`
      transform: scale(1.1) rotate(-2deg);
      box-shadow: 8px 8px 0px ${TEMA.vermelhoErro};
      border-color: ${TEMA.vermelhoErro};
      background-color: ${TEMA.amareloMostarda};
      z-index: 5;
   `}

   &:hover {
      background-color: ${TEMA.amareloMostarda};
      transform: translate(2px, 2px);
      box-shadow: 4px 4px 0px ${TEMA.marromQueimado};
   }

   &:active {
      transform: translate(6px, 6px);
      box-shadow: none;
   }
`;

export const Splatter = styled.div<{ $cor: string }>`
  position: absolute;
  top: var(--top);
  left: var(--left);
  width: var(--size);
  height: var(--size);
  background-color: ${({ $cor }) => $cor};
  
  border-radius: 
    var(--r1) var(--r2) var(--r3) var(--r4) / 
    var(--r5) var(--r6) var(--r7) var(--r8);
    
  opacity: 0;
  pointer-events: none;
  z-index: 5;
  box-shadow: inset 5px 5px 10px rgba(0,0,0,0.1);

  animation: ${splatLiquido} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  animation-delay: var(--delay);
`;