import styled, { keyframes, css } from 'styled-components';

// --- CORES VIBRANTES ---
const TEMA = {
  madeiraClara: '#FDBA74',
  madeiraEscura: '#9A3412',
  brancoPapel: '#FFFBEB',
  vermelho: '#FF0000',
  azul: '#0044FF',
  amarelo: '#FFD700',
  verde: '#00CC00',
  laranja: '#FF6600',
  roxo: '#9900FF',
};

// --- ANIMAÇÕES ---
const popIn = keyframes`
  0% { transform: scale(0.8) rotate(-2deg); opacity: 0; }
  60% { transform: scale(1.05) rotate(1deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const misturar = keyframes`
  0% { transform: scale(1); border-radius: 50%; }
  50% { transform: scale(1.1) rotate(10deg); border-radius: 40%; }
  100% { transform: scale(1); border-radius: 50%; }
`;

const flutuarMancha = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(10px, -10px) scale(1.1); }
  66% { transform: translate(-5px, 5px) scale(0.95); }
`;

// --- ESTRUTURA ---

export const FundoModal = styled.div`
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: #F8FAFC;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(255, 0, 0, 0.2) 0%, transparent 20%),
    radial-gradient(circle at 90% 10%, rgba(0, 0, 255, 0.2) 0%, transparent 20%),
    radial-gradient(circle at 30% 80%, rgba(0, 255, 0, 0.2) 0%, transparent 15%),
    radial-gradient(circle at 70% 60%, rgba(255, 215, 0, 0.25) 0%, transparent 25%),
    radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.1) 0%, transparent 30%);
  display: flex; justify-content: center; align-items: center;
  z-index: 200;
  backdrop-filter: blur(2px);
  
  &::before, &::after {
    content: ''; position: absolute; border-radius: 50%; filter: blur(30px); z-index: -1;
    animation: ${flutuarMancha} 10s infinite ease-in-out;
  }
  &::before { top: 10%; left: 10%; width: 300px; height: 300px; background: rgba(255, 100, 100, 0.4); }
  &::after { bottom: 10%; right: 10%; width: 400px; height: 400px; background: rgba(100, 100, 255, 0.4); animation-delay: -5s; }
`;

export const ConteudoModal = styled.div`
  background-color: ${TEMA.brancoPapel};
  width: 95%; max-width: 900px; min-height: 600px;
  border: 12px solid ${TEMA.madeiraClara};
  border-radius: 25px;
  box-shadow: 0 0 0 4px ${TEMA.madeiraEscura}, 0 20px 50px rgba(0,0,0,0.3);
  display: flex; flex-direction: column; padding: 30px; position: relative;
  animation: ${popIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  background-image: linear-gradient(#E5E7EB 1px, transparent 1px), linear-gradient(90deg, #E5E7EB 1px, transparent 1px);
  background-size: 30px 30px;
`;

export const TituloManual = styled.h2`
  font-family: 'Comic Sans MS', sans-serif; font-size: 2.8rem; color: ${TEMA.madeiraEscura};
  text-align: center; margin-bottom: 25px; text-transform: uppercase; font-weight: 900;
  text-shadow: 3px 3px 0px #FFF, 5px 5px 0px rgba(0,0,0,0.1); letter-spacing: 2px;
`;

export const ContainerSlide = styled.div`
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 25px; text-align: center;
`;

export const TextoExplicativo = styled.div`
  font-size: 1.4rem; line-height: 1.5; color: #374151; max-width: 750px;
  background-color: rgba(255,255,255,0.9); padding: 20px; border-radius: 20px;
  border: 3px dashed ${TEMA.madeiraClara}; box-shadow: 5px 5px 0 rgba(0,0,0,0.1);
  strong { color: ${TEMA.laranja}; font-weight: 900; }
`;

export const ContainerMistura = styled.div`
  display: flex; align-items: center; gap: 15px; background-color: #FFFFFF; 
  padding: 15px 30px; border-radius: 50px; border: 4px solid ${TEMA.madeiraClara};
  box-shadow: 0 8px 0 rgba(0,0,0,0.1);
`;

export const BolhaCor = styled.div<{ $cor: string }>`
  width: 60px; height: 60px; border-radius: 50%;
  background-color: ${({ $cor }) => $cor}; border: 4px solid white;
  box-shadow: inset 0 -5px 10px rgba(0,0,0,0.2), 0 4px 6px rgba(0,0,0,0.2);
  animation: ${misturar} 3s infinite ease-in-out; position: relative;
  &::after {
    content: ''; position: absolute; top: 10px; left: 10px; width: 15px; height: 8px;
    border-radius: 50%; background: rgba(255,255,255,0.6); transform: rotate(-45deg);
  }
`;

export const Operador = styled.span`
  font-size: 2.5rem; font-weight: 900; color: #9CA3AF; font-family: monospace;
`;

export const ContainerConfig = styled.div`
  display: flex; flex-direction: column; gap: 15px; width: 100%;
`;

export const LinhaConfig = styled.div<{ $focado?: boolean }>`
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 25px; background-color: #FFFFFF; border-radius: 20px;
  border: 3px solid #E5E7EB; transition: all 0.3s;
  ${({ $focado }) => $focado && css`
    border-color: ${TEMA.laranja}; background-color: #FFF7ED;
    transform: scale(1.02); box-shadow: 0 4px 15px rgba(255, 165, 0, 0.3);
  `}
`;

export const Label = styled.div`
  display: flex; align-items: center; gap: 12px; font-size: 1.4rem; font-weight: 800;
  color: ${TEMA.madeiraEscura}; svg { color: ${TEMA.laranja}; }
`;

export const GrupoBotoes = styled.div` display: flex; gap: 10px; `;

// AQUI ESTAVA O ERRO DO 'ATIVO': MUDAMOS PARA '$ATIVO'
export const BotaoDificuldade = styled.button<{ $ativo: boolean; $cor: string }>`
  padding: 10px 20px; border-radius: 15px; font-weight: 800; font-size: 1rem;
  border: 3px solid ${({ $cor }) => $cor};
  
  /* Uso de $ativo em vez de ativo */
  background-color: ${({ $ativo, $cor }) => $ativo ? $cor : 'white'};
  color: ${({ $ativo, $cor }) => $ativo ? 'white' : $cor};
  box-shadow: ${({ $ativo }) => $ativo ? 'none' : '0 4px 0 #E5E7EB'};
  transform: ${({ $ativo }) => $ativo ? 'translateY(4px)' : 'translateY(0)'};
  
  cursor: pointer; transition: all 0.2s;
  &:hover { filter: brightness(1.1); }
`;

export const ToggleContainer = styled.label`
  position: relative; display: inline-block; width: 64px; height: 36px;
  input { opacity: 0; width: 0; height: 0; }
  .slider {
    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
    background-color: #D1D5DB; transition: .4s; border-radius: 34px;
    border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  .slider:before {
    position: absolute; content: ""; height: 24px; width: 24px; left: 3px; bottom: 3px;
    background-color: white; transition: .4s; border-radius: 50%;
    box-shadow: 0 2px 2px rgba(0,0,0,0.2);
  }
  input:checked + .slider { background-color: ${TEMA.verde}; }
  input:checked + .slider:before { transform: translateX(28px); }
`;

export const BarraNavegacao = styled.div`
  display: flex; justify-content: space-between; margin-top: auto; padding-top: 20px;
`;

export const BotaoNav = styled.button<{ $destaque?: boolean }>`
  padding: 15px 30px; border-radius: 50px; font-weight: 900; font-size: 1.2rem;
  cursor: pointer; display: flex; align-items: center; gap: 10px; border: 4px solid white;
  text-transform: uppercase;
  background-color: ${({ $destaque }) => $destaque ? TEMA.amarelo : '#3B82F6'};
  color: ${({ $destaque }) => $destaque ? '#3E2723' : 'white'};
  box-shadow: 0 6px 0 rgba(0,0,0,0.2); transition: transform 0.2s;
  ${({ $destaque }) => $destaque && css`transform: scale(1.1); animation: ${popIn} 0.5s infinite alternate;`}
  &:active { transform: translateY(4px); box-shadow: 0 2px 0 rgba(0,0,0,0.2); }
  &:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(1); }
`;

export const BotaoIniciar = styled.button<{ $focado?: boolean }>`
  width: 100%; padding: 20px; margin-top: 15px; background-color: ${TEMA.verde}; color: white;
  font-size: 1.8rem; font-weight: 900; border-radius: 20px; border: 4px solid white;
  box-shadow: 0 8px 0 #15803D; cursor: pointer; text-transform: uppercase; letter-spacing: 1px;
  ${({ $focado }) => $focado && css`
    background-color: ${TEMA.amarelo}; color: ${TEMA.madeiraEscura};
    transform: scale(1.03); box-shadow: 0 8px 0 #B45309;
  `}
  &:active { transform: translateY(6px); box-shadow: 0 2px 0 #15803D; }
`;