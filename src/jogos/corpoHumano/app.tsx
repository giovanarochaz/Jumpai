import { useState } from 'react';
import { GlobalStyle } from '../../styles/global';
import ManualCorpoHumano from './manual';
import JogoCorpoHumano from './jogo';
import TelaVitoria from './vitoria';
import TelaDerrota from './derrota';


function CorpoHumano() {
  const [gameState, setGameState] = useState<'manual' | 'playing' | 'victory' | 'defeat'>('manual');

  const handleStartMission = () => {
    setGameState('playing');
  };

  const handleVictory = () => {
    setGameState('victory');
  };
  
  const handleRestart = () => {
    setGameState('manual'); 
  };
  
  const handleDefeat = () => setGameState('defeat');

  return (
    <>
      <GlobalStyle />
      {gameState === 'manual' && <ManualCorpoHumano onStart={handleStartMission} />}
      {gameState === 'playing' && <JogoCorpoHumano onVictory={handleVictory} onDefeat={handleDefeat} />}
      {gameState === 'victory' && <TelaVitoria onRestart={handleRestart} />}
      {gameState === 'defeat' && <TelaDerrota onRestart={handleRestart} />}

    </>
  );
}

export default CorpoHumano;