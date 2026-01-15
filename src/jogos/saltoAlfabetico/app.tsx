import React, { useState } from 'react';
import JogoSaltoAlfabetico from './jogo';
import TelaVitoriaSalto from './vitoria';
import TelaDerrotaSalto from './derrota';
import ManualSaltoAlfabetico from './manual';
import type { ConfiguracoesJogo } from '../../interface/types';

const SaltoAlfabetico: React.FC = () => {
  const [estadoDoJogo, setEstadoDoJogo] = useState<'manual' | 'jogando' | 'vitoria' | 'derrota'>('manual');
  
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesJogo>({
    dificuldade: 'facil',
    penalidade: true,
    sons: true
  });


  const iniciarJogo = (config: ConfiguracoesJogo) => {
    setConfiguracoes(config);
    setEstadoDoJogo('jogando');
  };

  const lidarComVitoria = () => {
    setEstadoDoJogo('vitoria');
  };

  const lidarComDerrota = () => {
    setEstadoDoJogo('derrota');
  };

  const reiniciarJogo = () => {
    setEstadoDoJogo('manual');
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
          configuracoes={configuracoes}
        />
      )}

      {estadoDoJogo === 'derrota' && (
        <TelaDerrotaSalto 
          aoReiniciar={reiniciarJogo} 
          configuracoes={configuracoes}
        />
      )}
    </>
  );
};

export default SaltoAlfabetico;