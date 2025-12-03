import styled, { keyframes } from "styled-components";

const CORES = {
  roxoPrincipal: "#8B5CF6",
  roxoEscuro: "#6D28D9",
  amarelo: "#FBBF24",
  branco: "#FFFFFF",
  cinzaClaro: "#F3F4F6",
  preto: "#111827",
  textoCinza: "#4B5563",
  sombraSuave: "rgba(0, 0, 0, 0.15)",
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  background: radial-gradient(
    circle at center,
    ${CORES.roxoPrincipal} 0%,
    ${CORES.roxoEscuro} 100%
  );
  background-image: radial-gradient(
      circle at center,
      ${CORES.roxoPrincipal} 0%,
      ${CORES.roxoEscuro} 100%
    ),
    radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px);
  background-size: 100% 100%, 40px 40px;
  background-position: center, 0 0;
  color: ${CORES.branco};
  overflow-x: hidden;
  position: relative;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 140px 20px 40px;
  animation: ${fadeIn} 0.8s ease-out;
  width: 100%;

  @media (max-height: 800px) {
    padding-top: 100px;
  }
`;

export const HeaderSection = styled.section`
  text-align: center;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
`;

export const GameTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 3rem);
  font-weight: 900;
  color: ${CORES.amarelo};
  text-shadow: 4px 4px 0px ${CORES.preto};
  margin: 0;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

export const SubtitleWrapper = styled.div`
  margin-top: 1.5rem;
  font-size: 1.2rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  line-height: 1.5;
`;

export const StatusEyeControl = styled.div`
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 10px 20px;
  border-radius: 30px;
  border: 2px solid ${CORES.amarelo};
  color: ${CORES.amarelo};
  font-weight: 700;

  .blink-icon {
    animation: ${pulse} 1s infinite;
  }
`;

export const CarrosselContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1400px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  overflow: visible; /* fundamental para as setas ficarem fora da borda */
  z-index: 50;
`;

export const CarrosselViewport = styled.div`
  width: 100%;
  overflow: visible; 
  padding: 20px 0; 
  perspective: 1000px;
`;

export const CarrosselTrilha = styled.div<{ $indiceAtual: number, $semTransicao?: boolean }>`
  display: flex;
  align-items: center;
  gap: 40px; 
  transition: ${({ $semTransicao }) => $semTransicao ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'};
  
  transform: translateX(calc(50% - 140px - (${props => props.$indiceAtual} * (280px + 40px))));

  @media (min-width: 768px) {
    transform: translateX(calc(50% - 170px - (${props => props.$indiceAtual} * (340px + 40px))));
  }

  @media (min-width: 1200px) {
    transform: translateX(calc(50% - 210px - (${props => props.$indiceAtual} * (420px + 40px))));
  }
`;



export const CardJogo = styled.div<{ $isActive: boolean }>`
  position: relative;
  flex-shrink: 0;

  width: clamp(240px, 28vw, 420px);
  aspect-ratio: 3 / 4;
  height: clamp(300px, 60vh, 500px);

  background-color: ${CORES.branco};
  border-radius: 30px;
  padding: 12px;
  border: 4px solid ${CORES.preto};

  box-shadow: ${({ $isActive }) =>
    $isActive ? `10px 10px 0px ${CORES.preto}` : `0px 4px 8px rgba(0,0,0,0.2)`};

  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  transform: ${({ $isActive }) =>
    $isActive ? "scale(1) translateY(0)" : "scale(0.85) translateY(10px)"};

  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.6)};
  filter: ${({ $isActive }) =>
    $isActive ? "grayscale(0%)" : "grayscale(100%) blur(0.5px)"};
  z-index: ${({ $isActive }) => ($isActive ? 10 : 1)};

  &:hover {
    transform: ${({ $isActive }) =>
      $isActive ? "scale(1.02) translateY(-5px)" : "scale(0.85)"};
    box-shadow: ${({ $isActive }) =>
      $isActive ? `14px 14px 0px ${CORES.preto}` : ""};
  }
`;

export const CardImageContainer = styled.div`
  width: 100%;
  position: relative;
  border-radius: 20px;
  border: 3px solid ${CORES.preto};
  background-color: ${CORES.cinzaClaro};
  overflow: hidden;

  img {
    border-radius: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CardBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${CORES.amarelo};
  color: ${CORES.preto};
  font-weight: 800;
  font-size: 0.75rem;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 20px;
  border: 2px solid ${CORES.preto};
  box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.3);
  z-index: 2;
`;

export const CardContent = styled.div`
  flex: 1;
  padding: 15px 5px 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: ${CORES.branco};
  gap: 10px;
`;

export const CardTitle = styled.h2`
  font-size: clamp(1.2rem, 3vw, 1.6rem);
  font-weight: 900;
  text-transform: uppercase;
  color: ${CORES.roxoPrincipal};
  margin: 0;
  line-height: 1.1;
`;

export const CardDescription = styled.p`
  font-size: clamp(0.85rem, 2vw, 1rem);
  line-height: 1.4;
  color: ${CORES.textoCinza};
  font-weight: 500;
  margin: 0;
  max-width: 95%;
  margin-bottom: 20px;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const PlayButton = styled.div`
  width: 100%;
  max-width: 260px;

  padding: 12px;

  background-color: ${CORES.roxoPrincipal};
  color: ${CORES.branco};
  font-weight: 800;
  text-transform: uppercase;
  font-size: 1rem;
  border-radius: 16px;
  border: 3px solid ${CORES.preto};

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  ${CardJogo}:hover & {
    background-color: ${CORES.amarelo};
    color: ${CORES.preto};
    transform: translateY(-2px);
    box-shadow: 0 4px 0 ${CORES.preto};
  }
`;

export const BotaoNavegacao = styled.button<{
  $direcao: "esquerda" | "direita";
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  width: 50px;
  height: 50px;

  background-color: ${CORES.branco};
  border: 4px solid ${CORES.preto};
  border-radius: 50%;
  color: ${CORES.preto};
  box-shadow: 4px 4px 0px ${CORES.preto};
  cursor: pointer;
  transition: all 0.2s;
  z-index: 100;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background-color: ${CORES.amarelo};
    transform: translateY(-50%) translate(-2px, -2px);
    box-shadow: 6px 6px 0px ${CORES.preto};
  }

  &:active:not(:disabled) {
    transform: translateY(-50%) translate(2px, 2px);
    box-shadow: 0 0 0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #e5e7eb;
    box-shadow: none;
  }

  ${({ $direcao }) =>
    $direcao === "esquerda" ? "left: 12px;" : "right: 12px;"}

  @media (max-width: 600px) {
    width: 40px;
    height: 40px;

    ${({ $direcao }) =>
      $direcao === "esquerda" ? "left: 8px;" : "right: 8px;"}
  }
`;
