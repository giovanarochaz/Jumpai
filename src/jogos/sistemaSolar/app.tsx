import { useState } from 'react';
import type { ConfiguracoesJogo } from './manual';
import ManualSistemaSolar from './manual';
import JogoSistemaSolar from './jogo';
import TelaVitoria from './vitoria';
import TelaDerrotaSistemaSolar from './derrota';

function SistemaSolar() {
  const [estadoDoJogo, setEstadoDoJogo] = useState<'manual' | 'jogando' | 'derrota' | 'vitoria'>('manual');
  
  const [configuracoesDoJogo, setConfiguracoesDoJogo] = useState<ConfiguracoesJogo>({
    velocidade: 'normal',
    penalidade: true,
    sons: true,
  });

  const tratarInicioMissao = (configuracoes: ConfiguracoesJogo) => {
    setConfiguracoesDoJogo(configuracoes);
    setEstadoDoJogo('jogando');      
  };

  const tratarVitoria = () => {
    setEstadoDoJogo('vitoria');
  };

  const tratatDerrota = () => {
    setEstadoDoJogo('derrota');
  };

  
  const tratarReiniciar = () => {
    setEstadoDoJogo('manual');
  };

  const renderizarTela = () => {
    switch (estadoDoJogo) {
      case 'manual':
        return <ManualSistemaSolar aoIniciarMissao={tratarInicioMissao} />; 
      case 'jogando':
        return <JogoSistemaSolar aoVencer={tratarVitoria} aoPerder={tratatDerrota} configuracoes={configuracoesDoJogo} />;  
      case 'vitoria':
        return <TelaVitoria aoReiniciar={tratarReiniciar} />;   
      case 'derrota':
        return <TelaDerrotaSistemaSolar aoReiniciar={tratarReiniciar} />;     
      default:
        return <ManualSistemaSolar aoIniciarMissao={tratarInicioMissao} />;
    }
  };

  return (
    <>
      {renderizarTela()}
    </>
  );
}

export default SistemaSolar;