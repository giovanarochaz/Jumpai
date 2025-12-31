import styled, { keyframes } from 'styled-components';
import { cores } from '../../estilos/cores';

const flutuar = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const aparecer = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const ConteinerPrincipal = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: radial-gradient(circle at center, ${cores.roxoPrincipal} 0%, ${cores.roxoEscuro} 100%);
  color: ${cores.branco};
  overflow: hidden;
  position: relative;
`;

export const AreaConteudo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 120px 20px 20px; 
  animation: ${aparecer} 0.8s ease-out;

  @media (max-height: 700px) {
    padding-top: 100px;
    justify-content: space-evenly;
  }
`;

export const SecaoCabecalho = styled.section`
  text-align: center;
  margin-bottom: clamp(1rem, 3vh, 2rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const TituloJogo = styled.h1`
  font-size: clamp(3.5rem, 12vh, 6.5rem);
  font-weight: 900;
  color: ${cores.amarelo};
  margin: 0;
  letter-spacing: 4px;
  text-shadow: 6px 6px 0px ${cores.preto};
  line-height: 1;
`;

export const TextoDescricao = styled.p`
  font-size: clamp(0.9rem, 1.8vh, 1.2rem);
  line-height: 1.5;
  max-width: 650px;
  margin-top: 1.5rem;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);

  @media (max-height: 650px) {
    max-width: 550px;
    margin-top: 0.5rem;
  }
`;

export const EnvoltorioSubtitulo = styled.div`
  margin-top: clamp(1rem, 3vh, 2.5rem);
  background-color: rgba(255,255,255, 0.15);
  padding: 10px 30px;
  border-radius: 50px;
  border: 2px solid rgba(255,255,255, 0.4);
  font-size: clamp(0.9rem, 2.2vh, 1.3rem);
  font-weight: 700;
  color: ${cores.branco};
  animation: ${flutuar} 3s ease-in-out infinite;
`;

export const SecaoNavegacao = styled.div`
  display: flex;
  gap: clamp(1.5rem, 5vw, 4rem);
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1.5rem;
`;

export const CartaoSelecao = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: clamp(260px, 25vw, 350px);
  height: clamp(180px, 28vh, 250px);
  background-color: ${cores.branco};
  border: 4px solid ${cores.preto};
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 10px 10px 0px ${cores.preto};
  transition: all 0.2s ease-in-out;
  color: ${cores.preto};

  svg {
    width: clamp(45px, 7vh, 65px);
    height: clamp(45px, 7vh, 65px);
  }

  &:hover {
    background-color: ${cores.amarelo};
    transform: translate(-5px, -5px);
    box-shadow: 15px 15px 0px ${cores.preto};
  }

  &:active {
    transform: translate(5px, 5px);
    box-shadow: 2px 2px 0px ${cores.preto};
  }

  @media (max-height: 700px) {
    height: clamp(160px, 26vh, 190px);
    gap: 0.5rem;
  }
`;

export const TextoCartao = styled.span`
  font-size: clamp(1.3rem, 2.8vh, 1.8rem);
  font-weight: 900;
  text-transform: uppercase;
`;

export const DescricaoCartao = styled.span`
  font-size: clamp(0.8rem, 1.5vh, 1rem);
  font-weight: 500;
  opacity: 0.7;
`;