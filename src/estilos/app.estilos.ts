import styled from 'styled-components';

const breakpointDesktop = '1024px';

export const ContainerDesktop = styled.div`
  @media (max-width: ${breakpointDesktop}) {
    display: none;
  }
`;

export const ContainerMobile = styled.div`
  display: none;
  width: 100vw;
  height: 100vh;
  @media (max-width: ${breakpointDesktop}) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
