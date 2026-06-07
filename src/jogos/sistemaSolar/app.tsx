import { useState, useCallback, useMemo } from 'react';
import ManualSistemaSolar from './manual';
import JogoSistemaSolar from './jogo';
import TelaVitoria from './vitoria';
import TelaDerrotaSistemaSolar from './derrota';
import type { ConfiguracoesJogo, EstadoJogo } from '../../interface/types';
import Menu from '../../componentes/Menu'; 
import * as S from './styles'; 

const CONFIG_INICIAL: ConfiguracoesJogo = {
  dificuldade: 'facil',
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
      <S.WrapperJogoAtivo>
        <JogoSistemaSolar 
          aoVencer={() => finalizarJogo('vitoria')} 
          aoPerder={() => finalizarJogo('derrota')} 
          configuracoes={configuracoes} 
        />
      </S.WrapperJogoAtivo>
    ),
    vitoria: <TelaVitoria aoReiniciar={voltarAoManual} configuracoes={configuracoes}  />,
    derrota: <TelaDerrotaSistemaSolar aoReiniciar={voltarAoManual} configuracoes={configuracoes}  />,
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

export default SistemaSolar;