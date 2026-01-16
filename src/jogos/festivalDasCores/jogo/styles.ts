import styled, { keyframes, css } from 'styled-components';

const shake = keyframes`
  0% { transform: translate(0, 0); }
  20% { transform: translate(-3px, 0); }
  40% { transform: translate(3px, 0); }
  60% { transform: translate(-3px, 0); }
  80% { transform: translate(3px, 0); }
  100% { transform: translate(0, 0); }
`;

const fadeOut = keyframes`
  0% { opacity: 1; filter: brightness(1); }
  100% { opacity: 0; filter: brightness(1.5); }
`;

export const ContainerAtelie = styled.div`
  position: fixed; inset: 0; background: #FFF8E1;
  display: flex; flex-direction: column; align-items: center; overflow: hidden;
  &::after {
    content: ''; position: absolute; bottom: 0; width: 100%; height: 32%;
    background: repeating-linear-gradient(90deg, #A0522D 0, #A0522D 2px, #D2691E 2px, #D2691E 60px);
    box-shadow: inset 0 20px 40px rgba(0,0,0,0.2); z-index: 0;
  }
`;

export const TituloFase = styled.h2`
  margin: 2vh; padding: 10px 40px; background: white; z-index: 10;
  border: 4px solid #8B4513; border-radius: 50px; color: #8B4513;
  text-transform: uppercase; box-shadow: 0 4px 0 rgba(0,0,0,0.1);
`;

export const AreaCavaletes = styled.div`
  display: flex; gap: 4vw; flex: 1; z-index: 5; align-items: center;
`;

export const CavaleteContainer = styled.div`
  width: 38vw; height: 55vh; background: #DEB887; border: 4px solid #8B4513;
  border-radius: 8px; display: flex; flex-direction: column; align-items: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2); position: relative;
`;

export const Quadro = styled.div`
  width: 90%; height: 85%; background: white; margin-top: 4%;
  border: 4px solid #333; position: relative; overflow: hidden;
`;

export const BarraFerramentas = styled.div`
  position: relative; bottom: 4vh; z-index: 20;
  background: #8B4513; padding: 15px 40px; border-radius: 60px;
  display: flex; gap: 1.5vw; border: 4px solid #DEB887;
`;

export const Tinta = styled.div<{ $cor: string; $selecionada: boolean; $podeClicar: boolean }>`
  width: clamp(45px, 7.5vh, 75px); height: clamp(45px, 7.5vh, 75px);
  border-radius: 50%; background: ${props => props.$cor};
  border: 4px solid white; transition: all 0.2s;
  cursor: ${props => props.$podeClicar ? 'pointer' : 'default'};
  ${props => props.$selecionada && css`
    transform: scale(1.3) translateY(-12px);
    border-color: #FACC15; box-shadow: 0 10px 20px rgba(0,0,0,0.4);
  `}
`;

export const SvgContainer = styled.svg`
  width: 100%; height: 100%;
  .limpando {
    animation: ${shake} 0.3s ease-in-out, ${fadeOut} 0.8s ease-out forwards;
    pointer-events: none;
  }
`;

export const OverlayStart = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200;
  display: flex; justify-content: center; align-items: center; color: white;
  font-size: 2rem; font-weight: 900; text-align: center; text-shadow: 0 4px 10px black;
`;