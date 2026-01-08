import styled, { keyframes, css } from 'styled-components';

const TEMA = {
  vermelho: '#ef4444',
  marrom: '#78350f',
  amarelo: '#fbbf24',
  branco: '#ffffff',
  grid: 'rgba(239, 68, 68, 0.15)'
};

// 1. Defina uma interface para as props dos botões
interface BotaoProps {
  $isFocused: boolean;
}

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0px ${TEMA.amarelo}; }
  50% { transform: scale(1.08); box-shadow: 0 0 20px 8px rgba(251, 191, 36, 0.4); }
  100% { transform: scale(1); box-shadow: 0 0 0 0px ${TEMA.amarelo}; }
`;

// 2. Aplique a interface no bloco de CSS
const EstiloBotao = css<BotaoProps>`
  padding: 18px 30px;
  font-size: 1.1rem;
  font-weight: 900;
  border-radius: 20px;
  border: 4px solid ${TEMA.marrom};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
  background: ${TEMA.branco};
  color: ${TEMA.marrom};
  box-shadow: 5px 5px 0px ${TEMA.marrom};

  &:hover {
    background: ${TEMA.amarelo};
    transform: translateY(-3px);
    box-shadow: 8px 8px 0px ${TEMA.marrom};
  }

  ${props => props.$isFocused && css`
    animation: ${pulse} 1.5s infinite;
    border-color: ${TEMA.vermelho} !important;
    background: ${TEMA.amarelo} !important;
    transform: scale(1.1);
    z-index: 10;
  `}
`;

// 3. OBRIGATÓRIO: Passe a interface para o styled.button também
export const BotaoVitoria = styled.button<BotaoProps>`
  ${EstiloBotao}
`;

export const BotaoDerrota = styled.button<BotaoProps>`
  ${EstiloBotao}
`;

// --- Restante dos estilos permanecem iguais ---
export const FundoVitoria = styled.div` position: fixed; inset: 0; z-index: 300; background: #fff1f2; display: flex; justify-content: center; align-items: center; overflow: hidden; background-image: linear-gradient(${TEMA.grid} 2px, transparent 2px), linear-gradient(90deg, ${TEMA.grid} 2px, transparent 2px); background-size: 50px 50px; `;
export const FundoDerrota = styled.div` position: fixed; inset: 0; z-index: 300; background: #2d1b1b; display: flex; justify-content: center; align-items: center; overflow: hidden; background-image: linear-gradient(${TEMA.grid} 2px, transparent 2px), linear-gradient(90deg, ${TEMA.grid} 2px, transparent 2px); background-size: 50px 50px; `;
export const ConteudoVitoria = styled.div` background: white; border: 8px solid ${TEMA.vermelho}; border-radius: 40px; padding: 50px; width: 90%; max-width: 650px; text-align: center; box-shadow: 12px 12px 0px ${TEMA.marrom}; position: relative; &::before { content: ''; position: absolute; inset: 6px; border: 3px dashed ${TEMA.vermelho}; border-radius: 30px; pointer-events: none; } `;
export const ConteudoDerrota = styled.div` background: white; border: 8px solid ${TEMA.vermelho}; border-radius: 40px; padding: 50px; width: 90%; max-width: 650px; text-align: center; box-shadow: 12px 12px 0px ${TEMA.marrom}; position: relative; z-index: 310; &::before { content: ''; position: absolute; inset: 6px; border: 3px dashed ${TEMA.vermelho}; border-radius: 30px; pointer-events: none; } `;
export const TituloVitoria = styled.h1` font-size: 3rem; color: ${TEMA.vermelho}; font-weight: 900; text-transform: uppercase; margin: 15px 0; `;
export const TituloDerrota = styled.h1` font-size: 2.8rem; color: ${TEMA.vermelho}; font-weight: 900; text-transform: uppercase; margin-bottom: 15px; `;
export const MensagemVitoria = styled.p` font-size: 1.3rem; color: ${TEMA.marrom}; margin-bottom: 35px; line-height: 1.5; font-weight: bold; `;
export const MensagemDerrota = styled.p` font-size: 1.2rem; color: ${TEMA.marrom}; line-height: 1.5; margin-bottom: 35px; font-weight: bold; `;
export const IconeContainer = styled.div` color: ${TEMA.amarelo}; position: relative; display: inline-block; filter: drop-shadow(4px 4px 0px ${TEMA.marrom}); margin-bottom: 10px; `;
export const BadgeChef = styled.div` position: absolute; bottom: -5px; right: -5px; background: ${TEMA.vermelho}; color: white; border-radius: 50%; padding: 8px; border: 3px solid white; `;
export const ContainerBotoes = styled.div` display: flex; gap: 20px; justify-content: center; `;
export const ContainerFogos = styled.div` position: absolute; width: 10px; height: 10px; `;
export const ParticulaFogos = styled.div` position: absolute; width: 100%; height: 100%; border-radius: 50%; background: var(--color); animation: ${keyframes` 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } `} 2s infinite ease-out; animation-delay: var(--delay); `;
export const SinalAlertaCozinha = styled.div` position: absolute; inset: 0; background: radial-gradient(circle, transparent 40%, rgba(239, 68, 68, 0.15) 100%); animation: ${keyframes` 0%, 100% { transform: translate(0,0); } 25% { transform: translate(-2px, 2px); } 75% { transform: translate(2px, -2px); } `} 0.5s infinite; pointer-events: none; `;
export const MigalhaSujeira = styled.div` position: absolute; border-radius: 4px; opacity: 0.5; `;