import styled, { keyframes } from 'styled-components';

const colors = {
  branco: '#f1f1f1', preto: '#111111', roxo: '#4B27AF', amarelo: '#FDBF5C',
  verde: '#2AD352', vermelho: '#a21a2f',
};

const scaleIn = keyframes`from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; }`;
const trophyShine = keyframes`0%, 100% { transform: scale(1); filter: brightness(1.2); } 50% { transform: scale(1.1); filter: brightness(1.8); }`;

export const VictoryOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex; justify-content: center; align-items: center;
  z-index: 300; animation: ${scaleIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

export const VictoryContent = styled.div`
  background: linear-gradient(145deg, ${colors.roxo}, #7b5de0);
  color: ${colors.branco}; padding: 50px; border-radius: 30px;
  border: 5px solid ${colors.amarelo}; text-align: center;
  position: relative;
`;

export const VictoryIcon = styled.div`
  animation: ${trophyShine} 2.5s ease-in-out infinite;
  margin-bottom: 20px; color: ${colors.verde};
`;

export const VictoryTitle = styled.h1`
  font-size: 3rem; color: ${colors.amarelo};
  text-shadow: 3px 3px 0 ${colors.preto}; margin: 0;
`;

export const VictoryMessage = styled.p`
  font-size: 1.2rem; max-width: 400px;
  margin: 15px 0 30px;
`;

export const ButtonContainer = styled.div`
  display: flex; justify-content: center; gap: 20px;
`;

export const VictoryButton = styled.button`
  background-color: ${colors.branco}; color: ${colors.roxo};
  border: 3px solid ${colors.preto}; box-shadow: 6px 6px 0px ${colors.preto};
  padding: 12px 25px; font-size: 1.1rem; font-weight: bold;
  border-radius: 15px; cursor: pointer;
  transition: all 0.1s ease-in-out;

  &:hover {
    background-color: ${colors.amarelo}; color: ${colors.preto};
    transform: translate(3px, 3px); box-shadow: 3px 3px 0px ${colors.preto};
  }
  &:active { transform: translate(6px, 6px); box-shadow: 0px 0px 0px ${colors.preto}; }
`;