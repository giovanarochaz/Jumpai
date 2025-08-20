import { createGlobalStyle } from 'styled-components';
import { colors } from './colors';

export const GlobalStyle = createGlobalStyle`
  /* RESET BÁSICO */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    width: 100%;
    font-family: 'Nunito', sans-serif;
    background-color: ${colors.roxo};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    line-height: 1.5;
    overflow-x: hidden;
    overflow-y: auto; /* garante rolagem vertical */

  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    outline: none;
  }

  button {
    cursor: pointer;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul, ol {
    list-style: none;
  }

  /* Remove scrollbars no Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${colors.roxo} ${colors.branco};
  }

  /* Remove scrollbars no Chrome/Safari/Edge */
  *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  *::-webkit-scrollbar-thumb {
    background-color: ${colors.roxo};
    border-radius: 10px;
  }

  *::-webkit-scrollbar-track {
    background: ${colors.branco};
  }
`;
