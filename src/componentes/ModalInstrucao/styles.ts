import styled, { keyframes, css } from 'styled-components';
import { cores } from '../../estilos/cores';

const aparecer = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background-color: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
`;

export const ConteudoModal = styled.div`
  background-color: ${cores.roxo};
  border: 4px solid ${cores.branco};
  border-radius: 30px;
  width: clamp(320px, 95vw, 650px);
  max-height: 90vh;
  padding: clamp(20px, 4vh, 40px);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  animation: ${aparecer} 0.4s ease-out;
  box-shadow: 0 0 40px rgba(0,0,0,0.5);

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: ${cores.amarelo}; border-radius: 10px; }
`;

export const Titulo = styled.h2`
  color: ${cores.amarelo};
  font-size: clamp(1.2rem, 4vh, 1.8rem);
  text-transform: uppercase;
  margin-bottom: 20px;
  text-align: center;
  -webkit-text-stroke: 1px ${cores.preto};
`;

export const ContainerVideo = styled.div`
  position: relative;
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
  border: 3px solid ${cores.branco};
  background: #000;
  margin-bottom: 25px;
  line-height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const VideoInstrucao = styled.video`
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
`;

export const BotaoPlayCentral = styled.button`
  position: absolute;
  width: 80px;
  height: 80px;
  background-color: ${cores.amarelo};
  border: 3px solid ${cores.preto};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 4px 0 ${cores.preto};
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
    background-color: ${cores.branco};
  }
`;

export const IconePlay = styled.div`
  width: 0; 
  height: 0; 
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-left: 25px solid ${cores.preto};
  margin-left: 8px;
`;

export const ListaInstrucoes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-bottom: 30px;
`;

export const ItemInstrucao = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px 18px;
  border-radius: 15px;
  text-align: left;

  span {
    background: ${cores.amarelo};
    color: ${cores.preto};
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-weight: 900;
    flex-shrink: 0;
    border: 2px solid ${cores.preto};
  }

  p {
    color: ${cores.branco};
    font-size: clamp(0.9rem, 2vh, 1.05rem);
    margin: 0;
    line-height: 1.3;
  }
`;

export const ContainerBotoes = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
`;

export const BotaoEntendi = styled.button<{ disabled?: boolean }>`
  width: 100%;
  max-width: 350px;
  height: 60px;
  background-color: ${cores.amarelo};
  color: ${cores.preto};
  border: 3px solid ${cores.preto};
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 5px 0 ${cores.preto};
  transition: all 0.2s;
  text-transform: uppercase;

  ${props => props.disabled && css`
    background-color: #666;
    color: #999;
    border-color: #444;
    box-shadow: 0 5px 0 #333;
    cursor: not-allowed;
    filter: grayscale(1);
    opacity: 0.7;

    &:hover {
      transform: none;
      box-shadow: 0 5px 0 #333;
    }
  `}

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 7px 0 ${cores.preto};
  }

  &:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 2px 0 ${cores.preto};
  }
`;

export const BotaoPular = styled.button`
  background: none;
  border: none;
  color: ${cores.branco};
  text-decoration: underline;
  opacity: 0.6;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;