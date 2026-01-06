import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as S from './styles';
import { Medal, ChevronRight, Home, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'zustand'; 
import { lojaOlho } from '../../../lojas/lojaOlho';
import { useLeitorOcular } from '../../../hooks/useLeitorOcular';
import { pararNarracao } from '../../../servicos/acessibilidade';

const CORES_FOGOS = ['#22d3ee', '#f97316', '#ffffff', '#fb923c'];
const NUMERO_FOGOS = 12;
const PARTICULAS_POR_FOGO = 10;

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
  const { estaPiscando, mostrarCameraFlutuante, leitorAtivo } = useStore(lojaOlho);
  const [dadosDosFogos, setDadosDosFogos] = useState<DadosFogos[]>([]);
  const [botaoFocado, setBotaoFocado] = useState<BotaoFoco>('reiniciar');
  const [podeInteragirOcular, setPodeInteragirOcular] = useState(false);
  const [introConcluida, setIntroConcluida] = useState(false);
  
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- LÓGICA DE TEXTO ---
  const obterTextoParaLeitura = useCallback(() => {
    if (!leitorAtivo) return null;
    if (!introConcluida) {
      return "Missão Cumprida. Excelente trabalho, Comandante. Você catalogou todo o Sistema Solar na ordem correta. A galáxia está segura.";
    }
    if (botaoFocado === 'reiniciar') return "Jogar novamente.";
    if (botaoFocado === 'outroJogo') return "Voltar para o menu de jogos.";
    return null;
  }, [introConcluida, botaoFocado, leitorAtivo]);

  // --- CONTROLE DE LIBERAÇÃO E SCANNER ---
  useEffect(() => {
    if (!mostrarCameraFlutuante) {
      setPodeInteragirOcular(true);
      return;
    }

    setPodeInteragirOcular(false);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!leitorAtivo) {
      // Sem leitor: espera 2s para liberar e começar a alternar
      timerRef.current = setTimeout(() => {
        setPodeInteragirOcular(true);
        setIntroConcluida(true);
      }, 2000);
    }
  }, [mostrarCameraFlutuante, leitorAtivo, botaoFocado]);

  // Scanner Ocular: Só alterna se a câmera estiver ativa
  useEffect(() => {
    if (mostrarCameraFlutuante && podeInteragirOcular && introConcluida) {
      const interval = setInterval(() => {
        setBotaoFocado(prev => prev === 'reiniciar' ? 'outroJogo' : 'reiniciar');
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [mostrarCameraFlutuante, podeInteragirOcular, introConcluida]);

  const lidarComFimDaLeitura = useCallback(() => {
    if (mostrarCameraFlutuante) {
      if (!introConcluida) setIntroConcluida(true);
      setPodeInteragirOcular(true);
    }
  }, [mostrarCameraFlutuante, introConcluida]);

  useLeitorOcular(obterTextoParaLeitura(), [introConcluida, botaoFocado], lidarComFimDaLeitura);

  const confirmarAcao = useCallback(() => {
    pararNarracao();
    if (botaoFocado === 'reiniciar') aoReiniciar();
    else navigate('/jogos');
  }, [botaoFocado, aoReiniciar, navigate]);

  // Efeito Piscada
  useEffect(() => {
    if (estaPiscando && mostrarCameraFlutuante && podeInteragirOcular) {
      setPodeInteragirOcular(false);
      confirmarAcao();
    }
  }, [estaPiscando, mostrarCameraFlutuante, podeInteragirOcular, confirmarAcao]);

  // Efeito Fogos
  useEffect(() => {
    const dados: DadosFogos[] = Array.from({ length: NUMERO_FOGOS }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
      cor: CORES_FOGOS[Math.floor(Math.random() * CORES_FOGOS.length)],
      delay: `${Math.random() * 2}s`,
    }));
    setDadosDosFogos(dados);
  }, []);

  const fVisual = mostrarCameraFlutuante && podeInteragirOcular;

  return (
    <S.FundoVitoria>
      {dadosDosFogos.map(fogo => (
        <S.ContainerFogos key={fogo.id} style={{ top: fogo.top, left: fogo.left }}>
          {Array.from({ length: PARTICULAS_POR_FOGO }).map((_, index) => (
            <S.ParticulaFogos key={index} style={{ '--color': fogo.cor, '--delay': fogo.delay } as any} />
          ))}
        </S.ContainerFogos>
      ))}

      <S.ConteudoVitoria>
        <S.IconeContainer>
          <Medal size={80} />
        </S.IconeContainer>
        
        <S.TituloVitoria>MISSÃO CUMPRIDA</S.TituloVitoria>
        
        <S.MensagemVitoria>
          Excelente trabalho, Comandante. Você catalogou todo o Sistema Solar na ordem correta.
          A galáxia está segura graças a você.
        </S.MensagemVitoria>
        
        <S.ContainerBotoes>
          <S.BotaoVitoria 
            onClick={() => { setBotaoFocado('reiniciar'); confirmarAcao(); }}
            $isFocused={fVisual && botaoFocado === 'reiniciar'} 
          >
            <RotateCcw size={20} /> JOGAR DE NOVO
          </S.BotaoVitoria>

          <S.BotaoVitoria 
            onClick={() => { setBotaoFocado('outroJogo'); confirmarAcao(); }}
            $isFocused={fVisual && botaoFocado === 'outroJogo'} 
          >
            <Home size={20} /> MENU DE JOGOS
          </S.BotaoVitoria>
        </S.ContainerBotoes>
      </S.ConteudoVitoria>
    </S.FundoVitoria>
  );
};

export default TelaVitoria;