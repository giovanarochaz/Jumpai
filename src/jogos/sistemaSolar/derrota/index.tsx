import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as S from './styles';
import { ShieldX, RotateCcw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';
import { useLeitorOcular } from '../../../hooks/useLeitorOcular';
import { pararNarracao } from '../../../servicos/acessibilidade';
import type { ConfiguracoesJogo } from '../../../interface/types';

interface TelaDerrotaSistemaSolarProps {
  aoReiniciar: () => void;
  configuracoes: ConfiguracoesJogo;
}

const CORES_DETRITOS = ['#94a3b8', '#f97316', '#ef4444', '#1e293b'];
const NUMERO_DETRITOS = 15;

const TelaDerrotaSistemaSolar: React.FC<TelaDerrotaSistemaSolarProps> = ({ aoReiniciar, configuracoes }) => {
  const { estaPiscando, mostrarCameraFlutuante: modoOcular, leitorAtivo } = useStore(lojaOlho);
  const navigate = useNavigate();

  const [detritos, setDetritos] = useState<any[]>([]);
  const [botaoFocado, setBotaoFocado] = useState<'reiniciar' | 'menu'>('reiniciar');
  const [podeInteragirOcular, setPodeInteragirOcular] = useState(false);
  
  const timerDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const timerScanRef = useRef<NodeJS.Timeout | null>(null);
  const piscadaProcessadaRef = useRef(false);

  useEffect(() => {
    if (!modoOcular) { setPodeInteragirOcular(true); return; }
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

      audio.play().catch(erro => {
        console.warn("O navegador bloqueou o áudio ou o arquivo não foi encontrado:", erro);
      });

      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
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
    else irParaMenu();
  }, [botaoFocado, tentarNovamente, irParaMenu]);

  const textoParaLeitura = useMemo(() => {
    if (!leitorAtivo) return null;
    if (!podeInteragirOcular) return "Falha na Missão. Tivemos um problema. Deseja reiniciar ou sair?";
    return botaoFocado === 'reiniciar' ? "Reiniciar missão." : "Voltar para o menu de jogos.";
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
    setDetritos(Array.from({ length: NUMERO_DETRITOS }).map((_, i) => ({
      id: i, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`, size: `${Math.random() * 15 + 5}px`,
      cor: CORES_DETRITOS[Math.floor(Math.random() * CORES_DETRITOS.length)],
    })));
  }, []);

  return (
    <S.FundoDerrota>
      <S.LuzEmergencia />
      {detritos.map(d => (
        <S.Detrito key={d.id} style={{ top: d.top, left: d.left, backgroundColor: d.cor, width: d.size, height: d.size, animationDelay: d.delay } as any} />
      ))}
      <S.ConteudoDerrota>
        <S.IconeContainer><ShieldX size={80} /></S.IconeContainer>
        <S.TituloDerrota>FALHA NA MISSÃO</S.TituloDerrota>
        <S.MensagemDerrota>A nave sofreu danos críticos. Deseja reiniciar os sistemas?</S.MensagemDerrota>
        
        <S.ContainerBotoes>
          <S.BotaoDerrota 
            onClick={tentarNovamente} 
            $isFocused={modoOcular && podeInteragirOcular && botaoFocado === 'reiniciar'}
          >
            <RotateCcw size={20} /> REINICIAR
          </S.BotaoDerrota>

          <S.BotaoDerrota 
            onClick={irParaMenu} 
            $isFocused={modoOcular && podeInteragirOcular && botaoFocado === 'menu'}
          >
            <Home size={20} /> MENU
          </S.BotaoDerrota>
        </S.ContainerBotoes>
      </S.ConteudoDerrota>
    </S.FundoDerrota>
  );
};

export default TelaDerrotaSistemaSolar;