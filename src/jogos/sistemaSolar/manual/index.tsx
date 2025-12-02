import React, { useState, useEffect, useRef } from 'react';
import * as S from './styles';
import { Rocket, Trophy, Zap, Music, ShieldOff, Flame, Orbit, Settings } from 'lucide-react'; // Ícones espaciais
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';

const planetasInfo = [
      { nome: 'Mercúrio', imagem: '/assets/sistemaSolar/mercurio.png', descricao: "Sou o menor planeta e o mais próximo do Sol! Um dia aqui é super quente, mas a noite é congelante. Sou um planeta rochoso, cheio de crateras." },
      { nome: 'Vênus', imagem: '/assets/sistemaSolar/venus.png', descricao: "Me chamam de 'gêmeo' da Terra, mas sou o planeta mais quente de todos! Minha atmosfera densa cria um efeito estufa extremo." },
      { nome: 'Terra', imagem: '/assets/sistemaSolar/terra.png', descricao: "Nosso lar! Sou o único planeta conhecido com oceanos, placas tectônicas e vida! Minha atmosfera nos protege do Sol." },
      { nome: 'Marte', imagem: '/assets/sistemaSolar/marte.png', descricao: "Sou conhecido como o Planeta Vermelho por causa do ferro enferrujado no meu solo. Tenho a maior montanha do Sistema Solar, o Monte Olimpus." },
      { nome: 'Júpiter', imagem: '/assets/sistemaSolar/jupiter.png', descricao: "Eu sou o gigante do Sistema Solar! Sou um planeta gasoso tão grande que todos os outros planetas caberiam dentro de mim." },
      { nome: 'Saturno', imagem: '/assets/sistemaSolar/saturno.png', descricao: "Sou famoso pelos meus incríveis anéis de gelo e rocha. Sou tão leve que poderia flutuar em uma piscina gigante!" },
      { nome: 'Urano', imagem: '/assets/sistemaSolar/urano.png', descricao: "Sou um gigante de gelo e tenho uma característica engraçada: eu giro deitado! É como se eu rolasse pelo espaço." },
      { nome: 'Netuno', imagem: '/assets/sistemaSolar/netuno.png', descricao: "Eu sou o planeta mais distante do Sol, um mundo azul escuro, frio e com os ventos mais rápidos do Sistema Solar!" },
];

export type VelocidadeGeracao = 'lenta' | 'normal' | 'rapida';
export interface ConfiguracoesJogo {
   velocidade: VelocidadeGeracao;
   penalidade: boolean;
   sons: boolean;
}

interface ManualSistemaSolarProps {
   aoIniciarMissao: (configuracoes: ConfiguracoesJogo) => void;
}

type FocoConfig = 'velocidade' | 'penalidade' | 'sons' | 'iniciar';
const VELOCIDADES: VelocidadeGeracao[] = ['lenta', 'normal', 'rapida'];

const ManualSistemaSolar: React.FC<ManualSistemaSolarProps> = ({ aoIniciarMissao }) => {
   // Nova tela inicial 'introducao'
   const [tela, setTela] = useState<'introducao' | 'planetas' | 'comoJogar' | 'perigos' | 'configuracoes'>('introducao');
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

   const conteudoAtual = planetasInfo[slideAtual];

   const proximoSlide = () => { if (slideAtual < planetasInfo.length - 1) setSlideAtual(s => s + 1); };
   const slideAnterior = () => { if (slideAtual > 0) setSlideAtual(s => s - 1); };

   const avancarTela = () => {
      if (tela === 'introducao') {
         setTela('planetas');
      } else if (tela === 'planetas') {
         if (slideAtual === planetasInfo.length - 1) setTela('comoJogar');
         else proximoSlide();
      } else if (tela === 'comoJogar') {
         setTela('perigos');
      } else if (tela === 'perigos') {
         setTela('configuracoes');
      }
   };

   const voltarTela = () => {
      if (tela === 'planetas') {
         if (slideAtual === 0) setTela('introducao');
         else slideAnterior();
      } else if (tela === 'comoJogar') setTela('planetas');
      else if (tela === 'perigos') setTela('comoJogar');
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
         // --- NOVA TELA DE INTRODUÇÃO ---
         case 'introducao':
             return (
               <S.ContainerExplicacao>
                  <S.TextoSlide><h2>Bem-vindo, Astronauta!</h2></S.TextoSlide>
                  <S.SecaoExplicacao>
                     <S.WrapperIcone><Rocket size={40} strokeWidth={2} /></S.WrapperIcone>
                     <S.WrapperTexto>
                        <h3>Sua Missão Espacial</h3>
                        <p>Prepare-se para uma aventura educativa! Assuma o controle de um corajoso astronauta, desvie de meteoros perigosos e colete os planetas do Sistema Solar na ordem correta.</p>
                     </S.WrapperTexto>
                  </S.SecaoExplicacao>
                  <S.SecaoExplicacao>
                     <S.WrapperIcone><Trophy size={40} strokeWidth={2} /></S.WrapperIcone>
                     <S.WrapperTexto>
                        <h3>Desafio da Galáxia</h3>
                        <p>Um erro pode custar sua missão! Com controles simples e desafio crescente, aprenda astronomia se divertindo. Você consegue completar a coleção?</p>
                     </S.WrapperTexto>
                  </S.SecaoExplicacao>
                  <S.NavegacaoCarrossel>
                     <div style={{width: 180}}></div> {/* Espaçador */}
                     <S.BotaoNavegacao onClick={avancarTela} $isFocusedManual={isAvancarFocado}>
                        Conhecer Planetas
                     </S.BotaoNavegacao>
                  </S.NavegacaoCarrossel>
               </S.ContainerExplicacao>
             );

         case 'planetas':
            return (
               <>
                  <S.ContainerSlide>
                     <S.PlanetaAnimado src={conteudoAtual.imagem} alt={conteudoAtual.nome} />
                     <S.TextoSlide>
                        <h2>{conteudoAtual.nome}</h2>
                        <p>{conteudoAtual.descricao}</p>
                     </S.TextoSlide>
                  </S.ContainerSlide>
                  <S.NavegacaoCarrossel>
                     <S.BotaoNavegacao onClick={voltarTela}>Voltar</S.BotaoNavegacao>
                     <span>ALVO {slideAtual + 1} / {planetasInfo.length}</span>
                     <S.BotaoNavegacao onClick={avancarTela} $isFocusedManual={isAvancarFocado}>
                        {slideAtual === planetasInfo.length - 1 ? 'Instruções' : 'Próximo Alvo'}
                     </S.BotaoNavegacao>
                  </S.NavegacaoCarrossel>
               </>
            );
         
         case 'comoJogar':
            return (
               <S.ContainerExplicacao>
                  <S.TextoSlide><h2>Controles de Voo</h2></S.TextoSlide>
                     <S.SecaoExplicacao>
                     <S.WrapperIcone><Rocket size={32} strokeWidth={2.5} style={{transform: 'rotate(-45deg)'}} /></S.WrapperIcone>
                     <S.WrapperTexto>
                        <h3>Pilotagem</h3>
                        <p>Use as teclas <strong>SETA PARA CIMA</strong> e <strong>SETA PARA BAIXO</strong> (ou pisque os olhos) para manobrar sua nave no espaço.</p>
                     </S.WrapperTexto>
                  </S.SecaoExplicacao>
                  <S.SecaoExplicacao>
                     <S.WrapperIcone><Orbit size={32} strokeWidth={2.5} /></S.WrapperIcone>
                     <S.WrapperTexto>
                        <h3>Ordem Cósmica</h3>
                        <p>Colete os planetas na ordem exata (Mercúrio, Vênus, Terra...). Acompanhe a barra no topo da tela!</p>
                     </S.WrapperTexto>
                  </S.SecaoExplicacao>
                  <S.NavegacaoCarrossel>
                        <S.BotaoNavegacao onClick={voltarTela}>Voltar</S.BotaoNavegacao>
                        <S.BotaoNavegacao onClick={avancarTela} $isFocusedManual={isAvancarFocado}>
                           Ver Perigos
                        </S.BotaoNavegacao>
                  </S.NavegacaoCarrossel>
               </S.ContainerExplicacao>
            );
            
         case 'perigos':
            return (
               <S.ContainerExplicacao>
                  <S.TextoSlide><h2>Alertas de Navegação</h2></S.TextoSlide>
                     <S.SecaoExplicacao>
                     <S.WrapperIcone><Flame size={32} strokeWidth={2.5} /></S.WrapperIcone>
                     <S.WrapperTexto>
                        <h3>Chuva de Meteoros</h3>
                        <p>Rochas espaciais estão por toda parte! Colidir com um meteoro destruirá sua nave e reiniciará a missão.</p>
                     </S.WrapperTexto>
                  </S.SecaoExplicacao>
                  <S.SecaoExplicacao>
                     <S.WrapperIcone><ShieldOff size={32} strokeWidth={2.5} /></S.WrapperIcone>
                     <S.WrapperTexto>
                        <h3>Falha na Sequência</h3>
                        <p>Pegar o planeta errado causa uma falha no sistema de navegação. Mantenha o foco na ordem correta!</p>
                     </S.WrapperTexto>
                  </S.SecaoExplicacao>
                  <S.NavegacaoCarrossel>
                        <S.BotaoNavegacao onClick={voltarTela}>Voltar</S.BotaoNavegacao>
                        <S.BotaoNavegacao onClick={avancarTela} $isFocusedManual={isAvancarFocado}>
                           Configurar Nave
                        </S.BotaoNavegacao>
                  </S.NavegacaoCarrossel>
               </S.ContainerExplicacao>
            );
         
         case 'configuracoes':
            return (
               <S.ContainerConfiguracoes>
                  <S.TextoSlide><h2>Sistemas da Nave</h2></S.TextoSlide>

                  <S.LinhaConfiguracao $isFocused={focoConfig === 'velocidade'}>
                     <S.RotuloConfiguracao><Zap size={28} /><h3>Propulsão (Velocidade)</h3></S.RotuloConfiguracao>
                     <S.GrupoBotoes>
                        <S.BotaoOpcao 
                           ativo={configuracoes.velocidade === 'lenta'} 
                           $isFocused={mostrarCameraFlutuante && focoConfig === 'velocidade' && opcaoVelocidadeAtiva === 'lenta'}
                           onClick={() => setConfiguracoes(c => ({...c, velocidade: 'lenta'}))}>Lenta</S.BotaoOpcao>
                        <S.BotaoOpcao 
                           ativo={configuracoes.velocidade === 'normal'} 
                           $isFocused={mostrarCameraFlutuante && focoConfig === 'velocidade' && opcaoVelocidadeAtiva === 'normal'}
                           onClick={() => setConfiguracoes(c => ({...c, velocidade: 'normal'}))}>Normal</S.BotaoOpcao>
                        <S.BotaoOpcao 
                           ativo={configuracoes.velocidade === 'rapida'}
                           $isFocused={mostrarCameraFlutuante && focoConfig === 'velocidade' && opcaoVelocidadeAtiva === 'rapida'}
                           onClick={() => setConfiguracoes(c => ({...c, velocidade: 'rapida'}))}>Turbo</S.BotaoOpcao>
                     </S.GrupoBotoes>
                  </S.LinhaConfiguracao>

                  <S.LinhaConfiguracao $isFocused={focoConfig === 'penalidade'}>
                     <S.RotuloConfiguracao><ShieldOff size={28} /><h3>Reiniciar ao Colidir?</h3></S.RotuloConfiguracao>
                     <S.ContainerInterruptor>
                        <S.InputInterruptor type="checkbox" 
                           checked={mostrarCameraFlutuante && focoConfig === 'penalidade' ? opcaoPenalidadeAtiva : configuracoes.penalidade} 
                           onChange={e => setConfiguracoes(c => ({...c, penalidade: e.target.checked}))} />
                        <S.DeslizadorInterruptor />
                     </S.ContainerInterruptor>
                  </S.LinhaConfiguracao>

                  <S.LinhaConfiguracao $isFocused={focoConfig === 'sons'}>
                     <S.RotuloConfiguracao><Music size={28} /><h3>Áudio do Sistema</h3></S.RotuloConfiguracao>
                     <S.ContainerInterruptor>
                        <S.InputInterruptor type="checkbox" 
                           checked={mostrarCameraFlutuante && focoConfig === 'sons' ? opcaoSonsAtiva : configuracoes.sons}
                           onChange={e => setConfiguracoes(c => ({...c, sons: e.target.checked}))} />
                        <S.DeslizadorInterruptor />
                     </S.ContainerInterruptor>
                  </S.LinhaConfiguracao>
                  
                  <S.BotaoIniciarMissao 
                     $isFocused={focoConfig === 'iniciar'}
                     onClick={() => aoIniciarMissao(configuracoes)}>
                        DECOLAR! 🚀
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

export default ManualSistemaSolar;