import React, { useState, useEffect, useCallback } from 'react';
import * as S from './styles';
import { Medal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'zustand'; 
import { lojaOlho } from '../../../lojas/lojaOlho';
import { useLeitorOcular } from '../../../hooks/useLeitorOcular';
import { pararNarracao } from '../../../servicos/acessibilidade';

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

type BotaoFoco = 'reiniciar' | 'outroJogo';
const BOTOES_ORDEM: BotaoFoco[] = ['reiniciar', 'outroJogo'];

const TelaVitoria: React.FC<TelaVitoriaProps> = ({ aoReiniciar }) => {
  const { estaPiscando, mostrarCameraFlutuante } = useStore(lojaOlho);
  const [dadosDosFogos, setDadosDosFogos] = useState<DadosFogos[]>([]);
  const [botaoFocado, setBotaoFocado] = useState<BotaoFoco>('reiniciar');
  const [bloquearPiscada, setBloquearPiscada] = useState(true);
  const [introConcluida, setIntroConcluida] = useState(false);
  
  const navigate = useNavigate();

  // --- LÓGICA DE TEXTO PARA O LEITOR ---
  const obterTextoParaLeitura = useCallback(() => {
    // 1. Primeiro lê a mensagem de vitória
    if (!introConcluida) {
      return "Missão Cumprida! Excelente trabalho, Comandante! Você catalogou todo o Sistema Solar na ordem correta. A galáxia está segura graças a você!";
    }
    // 2. Depois lê o botão que está focado no momento
    if (botaoFocado === 'reiniciar') {
      return "Botão: Nova Decolagem. Pisque para jogar este jogo de novo.";
    }
    if (botaoFocado === 'outroJogo') {
      return "Botão: Base de Missões. Pisque para escolher um desafio diferente.";
    }
    return null;
  }, [introConcluida, botaoFocado]);

  // --- SINCRONIA VOZ + FOCO ---
  const lidarComFimDaLeitura = useCallback(() => {
    if (!mostrarCameraFlutuante) return;

    if (!introConcluida) {
      // Terminou de ler a intro, agora libera os botões
      setIntroConcluida(true);
      setBloquearPiscada(false);
    } else {
      // Se já terminou a intro, alterna o foco entre os botões após a leitura
      setBloquearPiscada(false);
      setTimeout(() => {
        setBotaoFocado(prev => {
          const proximoIndex = (BOTOES_ORDEM.indexOf(prev) + 1) % BOTOES_ORDEM.length;
          return BOTOES_ORDEM[proximoIndex];
        });
      }, 1500); // Pausa para o usuário decidir se pisca
    }
  }, [introConcluida, mostrarCameraFlutuante]);

  // Ativa o leitor automático
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

  // --- EFEITO: Geração de Fogos ---
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
  }, []);

  // --- EFEITO: Controle Ocular (Piscada) ---
  useEffect(() => {
    if (!estaPiscando || bloquearPiscada || !mostrarCameraFlutuante) return;

    executarAcaoFocada();
  }, [estaPiscando, bloquearPiscada, mostrarCameraFlutuante, executarAcaoFocada]);

  // --- EFEITO: Teclado (Enter) ---
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        executarAcaoFocada();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executarAcaoFocada]);


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
            onClick={() => { setBotaoFocado('reiniciar'); executarAcaoFocada(); }}
            $focado={botaoFocado === 'reiniciar'} 
          >
            Nova Decolagem
          </S.BotaoVitoria>
          <S.BotaoVitoria 
            onClick={() => { setBotaoFocado('outroJogo'); executarAcaoFocada(); }}
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