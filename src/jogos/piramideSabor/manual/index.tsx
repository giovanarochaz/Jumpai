import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as S from './styles';
import { Gamepad2, Bomb, Zap, Music, ShieldOff, ChefHat, ChevronRight, ChevronLeft } from 'lucide-react';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';
import { useLeitorOcular } from '../../../hooks/useLeitorOcular';
import { pararNarracao } from '../../../servicos/acessibilidade';
import type { BaseManualProps, ConfiguracoesJogo, VelocidadeGeracao } from '../../../interface/types';

const VELOCIDADES: VelocidadeGeracao[] = ['lenta', 'normal', 'rapida'];

const receitaInfo = [
    {
      nome: 'Pão (Base)',
      grupo: 'Carboidratos',
      imagem: '/assets/piramideSabor/pao_base.png',
      descricao: "Eu sou o grupo dos Carboidratos! Sou como a super-gasolina do seu corpo, dando toda a energia que você precisa para correr, pular e brincar o dia inteirinho!"
    },
    {
      nome: 'Hambúrguer',
      grupo: 'Proteínas',
      imagem: '/assets/piramideSabor/carne.png',
      descricao: "Eu represento as Proteínas! Somos como 'tijolinhos' mágicos que constroem seus músculos e te deixam forte como um verdadeiro super-herói!"
    },
    {
      nome: 'Queijo',
      grupo: 'Laticínios',
      imagem: '/assets/piramideSabor/queijo.png',
      descricao: "Eu sou dos Laticínios! Sou recheado de Cálcio, o mineral que deixa seus ossos e dentes duros como rocha e prontos para um sorrisão!"
    },
    {
      nome: 'Salada',
      grupo: 'Legumes e Verduras',
      imagem: '/assets/piramideSabor/salada.png',
      descricao: "Somos as Hortaliças e Legumes! Nossas vitaminas e minerais criam um escudo invisível que protege seu corpo contra os vilões da gripe e do resfriado!"
    },
    {
      nome: 'Pão (Topo)',
      grupo: 'Carboidratos',
      imagem: '/assets/piramideSabor/pao_topo.png',
      descricao: "Mais energia para fechar o lanche! Viu só? Quando juntamos um pouco de cada grupo, criamos uma refeição equilibrada, saudável e deliciosa!"
    },
];

const ManualPiramideSabor: React.FC<BaseManualProps<ConfiguracoesJogo>> = ({ aoIniciar }) => {
  const { mostrarCameraFlutuante: modoOcular, estaPiscando, leitorAtivo } = useStore(lojaOlho);

  const [tela, setTela] = useState<'introducao' | 'receita' | 'comoJogar' | 'desafios' | 'configuracoes'>('introducao');
  const [slideAtual, setSlideAtual] = useState(0);
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesJogo>({ velocidade: 'normal', penalidade: true, sons: true });
  const [focoConfig, setFocoConfig] = useState<'velocidade' | 'penalidade' | 'sons' | 'iniciar'>('velocidade');
  const [podeInteragirOcular, setPodeInteragirOcular] = useState(false);
  
  const timerScanRef = useRef<NodeJS.Timeout | null>(null);
  const timerDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const piscadaProcessadaRef = useRef(false); 

  useEffect(() => {
    if (!modoOcular) { setPodeInteragirOcular(true); return; }
    setPodeInteragirOcular(false);
    if (timerDebounceRef.current) clearTimeout(timerDebounceRef.current);
    if (!leitorAtivo) {
      timerDebounceRef.current = setTimeout(() => setPodeInteragirOcular(true), 1200);
    }
  }, [tela, slideAtual, focoConfig, modoOcular, leitorAtivo]);

  useEffect(() => {
    if (modoOcular && podeInteragirOcular && tela === 'configuracoes') {
      timerScanRef.current = setInterval(() => {
        if (focoConfig === 'velocidade') {
          setConfiguracoes(prev => ({
            ...prev,
            velocidade: VELOCIDADES[(VELOCIDADES.indexOf(prev.velocidade) + 1) % VELOCIDADES.length]
          }));
        } else if (focoConfig === 'penalidade') {
          setConfiguracoes(prev => ({ ...prev, penalidade: !prev.penalidade }));
        } else if (focoConfig === 'sons') {
          setConfiguracoes(prev => ({ ...prev, sons: !prev.sons }));
        }
      }, 2500);
    }
    return () => { if (timerScanRef.current) clearInterval(timerScanRef.current); };
  }, [tela, focoConfig, podeInteragirOcular, modoOcular]);

  const textoParaLeitura = useMemo(() => {
    if (!leitorAtivo) return null; 

    if (tela === 'introducao') {
      return "Olá, Super Chef! Sua missão é montar o Hambúrguer Lendário usando a Pirâmide Alimentar. Pisque agora para conhecer os ingredientes!";
    }
    if (tela === 'receita') {
      return `${receitaInfo[slideAtual].nome}, do grupo dos ${receitaInfo[slideAtual].grupo}. ${receitaInfo[slideAtual].descricao}. Pisque para ver o próximo!`;
    }
    if (tela === 'comoJogar') {
      return "Preste atenção! Os ingredientes vão cair do céu. Você deve usar as setas para mover o Chef e pegar apenas o ingrediente que a receita pedir no topo da tela. A ordem é muito importante! Pisque para ver o que evitar.";
    }
    if (tela === 'desafios') {
      return "Cuidado! Não pegue doces, frituras ou ingredientes fora da ordem. Se errar, o lanche pode desmoronar! Pisque para preparar sua cozinha.";
    }
    if (tela === 'configuracoes') {
      if (!podeInteragirOcular) {
        if (focoConfig === 'velocidade') return "Qual a velocidade da comida caindo?";
        if (focoConfig === 'penalidade') return "Se errar a ordem, quer recomeçar do zero?";
        if (focoConfig === 'sons') return "Quer ouvir a música da lanchonete?";
        if (focoConfig === 'iniciar') return "Tudo pronto! Vamos começar?";
      } else {
        if (focoConfig === 'velocidade') return `${configuracoes.velocidade}`;
        if (focoConfig === 'penalidade') return configuracoes.penalidade ? "Recomeçar ao errar!" : "Continuar ao errar!";
        if (focoConfig === 'sons') return configuracoes.sons ? "Sons ligados!" : "Sons desligados!";
        if (focoConfig === 'iniciar') return "Pisque agora para colocar as mãos na massa!";
      }
    }
    return "";
  }, [tela, slideAtual, focoConfig, configuracoes, leitorAtivo, podeInteragirOcular]);

  useLeitorOcular(textoParaLeitura, [textoParaLeitura], () => {
    if (modoOcular && leitorAtivo) setPodeInteragirOcular(true);
  });

  const confirmarAcao = useCallback(() => {
    if (tela === 'introducao') setTela('receita');
    else if (tela === 'receita') {
      if (slideAtual === receitaInfo.length - 1) setTela('comoJogar');
      else setSlideAtual(s => s + 1);
    } 
    else if (tela === 'comoJogar') setTela('desafios');
    else if (tela === 'desafios') setTela('configuracoes');
    else if (tela === 'configuracoes') {
      if (modoOcular) {
        if (focoConfig === 'velocidade') setFocoConfig('penalidade');
        else if (focoConfig === 'penalidade') setFocoConfig('sons');
        else if (focoConfig === 'sons') setFocoConfig('iniciar');
        else aoIniciar(configuracoes);
      } else {
        aoIniciar(configuracoes);
      }
    }
  }, [tela, slideAtual, focoConfig, configuracoes, modoOcular, aoIniciar]);

  useEffect(() => {
    if (!estaPiscando) { piscadaProcessadaRef.current = false; return; }
    if (estaPiscando && modoOcular && podeInteragirOcular && !piscadaProcessadaRef.current) {
      piscadaProcessadaRef.current = true; 
      setPodeInteragirOcular(false);       
      pararNarracao();
      confirmarAcao();
    }
  }, [estaPiscando, modoOcular, podeInteragirOcular, confirmarAcao]);

  const feedbackVisual = modoOcular && podeInteragirOcular;

  return (
    <S.FundoModal>
      <S.ConteudoModal>
        {tela === 'introducao' && (
          <S.ContainerExplicacao>
            <S.TextoSlide><h2>Academia de Chefs</h2></S.TextoSlide>
            <S.SecaoExplicacao>
              <S.WrapperIcone><ChefHat /></S.WrapperIcone>
              <S.WrapperTexto>
                <h3>Missão Pirâmide do Sabor</h3>
                <p>O Mestre Cuca te desafiou! Você deve montar um hambúrguer super nutritivo seguindo a ordem correta da receita. Vamos aprender sobre os alimentos?</p>
              </S.WrapperTexto>
            </S.SecaoExplicacao>
            <S.NavegacaoCarrossel>
              <div />
              <S.BotaoNavegacao onClick={confirmarAcao} $isFocusedManual={feedbackVisual}>
                {leitorAtivo && !podeInteragirOcular && modoOcular ? 'OUVINDO...' : 'CONHECER INGREDIENTES'} <ChevronRight />
              </S.BotaoNavegacao>
            </S.NavegacaoCarrossel>
          </S.ContainerExplicacao>
        )}

        {tela === 'receita' && (
          <>
            <S.ContainerSlide>
              <S.IngredienteAnimado src={receitaInfo[slideAtual].imagem} alt={receitaInfo[slideAtual].nome} />
              <S.TextoSlide>
                <span style={{color: '#ef4444', fontWeight: 'bold', textTransform: 'uppercase'}}>{receitaInfo[slideAtual].grupo}</span>
                <h2>{receitaInfo[slideAtual].nome}</h2>
                <p>{receitaInfo[slideAtual].descricao}</p>
              </S.TextoSlide>
            </S.ContainerSlide>
            <S.NavegacaoCarrossel>
              <S.BotaoNavegacao onClick={() => { pararNarracao(); slideAtual === 0 ? setTela('introducao') : setSlideAtual(s => s - 1); }}>
                <ChevronLeft /> Voltar
              </S.BotaoNavegacao>
              <span>{slideAtual + 1} / {receitaInfo.length}</span>
              <S.BotaoNavegacao onClick={confirmarAcao} $isFocusedManual={feedbackVisual}>
                {leitorAtivo && !podeInteragirOcular && modoOcular ? 'OUVINDO...' : 'PRÓXIMO'} <ChevronRight />
              </S.BotaoNavegacao>
            </S.NavegacaoCarrossel>
          </>
        )}

        {(tela === 'comoJogar' || tela === 'desafios') && (
           <S.ContainerExplicacao>
              <S.TextoSlide><h2>{tela === 'comoJogar' ? 'Como Pilotar o Fogão' : 'Atenção na Cozinha!'}</h2></S.TextoSlide>
              <S.SecaoExplicacao>
                <S.WrapperIcone>{tela === 'comoJogar' ? <Gamepad2 /> : <Bomb />}</S.WrapperIcone>
                <S.WrapperTexto>
                   <p>{tela === 'comoJogar' 
                      ? 'Use as setas para mover o Chef. Fique de olho no TOPO DA TELA: pegue apenas o ingrediente que a receita pedir no momento. Se pegar fora de ordem, o lanche desmorona!' 
                      : 'Fuja de doces, frituras e gorduras! Elas não fazem parte da nossa receita saudável e tiram seus pontos de Chef.'}
                   </p>
                </S.WrapperTexto>
              </S.SecaoExplicacao>
              <S.NavegacaoCarrossel>
                <S.BotaoNavegacao onClick={() => setTela(tela === 'comoJogar' ? 'receita' : 'comoJogar')}><ChevronLeft /> Voltar</S.BotaoNavegacao>
                <S.BotaoNavegacao onClick={confirmarAcao} $isFocusedManual={feedbackVisual}>
                   {tela === 'comoJogar' ? 'ENTENDI A ORDEM!' : 'PREPARAR COZINHA'}
                </S.BotaoNavegacao>
              </S.NavegacaoCarrossel>
           </S.ContainerExplicacao>
        )}

        {tela === 'configuracoes' && (
          <S.ContainerConfiguracoes>
            <S.TextoSlide><h2>Ajustes do Chef</h2></S.TextoSlide>
            
            <S.LinhaConfiguracao $isFocused={feedbackVisual && focoConfig === 'velocidade'}>
              <S.RotuloConfiguracao><Zap /><h3>Velocidade da Comida</h3></S.RotuloConfiguracao>
              <S.GrupoBotoes>
                {VELOCIDADES.map(v => (
                  <S.BotaoOpcao 
                    key={v} 
                    ativo={configuracoes.velocidade === v} 
                    $isFocused={feedbackVisual && focoConfig === 'velocidade' && configuracoes.velocidade === v}
                    onClick={() => setConfiguracoes(prev => ({ ...prev, velocidade: v }))}
                  >
                    {v}
                  </S.BotaoOpcao>
                ))}
              </S.GrupoBotoes>
            </S.LinhaConfiguracao>

            <S.LinhaConfiguracao $isFocused={feedbackVisual && focoConfig === 'penalidade'} onClick={() => setConfiguracoes(prev => ({ ...prev, penalidade: !prev.penalidade }))}>
              <S.RotuloConfiguracao><ShieldOff /><h3>Reiniciar se errar a ordem?</h3></S.RotuloConfiguracao>
              <S.ContainerInterruptor>
                <S.InputInterruptor type="checkbox" checked={configuracoes.penalidade} readOnly />
                <S.DeslizadorInterruptor />
              </S.ContainerInterruptor>
            </S.LinhaConfiguracao>

            <S.LinhaConfiguracao $isFocused={feedbackVisual && focoConfig === 'sons'} onClick={() => setConfiguracoes(prev => ({ ...prev, sons: !prev.sons }))}>
              <S.RotuloConfiguracao><Music /><h3>Música e Efeitos</h3></S.RotuloConfiguracao>
              <S.ContainerInterruptor>
                <S.InputInterruptor type="checkbox" checked={configuracoes.sons} readOnly />
                <S.DeslizadorInterruptor />
              </S.ContainerInterruptor>
            </S.LinhaConfiguracao>

            <S.BotaoIniciarMissao onClick={confirmarAcao} $isFocused={feedbackVisual && focoConfig === 'iniciar'}>
              {leitorAtivo && !podeInteragirOcular && modoOcular ? 'AQUECENDO FORNO...' : 'MÃOS NA MASSA!'}
            </S.BotaoIniciarMissao>
          </S.ContainerConfiguracoes>
        )}
      </S.ConteudoModal>
    </S.FundoModal>
  );
};

export default ManualPiramideSabor;