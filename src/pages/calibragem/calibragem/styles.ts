import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { colors } from '../../../styles/colors';

// Esta animação permanece, pois é usada para o efeito visual rápido
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

// Componentes estilizados
export const ContainerDaTela = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background-color: ${colors.roxo};
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  font-family: sans-serif;
`;

export const BlocoDeDescricao = styled.div`
  text-align: center;
  width: clamp(300px, 70%, 800px);
  margin-bottom: 20px;
`;

export const Titulo = styled.h1`
  font-size: 2.5rem;
  color: ${colors.branco};
  margin-bottom: 10px;
`;

export const Paragrafo = styled.p`
  font-size: 1.1rem;
  color: ${colors.branco};
  line-height: 1.6;
`;

export const MensagemDeErro = styled.p`
  color: ${colors.vermelho};
  font-weight: bold;
  margin-top: 10px;
`;

export const ContainerVideo = styled.div`
  position: relative;
  width: clamp(300px, 50%, 640px);
  aspect-ratio: 4 / 3;
  border: 5px solid ${colors.branco};
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  background-color: #000;
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
  padding: 15px 30px;
  font-size: 1.2rem;
  background-color: ${colors.branco};
  color: ${colors.roxo};
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
  background-color: ${colors.preto};
`;

export const TextoContagem = styled.span`
  font-size: 12rem;
  font-weight: bold;
  color: ${colors.branco};
  user-select: none;
`;

export const BolinhaDeFoco = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 25px;
  height: 25px;
  background-color: ${colors.branco};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.7);
`;

// O componente Flash agora é usado apenas para o efeito visual rápido
export const Flash = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${colors.branco};
  z-index: 1001;
  pointer-events: none;
  animation: ${animacaoDeFlash} 0.3s ease-in-out;
`;