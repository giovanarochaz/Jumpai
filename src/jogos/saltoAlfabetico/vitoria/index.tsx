import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as S from './styles';
import { Trophy, Home, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'zustand'; 
import { lojaOlho } from '../../../lojas/lojaOlho';
import { useLeitorOcular } from '../../../hooks/useLeitorOcular';
import { pararNarracao } from '../../../servicos/acessibilidade';
import type { ConfiguracoesJogo } from '../../../interface/types';

const CORES_CELEBRACAO = ['#fbbf24', '#4ade80', '#ffffff', '#f97316'];
const NUMERO_FOGOS = 10;
const PARTICULAS_POR_FOGO = 8;

interface DadosFogos {
  id: number;
  top: string;
  left: string;
  cor: string;
  delay: string;
}

interface TelaVitoriaProps {
  aoReiniciar: () => void;
  configuracoes: ConfiguracoesJogo;
}

const TelaVitoriaSalto: React.FC<TelaVitoriaProps> = ({ aoReiniciar, configuracoes }) => {
  const { estaPiscando, mostrarCameraFlutuante: modoOcular, leitorAtivo } = useStore(lojaOlho);
  const navigate = useNavigate();

  const [dadosDosFogos, setDadosDosFogos] = useState<DadosFogos[]>([]);
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
    return () => {
      if (timerScanRef.current) clearInterval(timerScanRef.current);
    };
  }, [modoOcular, podeInteragirOcular]);

  // Som de vitória
  useEffect(() => {
    if (configuracoes.sons) {
      const audio = new Audio('/assets/efeitos/vitoria.mp3');
      audio.play().catch(() => {});
      return () => { audio.pause(); audio.currentTime = 0; };
    }
  }, [configuracoes.sons]);
  
  // Texto dinâmico para o leitor ocular
  const textoParaLeitura = useMemo(() => {
    if (!leitorAtivo) return null;
    if (!podeInteragirOcular) {
      return 'Incrível! O sapinho atravessou a lagoa em segurança. Você é um mestre das palavras! O que deseja fazer agora?';
    }
    return botaoFocado === 'reiniciar'
      ? 'Jogar de novo!'
      : 'Voltar para o menu.';
  }, [leitorAtivo, podeInteragirOcular, botaoFocado]);

  useLeitorOcular(textoParaLeitura, [textoParaLeitura], () => {
    if (modoOcular && leitorAtivo) setPodeInteragirOcular(true);
  });

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

  // Detector de piscada para confirmar ação
  useEffect(() => {
    if (!estaPiscando) { piscadaProcessadaRef.current = false; return; }
    if (estaPiscando && modoOcular && podeInteragirOcular && !piscadaProcessadaRef.current) {
      piscadaProcessadaRef.current = true;
      setPodeInteragirOcular(false);
      confirmarAcao();
    }
  }, [estaPiscando, modoOcular, podeInteragirOcular, confirmarAcao]);

  // Gerar fogos de artifício
  useEffect(() => {
    const dados = Array.from({ length: NUMERO_FOGOS }).map((_, i) => ({
      id: i, top: `${Math.random() * 70 + 10}%`, left: `${Math.random() * 80 + 10}%`,
      cor: CORES_CELEBRACAO[Math.floor(Math.random() * CORES_CELEBRACAO.length)],
      delay: `${Math.random() * 2}s`,
    }));
    setDadosDosFogos(dados);
  }, []);

  const visualOcularAtivo = modoOcular && podeInteragirOcular;

  return (
    <S.FundoVitoria>
      {/* Efeito de Fogos */}
      {dadosDosFogos.map(fogo => (
        <S.ContainerFogos key={fogo.id} style={{ top: fogo.top, left: fogo.left }}>
          {Array.from({ length: PARTICULAS_POR_FOGO }).map((_, index) => (
            <S.ParticulaFogos key={index} style={{ '--color': fogo.cor, '--delay': fogo.delay } as any} />
          ))}
        </S.ContainerFogos>
      ))}

      <S.PlacaVitoria>
        <S.IconeContainer>
          <Trophy size={70} strokeWidth={2.5} />
        </S.IconeContainer>
        
        <S.TituloVitoria>VITÓRIA NA LAGOA!</S.TituloVitoria>
        
        <S.MensagemVitoria>
          Incrível! O sapinho atravessou em segurança.<br/>
          <strong>Você é um mestre das palavras!</strong>
        </S.MensagemVitoria>

        <S.ContainerBotoes>
          <S.BotaoVitoria
            onClick={() => { setBotaoFocado('reiniciar'); tentarNovamente(); }}
            $isFocused={visualOcularAtivo && botaoFocado === 'reiniciar'}
          >
            <RotateCcw size={24} /> DE NOVO
          </S.BotaoVitoria>

          <S.BotaoVitoria
            onClick={() => { setBotaoFocado('menu'); irParaMenu(); }}
            $isFocused={visualOcularAtivo && botaoFocado === 'menu'}
          >
            <Home size={24} /> SAIR
          </S.BotaoVitoria>
        </S.ContainerBotoes>
      </S.PlacaVitoria>
    </S.FundoVitoria>
  );
};

export default TelaVitoriaSalto;