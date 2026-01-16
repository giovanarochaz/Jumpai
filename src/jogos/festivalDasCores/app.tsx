import { useState } from "react";
import type { ConfiguracoesJogo } from "../../interface/types";
import TelaDerrotaFestivalCores from "./derrota";
import FestivalDasCoresJogo from "./jogo";
import ManualFestivalDasCores from "./manual";
import TelaVitoriaFestivalCores from "./vitoria";

const FestivalDasCores: React.FC = () => {
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

  return (
    <>
      {estadoDoJogo === 'manual' && (
        <ManualFestivalDasCores aoIniciar={iniciarJogo} />
      )}
      
      {estadoDoJogo === 'jogando' && (
        <FestivalDasCoresJogo 
          aoVencer={() => setEstadoDoJogo('vitoria')} 
          aoPerder={() => setEstadoDoJogo('derrota')}
          configuracoes={configuracoes}
        />
      )}

      {estadoDoJogo === 'vitoria' && (
        <TelaVitoriaFestivalCores 
          aoReiniciar={() => setEstadoDoJogo('manual')}
          configuracoes={configuracoes}
        />
      )}

      {estadoDoJogo === 'derrota' && (
        <TelaDerrotaFestivalCores 
          aoReiniciar={() => setEstadoDoJogo('manual')} 
          configuracoes={configuracoes}
        />
      )}
    </>
  );
};

export default FestivalDasCores;