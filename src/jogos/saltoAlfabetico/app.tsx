import { useCallback, useMemo, useState } from 'react';
import JogoSaltoAlfabetico from './jogo';
import TelaVitoriaSalto from './vitoria';
import TelaDerrotaSalto from './derrota';
import ManualSaltoAlfabetico from './manual';
import Menu from '../../componentes/Menu'; 
import type { ConfiguracoesJogo, EstadoJogo } from '../../interface/types';
import * as S from './styles'; 

const CONFIG_INICIAL: ConfiguracoesJogo = {
  dificuldade: 'facil',
  penalidade: true,
  sons: true,
};

function SaltoAlfabetico() {
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
    manual: <ManualSaltoAlfabetico aoIniciar={iniciarMissao} />,
    jogando: (
      <S.WrapperJogoAtivo>
        <JogoSaltoAlfabetico 
          aoVencer={() => finalizarJogo('vitoria')} 
          aoPerder={() => finalizarJogo('derrota')} 
          configuracoes={configuracoes} 
        />
      </S.WrapperJogoAtivo>
    ),
    vitoria: <TelaVitoriaSalto aoReiniciar={voltarAoManual} configuracoes={configuracoes}  />,
    derrota: <TelaDerrotaSalto aoReiniciar={voltarAoManual} configuracoes={configuracoes}  />,
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

export default SaltoAlfabetico;