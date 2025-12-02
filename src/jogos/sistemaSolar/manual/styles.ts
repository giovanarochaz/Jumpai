import styled, { keyframes, css } from 'styled-components';

// --- PALETA ESPACIAL ---
const TEMA = {
   roxoFundo: '#2e1065',    // Roxo bem escuro (fundo profundo)
   roxoNeon: '#a855f7',     // Roxo brilhante (bordas/detalhes)
   azulEscuro: '#172554',   // Azul deep space
   amareloEstrela: '#facc15', // Amarelo para destaques
   amareloHover: '#fde047',
   branco: '#ffffff',
   vidroEscuro: 'rgba(15, 23, 42, 0.95)', // Fundo do modal com leve transparência
   sombraNeon: '0 0 10px #a855f7, 0 0 20px #a855f7' // Brilho neon
};

// --- ANIMAÇÕES ---

const aparecer = keyframes`
   from { transform: scale(0.9); opacity: 0; }
   to { transform: scale(1); opacity: 1; }
`;

const flutuarNoEspaco = keyframes`
   0% { transform: translateY(0px); }
   50% { transform: translateY(-10px); }
   100% { transform: translateY(0px); }
`;

const rotacionarPlaneta = keyframes`
   from { transform: rotate(0deg); }
   to { transform: rotate(360deg); }
`;

const brilhoNeon = keyframes`
   0%, 100% { box-shadow: 0 0 5px ${TEMA.roxoNeon}, inset 0 0 5px ${TEMA.roxoNeon}; }
   50% { box-shadow: 0 0 15px ${TEMA.roxoNeon}, inset 0 0 10px ${TEMA.roxoNeon}; }
`;

// Animação de foco para Eye Tracking
const focoPulsante = keyframes`
   0% { box-shadow: 0 0 0 0px ${TEMA.amareloEstrela}; transform: scale(1); }
   100% { box-shadow: 0 0 0 10px rgba(250, 204, 21, 0); transform: scale(1.05); }
`;

// --- COMPONENTES PRINCIPAIS ---

export const FundoModal = styled.div`
   position: fixed; top: 0; left: 0;
   width: 100vw; height: 100vh;
   background-color: rgba(0, 0, 0, 0.9); /* Fundo quase preto */
   display: flex; justify-content: center; align-items: center;
   z-index: 200;
   
   /* Efeito de estrelas ao fundo do modal */
   background-image: 
       radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px),
       radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 2px),
       radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 3px);
   background-size: 550px 550px, 350px 350px, 250px 250px;
   background-position: 0 0, 40px 60px, 130px 270px;
   
   animation: ${aparecer} 0.4s ease-out;
`;

export const ConteudoModal = styled.div`
   background-color: ${TEMA.vidroEscuro};
   color: ${TEMA.branco};
   padding: 40px;
   
   /* Borda Neon Futurista */
   border: 3px solid ${TEMA.roxoNeon};
   border-radius: 20px;
   box-shadow: ${TEMA.sombraNeon};
   
   width: 90%; max-width: 900px;
   min-height: 550px;
   display: flex; flex-direction: column; justify-content: space-between;
   position: relative;
   overflow: hidden;

   /* Linha decorativa 'tech' */
   &::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 4px;
      background: linear-gradient(90deg, transparent, ${TEMA.amareloEstrela}, transparent);
   }
`;

// --- SLIDES ---

export const ContainerSlide = styled.div`
   display: flex; align-items: center; gap: 40px;
`;

export const PlanetaAnimado = styled.img`
   width: 280px; height: 280px;
   object-fit: contain;
   filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.4));
   animation: ${rotacionarPlaneta} 60s linear infinite;
`;

export const TextoSlide = styled.div`
   flex: 1;
   h2 {
      font-size: 3rem; margin-bottom: 20px;
      color: ${TEMA.amareloEstrela};
      font-family: 'Orbitron', sans-serif; /* Sugestão de fonte, se não tiver usa sans */
      text-transform: uppercase;
   }
   p { 
      font-size: 1.3rem; 
      line-height: 1.6; 
      color: #e2e8f0;
      text-shadow: 1px 1px 2px black;
   }
`;

// --- EXPLICAÇÕES E INTRODUÇÃO ---

export const ContainerExplicacao = styled.div` 
   padding: 10px; 
   animation: ${aparecer} 0.5s ease;
`;

export const SecaoExplicacao = styled.div`
   display: flex; align-items: flex-start; gap: 20px; margin-bottom: 30px;
   background: rgba(255,255,255, 0.05);
   padding: 20px;
   border-radius: 15px;
   border-left: 4px solid ${TEMA.amareloEstrela};
`;

export const WrapperIcone = styled.div`
   background-color: ${TEMA.azulEscuro};
   color: ${TEMA.amareloEstrela};
   border-radius: 12px; width: 70px; height: 70px;
   display: flex; justify-content: center; align-items: center;
   flex-shrink: 0; 
   border: 2px solid ${TEMA.roxoNeon};
   box-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
`;

export const WrapperTexto = styled.div`
   h3 {
      margin: 0 0 8px 0; font-size: 1.6rem;
      color: ${TEMA.roxoNeon};
   }
   p { 
      margin: 0; font-size: 1.15rem; line-height: 1.5; color: #cbd5e1;
   }
`;

// --- CONFIGURAÇÕES ---

export const ContainerConfiguracoes = styled.div`
   padding: 10px; display: flex; flex-direction: column; gap: 20px;
`;

export const LinhaConfiguracao = styled.div<{ $isFocused?: boolean }>`
   display: flex; align-items: center; justify-content: space-between;
   background-color: rgba(255,255,255, 0.05);
   padding: 15px 25px; border-radius: 15px;
   border: 1px solid rgba(255,255,255,0.1);
   transition: all 0.3s ease;
   
   ${({ $isFocused }) => $isFocused && css`
      border-color: ${TEMA.amareloEstrela};
      background-color: rgba(250, 204, 21, 0.1);
      transform: scale(1.02);
      box-shadow: 0 0 15px rgba(250, 204, 21, 0.2);
   `}
`;

export const RotuloConfiguracao = styled.div`
   display: flex; align-items: center; gap: 15px;
   h3 { margin: 0; font-size: 1.3rem; color: ${TEMA.amareloEstrela}; }
   color: ${TEMA.branco};
`;

export const GrupoBotoes = styled.div` display: flex; gap: 15px; `;

export const BotaoOpcao = styled.button<{ ativo: boolean; $isFocused?: boolean }>`
   min-width: 110px; min-height: 45px;
   background-color: ${({ ativo }) => (ativo ? TEMA.roxoNeon : 'transparent')};
   color: ${({ ativo }) => (ativo ? TEMA.branco : TEMA.roxoNeon)};
   border: 2px solid ${TEMA.roxoNeon};
   border-radius: 8px; cursor: pointer;
   font-size: 1rem; font-weight: bold;
   text-transform: uppercase;
   transition: all 0.2s ease;
   box-shadow: ${({ ativo }) => (ativo ? `0 0 10px ${TEMA.roxoNeon}` : 'none')};

   ${({ $isFocused }) => $isFocused && css`
      background-color: ${TEMA.amareloEstrela};
      color: ${TEMA.azulEscuro};
      border-color: ${TEMA.amareloEstrela};
      transform: scale(1.1);
      box-shadow: 0 0 15px ${TEMA.amareloEstrela};
   `}
`;

export const ContainerInterruptor = styled.label`
   position: relative; display: inline-block; width: 60px; height: 34px;
`;

export const InputInterruptor = styled.input` opacity: 0; width: 0; height: 0; `;

export const DeslizadorInterruptor = styled.span`
   position: absolute; cursor: pointer;
   top: 0; left: 0; right: 0; bottom: 0;
   background-color: #334155; /* Cinza azulado */
   transition: .4s; border-radius: 34px;
   
   &:before {
      position: absolute; content: ""; height: 26px; width: 26px;
      left: 4px; bottom: 4px; background-color: white;
      transition: .4s; border-radius: 50%;
   }
   
   ${InputInterruptor}:checked + & { background-color: ${TEMA.roxoNeon}; box-shadow: 0 0 10px ${TEMA.roxoNeon}; }
   ${InputInterruptor}:checked + &:before { transform: translateX(26px); }
`;

// --- NAVEGAÇÃO ---

export const NavegacaoCarrossel = styled.div`
   display: flex; justify-content: space-between; align-items: center; margin-top: 25px;
   span {
      font-family: monospace; font-size: 1.2rem; color: ${TEMA.roxoNeon};
   }
`;

export const BotaoNavegacao = styled.button<{ $isFocusedManual?: boolean }>`
   min-width: 180px; min-height: 60px;
   background: linear-gradient(135deg, ${TEMA.azulEscuro}, #1e1b4b);
   color: ${TEMA.branco};
   border: 2px solid ${TEMA.amareloEstrela};
   border-radius: 12px;
   font-size: 1.1rem; font-weight: bold;
   text-transform: uppercase; letter-spacing: 1px;
   cursor: pointer;
   box-shadow: 0 4px 0 ${TEMA.amareloEstrela}; /* Efeito 3D */
   transition: all 0.1s;

   &:active:not(:disabled) {
      transform: translateY(4px);
      box-shadow: 0 0 0 transparent;
   }

   &:disabled {
      background: #334155; border-color: #475569; color: #94a3b8; box-shadow: none;
      cursor: not-allowed;
   }

   ${({ $isFocusedManual }) => $isFocusedManual && css`
      background: ${TEMA.amareloEstrela};
      color: ${TEMA.azulEscuro};
      border-color: ${TEMA.branco};
      animation: ${focoPulsante} 1s infinite;
      transform: translateY(2px);
      box-shadow: 0 2px 0 ${TEMA.branco};
   `}
`;

export const BotaoIniciarMissao = styled.button<{ $isFocused?: boolean }>`
   min-width: 350px; min-height: 70px;
   background: linear-gradient(90deg, ${TEMA.roxoNeon}, #7c3aed);
   color: ${TEMA.branco};
   border: none;
   border-radius: 35px;
   font-size: 1.5rem; font-weight: 900;
   text-transform: uppercase; letter-spacing: 2px;
   cursor: pointer;
   margin: 10px auto 0;
   box-shadow: 0 0 20px ${TEMA.roxoNeon};
   transition: all 0.3s;
   animation: ${brilhoNeon} 3s infinite;

   &:hover { transform: scale(1.05); }

   ${({ $isFocused }) => $isFocused && css`
      background: ${TEMA.amareloEstrela};
      color: ${TEMA.azulEscuro};
      transform: scale(1.1);
      box-shadow: 0 0 30px ${TEMA.amareloEstrela};
      animation: none;
   `}
`;