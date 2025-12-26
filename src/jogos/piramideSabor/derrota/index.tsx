import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as S from './styles';
import { ShieldAlert } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';
import { useLeitorOcular } from '../../../hooks/useLeitorOcular';
import { pararNarracao } from '../../../servicos/acessibilidade';

const NUMERO_SPLATTERS = 15;
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

type BotaoFoco = 'reiniciar' | 'outroJogo';
const BOTOES_ORDEM: BotaoFoco[] = ['reiniciar', 'outroJogo'];

const TelaDerrotaPiramideSabor: React.FC<TelaDerrotaPiramideSaborProps> = ({ aoReiniciar }) => {
  const { estaPiscando, mostrarCameraFlutuante } = useStore(lojaOlho);
  const [dadosDoSplatters, setDadosDoSplatters] = useState<DadosSplatter[]>([]);
  const [botaoFocado, setBotaoFocado] = useState<BotaoFoco>('reiniciar');
  const [bloquearPiscada, setBloquearPiscada] = useState(true);
  const [introConcluida, setIntroConcluida] = useState(false);
  
  const somDerrotaRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  // --- LÓGICA DE TEXTO PARA O LEITOR ---
  const obterTextoParaLeitura = useCallback(() => {
    if (!introConcluida) {
      return "Pedido Rejeitado! Ops! Esse pedido ficou uma bagunça ou você pegou o que não devia. Vamos limpar tudo e tentar de novo?";
    }
    if (botaoFocado === 'reiniciar') {
      return "Botão: Tentar de Novo. Pisque para limpar a cozinha e recomeçar a receita.";
    }
    if (botaoFocado === 'outroJogo') {
      return "Botão: Sair da Cozinha. Pisque para escolher outro desafio.";
    }
    return null;
  }, [introConcluida, botaoFocado]);

  // --- SINCRONIA VOZ + FOCO ---
  const lidarComFimDaLeitura = useCallback(() => {
    if (!mostrarCameraFlutuante) return;

    if (!introConcluida) {
      // Após ler a mensagem de erro, permite a interação e inicia o ciclo de botões
      setIntroConcluida(true);
      setBloquearPiscada(false);
    } else {
      setBloquearPiscada(false);
      // Aguarda 1.5s após a voz terminar para mudar o foco para o próximo botão
      setTimeout(() => {
        setBotaoFocado(prev => {
          const proximoIndex = (BOTOES_ORDEM.indexOf(prev) + 1) % BOTOES_ORDEM.length;
          return BOTOES_ORDEM[proximoIndex];
        });
      }, 1500);
    }
  }, [introConcluida, mostrarCameraFlutuante]);

  // Hook de leitura automática
  useLeitorOcular(obterTextoParaLeitura(), [introConcluida, botaoFocado], lidarComFimDaLeitura);

  // --- AÇÃO AO SELECIONAR ---
  const executarAcaoFocada = useCallback(() => {
    pararNarracao();
    if (botaoFocado === 'reiniciar') {
      aoReiniciar();
    } else if (botaoFocado === 'outroJogo') {
      navigate('/jogos/teclado');
    }
  }, [botaoFocado, aoReiniciar, navigate]);

  // --- EFEITO: Inicialização e Sujeira ---
  useEffect(() => {
    // Som de derrota
    somDerrotaRef.current = new Audio('/assets/piramideSabor/sounds/derrota.mp3');
    somDerrotaRef.current.volume = 0.5;
    somDerrotaRef.current.play().catch(e => console.log("Erro som:", e));

    // Gerar manchas de sujeira
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

    return () => pararNarracao();
  }, []);

  // --- EFEITO: Controle Ocular (Piscada) ---
  useEffect(() => {
    if (!estaPiscando || bloquearPiscada || !mostrarCameraFlutuante) return;
    executarAcaoFocada();
  }, [estaPiscando, bloquearPiscada, mostrarCameraFlutuante, executarAcaoFocada]);

  // --- EFEITO: Teclado (Enter) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        executarAcaoFocada();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executarAcaoFocada]);

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
          <ShieldAlert size={80} strokeWidth={2} />
        </S.IconeDerrota>
        
        <S.TituloDerrota>REJEITADO</S.TituloDerrota>
        
        <S.MensagemDerrota>
          Ops! Esse pedido ficou uma bagunça ou você pegou o que não devia. <br/>
          <strong>Vamos limpar tudo e tentar de novo?</strong>
        </S.MensagemDerrota>
        
        <S.ContainerBotoes>
          <S.BotaoDerrota 
            onClick={() => { setBotaoFocado('reiniciar'); executarAcaoFocada(); }}
            $focado={botaoFocado === 'reiniciar'} 
          >
            Tentar de Novo
          </S.BotaoDerrota>
          <S.BotaoDerrota 
            onClick={() => { setBotaoFocado('outroJogo'); executarAcaoFocada(); }}
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