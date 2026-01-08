import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as S from './styles';
import { UtensilsCrossed, RotateCcw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';
import { useLeitorOcular } from '../../../hooks/useLeitorOcular';
import { pararNarracao } from '../../../servicos/acessibilidade';
import type { ConfiguracoesJogo } from '../../../interface/types';

interface TelaDerrotaProps {
  aoReiniciar: () => void;
  configuracoes: ConfiguracoesJogo;
}

const CORES_SUJEIRA = ['#78350f', '#ef4444', '#b91c1c', '#4b2e2e'];
const NUMERO_MIGALHAS = 15;

const TelaDerrotaPiramideSabor: React.FC<TelaDerrotaProps> = ({ aoReiniciar, configuracoes }) => {
  const { estaPiscando, mostrarCameraFlutuante: modoOcular, leitorAtivo } = useStore(lojaOlho);
  const navigate = useNavigate();

  const [migalhas, setMigalhas] = useState<any[]>([]);
  const [botaoFocado, setBotaoFocado] = useState<'reiniciar' | 'menu' | null>(null);
  const [podeInteragirOcular, setPodeInteragirOcular] = useState(false);
  
  const timerDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const timerScanRef = useRef<NodeJS.Timeout | null>(null);
  const piscadaProcessadaRef = useRef(false);

  useEffect(() => {
    if (modoOcular) setBotaoFocado('reiniciar');
    else setBotaoFocado(null);
  }, [modoOcular]);

  useEffect(() => {
    if (!modoOcular) {
      setPodeInteragirOcular(true);
      return;
    }
    setPodeInteragirOcular(false);
    if (timerDebounceRef.current) clearTimeout(timerDebounceRef.current);
    if (!leitorAtivo) {
      timerDebounceRef.current = setTimeout(() => setPodeInteragirOcular(true), 1200);
    }
  }, [modoOcular, leitorAtivo]);

  useEffect(() => {
    if (modoOcular && podeInteragirOcular) {
      timerScanRef.current = setInterval(() => {
        setBotaoFocado(prev => prev === 'reiniciar' ? 'menu' : 'reiniciar');
      }, 3500);
    }
    return () => { if (timerScanRef.current) clearInterval(timerScanRef.current); };
  }, [modoOcular, podeInteragirOcular]);

  useEffect(() => {
    if (configuracoes.sons) {
      const audio = new Audio('/assets/efeitos/derrota.mp3');
      audio.play().catch(erro => console.warn("Erro ao carregar áudio:", erro));
      return () => { audio.pause(); audio.currentTime = 0; };
    }
  }, [configuracoes.sons]);

  const irParaMenu = useCallback(() => {
    pararNarracao();
    navigate('/jogos'); 
  }, [navigate]);

  const tentarNovamente = useCallback(() => {
    pararNarracao();
    aoReiniciar(); 
  }, [aoReiniciar]);

  const confirmarAcao = useCallback(() => {
    if (botaoFocado === 'reiniciar') tentarNovamente();
    else if (botaoFocado === 'menu') irParaMenu();
  }, [botaoFocado, tentarNovamente, irParaMenu]);

  const textoParaLeitura = useMemo(() => {
    if (!leitorAtivo) return null;
    if (!podeInteragirOcular) return "Ops, Super Chef! A receita desmoronou e a bancada ficou bagunçada. Vamos tentar de novo?";
    return botaoFocado === 'reiniciar' 
      ? "Preparar um novo lanche. Pisque agora!" 
      : "Sair da cozinha e voltar para o menu. Pisque agora!";
  }, [leitorAtivo, podeInteragirOcular, botaoFocado]);

  useLeitorOcular(textoParaLeitura, [textoParaLeitura], () => {
    if (modoOcular && leitorAtivo) setPodeInteragirOcular(true);
  });

  useEffect(() => {
    if (!estaPiscando) { piscadaProcessadaRef.current = false; return; }
    if (estaPiscando && modoOcular && podeInteragirOcular && !piscadaProcessadaRef.current) {
      piscadaProcessadaRef.current = true;
      setPodeInteragirOcular(false);
      confirmarAcao();
    }
  }, [estaPiscando, modoOcular, podeInteragirOcular, confirmarAcao]);

  useEffect(() => {
    setMigalhas(Array.from({ length: NUMERO_MIGALHAS }).map((_, i) => ({
      id: i, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`, size: `${Math.random() * 15 + 10}px`,
      rotation: `${Math.random() * 360}deg`,
      cor: CORES_SUJEIRA[Math.floor(Math.random() * CORES_SUJEIRA.length)],
    })));
  }, []);

  const visualOcularAtivo = modoOcular && podeInteragirOcular;

  return (
    <S.FundoDerrota>
      <S.SinalAlertaCozinha />
      {migalhas.map(m => (
        <S.MigalhaSujeira key={m.id} style={{ top: m.top, left: m.left, backgroundColor: m.cor, width: m.size, height: m.size, animationDelay: m.delay, transform: `rotate(${m.rotation})` } as any} />
      ))}
      <S.ConteudoDerrota>
        <S.IconeContainer><UtensilsCrossed size={80} /></S.IconeContainer>
        <S.TituloDerrota>RECEITA DESMORONOU!</S.TituloDerrota>
        <S.MensagemDerrota>A bancada está bagunçada! Vamos limpar tudo e tentar o lanche perfeito novamente?</S.MensagemDerrota>
        
        <S.ContainerBotoes>
          <S.BotaoDerrota 
            onClick={() => { setBotaoFocado('reiniciar'); tentarNovamente(); }} 
            $isFocused={visualOcularAtivo && botaoFocado === 'reiniciar'}
          >
            <RotateCcw size={20} /> NOVO LANCHE
          </S.BotaoDerrota>

          <S.BotaoDerrota 
            onClick={() => { setBotaoFocado('menu'); irParaMenu(); }} 
            $isFocused={visualOcularAtivo && botaoFocado === 'menu'}
          >
            <Home size={20} /> MENU
          </S.BotaoDerrota>
        </S.ContainerBotoes>
      </S.ConteudoDerrota>
    </S.FundoDerrota>
  );
};

export default TelaDerrotaPiramideSabor;