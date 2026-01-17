import styled, { keyframes, css } from 'styled-components';

const TEMA = {
   vermelho: '#ef4444',     
   vermelhoEscuro: '#b91c1c', 
   amarelo: '#fbbf24',      
   amareloEscuro: '#d97706', 
   marromMesa: '#3e1a0b',       
   marromPlaca: '#78350f',
   fundoRosa: '#fff1f2',    
   branco: '#ffffff',
   grid: 'rgba(239, 68, 68, 0.1)' 
};

const aparecer = keyframes` from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } `;
const flutuar = keyframes` 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(10deg); } `;
const pulsarFoco = keyframes` 0% { box-shadow: 0 0 0 0px ${TEMA.amarelo}; } 100% { box-shadow: 0 0 0 10px rgba(251, 191, 36, 0); } `;

export const FundoModal = styled.div`
   position: fixed; inset: 0; 
   background-color: ${TEMA.marromMesa};
   background-image: linear-gradient(90deg, 
      rgba(255,255,255,0.02) 1px, 
      transparent 1px, 
      transparent 80px, 
      rgba(0,0,0,0.3) 81px, 
      transparent 81px
   );
   background-size: 120px 100%;
   display: flex; justify-content: center; align-items: center; z-index: 200;
   overflow: hidden;

   &:before {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(circle, transparent 10%, rgba(0,0,0,0.5) 100%);
      z-index: 2;
   }
`;

export const DecoracaoFundo = styled.div`
   position: absolute; inset: 0; z-index: 1;
   pointer-events: none;
`;

export const ManchaComida = styled.div<{ $corGlow: string }>`
   position: absolute;
   width: 250px; height: 250px;
   display: flex; justify-content: center; align-items: center;
   /* Aumentado o blur para um efeito mais barrado e profissional */
   filter: blur(6px); 
   opacity: 0.35; 

   &::before {
      content: ''; position: absolute; 
      width: 100%; height: 100%;
      /* Glow mais suave e expansivo */
      background: radial-gradient(circle, ${({ $corGlow }) => $corGlow} 0%, transparent 75%);
      transform: scale(1.8);
   }

   img {
      width: 90px; height: 90px; object-fit: contain;
      position: relative; z-index: 3;
      animation: ${flutuar} 8s infinite ease-in-out;
   }
`;

export const ConteudoModal = styled.div`
   position: relative; z-index: 10;
   background-color: ${TEMA.fundoRosa};
   background-image: linear-gradient(${TEMA.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${TEMA.grid} 1.5px, transparent 1.5px);
   background-size: 30px 30px; padding: clamp(20px, 4vh, 45px);
   border: 6px solid ${TEMA.vermelho}; border-radius: 30px; width: 92%; max-width: 850px;
   box-shadow: 0 15px 0px ${TEMA.marromPlaca}, 0 30px 60px rgba(0,0,0,0.6);
   display: flex; flex-direction: column; animation: ${aparecer} 0.4s ease-out;
   
   &::before { content: ''; position: absolute; inset: 8px; border: 2.5px dashed ${TEMA.vermelho}; border-radius: 22px; pointer-events: none; opacity: 0.4; }
`;

export const IngredienteAnimado = styled.img`
   width: clamp(140px, 28vh, 230px); height: auto;
   filter: drop-shadow(10px 10px 0px rgba(0,0,0,0.1));
   animation: ${flutuar} 5s ease-in-out infinite;
`;

export const TextoSlide = styled.div`
   flex: 1;
   h2 { font-size: clamp(1.8rem, 4.5vh, 3rem); color: ${TEMA.vermelho}; font-weight: 900; text-transform: uppercase; margin-bottom: 12px; }
   p { font-size: clamp(1rem, 2.2vh, 1.3rem); line-height: 1.6; color: ${TEMA.marromPlaca}; font-weight: 700; }
`;

export const ContainerSlide = styled.div` display: flex; align-items: center; gap: 35px; margin: 2vh 0; `;
export const ContainerExplicacao = styled.div` padding: 10px 0; `;

export const SecaoExplicacao = styled.div`
   display: flex; align-items: center; gap: 20px; margin: 20px 0;
   background: white; padding: 22px; border-radius: 18px;
   border-left: 10px solid ${TEMA.amarelo};
   box-shadow: 6px 6px 0px rgba(0,0,0,0.05);
`;

export const WrapperIcone = styled.div`
   background: ${TEMA.amarelo}; color: ${TEMA.marromPlaca}; border-radius: 50%;
   width: 68px; height: 68px; display: flex; justify-content: center; align-items: center;
   border: 3.5px solid ${TEMA.marromPlaca}; flex-shrink: 0;
   svg { width: 38px; height: 38px; }
`;

export const WrapperTexto = styled.div`
   h3 { color: ${TEMA.vermelho}; margin: 0 0 5px 0; font-size: 1.5rem; font-weight: 900; }
   p { margin: 0; font-size: 1.15rem; line-height: 1.5; color: #4b2e2e; font-weight: 600; }
`;

export const ContainerConfiguracoes = styled.div` display: flex; flex-direction: column; gap: 15px; `;

export const LinhaConfiguracao = styled.div<{ $isFocused: boolean }>`
   display: flex; justify-content: space-between; align-items: center;
   background: white; padding: clamp(12px, 1.8vh, 20px) 25px; border-radius: 18px; border: 3.5px solid ${TEMA.marromPlaca};
   transition: 0.3s;
   ${props => props.$isFocused && css` border-color: ${TEMA.vermelho}; transform: scale(1.03); box-shadow: 0 0 25px ${TEMA.amarelo}; `}
`;

export const BotaoOpcao = styled.button<{ ativo: boolean; $isFocused?: boolean }>`
   padding: 12px 25px; border-radius: 15px; border: 3.5px solid ${TEMA.marromPlaca};
   background: ${props => props.ativo ? TEMA.amarelo : 'white'};
   font-weight: 900; cursor: pointer; text-transform: uppercase; font-size: 0.95rem;
   ${props => props.$isFocused && css` animation: ${pulsarFoco} 1s infinite; background: ${TEMA.amarelo}; border-color: ${TEMA.vermelho}; `}
`;

export const BotaoNavegacao = styled.button<{ $isFocusedManual?: boolean }>`
   padding: 16px 40px; border-radius: 25px; border: 3.5px solid ${TEMA.vermelho};
   background: white; color: ${TEMA.vermelho}; font-weight: 900; cursor: pointer;
   display: flex; align-items: center; gap: 12px; transition: 0.2s;
   box-shadow: 0 6px 0 ${TEMA.vermelho}; font-size: 1rem;
   &:hover { background: ${TEMA.fundoRosa}; }
   ${props => props.$isFocusedManual && css` animation: ${pulsarFoco} 1s infinite; background: ${TEMA.amarelo}; color: ${TEMA.marromPlaca}; border-color: ${TEMA.marromPlaca}; `}
`;

export const BotaoIniciarMissao = styled.button<{ $isFocused: boolean }>`
   width: 100%; padding: 24px; border-radius: 25px; border: 4px solid ${TEMA.marromPlaca};
   background: ${TEMA.vermelho}; color: white; font-size: 1.8rem; font-weight: 900;
   cursor: pointer; box-shadow: 0 10px 0 ${TEMA.marromPlaca}; text-transform: uppercase;
   ${props => props.$isFocused && css` background: ${TEMA.amarelo}; color: ${TEMA.marromPlaca}; transform: scale(1.03); `}
`;

export const NavegacaoCarrossel = styled.div` display: flex; justify-content: space-between; align-items: center; margin-top: 25px; span { font-weight: 900; font-size: 1.3rem; color: ${TEMA.marromPlaca}; } `;
export const ContainerInterruptor = styled.div` position: relative; width: 65px; height: 36px; `;
export const InputInterruptor = styled.input` opacity: 0; width: 0; height: 0; `;
export const DeslizadorInterruptor = styled.span` position: absolute; inset: 0; background: #d1d5db; border: 3px solid ${TEMA.marromPlaca}; border-radius: 34px; transition: .4s; &:before { content: ""; position: absolute; height: 22px; width: 22px; left: 4px; bottom: 4px; background: ${TEMA.marromPlaca}; transition: .4s; border-radius: 50%; } ${InputInterruptor}:checked + & { background: ${TEMA.amarelo}; } ${InputInterruptor}:checked + &:before { transform: translateX(28px); background: white; } `;
export const RotuloConfiguracao = styled.div` display: flex; align-items: center; gap: 15px; color: ${TEMA.vermelhoEscuro}; h3 { margin: 0; font-size: 1.3rem; font-weight: 900; } `;
export const GrupoBotoes = styled.div` display: flex; gap: 12px; `;