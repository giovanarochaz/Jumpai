import React, { useState, useEffect, useRef } from 'react';
import * as S from './styles';
import { Gamepad2, AlertTriangle, Trophy, Bomb, Zap, Music, ShieldOff, ChefHat } from 'lucide-react';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';

// --- TEXTO MAIS LÚDICO E EDUCATIVO PARA CRIANÇAS ---
const receitaInfo = [
    {
      nome: 'Pão (a base)',
      imagem: '/assets/piramideSabor/pao_base.png',
      descricao: "Todo grande lanche começa com ele! O pão é do grupo dos **Carboidratos**. Eles são como a supergasolina do nosso corpo, nos dando **energia** para brincar, correr e se divertir o dia todo!"
    },
    {
      nome: 'Hambúrguer',
      imagem: '/assets/piramideSabor/carne.png',
      descricao: "A força do nosso lanche! O hambúrguer é do grupo das **Proteínas**. Elas são os 'tijolinhos' que constroem nossos **músculos** e nos deixam super fortes para qualquer aventura!"
    },
    {
      nome: 'Queijo',
      imagem: '/assets/piramideSabor/queijo.png',
      descricao: "Um sorriso no nosso lanche! O queijo vem dos **Laticínios** e é cheio de **Cálcio**. O cálcio deixa nossos **ossos e dentes duros como uma rocha** e prontos para dar aquele sorrisão!"
    },
    {
      nome: 'Salada',
      imagem: '/assets/piramideSabor/salada.png',
      descricao: "As cores mágicas! A salada é do grupo das **Hortaliças**. Elas têm **Vitaminas e Minerais**, que são como um escudo mágico que **protege nosso corpo** contra os vilões da gripe e do resfriado!"
    },
    {
      nome: 'Pão (o topo)',
      imagem: '/assets/piramideSabor/pao_topo.png',
      descricao: "Fechando com chave de ouro! Mais um pãozinho para garantir que sua **energia** fique no máximo. Com todos os ingredientes juntos, nosso lanche fica forte e equilibrado. Missão quase cumprida, chef!"
    },
];

export type VelocidadeGeracao = 'lenta' | 'normal' | 'rapida';
export interface ConfiguracoesJogo {
   velocidade: VelocidadeGeracao;
   penalidade: boolean;
   sons: boolean;
}
interface ManualPiramideSaborProps {
   aoIniciarMissao: (configuracoes: ConfiguracoesJogo) => void;
}
type FocoConfig = 'velocidade' | 'penalidade' | 'sons' | 'iniciar';
const VELOCIDADES: VelocidadeGeracao[] = ['lenta', 'normal', 'rapida'];

// --- COMPONENTE PRINCIPAL ---
const ManualPiramideSabor: React.FC<ManualPiramideSaborProps> = ({ aoIniciarMissao }) => {
   const [tela, setTela] = useState<'introducao' | 'receita' | 'comoJogar' | 'desafios' | 'configuracoes'>('introducao');
   const [slideAtual, setSlideAtual] = useState(0);

   const [configuracoes, setConfiguracoes] = useState<ConfiguracoesJogo>({
      velocidade: 'normal',
      penalidade: true,
      sons: true,
   });

   const { mostrarCameraFlutuante, estaPiscando } = useStore(lojaOlho);
   const [focoConfig, setFocoConfig] = useState<FocoConfig>('velocidade');
   const [opcaoVelocidadeAtiva, setOpcaoVelocidadeAtiva] = useState<VelocidadeGeracao>('normal');
   const [opcaoPenalidadeAtiva, setOpcaoPenalidadeAtiva] = useState<boolean>(true);
   const [opcaoSonsAtiva, setOpcaoSonsAtiva] = useState<boolean>(true);
   const autoCycleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
   const [bloquearPiscada, setBloquearPiscada] = useState(true);
   const blockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   const conteudoAtual = receitaInfo[slideAtual];

   const proximoSlide = () => { if (slideAtual < receitaInfo.length - 1) setSlideAtual(s => s + 1); };
   const slideAnterior = () => { if (slideAtual > 0) setSlideAtual(s => s - 1); };

   const avancarTela = () => {
      if (tela === 'introducao') setTela('receita');
      else if (tela === 'receita') {
         if (slideAtual === receitaInfo.length - 1) setTela('comoJogar');
         else proximoSlide();
      } else if (tela === 'comoJogar') setTela('desafios');
      else if (tela === 'desafios') setTela('configuracoes');
   };

   const voltarTela = () => {
      if (tela === 'receita') {
         if (slideAtual === 0) setTela('introducao');
         else slideAnterior();
      } else if (tela === 'comoJogar') setTela('receita');
      else if (tela === 'desafios') setTela('comoJogar');
   };

    useEffect(() => {
      blockTimerRef.current = setTimeout(() => setBloquearPiscada(false), 1000);
      return () => {
         if (blockTimerRef.current) clearTimeout(blockTimerRef.current);
         if (autoCycleTimerRef.current) clearInterval(autoCycleTimerRef.current);
      };
   }, []);

   useEffect(() => {
      if (bloquearPiscada || !mostrarCameraFlutuante || !estaPiscando) return;
      if (blockTimerRef.current) clearTimeout(blockTimerRef.current);
      setBloquearPiscada(true);

      if (tela !== 'configuracoes') {
         avancarTela();
         blockTimerRef.current = setTimeout(() => setBloquearPiscada(false), 500);
      } else {
         switch (focoConfig) {
            case 'velocidade':
               setConfiguracoes(c => ({ ...c, velocidade: opcaoVelocidadeAtiva }));
               setFocoConfig('penalidade');
               break;
            case 'penalidade':
               setConfiguracoes(c => ({ ...c, penalidade: opcaoPenalidadeAtiva }));
               setFocoConfig('sons');
               break;
            case 'sons':
               setConfiguracoes(c => ({ ...c, sons: opcaoSonsAtiva }));
               setFocoConfig('iniciar');
               break;
            case 'iniciar':
               aoIniciarMissao(configuracoes);
               break;
         }
         blockTimerRef.current = setTimeout(() => setBloquearPiscada(false), 500);
      }
   }, [estaPiscando, mostrarCameraFlutuante, bloquearPiscada, tela, focoConfig, configuracoes, opcaoVelocidadeAtiva, opcaoPenalidadeAtiva, opcaoSonsAtiva, aoIniciarMissao]);

   useEffect(() => {
      if (tela !== 'configuracoes' || !mostrarCameraFlutuante) {
         if (autoCycleTimerRef.current) clearInterval(autoCycleTimerRef.current);
         return;
      }
      autoCycleTimerRef.current = setInterval(() => {
         switch (focoConfig) {
            case 'velocidade':
               const currentIndex = VELOCIDADES.indexOf(opcaoVelocidadeAtiva);
               const nextIndex = (currentIndex + 1) % VELOCIDADES.length;
               setOpcaoVelocidadeAtiva(VELOCIDADES[nextIndex]);
               break;
            case 'penalidade': setOpcaoPenalidadeAtiva(p => !p); break;
            case 'sons': setOpcaoSonsAtiva(s => !s); break;
            case 'iniciar': break;
         }
      }, 1500) as unknown as number;

      return () => { if (autoCycleTimerRef.current) clearInterval(autoCycleTimerRef.current); };
   }, [tela, focoConfig, opcaoVelocidadeAtiva, mostrarCameraFlutuante]);


   const renderizarTela = () => {
      const isAvancarFocado = mostrarCameraFlutuante && tela !== 'configuracoes' && !bloquearPiscada;

      switch (tela) {
         case 'introducao':
            return (
               <S.ContainerExplicacao>
                  <S.TextoSlide><h2>Olá, Super Chef!</h2></S.TextoSlide>
                  <S.SecaoExplicacao>
                     <S.WrapperIcone><ChefHat size={32} strokeWidth={2.5} /></S.WrapperIcone>
                     <S.WrapperTexto>
                        <h3>Sua missão de hoje!</h3>
                        <p>O Mestre Cuca precisa da sua ajuda para montar o <strong>Hambúrguer Lendário</strong>! Sua tarefa é pegar os ingredientes que caem do céu na ordem certinha. Preparado?</p>
                     </S.WrapperTexto>
                  </S.SecaoExplicacao>
                  <S.SecaoExplicacao>
                     <S.WrapperIcone><ChefHat size={32} strokeWidth={2.5} /></S.WrapperIcone>
                     <S.WrapperTexto>
                        <h3>O Mapa do Sabor</h3>
                        <p>Para ser um chef de verdade, usamos a <strong>Pirâmide Alimentar</strong>! Ela nos ensina que comidas como pães e carnes nos deixam fortes. As guloseimas, como doces, ficam lá no topo e só podemos comer um pouquinho. No jogo, fuja delas!</p>
                     </S.WrapperTexto>
                  </S.SecaoExplicacao>
                  <S.NavegacaoCarrossel>
                        <div style={{width: '180px'}}></div>
                        <S.BotaoNavegacao onClick={avancarTela} $isFocusedManual={isAvancarFocado}>
                           Ver a Receita!
                        </S.BotaoNavegacao>
                  </S.NavegacaoCarrossel>
               </S.ContainerExplicacao>
            );

         case 'receita':
            return (
               <>
                  <S.ContainerSlide>
                     <S.IngredienteAnimado src={conteudoAtual.imagem} alt={conteudoAtual.nome} />
                     <S.TextoSlide>
                        <h2>{conteudoAtual.nome}</h2>
                        <p dangerouslySetInnerHTML={{ __html: conteudoAtual.descricao.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                     </S.TextoSlide>
                  </S.ContainerSlide>
                  <S.NavegacaoCarrossel>
                     <S.BotaoNavegacao onClick={voltarTela} disabled={slideAtual === 0 && tela === 'receita'}>
                        {slideAtual === 0 ? 'Voltar' : 'Anterior'}
                     </S.BotaoNavegacao>
                     <span>Passo {slideAtual + 1} de {receitaInfo.length}</span>
                     <S.BotaoNavegacao onClick={avancarTela} $isFocusedManual={isAvancarFocado}>
                        {slideAtual === receitaInfo.length - 1 ? 'Como eu jogo?' : 'Próximo'}
                     </S.BotaoNavegacao>
                  </S.NavegacaoCarrossel>
               </>
            );

         case 'comoJogar':
            return (
               <S.ContainerExplicacao>
                  <S.TextoSlide><h2>Como Jogar</h2></S.TextoSlide>
                     <S.SecaoExplicacao>
                     <S.WrapperIcone><Gamepad2 size={32} strokeWidth={2.5} /></S.WrapperIcone>
                     <S.WrapperTexto>
                        <h3>Controles do Chef</h3>
                        <p>Use as setinhas <strong>ESQUERDA ←</strong> e <strong>→ DIREITA</strong> do teclado para mover o seu personagem e pegar os ingredientes.</p>
                     </S.WrapperTexto>
                  </S.SecaoExplicacao>
                  <S.SecaoExplicacao>
                     <S.WrapperIcone><Trophy size={32} strokeWidth={2.5} /></S.WrapperIcone>
                     <S.WrapperTexto>
                        <h3>Missão Saborosa</h3>
                        <p>Pegue os ingredientes na ordem certa! A sequência da receita vai aparecer lá em cima na tela pra te ajudar a não esquecer.</p>
                     </S.WrapperTexto>
                  </S.SecaoExplicacao>
                  <S.NavegacaoCarrossel>
                        <S.BotaoNavegacao onClick={voltarTela}>Voltar</S.BotaoNavegacao>
                        <S.BotaoNavegacao onClick={avancarTela} $isFocusedManual={isAvancarFocado}>
                           E os perigos?
                        </S.BotaoNavegacao>
                  </S.NavegacaoCarrossel>
               </S.ContainerExplicacao>
            );

         case 'desafios':
            return (
               <S.ContainerExplicacao>
                  <S.TextoSlide><h2>Cuidado na Cozinha!</h2></S.TextoSlide>
                     <S.SecaoExplicacao>
                     <S.WrapperIcone><Bomb size={32} strokeWidth={2.5} /></S.WrapperIcone>
                     <S.WrapperTexto>
                        <h3>Desvie das Guloseimas!</h3>
                        <p>O Mestre Cuca vai jogar doces e frituras para te testar! Não pegue nada disso, ou sua receita vai por água abaixo e o jogo acaba!</p>
                     </S.WrapperTexto>
                  </S.SecaoExplicacao>
                  <S.SecaoExplicacao>
                     <S.WrapperIcone><AlertTriangle size={32} strokeWidth={2.5} /></S.WrapperIcone>
                     <S.WrapperTexto>
                        <h3>Atenção na Ordem!</h3>
                        <p>Pegar um ingrediente na hora errada é um grande erro! Se isso acontecer, você perde o que já coletou e precisa começar de novo. Fique de olho!</p>
                     </S.WrapperTexto>
                  </S.SecaoExplicacao>
                  <S.NavegacaoCarrossel>
                        <S.BotaoNavegacao onClick={voltarTela}>Voltar</S.BotaoNavegacao>
                        <S.BotaoNavegacao onClick={avancarTela} $isFocusedManual={isAvancarFocado}>
                           Ajustar Jogo
                        </S.BotaoNavegacao>
                  </S.NavegacaoCarrossel>
               </S.ContainerExplicacao>
            );

         case 'configuracoes':
            return (
               <S.ContainerConfiguracoes>
                  <S.TextoSlide><h2>Opções do Jogo</h2></S.TextoSlide>
                  <S.LinhaConfiguracao $isFocused={focoConfig === 'velocidade'}>
                     <S.RotuloConfiguracao><Zap size={32} /><h3>Velocidade da Comida</h3></S.RotuloConfiguracao>
                     <S.GrupoBotoes>
                        <S.BotaoOpcao ativo={configuracoes.velocidade === 'lenta'} $isFocused={mostrarCameraFlutuante && focoConfig === 'velocidade' && opcaoVelocidadeAtiva === 'lenta'} onClick={() => setConfiguracoes(c => ({...c, velocidade: 'lenta'}))}>Devagar</S.BotaoOpcao>
                        <S.BotaoOpcao ativo={configuracoes.velocidade === 'normal'} $isFocused={mostrarCameraFlutuante && focoConfig === 'velocidade' && opcaoVelocidadeAtiva === 'normal'} onClick={() => setConfiguracoes(c => ({...c, velocidade: 'normal'}))}>Normal</S.BotaoOpcao>
                        <S.BotaoOpcao ativo={configuracoes.velocidade === 'rapida'} $isFocused={mostrarCameraFlutuante && focoConfig === 'velocidade' && opcaoVelocidadeAtiva === 'rapida'} onClick={() => setConfiguracoes(c => ({...c, velocidade: 'rapida'}))}>Rápido</S.BotaoOpcao>
                     </S.GrupoBotoes>
                  </S.LinhaConfiguracao>
                  <S.LinhaConfiguracao $isFocused={focoConfig === 'penalidade'}>
                     <S.RotuloConfiguracao><ShieldOff size={32} /><h3>Erro na ordem recomeça?</h3></S.RotuloConfiguracao>
                     <S.ContainerInterruptor>
                        <S.InputInterruptor type="checkbox" checked={mostrarCameraFlutuante && focoConfig === 'penalidade' ? opcaoPenalidadeAtiva : configuracoes.penalidade} onChange={e => setConfiguracoes(c => ({...c, penalidade: e.target.checked}))} />
                        <S.DeslizadorInterruptor />
                     </S.ContainerInterruptor>
                  </S.LinhaConfiguracao>
                  <S.LinhaConfiguracao $isFocused={focoConfig === 'sons'}>
                     <S.RotuloConfiguracao><Music size={32} /><h3>Música e Sons</h3></S.RotuloConfiguracao>
                     <S.ContainerInterruptor>
                        <S.InputInterruptor type="checkbox" checked={mostrarCameraFlutuante && focoConfig === 'sons' ? opcaoSonsAtiva : configuracoes.sons} onChange={e => setConfiguracoes(c => ({...c, sons: e.target.checked}))} />
                        <S.DeslizadorInterruptor />
                     </S.ContainerInterruptor>
                  </S.LinhaConfiguracao>
                  <S.BotaoIniciarMissao $isFocused={focoConfig === 'iniciar'} onClick={() => aoIniciarMissao(configuracoes)}>
                        MÃOS NA MASSA!
                  </S.BotaoIniciarMissao>
               </S.ContainerConfiguracoes>
            );
      }
   };

   return (
      <S.FundoModal>
         <S.ConteudoModal>{renderizarTela()}</S.ConteudoModal>
      </S.FundoModal>
   );
};

export default ManualPiramideSabor;