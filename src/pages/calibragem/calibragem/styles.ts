import styled, { keyframes } from 'styled-components';
import { cores } from '../../../estilos/cores';

const animarFlash = keyframes`
  0% { opacity: 0; }
  50% { opacity: 0.9; }
  100% { opacity: 0; }
`;

export const ConteinerPrincipal = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: ${cores.roxoPrincipal};
  padding: 20px;
  box-sizing: border-box;
  position: relative;
`;

export const BlocoPreparacao = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.5s ease-out;
  text-align: center;
`;

export const Titulo = styled.h1`
  font-size: clamp(1.8rem, 5vh, 2.8rem);
  color: ${cores.branco};
  margin-bottom: 10px;
  text-shadow: 2px 2px 0px ${cores.preto};
`;

export const TextoInstrucao = styled.p`
  font-size: clamp(0.9rem, 2vh, 1.1rem);
  color: ${cores.branco};
  max-width: 600px;
  line-height: 1.5;
  margin-bottom: 20px;
  opacity: 0.9;
`;

export const AreaCamera = styled.div<{ visivel: boolean }>`
  position: relative;
  width: clamp(280px, 40vw, 500px);
  aspect-ratio: 4 / 3;
  border: 6px solid ${cores.branco};
  border-radius: 20px;
  overflow: hidden;
  background-color: ${cores.preto};
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  margin-bottom: 20px;
  display: ${props => props.visivel ? 'block' : 'none'};
`;

export const ElementoVideo = styled.video`
  width: 100%;
  height: 100%;
  transform: scaleX(-1);
  object-fit: cover;
`;

export const CamadaDesenho = styled.canvas`
  position: absolute;
  inset: 0;
  z-index: 2;
`;

export const BotaoIniciar = styled.button`
  padding: 15px 40px;
  font-size: 1.2rem;
  font-weight: 800;
  background-color: ${cores.amarelo};
  color: ${cores.preto};
  border: 4px solid ${cores.preto};
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 6px 6px 0px ${cores.preto};
  transition: all 0.1s;
  text-transform: uppercase;

  &:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0px ${cores.preto};
  }

  &:active {
    transform: translate(4px, 4px);
    box-shadow: 0px 0px 0px ${cores.preto};
  }

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
    box-shadow: 4px 4px 0px #666;
  }
`;

export const TelaFocoAtivo = styled.div`
  position: absolute;
  inset: 0;
  background-color: ${cores.roxoEscuro};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

export const ConteinerAlvo = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CirculoProgresso = styled.svg`
  width: 180px;
  height: 180px;
  transform: rotate(-90deg);

  circle {
    fill: none;
    stroke: ${cores.amarelo};
    stroke-width: 10;
    stroke-dasharray: 440;
    transition: stroke-dashoffset 0.1s linear;
  }
`;

export const PontoCentro = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: ${cores.branco};
  border-radius: 50%;
  box-shadow: 0 0 20px ${cores.branco};
`;

export const TextoStatus = styled.h2`
  color: ${cores.branco};
  margin-top: 30px;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-size: 1.5rem;
`;

export const CamadaContagem = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0,0,0,0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
`;

export const NumeroContagem = styled.span`
  font-size: 10rem;
  font-weight: 900;
  color: ${cores.branco};
`;

export const Flash = styled.div`
  position: fixed;
  inset: 0;
  background-color: ${cores.branco};
  z-index: 300;
  animation: ${animarFlash} 0.4s ease-out forwards;
`;