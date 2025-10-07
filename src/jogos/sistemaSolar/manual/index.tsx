import React, { useState, useEffect, useRef } from 'react';
import * as S from './styles';
import { Gamepad2, AlertTriangle, Trophy, Badge, Zap, Music, ShieldOff } from 'lucide-react';
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
   const [tela, setTela] = useState<'planetas' | 'comoJogar' | 'perigos' | 'configuracoes'>('planetas');
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
   
   // Sistema de bloqueio único e centralizado
   const [bloquearPiscada, setBloquearPiscada] = useState(true); // Começa bloqueado
   const blockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   const conteudoAtual = planetasInfo[slideAtual];

   const proximoSlide = () => { if (slideAtual < planetasInfo.length - 1) setSlideAtual(s => s + 1); };
   const slideAnterior = () => { if (slideAtual > 0) setSlideAtual(s => s - 1); };

   const avancarTela = () => {
      if (tela === 'planetas') {
         if (slideAtual === planetasInfo.length - 1) setTela('comoJogar');
         else proximoSlide();
      } else if (tela === 'comoJogar') {
         setTela('perigos');
      } else if (tela === 'perigos') {
         setTela('configuracoes');
      }
   };

   const voltarTela = () => {
      if (tela === 'planetas') slideAnterior();
      else if (tela === 'comoJogar') setTela('planetas');
      else if (tela === 'perigos') setTela('comoJogar');
   };

   // Efeito para o bloqueio inicial de 1 segundo ao abrir o manual
   useEffect(() => {
      blockTimerRef.current = setTimeout(() => setBloquearPiscada(false), 1000);
      // Função de limpeza para desmontagem do componente
      return () => {
         if (blockTimerRef.current) clearTimeout(blockTimerRef.current);
         if (autoCycleTimerRef.current) clearInterval(autoCycleTimerRef.current);
      };
   }, []);

   // Gerenciador de Piscadas Centralizado
   useEffect(() => {
      // Ação só ocorre se não estiver bloqueado, a câmera estiver ligada e uma piscada for detectada.
      if (bloquearPiscada || !mostrarCameraFlutuante || !estaPiscando) {
         return;
      }

      // Garante que qualquer timer de bloqueio anterior seja limpo antes de criar um novo
      if (blockTimerRef.current) {
         clearTimeout(blockTimerRef.current);
      }
      
      // Bloqueia imediatamente para evitar ações múltiplas
      setBloquearPiscada(true);

      // Lógica para decidir a ação com base na tela atual
      if (tela !== 'configuracoes') {
         // --- Ação de Navegação ---
         avancarTela();
         // Define um novo bloqueio de 500ms
         blockTimerRef.current = setTimeout(() => setBloquearPiscada(false), 500);
      } else {
         // --- Ação de Confirmação de Configuração ---
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
         // Define um novo bloqueio de 500ms
         blockTimerRef.current = setTimeout(() => setBloquearPiscada(false), 500);
      }
   }, [estaPiscando, mostrarCameraFlutuante, bloquearPiscada, tela, focoConfig, configuracoes, opcaoVelocidadeAtiva, opcaoPenalidadeAtiva, opcaoSonsAtiva]);


   // Efeito para o ciclo automático das opções de configuração
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
            case 'penalidade':
               setOpcaoPenalidadeAtiva(p => !p);
               break;
            case 'sons':
               setOpcaoSonsAtiva(s => !s);
               break;
            case 'iniciar':
               break;
         }
      }, 1500) as unknown as number; // Adicionado type assertion para garantir compatibilidade com setInterval

      return () => {
         if (autoCycleTimerRef.current) clearInterval(autoCycleTimerRef.current);
      };
   }, [tela, focoConfig, opcaoVelocidadeAtiva, mostrarCameraFlutuante]);

   
   const renderizarTela = () => {
      const isAvancarFocado = mostrarCameraFlutuante && tela !== 'configuracoes' && !bloquearPiscada;

      switch (tela) {
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
                     <S.BotaoNavegacao onClick={voltarTela} disabled={slideAtual === 0}>Voltar</S.BotaoNavegacao>
                     <span>{slideAtual + 1} / {planetasInfo.length}</span>
                     <S.BotaoNavegacao 
                onClick={avancarTela}
                $isFocusedManual={isAvancarFocado} // Aplicando o foco aqui
              >
                        {slideAtual === planetasInfo.length - 1 ? 'Como Jogar?' : 'Próximo'}
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
                        <h3>Controles Simples</h3>
                        <p>Use as teclas <strong>SETA PARA CIMA</strong> e   <strong>SETA PARA BAIXO</strong> para mover seu astronauta.</p>
                     </S.WrapperTexto>
                  </S.SecaoExplicacao>
                  <S.SecaoExplicacao>
                     <S.WrapperIcone><Trophy size={32} strokeWidth={2.5} /></S.WrapperIcone>
                     <S.WrapperTexto>
                        <h3>Missão de Coleta</h3>
                        <p>Seu objetivo é coletar os planetas na ordem certa do Sistema Solar. Cada acerto acenderá o planeta na barra superior!</p>
                     </S.WrapperTexto>
                  </S.SecaoExplicacao>
                  <S.NavegacaoCarrossel>
                        <S.BotaoNavegacao onClick={voltarTela}>Voltar</S.BotaoNavegacao>
                        <S.BotaoNavegacao 
                    onClick={avancarTela}
                    $isFocusedManual={isAvancarFocado} // Aplicando o foco aqui
                >
                    Entendi! E os perigos?
                </S.BotaoNavegacao>
                  </S.NavegacaoCarrossel>
               </S.ContainerExplicacao>
            );
            
         case 'perigos':
            return (
               <S.ContainerExplicacao>
                  <S.TextoSlide><h2>Perigos e Objetivos</h2></S.TextoSlide>
                     <S.SecaoExplicacao>
                     <S.WrapperIcone><Badge size={32} strokeWidth={2.5} /></S.WrapperIcone>
                     <S.WrapperTexto>
                        <h3>Desvie dos Meteoros</h3>
                        <p>O espaço é cheio de rochas! Se você colidir com um meteoro, todo o seu progresso será perdido e a missão recomeça.</p>
                     </S.WrapperTexto>
                  </S.SecaoExplicacao>
                  <S.SecaoExplicacao>
                     <S.WrapperIcone><AlertTriangle size={32} strokeWidth={2.5} /></S.WrapperIcone>
                     <S.WrapperTexto>
                        <h3>Cuidado com a Sequência</h3>
                        <p>A ordem é TUDO! Coletar um planeta fora da sequência correta também reinicia sua missão. Fique atento!</p>
                     </S.WrapperTexto>
                  </S.SecaoExplicacao>
                  <S.NavegacaoCarrossel>
                        <S.BotaoNavegacao onClick={voltarTela}>Voltar</S.BotaoNavegacao>
                        <S.BotaoNavegacao 
                    onClick={avancarTela}
                    $isFocusedManual={isAvancarFocado} // Aplicando o foco aqui
                >
                    Ajustar Jogo
                </S.BotaoNavegacao>
                  </S.NavegacaoCarrossel>
               </S.ContainerExplicacao>
            );
         
         case 'configuracoes':
            return (
               <S.ContainerConfiguracoes>
                  <S.TextoSlide><h2>Controles do Jogo</h2></S.TextoSlide>

                  <S.LinhaConfiguracao $isFocused={focoConfig === 'velocidade'}>
                     <S.RotuloConfiguracao><Zap size={32} /><h3>Velocidade</h3></S.RotuloConfiguracao>
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
                           onClick={() => setConfiguracoes(c => ({...c, velocidade: 'rapida'}))}>Rápida</S.BotaoOpcao>
                     </S.GrupoBotoes>
                  </S.LinhaConfiguracao>

                  <S.LinhaConfiguracao $isFocused={focoConfig === 'penalidade'}>
                     <S.RotuloConfiguracao><ShieldOff size={32} /><h3>Erro na Ordem Reseta?</h3></S.RotuloConfiguracao>
                     <S.ContainerInterruptor>
                        <S.InputInterruptor type="checkbox" 
                           checked={mostrarCameraFlutuante && focoConfig === 'penalidade' ? opcaoPenalidadeAtiva : configuracoes.penalidade} 
                           onChange={e => setConfiguracoes(c => ({...c, penalidade: e.target.checked}))} />
                        <S.DeslizadorInterruptor />
                     </S.ContainerInterruptor>
                  </S.LinhaConfiguracao>

                  <S.LinhaConfiguracao $isFocused={focoConfig === 'sons'}>
                     <S.RotuloConfiguracao><Music size={32} /><h3>Efeitos Sonoros</h3></S.RotuloConfiguracao>
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
                        COMEÇAR MISSÃO!
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