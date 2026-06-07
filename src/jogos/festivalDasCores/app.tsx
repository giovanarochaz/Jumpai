import { useState, useCallback, useMemo } from 'react';
import TelaDerrotaFestivalCores from "./derrota";
import FestivalDasCoresJogo from "./jogo";
import ManualFestivalDasCores from "./manual";
import TelaVitoriaFestivalCores from "./vitoria";
import Menu from '../../componentes/Menu'; 
import type { ConfiguracoesJogo, EstadoJogo } from '../../interface/types';
import * as S from './styles'; 

const CONFIG_INICIAL: ConfiguracoesJogo = {
  dificuldade: 'facil',
  penalidade: true,
  sons: true,
};

function FestivalDasCores() {
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
    manual: <ManualFestivalDasCores aoIniciar={iniciarMissao} />,
    jogando: (
      <S.WrapperJogoAtivo>
        <FestivalDasCoresJogo 
          aoVencer={() => finalizarJogo('vitoria')} 
          aoPerder={() => finalizarJogo('derrota')} 
          configuracoes={configuracoes} 
        />
      </S.WrapperJogoAtivo>
    ),
    vitoria: <TelaVitoriaFestivalCores aoReiniciar={voltarAoManual} configuracoes={configuracoes}  />,
    derrota: <TelaDerrotaFestivalCores aoReiniciar={voltarAoManual} configuracoes={configuracoes}  />,
  }), [iniciarMissao, finalizarJogo, voltarAoManual, configuracoes]);

  return (
    <S.ContainerDoJogo> 
      <Menu />

      <S.ConteudoEstado>
         {Telas[estado] || Telas.manual}
      </S.ConteudoEstado>
    </S.ContainerDoJogo>
  );
}

export default FestivalDasCores;