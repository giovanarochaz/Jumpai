import styled, { keyframes, css } from 'styled-components';

// --- PALETA DA FLORESTA ---
const TEMA = {
   madeiraClara: '#D2691E',  // Chocolate
   madeiraEscura: '#8B4513', // SaddleBrown
   verdeFolha: '#4ADE80',    // Green 400
   verdeEscuro: '#14532D',   // Green 900
   agua: '#0EA5E9',
   amareloOuro: '#FBBF24',
   branco: '#FFFFFF',
   sombraTexto: '2px 2px 0px #3E2723'
};

// --- ANIMAÇÕES ---
const popIn = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

const flutuar = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const brilho = keyframes`
  0% { filter: brightness(1); transform: scale(1); }
  50% { filter: brightness(1.2); transform: scale(1.05); }
  100% { filter: brightness(1); transform: scale(1); }
`;

// --- ESTRUTURA GERAL ---

export const FundoModal = styled.div`
   position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
   
   /* Fundo da Lagoa (Imagem do Projeto) */
   background-image: url('/assets/saltoAlfabetico/fundo_lagoa.png');
   background-size: cover;
   background-position: center;
   
   /* Overlay escuro para dar foco na placa */
   &:before {
      content: '';
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.6); 
      backdrop-filter: blur(3px);
   }

   display: flex; justify-content: center; align-items: center; z-index: 200;
   animation: ${popIn} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

export const ConteudoModal = styled.div`
   position: relative;
   
   /* Estilo de Placa de Madeira */
   background-color: ${TEMA.madeiraClara};
   background-image: linear-gradient(180deg, ${TEMA.madeiraClara} 0%, ${TEMA.madeiraEscura} 100%);
   border: 6px solid #5D4037;
   border-radius: 30px;
   box-shadow: 
      inset 0 0 20px rgba(0,0,0,0.5), /* Sombra interna */
      0 10px 20px rgba(0,0,0,0.5),    /* Sombra externa */
      0 20px 0 #3E2723;               /* Efeito 3D de espessura da madeira */

   color: ${TEMA.branco};
   padding: 40px;
   width: 90%; max-width: 800px; min-height: 550px;
   display: flex; flex-direction: column;
   animation: ${flutuar} 4s ease-in-out infinite;

   /* Parafusos nos cantos (Decorativo) */
   &::after {
      content: '';
      position: absolute; top: 15px; left: 15px;
      width: 15px; height: 15px;
      border-radius: 50%;
      background: #3E2723;
      box-shadow: 
         calc(100% - 30px + 800px * 0.9 - 60px) 0 0 #3E2723, /* Canto superior direito (hack css) */
         0 calc(100% - 30px + 550px - 80px) 0 #3E2723;       /* Canto inferior esquerdo */
   }
`;

// --- TIPOGRAFIA ---

export const TituloSlide = styled.h2`
   font-size: 3rem; 
   color: ${TEMA.amareloOuro};
   text-align: center;
   margin-bottom: 20px;
   text-transform: uppercase;
   font-weight: 900;
   text-shadow: 4px 4px 0px #3E2723;
   font-family: 'Comic Sans MS', cursive, sans-serif; /* Fonte lúdica */
`;

export const TextoExplicativo = styled.p`
   font-size: 1.3rem; 
   line-height: 1.6; 
   text-align: center;
   color: #FFF8E1; /* Creme claro */
   text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
   background-color: rgba(0,0,0,0.2);
   padding: 15px;
   border-radius: 15px;
   border: 2px dashed rgba(255,255,255,0.3);

   strong {
      color: ${TEMA.amareloOuro};
      font-weight: 800;
   }
`;

// --- ELEMENTOS INTERNOS ---

export const ContainerInfo = styled.div`
   flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
   gap: 20px;
`;

export const CaixaIcone = styled.div`
   background-color: ${TEMA.verdeFolha};
   color: ${TEMA.verdeEscuro};
   width: 90px; height: 90px;
   border-radius: 50%;
   border: 4px solid ${TEMA.branco};
   display: flex; justify-content: center; align-items: center;
   box-shadow: 0 5px 0 ${TEMA.verdeEscuro};
   margin-bottom: 10px;
`;

export const InfoRow = styled.div`
   display: flex; align-items: center; gap: 20px; text-align: left;
   background: rgba(255,255,255, 0.1); 
   padding: 15px; border-radius: 15px;
   border: 2px solid rgba(255,255,255,0.2);
   width: 100%; max-width: 650px;
`;

export const TextoRow = styled.div`
   h3 { color: ${TEMA.amareloOuro}; margin: 0 0 5px; text-shadow: 2px 2px 0 rgba(0,0,0,0.5); }
   p { margin: 0; font-size: 1.1rem; }
`;

// --- BOTÕES E NAVEGAÇÃO ---

export const BarraNavegacao = styled.div`
   display: flex; justify-content: space-between; width: 100%; margin-top: auto; padding-top: 20px;
`;

export const BotaoNav = styled.button<{ $destaque?: boolean }>`
   padding: 12px 24px; 
   border-radius: 20px; 
   font-weight: 900; 
   font-size: 1.1rem;
   text-transform: uppercase;
   cursor: pointer; 
   
   /* Estilo Botão de Madeira/Folha */
   background-color: ${({ $destaque }) => $destaque ? TEMA.amareloOuro : '#8D6E63'};
   color: ${({ $destaque }) => $destaque ? '#3E2723' : '#FFFFFF'};
   border: 3px solid #3E2723;
   box-shadow: 0 5px 0 #3E2723;
   
   transition: all 0.2s;

   ${({ $destaque }) => $destaque && css`animation: ${brilho} 1.5s infinite; transform: scale(1.1);`}

   &:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.1); }
   &:active:not(:disabled) { transform: translateY(2px); box-shadow: 0 0 0; }
   &:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(1); }
`;

// --- CONFIGURAÇÕES ---

export const ContainerConfig = styled.div`
   display: flex; flex-direction: column; gap: 15px; width: 100%;
`;

export const LinhaConfig = styled.div<{ $focado?: boolean }>`
   display: flex; align-items: center; justify-content: space-between;
   padding: 15px; 
   background: rgba(0,0,0,0.2); 
   border-radius: 15px;
   border: 3px solid transparent;
   transition: all 0.3s;

   ${({ $focado }) => $focado && css`
      border-color: ${TEMA.amareloOuro}; 
      background: rgba(0,0,0,0.4);
      transform: scale(1.02);
   `}
`;

export const Label = styled.div`
   display: flex; align-items: center; gap: 10px; font-size: 1.2rem; font-weight: bold;
   color: ${TEMA.branco}; text-shadow: 1px 1px 0 #000;
`;

export const GrupoBotoes = styled.div` display: flex; gap: 10px; `;

export const BotaoOpcao = styled.button<{ ativo: boolean }>`
   padding: 8px 16px; border-radius: 12px; font-weight: bold;
   border: 2px solid #3E2723;
   
   background-color: ${({ ativo }) => ativo ? TEMA.verdeFolha : '#A1887F'};
   color: ${({ ativo }) => ativo ? '#000' : '#DDD'};
   box-shadow: 0 3px 0 #3E2723;
   
   cursor: pointer;
   &:active { transform: translateY(3px); box-shadow: none; }
`;

export const ToggleContainer = styled.label`
   position: relative; display: inline-block; width: 60px; height: 34px;
   input { opacity: 0; width: 0; height: 0; }
   .slider {
      position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
      background-color: #5D4037; transition: .4s; border-radius: 34px; border: 2px solid #3E2723;
   }
   .slider:before {
      position: absolute; content: ""; height: 22px; width: 22px; left: 4px; bottom: 4px;
      background-color: white; transition: .4s; border-radius: 50%;
   }
   input:checked + .slider { background-color: ${TEMA.verdeFolha}; }
   input:checked + .slider:before { transform: translateX(26px); }
`;

export const BotaoIniciar = styled.button<{ $focado?: boolean }>`
   width: 100%; padding: 20px; margin-top: 10px;
   background-color: ${TEMA.verdeFolha}; 
   color: #064E3B;
   font-size: 1.8rem; font-weight: 900; border-radius: 20px;
   border: 4px solid #064E3B;
   box-shadow: 0 8px 0 #064E3B;
   cursor: pointer;
   text-transform: uppercase;
   transition: all 0.2s;

   ${({ $focado }) => $focado && css`
      background-color: ${TEMA.amareloOuro}; 
      color: #3E2723;
      transform: scale(1.05);
      animation: ${brilho} 1.5s infinite;
   `}
   
   &:active { transform: translateY(4px); box-shadow: 0 0 0; }
`;