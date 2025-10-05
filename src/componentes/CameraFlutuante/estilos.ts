import styled, { keyframes } from 'styled-components';
import { cores } from '../../estilos/cores';

// Este componente não está sendo usado no JSX, mas a definição está aqui.
export const VideoFlutuante = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
`;

const surgir = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

export const ContainerCameraFlutuante = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 200px;
  height: 150px;
  background-color: ${cores.preto};
  border: 3px solid ${cores.branco};
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  z-index: 3000;
  overflow: hidden;
  animation: ${surgir} 0.4s ease-out forwards;
`;

export const CanvasFlutuante = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;