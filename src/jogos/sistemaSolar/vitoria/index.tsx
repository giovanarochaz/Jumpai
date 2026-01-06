import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as S from './styles';
import { Medal, Home, RotateCcw } from 'lucide-react';
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

const TelaVitoria: React.FC<TelaVitoriaProps> = ({ aoReiniciar }) => {
  const { estaPiscando, mostrarCameraFlutuante: modoOcular, leitorAtivo } = useStore(lojaOlho);
  const navigate = useNavigate();

  const [dadosDosFogos, setDadosDosFogos] = useState<DadosFogos[]>([]);
  const [botaoFocado, setBotaoFocado] = useState<'reiniciar' | 'menu'>('reiniciar');
  const [podeInteragirOcular, setPodeInteragirOcular] = useState(false);
  
  const timerDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const timerScanRef = useRef<NodeJS.Timeout | null>(null);
  const piscadaProcessadaRef = useRef(false);

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

  const textoParaLeitura = useMemo(() => {
    if (!leitorAtivo) return null;

    if (!podeInteragirOcular) {
      return "Missão Cumprida! Excelente trabalho, Comandante. Você catalogou todo o Sistema Solar. O que deseja fazer agora?";
    }

    return botaoFocado === 'reiniciar' 
      ? "Jogar novamente. Pisque agora para reiniciar a aventura!" 
      : "Voltar para o menu principal. Pisque agora para escolher outro jogo.";
  }, [leitorAtivo, podeInteragirOcular, botaoFocado]);

  useLeitorOcular(textoParaLeitura, [textoParaLeitura], () => {
    if (modoOcular && leitorAtivo) setPodeInteragirOcular(true);
  });

  const confirmarAcao = useCallback(() => {
    pararNarracao();
    if (botaoFocado === 'reiniciar') {
      aoReiniciar(); 
    } else {
      navigate('/jogos'); 
    }
  }, [botaoFocado, aoReiniciar, navigate]);

  useEffect(() => {
    if (!estaPiscando) {
      piscadaProcessadaRef.current = false;
      return;
    }

    if (estaPiscando && modoOcular && podeInteragirOcular && !piscadaProcessadaRef.current) {
      piscadaProcessadaRef.current = true;
      setPodeInteragirOcular(false);
      confirmarAcao();
    }
  }, [estaPiscando, modoOcular, podeInteragirOcular, confirmarAcao]);

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

  const visualOcularAtivo = modoOcular && podeInteragirOcular;

  return (
    <S.FundoVitoria>
      {dadosDosFogos.map(fogo => (
        <S.ContainerFogos key={fogo.id} style={{ top: fogo.top, left: fogo.left }}>
          {Array.from({ length: PARTICULAS_POR_FOGO }).map((_, index) => (
            <S.ParticulaFogos 
              key={index} 
              style={{ '--color': fogo.cor, '--delay': fogo.delay } as any} 
            />
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
            $isFocused={visualOcularAtivo && botaoFocado === 'reiniciar'} 
          >
            <RotateCcw size={20} /> JOGAR DE NOVO
          </S.BotaoVitoria>

          <S.BotaoVitoria 
            onClick={() => { setBotaoFocado('menu'); confirmarAcao(); }}
            $isFocused={visualOcularAtivo && botaoFocado === 'menu'} 
          >
            <Home size={20} /> MENU DE JOGOS
          </S.BotaoVitoria>
        </S.ContainerBotoes>
      </S.ConteudoVitoria>
    </S.FundoVitoria>
  );
};

export default TelaVitoria;