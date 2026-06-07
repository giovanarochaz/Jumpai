import styled from "styled-components";

export const ContainerDoJogo = styled.main`
  position: relative;
  width: 100vw;
  height: 100vh;
  /* Cor roxa de fundo padrão do JUMPAI */
  background-color: #8B5CF6; 
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const ConteudoEstado = styled.div`
  flex: 1;
  width: 100%;
  /* 110px é o espaço ideal para o menu (70px) + margem (20px) + respiro (20px) */
  padding-top: 110px; 
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
`;

/* 
   Estilo extra para quando o jogo estiver rodando.
   Garante que o canvas do jogo ocupe o espaço correto 
   sem quebras de layout.
*/
export const WrapperJogoAtivo = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;