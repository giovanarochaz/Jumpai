import styled, { keyframes, css } from 'styled-components';

const TEMA = {
   madeiraClara: '#D2691E',
   madeiraEscura: '#8B4513',
   verdeFolha: '#4ADE80',
   verdeEscuro: '#14532D',
   agua: '#0EA5E9',
   amareloOuro: '#FBBF24',
   branco: '#FFFFFF',
   laranjaFoguete: '#f97316',
};

const popIn = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

const pulse = keyframes` 
  0% { box-shadow: 0 0 0 0px ${TEMA.amareloOuro}; transform: scale(1); } 
  50% { box-shadow: 0 0 20px 5px rgba(251, 191, 36, 0.5); transform: scale(1.03); } 
  100% { box-shadow: 0 0 0 0px ${TEMA.amareloOuro}; transform: scale(1); } 
`;

export const FundoModal = styled.div`
   position: fixed; inset: 0; display: flex; justify-content: center; align-items: center; z-index: 999; padding: 20px;
   background-image: url('/assets/saltoAlfabetico/fundo_lagoa.png');
   background-size: cover; background-position: center;
   &:before {
      content: ''; position: absolute; inset: 0;
      background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(3px);
   }
`;

export const ConteudoModal = styled.div`
   position: relative; z-index: 1;
   background-color: ${TEMA.madeiraClara};
   background-image: linear-gradient(180deg, ${TEMA.madeiraClara} 0%, ${TEMA.madeiraEscura} 100%);
   border: 6px solid #5D4037; border-radius: 30px;
   box-shadow: inset 0 0 20px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.5), 0 20px 0 #3E2723;
   color: ${TEMA.branco}; padding: clamp(1rem, 3.5vh, 2.5rem);
   width: 95%; max-width: 900px; max-height: 92vh; 
   display: flex; flex-direction: column; overflow-y: auto;
   animation: ${popIn} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

export const TituloSlide = styled.h2`
   font-size: clamp(1.8rem, 4vw, 2.8rem); color: ${TEMA.amareloOuro};
   text-align: center; margin-bottom: 1.5vh; text-transform: uppercase;
   font-weight: 900; text-shadow: 3px 3px 0px #3E2723;
`;

export const TextoExplicativo = styled.p`
   font-size: clamp(1rem, 1.4vw, 1.25rem); line-height: 1.6; text-align: center;
   color: #FFF8E1; background-color: rgba(0,0,0,0.2);
   padding: 15px; border-radius: 15px; border: 2px dashed rgba(255,255,255,0.3);
   strong { color: ${TEMA.amareloOuro}; font-weight: 800; }
`;

export const ContainerInfo = styled.div` flex: 1; display: flex; flex-direction: column; align-items: center; gap: 15px; `;

export const CaixaIcone = styled.div`
   background-color: ${TEMA.verdeFolha}; color: ${TEMA.verdeEscuro};
   width: clamp(70px, 10vh, 100px); height: clamp(70px, 10vh, 100px);
   border-radius: 50%; border: 4px solid ${TEMA.branco};
   display: flex; justify-content: center; align-items: center;
   box-shadow: 0 5px 0 ${TEMA.verdeEscuro}; flex-shrink: 0;
   img, svg { width: 60%; height: 60%; object-fit: contain; }
`;

export const InfoRow = styled.div`
   display: flex; align-items: center; gap: 20px; width: 100%;
   background: rgba(255,255,255, 0.1); padding: 15px; border-radius: 15px;
   border: 2px solid rgba(255,255,255,0.2);
`;

export const TextoRow = styled.div`
   h3 { color: ${TEMA.amareloOuro}; margin: 0 0 5px; font-size: 1.2rem; }
   p { margin: 0; font-size: 1rem; color: #cbd5e1; }
`;

export const BarraNavegacao = styled.div`
   display: flex; justify-content: space-between; width: 100%; margin-top: auto; padding-top: 2vh;
`;

export const BotaoNav = styled.button<{ $destaque?: boolean }>`
   display: flex; align-items: center; gap: 8px;
   padding: clamp(10px, 1.8vh, 18px) clamp(18px, 3vw, 30px);
   border-radius: 20px; font-weight: 900; text-transform: uppercase;
   cursor: pointer; border: 3px solid #3E2723; box-shadow: 0 5px 0 #3E2723;
   background-color: ${({ $destaque }) => $destaque ? TEMA.amareloOuro : '#8D6E63'};
   color: ${({ $destaque }) => $destaque ? '#3E2723' : '#FFFFFF'};
   transition: all 0.2s;
   ${({ $destaque }) => $destaque && css` animation: ${pulse} 1.5s infinite; transform: scale(1.05); border-color: white; `}
   &:disabled { opacity: 0.5; filter: grayscale(1); }
`;

export const ContainerConfig = styled.div` display: flex; flex-direction: column; gap: 1.5vh; `;

export const LinhaConfig = styled.div<{ $focado?: boolean }>`
   display: flex; align-items: center; justify-content: space-between;
   padding: clamp(10px, 1.8vh, 18px); background: rgba(0,0,0,0.2);
   border-radius: 15px; border: 3px solid transparent; transition: all 0.3s;
   ${({ $focado }) => $focado && css`
      border-color: ${TEMA.amareloOuro}; background: rgba(0,0,0,0.4); transform: scale(1.02);
   `}
`;

export const Label = styled.div`
   display: flex; align-items: center; gap: 10px; font-size: 1.2rem; font-weight: bold;
   svg { color: ${TEMA.verdeFolha}; }
`;

export const GrupoBotoes = styled.div` display: flex; gap: 10px; `;

export const BotaoOpcao = styled.button<{ $ativo: boolean; $isFocused?: boolean }>`
   padding: 8px 16px; border-radius: 12px; font-weight: bold; border: 2px solid #3E2723;
   background-color: ${({ $ativo }) => $ativo ? TEMA.verdeFolha : '#A1887F'};
   color: ${({ $ativo }) => $ativo ? '#064E3B' : '#FFF'};
   cursor: pointer; transition: all 0.2s;
   ${({ $isFocused }) => $isFocused && css` background-color: ${TEMA.amareloOuro} !important; color: #3E2723 !important; transform: scale(1.1); `}
`;

export const ToggleContainer = styled.div`
   position: relative; width: 60px; height: 34px;
   .slider {
      position: absolute; inset: 0; background-color: #5D4037; border-radius: 34px;
      border: 2px solid #3E2723; transition: .4s;
      &:before { position: absolute; content: ""; height: 22px; width: 22px; left: 4px; bottom: 4px; background: white; border-radius: 50%; transition: .4s; }
   }
   input:checked + .slider { background-color: ${TEMA.verdeFolha}; }
   input:checked + .slider:before { transform: translateX(26px); }
`;

export const BotaoIniciar = styled.button<{ $focado?: boolean }>`
   width: 100%; padding: clamp(1.2rem, 3vh, 1.8rem); margin-top: 1.5vh;
   background-color: ${TEMA.verdeFolha}; color: #064E3B;
   font-size: clamp(1.3rem, 2vw, 1.8rem); font-weight: 900; border-radius: 20px;
   border: 4px solid #064E3B; box-shadow: 0 8px 0 #064E3B; cursor: pointer;
   text-transform: uppercase; transition: all 0.2s;
   ${({ $focado }) => $focado && css`
      animation: ${pulse} 1.5s infinite; background-color: ${TEMA.amareloOuro}; 
      color: #3E2723; transform: scale(1.02); border-color: white;
   `}
`;

export const InputInterruptor = styled.input`
   opacity: 0; 
   width: 0; 
   height: 0;
`;

export const DeslizadorInterruptor = styled.span`
   position: absolute; 
   inset: 0; 
   background-color: #5D4037; 
   border-radius: 34px;
   border: 2px solid #3E2723; 
   transition: .4s;

   &:before {
      position: absolute; 
      content: ""; 
      height: 22px; 
      width: 22px; 
      left: 4px; 
      bottom: 4px; 
      background: white; 
      border-radius: 50%; 
      transition: .4s;
   }

   ${InputInterruptor}:checked + & {
      background-color: ${TEMA.verdeFolha};
   }

   ${InputInterruptor}:checked + &:before {
      transform: translateX(26px);
   }
`;