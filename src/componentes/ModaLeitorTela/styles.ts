import styled, { keyframes } from 'styled-components';
import { cores } from '../../estilos/cores';

const aparecer = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
`;

export const ConteudoModal = styled.div`
  background-color: ${cores.roxo};
  border: 4px solid ${cores.branco};
  border-radius: 20px;
  width: clamp(300px, 80vw, 550px);
  padding: clamp(20px, 4vh, 40px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: ${aparecer} 0.3s ease-out;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
`;

export const IconeLeitor = styled.img`
  height: clamp(60px, 15vh, 120px);
  margin-bottom: 2vh;
`;

export const Titulo = styled.h2`
  color: ${cores.branco};
  font-size: clamp(1.5rem, 4vh, 2.2rem);
  margin: 0 0 1.5vh 0;
`;

export const Descricao = styled.p`
  color: ${cores.branco};
  font-size: clamp(1rem, 2.5vh, 1.3rem);
  line-height: 1.5;
  margin-bottom: 4vh;
  opacity: 0.9;
`;

export const ContainerBotoes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
`;

const BotaoBase = styled.button`
  width: 100%;
  height: clamp(50px, 8vh, 70px);
  border-radius: 50px;
  font-size: clamp(1rem, 2.5vh, 1.2rem);
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  text-transform: uppercase;

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const BotaoSim = styled(BotaoBase)`
  background-color: ${cores.amarelo};
  color: ${cores.preto};
  border: 3px solid ${cores.preto};
  box-shadow: 0 4px 0px ${cores.preto};
`;

export const BotaoNao = styled(BotaoBase)`
  background-color: transparent;
  color: ${cores.branco};
  border: 2px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;