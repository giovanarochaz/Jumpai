import styled, { keyframes, css } from 'styled-components';

const TEMA = {
   madeiraClara: '#D2691E',
   madeiraEscura: '#8B4513',
   madeiraBorda: '#5D4037',
   madeiraSombra: '#3E2723',
   
   verdeSapo: '#4ADE80',
   amareloDestaque: '#FBBF24',
   branco: '#FFFFFF',
};

const flutuar = keyframes` 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1vh); } `;
const splashAnim = keyframes` 0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; } 100% { transform: translate(-50%, -80%) scale(1.5); opacity: 0; } `;
const tremer = keyframes` 0%, 100% { transform: translate(0,0); } 25% { transform: translate(-5px, 5px); } 75% { transform: translate(5px, -5px); } `;


export const FundoLagoa = styled.div<{ $tremendo: boolean }>`
   position: fixed; inset: 0; 
   background: url('/assets/saltoAlfabetico/fundo_lagoa.png') center/cover;
   overflow: hidden;
   ${({ $tremendo }) => $tremendo && css`animation: ${tremer} 0.1s infinite;`}
`;

export const HudPalavra = styled.div`
   position: fixed; 
   top: 2vh; 
   left: 50%; 
   transform: translateX(-50%);
   
   /* Estilo Placa de Madeira */
   background-color: ${TEMA.madeiraClara};
   background-image: linear-gradient(180deg, ${TEMA.madeiraClara} 0%, ${TEMA.madeiraEscura} 100%);
   border: 5px solid ${TEMA.madeiraBorda};
   border-radius: 15px;
   
   padding: 15px 30px;
   display: flex; 
   gap: 15px; 
   z-index: 100;
   
   /* Sombra para parecer 3D */
   box-shadow: 
      inset 0 0 10px rgba(0,0,0,0.5), 
      0 8px 0 ${TEMA.madeiraSombra},
      0 15px 20px rgba(0,0,0,0.4);
`;

export const SlotSilaba = styled.div<{ $status: string; $ehTonica: boolean }>`
   width: clamp(60px, 8vw, 100px); 
   height: clamp(70px, 10vh, 120px);
   background: white; 
   border-radius: 10px;
   display: flex; 
   justify-content: center; 
   align-items: center;
   font-size: clamp(1.5rem, 4vh, 3rem); 
   font-weight: 900;
   border: 4px solid ${TEMA.madeiraBorda};
   transition: all 0.4s;

   ${({ $status }) => {
      if ($status === 'pendente') return css`
         background: rgba(255, 255, 255, 0.3);
         color: rgba(0, 0, 0, 0.2);
         border-color: rgba(0, 0, 0, 0.1);
      `;
      if ($status === 'correto') return css`
         background: ${TEMA.verdeSapo}; 
         color: white;
         box-shadow: inset 0 -4px 0 rgba(0,0,0,0.2);
      `;
      if ($status === 'erro') return css`
         background: #ef4444; 
         color: white;
      `;
   }}
   
   ${({ $ehTonica, $status }) => $ehTonica && $status === 'correto' && css`
      color: ${TEMA.amareloDestaque}; 
      text-shadow: 0 0 10px gold;
   `}
`;

export const VitoriaRegiaBase = styled.div`
   position: absolute; bottom: 5vh; left: 50%; transform: translateX(-50%);
   width: 20vw; z-index: 10; img { width: 100%; }
`;

interface WrapperFolhaProps { $pos: number; $focado: boolean; }

export const WrapperFolha = styled.div<WrapperFolhaProps>`
   position: absolute; width: 15vw; max-width: 180px; z-index: 20;
   transition: all 0.5s ease;
   ${({ $pos }) => {
      if ($pos === 0) return css`left: 10%; top: 35vh;`;
      if ($pos === 1) return css`left: 50%; top: 20vh; transform: translateX(-50%);`;
      if ($pos === 2) return css`right: 10%; top: 35vh;`;
   }}
   ${({ $focado, $pos }) => $focado && css`
      transform: scale(1.2) ${$pos === 1 ? 'translateX(-50%)' : ''};
      filter: drop-shadow(0 0 15px ${TEMA.amareloDestaque}); z-index: 50;
   `}
`;

export const VitoriaRegia = styled.div<{ $afundando: boolean }>`
   position: relative; animation: ${flutuar} 3s ease-in-out infinite;
   img { width: 100%; }
   ${({ $afundando }) => $afundando && css`transform: translateY(10vh) scale(0); opacity: 0; transition: 0.6s;`}
`;

export const TextoSilaba = styled.span`
   position: absolute; top: -3vh; left: 50%; transform: translateX(-50%);
   font-size: clamp(2rem, 6vh, 4rem); font-weight: 900; color: white;
   text-shadow: 3px 3px 0 #000;
`;

export const SapoWrapper = styled.div<{ $estado: string; $alvo: number | null }>`
   position: absolute; width: 12vw; max-width: 150px; z-index: 40;
   left: 50%; bottom: 8vh; transform: translateX(-50%);
   transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
   ${({ $alvo }) => {
      if ($alvo === 0) return css`left: 18%; bottom: 42vh;`;
      if ($alvo === 1) return css`left: 50%; bottom: 58vh;`;
      if ($alvo === 2) return css`left: 82%; bottom: 42vh;`;
   }}
   ${({ $estado }) => $estado === 'afundando' && css`transform: translateX(-50%) translateY(20vh); opacity: 0; transition: 0.8s;`}
`;

export const SapoImg = styled.img` width: 100%; `;

export const SplashEffect = styled.div`
   position: absolute; inset: 0; background: url('/assets/saltoAlfabetico/splash.png') no-repeat center/contain;
   animation: ${splashAnim} 0.8s ease-out forwards;
`;

export const OverlayAviso = styled.div`
   position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
   color: white; font-size: clamp(1.5rem, 5vw, 3rem); font-weight: 900;
   text-align: center; text-shadow: 0 0 20px black; z-index: 150;
`;