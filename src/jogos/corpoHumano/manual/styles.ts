import styled, { keyframes } from 'styled-components';

const colors = {
  branco: '#f1f1f1', preto: '#111111', roxo: '#4B27AF', amarelo: '#FDBF5C',
  verde: '#2AD352', vermelho: '#a21a2f',
};

const scaleIn = keyframes`from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; }`;
const pulse = keyframes`0% { transform: scale(1); } 70% { transform: scale(1.05); } 100% { transform: scale(1); }`;

export const ManualOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex; justify-content: center; align-items: center;
  z-index: 200; animation: ${scaleIn} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

export const ManualContent = styled.div`
  background-color: ${colors.branco}; color: ${colors.preto};
  padding: 40px; border: 5px solid ${colors.amarelo};
  border-radius: 30px; width: 90%; max-width: 800px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  display: flex; flex-direction: column;
`;

export const Titulo = styled.h2`
  font-size: 3rem; margin-bottom: 25px; color: ${colors.roxo};
  font-weight: 900; text-shadow: 2px 2px 0 ${colors.amarelo};
  text-align: center;
`;

export const Secao = styled.div`
  display: flex; align-items: center; gap: 20px;
  margin-bottom: 25px;
  &:last-child { margin-bottom: 0; }
`;

export const IconeWrapper = styled.div`
  background-color: ${colors.amarelo}; color: ${colors.roxo};
  border-radius: 20px; width: 80px; height: 80px;
  display: flex; justify-content: center; align-items: center;
  flex-shrink: 0; border: 3px solid ${colors.preto};
`;

export const ImagemIcone = styled.img`
  width: 60px; height: 60px;
`;

export const TextoWrapper = styled.div`
  h3 { margin: 0 0 5px 0; font-size: 1.5rem; color: ${colors.roxo}; }
  p { margin: 0; font-size: 1.1rem; line-height: 1.5; }
`;

export const BotaoIniciar = styled.button`
  background-color: ${colors.verde}; color: ${colors.branco};
  border: none; box-shadow: 8px 8px 0px ${colors.preto};
  padding: 20px 40px; font-size: 1.5rem; font-weight: bold;
  text-shadow: 2px 2px 0 rgba(0,0,0,0.2);
  border-radius: 50px; cursor: pointer; margin: 30px auto 0;
  display: block; transition: all 0.1s ease-in-out;
  animation: ${pulse} 2s infinite;

  &:hover { transform: translate(4px, 4px); box-shadow: 4px 4px 0px ${colors.preto}; }
  &:active { transform: translate(8px, 8px); box-shadow: 0px 0px 0px ${colors.preto}; animation: none; }
`;