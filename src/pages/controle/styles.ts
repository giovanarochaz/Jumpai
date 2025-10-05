import styled from 'styled-components';
import { cores } from '../../estilos/cores';

export const ContainerDaTela = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  padding: clamp(1rem, 4vw, 2rem);
  gap: clamp(1.5rem, 5vw, 3rem);
  background-color: ${cores.roxo};
`;

export const BlocoDeDescricao = styled.div`
  max-width: 950px;
  text-align: center;
`;

export const Titulo = styled.h1`
  font-size: 4rem;
  font-weight: 900; 
  color: ${cores.amarelo};
  text-shadow: 4px 4px 0px ${cores.preto};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

export const Paragrafo = styled.p`
  font-size: 1.5rem;
  line-height: 1.6;
  font-weight: 400;
  color: ${cores.branco};
  text-shadow: 1px 1px 2px ${cores.preto};
`;

export const AgrupadorDeBotoes = styled.div`
  display: flex;
  gap: clamp(1rem, 4vw, 2.5rem);
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 1.2rem;
    align-items: center;
  }
`;

export const BotaoEstilizado = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: clamp(180px, 30vw, 300px);
  height: clamp(120px, 20vw, 260px);
  background-color: ${cores.branco};
  border: 4px solid ${cores.preto};
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 6px 6px 0px ${cores.preto};
  transition: all 0.15s ease-out;

  &:hover {
    background-color: ${cores.amarelo};
    transform: translate(3px, 3px);
    box-shadow: 3px 3px 0px ${cores.preto};
    color: ${cores.preto};
  }

  &:active {
    transform: translate(6px, 6px); 
    box-shadow: 0px 0px 0px ${cores.preto};
  }

  @media (max-width: 600px) {
    width: 90vw;
    height: 100px;
    font-size: 1rem;
  }
`;

export const TextoDoBotao = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
`;