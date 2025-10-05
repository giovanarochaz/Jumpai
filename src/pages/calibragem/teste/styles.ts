import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { cores } from '../../../estilos/cores';

export const GlobalStyle = createGlobalStyle`
  body { margin: 0; padding: 0; box-sizing: border-box; }
`;

export const ContainerDaTela = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background-color: ${cores.roxo};
  padding: 20px;
  box-sizing: border-box;
  font-family: sans-serif;
`;

export const BlocoDeDescricao = styled.div`
  text-align: center;
  width: clamp(300px, 70%, 800px);
  margin-bottom: 20px;
`;

export const Titulo = styled.h1`
  font-size: 2.5rem;
  color: ${cores.branco};
  margin-bottom: 10px;
`;

export const Paragrafo = styled.p`
  font-size: 1.1rem;
  color: ${cores.branco};
  line-height: 1.6;
`;

export const ContainerVideo = styled.div`
  position: relative;
  width: clamp(300px, 50%, 640px);
  aspect-ratio: 4 / 3;
  border: 5px solid ${cores.branco};
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  background-color: #000;
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
  padding: 15px 30px;
  font-size: 1.2rem;
  background-color: ${cores.branco};
  color: ${cores.roxo};
  border: none;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  &:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
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
    stroke-dashoffset: 251.2;
  }
`;

export const ContainerBolinhas = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 0;
  height: 90px;
  align-items: center;
`;

export type BolinhaStatus = 'pending' | 'active' | 'success' | 'fail';

export const BolinhaTeste = styled.div<{ status: BolinhaStatus }>`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
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
  stroke-width: 5;
  fill: transparent;
  r: 40;
  cx: 35;
  cy: 35;
  stroke-dasharray: 251.2;
  stroke-dashoffset: 0;
  animation: ${countdownAnim} ${({ duration }) => duration}ms linear forwards;
`;