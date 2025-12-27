import React, { useState } from 'react';
import JogoSaltoAlfabetico from './jogo';
import ManualSaltoAlfabetico, { type ConfiguracoesSalto } from './manual';
import TelaVitoriaSalto from './vitoria';
import TelaDerrotaSalto from './derrota';

const SaltoAlfabetico: React.FC = () => {
  const [estadoDoJogo, setEstadoDoJogo] = useState<'manual' | 'jogando' | 'vitoria' | 'derrota'>('manual');
  
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesSalto>({
    dificuldade: 'facil',
    penalidade: true,
    sons: true
  });

  // --- HANDLERS ---

  const iniciarJogo = (config: ConfiguracoesSalto) => {
    setConfiguracoes(config);
    setEstadoDoJogo('jogando');
  };

  const lidarComVitoria = () => {
    setEstadoDoJogo('vitoria');
  };

  const lidarComDerrota = () => {
    console.log("Derrota detectada!");
    setEstadoDoJogo('derrota');
  };

  const reiniciarJogo = () => {
    setEstadoDoJogo('jogando');
  };

  return (
    <>
      {estadoDoJogo === 'manual' && (
        <ManualSaltoAlfabetico aoIniciar={iniciarJogo} />
      )}
      
      {estadoDoJogo === 'jogando' && (
        <JogoSaltoAlfabetico 
          aoVencer={lidarComVitoria} 
          aoPerder={lidarComDerrota} 
          configuracoes={configuracoes}
        />
      )}

      {estadoDoJogo === 'vitoria' && (
        <TelaVitoriaSalto 
          aoReiniciar={reiniciarJogo} 
        />
      )}

      {estadoDoJogo === 'derrota' && (
        <TelaDerrotaSalto 
          aoReiniciar={reiniciarJogo} 
        />
      )}
    </>
  );
};

export default SaltoAlfabetico;