import styled from "styled-components";
import { cores } from "../../estilos/cores";

const CONFIG_CARROSSEL = {
  larguraCard: "380px", 
  gap: "35px",
};

export const ContainerPrincipal = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: radial-gradient(circle at center, ${cores.roxoPrincipal} 0%, ${cores.roxoEscuro} 100%);
  overflow: hidden;
  position: relative;
`;

export const EnvolvedorConteudo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 110px; 
  width: 100%;
`;

export const SecaoCabecalho = styled.section`
  text-align: center;
  margin-bottom: 20px;
`;

export const TituloPagina = styled.h1`
  font-size: clamp(2rem, 5vh, 3.5rem);
  font-weight: 900;
  color: ${cores.amarelo};
  text-shadow: 4px 4px 0px ${cores.preto};
  margin: 0;
  text-transform: uppercase;
`;

export const ContainerCarrossel = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  overflow: visible;
`;

export const TrilhaCarrossel = styled.div<{ $indiceAtual: number, $semTransicao?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${CONFIG_CARROSSEL.gap};
  transition: ${({ $semTransicao }) => $semTransicao ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'};
  
  transform: translateX(calc(
    50vw - (${CONFIG_CARROSSEL.larguraCard} / 2) - 
    (${props => props.$indiceAtual} * (${CONFIG_CARROSSEL.larguraCard} + ${CONFIG_CARROSSEL.gap}))
  ));
`;

export const CardDoJogo = styled.div<{ $estaAtivo: boolean }>`
  position: relative;
  flex-shrink: 0;
  width: ${CONFIG_CARROSSEL.larguraCard};
  height: clamp(400px, 62vh, 520px);
  background-color: ${cores.branco};
  border-radius: 35px;
  padding: 15px;
  border: 5px solid ${cores.preto};
  display: flex;
  flex-direction: column;
  transition: all 0.4s ease-out;
  cursor: pointer;

  transform: ${({ $estaAtivo }) => $estaAtivo ? "scale(1.05)" : "scale(0.85)"};
  opacity: ${({ $estaAtivo }) => ($estaAtivo ? 1 : 0.4)};
  filter: ${({ $estaAtivo }) => $estaAtivo ? "none" : "grayscale(80%) blur(1px)"};
  box-shadow: ${({ $estaAtivo }) => $estaAtivo ? `15px 15px 0px ${cores.preto}` : "0 8px 30px rgba(0,0,0,0.3)"};
  z-index: ${({ $estaAtivo }) => ($estaAtivo ? 10 : 1)};
`;

export const ContainerImagemCard = styled.div`
  width: 100%;
  height: 220px; 
  border-radius: 22px;
  border: 3px solid ${cores.preto};
  overflow: hidden;
  background-color: ${cores.cinza};
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; 
  }
`;

export const ConteudoCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 15px 5px 5px;
  text-align: center;
`;

export const BlocoTexto = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1; 
  gap: 8px;
`;

export const TituloCard = styled.h2`
  font-size: 1.8rem;
  font-weight: 900;
  color: ${cores.roxoPrincipal};
  margin: 0;
  line-height: 1.1;
`;

export const DescricaoCard = styled.p`
  font-size: 0.8rem;
  color: ${cores.cinza};
  margin: 0;
  line-height: 1.4;
  max-width: 90%;
`;

export const BotaoJogar = styled.div<{ $estaAtivo?: boolean }>`
  width: 100%;
  padding: 12px;
  background-color: ${({ $estaAtivo }) => $estaAtivo ? cores.amarelo : cores.roxoPrincipal};
  color: ${({ $estaAtivo }) => $estaAtivo ? cores.preto : cores.branco};
  font-weight: 800;
  border-radius: 18px;
  border: 3px solid ${cores.preto};
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: 0.2s;

  ${CardDoJogo}:hover & {
    background-color: ${cores.amarelo};
    color: ${cores.preto};
  }
`;

export const BotaoNavegacao = styled.button<{ $direcao: "esquerda" | "direita" }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 55px;
  height: 55px;
  background-color: ${cores.branco};
  border: 4px solid ${cores.preto};
  border-radius: 50%;
  box-shadow: 4px 4px 0px ${cores.preto};
  cursor: pointer;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  ${({ $direcao }) => $direcao === "esquerda" ? "left: 3vw;" : "right: 3vw;"}

  &:hover {
    background-color: ${cores.amarelo};
    transform: translateY(-50%) scale(1.1);
  }
`;