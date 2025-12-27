import styled, { keyframes, css } from 'styled-components';

const flutuarSuave = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const splashAnim = keyframes`
  0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translate(-50%, -80%) scale(1.5); opacity: 0; }
`;

const afundarSapo = keyframes`
  0% { transform: translateX(-50%) translateY(0); opacity: 1; }
  100% { transform: translateX(-50%) translateY(150px); opacity: 0; }
`;

const tremerTela = keyframes`
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(-8px, 8px); }
  50% { transform: translate(8px, -8px); }
  75% { transform: translate(-8px, -8px); }
`;

export const ContainerCenario = styled.div<{ $tremendo?: boolean }>`
  width: 100vw;
  height: 100vh;
  background-image: url('/assets/saltoAlfabetico/fundo_lagoa.png');
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  
  ${({ $tremendo }) => $tremendo && css`
    animation: ${tremerTela} 0.4s ease-in-out;
  `}
`;

export const PlacaMadeira = styled.div`
  margin-top: 30px;
  background-color: #8B4513;
  padding: 15px 30px;
  border-radius: 15px;
  border: 4px solid #5D4037;
  box-shadow: 0 8px 0 rgba(0,0,0,0.3);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SlotsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
`;

export const SlotSilaba = styled.div<{ $status: 'pendente' | 'correto' | 'erro' }>`
  min-width: 90px;
  height: 100px;
  background-color: white;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  font-weight: 900;
  border: 4px solid #5D4037;
  transition: all 0.4s ease;

  ${({ $status }) => {
    if ($status === 'pendente') return css`
      color: rgba(0, 0, 0, 0.1); 
      background-color: rgba(255, 255, 255, 0.4);
      border-color: rgba(93, 64, 55, 0.2);
    `;
    if ($status === 'correto') return css`
      color: white; background-color: #4ADE80; border-color: #166534;
      box-shadow: 0 4px 0 #166534;
    `;
    if ($status === 'erro') return css`
      color: white; background-color: #EF4444; border-color: #991B1B;
    `;
  }}
`;

export const AreaLago = styled.div`
  flex: 1;
  width: 100%;
  position: relative;
  z-index: 10;
`;

export const VitoriaRegiaBase = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 240px;
  z-index: 15;
  img { width: 100%; }
`;

export const WrapperOpcao = styled.div<{ $pos: number; $focado?: boolean }>`
  position: absolute;
  width: 170px;
  height: 110px;
  z-index: 20;
  ${({ $pos }) => {
    if ($pos === 0) return css`left: 12%; top: 40%;`;
    if ($pos === 1) return css`left: 50%; top: 25%; transform: translateX(-50%);`;
    if ($pos === 2) return css`right: 12%; top: 40%;`;
  }}
  ${({ $focado, $pos }) => $focado && css`
    transform: scale(1.2) translateY(-10px) ${$pos === 1 ? 'translateX(-50%)' : ''};
    filter: drop-shadow(0 0 20px yellow);
    z-index: 40;
  `}
`;

export const VitoriaRegia = styled.div<{ $afundando?: boolean }>`
  position: relative;
  width: 100%;
  animation: ${flutuarSuave} 3s ease-in-out infinite;
  img { width: 100%; }
  ${({ $afundando }) => $afundando && css`
    transition: transform 0.6s ease-in, opacity 0.6s;
    transform: translateY(80px) scale(0.5); opacity: 0;
  `}
`;

export const TextoSilaba = styled.span`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 3.5rem;
  font-weight: 900;
  color: white;
  text-shadow: 4px 4px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000;
  z-index: 2;
`;

export const SplashEffect = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  background-image: url('/assets/saltoAlfabetico/splash.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  animation: ${splashAnim} 0.8s ease-out forwards;
  z-index: 60;
  pointer-events: none;
`;

export const SapoContainer = styled.div<{ $estado: string; $alvo: number | null }>`
  position: absolute;
  width: 150px;
  z-index: 50;
  left: 50%;
  bottom: 70px;
  transform: translateX(-50%);
  transition: left 0.5s linear, bottom 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  ${({ $alvo }) => {
    if ($alvo === 0) return css`left: 20%; bottom: 45%;`;
    if ($alvo === 1) return css`left: 50%; bottom: 62%;`;
    if ($alvo === 2) return css`left: 80%; bottom: 45%;`;
  }}
  ${({ $estado }) => $estado === 'afundando' && css`animation: ${afundarSapo} 0.7s ease-in forwards;`}
`;

export const SapoImg = styled.img`width: 100%;`;

export const SombraSapo = styled.div`
  width: 60%; height: 12px; background: rgba(0,0,0,0.3);
  border-radius: 50%; position: absolute; bottom: 0; left: 20%; z-index: -1;
`;