import styled, { keyframes } from 'styled-components';

const scaleIn = keyframes`
  from { transform: scale(0.7) rotate(10deg); opacity: 0; }
  to { transform: scale(1) rotate(0deg); opacity: 1; }
`;

export const DefeatOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 300;
  animation: ${scaleIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

export const DefeatContent = styled.div`
  background: linear-gradient(145deg, #a21a2f, #d43f55);
  color: #f1f1f1;
  padding: 50px;
  border-radius: 30px;
  border: 5px solid #111111;
  text-align: center;
  position: relative;
`;

export const DefeatIcon = styled.div`
  margin-bottom: 20px;
  color: #f1f1f1;
`;

export const DefeatTitle = styled.h1`
  font-size: 3rem;
  color: #f1f1f1;
  text-shadow: 3px 3px 0 #111111;
  margin: 0;
`;

export const DefeatMessage = styled.p`
  font-size: 1.2rem;
  max-width: 400px;
  margin: 15px 0 30px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

export const DefeatButton = styled.button`
  background-color: #f1f1f1;
  color: #a21a2f;
  border: 3px solid #111;
  box-shadow: 6px 6px 0px #111;
  padding: 12px 25px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.1s ease-in-out;

  &:hover {
    background-color: #FDBF5C;
    color: #111;
    transform: translate(3px, 3px);
    box-shadow: 3px 3px 0px #111;
  }

  &:active {
    transform: translate(6px, 6px);
    box-shadow: 0px 0px 0px #111;
  }
`;