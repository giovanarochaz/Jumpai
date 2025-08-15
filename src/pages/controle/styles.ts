import styled from 'styled-components';
import { colors } from '../../styles/colors';

export const ContainerDaTela = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding: 2rem;
  gap: 3rem;
  background-color: ${colors.roxo};
`;

export const BlocoDeDescricao = styled.div`
  max-width: 950px;
  text-align: center;
`;

export const Titulo = styled.h1`
  font-size: 4rem;
  font-weight: 900; 
  color: ${colors.amarelo};
  text-shadow: 4px 4px 0px ${colors.preto}; 
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

export const Paragrafo = styled.p`
  font-size: 1.5rem;
  line-height: 1.6;
  font-weight: 400;
  color: ${colors.branco};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); 
`;

export const AgrupadorDeBotoes = styled.div`
  display: flex;
  gap: 2.5rem; /* Aumenta o espaço */

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

export const BotaoEstilizado = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 300px;
  height: 260px;
  background-color: ${colors.branco};
  border: 4px solid ${colors.preto};
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 6px 6px 0px ${colors.preto};
  
  transition: all 0.15s ease-out;

  &:hover {
    background-color: ${colors.amarelo};
    transform: translate(3px, 3px);
    box-shadow: 3px 3px 0px ${colors.preto};
    color: ${colors.preto};
  }

  &:active {
    transform: translate(6px, 6px); 
    box-shadow: 0px 0px 0px ${colors.preto};
  }
`;

export const TextoDoBotao = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
`;