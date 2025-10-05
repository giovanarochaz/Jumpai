import styled, { keyframes } from 'styled-components';
import { cores } from '../../estilos/cores';

// Animação para o modal surgir suavemente
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

// Camada de fundo que cobre a tela inteira
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
  z-index: 2000; // Z-index alto para garantir que fique sobre todo o conteúdo
  padding: 20px;
  box-sizing: border-box;
`;

// A caixa de conteúdo do modal
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
  font-family: sans-serif;
  animation: ${surgir} 0.3s ease-out forwards;
`;

// Estilo para a imagem/ícone do modal
export const ImagemDoModal = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
`;

// Estilo para o título do modal
export const TituloDoModal = styled.h2`
  font-size: 1.8rem;
  color: ${cores.preto};
  margin: 0 0 10px 0;
`;

// Estilo para o parágrafo de descrição do modal
export const DescricaoDoModal = styled.p`
  font-size: 1rem;
  color: ${cores.cinza};
  line-height: 1.5;
  margin: 0;
`;