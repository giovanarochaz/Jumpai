import styled, { keyframes } from 'styled-components';
import { colors } from '../../../styles/colors';

// --- ANIMAÇÕES DIVERTIDAS ---

const scaleIn = keyframes`
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const rotacionarPlaneta = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.05); }
  100% { transform: rotate(360deg) scale(1); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(42, 211, 82, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(42, 211, 82, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(42, 211, 82, 0); }
`;

// --- COMPONENTES ESTILIZADOS ---

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
  animation: ${scaleIn} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

export const ModalContent = styled.div`
  background-color: ${colors.branco};
  color: ${colors.preto};
  padding: 40px;
  border: 5px solid ${colors.roxo};
  border-radius: 30px;
  width: 90%;
  max-width: 800px;
  min-height: 500px;
  box-shadow: 6px 6px 0px ${colors.preto};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const SlideContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

export const PlanetaModalAnimado = styled.img`
  width: 250px;
  height: 250px;
  animation: ${rotacionarPlaneta} 25s linear infinite;
`;

export const TextoSlide = styled.div`
  flex: 1;
  h2 {
    font-size: 3rem;
    margin-bottom: 15px;
    color: ${colors.roxo};
    font-weight: 900;
  }
  p {
    font-size: 1.2rem;
    line-height: 1.6;
  }
`;

export const NavegacaoCarrossel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

export const BotaoNavegacao = styled.button`
  background-color: ${colors.roxo};
  color: ${colors.branco};
  border: none; /* A borda agora é a sombra */
  box-shadow: 6px 6px 0px ${colors.preto};
  padding: 12px 25px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.1s ease-in-out;

  &:hover:not(:disabled) {
    background-color: ${colors.amarelo};
    color: ${colors.preto};
    transform: translate(3px, 3px);
    box-shadow: 3px 3px 0px ${colors.preto};
  }

  &:active:not(:disabled) {
    transform: translate(6px, 6px);
    box-shadow: 0px 0px 0px ${colors.preto};
  }
    
  &:disabled {
    background-color: #ccc;
    box-shadow: 6px 6px 0px #999;
    cursor: not-allowed;
  }
`;

export const BotaoIniciarMissao = styled.button`
  background-color: ${colors.verde};
  color: ${colors.branco};
  border: none;
  box-shadow: 8px 8px 0px ${colors.preto};
  padding: 20px 40px;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 0 rgba(0,0,0,0.2);
  border-radius: 50px;
  cursor: pointer;
  margin: 20px auto 0;
  display: block;
  transition: all 0.1s ease-in-out;
  animation: ${pulse} 2s infinite;

  &:hover {
    transform: translate(4px, 4px);
    box-shadow: 4px 4px 0px ${colors.preto};
  }
  
  &:active {
    transform: translate(8px, 8px);
    box-shadow: 0px 0px 0px ${colors.preto};
    animation: none; /* Pausa a animação de pulso ao clicar */
  }
`;

export const ExplicacaoContainer = styled.div`
  padding: 10px;
`;

export const SecaoExplicacao = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 25px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const IconeWrapper = styled.div`
  background-color: ${colors.amarelo};
  color: ${colors.roxo};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border: 3px solid ${colors.preto};
`;

export const TextoWrapper = styled.div`
  h3 {
    margin: 0 0 5px 0;
    font-size: 1.5rem;
    color: ${colors.roxo};
  }
  p {
    margin: 0;
    font-size: 1.1rem;
    line-height: 1.5;
  }
`;

