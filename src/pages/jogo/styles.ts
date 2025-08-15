// src/pages/Jogo/styles.ts
import styled from 'styled-components';
import { colors } from '../../styles/colors'; // Verifique o caminho das suas cores

export const ContainerTela = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding: 2rem 0; /* Remove padding lateral para o carrossel ir até a borda */
  gap: 3rem;
  background-color: ${colors.roxo};
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
  color: ${colors.branco};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
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

export const CarrosselTrilha = styled.div<{ indiceAtual: number; }>`
  display: flex;
  align-items: center;
  gap: 40px;
  
  transition: transform 0.6s ease-in-out;
  
  transform: translateX(calc(50% - 200px - (${props => props.indiceAtual} * (500px + 50px))));
`;

// NOVO: Componente para estilizar a imagem dentro do card
export const ImagemCard = styled.img`
  width: 100%;
  height: 200px; /* Altura fixa para a área da imagem */
  object-fit: cover; /* Garante que a imagem cubra a área sem distorcer */
  border-radius: 10px;
  margin-bottom: 1rem;
`;

export const CardJogo = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Alinha o conteúdo ao topo */
  text-align: center;
  padding: 1.5rem;
  gap: 1rem;
  
  flex-shrink: 0;
  width: 500px;
  height: 520px; /* Altura total do card */

  background-color: ${colors.branco};
  color: ${colors.roxo};
  border: 4px solid ${colors.preto};
  border-radius: 20px;
  box-shadow: 6px 6px 0px ${colors.preto};
  
  transition: all 0.4s ease-in-out;
  cursor: pointer;

  transform: scale(${props => (props.isActive ? 1 : 0.8)});
  opacity: ${props => (props.isActive ? 1 : 0.5)};
  
  &:hover {
    /* Aumentamos um pouco a escala no hover para ficar mais visível */
    transform: scale(${props => (props.isActive ? 1.05 : 0.85)});
    opacity: ${props => (props.isActive ? 1 : 0.7)};
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
  z-index: 10; // Garante que fique acima dos outros elementos

  left: ${props => props.direcao === 'esquerda' ? 'calc(50% - 400px)' : 'auto'};
  right: ${props => props.direcao === 'direita' ? 'calc(50% - 400px)' : 'auto'};
  
  background: transparent;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: ${colors.branco};
  
  transition: transform 0.2s ease, color 0.2s ease;

  &:hover {
    transform: translateY(-50%) scale(1.15);
    color: ${colors.amarelo}; // Cor de destaque no hover
  }

  &:active {
    transform: translateY(-50%) scale(1.05);
  }

  /* Media query para telas menores */
  @media (max-width: 900px) {
    left: ${props => props.direcao === 'esquerda' ? '10px' : 'auto'};
    right: ${props => props.direcao === 'direita' ? '10px' : 'auto'};
  }
`;
