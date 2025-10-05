import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { cores } from '../../../estilos/cores';

export const GlobalStyle = createGlobalStyle`
  body { margin: 0; padding: 0; box-sizing: border-box; }
`;

export const ContainerDaTela = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; 
  padding-top: 5vh;
  min-height: 100vh;
  width: 100vw;
  background-color: ${cores.roxo};
  padding: 20px;
  box-sizing: border-box;
`;

export const BlocoDeDescricao = styled.div`
  text-align: center;
  width: clamp(300px, 80%, 900px);
  margin-bottom: 30px; 
`;

export const Titulo = styled.h1`
  font-size: 2.8rem;
  color: ${cores.branco};
  margin-bottom: 10px;
`;

export const Paragrafo = styled.p`
  font-size: 1.2rem;
  color: ${cores.branco};
  line-height: 1.6;
`;

export const ContainerVideo = styled.div`
  position: relative;
  /* MELHORIA: Diminui o tamanho do container de vídeo */
  width: clamp(320px, 50vw, 640px);
  aspect-ratio: 4 / 3;
  border: 5px solid ${cores.branco};
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 30px;
  background-color: ${cores.preto};
`;

export const VideoCam = styled.video`
  position: absolute; top: 0; left: 0;
  width: 100%; height: 100%;
  transform: scaleX(-1);
  object-fit: cover;
`;

export const CanvasSobreposicao = styled.canvas`
  position: absolute; top: 0; left: 0;
  width: 100%; height: 100%;
`;

export const BotaoNavegacao = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: clamp(140px, 30vw, 220px);
  height: clamp(40px, 7vw, 60px);
  background-color: ${cores.branco};
  border: 4px solid ${cores.preto};
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 6px 6px 0px ${cores.preto};
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: bold;
  transition: all 0.15s ease-out;

  &:hover:not(:disabled) {
    background-color: ${cores.amarelo};
    transform: translate(3px, 3px);
    box-shadow: 3px 3px 0px ${cores.preto};
    color: ${cores.preto};
  }

  &:active:not(:disabled) {
    transform: translate(6px, 6px);
    box-shadow: 0px 0px 0px ${cores.preto};
  }

  &:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
    box-shadow: 6px 6px 0px #999;
  }

  @media (max-width: 600px) {
    width: 90vw;
    height: 48px;
    font-size: 1rem;
  }
`;

export const ContainerDoTeste = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const pulseScaleAnim = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const countdownAnim = keyframes`
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: 264;
  }
`;

export const ContainerBolinhas = styled.div`
  display: flex;
  gap: clamp(10px, 3vw, 30px);
  margin: 20px 0;
  height: clamp(60px, 15vw, 110px);
  align-items: center;
  flex-wrap: wrap;
`;

export type BolinhaStatus = 'pending' | 'active' | 'success' | 'fail';

export const BolinhaTeste = styled.div<{ status: BolinhaStatus }>`
  width: clamp(50px, 12vw, 90px);
  height: clamp(50px, 12vw, 90px);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3.5rem;
  font-weight: bold;
  position: relative;
  transition: background-color 0.3s, transform 0.3s;
  
  background-color: ${({ status }) => {
    if (status === 'success') return cores.verde;
    if (status === 'fail') return cores.vermelho;
    return 'rgba(255, 255, 255, 0.2)';
  }};
  
  animation: ${({ status }) => (status === 'active' ? pulseScaleAnim : 'none')} 1s ease-in-out infinite;

  &::before {
    color: ${cores.branco};
    content: '${({ status }) => {
      if (status === 'success') return '✓';
      if (status === 'fail') return '✗';
      return '';
    }}';
  }
`;

export const CountdownSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotateY(-180deg) rotateZ(-90deg);
  overflow: visible;
`;

export const CountdownCircle = styled.circle<{ duration: number }>`
  stroke: ${cores.branco};
  stroke-width: 6;
  fill: transparent;
  r: 42;
  cx: 45;
  cy: 45;
  stroke-dasharray: 264; /* 2 * PI * 42 */
  stroke-dashoffset: 0;
  animation: ${countdownAnim} ${({ duration }) => duration}ms linear forwards;
`;