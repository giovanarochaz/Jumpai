import styled, { keyframes } from 'styled-components';

// --- ANIMAÇÕES ---

const aparecer = keyframes`
  from { transform: scale(0.7); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const brilhoTrofeu = keyframes`
  0%, 100% { transform: scale(1) rotate(-5deg); filter: brightness(1); }
  50% { transform: scale(1.1) rotate(5deg); filter: brightness(1.5); }
`;

const explodir = keyframes`
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--x), var(--y)) scale(0);
    opacity: 0;
  }
`;

// --- COMPONENTES ESTILIZADOS ---

export const FundoVitoria = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 300;
  animation: ${aparecer} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

export const ConteudoVitoria = styled.div`
  background: linear-gradient(145deg, #4B27AF, #7b5de0);
  color: #f1f1f1;
  padding: 50px;
  border-radius: 30px;
  border: 5px solid #FDBF5C;
  text-align: center;
  position: relative;
  z-index: 10;
`;

export const IconeTrofeu = styled.div`
  animation: ${brilhoTrofeu} 2.5s ease-in-out infinite;
  margin-bottom: 20px;
  color: #FDBF5C;
`;

export const TituloVitoria = styled.h1`
  font-size: 3rem;
  color: #FDBF5C;
  text-shadow: 3px 3px 0 #111111;
  margin: 0;
`;

export const MensagemVitoria = styled.p`
  font-size: 1.2rem;
  max-width: 400px;
  margin: 15px 0 30px;
`;

export const ContainerBotoes = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

export const BotaoVitoria = styled.button`
  background-color: #f1f1f1;
  color: #4B27AF;
  border: 3px solid #111;
  box-shadow: 6px 6px 0px #111;
  padding: 12px 25px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.1s ease-in-out;

  &:hover {
    background-color: #FDBF5C;
    color: #111;
    transform: translate(3px, 3px);
    box-shadow: 3px 3px 0px #111;
  }

  &:active {
    transform: translate(6px, 6px);
    box-shadow: 0px 0px 0px #111;
  }
`;

// --- COMPONENTES DOS FOGOS DE ARTIFÍCIO ---

export const ContainerFogos = styled.div`
  position: absolute;
  top: var(--top);
  left: var(--left);
  transform: translate(-50%, -50%);
  width: 1px;
  height: 1px;
`;

export const ParticulaFogos = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color);
  opacity: 0;
  
  animation: ${explodir} 1.2s ease-out forwards;
  animation-delay: var(--delay);

  &:nth-child(1) { --x: 60px; --y: 0px; }
  &:nth-child(2) { --x: -60px; --y: 0px; }
  &:nth-child(3) { --x: 0px; --y: 60px; }
  &:nth-child(4) { --x: 0px; --y: -60px; }
  &:nth-child(5) { --x: 45px; --y: 45px; }
  &:nth-child(6) { --x: -45px; --y: -45px; }
  &:nth-child(7) { --x: 45px; --y: -45px; }
  &:nth-child(8) { --x: -45px; --y: 45px; }
  &:nth-child(9) { --x: 80px; --y: 20px; }
  &:nth-child(10) { --x: -80px; --y: -20px; }
  &:nth-child(11) { --x: 20px; --y: -80px; }
  &:nth-child(12) { --x: -20px; --y: 80px; }
`;