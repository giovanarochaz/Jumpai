import styled, { keyframes, css } from 'styled-components';
import { cores } from '../../../estilos/cores';

// --- KEYFRAMES (Animações) ---

const cairItem = keyframes`
  from {
    transform: translateY(-200px) rotate(-20deg);
  }
  to {
    transform: translateY(100vh) rotate(20deg);
  }
`;

// MELHORIA 1: Animação de chegada do ingrediente
// Removemos a opacidade. Ele começa alto e "cai" na posição, amassando ao tocar.
const cairNoPrato = keyframes`
  0% {
    transform: translateX(-50%) translateY(-120px) scale(0.9, 1.1); /* Começa acima, esticado (velocidade) */
    opacity: 1; /* Já começa visível para dar continuidade */
  }
  60% {
    transform: translateX(-50%) translateY(5px) scale(1.15, 0.85); /* Passa um pouco do ponto e amassa (impacto) */
  }
  80% {
    transform: translateX(-50%) translateY(-2px) scale(0.95, 1.05); /* Rebote leve */
  }
  100% {
    transform: translateX(-50%) translateY(0) scale(1, 1); /* Estabiliza */
  }
`;

// MELHORIA 2: Impacto do prato mais suave e elástico
const impactoPratoSuave = keyframes`
  0% { transform: translateX(-50%) scale(1, 1); }
  30% { transform: translateX(-50%) scale(1.1, 0.9); } /* Amassa menos que antes */
  50% { transform: translateX(-50%) scale(0.98, 1.02); } /* Estica levemente */
  70% { transform: translateX(-50%) scale(1.02, 0.98); } /* Ajuste fino */
  100% { transform: translateX(-50%) scale(1, 1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const spotlightAnimation = keyframes`
  0% { transform: translate(-50%, -60%) scale(0.9); opacity: 0.7; }
  50% { transform: translate(-50%, -60%) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -60%) scale(0.9); opacity: 0.7; }
`;

// --- COMPONENTES DE ESTILO ---

export const FundoLanchonete = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fce7f3;
  background-image:
    linear-gradient(${cores.vermelho} 2px, transparent 2px),
    linear-gradient(90deg, ${cores.vermelho} 2px, transparent 2px),
    linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  overflow: hidden;
`;

export const Balcao = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 150px;
  background-color: #a16207;
  border-top: 10px solid #78350f;
  z-index: 5;
`;

export const Comanda = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  width: 250px;
  background: ${cores.branco};
  border: 4px solid ${cores.preto};
  border-radius: 10px;
  padding: 15px;
  z-index: 100;
  box-shadow: 8px 8px 0px ${cores.preto};

  h3 { margin: 0 0 10px; text-align: center; }
  ul { list-style: none; padding: 0; margin: 0; }
  li span { text-transform: capitalize; }
`;

export const ItemDaLista = styled.li<{ $concluido: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-weight: bold;
  transition: all 0.3s ease;
  opacity: ${({ $concluido }) => ($concluido ? 0.5 : 1)};
  text-decoration: ${({ $concluido }) => ($concluido ? 'line-through' : 'none')};

  img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    filter: ${({ $concluido }) => ($concluido ? 'saturate(0)' : 'saturate(1)')};
  }
`;

export const PratoMontagem = styled.div<{ $finalizado?: boolean; $animando?: boolean }>`
  position: absolute;
  bottom: 110px;
  left: 50%;
  transform: translateX(-50%);
  width: 250px;
  height: 300px;
  background-image: url('/assets/piramideSabor/prato.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom;
  z-index: 6;
  
  /* MELHORIA 3: Fixar o eixo de deformação na base para não flutuar */
  transform-origin: bottom center;

  /* Animação mais suave */
  ${({ $animando }) => $animando && css`
    animation: ${impactoPratoSuave} 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  `}

  ${({ $finalizado }) => $finalizado && css`
    position: relative;
    transform: scale(1.5);
    bottom: auto;
    left: auto;
    z-index: 16;
  `}
`;

export const IngredienteEmpilhado = styled.img<{ $index: number }>`
  position: absolute;
  bottom: ${({ $index }) => $index * 40}px;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  
  /* MELHORIA 1 (Aplicação): Usa a nova animação de queda */
  transform-origin: bottom center;
  animation: ${cairNoPrato} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  z-index: ${({ $index }) => $index + 7};
`;

export const ItemCaindo = styled.img<{ $left: number; $duracao: number; $tamanho: number }>`
  position: absolute;
  top: -150px;
  left: ${({ $left }) => $left}%;
  transform: translateX(-50%);
  width: ${({ $tamanho }) => $tamanho}px;
  animation: ${cairItem} ${({ $duracao }) => $duracao}s linear forwards;
`;

export const Chef = styled.img<{ $left: number; $escondido?: boolean }>`
  position: absolute;
  bottom: 10px;
  left: ${({ $left }) => $left}%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  object-fit: contain;
  z-index: 4;
  transition: left 1.3s ease-out, transform 1s ease-in-out, opacity 0.8s ease-in;
  opacity: 1;

  ${({ $escondido }) => $escondido && css`
    opacity: 0;
    transform: translateX(150%);
  `}
`;

export const TelaEscura = styled.div<{ $ativa: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 10;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.8s ease-in-out;

  ${({ $ativa }) => $ativa && css`
    opacity: 1;
    pointer-events: all;
  `}
`;

export const CortinaContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 20;
  pointer-events: none;
`;

export const Cortina = styled.div<{ $lado: 'esquerdo' | 'direito'; $aberta: boolean }>`
  position: absolute;
  top: 0;
  width: 51%;
  height: 100%;
  background-image: url('/assets/piramideSabor/cortina.png');
  background-size: cover;
  background-position: center;
  transition: transform 2s cubic-bezier(0.77, 0, 0.175, 1);

  ${({ $lado }) => $lado === 'esquerdo' ? css`
      left: 0;
      transform: translateX(-1%);
    ` : css`
      right: 0;
      transform: translateX(1%);
    `}

  ${({ $aberta, $lado }) => $aberta && ($lado === 'esquerdo' ? css`
      transform: translateX(-100%);
    ` : css`
      transform: translateX(100%);
    `)}
`;

export const PalcoFinal = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 15;
  opacity: 0;
  animation: ${fadeIn} 1s 0.5s forwards;
`;

export const Spotlight = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(255, 255, 220, 0.7) 20%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -60%);
  animation: ${spotlightAnimation} 4s infinite ease-in-out;
`;