import styled, { keyframes } from 'styled-components';
import { cores } from '../../estilos/cores';

const aparecer = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

export const FundoDoModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Z-index alto para ficar acima de tudo */
  padding: 20px;
`;

export const ConteudoDoModal = styled.div`
  background-color: ${cores.roxo};
  border: 4px solid ${cores.branco};
  border-radius: 30px;
  width: clamp(300px, 85vw, 500px);
  padding: clamp(30px, 5vh, 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: ${aparecer} 0.3s ease-out;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
`;

export const ImagemDoModal = styled.img`
  height: clamp(70px, 15vh, 110px);
  margin-bottom: 25px;
  object-fit: contain;
`;

export const TituloDoModal = styled.h2`
  color: ${cores.amarelo};
  font-size: clamp(1.5rem, 4vh, 2.2rem);
  text-transform: uppercase;
  margin: 0 0 15px 0;
  text-shadow: 2px 2px 0px ${cores.preto};
`;

export const DescricaoDoModal = styled.p`
  color: ${cores.branco};
  font-size: clamp(1rem, 2.5vh, 1.25rem);
  line-height: 1.4;
  margin: 0;
  opacity: 0.95;
  font-weight: 500;
`;