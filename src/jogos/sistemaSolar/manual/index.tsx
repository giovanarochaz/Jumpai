import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as S from './styles';
import { Rocket, Zap, Music, ShieldOff, Flame, Orbit, ChevronRight, ChevronLeft } from 'lucide-react';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';
import { useLeitorOcular } from '../../../hooks/useLeitorOcular';
import { pararNarracao } from '../../../servicos/acessibilidade';
import type { BaseManualProps, ConfiguracoesJogo, DificuldadeJogo } from '../../../interface/types';

const DIFICULDADES: DificuldadeJogo[] = ['facil', 'medio', 'dificil'];

const planetasInfo = [
  { 
     nome: 'Mercúrio', 
     imagem: '/assets/sistemaSolar/mercurio.png', 
     descricao: "Eu sou o Mercúrio! Sou o menorzinho e o mais rápido de todos. De dia, sou quente como um fogão aceso, mas de noite sou mais gelado que um sorvete!" 
  },
  { 
     nome: 'Vênus', 
     imagem: '/assets/sistemaSolar/venus.png', 
     descricao: "Oi, eu sou Vênus! Sou o planeta mais quente e brilhante do céu. Minhas nuvens são como um cobertor bem grosso que prende todo o calor lá dentro." 
  },
  { 
     nome: 'Terra', 
     imagem: '/assets/sistemaSolar/terra.png', 
     descricao: "Esta é a Terra, a nossa casa azul! É o único lugar com água fresquinha e ar para respirar. Ela nos protege como se fosse o colo de uma mãe." 
  },
  { 
     nome: 'Marte', 
     imagem: '/assets/sistemaSolar/marte.png', 
     descricao: "Eu sou Marte, o planeta vermelho! Minha cor vem da ferrugem, como um portão velho. Tenho a montanha mais alta de todo o espaço!" 
  },
  { 
     nome: 'Júpiter', 
     imagem: '/assets/sistemaSolar/jupiter.png', 
     descricao: "Eu sou Júpiter, o gigante! Sou tão grande que todos os outros planetas cabem dentro de mim. Tenho uma tempestade que nunca para de girar." 
  },
  { 
     nome: 'Saturno', 
     imagem: '/assets/sistemaSolar/saturno.png', 
     descricao: "Eu sou Saturno! Sou famoso pelos meus anéis lindos feitos de gelo e poeira. Se existisse uma banheira gigante, eu ficaria boiando na água!" 
  },
  { 
     nome: 'Urano', 
     imagem: '/assets/sistemaSolar/urano.png', 
     descricao: "Eu sou Urano! Sou um gigante gelado e azul. Diferente dos meus irmãos, eu giro deitadinho, como se estivesse tirando uma soneca no espaço." 
  },
  { 
     nome: 'Netuno', 
     imagem: '/assets/sistemaSolar/netuno.png', 
     descricao: "Eu sou Netuno, o último da fila! Estou muito longe do Sol e por isso sou muito frio e escuro. Meus ventos são mais fortes que um furacão!" 
  },
];

const ManualSistemaSolar: React.FC<BaseManualProps<ConfiguracoesJogo>> = ({ aoIniciar }) => {
  const { mostrarCameraFlutuante: modoOcular, estaPiscando, leitorAtivo } = useStore(lojaOlho);
  const [tela, setTela] = useState<'introducao' | 'planetas' | 'comoJogar' | 'perigos' | 'configuracoes'>('introducao');
  const [slideAtual, setSlideAtual] = useState(0);
  const [focoTutorial, setFocoTutorial] = useState<'treinar' | 'pular'>('treinar');
  const [focoConfig, setFocoConfig] = useState<'dificuldade' | 'penalidade' | 'sons' | 'iniciar'>('dificuldade');
  
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesJogo>({ dificuldade: 'facil', penalidade: true, sons: true });
  
  const [podeInteragirOcular, setPodeInteragirOcular] = useState(false);
  const timerScanRef = useRef<NodeJS.Timeout | null>(null);
  const timerDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const piscadaProcessadaRef = useRef(false); 

  useEffect(() => {
    if (!modoOcular) {
      setPodeInteragirOcular(true);
      return;
    }

    setPodeInteragirOcular(false);
    if (timerDebounceRef.current) clearTimeout(timerDebounceRef.current);
    
    if (!leitorAtivo) {
      timerDebounceRef.current = setTimeout(() => setPodeInteragirOcular(true), 1500);
    }
  }, [tela, slideAtual, focoConfig, focoTutorial, modoOcular, leitorAtivo]);

  useEffect(() => {
    if (modoOcular && podeInteragirOcular) {
      const tempoScan = tela === 'introducao' ? 4500 : 3000; 

      timerScanRef.current = setInterval(() => {
        if (tela === 'introducao') {
          setFocoTutorial(prev => prev === 'treinar' ? 'pular' : 'treinar');
        } else if (tela === 'configuracoes') {
          if (focoConfig === 'dificuldade') {
            setConfiguracoes(prev => ({
              ...prev,
              dificuldade: DIFICULDADES[(DIFICULDADES.indexOf(prev.dificuldade) + 1) % DIFICULDADES.length]
            }));
          } else if (focoConfig === 'penalidade') {
            setConfiguracoes(prev => ({ ...prev, penalidade: !prev.penalidade }));
          } else if (focoConfig === 'sons') {
            setConfiguracoes(prev => ({ ...prev, sons: !prev.sons }));
          }
        }
      }, tempoScan);
    }
    return () => { if (timerScanRef.current) clearInterval(timerScanRef.current); };
  }, [tela, focoConfig, focoTutorial, podeInteragirOcular, modoOcular]);

  const textoParaLeitura = useMemo(() => {
    if (!leitorAtivo) return null; 

    if (tela === 'introducao') {
      if (!podeInteragirOcular) {
         return focoTutorial === 'treinar' 
           ? "Bem-vindo à Academia de Pilotos! Para aprender a missão, pisque agora. Para pular o tutorial, aguarde."
           : "Pular treinamento. Para ir direto para a configuração da nave, pisque agora!";
      }
      return focoTutorial === 'treinar' ? "Treinar missão. Pisque agora!" : "Pular para o jogo. Pisque agora!";
    }

    if (tela === 'planetas') {
      return `${planetasInfo[slideAtual].nome}. ${planetasInfo[slideAtual].descricao}. Para o próximo planeta, pisque agora!`;
    }

    if (tela === 'comoJogar') {
      return "Como pilotar: Sua nave voa sozinha. Toda vez que você piscar, ela muda de direção. Pisque agora para continuar!";
    }

    if (tela === 'perigos') {
      return "Cuidado com as pedras espaciais! Se bater, a missão falha. Pisque agora para configurar sua nave!";
    }

    if (tela === 'configuracoes') {
      if (!podeInteragirOcular) {
        if (focoConfig === 'dificuldade') return `Nível de dificuldade: ${configuracoes.dificuldade}. Pisque para mudar ou aguarde.`;
        if (focoConfig === 'penalidade') return configuracoes.penalidade ? "Reiniciar ao bater? Sim. Pisque para mudar." : "Reiniciar ao bater? Não. Pisque para mudar.";
        if (focoConfig === 'sons') return configuracoes.sons ? "Sons ligados. Pisque para desligar." : "Sons desligados. Pisque para ligar.";
        if (focoConfig === 'iniciar') return "Tudo pronto! Vamos decolar?";
      }
      return "Pisque para confirmar esta opção!";
    }
    
    return "";
  }, [tela, slideAtual, focoConfig, focoTutorial, configuracoes, leitorAtivo, podeInteragirOcular]);

  useLeitorOcular(textoParaLeitura, [textoParaLeitura], () => {
    if (modoOcular && leitorAtivo) setPodeInteragirOcular(true);
  });

  const confirmarAcao = useCallback(() => {
    if (tela === 'introducao') {
      if (modoOcular) {
        if (focoTutorial === 'treinar') setTela('planetas');
        else setTela('configuracoes');
      } else {
        setTela('planetas'); 
      }
    }     
    else if (tela === 'planetas') {
      if (slideAtual === planetasInfo.length - 1) setTela('comoJogar');
      else setSlideAtual(s => s + 1);
    }
    else if (tela === 'comoJogar') setTela('perigos');
    else if (tela === 'perigos') setTela('configuracoes');
    else if (tela === 'configuracoes') {
      if (modoOcular) {
        if (focoConfig === 'dificuldade') setFocoConfig('penalidade');
        else if (focoConfig === 'penalidade') setFocoConfig('sons');
        else if (focoConfig === 'sons') setFocoConfig('iniciar');
        else aoIniciar(configuracoes);
      } else {
        aoIniciar(configuracoes);
      }
    }
  }, [tela, slideAtual, focoConfig, focoTutorial, configuracoes, modoOcular, aoIniciar]);

  useEffect(() => {
    if (!estaPiscando) {
      piscadaProcessadaRef.current = false;
      return;
    }

    if (estaPiscando && modoOcular && podeInteragirOcular && !piscadaProcessadaRef.current) {
      piscadaProcessadaRef.current = true; 
      setPodeInteragirOcular(false);       
      pararNarracao();
      confirmarAcao();
    }
  }, [estaPiscando, modoOcular, podeInteragirOcular, confirmarAcao]);

  const visualOcular = modoOcular && podeInteragirOcular;

  return (
    <S.FundoModal>
      <S.ConteudoModal>

        {tela === 'introducao' && (
          <S.ContainerExplicacao>
            <S.TextoSlide><h2>Academia de Pilotos</h2></S.TextoSlide>
            <S.SecaoExplicacao>
              <S.WrapperIcone><Rocket /></S.WrapperIcone>
              <S.WrapperTexto>
                <h3>Diário de Bordo</h3>
                <p>Sua missão é pilotar uma nave avançada e coletar os planetas na ordem correta!</p>
              </S.WrapperTexto>
            </S.SecaoExplicacao>
            
            <S.NavegacaoCarrossel>
              <S.BotaoNavegacao 
                onClick={() => { pararNarracao(); setTela('configuracoes'); }}
                $isFocusedManual={modoOcular && focoTutorial === 'pular' && podeInteragirOcular}
                style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                PULAR TUTORIAL
              </S.BotaoNavegacao>

              <S.BotaoNavegacao 
                onClick={confirmarAcao} 
                $isFocusedManual={modoOcular && focoTutorial === 'treinar' && podeInteragirOcular}
              >
                {leitorAtivo && !podeInteragirOcular && modoOcular ? 'OUVINDO...' : 'INICIAR TREINAMENTO'} <ChevronRight />
              </S.BotaoNavegacao>
            </S.NavegacaoCarrossel>
          </S.ContainerExplicacao>
        )}

        {tela === 'planetas' && (
          <>
            <S.ContainerSlide>
              <S.PlanetaAnimado src={planetasInfo[slideAtual].imagem} alt={planetasInfo[slideAtual].nome} />
              <S.TextoSlide>
                <h2>{planetasInfo[slideAtual].nome}</h2>
                <p>{planetasInfo[slideAtual].descricao}</p>
              </S.TextoSlide>
            </S.ContainerSlide>
            <S.NavegacaoCarrossel>
              <S.BotaoNavegacao onClick={() => { pararNarracao(); slideAtual === 0 ? setTela('introducao') : setSlideAtual(s => s - 1); }}>
                <ChevronLeft /> Voltar
              </S.BotaoNavegacao>
              <span>{slideAtual + 1} / {planetasInfo.length}</span>
              <S.BotaoNavegacao onClick={confirmarAcao} $isFocusedManual={visualOcular}>
                {leitorAtivo && !podeInteragirOcular && modoOcular ? 'OUVINDO...' : 'PRÓXIMO'} <ChevronRight />
              </S.BotaoNavegacao>
            </S.NavegacaoCarrossel>
          </>
        )}

        {(tela === 'comoJogar' || tela === 'perigos') && (
           <S.ContainerExplicacao>
              <S.TextoSlide><h2>{tela === 'comoJogar' ? 'Como Pilotar' : 'Atenção, Recruta!'}</h2></S.TextoSlide>
              <S.SecaoExplicacao>
                <S.WrapperIcone>{tela === 'comoJogar' ? <Orbit /> : <Flame />}</S.WrapperIcone>
                <S.WrapperTexto>
                   <p>{tela === 'comoJogar' 
                      ? 'Pisque os olhos para manobrar sua nave no espaço. Capture os alvos indicados!' 
                      : 'Cuidado com as rochas espaciais! Se bater, a missão reinicia.'}
                   </p>
                </S.WrapperTexto>
              </S.SecaoExplicacao>
              <S.NavegacaoCarrossel>
                <S.BotaoNavegacao onClick={() => setTela(tela === 'comoJogar' ? 'planetas' : 'comoJogar')}><ChevronLeft /> Voltar</S.BotaoNavegacao>
                <S.BotaoNavegacao onClick={confirmarAcao} $isFocusedManual={visualOcular}>
                   {tela === 'comoJogar' ? 'ENTENDI!' : 'CONFIGURAR NAVE'}
                </S.BotaoNavegacao>
              </S.NavegacaoCarrossel>
           </S.ContainerExplicacao>
        )}

        {tela === 'configuracoes' && (
          <S.ContainerConfiguracoes>
            <S.TextoSlide><h2>Sistemas da Nave</h2></S.TextoSlide>

            <S.LinhaConfiguracao $isFocused={visualOcular && focoConfig === 'dificuldade'}>
              <S.RotuloConfiguracao><Zap /><h3>Dificuldade</h3></S.RotuloConfiguracao>
              <S.GrupoBotoes>
                {DIFICULDADES.map(v => (
                  <S.BotaoOpcao 
                    key={v} 
                    $ativo={configuracoes.dificuldade === v} 
                    $isFocused={visualOcular && focoConfig === 'dificuldade' && configuracoes.dificuldade === v}
                    onClick={() => setConfiguracoes(prev => ({ ...prev, dificuldade: v }))}
                  >
                    {v}
                  </S.BotaoOpcao>
                ))}
              </S.GrupoBotoes>
            </S.LinhaConfiguracao>

            <S.LinhaConfiguracao 
                $isFocused={visualOcular && focoConfig === 'penalidade'}
                onClick={() => setConfiguracoes(prev => ({ ...prev, penalidade: !prev.penalidade }))}
            >
              <S.RotuloConfiguracao><ShieldOff /><h3>Reiniciar?</h3></S.RotuloConfiguracao>
              <S.ContainerInterruptor>
                <S.InputInterruptor type="checkbox" checked={configuracoes.penalidade} readOnly />
                <S.DeslizadorInterruptor />
              </S.ContainerInterruptor>
            </S.LinhaConfiguracao>

            <S.LinhaConfiguracao 
                $isFocused={visualOcular && focoConfig === 'sons'}
                onClick={() => setConfiguracoes(prev => ({ ...prev, sons: !prev.sons }))}
            >
              <S.RotuloConfiguracao><Music /><h3>Áudio</h3></S.RotuloConfiguracao>
              <S.ContainerInterruptor>
                <S.InputInterruptor type="checkbox" checked={configuracoes.sons} readOnly />
                <S.DeslizadorInterruptor />
              </S.ContainerInterruptor>
            </S.LinhaConfiguracao>

            <S.BotaoIniciarMissao onClick={confirmarAcao} $isFocused={visualOcular && focoConfig === 'iniciar'}>
              {leitorAtivo && !podeInteragirOcular && modoOcular ? 'PREPARANDO...' : 'DECOLAR'}
            </S.BotaoIniciarMissao>
          </S.ContainerConfiguracoes>
        )}
      </S.ConteudoModal>
    </S.FundoModal>
  );
};

export default ManualSistemaSolar;