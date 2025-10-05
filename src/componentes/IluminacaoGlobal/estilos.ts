import styled, { keyframes } from 'styled-components';
import { cores } from '../../estilos/cores';

const surgirSuave = keyframes`
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const RingLightSuperior = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 5vh;
  background-color: ${cores.branco};
  z-index: 1500;
  pointer-events: none;
  box-shadow: 0 5px 25px rgba(255, 255, 255, 0.5);
  animation: ${surgirSuave} 0.5s ease-out forwards;
`;

export const RingLightInferior = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5vh;
  background-color: ${cores.branco};
  z-index: 1500;
  pointer-events: none;
  box-shadow: 0 -5px 25px rgba(255, 255, 255, 0.5);
  animation: ${surgirSuave} 0.5s ease-out forwards;
`;
