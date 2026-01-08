import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as S from './styles';
import { Trophy, Home, RotateCcw, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'zustand'; 
import { lojaOlho } from '../../../lojas/lojaOlho';
import { useLeitorOcular } from '../../../hooks/useLeitorOcular';
import { pararNarracao } from '../../../servicos/acessibilidade';
import type { ConfiguracoesJogo } from '../../../interface/types';

const CORES_CELEBRACAO = ['#ef4444', '#fbbf24', '#ffffff', '#f97316'];
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
  configuracoes: ConfiguracoesJogo;
}

const TelaVitoriaPiramideSabor: React.FC<TelaVitoriaProps> = ({ aoReiniciar, configuracoes }) => {
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

  useEffect(() => {
    if (configuracoes.sons) {
      const audio = new Audio('/assets/efeitos/vitoria.mp3');
      audio.play().catch(erro => console.warn("Áudio bloqueado:", erro));
      return () => { audio.pause(); audio.currentTime = 0; };
    }
  }, [configuracoes.sons]);
  
  const textoParaLeitura = useMemo(() => {
    if (!leitorAtivo) return null;
    if (!podeInteragirOcular) {
      return 'Parabéns, Super Chef! O Hambúrguer Lendário ficou perfeito e nutritivo. O que deseja fazer agora?';
    }
    return botaoFocado === 'reiniciar'
      ? 'Preparar uma nova receita. Pisque agora para jogar de novo!'
      : 'Voltar para o menu principal. Pisque agora para escolher outro desafio.';
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

  useEffect(() => {
    if (!estaPiscando) { piscadaProcessadaRef.current = false; return; }
    if (estaPiscando && modoOcular && podeInteragirOcular && !piscadaProcessadaRef.current) {
      piscadaProcessadaRef.current = true;
      setPodeInteragirOcular(false);
      confirmarAcao();
    }
  }, [estaPiscando, modoOcular, podeInteragirOcular, confirmarAcao]);

  useEffect(() => {
    const dados = Array.from({ length: NUMERO_FOGOS }).map((_, i) => ({
      id: i, top: `${Math.random() * 80 + 10}%`, left: `${Math.random() * 80 + 10}%`,
      cor: CORES_CELEBRACAO[Math.floor(Math.random() * CORES_CELEBRACAO.length)],
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
            <S.ParticulaFogos key={index} style={{ '--color': fogo.cor, '--delay': fogo.delay } as any} />
          ))}
        </S.ContainerFogos>
      ))}

      <S.ConteudoVitoria>
        <S.IconeContainer>
          <Trophy size={80} />
          <S.BadgeChef><ChefHat size={30} /></S.BadgeChef>
        </S.IconeContainer>

        <S.TituloVitoria>VITÓRIA SABOROSA!</S.TituloVitoria>

        <S.MensagemVitoria>
           Parabéns, Super Chef! Você montou um lanche equilibrado e nutritivo. 
           O Mestre Cuca deu nota dez para o seu Hambúrguer Lendário!
        </S.MensagemVitoria>

        <S.ContainerBotoes>
          <S.BotaoVitoria
            onClick={() => { setBotaoFocado('reiniciar'); tentarNovamente(); }}
            $isFocused={visualOcularAtivo && botaoFocado === 'reiniciar'}
          >
            <RotateCcw size={20} /> NOVO LANCHE
          </S.BotaoVitoria>

          <S.BotaoVitoria
            onClick={() => { setBotaoFocado('menu'); irParaMenu(); }}
            $isFocused={visualOcularAtivo && botaoFocado === 'menu'}
          >
            <Home size={20} /> MENU
          </S.BotaoVitoria>
        </S.ContainerBotoes>
      </S.ConteudoVitoria>
    </S.FundoVitoria>
  );
};

export default TelaVitoriaPiramideSabor;