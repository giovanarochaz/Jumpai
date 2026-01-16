import styled, { keyframes, css } from 'styled-components';

const TEMA = {
  madeiraParede: '#3e1a0b',
  madeiraPlaca: '#78350f',
  madeiraClara: '#FDBA74',
  brancoPapel: '#FFFBEB',
  laranja: '#F97316',
  amarelo: '#FACC15',
  verde: '#22C55E',
  azul: '#3B82F6',
  vermelho: '#EF4444',
  roxo: '#9333EA'
};

const popIn = keyframes` from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } `;
const pulse = keyframes` 
  0% { box-shadow: 0 0 0 0px ${TEMA.amarelo}; transform: scale(1); } 
  50% { box-shadow: 0 0 20px 5px rgba(250, 204, 21, 0.5); transform: scale(1.03); } 
  100% { box-shadow: 0 0 0 0px ${TEMA.amarelo}; transform: scale(1); } 
`;

export const FundoModal = styled.div`
  position: fixed; inset: 0; display: flex; justify-content: center; align-items: center; z-index: 999;
  
  /* Parede de Madeira com Manchas de Tinta */
  background-color: ${TEMA.madeiraParede};
  background-image: 
    radial-gradient(circle at 10% 15%, rgba(239, 68, 68, 0.5) 0%, transparent 12%), /* Vermelho */
    radial-gradient(circle at 90% 10%, rgba(59, 130, 246, 0.5) 0%, transparent 15%), /* Azul */
    radial-gradient(circle at 85% 85%, rgba(250, 204, 21, 0.4) 0%, transparent 12%), /* Amarelo */
    radial-gradient(circle at 15% 80%, rgba(34, 197, 94, 0.4) 0%, transparent 10%),  /* Verde */
    radial-gradient(circle at 50% 90%, rgba(147, 51, 234, 0.4) 0%, transparent 12%), /* Roxo */
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 80px, rgba(0,0,0,0.2) 81px, transparent 81px);
  background-size: 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 120px 100%;

  &:before { 
    content: ''; position: absolute; inset: 0; 
    background: radial-gradient(circle, transparent 20%, rgba(0,0,0,0.5) 100%);
    backdrop-filter: blur(1px);
  }
`;

export const ConteudoModal = styled.div`
  position: relative; background-color: ${TEMA.brancoPapel}; width: 95%; max-width: 950px;
  border: 12px solid ${TEMA.madeiraClara}; border-radius: 30px; padding: clamp(1rem, 3vh, 2.5rem);
  box-shadow: 0 0 0 4px ${TEMA.madeiraPlaca}, 0 25px 50px rgba(0,0,0,0.6);
  animation: ${popIn} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex; flex-direction: column; max-height: 92vh; overflow-y: auto;
  background-image: radial-gradient(#e5e7eb 1.5px, transparent 1.5px); background-size: 30px 30px;
`;

export const TituloSlide = styled.h2`
  display: flex; align-items: center; justify-content: center; gap: 15px;
  font-size: clamp(1.6rem, 3.5vw, 2.4rem); color: ${TEMA.madeiraPlaca}; text-transform: uppercase;
  font-weight: 900; text-align: center; margin-bottom: 2vh; text-shadow: 1px 1px 0px white;
`;

export const ContainerSlide = styled.div` flex: 1; display: flex; flex-direction: column; align-items: center; gap: 20px; `;

export const TextoExplicativo = styled.div`
  font-size: clamp(1rem, 1.3vw, 1.35rem); line-height: 1.6; text-align: center; color: #374151;
  background: rgba(255,255,255,0.8); padding: 20px; border-radius: 15px; border: 2px dashed ${TEMA.madeiraClara};
  max-width: 800px;
  strong { color: ${TEMA.laranja}; font-weight: 800; }
`;

export const ContainerMistura = styled.div` display: flex; align-items: center; gap: 12px; padding: 10px; `;

export const BolhaCor = styled.div<{ $cor: string }>`
  width: clamp(45px, 7vh, 65px); height: clamp(45px, 7vh, 65px); border-radius: 50%;
  background-color: ${props => props.$cor}; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  position: relative;
  &:after { content: ''; position: absolute; top: 15%; left: 15%; width: 25%; height: 25%; background: rgba(255,255,255,0.4); border-radius: 50%; }
`;

export const Operador = styled.span` font-size: 1.5rem; font-weight: 900; color: ${TEMA.madeiraPlaca}; `;

export const BarraNavegacao = styled.div` display: flex; justify-content: space-between; margin-top: auto; padding-top: 2vh; `;

export const BotaoNav = styled.button<{ $destaque?: boolean }>`
  display: flex; align-items: center; gap: 8px; padding: 12px 25px; border-radius: 50px;
  font-weight: 900; text-transform: uppercase; cursor: pointer; border: 4px solid white;
  background-color: ${props => props.$destaque ? TEMA.amarelo : TEMA.azul};
  color: ${props => props.$destaque ? '#3E2723' : 'white'};
  box-shadow: 0 5px 0 rgba(0,0,0,0.1); transition: 0.2s;
  ${props => props.$destaque && css` animation: ${pulse} 1.5s infinite; border-color: ${TEMA.laranja}; `}
  &:disabled { opacity: 0.5; filter: grayscale(1); }
`;

export const ContainerConfig = styled.div` display: flex; flex-direction: column; gap: 1.5vh; `;

export const LinhaConfig = styled.div<{ $focado?: boolean }>`
  display: flex; align-items: center; justify-content: space-between; padding: 10px 20px;
  background: white; border-radius: 15px; border: 3px solid transparent; transition: 0.3s;
  ${props => props.$focado && css` border-color: ${TEMA.laranja}; background: #FFF7ED; transform: scale(1.02); `}
`;

export const Label = styled.div` display: flex; align-items: center; gap: 12px; font-size: 1.1rem; font-weight: 800; color: ${TEMA.madeiraPlaca}; `;

export const GrupoBotoes = styled.div` display: flex; gap: 8px; `;

export const BotaoOpcao = styled.button<{ $ativo: boolean; $isFocused?: boolean }>`
  padding: 8px 16px; border-radius: 12px; font-weight: 800; border: 2px solid ${TEMA.madeiraClara};
  background-color: ${props => props.$ativo ? TEMA.laranja : 'white'};
  color: ${props => props.$ativo ? 'white' : TEMA.laranja};
  cursor: pointer; transition: 0.2s;
  ${props => props.$isFocused && css` background-color: ${TEMA.amarelo} !important; color: ${TEMA.madeiraPlaca} !important; transform: scale(1.1); `}
`;

export const ToggleContainer = styled.div` position: relative; width: 60px; height: 32px; cursor: pointer; `;
export const InputInterruptor = styled.input` opacity: 0; width: 0; height: 0; `;
export const DeslizadorInterruptor = styled.span`
  position: absolute; inset: 0; background-color: #D1D5DB; border-radius: 34px; transition: .4s; border: 2px solid #9CA3AF;
  &:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background: white; border-radius: 50%; transition: .4s; }
  ${InputInterruptor}:checked + & { background-color: ${TEMA.verde}; border-color: #15803D; }
  ${InputInterruptor}:checked + &:before { transform: translateX(26px); }
`;

export const BotaoIniciar = styled.button<{ $focado?: boolean }>`
  width: 100%; padding: clamp(1rem, 2.5vh, 1.8rem); margin-top: 1vh;
  background-color: ${TEMA.verde}; color: white; font-size: 1.6rem; font-weight: 900;
  border-radius: 20px; border: 4px solid white; box-shadow: 0 6px 0 #15803D; cursor: pointer;
  ${props => props.$focado && css` animation: ${pulse} 1.5s infinite; background-color: ${TEMA.amarelo}; color: ${TEMA.madeiraPlaca}; `}
`;