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

const girar = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
`;

export const ConteinerPrincipal = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background: radial-gradient(circle at center, ${cores.roxoPrincipal} 0%, ${cores.roxoEscuro} 100%);
  background-image: 
    radial-gradient(circle at center, ${cores.roxoPrincipal} 0%, ${cores.roxoEscuro} 100%),
    radial-gradient(${cores.branco} 1px, transparent 1px);
  background-size: 100% 100%, 40px 40px;
  background-position: center, 0 0;
  color: ${cores.branco};
  overflow-x: hidden;
  position: relative;
`;

export const AreaConteudo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 20px 40px;
  animation: ${aparecer} 0.8s ease-out;

  @media (max-height: 700px) {
    padding-top: 60px;
    justify-content: flex-start;
  }
`;

export const SecaoCabecalho = styled.section`
  text-align: center;
  margin-bottom: clamp(1.5rem, 4vh, 3rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
`;

export const TituloJogo = styled.h1`
  position: relative;
  font-size: clamp(3rem, 10vh, 5.5rem);
  font-weight: 900;
  color: ${cores.amarelo};
  margin: 0;
  letter-spacing: 4px;
  text-shadow: 6px 6px 0px ${cores.preto};
  
  .icone-decoresativo {
    position: absolute;
    top: -10px; 
    right: -45px;
    color: ${cores.branco};
    animation: ${girar} 4s linear infinite;
    
    @media (max-width: 480px) {
        display: none;
    }
  }
`;

export const TextoDescricao = styled.p`
  font-size: clamp(1rem, 1.5vh, 1.25rem);
  line-height: 1.5;
  max-width: 700px;
  margin-top: 1rem;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);

  @media (max-height: 600px) {
    display: none;
  }
`;

export const EnvoltorioSubtitulo = styled.div`
  margin-top: clamp(1rem, 3vh, 2.5rem);
  background-color: rgba(255,255,255, 0.2);
  padding: 8px 25px;
  border-radius: 50px;
  border: 2px solid ${cores.branco};
  font-size: clamp(1rem, 2vh, 1.4rem);
  font-weight: 700;
  color: ${cores.branco};
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  animation: ${flutuar} 3s ease-in-out infinite;
`;

export const SecaoNavegacao = styled.div`
  display: flex;
  gap: clamp(1rem, 5vw, 3rem);
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 1400px;
`;

export const CartaoSelecao = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: clamp(240px, 22vw, 320px);
  height: clamp(180px, 25vh, 240px);
  background-color: ${cores.branco};
  border: 4px solid ${cores.preto};
  border-radius: 24px;
  cursor: pointer;
  box-shadow: 8px 8px 0px ${cores.preto};
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  color: ${cores.preto};

  svg {
    width: clamp(40px, 6vh, 64px);
    height: clamp(40px, 6vh, 64px);
    transition: transform 0.3s;
  }

  &:hover {
    background-color: ${cores.amarelo};
    transform: translate(-4px, -4px);
    box-shadow: 12px 12px 0px ${cores.preto};
    
    svg {
      transform: scale(1.2) rotate(-5deg);
    }
  }

  &:active {
    transform: translate(4px, 4px); 
    box-shadow: 2px 2px 0px ${cores.preto};
  }

  @media (max-height: 700px) {
    height: clamp(140px, 20vh, 180px);
    gap: 0.5rem;
  }

  @media (max-width: 650px) {
    width: 85%;
    height: auto;
    padding: 20px;
    flex-direction: row;
    justify-content: flex-start;
    padding-left: 30px;
  }
`;

export const TextoCartao = styled.span`
  font-size: clamp(1.1rem, 2.2vh, 1.7rem);
  font-weight: 800;
  text-transform: uppercase;
`;

export const DescricaoCartao = styled.span`
  font-size: clamp(0.7rem, 1.2vh, 0.9rem);
  font-weight: 500;
  opacity: 0.7;

  @media (max-width: 650px) {
    display: none;
  }
`;