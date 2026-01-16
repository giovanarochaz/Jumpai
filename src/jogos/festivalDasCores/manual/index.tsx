import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as S from './styles';
import { Palette, Brush, Music, ShieldOff, ChevronRight, ChevronLeft, Target } from 'lucide-react';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';
import { useLeitorOcular } from '../../../hooks/useLeitorOcular';
import { pararNarracao } from '../../../servicos/acessibilidade';
import type { BaseManualProps, ConfiguracoesJogo } from '../../../interface/types';

const DIFICULDADES = ['facil', 'medio', 'dificil'];

const slidesEducativos = [
  {
    titulo: 'As Cores Poderosas (Primárias)',
    texto: (<>Essas são as <strong>"Cores Pais"</strong>. Elas são puras e únicas: você não consegue criá-las misturando outras tintas. Elas são a base de tudo!</>),
    narração: "Cores Primárias. Elas são as cores pais. Vermelho, Amarelo e Azul. Elas são puras e você não consegue criá-las misturando outras tintas. Pisque agora para ver as misturas.",
    visual: 'primarias'
  },
  {
    titulo: 'As Misturas de Duplas (Secundárias)',
    texto: (
      <>Quando duas "Cores Pais" se juntam, elas criam as <strong>Cores Secundárias</strong>. Veja a mágica acontecer!</>
    ),
    narração: "Cores Secundárias. Quando duas cores pais se juntam, elas criam as secundárias. Amarelo e Azul fazem Verde. Amarelo e Vermelho fazem Laranja. Vermelho e Azul fazem Roxo. Pisque para ver o nível profissional.",
    visual: 'secundarias'
  },
  {
    titulo: 'O Toque Especial (Terciárias)',
    texto: (
      <>Agora a brincadeira ficou profissional! As <strong>Cores Terciárias</strong> surgem quando misturamos uma cor primária com uma secundária vizinha.</>
    ),
    narração: "Cores Terciárias. Elas surgem quando misturamos uma cor primária com uma secundária. Como o Vermelho alaranjado ou o Azul esverdeado. Pisque para conhecer sua missão.",
    visual: 'terciarias'
  },
  {
    titulo: 'Sua Missão de Artista',
    texto: (
      <>Use o <strong>pincel mágico</strong>! Pinte o desenho da esquerda para ficar igualzinho ao modelo da direita. Misture as tintas para encontrar a cor certa!</>
    ),
    narração: "Sua Missão. Use o pincel mágico! Pinte o desenho da esquerda para ficar igual ao modelo da direita. Pisque para configurar seu ateliê.",
    visual: 'objetivo'
  }
];

const ManualFestivalDasCores: React.FC<BaseManualProps<ConfiguracoesJogo>> = ({ aoIniciar }) => {
  const { mostrarCameraFlutuante: modoOcular, estaPiscando, leitorAtivo } = useStore(lojaOlho);

  const [tela, setTela] = useState<'educativo' | 'configuracoes'>('educativo');
  const [slideIndex, setSlideIndex] = useState(0);
  const [config, setConfig] = useState<ConfiguracoesJogo>({ dificuldade: 'facil', penalidade: true, sons: true });
  
  const [focoConfig, setFocoConfig] = useState<'dificuldade' | 'penalidade' | 'sons' | 'iniciar'>('dificuldade');
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
  }, [tela, slideIndex, focoConfig, modoOcular, leitorAtivo]);

  useEffect(() => {
    if (modoOcular && podeInteragirOcular && tela === 'configuracoes') {
      timerScanRef.current = setInterval(() => {
        if (focoConfig === 'dificuldade') {
           const currentDif = config.dificuldade || 'facil';
           const nextIdx = (DIFICULDADES.indexOf(currentDif) + 1) % 3;
           setConfig(prev => ({ ...prev, dificuldade: DIFICULDADES[nextIdx] as any }));
        } else if (focoConfig === 'penalidade') {
          setConfig(prev => ({ ...prev, penalidade: !prev.penalidade }));
        } else if (focoConfig === 'sons') {
          setConfig(prev => ({ ...prev, sons: !prev.sons }));
        }
      }, 3000);
    }
    return () => { if (timerScanRef.current) clearInterval(timerScanRef.current); };
  }, [tela, focoConfig, podeInteragirOcular, modoOcular, config.dificuldade]);

  const textoParaLeitura = useMemo(() => {
    if (!leitorAtivo) return null;
    if (tela === 'educativo') return slidesEducativos[slideIndex].narração;
    
    if (tela === 'configuracoes') {
      if (!podeInteragirOcular) {
        if (focoConfig === 'dificuldade') return "Qual o nível das tintas?";
        if (focoConfig === 'penalidade') return "Se errar a cor, quer recomeçar o desenho do zero?";
        if (focoConfig === 'sons') return "Ligar sons do ateliê?";
        if (focoConfig === 'iniciar') return "Tudo pronto! Vamos pintar?";
      } else {
        if (focoConfig === 'dificuldade') {
          const t: Record<string, string> = { facil: "Cores Primárias.", medio: "Cores Secundárias.", dificil: "Cores Terciárias." };
          return `${t[config.dificuldade || 'facil']}.`;
        }
        if (focoConfig === 'penalidade') return config.penalidade ? "Apaga apenas as partes erradas." : "Reiniciar ao errar.";
        if (focoConfig === 'sons') return config.sons ? "Sons ligados." : "Sons desligados.";
        if (focoConfig === 'iniciar') return "Pisque agora para começar a pintura!";
      }
    }
    return "";
  }, [tela, slideIndex, focoConfig, config, leitorAtivo, podeInteragirOcular]);

  useLeitorOcular(textoParaLeitura, [textoParaLeitura], () => {
    if (modoOcular && leitorAtivo) setPodeInteragirOcular(true);
  });

  const confirmarAcao = useCallback(() => {
    if (tela === 'educativo') {
      if (slideIndex < slidesEducativos.length - 1) setSlideIndex(s => s + 1);
      else setTela('configuracoes');
    } else if (tela === 'configuracoes') {
      if (modoOcular) {
        if (focoConfig === 'dificuldade') setFocoConfig('penalidade');
        else if (focoConfig === 'penalidade') setFocoConfig('sons');
        else if (focoConfig === 'sons') setFocoConfig('iniciar');
        else aoIniciar(config);
      } else {
        aoIniciar(config);
      }
    }
  }, [tela, slideIndex, focoConfig, config, modoOcular, aoIniciar]);

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
        {tela === 'educativo' && (
          <>
            <S.TituloSlide>
               <Palette size={40} color="#f97316" /> {slidesEducativos[slideIndex].titulo}
            </S.TituloSlide>
            
            <S.ContainerSlide>
               {slidesEducativos[slideIndex].visual === 'primarias' && (
                  <S.ContainerMistura>
                    <S.BolhaCor $cor="#EF4444" /> <S.BolhaCor $cor="#FACC15" /> <S.BolhaCor $cor="#3B82F6" />
                  </S.ContainerMistura>
               )}
               {slidesEducativos[slideIndex].visual === 'secundarias' && (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                    <S.ContainerMistura><S.BolhaCor $cor="#FACC15"/><S.Operador>+</S.Operador><S.BolhaCor $cor="#3B82F6"/><S.Operador>=</S.Operador><S.BolhaCor $cor="#22C55E"/></S.ContainerMistura>
                    <S.ContainerMistura><S.BolhaCor $cor="#EF4444"/><S.Operador>+</S.Operador><S.BolhaCor $cor="#3B82F6"/><S.Operador>=</S.Operador><S.BolhaCor $cor="#9333EA"/></S.ContainerMistura>
                  </div>
               )}
               {slidesEducativos[slideIndex].visual === 'terciarias' && (
                  <S.ContainerMistura>
                    <S.BolhaCor $cor="#EF4444" /> <S.Operador>+</S.Operador> <S.BolhaCor $cor="#F97316" /> <S.Operador>→</S.Operador> <S.BolhaCor $cor="#EA580C" />
                  </S.ContainerMistura>
               )}
               {slidesEducativos[slideIndex].visual === 'objetivo' && (
                  <Target size={100} color="#EF4444" />
               )}
               <S.TextoExplicativo>{slidesEducativos[slideIndex].texto}</S.TextoExplicativo>
            </S.ContainerSlide>

            <S.BarraNavegacao>
              <S.BotaoNav onClick={() => setSlideIndex(0)} disabled={slideIndex === 0}>
                <ChevronLeft /> Voltar
              </S.BotaoNav>
              <S.BotaoNav onClick={confirmarAcao} $destaque={feedbackVisual}>
                {leitorAtivo && !podeInteragirOcular && modoOcular ? 'OUVINDO...' : 'PRÓXIMO'} <ChevronRight />
              </S.BotaoNav>
            </S.BarraNavegacao>
          </>
        )}

        {tela === 'configuracoes' && (
          <S.ContainerConfig>
            <S.TituloSlide>Ajustes do Ateliê</S.TituloSlide>
            
            <S.LinhaConfig $focado={feedbackVisual && focoConfig === 'dificuldade'}>
              <S.Label><Brush size={28}/> Nível das Tintas</S.Label>
              <S.GrupoBotoes>
                {DIFICULDADES.map(d => (
                  <S.BotaoOpcao 
                    key={d}
                    $ativo={config.dificuldade === d}
                    $isFocused={feedbackVisual && focoConfig === 'dificuldade' && config.dificuldade === d}
                    onClick={() => setConfig(c => ({...c, dificuldade: d as any}))}
                  >
                    {d === 'facil' ? 'Primárias' : d === 'medio' ? 'Secundárias' : 'Terciárias'}
                  </S.BotaoOpcao>
                ))}
              </S.GrupoBotoes>
            </S.LinhaConfig>

            <S.LinhaConfig 
              $focado={feedbackVisual && focoConfig === 'penalidade'}
              onClick={() => setConfig(prev => ({ ...prev, penalidade: !prev.penalidade }))}
              style={{ cursor: 'pointer' }}
            >
              <S.Label><ShieldOff size={28}/> Recomeçar se Errar</S.Label>
              <S.ToggleContainer>
                <S.InputInterruptor type="checkbox" checked={config.penalidade} readOnly />
                <S.DeslizadorInterruptor />
              </S.ToggleContainer>
            </S.LinhaConfig>

            <S.LinhaConfig 
              $focado={feedbackVisual && focoConfig === 'sons'}
              onClick={() => setConfig(prev => ({ ...prev, sons: !prev.sons }))}
              style={{ cursor: 'pointer' }}
            >
              <S.Label><Music size={28}/> Sons do Ateliê</S.Label>
              <S.ToggleContainer>
                <S.InputInterruptor type="checkbox" checked={config.sons} readOnly />
                <S.DeslizadorInterruptor />
              </S.ToggleContainer>
            </S.LinhaConfig>

            <S.BotaoIniciar 
              $focado={feedbackVisual && focoConfig === 'iniciar'}
              onClick={confirmarAcao}
            >
              {leitorAtivo && !podeInteragirOcular && modoOcular ? 'PREPARANDO...' : 'COMEÇAR PINTURA!'}
            </S.BotaoIniciar>
          </S.ContainerConfig>
        )}
      </S.ConteudoModal>
    </S.FundoModal>
  );
};

export default ManualFestivalDasCores;