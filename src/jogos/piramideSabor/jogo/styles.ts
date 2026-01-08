import styled, { keyframes, css } from 'styled-components';
import { cores } from '../../../estilos/cores';

// Animação de queda: vai até 125vh e não usa forwards para evitar travar no fundo
const cairItem = keyframes`
  0% { transform: translateY(-15vh) rotate(-10deg); opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(125vh) rotate(10deg); opacity: 0; }
`;

const cairNoPrato = keyframes`
  0% { transform: translateX(-50%) translateY(-15vh) scale(0.9, 1.1); opacity: 0.5; }
  60% { transform: translateX(-50%) translateY(0.5vh) scale(1.1, 0.9); opacity: 1; }
  100% { transform: translateX(-50%) translateY(0) scale(1, 1); }
`;

const impactoPrato = keyframes`
  0%, 100% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.1, 0.9); }
`;

export const FundoLanchonete = styled.div`
  position: fixed; inset: 0; background-color: #fce7f3;
  background-image: linear-gradient(${cores.vermelho} 1px, transparent 1px), linear-gradient(90deg, ${cores.vermelho} 1px, transparent 1px);
  background-size: 8vh 8vh; overflow: hidden;
`;

export const Balcao = styled.div`
  position: absolute; bottom: 0; width: 100%; height: 18vh;
  background-color: #a16207; border-top: 0.8vh solid #78350f; 
  z-index: 20; /* Fica à frente dos itens que caem */
`;

export const Comanda = styled.div`
  position: fixed; top: 2vh; left: 2vw; width: 16vw; min-width: 200px;
  background: white; border: 0.4vh solid black; padding: 1.5vh; z-index: 100;
  box-shadow: 0.6vh 0.6vh 0 black;
  h3 { font-size: clamp(0.9rem, 1.1vw, 1.3rem); margin-bottom: 1vh; }
`;

export const ItemDaLista = styled.li<{ $concluido: boolean; $proximo: boolean }>`
  display: flex; align-items: center; margin-bottom: 0.8vh; padding: 0.5vh; border-radius: 0.5vh;
  opacity: ${({ $concluido }) => ($concluido ? 0.3 : 1)};
  background: ${({ $proximo }) => ($proximo ? 'rgba(255, 255, 0, 0.3)' : 'transparent')};
  border: ${({ $proximo }) => ($proximo ? '2px dashed #eab308' : '2px solid transparent')};
  img { width: 2vw; min-width: 22px; margin-right: 0.8vw; }
  span { font-size: clamp(0.7rem, 0.9vw, 1rem); font-weight: bold; text-transform: capitalize; }
`;

export const Chef = styled.img<{ $left: number; $escondido: boolean }>`
  position: absolute; bottom: 2vh; left: ${({ $left }) => $left}%;
  height: 60vh; width: auto; transform: translateX(-50%);
  z-index: 10; transition: left 0.3s ease-out, opacity 0.5s;
  ${({ $escondido }) => $escondido && css` opacity: 0; `}
`;

export const ItemCaindo = styled.img<{ $left: number; $duracao: number }>`
  position: absolute; top: -15vh; left: ${({ $left }) => $left}%;
  width: 7vw; min-width: 65px; max-width: 110px;
  animation: ${cairItem} ${({ $duracao }) => $duracao}s linear;
  z-index: 5; 
  pointer-events: none;
`;

export const PratoMontagem = styled.div<{ $finalizado?: boolean; $animando?: boolean }>`
  position: absolute; 
  bottom: 18vh; /* Exatamente no topo do balcão */
  left: 50%; transform: translateX(-50%);
  width: 18vw; height: 10vh;
  background: url('/assets/piramideSabor/prato.png') no-repeat bottom/contain;
  z-index: 25; transform-origin: bottom center;
  transition: all 1s ease-in-out;

  ${({ $animando }) => $animando && css` animation: ${impactoPrato} 0.3s ease-out; `}

  ${({ $finalizado }) => $finalizado && css`
    transform: translateX(-50%) scale(1.1);
    bottom: 25vh;
    z-index: 35;
  `}
`;

export const IngredienteEmpilhado = styled.img<{ $index: number }>`
  position: absolute; 
  bottom: ${({ $index }) => $index * 3}vh;
  left: 50%; width: 12vw; max-width: 220px; transform: translateX(-50%);
  animation: ${cairNoPrato} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: ${({ $index }) => $index + 30};
`;

export const TelaEscura = styled.div<{ $ativa: boolean }>`
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.92); z-index: 40;
  opacity: ${({ $ativa }) => ($ativa ? 1 : 0)}; transition: opacity 1s;
  pointer-events: ${({ $ativa }) => ($ativa ? 'all' : 'none')};
`;

export const CortinaContainer = styled.div` position: fixed; inset: 0; z-index: 60; display: flex; pointer-events: none; `;
export const Cortina = styled.div<{ $lado: string; $aberta: boolean }>`
  flex: 1; background: url('/assets/piramideSabor/cortina.png') center/cover;
  transition: transform 2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transform: ${({ $lado, $aberta }) => ($aberta ? ($lado === 'esquerdo' ? 'translateX(-100%)' : 'translateX(100%)') : 'none')};
`;

export const PalcoFinal = styled.div` 
  position: fixed; inset: 0; display: flex; justify-content: center; align-items: center; z-index: 45; 
`;

export const Spotlight = styled.div`
  position: absolute; 
  top: 50%; left: 50%; transform: translate(-50%, -40%);
  width: 80vh; height: 80vh; border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 180, 0.6) 0%, rgba(255, 255, 200, 0.1) 50%, transparent 75%);
  z-index: 27;
`;