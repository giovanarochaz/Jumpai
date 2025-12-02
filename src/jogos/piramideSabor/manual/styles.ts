import styled, { keyframes, css } from 'styled-components';
import { cores } from '../../../estilos/cores'; 

// --- PALETA TEMÁTICA DO JOGO (DEFINIDA AQUI PARA GARANTIR O VISUAL) ---
const TEMA = {
   vermelho: '#ef4444',     // Cor da borda e detalhes (Ketchup)
   vermelhoEscuro: '#b91c1c', // Textos importantes
   amarelo: '#fbbf24',      // Botões e destaques (Queijo/Mostarda)
   amareloEscuro: '#d97706', // Hover dos botões
   marrom: '#78350f',       // Textos comuns e bordas (Pão/Carne)
   fundoRosa: '#fff1f2',    // Fundo do modal (suave)
   branco: '#ffffff',
   grid: 'rgba(239, 68, 68, 0.2)' // Cor da linha do grid (vermelho transparente)
};

// --- ANIMAÇÕES (Mantidas) ---
const aparecer = keyframes`
   from { transform: scale(0.8); opacity: 0; }
   to { transform: scale(1); opacity: 1; }
`;

const flutuarIngrediente = keyframes`
   0% { transform: translateY(0px) scale(1) rotate(0deg); }
   50% { transform: translateY(-15px) scale(1.05) rotate(5deg); }
   100% { transform: translateY(0px) scale(1) rotate(0deg); }
`;

const pulsar = keyframes`
   0% { transform: scale(1); }
   70% { transform: scale(1.05); }
   100% { transform: scale(1); }
`;

const focoPulsante = keyframes`
   0% { box-shadow: 0 0 0 0px ${TEMA.amarelo}; }
   100% { box-shadow: 0 0 0 10px rgba(251, 191, 36, 0); }
`;


// --- COMPONENTES PRINCIPAIS ---

export const FundoModal = styled.div`
   position: fixed; top: 0; left: 0;
   width: 100vw; height: 100vh;
   background-color: rgba(50, 20, 0, 0.85); /* Fundo escuro levemente marrom */
   display: flex; justify-content: center; align-items: center;
   z-index: 200;
   animation: ${aparecer} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

export const ConteudoModal = styled.div`
   /* FUNDO QUADRICULADO IGUAL AO DO JOGO */
   background-color: ${TEMA.fundoRosa};
   background-image:
      linear-gradient(${TEMA.grid} 1px, transparent 1px),
      linear-gradient(90deg, ${TEMA.grid} 1px, transparent 1px);
   background-size: 40px 40px; /* Grid um pouco menor que o do jogo para o texto ler bem */
   
   color: ${TEMA.marrom};
   padding: 40px;
   border: 6px solid ${TEMA.vermelho}; /* Borda Vermelha estilo Lanchonete */
   border-radius: 30px;
   width: 90%; max-width: 800px;
   min-height: 500px;
   box-shadow: 8px 8px 0px ${TEMA.marrom};
   display: flex; flex-direction: column; justify-content: space-between;
   position: relative;
   
   /* Efeito de papel/cardápio */
   &::before {
      content: '';
      position: absolute;
      top: 5px; left: 5px; right: 5px; bottom: 5px;
      border: 2px dashed ${TEMA.vermelho};
      border-radius: 20px;
      pointer-events: none;
   }
`;

// --- COMPONENTES DOS SLIDES ---
export const ContainerSlide = styled.div`
   display: flex; align-items: center; gap: 30px;
   z-index: 2; /* Ficar acima do grid */
`;

export const IngredienteAnimado = styled.img`
   width: 250px;
   height: 250px;
   object-fit: contain;
   filter: drop-shadow(5px 5px 0px rgba(0,0,0,0.2));
   animation: ${flutuarIngrediente} 4s ease-in-out infinite;
`;

export const TextoSlide = styled.div`
   flex: 1;
   background: rgba(255, 255, 255, 0.9); /* Fundo branco para ler melhor no grid */
   padding: 20px;
   margin-bottom: 25px;
   border-radius: 15px;
   border: 3px solid ${TEMA.marrom};
   box-shadow: 4px 4px 0px rgba(0,0,0,0.1);

   h2 {
      font-size: 2.8rem; margin-bottom: 15px;
      color: ${TEMA.vermelho}; /* Título em vermelho */
      font-weight: 900; text-align: left;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-shadow: 2px 2px 0px ${TEMA.branco};
   }
   p { 
      font-size: 1.2rem; 
      line-height: 1.6;
      color: ${TEMA.marrom};
      strong {
        color: ${TEMA.vermelhoEscuro};
        font-weight: 800;
      }
   }
`;

export const ContainerExplicacao = styled.div` 
   padding: 10px; 
   z-index: 2;
`;

export const SecaoExplicacao = styled.div`
   display: flex; align-items: flex-start; gap: 20px; margin-bottom: 25px;
   background: rgba(255, 255, 255, 0.85);
   padding: 15px;
   border-radius: 15px;
   border-bottom: 4px solid ${TEMA.amarelo};
`;

export const WrapperIcone = styled.div`
   background-color: ${TEMA.amarelo};
   color: ${TEMA.marrom};
   border-radius: 50%; width: 60px; height: 60px;
   display: flex; justify-content: center; align-items: center;
   flex-shrink: 0; border: 3px solid ${TEMA.marrom};
   box-shadow: 2px 2px 0px rgba(0,0,0,0.2);
`;

export const WrapperTexto = styled.div`
   h3 {
      margin: 0 0 5px 0; font-size: 1.5rem;
      color: ${TEMA.vermelho};
      font-weight: 800;
   }
   p { 
      margin: 0; 
      font-size: 1.1rem; 
      line-height: 1.5; 
      strong {
         color: ${TEMA.vermelhoEscuro};
      }
   }
`;

// --- COMPONENTES DA TELA DE CONFIGURAÇÕES ---
export const ContainerConfiguracoes = styled.div`
   padding: 10px; display: flex; flex-direction: column; gap: 25px;
   z-index: 2;
`;

export const LinhaConfiguracao = styled.div<{ $isFocused?: boolean }>`
   display: flex; align-items: center; justify-content: space-between;
   background-color: ${TEMA.branco};
   padding: 15px; border-radius: 15px;
   border: 3px solid ${TEMA.marrom};
   box-shadow: 4px 4px 0px rgba(0,0,0,0.1);
   transition: all 0.3s ease;
   
   ${({ $isFocused }) => $isFocused && css`
      border-color: ${TEMA.vermelho};
      transform: scale(1.02);
      box-shadow: 6px 6px 0px ${TEMA.amarelo};
   `}
`;

export const RotuloConfiguracao = styled.div`
   display: flex; align-items: center; gap: 15px;
   color: ${TEMA.vermelho};
   h3 {
      margin: 0; font-size: 1.2rem; font-weight: 800;
   }
`;

export const GrupoBotoes = styled.div` display: flex; gap: 10px; `;

export const BotaoOpcao = styled.button<{ ativo: boolean; $isFocused?: boolean }>`
   min-width: 100px; min-height: 40px;
   background-color: ${({ ativo }) => (ativo ? TEMA.amarelo : TEMA.branco)};
   color: ${TEMA.marrom};
   border: 3px solid ${TEMA.marrom};
   border-radius: 20px; cursor: pointer;
   box-shadow: 4px 4px 0px ${({ ativo }) => (ativo ? TEMA.marrom : '#ccc')};
   font-size: 1rem; font-weight: bold;
   transition: all 0.15s ease-out;

   &:hover {
      background-color: ${TEMA.amarelo};
   }

   ${({ $isFocused }) => $isFocused && css`
      background-color: ${TEMA.amarelo};
      border-color: ${TEMA.vermelho};
      animation: ${focoPulsante} 1s infinite;
      transform: scale(1.1);
   `}
`;

export const ContainerInterruptor = styled.label`
   position: relative; display: inline-block; width: 60px; height: 34px;
`;

export const InputInterruptor = styled.input` opacity: 0; width: 0; height: 0; `;

export const DeslizadorInterruptor = styled.span`
   position: absolute; cursor: pointer;
   top: 0; left: 0; right: 0; bottom: 0;
   background-color: #e5e7eb; /* Cinza claro */
   border: 2px solid ${TEMA.marrom};
   transition: .4s; border-radius: 34px;
   &:before {
      position: absolute; content: ""; height: 22px; width: 22px;
      left: 4px; bottom: 4px; background-color: ${TEMA.marrom};
      transition: .4s; border-radius: 50%;
   }
   ${InputInterruptor}:checked + & { background-color: ${TEMA.amarelo}; }
   ${InputInterruptor}:checked + &:before { transform: translateX(26px); background-color: ${TEMA.branco}; }
`;

// --- BOTÕES DE NAVEGAÇÃO E AÇÃO ---
export const NavegacaoCarrossel = styled.div`
   display: flex; justify-content: space-between; align-items: center; margin-top: 20px;
   z-index: 10;
   
   span {
      font-weight: bold;
      color: ${TEMA.vermelhoEscuro};
      background: ${TEMA.branco};
      padding: 5px 15px;
      border-radius: 15px;
      border: 2px solid ${TEMA.marrom};
   }
`;

export const BotaoNavegacao = styled.button<{ $isFocusedManual?: boolean }>`
   min-width: 180px; min-height: 60px; 
   background-color: ${TEMA.branco};
   color: ${TEMA.vermelho}; 
   border: 3px solid ${TEMA.vermelho};
   border-radius: 20px; cursor: pointer;
   box-shadow: 4px 4px 0px ${TEMA.vermelhoEscuro};
   font-size: 1.1rem; font-weight: 800;
   transition: all 0.15s ease-out;

   ${({ $isFocusedManual }) => $isFocusedManual && css`
      background-color: ${TEMA.amarelo};
      color: ${TEMA.marrom};
      border-color: ${TEMA.marrom};
      animation: ${focoPulsante} 1s infinite;
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0px ${TEMA.marrom};
   `}

   &:hover:not(:disabled) {
      background-color: ${TEMA.amarelo}; 
      color: ${TEMA.marrom};
      border-color: ${TEMA.marrom};
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0px ${TEMA.marrom};
   }
   &:active:not(:disabled) {
      transform: translate(4px, 4px); box-shadow: 0px 0px 0px transparent;
   }
   &:disabled {
      background-color: #f3f4f6;
      color: #9ca3af;
      border-color: #d1d5db;
      box-shadow: none;
      cursor: not-allowed;
   }
`;

export const BotaoIniciarMissao = styled.button<{ $isFocused?: boolean }>`
   min-width: 350px; min-height: 70px;
   background-color: ${TEMA.vermelho}; /* Botão de ação VERMELHO */
   color: ${TEMA.branco}; 
   border: 4px solid ${TEMA.marrom};
   border-radius: 35px; cursor: pointer;
   box-shadow: 6px 6px 0px ${TEMA.marrom};
   font-size: 1.8rem; font-weight: 900;
   text-transform: uppercase;
   letter-spacing: 1px;
   margin: 10px auto 0;
   transition: all 0.15s ease-out;
   animation: ${pulsar} 2s infinite;

   &:hover { 
      background-color: ${TEMA.vermelhoEscuro};
      transform: translate(3px, 3px); 
      box-shadow: 3px 3px 0px ${TEMA.marrom}; 
   }
   &:active { 
      transform: translate(6px, 6px); 
      box-shadow: 0px 0px 0px transparent; 
      animation: none; 
   }

   ${({ $isFocused }) => $isFocused && css`
      animation: ${pulsar} 1.5s infinite, ${focoPulsante} 1.5s infinite;
      transform: scale(1.05);
      background-color: ${TEMA.amarelo};
      color: ${TEMA.marrom};
   `}
`;