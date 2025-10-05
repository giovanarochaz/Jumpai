// src/pages/Jogo/styles.ts
import styled from 'styled-components';
import { cores } from '../../estilos/cores';

export const ContainerTela = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: auto;
  min-height: 100vh;
  padding: 2rem 0; /* Remove padding lateral para o carrossel ir até a borda */
  gap: 3rem;
  background-color: ${cores.roxo};
`;

export const BlocoDescricao = styled.div`
  max-width: 950px;
  text-align: center;
  padding: 0 2rem;
`;

export const Paragrafo = styled.p`
  font-size: 1.5rem;
  line-height: 1.6;
  font-weight: 400;
  color: ${cores.branco};
  text-shadow: 1px 1px 2px ${cores.preto};
`;

// --- ESTRUTURA DO CARROSSEL ---

export const CarrosselContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;


export const CarrosselViewport = styled.div`
  width: 100%;
  overflow: hidden;
  
  /* CORREÇÃO AQUI: Adiciona um padding vertical para o card ter espaço para crescer no hover sem ser cortado. */
  padding: 2rem 0;
`;

export const CarrosselTrilha = styled.div<{ indiceAtual: number }>`
  display: flex;
  align-items: center;
  gap: 40px;
  transition: transform 0.6s ease-in-out;

  /* Calcula o deslocamento horizontal com base na largura real do card (responsivo) */
  transform: translateX(
    calc(
      50% - min(90vw, 500px) / 2 - (${props => props.indiceAtual} * (min(90vw, 500px) + 40px))
    )
  );
`;


export const ImagemCard = styled.img`
  width: 100%;
  height: auto;
  max-height: 220px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
`;

export const CardJogo = styled.div<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: clamp(1rem, 3vw, 1.5rem);
  gap: clamp(0.5rem, 2vw, 1rem);

  flex-shrink: 0;
  width: clamp(220px, 70vw, 500px);
  height: auto;

  background-color: ${cores.branco};
  color: ${cores.roxo};
  border: 4px solid ${cores.preto};
  border-radius: 20px;
  box-shadow: 6px 6px 0px ${cores.preto};

  transition: all 0.4s ease-in-out;
  cursor: pointer;

  transform: scale(${props => (props.$isActive ? 1 : 0.8)});
  opacity: ${props => (props.$isActive ? 1 : 0.5)};

  &:hover {
  transform: scale(${props => (props.$isActive ? 1.05 : 0.85)});
  opacity: ${props => (props.$isActive ? 1 : 0.7)};
  }


  @media (max-width: 600px) {
    width: 95vw;
    padding: 0.7rem;
    font-size: 1rem;
  }
`;

export const TextoCard = styled.p`
  font-size: 1.1rem; /* Diminuímos um pouco para caber melhor */
  font-weight: 700;
  line-height: 1.4;
  max-width: 95%;
`;

export const BotaoNavegacao = styled.button<{ direcao: 'esquerda' | 'direita' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  left: ${props => props.direcao === 'esquerda' ? '5%' : 'auto'};
  right: ${props => props.direcao === 'direita' ? '5%' : 'auto'};
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(40px, 7vw, 70px);
  height: clamp(40px, 7vw, 70px);
  background-color: ${cores.branco};
  border: 4px solid ${cores.preto};
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 6px 6px 0px ${cores.preto};
  color: ${cores.preto};
  transition: all 0.15s ease-out;

  &:hover {
    background-color: ${cores.amarelo};
    transform: translateY(-50%) translate(3px, 3px);
    box-shadow: 3px 3px 0px ${cores.preto};
    color: ${cores.preto};
  }

  &:active {
    transform: translateY(-50%) translate(6px, 6px);
    box-shadow: 0px 0px 0px ${cores.preto};
  }

  @media (max-width: 600px) {
    left: ${props => props.direcao === 'esquerda' ? '10px' : 'auto'};
    right: ${props => props.direcao === 'direita' ? '10px' : 'auto'};
    width: 40px;
    height: 40px;
  }
`;
