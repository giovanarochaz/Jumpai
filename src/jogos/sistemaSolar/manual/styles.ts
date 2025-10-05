import styled, { keyframes, css } from 'styled-components'; // Adicione 'css'
import { cores } from '../../../estilos/cores';

// (Animações aparecer, rotacionarPlaneta, pulsar continuam as mesmas)
const aparecer = keyframes`
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const rotacionarPlaneta = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.05); }
  100% { transform: rotate(360deg) scale(1); }
`;

const pulsar = keyframes`
  0% { transform: scale(1); }
  70% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// --- NOVA ANIMAÇÃO DE FOCO ---
const focoPulsante = keyframes`
  0% { box-shadow: 0 0 0 0px ${cores.amarelo}; }
  100% { box-shadow: 0 0 0 10px rgba(255, 203, 5, 0); }
`;


// --- COMPONENTES PRINCIPAIS (FundoModal, ConteudoModal) - sem alterações ---
export const FundoModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
  animation: ${aparecer} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

export const ConteudoModal = styled.div`
  background-color: ${cores.branco};
  color: ${cores.preto};
  padding: 40px;
  border: 5px solid ${cores.roxo};
  border-radius: 30px;
  width: 90%;
  max-width: 800px;
  min-height: 500px;
  box-shadow: 6px 6px 0px ${cores.preto};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

// --- COMPONENTES DOS SLIDES (ContainerSlide, etc) - sem alterações ---
export const ContainerSlide = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

export const PlanetaAnimado = styled.img`
  width: 250px;
  height: 250px;
  animation: ${rotacionarPlaneta} 25s linear infinite;
`;

export const TextoSlide = styled.div`
  flex: 1;
  h2 {
    font-size: 3rem;
    margin-bottom: 15px;
    color: ${cores.roxo};
    font-weight: 900;
    text-align: left;
  }
  p {
    font-size: 1.2rem;
    line-height: 1.6;
  }
`;

export const ContainerExplicacao = styled.div`
  padding: 10px;
`;

export const SecaoExplicacao = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 25px;
`;

export const WrapperIcone = styled.div`
  background-color: ${cores.amarelo};
  color: ${cores.roxo};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border: 3px solid ${cores.preto};
`;

export const WrapperTexto = styled.div`
  h3 {
    margin: 0 0 5px 0;
    font-size: 1.5rem;
    color: ${cores.roxo};
  }
  p {
    margin: 0;
    font-size: 1.1rem;
    line-height: 1.5;
  }
`;

// --- COMPONENTES DA TELA DE CONFIGURAÇÕES - COM ALTERAÇÕES ---
export const ContainerConfiguracoes = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

export const LinhaConfiguracao = styled.div<{ $isFocused?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0,0,0,0.05);
  padding: 15px;
  border-radius: 15px;
  transition: all 0.3s ease;
  border: 3px solid transparent;

  ${({ $isFocused }) => $isFocused && css`
    border-color: ${cores.amarelo};
    transform: scale(1.02);
  `}
`;

export const RotuloConfiguracao = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: ${cores.roxo};
  }
`;

export const GrupoBotoes = styled.div`
  display: flex;
  gap: 10px;
`;

export const BotaoOpcao = styled.button<{ ativo: boolean; $isFocused?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 100px;
  min-height: 40px;
  background-color: ${({ ativo }) => (ativo ? cores.amarelo : cores.branco)};
  color: ${cores.preto};
  border: 4px solid ${({ ativo }) => (ativo ? cores.roxo : cores.preto)};
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 6px 6px 0px ${({ ativo }) => (ativo ? cores.roxo : cores.preto)};
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.15s ease-out;

  ${({ $isFocused }) => $isFocused && css`
    animation: ${focoPulsante} 1s infinite;
    transform: scale(1.1);
  `}
`;

export const ContainerInterruptor = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

export const InputInterruptor = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

export const DeslizadorInterruptor = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }

  ${InputInterruptor}:checked + & {
    background-color: ${cores.verde};
  }

  ${InputInterruptor}:checked + &:before {
    transform: translateX(26px);
  }
`;

// --- BOTÕES DE NAVEGAÇÃO E AÇÃO - COM ALTERAÇÕES ---
export const NavegacaoCarrossel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

export const BotaoNavegacao = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 180px;
  min-height: 60px;
  background-color: ${cores.branco};
  color: ${cores.preto};
  border: 4px solid ${cores.preto};
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 6px 6px 0px ${cores.preto};
  font-size: 1.1rem;
  font-weight: bold;
  transition: all 0.15s ease-out;

  &:hover:not(:disabled) {
    background-color: ${cores.amarelo};
    color: ${cores.preto};
    transform: translate(3px, 3px);
    box-shadow: 3px 3px 0px ${cores.preto};
  }

  &:active:not(:disabled) {
    transform: translate(6px, 6px);
    box-shadow: 0px 0px 0px ${cores.preto};
  }

  &:disabled {
    background-color: #ccc;
    box-shadow: 6px 6px 0px #999;
    cursor: not-allowed;
  }
`;

export const BotaoIniciarMissao = styled.button<{ $isFocused?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 220px;
  min-height: 60px;
  background-color: ${cores.verde};
  color: ${cores.branco};
  border: 4px solid ${cores.preto};
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 8px 8px 0px ${cores.preto};
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 0 rgba(0,0,0,0.2);
  margin: 20px auto 0;
  transition: all 0.15s ease-out;
  animation: ${pulsar} 2s infinite;

  &:hover {
    transform: translate(4px, 4px);
    box-shadow: 4px 4px 0px ${cores.preto};
  }
  
  &:active {
    transform: translate(8px, 8px);
    box-shadow: 0px 0px 0px ${cores.preto};
    animation: none;
  }
  
  ${({ $isFocused }) => $isFocused && css`
    animation: ${pulsar} 1.5s infinite, ${focoPulsante} 1.5s infinite;
    transform: scale(1.05);
  `}
`;