import { useState, useCallback, useMemo } from 'react';
import ManualSistemaSolar from './manual';
import JogoSistemaSolar from './jogo';
import TelaVitoria from './vitoria';
import TelaDerrotaSistemaSolar from './derrota';
import type { ConfiguracoesJogo, EstadoJogo } from '../../interface/types';

const CONFIG_INICIAL: ConfiguracoesJogo = {
  velocidade: 'normal',
  penalidade: true,
  sons: true,
};

function SistemaSolar() {
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
    manual: <ManualSistemaSolar aoIniciar={iniciarMissao} />,
    jogando: (
      <JogoSistemaSolar 
        aoVencer={() => finalizarJogo('vitoria')} 
        aoPerder={() => finalizarJogo('derrota')} 
        configuracoes={configuracoes} 
      />
    ),
    vitoria: <TelaVitoria aoReiniciar={voltarAoManual} />,
    derrota: <TelaDerrotaSistemaSolar aoReiniciar={voltarAoManual} />,
  }), [iniciarMissao, finalizarJogo, voltarAoManual, configuracoes]);

  return (
    <main className="game-container">
      {Telas[estado] || Telas.manual}
    </main>
  );
}

export default SistemaSolar;