import React, { useState } from 'react';
import FestivalDasCoresJogo from './jogo'; 
import type { ConfiguracoesCores } from './manual';
import ManualFestivalDasCores from './manual';
import TelaVitoriaCores from './vitoria';
import TelaDerrotaCores from './derrota';

const FestivalDasCores: React.FC = () => {
  const [estadoDoJogo, setEstadoDoJogo] = useState<'manual' | 'jogando' | 'vitoria'>('manual');
  
  // Estado inicial obrigatório
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesCores>({
    dificuldade: 'facil',
    penalidade: true,
    sons: true
  });

  const iniciarJogo = (config: ConfiguracoesCores) => {
    setConfiguracoes(config);
    setEstadoDoJogo('jogando');
  };

  const lidarComVitoria = () => {
    setEstadoDoJogo('vitoria');
  };

  const reiniciar = () => {
    setEstadoDoJogo('jogando');
  }

  return (
    <>
      {estadoDoJogo === 'manual' && (
        // <ManualFestivalDasCores aoIniciar={iniciarJogo} />
        <TelaDerrotaCores aoReiniciar={function (): void {
                  throw new Error('Function not implemented.');
              } } aoSair={function (): void {
                  throw new Error('Function not implemented.');
              } }></TelaDerrotaCores>
      )}

      {estadoDoJogo === 'jogando' && (
        <FestivalDasCoresJogo 
          aoVencer={lidarComVitoria} 
          aoPerder={() => {}} 
          configuracoes={configuracoes} 
        />
      )}

      {estadoDoJogo === 'vitoria' && (
        <TelaVitoriaCores 
            aoReiniciar={reiniciar} 
            aoSair={() => setEstadoDoJogo('manual')} 
        />
      )}
    </>
  );
};

export default FestivalDasCores;