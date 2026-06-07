import styled from "styled-components";

export const ContainerDoJogo = styled.main`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const ConteudoEstado = styled.div`
  flex: 1;
  width: 100%;
  padding-top: 110px; 
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
`;

export const WrapperJogoAtivo = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;