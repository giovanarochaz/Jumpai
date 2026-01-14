import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as S from './styles';
import { Waves, RotateCcw, Home } from 'lucide-react';
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

const CORES_AGUA = ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'];
const NUMERO_GOTAS = 20;

const TelaDerrotaSalto: React.FC<TelaDerrotaProps> = ({ aoReiniciar, configuracoes }) => {
  const { estaPiscando, mostrarCameraFlutuante: modoOcular, leitorAtivo } = useStore(lojaOlho);
  const navigate = useNavigate();

  const [gotas, setGotas] = useState<any[]>([]);
  const [botaoFocado, setBotaoFocado] = useState<'reiniciar' | 'menu' | null>(null);
  const [podeInteragirOcular, setPodeInteragirOcular] = useState(false);
  
  const timerDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const timerScanRef = useRef<NodeJS.Timeout | null>(null);
  const piscadaProcessadaRef = useRef(false);

  // Inicializa o foco no modo ocular
  useEffect(() => {
    if (modoOcular) setBotaoFocado('reiniciar');
    else setBotaoFocado(null);
  }, [modoOcular]);

  // Debounce para esperar o leitor de tela
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

  // Ciclo de scanning de botões
  useEffect(() => {
    if (modoOcular && podeInteragirOcular) {
      timerScanRef.current = setInterval(() => {
        setBotaoFocado(prev => prev === 'reiniciar' ? 'menu' : 'reiniciar');
      }, 3500);
    }
    return () => { if (timerScanRef.current) clearInterval(timerScanRef.current); };
  }, [modoOcular, podeInteragirOcular]);

  // Áudio de erro
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

  // Texto para o leitor de tela
  const textoParaLeitura = useMemo(() => {
    if (!leitorAtivo) return null;
    if (!podeInteragirOcular) return "Ops! O sapinho escorregou e caiu na água. Vamos tentar atravessar a lagoa de novo?";
    return botaoFocado === 'reiniciar' 
      ? "Tentar novamente!" 
      : "Voltar para o menu!";
  }, [leitorAtivo, podeInteragirOcular, botaoFocado]);

  useLeitorOcular(textoParaLeitura, [textoParaLeitura], () => {
    if (modoOcular && leitorAtivo) setPodeInteragirOcular(true);
  });

  // Listener de piscada
  useEffect(() => {
    if (!estaPiscando) { piscadaProcessadaRef.current = false; return; }
    if (estaPiscando && modoOcular && podeInteragirOcular && !piscadaProcessadaRef.current) {
      piscadaProcessadaRef.current = true;
      setPodeInteragirOcular(false);
      confirmarAcao();
    }
  }, [estaPiscando, modoOcular, podeInteragirOcular, confirmarAcao]);

  // Gerar partículas de gotas d'água
  useEffect(() => {
    setGotas(Array.from({ length: NUMERO_GOTAS }).map((_, i) => ({
      id: i, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`, size: `${Math.random() * 10 + 5}px`,
      cor: CORES_AGUA[Math.floor(Math.random() * CORES_AGUA.length)],
    })));
  }, []);

  const visualOcularAtivo = modoOcular && podeInteragirOcular;

  return (
    <S.FundoDerrota>
      <S.SinalAlertaLagoa />
      {gotas.map(g => (
        <S.GotaAgua 
          key={g.id} 
          style={{ 
            top: g.top, 
            left: g.left, 
            backgroundColor: g.cor, 
            width: g.size, 
            height: g.size, 
            animationDelay: g.delay 
          } as any} 
        />
      ))}
      <S.ConteudoDerrota>
        <S.IconeContainer><Waves size={80} /></S.IconeContainer>
        <S.TituloDerrota>PLUFT! CAIU NA ÁGUA</S.TituloDerrota>
        <S.MensagemDerrota>
          A vitória-régia afundou! Que tal tentar de novo e ajudar o sapinho a chegar do outro lado?
        </S.MensagemDerrota>
        
        <S.ContainerBotoes>
          <S.BotaoDerrota 
            onClick={() => { setBotaoFocado('reiniciar'); tentarNovamente(); }} 
            $isFocused={visualOcularAtivo && botaoFocado === 'reiniciar'}
          >
            <RotateCcw size={20} /> TENTAR DE NOVO
          </S.BotaoDerrota>

          <S.BotaoDerrota 
            onClick={() => { setBotaoFocado('menu'); irParaMenu(); }} 
            $isFocused={visualOcularAtivo && botaoFocado === 'menu'}
          >
            <Home size={20} /> SAIR
          </S.BotaoDerrota>
        </S.ContainerBotoes>
      </S.ConteudoDerrota>
    </S.FundoDerrota>
  );
};

export default TelaDerrotaSalto;