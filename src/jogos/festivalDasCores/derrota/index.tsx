import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as S from './styles';
import { Eraser, RotateCcw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';
import { useLeitorOcular } from '../../../hooks/useLeitorOcular';
import { pararNarracao } from '../../../servicos/acessibilidade';
import type { ConfiguracoesJogo } from '../../../interface/types';

const TelaDerrotaFestivalCores: React.FC<{ aoReiniciar: () => void; configuracoes: ConfiguracoesJogo }> = ({ aoReiniciar, configuracoes }) => {
  const { estaPiscando, mostrarCameraFlutuante: modoOcular, leitorAtivo } = useStore(lojaOlho);
  const navigate = useNavigate();

  const [botaoFocado, setBotaoFocado] = useState<'reiniciar' | 'menu' | null>(modoOcular ? 'reiniciar' : null);
  const [podeInteragirOcular, setPodeInteragirOcular] = useState(false);
  
  const timerDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const timerScanRef = useRef<NodeJS.Timeout | null>(null);
  const piscadaProcessadaRef = useRef(false);

  useEffect(() => {
    if (!modoOcular) { setPodeInteragirOcular(true); return; }
    setPodeInteragirOcular(false);
    if (timerDebounceRef.current) clearTimeout(timerDebounceRef.current);
    if (!leitorAtivo) timerDebounceRef.current = setTimeout(() => setPodeInteragirOcular(true), 1200);
  }, [modoOcular, leitorAtivo]);

  useEffect(() => {
    if (modoOcular && podeInteragirOcular) {
      timerScanRef.current = setInterval(() => setBotaoFocado(prev => prev === 'reiniciar' ? 'menu' : 'reiniciar'), 3500);
    }
    return () => { if (timerScanRef.current) clearInterval(timerScanRef.current); };
  }, [modoOcular, podeInteragirOcular]);

  useEffect(() => {
    if (configuracoes.sons) {
      const audio = new Audio('/assets/efeitos/derrota.mp3');
      audio.play().catch(() => {});
      return () => { audio.pause(); };
    }
  }, [configuracoes.sons]);

  const textoParaLeitura = useMemo(() => {
    if (!leitorAtivo) return null;
    if (!podeInteragirOcular) return "Ops! A tinta borrou um pouquinho. Vamos usar a borracha mágica e tentar de novo?";
    return botaoFocado === 'reiniciar' ? "Limpar o desenho e recomeçar. Pisque agora!" : "Voltar para o menu principal. Pisque agora!";
  }, [leitorAtivo, podeInteragirOcular, botaoFocado]);

  useLeitorOcular(textoParaLeitura, [textoParaLeitura], () => {
    if (modoOcular && leitorAtivo) setPodeInteragirOcular(true);
  });

  const confirmarAcao = useCallback(() => {
    pararNarracao();
    if (botaoFocado === 'reiniciar') aoReiniciar();
    else navigate('/jogos');
  }, [botaoFocado, aoReiniciar, navigate]);

  useEffect(() => {
    if (!estaPiscando) { piscadaProcessadaRef.current = false; return; }
    if (estaPiscando && modoOcular && podeInteragirOcular && !piscadaProcessadaRef.current) {
      piscadaProcessadaRef.current = true;
      confirmarAcao();
    }
  }, [estaPiscando, modoOcular, podeInteragirOcular, confirmarAcao]);

  return (
    <S.FundoDerrota>
      <S.AlertaErro />
      <S.ConteudoPlaca $derrota>
        <S.IconeContainer style={{color: '#ef4444'}}><Eraser size={80} /></S.IconeContainer>
        <S.Titulo $derrota>A TINTA BORROU!</S.Titulo>
        <S.Mensagem>A mistura não ficou igual ao modelo. Que tal praticar mais uma vez para virar um mestre?</S.Mensagem>
        <S.ContainerBotoes>
          <S.BotaoAcao $derrota onClick={aoReiniciar} $isFocused={modoOcular && podeInteragirOcular && botaoFocado === 'reiniciar'}><RotateCcw size={20} /> RECOMEÇAR</S.BotaoAcao>
          <S.BotaoAcao $derrota onClick={() => navigate('/jogos')} $isFocused={modoOcular && podeInteragirOcular && botaoFocado === 'menu'}><Home size={20} /> MENU</S.BotaoAcao>
        </S.ContainerBotoes>
      </S.ConteudoPlaca>
    </S.FundoDerrota>
  );
};

export default TelaDerrotaFestivalCores;