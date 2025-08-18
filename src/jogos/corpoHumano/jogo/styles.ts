import styled, { keyframes, css } from 'styled-components';

const colors = {
  fundo1: '#a21a2f', fundo2: '#d43f55', branco: '#f1f1f1',
  roxo: '#4B27AF', verde: '#2AD352', amarelo: '#FDBF5C', preto: '#111111', vermelho: '#FF0000',
};

const moverFundo = keyframes`from { background-position: 0% 0; } to { background-position: -1000px 0; }`;
const moverItem = keyframes`from { transform: translateX(110vw); } to { transform: translateX(-150px); }`;
const flutuar = keyframes`0% { transform: translateY(-4px); } 100% { transform: translateY(4px); }`;
const shake = keyframes`0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); }`;

export const FundoSanguineo = styled.div`
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: linear-gradient(to bottom, ${colors.fundo1}, ${colors.fundo2});
  overflow: hidden;
`;

export const CamadaCelulas = styled.div<{ speed: number; opacity: number; size: string }>`
  position: absolute; top: 0; left: 0; width: 200%; height: 100%;
  background-image: url('/assets/corpoHumano/blood-cells-pattern.png');
  background-size: ${({ size }) => size}; opacity: ${({ opacity }) => opacity};
  animation: ${moverFundo} ${({ speed }) => speed}s linear infinite;
  z-index: 1;
`;

export const Nanosubmarino = styled.img<{ top: number; isDamaged: boolean }>`
  position: absolute; left: 100px; top: ${({ top }) => top}px;
  width: 120px; height: auto; z-index: 10;
  transform: translateY(-50%);
  filter: drop-shadow(0 5px 15px rgba(0,0,0,0.4));
  animation: ${({ isDamaged }) => isDamaged ? css`${shake} 0.3s ease-in-out` : css`${flutuar} 2.5s ease-in-out infinite alternate`};
`;

export const ItemCorrenteSanguinea = styled.img<{ top: number; duracao: number; tamanho: number; isMarked?: boolean }>`
  position: absolute; top: ${({ top }) => top}px;
  width: ${({ tamanho }) => tamanho}px; height: auto;
  transform: translateY(-50%);
  animation: ${moverItem} ${({ duracao }) => duracao}s linear forwards;
  will-change: transform; z-index: 5;
  filter: ${({ isMarked }) => isMarked ? 'drop-shadow(0 0 10px #00BFFF) brightness(1.5)' : 'none'};
  transition: filter 0.3s ease;
`;

export const LeucocitoAliado = styled.img`
  position: absolute; width: 80px; height: 80px; z-index: 9;
  filter: drop-shadow(0 0 15px #ADFF2F);
  transition: top 0.5s ease-out, left 0.5s ease-out;
`;

export const HudContainer = styled.div`
  position: fixed; top: 20px; left: 20px;
  display: flex; flex-direction: column; gap: 15px; z-index: 100;
`;

export const HudBox = styled.div`
  background-color: rgba(241, 241, 241, 0.9); color: ${colors.preto};
  padding: 10px 20px; border-radius: 15px; border: 4px solid ${colors.roxo};
  box-shadow: 0 5px 15px rgba(0,0,0,0.2); min-width: 250px;
  h3 { margin: 0 0 5px 0; font-size: 1rem; color: ${colors.roxo}; }
  p { margin: 0; font-size: 1.3rem; font-weight: bold; }
`;

export const BarraEnergiaContainer = styled.div`
  width: 100%; height: 20px; background-color: #333;
  border-radius: 10px; overflow: hidden; border: 2px solid ${colors.branco};
`;

export const BarraEnergiaFill = styled.div<{ percent: number }>`
  width: ${({ percent }) => percent}%; height: 100%;
  background: linear-gradient(90deg, ${colors.vermelho}, ${colors.amarelo}, ${colors.verde});
  background-size: 300%; background-position: ${({ percent }) => 100 - percent}%;
  transition: width 0.3s ease, background-position 0.3s ease;
`;