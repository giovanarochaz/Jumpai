import styled, { keyframes, css } from 'styled-components';

// --- CORES (Tom mais sóbrio/sujo para derrota) ---
const TEMA = {
  parede: '#F3F4F6',        // Cinza claro (Parede fria)
  madeiraClara: '#A1887F',  // Madeira desbotada
  madeiraEscura: '#5D4037', // Marrom escuro
  chao1: '#8D6E63',         // Chão mais escuro
  chao2: '#6D4C41',
  rodape: '#3E2723',
  branco: '#FFFFFF',
  vermelhoErro: '#EF4444',
  cinzaTexto: '#4B5563',
};

// --- ANIMAÇÕES ---
const cairPlaca = keyframes`
  0% { transform: translateY(-500px) rotate(10deg); opacity: 0; }
  60% { transform: translateY(20px) rotate(-5deg); opacity: 1; }
  80% { transform: translateY(-10px) rotate(2deg); }
  100% { transform: translateY(0) rotate(-2deg); } /* Termina torta */
`;

const tremer = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

// --- ESTRUTURA ---

export const FundoDerrota = styled.div`
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  
  /* PAREDE SUJA */
  background-color: ${TEMA.parede};
  background-image: 
    /* Mancha grande de tinta preta/cinza escorrendo */
    radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.1) 0%, transparent 20%),
    /* Mancha de tinta vermelha no chão */
    radial-gradient(ellipse at 50% 90%, rgba(255, 0, 0, 0.15) 0%, transparent 30%),
    /* Textura da parede */
    linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px);
  background-size: 100% 100%, 100% 100%, 40px 100%;

  display: flex; justify-content: center; align-items: center;
  z-index: 300;
  overflow: hidden;

  /* CHÃO DE MADEIRA ESCURA */
  &::after {
    content: '';
    position: absolute; bottom: 0; left: 0; width: 100%; height: 35%;
    z-index: -1;
    background: repeating-linear-gradient(
      90deg,
      ${TEMA.chao2} 0px, ${TEMA.chao2} 2px,
      ${TEMA.chao1} 2px, ${TEMA.chao1} 40px
    );
    box-shadow: inset 0 20px 50px rgba(0,0,0,0.5); /* Sombra mais pesada */
  }

  /* RODAPÉ */
  &::before {
    content: '';
    position: absolute; bottom: 35%; left: 0; width: 100%; height: 15px;
    background-color: ${TEMA.rodape};
    border-top: 2px solid rgba(255,255,255,0.1);
    z-index: 0;
  }
`;

export const PlacaDerrota = styled.div`
  position: relative;
  background-color: #F9FAFB; /* Quase branco, frio */
  width: 90%; max-width: 600px;
  padding: 40px;
  
  /* Borda estilo Quadro (Torta e "velha") */
  border: 8px solid ${TEMA.madeiraClara};
  border-radius: 20px;
  
  /* Sombra no chão */
  box-shadow: 0 30px 50px rgba(0,0,0,0.4);
    
  display: flex; flex-direction: column; align-items: center; text-align: center;
  z-index: 10;
  
  /* Animação de cair e ficar torto */
  animation: ${cairPlaca} 0.6s ease-out forwards; 
  transform: rotate(-2deg);
`;

// --- ÍCONE ---

export const IconeContainer = styled.div`
  position: relative;
  width: 120px; height: 120px;
  display: flex; justify-content: center; align-items: center;
  margin-bottom: 20px;
  
  background-color: #FEE2E2; /* Vermelho bem claro */
  border-radius: 50%;
  border: 4px dashed ${TEMA.vermelhoErro};
  
  animation: ${tremer} 2s infinite; /* Tremendo de "erro" */
  
  svg { color: ${TEMA.vermelhoErro}; }
`;

// --- TEXTOS ---

export const Titulo = styled.h1`
  font-family: 'Comic Sans MS', sans-serif;
  font-size: 3rem;
  color: ${TEMA.vermelhoErro};
  text-transform: uppercase;
  font-weight: 900;
  margin: 0;
  text-shadow: 2px 2px 0px rgba(0,0,0,0.1);
`;

export const Mensagem = styled.div`
  margin: 20px 0 30px;
  font-size: 1.3rem;
  color: ${TEMA.cinzaTexto};
  line-height: 1.5;
  background-color: rgba(0,0,0,0.03);
  padding: 15px;
  border-radius: 10px;
  
  strong {
    color: ${TEMA.madeiraEscura};
    font-weight: 800;
  }
`;

// --- BOTÕES ---

export const ContainerBotoes = styled.div`
  display: flex; gap: 20px; width: 100%; justify-content: center;
`;

export const Botao = styled.button<{ $focado?: boolean }>`
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 15px 30px;
  border-radius: 20px;
  font-size: 1.1rem; font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  
  background-color: ${TEMA.branco};
  color: ${TEMA.madeiraEscura};
  border: 3px solid ${TEMA.madeiraClara};
  box-shadow: 0 5px 0 ${TEMA.madeiraClara};
  transition: all 0.2s;

  /* Estilo Focado */
  ${({ $focado }) => $focado && css`
    background-color: ${TEMA.vermelhoErro};
    color: white;
    border-color: ${TEMA.vermelhoErro};
    transform: scale(1.1);
    box-shadow: 0 8px 0 #991B1B;
  `}

  &:active { transform: translateY(4px); box-shadow: none; }
`;