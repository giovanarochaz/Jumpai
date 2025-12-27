import styled, { keyframes, css } from 'styled-components';

// --- CORES DA DERROTA ---
const TEMA = {
  madeiraMolhada: '#5D4037', // Madeira escura
  azulAgua: '#0EA5E9',       // Azul piscina
  azulEscuro: '#0369A1',
  branco: '#E0F2FE',         // Branco azulado
  textoEscuro: '#281815'
};

// --- ANIMAÇÕES ---
const cairNaAgua = keyframes`
  0% { transform: translateY(-300px) rotate(10deg); opacity: 0; }
  60% { transform: translateY(20px) rotate(-5deg); opacity: 1; }
  100% { transform: translateY(0) rotate(-2deg); }
`;

const pingo = keyframes`
  0% { transform: translateY(0) scale(1); opacity: 0.8; }
  100% { transform: translateY(30px) scale(0); opacity: 0; }
`;

const flutuarNaAgua = keyframes`
  0%, 100% { transform: rotate(-2deg) translateY(0); }
  50% { transform: rotate(2deg) translateY(5px); }
`;

// --- COMPONENTES ---

export const FundoDerrota = styled.div`
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  
  /* IMAGEM DA LAGOA DE FUNDO */
  background-image: url('/assets/saltoAlfabetico/fundo_lagoa.png');
  background-size: cover;
  background-position: center;

  /* Overlay azul escuro para indicar submersão/erro */
  &::before {
    content: '';
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(3, 105, 161, 0.7); /* Azulão */
    backdrop-filter: blur(2px);
  }

  display: flex; justify-content: center; align-items: center;
  z-index: 300;
`;

export const PlacaDerrota = styled.div`
  position: relative;
  
  /* Madeira Molhada (Escura e Azulada) */
  background-color: ${TEMA.madeiraMolhada};
  border: 6px solid ${TEMA.azulAgua};
  border-radius: 40px;
  padding: 40px;
  width: 90%; max-width: 600px;
  
  display: flex; flex-direction: column; align-items: center; text-align: center;
  
  box-shadow: 
    inset 0 0 50px ${TEMA.azulEscuro}, /* Sombra interna de água */
    0 20px 40px rgba(0,0,0,0.6);
    
  animation: ${cairNaAgua} 0.6s ease-out, ${flutuarNaAgua} 3s ease-in-out infinite 0.6s;

  /* Gotas caindo da placa */
  &::after {
    content: '💧';
    position: absolute; bottom: -30px; left: 20%;
    font-size: 24px; animation: ${pingo} 1.5s infinite;
  }
  &::before {
    content: '💧';
    position: absolute; bottom: -40px; right: 20%;
    font-size: 24px; animation: ${pingo} 2s infinite 0.5s;
  }
`;

export const IconeContainer = styled.div`
  background-color: ${TEMA.azulAgua};
  width: 120px; height: 120px;
  border-radius: 50%;
  border: 5px solid ${TEMA.branco};
  display: flex; justify-content: center; align-items: center;
  box-shadow: 0 8px 0 ${TEMA.azulEscuro};
  margin-bottom: 20px;
  
  svg { color: ${TEMA.branco}; }
`;

export const Titulo = styled.h1`
  font-family: 'Comic Sans MS', cursive, sans-serif;
  font-size: 3rem;
  color: ${TEMA.branco};
  text-transform: uppercase;
  margin: 0;
  text-shadow: 3px 3px 0 ${TEMA.azulEscuro};
`;

export const Mensagem = styled.div`
  margin: 20px 0;
  font-size: 1.3rem;
  color: ${TEMA.textoEscuro};
  background-color: rgba(224, 242, 254, 0.8); /* Azul clarinho */
  padding: 15px;
  border-radius: 15px;
  border: 2px solid ${TEMA.azulEscuro};
  
  strong { color: ${TEMA.azulEscuro}; font-weight: 900; }
`;

export const ContainerBotoes = styled.div`
  display: flex; gap: 20px; margin-top: 20px;
`;

export const Botao = styled.button<{ $focado?: boolean }>`
  display: flex; align-items: center; gap: 10px;
  padding: 15px 30px;
  border-radius: 20px;
  font-size: 1.1rem; font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.2s;

  background-color: ${TEMA.branco};
  color: ${TEMA.azulEscuro};
  border: 3px solid ${TEMA.azulEscuro};
  box-shadow: 0 6px 0 ${TEMA.azulEscuro};

  ${({ $focado }) => $focado && css`
    background-color: ${TEMA.azulAgua};
    color: white;
    transform: scale(1.1);
    box-shadow: 0 10px 0 ${TEMA.azulEscuro};
    border-color: white;
  `}

  &:active { transform: translateY(4px); box-shadow: none; }
`;