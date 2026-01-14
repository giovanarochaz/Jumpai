import styled, { keyframes, css } from 'styled-components';

const TEMA = {
  vermelhoAlerta: '#ef4444',
  madeira: '#8b4513',
  madeiraEscura: '#5d4037',
  madeiraClara: '#deb887',
  ouro: '#fbbf24',
  branco: '#ffffff',
  azulAgua: '#0ea5e9'
};

interface BotaoProps {
  $isFocused: boolean;
}

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0px ${TEMA.ouro}; }
  50% { transform: scale(1.08); box-shadow: 0 0 20px 8px rgba(251, 191, 36, 0.4); }
  100% { transform: scale(1); box-shadow: 0 0 0 0px ${TEMA.ouro}; }
`;

const cairGota = keyframes`
  0% { transform: translateY(-20px); opacity: 0; }
  50% { opacity: 0.6; }
  100% { transform: translateY(20px); opacity: 0; }
`;

const EstiloBotao = css<BotaoProps>`
  padding: 18px 30px;
  font-size: 1.1rem;
  font-weight: 900;
  border-radius: 20px;
  border: 4px solid ${TEMA.madeiraEscura};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
  background: ${TEMA.madeira};
  color: ${TEMA.branco};
  box-shadow: 0 6px 0px ${TEMA.madeiraEscura};

  &:hover {
    background: ${TEMA.madeiraEscura};
    transform: translateY(-2px);
  }

  ${props => props.$isFocused && css`
    animation: ${pulse} 1.5s infinite;
    border-color: ${TEMA.branco} !important;
    background: ${TEMA.ouro} !important;
    color: ${TEMA.madeiraEscura} !important;
    transform: scale(1.1);
    z-index: 10;
  `}
`;

export const FundoDerrota = styled.div`
  position: fixed; inset: 0; z-index: 300;
  background-image: url('/assets/saltoAlfabetico/fundo_lagoa.png');
  background-size: cover;
  background-position: center;
  display: flex; justify-content: center; align-items: center;
  overflow: hidden;

  &::before {
    content: ''; position: absolute; inset: 0;
    background: rgba(45, 27, 27, 0.8); backdrop-filter: blur(5px);
  }
`;

export const ConteudoDerrota = styled.div`
  background-color: ${TEMA.madeiraClara};
  background-image: linear-gradient(180deg, ${TEMA.madeiraClara} 0%, ${TEMA.madeira} 100%);
  border: 8px solid ${TEMA.vermelhoAlerta};
  border-radius: 40px;
  padding: 50px;
  width: 90%;
  max-width: 650px;
  text-align: center;
  box-shadow: 0 15px 0px ${TEMA.madeiraEscura}, 0 25px 50px rgba(0,0,0,0.5);
  position: relative;
  z-index: 310;

  &::before {
    content: ''; position: absolute; inset: 6px;
    border: 3px dashed ${TEMA.vermelhoAlerta};
    border-radius: 30px; pointer-events: none;
    opacity: 0.5;
  }
`;

export const TituloDerrota = styled.h1`
  font-size: 2.5rem;
  color: ${TEMA.vermelhoAlerta};
  font-weight: 900;
  text-transform: uppercase;
  margin: 15px 0;
  text-shadow: 2px 2px 0px ${TEMA.branco};
`;

export const MensagemDerrota = styled.p`
  font-size: 1.2rem;
  color: ${TEMA.branco};
  line-height: 1.5;
  margin-bottom: 35px;
  font-weight: bold;
  background: rgba(0,0,0,0.2);
  padding: 15px;
  border-radius: 15px;
`;

export const IconeContainer = styled.div`
  color: ${TEMA.vermelhoAlerta};
  position: relative;
  display: inline-block;
  filter: drop-shadow(0 4px 0px rgba(0,0,0,0.2));
  margin-bottom: 10px;
`;

export const ContainerBotoes = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
`;

export const BotaoDerrota = styled.button<BotaoProps>`
  ${EstiloBotao}
`;

export const GotaAgua = styled.div`
  position: absolute;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  opacity: 0;
  animation: ${cairGota} 2s infinite linear;
  pointer-events: none;
`;

export const SinalAlertaLagoa = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, transparent 40%, rgba(239, 68, 68, 0.2) 100%);
  animation: ${keyframes`
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.7; }
  `} 1s infinite;
  pointer-events: none;
`;