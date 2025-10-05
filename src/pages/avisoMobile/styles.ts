import styled from 'styled-components';
import { cores } from '../../estilos/cores';

export const ContainerAviso = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100%;
  background-color: ${cores.roxo};
  padding: 2rem;
  gap: 1.5rem;
`;

export const TituloAviso = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  color: ${cores.amarelo};
  text-shadow: 3px 3px 0px ${cores.preto};
`;

export const MensagemAviso = styled.p`
  font-size: 1.2rem;
  max-width: 400px;
  line-height: 1.6;
  color: ${cores.branco};
  text-shadow: 1px 1px 2px ${cores.preto};
`;