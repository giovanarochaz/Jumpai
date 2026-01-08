import styled, { keyframes, css } from 'styled-components';

const TEMA = {
   vermelho: '#ef4444',     
   vermelhoEscuro: '#b91c1c', 
   amarelo: '#fbbf24',      
   amareloEscuro: '#d97706', 
   marrom: '#78350f',       
   fundoRosa: '#fff1f2',    
   branco: '#ffffff',
   grid: 'rgba(239, 68, 68, 0.2)' 
};

const aparecer = keyframes` from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } `;
const flutuar = keyframes` 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } `;
const pulsar = keyframes` 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } `;
const focoPulsante = keyframes` 0% { box-shadow: 0 0 0 0px ${TEMA.amarelo}; } 100% { box-shadow: 0 0 0 10px rgba(251, 191, 36, 0); } `;

export const FundoModal = styled.div`
   position: fixed; inset: 0; background-color: rgba(50, 20, 0, 0.85);
   display: flex; justify-content: center; align-items: center; z-index: 200;
`;

export const ConteudoModal = styled.div`
   background-color: ${TEMA.fundoRosa};
   background-image: linear-gradient(${TEMA.grid} 1px, transparent 1px), linear-gradient(90deg, ${TEMA.grid} 1px, transparent 1px);
   background-size: 40px 40px; color: ${TEMA.marrom}; padding: 40px;
   border: 6px solid ${TEMA.vermelho}; border-radius: 30px; width: 90%; max-width: 850px;
   box-shadow: 8px 8px 0px ${TEMA.marrom}; display: flex; flex-direction: column;
   position: relative; animation: ${aparecer} 0.4s ease-out;
   &::before { content: ''; position: absolute; inset: 5px; border: 2px dashed ${TEMA.vermelho}; border-radius: 20px; pointer-events: none; }
`;

export const ContainerSlide = styled.div` display: flex; align-items: center; gap: 30px; z-index: 2; `;

export const IngredienteAnimado = styled.img`
   width: 220px; height: 220px; object-fit: contain;
   filter: drop-shadow(5px 5px 0px rgba(0,0,0,0.1));
   animation: ${flutuar} 4s ease-in-out infinite;
`;

export const TextoSlide = styled.div`
   flex: 1; background: rgba(255, 255, 255, 0.9); padding: 20px;
   border-radius: 15px; border: 3px solid ${TEMA.marrom};
   h2 { font-size: 2.5rem; color: ${TEMA.vermelho}; font-weight: 900; text-transform: uppercase; margin-bottom: 10px; }
   p { font-size: 1.2rem; line-height: 1.6; color: ${TEMA.marrom}; }
`;

export const ContainerExplicacao = styled.div` z-index: 2; `;

export const SecaoExplicacao = styled.div`
   display: flex; align-items: center; gap: 20px; margin-bottom: 20px;
   background: rgba(255, 255, 255, 0.85); padding: 15px; border-radius: 15px;
   border-bottom: 4px solid ${TEMA.amarelo};
`;

export const WrapperIcone = styled.div`
   background: ${TEMA.amarelo}; color: ${TEMA.marrom}; border-radius: 50%;
   width: 60px; height: 60px; display: flex; justify-content: center; align-items: center;
   border: 3px solid ${TEMA.marrom}; flex-shrink: 0;
   svg { width: 32px; height: 32px; }
`;

export const WrapperTexto = styled.div`
   h3 { color: ${TEMA.vermelho}; margin: 0; font-size: 1.4rem; }
   p { margin: 0; font-size: 1.1rem; }
`;

export const ContainerConfiguracoes = styled.div` display: flex; flex-direction: column; gap: 15px; z-index: 2; `;

export const LinhaConfiguracao = styled.div<{ $isFocused: boolean }>`
   display: flex; justify-content: space-between; align-items: center;
   background: white; padding: 15px; border-radius: 15px; border: 3px solid ${TEMA.marrom};
   transition: 0.3s;
   ${props => props.$isFocused && css` border-color: ${TEMA.vermelho}; transform: scale(1.02); box-shadow: 6px 6px 0px ${TEMA.amarelo}; `}
`;

export const RotuloConfiguracao = styled.div`
   display: flex; align-items: center; gap: 15px; color: ${TEMA.vermelho};
   h3 { margin: 0; font-size: 1.2rem; }
`;

export const GrupoBotoes = styled.div` display: flex; gap: 10px; `;

export const BotaoOpcao = styled.button<{ ativo: boolean; $isFocused?: boolean }>`
   padding: 10px 20px; border-radius: 20px; border: 3px solid ${TEMA.marrom};
   background: ${props => props.ativo ? TEMA.amarelo : 'white'};
   font-weight: bold; cursor: pointer;
   ${props => props.$isFocused && css` animation: ${focoPulsante} 1s infinite; transform: scale(1.1); border-color: ${TEMA.vermelho}; `}
`;

export const ContainerInterruptor = styled.div` position: relative; width: 60px; height: 34px; `;
export const InputInterruptor = styled.input` opacity: 0; width: 0; height: 0; `;
export const DeslizadorInterruptor = styled.span`
   position: absolute; inset: 0; background: #e5e7eb; border: 2px solid ${TEMA.marrom}; border-radius: 34px; transition: .4s;
   &:before { content: ""; position: absolute; height: 22px; width: 22px; left: 4px; bottom: 4px; background: ${TEMA.marrom}; transition: .4s; border-radius: 50%; }
   ${InputInterruptor}:checked + & { background: ${TEMA.amarelo}; }
   ${InputInterruptor}:checked + &:before { transform: translateX(26px); background: white; }
`;

export const NavegacaoCarrossel = styled.div`
   display: flex; justify-content: space-between; align-items: center; margin-top: 20px;
   span { font-weight: bold; color: ${TEMA.vermelhoEscuro}; background: white; padding: 5px 15px; border-radius: 15px; border: 2px solid ${TEMA.marrom}; }
`;

export const BotaoNavegacao = styled.button<{ $isFocusedManual?: boolean }>`
   padding: 15px 30px; border-radius: 20px; border: 3px solid ${TEMA.vermelho};
   background: white; color: ${TEMA.vermelho}; font-weight: 800; cursor: pointer;
   display: flex; align-items: center; gap: 10px; transition: 0.2s;
   &:hover { background: ${TEMA.amarelo}; color: ${TEMA.marrom}; border-color: ${TEMA.marrom}; }
   ${props => props.$isFocusedManual && css` animation: ${focoPulsante} 1s infinite; background: ${TEMA.amarelo}; color: ${TEMA.marrom}; border-color: ${TEMA.marrom}; `}
`;

export const BotaoIniciarMissao = styled.button<{ $isFocused: boolean }>`
   width: 100%; padding: 20px; border-radius: 35px; border: 4px solid ${TEMA.marrom};
   background: ${TEMA.vermelho}; color: white; font-size: 1.8rem; font-weight: 900;
   cursor: pointer; box-shadow: 6px 6px 0px ${TEMA.marrom}; animation: ${pulsar} 2s infinite;
   ${props => props.$isFocused && css` background: ${TEMA.amarelo}; color: ${TEMA.marrom}; transform: scale(1.05); `}
`;