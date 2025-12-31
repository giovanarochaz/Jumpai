import styled, { keyframes } from 'styled-components';
import { cores } from '../../../estilos/cores';

export const ContainerDaTela = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  padding: 2vh 20px;
  box-sizing: border-box;
`;

export const ContainerDoTeste = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1000px;
  height: 90vh; 
`;

export const BlocoDeDescricao = styled.div`
  text-align: center;
  margin-bottom: 2vh;
`;

export const Titulo = styled.h1`
  color: ${cores.branco};
  margin: 0;
  font-size: clamp(1.5rem, 5vh, 2.8rem);
  text-shadow: 2px 2px 0px ${cores.preto};
`;

export const Paragrafo = styled.p`
  color: ${cores.branco};
  margin-top: 5px;
  font-size: clamp(0.9rem, 2.2vh, 1.2rem);
  line-height: 1.4;
  max-width: 600px;
`;

export const ContainerVideo = styled.div`
  position: relative;
  height: clamp(200px, 45vh, 480px);
  aspect-ratio: 4 / 3; 
  border: 5px solid ${cores.branco};
  border-radius: 12px;
  overflow: hidden;
  background-color: ${cores.preto};
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
`;

export const VideoCamera = styled.video`
  position: absolute;
  width: 100%;
  height: 100%;
  transform: scaleX(-1); 
  object-fit: cover;
`;

export const CanvasSobreposicao = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

export const ContainerBolinhas = styled.div`
  display: flex;
  gap: clamp(15px, 3vw, 30px);
  margin: 2vh 0;
  justify-content: center;
  align-items: center;
`;

const animacaoPulso = keyframes`
  0% { transform: scale(1); border-color: ${cores.branco}; }
  50% { transform: scale(1.1); border-color: ${cores.amarelo}; }
  100% { transform: scale(1); border-color: ${cores.branco}; }
`;

export type StatusBolinha = 'pendente' | 'ativo' | 'sucesso' | 'falha';

export const BolinhaTeste = styled.div<{ status: StatusBolinha }>`
  width: clamp(50px, 11vh, 90px);
  height: clamp(50px, 11vh, 90px);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: clamp(1.5rem, 6vh, 3rem);
  position: relative;
  border: 4px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;
  
  background-color: ${({ status }) => {
    if (status === 'sucesso') return cores.verde;
    if (status === 'falha') return cores.vermelho;
    return 'rgba(255, 255, 255, 0.1)';
  }};
  
  animation: ${({ status }) => (status === 'ativo' ? animacaoPulso : 'none')} 1s infinite;

  &::before {
    color: ${cores.branco};
    content: '${({ status }) => {
      if (status === 'sucesso') return '✓';
      if (status === 'falha') return '✗';
      return '';
    }}';
  }
`;

export const BotaoAcao = styled.button`
  background-color: ${cores.branco};
  border: 4px solid ${cores.preto};
  border-radius: 50px;
  padding: 0 40px;
  height: clamp(50px, 9vh, 70px);
  min-width: 250px;
  cursor: pointer;
  box-shadow: 6px 6px 0px ${cores.preto};
  font-size: clamp(1rem, 2.5vh, 1.4rem);
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${cores.amarelo};
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0px ${cores.preto};
  }

  &:active:not(:disabled) {
    transform: translate(4px, 4px);
    box-shadow: 2px 2px 0px ${cores.preto};
  }

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
    opacity: 0.7;
    box-shadow: none;
  }
`;

const animacaoContagem = keyframes`
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: 264; }
`;

export const SvgContagem = styled.svg`
  position: absolute;
  width: 110%;
  height: 110%;
  transform: rotate(-90deg);
`;

export const CirculoContagem = styled.circle<{ duracao: number }>`
  stroke: ${cores.branco};
  stroke-width: 6;
  fill: transparent;
  r: 42;
  cx: 45;
  cy: 45;
  stroke-dasharray: 264;
  animation: ${animacaoContagem} ${({ duracao }) => duracao}ms linear forwards;
`;