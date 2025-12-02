import { useState } from 'react';
import ManualPiramideSabor, { type ConfiguracoesJogo } from './manual';
import TelaVitoriaPiramideSabor from './vitoria';
import JogoPiramideSabor from './jogo';
import TelaDerrotaPiramideSabor from './derrota';

function PiramideDoSabor() {
  const [estadoDoJogo, setEstadoDoJogo] = useState<'manual' | 'jogando' | 'vitoria' | 'derrota'>('manual'); // <-- Adicione 'derrota'
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesJogo>({
    velocidade: 'normal',
    penalidade: true,
    sons: true,
  });

  const tratarInicioMissao = (c: ConfiguracoesJogo) => { setConfiguracoes(c); setEstadoDoJogo('jogando'); };
  const tratarVitoria = () => setEstadoDoJogo('vitoria');
  const tratarDerrota = () => setEstadoDoJogo('derrota'); 
  const tratarReiniciar = () => setEstadoDoJogo('manual');

  const renderizarTela = () => {
    switch (estadoDoJogo) {
      case 'manual':
        return <ManualPiramideSabor aoIniciarMissao={tratarInicioMissao} />;
      case 'jogando':
        return <JogoPiramideSabor configuracoes={configuracoes} aoVencer={tratarVitoria} aoPerder={tratarDerrota} />; // <-- Passe a prop aoPerder
      case 'vitoria':
        return <TelaVitoriaPiramideSabor aoReiniciar={tratarReiniciar} />;
      case 'derrota':
        return <TelaDerrotaPiramideSabor aoReiniciar={tratarReiniciar} />;
      default:
        return <ManualPiramideSabor aoIniciarMissao={tratarInicioMissao} />;
    }
  };

  return <>{renderizarTela()}</>;
}

export default PiramideDoSabor;