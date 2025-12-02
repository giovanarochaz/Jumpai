import React, { useState, useEffect, useRef } from 'react';
import * as S from './styles';
import { Medal } from 'lucide-react'; // Ícones temáticos
import { useNavigate } from 'react-router-dom';
import { useStore } from 'zustand'; 
import { lojaOlho } from '../../../lojas/lojaOlho';

// Cores mais vibrantes e neon para o espaço
const CORES_FOGOS = ['#fbbf24', '#a855f7', '#3b82f6', '#ec4899', '#ffffff'];
const NUMERO_FOGOS = 12;
const PARTICULAS_POR_FOGO = 12;

interface DadosFogos {
  id: number;
  top: string;
  left: string;
  cor: string;
  delay: string;
}

interface TelaVitoriaProps {
  aoReiniciar: () => void;
}

type BotaoFoco = 'reiniciar' | 'outroJogo' | null;
const BOTOES_ORDEM: BotaoFoco[] = ['reiniciar', 'outroJogo'];
const TEMPO_FOCO_MS = 1500;
const COOLDOWN_CLIQUE_MS = 800;

const TelaVitoria: React.FC<TelaVitoriaProps> = ({ aoReiniciar }) => {
  const { estaPiscando } = useStore(lojaOlho);
  const [dadosDosFogos, setDadosDosFogos] = useState<DadosFogos[]>([]);
  const [botaoFocado, setBotaoFocado] = useState<BotaoFoco>('reiniciar');
  const [bloquearClique, setBloquearClique] = useState(false);
  
  const focoTimerRef = useRef<number | null>(null);
  const navigate = useNavigate();

  // --- LÓGICA DE AÇÃO ---
  const executarAcaoFocada = () => {
    if (botaoFocado === 'reiniciar') {
      aoReiniciar();
    } else if (botaoFocado === 'outroJogo') {
      navigate('/jogos/teclado');
    }
  };

  // --- EFEITO 1: Geração de Fogos ---
  useEffect(() => {
    const dados: DadosFogos[] = [];
    for (let i = 0; i < NUMERO_FOGOS; i++) {
      dados.push({
        id: i,
        top: `${Math.random() * 90 + 5}%`,
        left: `${Math.random() * 90 + 5}%`,
        cor: CORES_FOGOS[Math.floor(Math.random() * CORES_FOGOS.length)],
        delay: `${Math.random() * 2}s`,
      });
    }
    setDadosDosFogos(dados);
    return () => { if (focoTimerRef.current) clearInterval(focoTimerRef.current); };
  }, []);

  // --- EFEITO 2: Foco Automático ---
  useEffect(() => {
    const alternarFoco = () => {
      setBotaoFocado(prev => BOTOES_ORDEM[(BOTOES_ORDEM.indexOf(prev) + 1) % BOTOES_ORDEM.length]);
    };
    focoTimerRef.current = setInterval(alternarFoco, TEMPO_FOCO_MS) as unknown as number;
    return () => { if (focoTimerRef.current) clearInterval(focoTimerRef.current); };
  }, []);

  // --- EFEITO 3: Controle Ocular ---
  useEffect(() => {
    if (!estaPiscando || bloquearClique || !botaoFocado) return;

    setBloquearClique(true);
    executarAcaoFocada();
    
    if (focoTimerRef.current) clearInterval(focoTimerRef.current);
    
    setTimeout(() => {
        focoTimerRef.current = setInterval(() => {
            setBotaoFocado(prev => BOTOES_ORDEM[(BOTOES_ORDEM.indexOf(prev) + 1) % BOTOES_ORDEM.length]);
        }, TEMPO_FOCO_MS) as unknown as number;
        setBloquearClique(false);
    }, COOLDOWN_CLIQUE_MS);
    
  }, [estaPiscando, bloquearClique, botaoFocado]);

  // --- EFEITO 4: Teclado ---
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && botaoFocado) {
        if (focoTimerRef.current) clearInterval(focoTimerRef.current);
        executarAcaoFocada();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [botaoFocado]);


  return (
    <S.FundoVitoria>
      {/* Explosões Espaciais */}
      {dadosDosFogos.map(fogo => (
        <S.ContainerFogos
          key={fogo.id}
          style={{ '--top': fogo.top, '--left': fogo.left } as React.CSSProperties}
        >
          {Array.from({ length: PARTICULAS_POR_FOGO }).map((_, index) => (
            <S.ParticulaFogos
              key={index}
              style={{ '--color': fogo.cor, '--delay': fogo.delay } as React.CSSProperties}
            />
          ))}
        </S.ContainerFogos>
      ))}

      <S.ConteudoVitoria>
        <S.IconeContainer>
           {/* Ícone de Medalha Espacial */}
          <S.IconeTrofeu>
            <Medal size={100} strokeWidth={1.5} />
          </S.IconeTrofeu>
        </S.IconeContainer>
        
        <S.TituloVitoria>MISSÃO CUMPRIDA!</S.TituloVitoria>
        
        <S.MensagemVitoria>
          Excelente trabalho, Comandante! Você catalogou todo o Sistema Solar na ordem correta. <br/><br/>
          <strong>A galáxia está segura graças a você!</strong>
        </S.MensagemVitoria>
        
        <S.ContainerBotoes>
          <S.BotaoVitoria 
            onClick={executarAcaoFocada}
            $focado={botaoFocado === 'reiniciar'} 
          >
            Nova Decolagem
          </S.BotaoVitoria>
          <S.BotaoVitoria 
            onClick={executarAcaoFocada}
            $focado={botaoFocado === 'outroJogo'} 
          >
            Base de Missões
          </S.BotaoVitoria>
        </S.ContainerBotoes>
      </S.ConteudoVitoria>
    </S.FundoVitoria>
  );
};

export default TelaVitoria;