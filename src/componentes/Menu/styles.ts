// src/components/Menu/styles.ts
import styled from "styled-components";

const CORES = {
  roxoPrincipal: '#8B5CF6',
  roxoEscuro: '#6D28D9',
  amarelo: '#FBBF24',
  branco: '#F1F1F1',
  preto: '#111827',
};

export const NavBar = styled.header`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 1200px;
  height: 70px;
  background-color: ${CORES.branco};
  border-radius: 50px;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  z-index: 100;

  @media (max-width: 600px) {
    top: 0;
    width: 100%;
    border-radius: 0 0 20px 20px;
  }
`;

export const NavLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${CORES.roxoEscuro};
  font-weight: 900;
  font-size: 1.5rem;
  cursor: pointer;
  
  &:hover { transform: scale(1.05); }
`;

export const NavMenu = styled.div`
  display: flex;
  gap: 20px;
`;

export const NavItem = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
  font-weight: 600;
  color: ${CORES.preto};
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${CORES.amarelo};
  }
`;
