import styled, { keyframes } from 'styled-components';
import { cores } from '../../estilos/cores';

const surgir = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const FundoDoModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
  box-sizing: border-box;
`;

export const ConteudoDoModal = styled.div`
  background-color: ${cores.branco};
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: ${surgir} 0.3s ease-out forwards;
`;

export const ImagemDoModal = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
`;

export const TituloDoModal = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin: 0 0 10px 0;
`;

export const DescricaoDoModal = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
`;
