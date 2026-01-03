import styled, { keyframes, css } from 'styled-components';

const TEMA = {
   espacoProfundo: '#020617',
   azulIon: '#22d3ee',        
   laranjaFoguete: '#f97316', 
   laranjaBrilhante: '#fb923c',
   azulAço: '#1e293b',
   vidroEscuro: 'rgba(7, 10, 25, 0.98)', 
};

const aparecer = keyframes` from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } `;
const rotar = keyframes` from { transform: rotate(0deg); } to { transform: rotate(360deg); } `;
const pulse = keyframes` 
  0% { box-shadow: 0 0 0 0px ${TEMA.laranjaFoguete}; border-color: white; transform: scale(1); } 
  50% { box-shadow: 0 0 20px 5px rgba(249, 115, 22, 0.5); border-color: white; transform: scale(1.03); } 
  100% { box-shadow: 0 0 0 0px ${TEMA.laranjaFoguete}; border-color: white; transform: scale(1); } 
`;

export const FundoModal = styled.div`
   position: fixed; inset: 0; display: flex; justify-content: center; align-items: center; z-index: 999; padding: 20px;
   background-color: ${TEMA.azulAço};
   background-image: 
       radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px),
       radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 2px),
       radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 3px);
   background-size: 550px 550px, 350px 350px, 250px 250px;
   background-position: 0 0, 40px 60px, 130px 270px;
`;

export const ConteudoModal = styled.div`
   background: ${TEMA.vidroEscuro}; border: 2px solid ${TEMA.azulIon}; border-radius: 24px;
   width: 95%; max-width: 1050px; max-height: 92vh; 
   padding: clamp(1rem, 3.5vh, 2.5rem); display: flex; flex-direction: column;
   position: relative; overflow-y: auto; animation: ${aparecer} 0.4s ease-out;
   box-shadow: 0 0 40px rgba(34, 211, 238, 0.2);
   &::-webkit-scrollbar { width: 6px; }
   &::-webkit-scrollbar-thumb { background: ${TEMA.azulIon}; border-radius: 10px; }
`;

export const ContainerSlide = styled.div`
   display: flex; align-items: center; gap: clamp(1rem, 5vw, 4rem);
   flex: 1; margin: 1.5vh 0;
   @media (max-width: 800px) { flex-direction: column; text-align: center; }
`;

export const PlanetaAnimado = styled.img`
   width: clamp(150px, 22vw, 260px); height: auto; animation: ${rotar} 150s linear infinite;
   filter: drop-shadow(0 0 25px rgba(34, 211, 238, 0.3));
`;

export const TextoSlide = styled.div`
   flex: 1;
   h2 { font-size: clamp(1.8rem, 4vw, 2.8rem); color: ${TEMA.azulIon}; margin-bottom: 0.8rem; text-transform: uppercase; letter-spacing: 2px; }
   p { font-size: clamp(1rem, 1.4vw, 1.2rem); line-height: 1.6; color: #cbd5e1; }
`;

export const ContainerExplicacao = styled.div` display: flex; flex-direction: column; gap: 12px; `;

export const SecaoExplicacao = styled.div`
   display: flex; gap: 1.2rem; padding: clamp(10px, 2vh, 18px);
   background: rgba(30, 41, 59, 0.5); border-radius: 12px;
   border: 1px solid rgba(34, 211, 238, 0.2); border-left: 6px solid ${TEMA.laranjaFoguete};
   align-items: center;
`;

export const WrapperIcone = styled.div`
   width: clamp(50px, 8vh, 65px); height: clamp(50px, 8vh, 65px);
   background: ${TEMA.espacoProfundo}; border: 2px solid ${TEMA.azulIon};
   border-radius: 50%; display: flex; justify-content: center; align-items: center;
   color: ${TEMA.azulIon}; flex-shrink: 0; svg { width: 50%; height: 50%; }
`;

export const WrapperTexto = styled.div`
   h3 { color: ${TEMA.laranjaFoguete}; font-size: clamp(1.1rem, 2vw, 1.3rem); margin: 0 0 4px 0; }
   p { font-size: clamp(0.9rem, 1.2vw, 1rem); color: #94a3b8; margin: 0; }
`;

export const ContainerConfiguracoes = styled.div` display: flex; flex-direction: column; gap: 1.2vh; `;

export const LinhaConfiguracao = styled.div<{ $isFocused: boolean }>`
   display: flex; justify-content: space-between; align-items: center;
   padding: clamp(8px, 1.5vh, 15px) 20px; background: rgba(30, 41, 59, 0.3);
   border-radius: 15px; transition: 0.3s;
   border: 2px solid ${props => props.$isFocused ? TEMA.laranjaFoguete : 'transparent'};
   ${props => props.$isFocused && css` background: rgba(249, 115, 22, 0.1); transform: scale(1.02); `}
   &:hover { background: rgba(34, 211, 238, 0.05); }
`;

export const RotuloConfiguracao = styled.div`
   display: flex; align-items: center; gap: 1rem;
   h3 { font-size: clamp(1rem, 1.5vw, 1.2rem); margin: 0; color: #fff; }
   svg { color: ${TEMA.azulIon}; width: 22px; }
`;

export const GrupoBotoes = styled.div` display: flex; gap: 8px; `;

export const BotaoOpcao = styled.button<{ $ativo: boolean; $isFocused?: boolean }>`
   padding: 0.7rem 1.1rem; border-radius: 8px; border: 1.5px solid ${TEMA.azulIon};
   background: ${props => props.$ativo ? TEMA.azulIon : 'transparent'};
   color: ${props => props.$ativo ? TEMA.espacoProfundo : TEMA.azulIon};
   font-weight: 800; font-size: 0.85rem; text-transform: uppercase; cursor: pointer;
   transition: all 0.2s ease;
   &:hover { border-color: white; box-shadow: 0 0 10px ${TEMA.azulIon}; transform: translateY(-2px); }
   ${props => props.$isFocused && css` background: ${TEMA.laranjaFoguete} !important; color: white !important; border-color: white; transform: scale(1.1); box-shadow: 0 0 15px ${TEMA.laranjaFoguete}; `}
`;

export const ContainerInterruptor = styled.div` position: relative; width: 55px; height: 28px; cursor: pointer; `;
export const InputInterruptor = styled.input` opacity: 0; width: 0; height: 0; `;
export const DeslizadorInterruptor = styled.span`
   position: absolute; inset: 0; background: #334155; transition: .4s; border-radius: 34px;
   &:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background: white; transition: .4s; border-radius: 50%; }
   ${InputInterruptor}:checked + & { background: ${TEMA.azulIon}; }
   ${InputInterruptor}:checked + &:before { transform: translateX(27px); }
`;

export const NavegacaoCarrossel = styled.div`
   display: flex; justify-content: space-between; align-items: center;
   margin-top: auto; padding-top: 1.5vh;
   span { font-family: 'monospace'; color: ${TEMA.azulIon}; font-size: clamp(1rem, 1.5vw, 1.2rem); font-weight: bold; letter-spacing: 2px; }
`;

export const BotaoNavegacao = styled.button<{ $isFocusedManual?: boolean }>`
   display: flex; align-items: center; gap: 10px;
   padding: clamp(10px, 1.8vh, 18px) clamp(18px, 3vw, 35px);
   background: transparent; color: white; border: 2px solid ${TEMA.laranjaFoguete};
   border-radius: 12px; font-weight: 800; text-transform: uppercase;
   font-size: clamp(0.8rem, 1.2vw, 1rem); cursor: pointer; transition: all 0.2s ease;
   &:hover { background: ${TEMA.laranjaFoguete}; box-shadow: 0 0 20px ${TEMA.laranjaFoguete}; transform: scale(1.05); }
   ${props => props.$isFocusedManual && css` animation: ${pulse} 1.5s infinite; background: ${TEMA.laranjaFoguete}; color: white; border-color: white; box-shadow: 0 0 15px ${TEMA.laranjaFoguete}; `}
`;

export const BotaoIniciarMissao = styled.button<{ $isFocused: boolean }>`
   width: 100%; padding: clamp(1.2rem, 3vh, 1.8rem); margin-top: 1.5vh;
   background: ${TEMA.laranjaFoguete}; color: white; border: none; border-radius: 12px; font-weight: 900;
   font-size: clamp(1.3rem, 2vw, 1.6rem); cursor: pointer; text-transform: uppercase; letter-spacing: 2px;
   box-shadow: 0 4px 0px #9a3412; transition: all 0.1s;
   &:hover { background: ${TEMA.laranjaBrilhante}; box-shadow: 0 0 25px ${TEMA.laranjaFoguete}, 0 4px 0px #9a3412; transform: translateY(-2px); }
   ${props => props.$isFocused && css` animation: ${pulse} 1.5s infinite; background: ${TEMA.laranjaFoguete}; border: 2px solid white; transform: scale(1.02); box-shadow: 0 0 25px ${TEMA.laranjaFoguete}; `}
`;