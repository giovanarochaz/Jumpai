import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as S from './styles';
import { Rocket, Zap, Music, ShieldOff, Flame, Orbit, ChevronRight, ChevronLeft } from 'lucide-react';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';
import { useLeitorOcular } from '../../../hooks/useLeitorOcular';
import { pararNarracao } from '../../../servicos/acessibilidade';

const planetasInfo = [
   { 
      nome: 'Mercúrio', 
      imagem: '/assets/sistemaSolar/mercurio.png', 
      descricao: "O 'Papa-Léguas' do espaço! Sou o menor planeta e o mais rápido de todos. Um ano aqui dura apenas 88 dias! Mas cuidado: de dia eu sou quente como um forno e de noite sou mais frio que um freezer." 
   },
   { 
      nome: 'Vênus', 
      imagem: '/assets/sistemaSolar/venus.png', 
      descricao: "O planeta 'estufa'! Sou o lugar mais quente do Sistema Solar, com nuvens que prendem o calor. Sou tão brilhante que pareço uma estrela no céu, e aqui o Sol nasce do lado contrário: no Oeste!" 
   },
   { 
      nome: 'Terra', 
      imagem: '/assets/sistemaSolar/terra.png', 
      descricao: "A nossa nave mãe azul! Sou o único lugar conhecido com o 'combo da vida': água, oxigênio e a temperatura perfeita. Tenho um escudo magnético invisível que nos protege das tempestades do Sol." 
   },
   { 
      nome: 'Marte', 
      imagem: '/assets/sistemaSolar/marte.png', 
      descricao: "O mundo de ferrugem! Sou vermelho porque meu solo é cheio de ferro oxidado. Sabia que tenho o maior vulcão do Universo? O Monte Olimpo é três vezes mais alto que o Monte Everest!" 
   },
   { 
      nome: 'Júpiter', 
      imagem: '/assets/sistemaSolar/jupiter.png', 
      descricao: "O gigante protetor! Sou tão grande que todos os outros planetas caberiam dentro de mim. Minha 'Grande Mancha Vermelha' é, na verdade, uma tempestade gigante que dura mais de 300 anos!" 
   },
   { 
      nome: 'Saturno', 
      imagem: '/assets/sistemaSolar/saturno.png', 
      descricao: "A joia do sistema! Meus anéis são feitos de bilhões de pedaços de gelo e poeira. Curiosidade: eu sou tão leve que, se você encontrasse uma banheira gigante o suficiente, eu flutuaria na água!" 
   },
   { 
      nome: 'Urano', 
      imagem: '/assets/sistemaSolar/urano.png', 
      descricao: "O gigante rebelde! Diferente de todos os outros, eu giro 'deitado'. Sou um mundo gelado de cor azul-esverdeada por causa do gás metano e sou o planeta mais frio de toda a vizinhança." 
   },
   { 
      nome: 'Netuno', 
      imagem: '/assets/sistemaSolar/netuno.png', 
      descricao: "O mestre dos ventos! Sou o último planeta e o mais distante do Sol. Aqui os ventos são tão furiosos que ultrapassam a velocidade de um avião a jato! Sou um mundo azul profundo, frio e sombrio." 
   },
];
export type VelocidadeGeracao = 'lenta' | 'normal' | 'rapida';
export interface ConfiguracoesJogo { velocidade: VelocidadeGeracao; penalidade: boolean; sons: boolean; }
interface ManualSistemaSolarProps { aoIniciarMissao: (configuracoes: ConfiguracoesJogo) => void; }
const VELOCIDADES: VelocidadeGeracao[] = ['lenta', 'normal', 'rapida'];

const ManualSistemaSolar: React.FC<ManualSistemaSolarProps> = ({ aoIniciarMissao }) => {
   const { mostrarCameraFlutuante, estaPiscando, leitorAtivo } = useStore(lojaOlho);
   
   const [tela, setTela] = useState<'introducao' | 'planetas' | 'comoJogar' | 'perigos' | 'configuracoes'>('introducao');
   const [slideAtual, setSlideAtual] = useState(0);
   const [configuracoes, setConfiguracoes] = useState<ConfiguracoesJogo>({ velocidade: 'normal', penalidade: true, sons: true });

   const [focoConfig, setFocoConfig] = useState<'velocidade' | 'penalidade' | 'sons' | 'iniciar'>('velocidade');
   const [opcaoVelocidadeAtiva, setOpcaoVelocidadeAtiva] = useState<VelocidadeGeracao>('normal');
   const [opcaoPenalidadeAtiva, setOpcaoPenalidadeAtiva] = useState<boolean>(true);
   const [opcaoSonsAtiva, setOpcaoSonsAtiva] = useState<boolean>(true);
   
   const [podeInteragirOcular, setPodeInteragirOcular] = useState(false);
   const timerRef = useRef<NodeJS.Timeout | null>(null);
   const scanTimerRef = useRef<NodeJS.Timeout | null>(null);

   const conteudoAtual = planetasInfo[slideAtual];

   useEffect(() => {
      if (!mostrarCameraFlutuante) { setPodeInteragirOcular(true); return; }
      setPodeInteragirOcular(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (!leitorAtivo) {
         timerRef.current = setTimeout(() => setPodeInteragirOcular(true), 1000);
      } 
   }, [tela, slideAtual, focoConfig, mostrarCameraFlutuante, leitorAtivo]);

   useEffect(() => {
      if (mostrarCameraFlutuante && podeInteragirOcular && tela === 'configuracoes') {
         if (scanTimerRef.current) clearInterval(scanTimerRef.current);
         scanTimerRef.current = setInterval(() => {
            if (focoConfig === 'velocidade') setOpcaoVelocidadeAtiva(prev => VELOCIDADES[(VELOCIDADES.indexOf(prev) + 1) % VELOCIDADES.length]);
            else if (focoConfig === 'penalidade') setOpcaoPenalidadeAtiva(prev => !prev);
            else if (focoConfig === 'sons') setOpcaoSonsAtiva(prev => !prev);
         }, 2500);
      }
      return () => { if (scanTimerRef.current) clearInterval(scanTimerRef.current); };
   }, [tela, focoConfig, podeInteragirOcular, mostrarCameraFlutuante]);

   const lidarComFimDaLeitura = useCallback(() => {
      if (mostrarCameraFlutuante && leitorAtivo) setPodeInteragirOcular(true);
   }, [mostrarCameraFlutuante, leitorAtivo]);

   const obterTextoParaLeitura = useCallback(() => {
      if (!leitorAtivo) return null;
      if (tela === 'introducao') return "Academia de Pilotos. Sua missão é coletar os planetas na ordem certa. Pisque para começar.";
      if (tela === 'planetas') return `${conteudoAtual.nome}. ${conteudoAtual.descricao} Pisque para o próximo.`;
      if (tela === 'comoJogar') return "Controles: Pisque para manobrar a nave.";
      if (tela === 'perigos') return "Atenção! Cuidado com os meteoros. Se bater, a missão reinicia! Pisque para configurar.";
      if (tela === 'configuracoes') {
         if (!podeInteragirOcular) {
            if (focoConfig === 'velocidade') return "Potência dos Motores.";
            if (focoConfig === 'penalidade') return "Reiniciar ao bater?";
            if (focoConfig === 'sons') return "Áudio do sistema.";
            if (focoConfig === 'iniciar') return "Tudo pronto!";
         } else {
            if (focoConfig === 'velocidade') return opcaoVelocidadeAtiva;
            if (focoConfig === 'penalidade') return opcaoPenalidadeAtiva ? "Sim" : "Não";
            if (focoConfig === 'sons') return opcaoSonsAtiva ? "Ligado" : "Desligado";
            if (focoConfig === 'iniciar') return "Pisque para decolar!";
         }
      }
      return "";
   }, [tela, slideAtual, focoConfig, conteudoAtual, leitorAtivo, podeInteragirOcular, opcaoVelocidadeAtiva, opcaoPenalidadeAtiva, opcaoSonsAtiva]);

   useLeitorOcular(obterTextoParaLeitura(), [tela, slideAtual, focoConfig, opcaoVelocidadeAtiva, opcaoPenalidadeAtiva, opcaoSonsAtiva], lidarComFimDaLeitura);

   const avancarTela = useCallback(() => {
      if (tela === 'introducao') setTela('planetas');
      else if (tela === 'planetas') slideAtual === planetasInfo.length - 1 ? setTela('comoJogar') : setSlideAtual(s => s + 1);
      else if (tela === 'comoJogar') setTela('perigos');
      else if (tela === 'perigos') setTela('configuracoes');
   }, [tela, slideAtual]);

   const confirmarAcao = useCallback(() => {
      if (tela !== 'configuracoes') {
         avancarTela();
      } else {
         switch (focoConfig) {
            case 'velocidade': setConfiguracoes(c => ({ ...c, velocidade: opcaoVelocidadeAtiva })); setFocoConfig('penalidade'); break;
            case 'penalidade': setConfiguracoes(c => ({ ...c, penalidade: opcaoPenalidadeAtiva })); setFocoConfig('sons'); break;
            case 'sons': setConfiguracoes(c => ({ ...c, sons: opcaoSonsAtiva })); setFocoConfig('iniciar'); break;
            case 'iniciar': aoIniciarMissao(configuracoes); break;
         }
      }
   }, [tela, focoConfig, opcaoVelocidadeAtiva, opcaoPenalidadeAtiva, opcaoSonsAtiva, configuracoes, aoIniciarMissao, avancarTela]);

   useEffect(() => {
      if (estaPiscando && mostrarCameraFlutuante && podeInteragirOcular) {
         setPodeInteragirOcular(false); 
         pararNarracao();
         confirmarAcao();
      }
   }, [estaPiscando, mostrarCameraFlutuante, podeInteragirOcular, confirmarAcao]);

   const mostrarFocoVisual = mostrarCameraFlutuante && podeInteragirOcular;

   return (
      <S.FundoModal>
         <S.ConteudoModal>
            {tela === 'introducao' && (
               <S.ContainerExplicacao>
                  <S.TextoSlide><h2>Academia de Pilotos</h2></S.TextoSlide>
                  <S.SecaoExplicacao>
                     <S.WrapperIcone><Rocket /></S.WrapperIcone>
                     <S.WrapperTexto><h3>Diário de Bordo</h3><p>Sua missão é pilotar uma nave avançada e coletar os planetas na ordem correta!</p></S.WrapperTexto>
                  </S.SecaoExplicacao>
                  <S.NavegacaoCarrossel>
                     <div />
                     <S.BotaoNavegacao onClick={confirmarAcao} $isFocusedManual={mostrarFocoVisual}>
                        {leitorAtivo && !podeInteragirOcular && mostrarCameraFlutuante ? 'OUVINDO...' : 'INICIAR TREINAMENTO'} <ChevronRight />
                     </S.BotaoNavegacao>
                  </S.NavegacaoCarrossel>
               </S.ContainerExplicacao>
            )}

            {tela === 'planetas' && (
               <>
                  <S.ContainerSlide>
                     <S.PlanetaAnimado src={conteudoAtual.imagem} alt={conteudoAtual.nome} />
                     <S.TextoSlide><h2>{conteudoAtual.nome}</h2><p>{conteudoAtual.descricao}</p></S.TextoSlide>
                  </S.ContainerSlide>
                  <S.NavegacaoCarrossel>
                     <S.BotaoNavegacao onClick={() => { pararNarracao(); slideAtual === 0 ? setTela('introducao') : setSlideAtual(s => s - 1); }}><ChevronLeft /> Voltar</S.BotaoNavegacao>
                     <span>{slideAtual + 1} / {planetasInfo.length}</span>
                     <S.BotaoNavegacao onClick={confirmarAcao} $isFocusedManual={mostrarFocoVisual}>
                        {leitorAtivo && !podeInteragirOcular && mostrarCameraFlutuante ? 'OUVINDO...' : 'PRÓXIMO'} <ChevronRight />
                     </S.BotaoNavegacao>
                  </S.NavegacaoCarrossel>
               </>
            )}

            {tela === 'comoJogar' && (
               <S.ContainerExplicacao>
                  <S.TextoSlide><h2>Como Pilotar</h2></S.TextoSlide>
                  <S.SecaoExplicacao>
                     <S.WrapperIcone><Orbit /></S.WrapperIcone>
                     <S.WrapperTexto><h3>Controles de Voo</h3><p>Pisque os olhos para manobrar sua nave no espaço. Capture os alvos indicados!</p></S.WrapperTexto>
                  </S.SecaoExplicacao>
                  <S.NavegacaoCarrossel>
                     <S.BotaoNavegacao onClick={() => { pararNarracao(); setTela('planetas'); }}><ChevronLeft /> Voltar</S.BotaoNavegacao>
                     <S.BotaoNavegacao onClick={confirmarAcao} $isFocusedManual={mostrarFocoVisual}>ENTENDI!</S.BotaoNavegacao>
                  </S.NavegacaoCarrossel>
               </S.ContainerExplicacao>
            )}

            {tela === 'perigos' && (
               <S.ContainerExplicacao>
                  <S.TextoSlide><h2>Atenção, Recruta!</h2></S.TextoSlide>
                  <S.SecaoExplicacao>
                     <S.WrapperIcone><Flame /></S.WrapperIcone>
                     <S.WrapperTexto><h3>Radar de Meteoros</h3><p>Cuidado com as rochas espaciais! Se bater, a missão reinicia.</p></S.WrapperTexto>
                  </S.SecaoExplicacao>
                  <S.NavegacaoCarrossel>
                     <S.BotaoNavegacao onClick={() => { pararNarracao(); setTela('comoJogar'); }}><ChevronLeft /> Voltar</S.BotaoNavegacao>
                     <S.BotaoNavegacao onClick={confirmarAcao} $isFocusedManual={mostrarFocoVisual}>CONFIGURAR NAVE</S.BotaoNavegacao>
                  </S.NavegacaoCarrossel>
               </S.ContainerExplicacao>
            )}

            {tela === 'configuracoes' && (
               <S.ContainerConfiguracoes>
                  <S.TextoSlide><h2>Sistemas da Nave</h2></S.TextoSlide>
                  <S.LinhaConfiguracao $isFocused={mostrarFocoVisual && focoConfig === 'velocidade'}>
                     <S.RotuloConfiguracao><Zap /><h3>Potência</h3></S.RotuloConfiguracao>
                     <S.GrupoBotoes>
                        {VELOCIDADES.map(v => (
                           <S.BotaoOpcao key={v} $ativo={configuracoes.velocidade === v} $isFocused={mostrarFocoVisual && focoConfig === 'velocidade' && opcaoVelocidadeAtiva === v}
                              onClick={() => { setConfiguracoes(c => ({...c, velocidade: v})); setOpcaoVelocidadeAtiva(v); }}
                           >{v}</S.BotaoOpcao>
                        ))}
                     </S.GrupoBotoes>
                  </S.LinhaConfiguracao>
                  <S.LinhaConfiguracao $isFocused={mostrarFocoVisual && focoConfig === 'penalidade'}>
                     <S.RotuloConfiguracao><ShieldOff /><h3>Reiniciar?</h3></S.RotuloConfiguracao>
                     <S.ContainerInterruptor onClick={() => { setConfiguracoes(c => ({...c, penalidade: !c.penalidade})); setOpcaoPenalidadeAtiva(!opcaoPenalidadeAtiva); }}>
                        <S.InputInterruptor type="checkbox" checked={mostrarCameraFlutuante ? opcaoPenalidadeAtiva : configuracoes.penalidade} readOnly />
                        <S.DeslizadorInterruptor />
                     </S.ContainerInterruptor>
                  </S.LinhaConfiguracao>
                  <S.LinhaConfiguracao $isFocused={mostrarFocoVisual && focoConfig === 'sons'}>
                     <S.RotuloConfiguracao><Music /><h3>Áudio</h3></S.RotuloConfiguracao>
                     <S.ContainerInterruptor onClick={() => { setConfiguracoes(c => ({...c, sons: !c.sons})); setOpcaoSonsAtiva(!opcaoSonsAtiva); }}>
                        <S.InputInterruptor type="checkbox" checked={mostrarCameraFlutuante ? opcaoSonsAtiva : configuracoes.sons} readOnly />
                        <S.DeslizadorInterruptor />
                     </S.ContainerInterruptor>
                  </S.LinhaConfiguracao>
                  <S.BotaoIniciarMissao onClick={confirmarAcao} $isFocused={mostrarFocoVisual && focoConfig === 'iniciar'}>
                     {leitorAtivo && !podeInteragirOcular && mostrarCameraFlutuante ? 'PREPARANDO...' : 'DECOLAR'}
                  </S.BotaoIniciarMissao>
               </S.ContainerConfiguracoes>
            )}
         </S.ConteudoModal>
      </S.FundoModal>
   );
};

export default ManualSistemaSolar;