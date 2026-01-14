import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as S from './styles';
import { BookOpen, Gamepad2, AlertTriangle, Zap, Music, ShieldOff, ChevronRight, ChevronLeft } from 'lucide-react';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';
import { useLeitorOcular } from '../../../hooks/useLeitorOcular';
import { pararNarracao } from '../../../servicos/acessibilidade';
import type { BaseManualProps, ConfiguracoesJogo } from '../../../interface/types';

const DIFICULDADES = ['facil', 'medio', 'dificil'];

const slidesEducativos = [
  {
    titulo: 'Bem-vindo à Lagoa!',
    icone: <img src="/assets/saltoAlfabetico/sapo_parado.png" alt="Sapo" />,
    texto: "Ajude o sapinho a atravessar a lagoa! Ele precisa pular nas vitórias-régias certas para formar palavras.",
    destaque: "Mas cuidado para não cair na água!"
  },
   {
   titulo: 'O que são Sílabas?',
   icone: <BookOpen />,
   texto: "Sílabas são os pedacinhos de som das palavras. Quando você fala 'SA-PO', você fala dois pedacinhos.",
   textoParaNarrar: "Sílabas são os pedacinhos de som das palavras. Quando você fala SÁ... PU... Você fala dois pedacinhos.",
   destaque: "SA + PO = SAPO"
   }

];

const ManualSaltoAlfabetico: React.FC<BaseManualProps<ConfiguracoesJogo>> = ({ aoIniciar }) => {
  const { mostrarCameraFlutuante: modoOcular, estaPiscando, leitorAtivo } = useStore(lojaOlho);

  const [tela, setTela] = useState<'educativo' | 'comoJogar' | 'configuracoes'>('educativo');
  const [slideIndex, setSlideIndex] = useState(0);
  const [config, setConfig] = useState<ConfiguracoesJogo>({ dificuldade: 'facil', penalidade: true, sons: true });
  
  const [focoConfig, setFocoConfig] = useState<'dificuldade' | 'penalidade' | 'sons' | 'iniciar'>('dificuldade');
  const [podeInteragirOcular, setPodeInteragirOcular] = useState(false);

  const timerScanRef = useRef<NodeJS.Timeout | null>(null);
  const timerDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const piscadaProcessadaRef = useRef(false);

  // --- ACESSIBILIDADE E TIMERS ---

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
           const nextDif = DIFICULDADES[(DIFICULDADES.indexOf(config.dificuldade) + 1) % 3];
           setConfig(prev => ({ ...prev, dificuldade: nextDif as any }));
        } else if (focoConfig === 'penalidade') {
          setConfig(prev => ({ ...prev, penalidade: !prev.penalidade }));
        } else if (focoConfig === 'sons') {
          setConfig(prev => ({ ...prev, sons: !prev.sons }));
        }
      }, 2500);
    }
    return () => { if (timerScanRef.current) clearInterval(timerScanRef.current); };
  }, [tela, focoConfig, podeInteragirOcular, modoOcular, config.dificuldade]);
  // --- NARRAÇÃO ---

  const textoParaLeitura = useMemo(() => {
    if (!leitorAtivo) return null;
    if (tela === 'educativo') {
      const s = slidesEducativos[slideIndex];
      return `${s.titulo}. ${s.textoParaNarrar}. Pisque agora para avançar.`;
      }    
    if (tela === 'comoJogar') {
      return "Como jogar. Pule na vitória-régia com a sílaba correta. Se errar, o sapo cai na água. Pisque para ajustar o jogo.";
    }
    if (tela === 'configuracoes') {
      if (!podeInteragirOcular) {
        if (focoConfig === 'dificuldade') return "Qual o nível de dificuldade?";
        if (focoConfig === 'penalidade') return "Quer reiniciar se errar o pulo?";
        if (focoConfig === 'sons') return "Quer ouvir os sons da lagoa?";
        if (focoConfig === 'iniciar') return "Tudo pronto! Vamos começar?";
      } else {
        if (focoConfig === 'dificuldade') return `Nível ${config.dificuldade}. Pisque para escolher este.`;
        if (focoConfig === 'penalidade') return config.penalidade ? "Sim, reiniciar. Pisque para escolher." : "Não, continuar. Pisque para escolher.";
        if (focoConfig === 'sons') return config.sons ? "Sons ligados. Pisque para escolher." : "Sons desligados. Pisque para escolher.";
        if (focoConfig === 'iniciar') return "Pisque agora para começar a aventura!";
      }
    }
    return "";
  }, [tela, slideIndex, focoConfig, config, leitorAtivo, podeInteragirOcular]);

  useLeitorOcular(textoParaLeitura, [textoParaLeitura], () => {
    if (modoOcular && leitorAtivo) setPodeInteragirOcular(true);
  });

  // --- AÇÕES ---

  const confirmarAcao = useCallback(() => {
    if (tela === 'educativo') {
      if (slideIndex < slidesEducativos.length - 1) setSlideIndex(s => s + 1);
      else setTela('comoJogar');
    } else if (tela === 'comoJogar') {
      setTela('configuracoes');
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
    if (modoOcular && podeInteragirOcular && !piscadaProcessadaRef.current) {
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
          <S.ContainerInfo>
            <S.TituloSlide>{slidesEducativos[slideIndex].titulo}</S.TituloSlide>
            <S.CaixaIcone>{slidesEducativos[slideIndex].icone}</S.CaixaIcone>
            <S.TextoExplicativo>
              {slidesEducativos[slideIndex].texto}
              <br/><br/>
              <strong>{slidesEducativos[slideIndex].destaque}</strong>
            </S.TextoExplicativo>
            <S.BarraNavegacao>
              <S.BotaoNav onClick={() => setSlideIndex(0)} disabled={slideIndex === 0}>
                <ChevronLeft /> Voltar
              </S.BotaoNav>
              <S.BotaoNav onClick={confirmarAcao} $destaque={feedbackVisual}>
                {leitorAtivo && !podeInteragirOcular && modoOcular ? 'OUVINDO...' : 'PRÓXIMO'} <ChevronRight />
              </S.BotaoNav>
            </S.BarraNavegacao>
          </S.ContainerInfo>
        )}

        {tela === 'comoJogar' && (
          <S.ContainerInfo>
            <S.TituloSlide>Missão do Sapo</S.TituloSlide>
            <S.InfoRow>
              <S.CaixaIcone><Gamepad2 /></S.CaixaIcone>
              <S.TextoRow>
                <h3>Escolha a Vitória-Régia</h3>
                <p>A palavra vai aparecer faltando pedaços. Pule na folha que tem a sílaba correta!</p>
              </S.TextoRow>
            </S.InfoRow>
            <S.InfoRow>
              <S.CaixaIcone><AlertTriangle /></S.CaixaIcone>
              <S.TextoRow>
                <h3>Cuidado!</h3>
                <p>Se escolher a sílaba errada, a folha afunda e o sapo se molha!</p>
              </S.TextoRow>
            </S.InfoRow>
            <S.BarraNavegacao>
              <S.BotaoNav onClick={() => setTela('educativo')}><ChevronLeft /> Voltar</S.BotaoNav>
              <S.BotaoNav onClick={confirmarAcao} $destaque={feedbackVisual}>
                CONFIGURAR <ChevronRight />
              </S.BotaoNav>
            </S.BarraNavegacao>
          </S.ContainerInfo>
        )}

        {tela === 'configuracoes' && (
          <S.ContainerConfig>
            <S.TituloSlide>Ajustes</S.TituloSlide>

            <S.LinhaConfig $focado={feedbackVisual && focoConfig === 'dificuldade'}>
              <S.Label><Zap size={28}/> Nível</S.Label>
              <S.GrupoBotoes>
                {DIFICULDADES.map(d => (
                  <S.BotaoOpcao 
                    key={d}
                    $ativo={config.dificuldade === d}
                    $isFocused={feedbackVisual && focoConfig === 'dificuldade' && config.dificuldade === d}
                    onClick={() => setConfig(prev => ({...prev, dificuldade: d as any}))}
                  >
                    {d}
                  </S.BotaoOpcao>
                ))}
              </S.GrupoBotoes>
            </S.LinhaConfig>

            <S.LinhaConfig 
              $focado={feedbackVisual && focoConfig === 'penalidade'}
              onClick={() => setConfig(prev => ({ ...prev, penalidade: !prev.penalidade }))}
              style={{ cursor: 'pointer' }}
            >
              <S.Label><ShieldOff size={28}/> Reiniciar se errar</S.Label>
              <S.ToggleContainer>
                <S.InputInterruptor type="checkbox" checked={config.penalidade} readOnly />
                <span className="slider"></span>
              </S.ToggleContainer>
            </S.LinhaConfig>

            <S.LinhaConfig 
              $focado={feedbackVisual && focoConfig === 'sons'}
              onClick={() => setConfig(prev => ({ ...prev, sons: !prev.sons }))}
              style={{ cursor: 'pointer' }}
            >
              <S.Label><Music size={28}/> Sons</S.Label>
              <S.ToggleContainer>
                <S.InputInterruptor type="checkbox" checked={config.sons} readOnly />
                <span className="slider"></span>
              </S.ToggleContainer>
            </S.LinhaConfig>

            <S.BotaoIniciar 
              $focado={feedbackVisual && focoConfig === 'iniciar'}
              onClick={confirmarAcao}
            >
              {leitorAtivo && !podeInteragirOcular && modoOcular ? 'PREPARANDO...' : 'COMEÇAR AVENTURA!'}
            </S.BotaoIniciar>
          </S.ContainerConfig>
        )}
      </S.ConteudoModal>
    </S.FundoModal>
  );
};

export default ManualSaltoAlfabetico;