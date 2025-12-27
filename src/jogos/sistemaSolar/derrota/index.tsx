import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as S from './styles';
import { ShieldX } from 'lucide-react'; // Ícones de Alerta/Escudo Quebrado
import { useNavigate } from 'react-router-dom';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';

// Cores para os destroços (Cinza metal, Laranja fogo, Marrom rocha)
const CORES_DETRITOS = ['#94a3b8', '#fdba74', '#78350f', '#ef4444'];
const NUMERO_DETRITOS = 18;

interface DadosDetrito {
  id: number;
  top: string;
  left: string;
  delay: string;
  size: string;
  cor: string;
  rotacao: string;
  formato: string; 
}

interface TelaDerrotaSistemaSolarProps {
  aoReiniciar: () => void;
}

type BotaoFoco = 'reiniciar' | 'outroJogo' | null;
const BOTOES_ORDEM: BotaoFoco[] = ['reiniciar', 'outroJogo'];
const TEMPO_FOCO_MS = 1500;
const COOLDOWN_CLIQUE_MS = 800;

const TelaDerrotaSistemaSolar: React.FC<TelaDerrotaSistemaSolarProps> = ({ aoReiniciar }) => {
  const { estaPiscando } = useStore(lojaOlho);
  const [detritos, setDetritos] = useState<DadosDetrito[]>([]);
  const [botaoFocado, setBotaoFocado] = useState<BotaoFoco>('reiniciar');
  const [bloquearClique, setBloquearClique] = useState(false);
  
  const focoTimerRef = useRef<number | null>(null);
  const somDerrotaRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  const executarAcaoFocada = useCallback(() => {
    if (botaoFocado === 'reiniciar') {
      aoReiniciar();
    } else if (botaoFocado === 'outroJogo') {
      navigate('/jogos');
    }
  }, [botaoFocado, aoReiniciar, navigate]);

  // EFEITO 1: Som e Geração de Destroços
  useEffect(() => {
    somDerrotaRef.current = new Audio('/assets/sistemaSolar/sounds/gameover.mp3'); // Ajuste o caminho se necessário
    somDerrotaRef.current.volume = 0.6;
    somDerrotaRef.current.play().catch(e => console.log("Erro som:", e));

    const dados: DadosDetrito[] = [];
    for (let i = 0; i < NUMERO_DETRITOS; i++) {
      dados.push({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2}s`,
        size: `${Math.random() * 20 + 5}px`, // Tamanhos variados
        cor: CORES_DETRITOS[Math.floor(Math.random() * CORES_DETRITOS.length)],
        rotacao: `${Math.random() * 360}deg`,
        formato: Math.random() > 0.5 ? '50%' : '2px', // Mistura rochas e pedaços de nave
      });
    }
    setDetritos(dados);
  }, []);

  // EFEITO 2: Foco Automático (Ciclo)
  useEffect(() => {
    const alternarFoco = () => {
      setBotaoFocado(prev => BOTOES_ORDEM[(BOTOES_ORDEM.indexOf(prev) + 1) % BOTOES_ORDEM.length]);
    };
    focoTimerRef.current = setInterval(alternarFoco, TEMPO_FOCO_MS) as unknown as number;
    return () => { if (focoTimerRef.current) clearInterval(focoTimerRef.current); };
  }, []);

  // EFEITO 3: Clique por Piscada
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

  // EFEITO 4: Teclado
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
      {/* Camada de luz de emergência piscando */}
      <S.LuzEmergencia />

      {/* Partículas de destroços flutuando */}
      {detritos.map(d => (
        <S.Detrito
          key={d.id}
          style={{
            '--top': d.top,
            '--left': d.left,
            '--delay': d.delay,
            '--size': d.size,
            '--cor': d.cor,
            '--rotacao': d.rotacao,
            '--radius': d.formato
          } as React.CSSProperties}
        />
      ))}

      <S.ConteudoDerrota>
        <S.IconeContainer>
          <S.IconeAlerta>
            <ShieldX size={80} strokeWidth={2} />
          </S.IconeAlerta>
          <div className="icone-sombra" />
        </S.IconeContainer>
        
        <S.TituloDerrota>FALHA NA MISSÃO</S.TituloDerrota>
        
        <S.MensagemDerrota>
          Houston, temos um problema! A nave sofreu danos ou a rota foi perdida. <br/>
          <strong>Reiniciar sistemas e tentar novamente?</strong>
        </S.MensagemDerrota>
        
        <S.ContainerBotoes>
          <S.BotaoDerrota 
            onClick={() => aoReiniciar()}
            $focado={botaoFocado === 'reiniciar'} 
          >
            Nova Decolagem
          </S.BotaoDerrota>
          <S.BotaoDerrota 
            onClick={() => navigate('/jogos')}
            $focado={botaoFocado === 'outroJogo'} 
          >
            Abortar Missão
          </S.BotaoDerrota>
        </S.ContainerBotoes>
      </S.ConteudoDerrota>
    </S.FundoDerrota>
  );
};

export default TelaDerrotaSistemaSolar;