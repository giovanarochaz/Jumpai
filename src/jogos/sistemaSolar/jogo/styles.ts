import styled, { keyframes, css } from 'styled-components';

const TEMA = {
   espacoProfundo: '#020617',
   azulIon: '#22d3ee',        
   laranjaFoguete: '#f97316', 
   laranjaBrilhante: '#fb923c',
   verdeSucesso: '#22c55e',   
   azulAço: '#1e293b',
   vidroEscuro: 'rgba(7, 10, 25, 0.98)', 
   brancoEstrela: '#f8fafc',
};

// Função para criar o campo de estrelas procedural
const gerarEstrelas = (quantidade: number) => {
   let boxShadow = '';
   for (let i = 0; i < quantidade; i++) { 
      boxShadow += `${Math.random() * 2000}px ${Math.random() * 2000}px ${TEMA.brancoEstrela},`; 
   }
   return boxShadow.slice(0, -1);
};

const aparecer = keyframes` from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } `;
const animacaoEstrelas = keyframes` from { transform: translateY(0px); } to { transform: translateY(-2000px); } `;
const moverPlaneta = keyframes` from { transform: translateX(105vw); } to { transform: translateX(-150%); } `;
const flutuar = keyframes` 0% { transform: translateY(-8px) rotate(-1deg); } 100% { transform: translateY(8px) rotate(1deg); } `;
const tremer = keyframes` 10%, 90% { transform: translateX(-2%); } 20%, 80% { transform: translateX(2%); } 100% { transform: translateX(0); } `;
const pulse = keyframes` 
   0% { box-shadow: 0 0 0 0px ${TEMA.laranjaFoguete}; border-color: white; } 
   50% { box-shadow: 0 0 20px 5px rgba(249, 115, 22, 0.6); border-color: white; } 
   100% { box-shadow: 0 0 0 0px ${TEMA.laranjaFoguete}; } 
`;

export const FundoEspacial = styled.div`
   position: fixed; inset: 0; width: 100vw; height: 100vh;
   background-color: ${TEMA.azulAço};
   background-image: 
       radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px),
       radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 2px),
       radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 3px);
   background-size: 550px 550px, 350px 350px, 250px 250px;
   background-position: 0 0, 40px 60px, 130px 270px;
   overflow: hidden; z-index: 1;
`;

export const EstrelasPequenas = styled.div`
   width: 1px; height: 1px; background: transparent;
   box-shadow: ${gerarEstrelas(600)};
   animation: ${animacaoEstrelas} 60s linear infinite;
   opacity: 0.4;
   &::after { content: " "; position: absolute; top: 2000px; width: 1px; height: 1px; box-shadow: ${gerarEstrelas(600)}; }
`;

export const EstrelasMedias = styled.div`
   width: 2px; height: 2px; background: transparent;
   box-shadow: ${gerarEstrelas(200)};
   animation: ${animacaoEstrelas} 100s linear infinite;
   opacity: 0.6;
   &::after { content: " "; position: absolute; top: 2000px; width: 2px; height: 2px; box-shadow: ${gerarEstrelas(200)}; }
`;

export const EstrelasGrandes = styled.div`
   width: 3px; height: 3px; background: transparent;
   box-shadow: ${gerarEstrelas(100)};
   animation: ${animacaoEstrelas} 150s linear infinite;
   &::after { content: " "; position: absolute; top: 2000px; width: 3px; height: 3px; box-shadow: ${gerarEstrelas(100)}; }
`;

// --- GAMEPLAY ---
export const AstronautaWrapper = styled.div<{ $top: string; $left: string }>`
   position: absolute;
   top: ${({ $top }) => $top};
   left: ${({ $left }) => $left};
   transform: translateX(-50%);
   transition: top 1.2s cubic-bezier(0.4, 0, 0.2, 1), left 1.5s cubic-bezier(0.7, 0, 0.3, 1);
   display: flex; flex-direction: column; align-items: center; z-index: 20;
`;

export const AstronautaImg = styled.img<{ $colidindo: boolean }>`
   width: clamp(100px, 18vh, 180px);
   height: auto;
   filter: drop-shadow(0 0 15px ${TEMA.azulIon});
   animation: ${({ $colidindo }) => $colidindo
      ? css`${tremer} 0.2s linear infinite`
      : css`${flutuar} 3s ease-in-out infinite alternate`
   };
`;

export const Planeta = styled.img<{ $top: number; $duracao: number; $tamanho: number }>`
   position: absolute; left: 0; top: ${({ $top }) => $top}%; 
   width: ${({ $tamanho }) => $tamanho}px; height: auto;
   animation: ${moverPlaneta} ${({ $duracao }) => $duracao}s linear forwards;
   will-change: transform; z-index: 5;
`;

// --- HUD E INTERFACE ---
export const HudContainer = styled.div`
   position: fixed; top: 0; left: 50%; transform: translateX(-50%);
   background: ${TEMA.vidroEscuro}; padding: clamp(5px, 1.5vh, 12px) clamp(15px, 3vw, 30px);
   border-radius: 0 0 25px 25px; border: 2px solid ${TEMA.azulIon}; border-top: none;
   display: flex; justify(center); align-items: center; gap: clamp(8px, 2vw, 20px);
   z-index: 100; box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
`;

export const HudPlanetaImagem = styled.img<{ $coletado: boolean }>`
   height: clamp(25px, 5vh, 45px); width: auto;
   opacity: ${({ $coletado }) => ($coletado ? '1' : '0.2')};
   filter: ${({ $coletado }) => ($coletado ? `drop-shadow(0 0 10px ${TEMA.azulIon})` : 'grayscale(100%)')};
   transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
   transform: ${({ $coletado }) => ($coletado ? 'scale(1.15)' : 'scale(0.85)')};
`;

export const LinhaConfiguracao = styled.div<{ $isFocused: boolean }>`
   display: flex; justify-content: space-between; align-items: center;
   padding: clamp(8px, 1.5vh, 15px) 20px; background: rgba(30, 41, 59, 0.3);
   border-radius: 15px; transition: 0.3s;
   border: 2px solid ${props => props.$isFocused ? TEMA.laranjaFoguete : 'transparent'};
   &:hover { background: rgba(34, 211, 238, 0.05); }
   ${props => props.$isFocused && css` background: rgba(249, 115, 22, 0.1); transform: scale(1.02); `}
`;

export const BotaoOpcao = styled.button<{ $ativo: boolean; $isFocused?: boolean }>`
   padding: 0.7rem 1.1rem; border-radius: 8px; border: 1.5px solid ${TEMA.azulIon};
   background: ${props => props.$ativo ? TEMA.azulIon : 'transparent'};
   color: ${props => props.$ativo ? TEMA.espacoProfundo : TEMA.azulIon};
   font-weight: 800; font-size: 0.85rem; text-transform: uppercase; cursor: pointer;
   transition: all 0.2s ease;
   &:hover { border-color: white; box-shadow: 0 0 10px ${TEMA.azulIon}; }
   ${props => props.$isFocused && css` background: ${TEMA.laranjaFoguete} !important; color: white !important; border-color: white; transform: scale(1.1); box-shadow: 0 0 15px ${TEMA.laranjaFoguete}; `}
`;

export const BotaoNavegacao = styled.button<{ $isFocusedManual?: boolean }>`
   display: flex; align-items: center; gap: 10px;
   padding: clamp(10px, 1.8vh, 18px) clamp(18px, 3vw, 35px);
   background: transparent; color: white; border: 2px solid ${TEMA.laranjaFoguete};
   border-radius: 12px; font-weight: 800; text-transform: uppercase;
   font-size: clamp(0.8rem, 1.2vw, 1rem); cursor: pointer; transition: 0.2s ease;
   &:hover { background: ${TEMA.laranjaFoguete}; box-shadow: 0 0 20px ${TEMA.laranjaFoguete}; transform: scale(1.05); }
   ${props => props.$isFocusedManual && css` animation: ${pulse} 1.5s infinite; background: ${TEMA.laranjaFoguete}; color: white; border-color: white; box-shadow: 0 0 15px ${TEMA.laranjaFoguete}; `}
`;

export const BotaoIniciarMissao = styled.button<{ $isFocused: boolean }>`
   width: 100%; padding: clamp(1.2rem, 3vh, 1.8rem); margin-top: 1.5vh;
   background: ${TEMA.laranjaFoguete}; color: white; border: none; border-radius: 12px; font-weight: 900;
   font-size: clamp(1.3rem, 2vw, 1.6rem); cursor: pointer; text-transform: uppercase; letter-spacing: 2px;
   box-shadow: 0 4px 0px #9a3412; transition: all 0.1s;
   ${props => props.$isFocused && css` animation: ${pulse} 1.5s infinite; background: ${TEMA.laranjaFoguete}; border: 2px solid white; transform: scale(1.02); `}
`;

export const NomePlanetaAnuncio = styled.div`
   position: fixed; top: 40%; left: 50%; transform: translate(-50%, -50%);
   color: ${TEMA.brancoEstrela}; font-size: clamp(2.5rem, 8vw, 5rem); font-weight: 900;
   text-transform: uppercase; letter-spacing: 5px; z-index: 150; pointer-events: none;
   text-shadow: 0 0 20px ${TEMA.azulIon}, 0 0 40px ${TEMA.azulIon};
`;

export const ContainerFaiscas = styled.div<{ top: number; left: number }>`
   position: absolute; top: ${({ top }) => top}px; left: ${({ left }) => left}px;
   width: 1px; height: 1px; pointer-events: none; z-index: 20;
`;

export const Faisca = styled.div`
   position: absolute; width: 8px; height: 8px; background: ${TEMA.laranjaFoguete}; border-radius: 50%;
   animation: ${aparecer} 0.5s ease-out forwards;
   &:nth-child(odd) { background: ${TEMA.azulIon}; }
`;

export const TextoSlide = styled.div` flex: 1; h2 { font-size: clamp(1.8rem, 4vw, 2.8rem); color: ${TEMA.azulIon}; margin-bottom: 0.8rem; text-transform: uppercase; } p { font-size: clamp(1rem, 1.4vw, 1.2rem); line-height: 1.6; color: #cbd5e1; } `;
export const ContainerExplicacao = styled.div` display: flex; flex-direction: column; gap: 12px; `;
export const WrapperIcone = styled.div` width: clamp(50px, 8vh, 65px); height: clamp(50px, 8vh, 65px); background: ${TEMA.espacoProfundo}; border: 2px solid ${TEMA.azulIon}; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: ${TEMA.azulIon}; flex-shrink: 0; svg { width: 50%; height: 50%; } `;
export const WrapperTexto = styled.div` h3 { color: ${TEMA.laranjaFoguete}; font-size: clamp(1.1rem, 2vw, 1.3rem); margin: 0 0 4px 0; } p { font-size: clamp(0.9rem, 1.2vw, 1rem); color: #94a3b8; margin: 0; } `;
export const RotuloConfiguracao = styled.div` display: flex; align-items: center; gap: 1rem; h3 { font-size: clamp(1rem, 1.5vw, 1.2rem); margin: 0; color: #fff; } svg { color: ${TEMA.azulIon}; width: 22px; } `;
export const GrupoBotoes = styled.div` display: flex; gap: 8px; `;
export const ContainerInterruptor = styled.div` position: relative; width: 55px; height: 28px; cursor: pointer; `;
export const InputInterruptor = styled.input` opacity: 0; width: 0; height: 0; `;
export const DeslizadorInterruptor = styled.span` position: absolute; inset: 0; background: #334155; transition: .4s; border-radius: 34px; &:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background: white; transition: .4s; border-radius: 50%; } ${InputInterruptor}:checked + & { background: ${TEMA.azulIon}; } ${InputInterruptor}:checked + &:before { transform: translateX(27px); } `;