import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as S from './styles';
import { Palette, Home, RotateCcw, Brush } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'zustand'; 
import { lojaOlho } from '../../../lojas/lojaOlho';
import { useLeitorOcular } from '../../../hooks/useLeitorOcular';
import { pararNarracao } from '../../../servicos/acessibilidade';
import type { ConfiguracoesJogo } from '../../../interface/types';

const CORES_CELEBRACAO = ['#ef4444', '#facc15', '#3b82f6', '#22c55e', '#9333ea'];

const TelaVitoriaFestivalCores: React.FC<{ aoReiniciar: () => void; configuracoes: ConfiguracoesJogo }> = ({ aoReiniciar, configuracoes }) => {
  const { estaPiscando, mostrarCameraFlutuante: modoOcular, leitorAtivo } = useStore(lojaOlho);
  const navigate = useNavigate();

  const [manchas, setManchas] = useState<any[]>([]);
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
      const audio = new Audio('/assets/efeitos/vitoria.mp3');
      audio.play().catch(() => {});
      return () => { audio.pause(); };
    }
  }, [configuracoes.sons]);
  
  const textoParaLeitura = useMemo(() => {
    if (!leitorAtivo) return null;
    if (!podeInteragirOcular) return 'Incrível, Artista! Sua obra ficou perfeita. O que deseja fazer agora?';
    return botaoFocado === 'reiniciar' ? 'Pintar um novo desenho. Pisque agora para jogar!' : 'Voltar ao menu. Pisque agora para escolher outro desafio.';
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
      setPodeInteragirOcular(false);
      confirmarAcao();
    }
  }, [estaPiscando, modoOcular, podeInteragirOcular, confirmarAcao]);

  useEffect(() => {
    setManchas(Array.from({ length: 12 }).map((_, i) => ({
      id: i, top: `${Math.random() * 80 + 10}%`, left: `${Math.random() * 80 + 10}%`,
      cor: CORES_CELEBRACAO[Math.floor(Math.random() * CORES_CELEBRACAO.length)],
      delay: `${Math.random() * 2}s`,
    })));
  }, []);

  return (
    <S.FundoVitoria>
      {manchas.map(m => (
        <S.ContainerSplash key={m.id} style={{ top: m.top, left: m.left }}>
          <S.ParticleSplash style={{ '--color': m.cor, '--delay': m.delay } as any} />
        </S.ContainerSplash>
      ))}
      <S.ConteudoPlaca>
        <S.IconeContainer><Palette size={80} /><S.BadgeArtista><Brush size={30} /></S.BadgeArtista></S.IconeContainer>
        <S.Titulo>OBRA-PRIMA!</S.Titulo>
        <S.Mensagem>Você misturou as tintas como um profissional! O modelo ficou idêntico e o festival está radiante.</S.Mensagem>
        <S.ContainerBotoes>
          <S.BotaoAcao onClick={aoReiniciar} $isFocused={modoOcular && podeInteragirOcular && botaoFocado === 'reiniciar'}><RotateCcw size={20} /> NOVO DESENHO</S.BotaoAcao>
          <S.BotaoAcao onClick={() => navigate('/jogos')} $isFocused={modoOcular && podeInteragirOcular && botaoFocado === 'menu'}><Home size={20} /> MENU</S.BotaoAcao>
        </S.ContainerBotoes>
      </S.ConteudoPlaca>
    </S.FundoVitoria>
  );
};

export default TelaVitoriaFestivalCores;