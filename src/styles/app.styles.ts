import styled from 'styled-components';

const breakpointDesktop = '1024px';

export const ContainerDesktop = styled.div`
  /* Em telas menores que o breakpoint, ele desaparece. */
  @media (max-width: ${breakpointDesktop}) {
    display: none;
  }
`;

export const ContainerMobile = styled.div`
  display: none; 
  width: 100vw;
  height: 100vh;
  
  @media (max-width: ${breakpointDesktop}) {
    display: flex; /* Usamos flex para centralizar o conteúdo dentro dele */
    justify-content: center;
    align-items: center;
  }
`;