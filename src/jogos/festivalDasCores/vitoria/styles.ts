import styled, { keyframes, css } from 'styled-components';

const TEMA = {
  madeiraParede: '#3e1a0b',
  madeiraPlaca: '#78350f',
  madeiraClara: '#FDBA74',
  laranja: '#F97316',
  amarelo: '#FACC15',
  vermelho: '#EF4444',
  azul: '#3B82F6',
  verde: '#22C55E',
  branco: '#ffffff',
};

interface BotaoProps { $isFocused: boolean; $derrota?: boolean; }

const popIn = keyframes` from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } `;
const pulse = keyframes` 
  0% { transform: scale(1); box-shadow: 0 0 0 0px ${TEMA.amarelo}; }
  50% { transform: scale(1.05); box-shadow: 0 0 20px 8px rgba(250, 204, 21, 0.4); }
  100% { transform: scale(1); }
`;
const splashExplosion = keyframes` 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(3.5); opacity: 0; } `;

const FundoAtelieBase = css`
  position: fixed; inset: 0; z-index: 300; display: flex; justify-content: center; align-items: center;
  background-color: ${TEMA.madeiraParede};
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(239, 68, 68, 0.5) 0%, transparent 15%),
    radial-gradient(circle at 90% 10%, rgba(59, 130, 246, 0.5) 0%, transparent 18%),
    radial-gradient(circle at 50% 5%, rgba(250, 204, 21, 0.4) 0%, transparent 15%),
    radial-gradient(circle at 85% 85%, rgba(249, 115, 22, 0.4) 0%, transparent 15%),
    radial-gradient(circle at 15% 75%, rgba(34, 197, 94, 0.4) 0%, transparent 15%),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 80px, rgba(0,0,0,0.2) 81px, transparent 81px);
  background-size: 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100px 100%;
`;

export const FundoVitoria = styled.div`
  ${FundoAtelieBase}
  &:before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle, transparent 20%, rgba(0,0,0,0.4) 100%); }
`;

export const FundoDerrota = styled.div`
  ${FundoAtelieBase}
  &:before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle, transparent 10%, rgba(0,0,0,0.8) 100%); backdrop-filter: grayscale(0.4); }
`;

export const ConteudoPlaca = styled.div<{ $derrota?: boolean }>`
  position: relative; background: #fffbeb; 
  border: 8px solid ${props => props.$derrota ? TEMA.vermelho : TEMA.madeiraClara};
  border-radius: 40px; padding: 50px; width: 90%; max-width: 650px; text-align: center;
  box-shadow: 0 12px 0px ${props => props.$derrota ? '#7f1d1d' : TEMA.madeiraPlaca};
  animation: ${popIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  &::before { content: ''; position: absolute; inset: 6px; border: 3px dashed ${props => props.$derrota ? TEMA.vermelho : TEMA.madeiraClara}; border-radius: 30px; pointer-events: none; }
`;

export const Titulo = styled.h1<{ $derrota?: boolean }>`
  font-size: 3rem; font-weight: 900; text-transform: uppercase; margin: 15px 0;
  color: ${props => props.$derrota ? TEMA.vermelho : TEMA.madeiraPlaca};
`;

export const Mensagem = styled.p` font-size: 1.3rem; color: ${TEMA.madeiraPlaca}; margin-bottom: 35px; line-height: 1.5; font-weight: bold; `;

export const BotaoAcao = styled.button<BotaoProps>`
  padding: 18px 30px; font-size: 1.1rem; font-weight: 900; border-radius: 20px;
  border: 4px solid ${TEMA.madeiraPlaca}; cursor: pointer; display: flex; align-items: center; gap: 10px;
  transition: all 0.2s; background: ${TEMA.branco}; color: ${TEMA.madeiraPlaca};
  box-shadow: 5px 5px 0px ${TEMA.madeiraPlaca};

  ${props => props.$isFocused && css`
    animation: ${pulse} 1.5s infinite;
    background: ${props.$derrota ? '#fee2e2' : TEMA.amarelo} !important;
    border-color: ${props.$derrota ? TEMA.vermelho : TEMA.laranja} !important;
    transform: scale(1.1);
  `}
`;

export const IconeContainer = styled.div` color: ${TEMA.laranja}; position: relative; display: inline-block; filter: drop-shadow(4px 4px 0px rgba(0,0,0,0.1)); margin-bottom: 10px; `;
export const BadgeArtista = styled.div` position: absolute; bottom: -5px; right: -5px; background: ${TEMA.verde}; color: white; border-radius: 50%; padding: 8px; border: 3px solid white; `;
export const ContainerBotoes = styled.div` display: flex; gap: 20px; justify-content: center; `;
export const ContainerSplash = styled.div` position: absolute; width: 20px; height: 20px; `;
export const ParticleSplash = styled.div` position: absolute; width: 100%; height: 100%; border-radius: 50%; background: var(--color); animation: ${splashExplosion} 2.5s infinite ease-out; animation-delay: var(--delay); `;
export const AlertaErro = styled.div` position: absolute; inset: 0; pointer-events: none; background: radial-gradient(circle, transparent 40%, rgba(239, 68, 68, 0.15) 100%); animation: ${keyframes` 0%, 100% { transform: translate(0,0); } 25% { transform: translate(-1px, 1px); } 75% { transform: translate(1px, -1px); } `} 0.5s infinite; `;