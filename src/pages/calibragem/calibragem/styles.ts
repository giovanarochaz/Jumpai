import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { cores } from '../../../estilos/cores';

const animacaoDeFlash = keyframes`
  0% { opacity: 0; }
  50% { opacity: 0.9; }
  100% { opacity: 0; }
`;

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
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
  position: relative;
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

export const MensagemDeErro = styled.p`
  color: ${cores.vermelho};
  font-weight: bold;
  margin-top: 10px;
`;

export const ContainerVideo = styled.div`
  position: relative;
  width: clamp(300px, 50%, 640px);
  aspect-ratio: 4 / 3;
  border: 5px solid ${cores.branco};
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  background-color: ${cores.preto};
`;

export const VideoCam = styled.video`
  position: absolute;
  top: 0;
  left: 0;
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
`;

export const BotaoCalibrar = styled.button`
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

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  pointer-events: none;
`;

export const OverlayContagem = styled(Overlay)`
  background-color: ${cores.preto};
`;

export const TextoContagem = styled.span`
  font-size: 12rem;
  font-weight: bold;
  color: ${cores.branco};
  user-select: none;
`;

export const BolinhaDeFoco = styled.div`
  position: absolute; /* Mudado para absolute para se posicionar dentro do ContainerVideo */
  top: 50%;
  left: 50%;
  width: 25px;
  height: 25px;
  background-color: ${cores.branco};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.7);
`;

export const Flash = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${cores.branco};
  z-index: 1001;
  pointer-events: none;
  animation: ${animacaoDeFlash} 0.3s ease-in-out;
`;