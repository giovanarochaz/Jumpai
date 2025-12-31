import styled, { keyframes, css } from 'styled-components';

// --- CORES ---
const TEMA = {
  madeiraClara: '#DEB887',  // Burlywood (Cavalete)
  madeiraEscura: '#8B4513', // SaddleBrown (Detalhes)
  chaoMadeira1: '#D2691E',  // Chocolate (Tábua 1)
  chaoMadeira2: '#A0522D',  // Sienna (Tábua 2)
  parede: '#FFF8E1',        // Cornsilk (Parede suave)
  rodape: '#5D4037',        // Rodapé escuro
  branco: '#FFFFFF',
  amareloOuro: '#FBBF24',   // Destaque
};

// --- ANIMAÇÕES ---
const entrarCavalete = keyframes`
  from { transform: translateY(100vh); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const balancoPincel = keyframes`
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(15deg); }
`;

const pop = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.25); }
  100% { transform: scale(1); }
`;

// --- CENÁRIO (ATELIÊ COM CSS PURO) ---
export const ContainerAtelie = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  /* Parede do Ateliê */
  background-color: ${TEMA.parede};
  /* Textura sutil na parede (papel de parede vertical) */
  background-image: linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px);
  background-size: 40px 100%;
  
  /* CHÃO DE MADEIRA (Feito com gradiente) */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 35%; /* Altura do chão */
    z-index: 0;
    
    /* Padrão de tábuas de madeira alternadas */
    background: repeating-linear-gradient(
      90deg,
      ${TEMA.chaoMadeira2} 0px,
      ${TEMA.chaoMadeira2} 2px,
      ${TEMA.chaoMadeira1} 2px,
      ${TEMA.chaoMadeira1} 40px
    );
    /* Sombra interna para dar profundidade no fundo da sala */
    box-shadow: inset 0 20px 50px rgba(0,0,0,0.3);
  }

  /* RODAPÉ (Separação entre parede e chão) */
  &::before {
    content: '';
    position: absolute;
    bottom: 35%; /* Mesma altura do chão */
    left: 0;
    width: 100%;
    height: 15px;
    background-color: ${TEMA.rodape};
    border-top: 2px solid rgba(255,255,255,0.2);
    z-index: 1;
    box-shadow: 0 2px 5px rgba(0,0,0,0.5);
  }
`;

export const TituloFase = styled.div`
  margin-top: 30px;
  background-color: ${TEMA.branco};
  padding: 12px 40px;
  border-radius: 50px;
  border: 4px solid ${TEMA.madeiraEscura};
  font-size: 2rem;
  font-weight: 900;
  color: ${TEMA.madeiraEscura};
  z-index: 10;
  box-shadow: 0 6px 0 rgba(0,0,0,0.2);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// --- ÁREA DOS CAVALETES ---
export const AreaCavaletes = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end; /* Alinha a base dos cavaletes */
  gap: 40px;
  flex: 1;
  width: 100%;
  max-width: 1400px;
  padding-bottom: 8%; /* Espaço para o cavalete "pisar" no chão */
  z-index: 5;
`;

export const CavaleteContainer = styled.div<{ $delay: string }>`
  position: relative;
  
  /* Dimensões grandes */
  width: 500px; 
  height: 650px; 
  
  /* Responsividade */
  @media (max-width: 1200px) {
    width: 400px;
    height: 520px;
  }

  display: flex;
  justify-content: center;
  
  animation: ${entrarCavalete} 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  animation-delay: ${({ $delay }) => $delay};
  opacity: 0; 
`;

// Estrutura de madeira do cavalete
export const CavaleteMadeira = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  
  /* Pernas */
  &::before, &::after {
    content: '';
    position: absolute;
    top: 15%;
    width: 25px;
    height: 90%;
    background-color: ${TEMA.madeiraClara};
    border: 3px solid ${TEMA.madeiraEscura};
    border-radius: 8px;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
  }
  &::before { left: 15%; transform: rotate(4deg); }
  &::after { right: 15%; transform: rotate(-4deg); }
`;

export const BaseQuadro = styled.div`
  position: absolute;
  bottom: 30%;
  width: 100%;
  height: 25px;
  background-color: ${TEMA.madeiraEscura};
  border-radius: 6px;
  box-shadow: 0 5px 10px rgba(0,0,0,0.4);
  z-index: 10;
`;

// O quadro (Papel/Tela)
export const Quadro = styled.div<{ $interativo?: boolean }>`
  position: absolute;
  top: 10%;
  width: 90%;
  height: 60%;
  background-color: white;
  border: 6px solid #333;
  border-radius: 4px;
  box-shadow: 4px 4px 10px rgba(0,0,0,0.15);
  z-index: 6;
  display: flex;
  justify-content: center;
  align-items: center;
  
  cursor: ${({ $interativo }) => $interativo ? 'url(/assets/festivalCores/pincel_cursor.png) 0 20, pointer' : 'default'};
  
  ${({ $interativo }) => $interativo && css`
    &:hover {
      border-color: ${TEMA.amareloOuro};
    }
  `}
`;

export const LabelQuadro = styled.div`
  position: absolute;
  top: -45px;
  background-color: ${TEMA.branco};
  padding: 8px 16px;
  border-radius: 12px;
  border: 3px solid ${TEMA.madeiraEscura};
  font-weight: 800;
  color: ${TEMA.madeiraEscura};
  font-size: 1.1rem;
  text-transform: uppercase;
  box-shadow: 0 3px 0 rgba(0,0,0,0.2);
`;

// --- PALETA DE CORES ---
export const BarraFerramentas = styled.div`
  position: absolute;
  bottom: 30px;
  background-color: ${TEMA.madeiraEscura};
  padding: 20px 50px;
  border-radius: 50px;
  border: 4px solid ${TEMA.madeiraClara};
  box-shadow: 
    inset 0 0 20px rgba(0,0,0,0.6),
    0 10px 20px rgba(0,0,0,0.5);
    
  display: flex;
  gap: 40px;
  align-items: center;
  z-index: 20;
`;

export const Tinta = styled.button<{ $cor: string; $selecionada: boolean }>`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: ${({ $cor }) => $cor};
  border: 6px solid ${TEMA.branco};
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 
    inset 5px -5px 10px rgba(0,0,0,0.2), 
    0 5px 5px rgba(0,0,0,0.3);
  position: relative;

  ${({ $selecionada }) => $selecionada && css`
    transform: scale(1.2) translateY(-20px);
    border-color: #333;
    animation: ${pop} 0.3s;
    z-index: 10;
    
    /* Pincel flutuante */
    &::after {
      content: '🖌️';
      position: absolute;
      top: -45px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 40px;
      filter: drop-shadow(0 4px 2px rgba(0,0,0,0.3));
      animation: ${balancoPincel} 1s infinite ease-in-out;
    }
  `}

  &:hover {
    transform: scale(1.1);
  }
`;

// SVG Styles
export const SvgContainer = styled.svg`
  width: 100%;
  height: 100%;
  padding: 10px;
  
  path, circle, rect, polygon, ellipse {
    transition: fill 0.2s ease;
    stroke: #222;
    stroke-width: 3px;
    stroke-linecap: round;
    stroke-linejoin: round;
    cursor: pointer;
    
    &:hover {
      opacity: 0.9;
      filter: brightness(1.1);
    }
  }
`;