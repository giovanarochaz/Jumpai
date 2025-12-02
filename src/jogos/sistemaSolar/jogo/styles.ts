import styled, { keyframes, css } from 'styled-components';
import { cores } from '../../../estilos/cores';

const gerarEstrelas = (quantidade: number) => {
 let boxShadow = '';
 for (let i = 0; i < quantidade; i++) { boxShadow += `${Math.random() * 2000}px ${Math.random() * 2000}px #FFF,`; }
 return boxShadow.slice(0, -1);
};

const animacaoEstrelas = keyframes`from { transform: translateY(0px); } to { transform: translateY(-2000px); }`;
const moverPlaneta = keyframes`from { transform: translateX(100vw); } to { transform: translateX(-100%); }`;
const flutuar = keyframes`0% { transform: translateX(-50%) translateY(-6px) rotate(-2deg); } 100% { transform: translateX(-50%) translateY(6px) rotate(2deg); }`;
const tremer = keyframes`10%, 90% { transform: translateX(-51%); } 20%, 80% { transform: translateX(-49%); } 30%, 50%, 70% { transform: translateX(-52%); } 40%, 60% { transform: translateX(-48%); }`;
const faisca = keyframes`0% { transform: scale(0) rotate(0deg); opacity: 1; } 100% { transform: scale(1.5) rotate(360deg); opacity: 0; }`;
const aparecerSumir = keyframes`0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; } 20%, 80% { transform: translate(-50%, -50%) scale(1); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }`;

export const FundoEspacial = styled.div`
 position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
 background: linear-gradient(to bottom, ${cores.preto}, ${cores.roxo});
 overflow: hidden;
`;

export const EstrelasPequenas = styled.div`
 width: 1px; height: 1px; background: transparent;
 box-shadow: ${gerarEstrelas(700)};
 animation: ${animacaoEstrelas} 50s linear infinite;
 &::after { content: " "; position: absolute; top: 2000px; width: 1px; height: 1px; background: transparent; box-shadow: ${gerarEstrelas(700)}; }
`;

export const EstrelasMedias = styled.div`
 width: 2px; height: 2px; background: transparent;
 box-shadow: ${gerarEstrelas(200)};
 animation: ${animacaoEstrelas} 100s linear infinite;
 &::after { content: " "; position: absolute; top: 2000px; width: 2px; height: 2px; background: transparent; box-shadow: ${gerarEstrelas(200)}; }
`;

export const EstrelasGrandes = styled.div`
 width: 3px; height: 3px; background: transparent;
 box-shadow: ${gerarEstrelas(100)};
 animation: ${animacaoEstrelas} 150s linear infinite;
 &::after { content: " "; position: absolute; top: 2000px; width: 3px; height: 3px; background: transparent; box-shadow: ${gerarEstrelas(100)}; }
`;

// Corrigido: Todas as props injetadas via styled-components devem usar $
export const Planeta = styled.img<{ $top: number; $duracao: number; $tamanho: number }>`
 position: absolute; left: 0; 
 top: ${({ $top }) => $top}%; width: ${({ $tamanho }) => $tamanho}px; height: auto;
 animation: ${moverPlaneta} ${({ $duracao }) => $duracao}s linear forwards;
 will-change: transform;
`;

// Corrigido: top e colidindo agora são props transientes ($)
export const Astronauta = styled.img<{ $top: string; $colidindo: boolean }>`
 position: absolute; left: 50%; top: ${({ $top }) => $top};
 transform: translateX(-50%); width: 200px; height: 200px;
 object-fit: contain; z-index: 10;
 animation: ${({ $colidindo }) => $colidindo
  ? css`${tremer} 0.5s cubic-bezier(.36,.07,.19,.97) both`
  : css`${flutuar} 4s ease-in-out infinite alternate`
 };
 transition: top 1.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const HudContainer = styled.div`
 position: fixed; top: 0; left: 50%;
 transform: translateX(-50%);
 background-color: rgba(241, 241, 241, 0.8);
 padding: 10px 20px; border-radius: 0 0 20px 20px;
 display: flex; justify-content: center; align-items: center; gap: 15px;
 z-index: 100; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

// Corrigido: coletado agora é prop transiente ($)
export const HudPlanetaImagem = styled.img<{ $coletado: boolean }>`
 height: 50px;
 opacity: 1;
 filter: ${({ $coletado }) => ($coletado ? 'none' : 'grayscale(80%)')};
 transition: opacity 0.5s ease, filter 0.5s ease;
`;

export const ContainerFaiscas = styled.div<{ top: number; left: number }>`
 position: absolute; top: ${({ top }) => top}px; left: ${({ left }) => left}px;
 width: 1px; height: 1px; pointer-events: none; z-index: 20;
`;

export const Faisca = styled.div`
 position: absolute; width: 10px; height: 10px; background: ${cores.amarelo}; border-radius: 50%;
 animation: ${faisca} 0.6s ease-out forwards;
 &:nth-child(1) { transform: translate(15px, -15px); }
 &:nth-child(2) { transform: translate(-15px, 15px); }
 &:nth-child(3) { transform: translate(15px, 15px); }
 &:nth-child(4) { transform: translate(-15px, -15px); }
 &:nth-child(5) { transform: translate(20px, 0); animation-delay: 0.1s; }
 &:nth-child(6) { transform: translate(-20px, 0); animation-delay: 0.1s; }
`;

export const NomePlanetaAnuncio = styled.div`
 position: fixed; top: 50%; left: 50%;
 transform: translate(-50%, -50%);
 color: ${cores.branco}; font-size: 4rem; font-weight: bold;
 text-transform: uppercase;
 text-shadow: 0 0 15px ${cores.branco}, 0 0 20px ${cores.roxo};
 z-index: 150; pointer-events: none;
 animation: ${aparecerSumir} 1.5s ease-in-out forwards;
`;