import { useState, useCallback, useMemo } from 'react';
import ManualPiramideSabor from './manual';
import JogoPiramideSabor from './jogo';
import TelaVitoriaPiramideSabor from './vitoria';
import TelaDerrotaPiramideSabor from './derrota';
import type { ConfiguracoesJogo, EstadoJogo } from '../../interface/types';

const CONFIG_INICIAL: ConfiguracoesJogo = {
  dificuldade: 'facil',
  penalidade: true,
  sons: true,
};

function PiramideDoSabor() {
  const [estado, setEstado] = useState<EstadoJogo>('manual');
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesJogo>(CONFIG_INICIAL);

  const iniciarMissao = useCallback((novasConfiguracoes: ConfiguracoesJogo) => {
    setConfiguracoes(novasConfiguracoes);
    setEstado('jogando');
  }, []);

  const finalizarJogo = useCallback((resultado: 'vitoria' | 'derrota') => {
    setEstado(resultado);
  }, []);

  const voltarAoManual = useCallback(() => {
    setEstado('manual'); 
  }, []);

  const Telas = useMemo(() => ({
    manual: (
      <ManualPiramideSabor aoIniciar={iniciarMissao} />
    ),
    jogando: (
      <JogoPiramideSabor 
        configuracoes={configuracoes} 
        aoVencer={() => finalizarJogo('vitoria')} 
        aoPerder={() => finalizarJogo('derrota')} 
      />
    ),
    vitoria: (
      <TelaVitoriaPiramideSabor 
        aoReiniciar={voltarAoManual} 
        configuracoes={configuracoes} 
      />
    ),
    derrota: (
      <TelaDerrotaPiramideSabor 
        aoReiniciar={voltarAoManual} 
        configuracoes={configuracoes} 
      />
    ),
  }), [iniciarMissao, finalizarJogo, voltarAoManual, configuracoes]);

  return (
    <main className="game-container">
      {Telas[estado] || Telas.manual}
    </main>
  );
}

export default PiramideDoSabor;