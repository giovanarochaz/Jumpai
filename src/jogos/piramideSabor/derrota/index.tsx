import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as S from './styles';
import { ShieldAlert } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';

const NUMERO_SPLATTERS = 15;

// ATUALIZAÇÃO DAS CORES:
// 1. Ketchup (Vermelho)
// 2. Mostarda (Agora bem Amarela)
// 3. Queimado (Marrom escuro)
// 4. Maionese (Novo - Creme claro)
const CORES_SUJEIRA = ['#ef4444', '#facc15', '#451a03', '#fefce8'];

interface DadosSplatter {
  id: number;
  top: string;
  left: string;
  delay: string;
  size: string;
  cor: string;
  r1: string; r2: string; r3: string; r4: string;
  r5: string; r6: string; r7: string; r8: string;
}

interface TelaDerrotaPiramideSaborProps {
  aoReiniciar: () => void;
}

type BotaoFoco = 'reiniciar' | 'outroJogo' | null;
const BOTOES_ORDEM: BotaoFoco[] = ['reiniciar', 'outroJogo'];
const TEMPO_FOCO_MS = 1500;
const COOLDOWN_CLIQUE_MS = 800;

const TelaDerrotaPiramideSabor: React.FC<TelaDerrotaPiramideSaborProps> = ({ aoReiniciar }) => {
  const { estaPiscando } = useStore(lojaOlho);
  const [dadosDoSplatters, setDadosDoSplatters] = useState<DadosSplatter[]>([]);
  const [botaoFocado, setBotaoFocado] = useState<BotaoFoco>('reiniciar');
  const [bloquearClique, setBloquearClique] = useState(false);
  
  const focoTimerRef = useRef<number | null>(null);
  const somDerrotaRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  const executarAcaoFocada = useCallback(() => {
    if (botaoFocado === 'reiniciar') {
      aoReiniciar();
    } else if (botaoFocado === 'outroJogo') {
      navigate('/jogos/teclado');
    }
  }, [botaoFocado, aoReiniciar, navigate]);

  useEffect(() => {
    somDerrotaRef.current = new Audio('/assets/piramideSabor/sounds/derrota.mp3');
    somDerrotaRef.current.volume = 0.5;
    somDerrotaRef.current.play().catch(e => console.log("Erro som:", e));

    const dados: DadosSplatter[] = [];
    for (let i = 0; i < NUMERO_SPLATTERS; i++) {
      const r = (min: number, max: number) => `${Math.floor(Math.random() * (max - min + 1) + min)}%`;
      
      dados.push({
        id: i,
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`,
        delay: `${Math.random() * 0.8}s`,
        size: `${60 + Math.random() * 100}px`,
        cor: CORES_SUJEIRA[Math.floor(Math.random() * CORES_SUJEIRA.length)],
        r1: r(30, 70), r2: r(30, 70), r3: r(30, 70), r4: r(30, 70),
        r5: r(30, 70), r6: r(30, 70), r7: r(30, 70), r8: r(30, 70),
      });
    }
    setDadosDoSplatters(dados);
  }, []);

  useEffect(() => {
    const alternarFoco = () => {
      setBotaoFocado(prev => BOTOES_ORDEM[(BOTOES_ORDEM.indexOf(prev) + 1) % BOTOES_ORDEM.length]);
    };
    focoTimerRef.current = setInterval(alternarFoco, TEMPO_FOCO_MS) as unknown as number;
    return () => { if (focoTimerRef.current) clearInterval(focoTimerRef.current); };
  }, []);

  useEffect(() => {
    if (!estaPiscando || bloquearClique || !botaoFocado) return;
    setBloquearClique(true);
    executarAcaoFocada();
    if (focoTimerRef.current) clearInterval(focoTimerRef.current);
    
    const timer = setTimeout(() => {
      const newTimer = setInterval(() => setBotaoFocado(prev => BOTOES_ORDEM[(BOTOES_ORDEM.indexOf(prev) + 1) % BOTOES_ORDEM.length]), TEMPO_FOCO_MS);
      focoTimerRef.current = newTimer as unknown as number;
      setBloquearClique(false);
    }, COOLDOWN_CLIQUE_MS);
    return () => clearTimeout(timer);
  }, [estaPiscando, bloquearClique, botaoFocado, executarAcaoFocada]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && botaoFocado) {
        if (focoTimerRef.current) clearInterval(focoTimerRef.current);
        executarAcaoFocada();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [botaoFocado, executarAcaoFocada]);

  return (
    <S.FundoDerrota>
      {dadosDoSplatters.map(splatter => (
        <S.Splatter
          key={splatter.id}
          $cor={splatter.cor}
          style={{
            '--top': splatter.top,
            '--left': splatter.left,
            '--delay': splatter.delay,
            '--size': splatter.size,
            '--r1': splatter.r1, '--r2': splatter.r2, '--r3': splatter.r3, '--r4': splatter.r4,
            '--r5': splatter.r5, '--r6': splatter.r6, '--r7': splatter.r7, '--r8': splatter.r8,
          } as React.CSSProperties}
        />
      ))}

      <S.ConteudoDerrota>
        <S.IconeDerrota>
          {/* A cor do ícone SVG agora será herdada (branca) */}
          <ShieldAlert size={80} strokeWidth={2} />
        </S.IconeDerrota>
        
        <S.TituloDerrota>REJEITADO</S.TituloDerrota>
        
        <S.MensagemDerrota>
          Ops! Esse pedido ficou uma bagunça ou você pegou o que não devia. <br/>
          <strong>Vamos limpar tudo e tentar de novo?</strong>
        </S.MensagemDerrota>
        
        <S.ContainerBotoes>
          <S.BotaoDerrota 
            onClick={() => aoReiniciar()}
            $focado={botaoFocado === 'reiniciar'} 
          >
            Tentar de Novo
          </S.BotaoDerrota>
          <S.BotaoDerrota 
            onClick={() => navigate('/jogos/teclado')}
            $focado={botaoFocado === 'outroJogo'} 
          >
            Sair da Cozinha
          </S.BotaoDerrota>
        </S.ContainerBotoes>
      </S.ConteudoDerrota>
    </S.FundoDerrota>
  );
};

export default TelaDerrotaPiramideSabor;