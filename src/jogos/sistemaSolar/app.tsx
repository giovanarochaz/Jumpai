import { useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import TelaVitoria from './vitoria';
import JogoSistemaSolar from './jogo';
import ManualSistemaSolar from './manual';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #0a1c3c;
    overflow: hidden;
  }
`;

function App() {
  const [gameState, setGameState] = useState<'manual' | 'playing' | 'victory'>('manual');

  const handleStartMission = () => {
    setGameState('playing');
  };

  const handleVictory = () => {
    setGameState('victory');
  };
  
  const handleRestart = () => {
    setGameState('manual'); 
  };

  return (
    <>
      <GlobalStyle />
      {gameState === 'manual' && <ManualSistemaSolar onStartMission={handleStartMission} />}
      {gameState === 'playing' && <JogoSistemaSolar onVictory={handleVictory} />}
      {gameState === 'victory' && <TelaVitoria onRestart={handleRestart} />}
    </>
  );
}

export default App;