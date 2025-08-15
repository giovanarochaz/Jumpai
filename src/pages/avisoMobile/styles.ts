import styled from 'styled-components';
import { colors } from '../../styles/colors';

export const ContainerAviso = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100%;
  background-color: ${colors.roxo};
  padding: 2rem;
  gap: 1.5rem;
`;

export const TituloAviso = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  color: ${colors.amarelo};
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.5);
`;

export const MensagemAviso = styled.p`
  font-size: 1.2rem;
  max-width: 400px;
  line-height: 1.6;
  color: ${colors.branco};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;