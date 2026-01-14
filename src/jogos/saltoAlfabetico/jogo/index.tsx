import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as S from './styles';
import { useStore } from 'zustand'; 
import { lojaOlho } from '../../../lojas/lojaOlho'; 
import { useLeitorOcular } from '../../../hooks/useLeitorOcular';
import type { Jogos } from '../../../interface/types';

type Dificuldade = 'facil' | 'medio' | 'dificil';

interface Palavra {
  palavra: string;
  silabas: string[];
  fonetica: string[]; 
  tonica: number;
}

const PALAVRAS: Record<Dificuldade, Palavra[]> = {
  facil: [
    { palavra: 'SAPO', silabas: ['SA', 'PO'], fonetica: ['SÁ', 'PÔ'], tonica: 0 },
    { palavra: 'CASA', silabas: ['CA', 'SA'], fonetica: ['CÁ', 'SÁ'], tonica: 0 },
    { palavra: 'VACA', silabas: ['VA', 'CA'], fonetica: ['VÁ', 'CÁ'], tonica: 0 },
    { palavra: 'BOLA', silabas: ['BO', 'LA'], fonetica: ['BÓ', 'LÁ'], tonica: 0 },
  ],
  medio: [
    { palavra: 'PIPOCA', silabas: ['PI', 'PO', 'CA'], fonetica: ['PI', 'PÓ', 'CÁ'], tonica: 1 },
    { palavra: 'JANELA', silabas: ['JA', 'NE', 'LA'], fonetica: ['JA', 'NÊ', 'LÁ'], tonica: 1 },
    { palavra: 'CAVALO', silabas: ['CA', 'VA', 'LO'], fonetica: ['CA', 'VÁ', 'LÔ'], tonica: 1 },
  ],
  dificil: [
    { palavra: 'BORBOLETA', silabas: ['BOR', 'BO', 'LE', 'TA'], fonetica: ['BÔR', 'BÔ', 'LÊ', 'TÁ'], tonica: 2 },
    { palavra: 'ELEFANTE', silabas: ['E', 'LE', 'FAN', 'TE'], fonetica: ['Ê', 'LÊ', 'FÂN', 'TÊ'], tonica: 2 },
    { palavra: 'CHOCOLATE', silabas: ['CHO', 'CO', 'LA', 'TE'], fonetica: ['CHÔ', 'CÔ', 'LÁ', 'TÊ'], tonica: 2 },
  ]
};

const JogoSaltoAlfabetico: React.FC<Jogos> = ({ aoVencer, aoPerder, configuracoes }) => {
  const { estaPiscando, mostrarCameraFlutuante: modoOcular, leitorAtivo } = useStore(lojaOlho); 
  
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [itemAtual, setItemAtual] = useState<Palavra>(PALAVRAS.facil[0]);
  const [indiceSilaba, setIndiceSilaba] = useState(0);
  const [opcoes, setOpcoes] = useState<string[]>([]);
  const [focoAtual, setFocoAtual] = useState<number>(1);
  const [estadoSapo, setEstadoSapo] = useState<'parado' | 'preparando' | 'pulando' | 'afundando'>('parado');
  const [posicaoAlvo, setPosicaoAlvo] = useState<number | null>(null);
  
  const [feedbackErro, setFeedbackErro] = useState(false);
  const [podeInteragirOcular, setPodeInteragirOcular] = useState(false);
  const [anuncioVoz, setAnuncioVoz] = useState<string | null>(null);

  const piscadaProcessadaRef = useRef(false);
  const timerDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const somPuloRef = useRef<HTMLAudioElement | null>(null);
  const somSplashRef = useRef<HTMLAudioElement | null>(null);
  const somAcertoRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!modoOcular) { setPodeInteragirOcular(true); return; }
    setPodeInteragirOcular(false);
    if (timerDebounceRef.current) clearTimeout(timerDebounceRef.current);
    if (!leitorAtivo) {
       timerDebounceRef.current = setTimeout(() => setPodeInteragirOcular(true), 1200);
    }
  }, [modoOcular, leitorAtivo]);

  const textoParaLeitura = useMemo(() => {
    if (!leitorAtivo) return null;
    if (!jogoIniciado) {
       return "Prepare-se! O sapinho está na margem. Pisque os olhos agora para começar a aventura na lagoa!";
    }
    if (anuncioVoz) return anuncioVoz;
    return "";
  }, [leitorAtivo, jogoIniciado, anuncioVoz]);

  useLeitorOcular(textoParaLeitura, [textoParaLeitura], () => {
    if (modoOcular && leitorAtivo) setPodeInteragirOcular(true);
  });

  const gerarOpcoes = useCallback((correta: string) => {
    const dificuldade = configuracoes.dificuldade|| 'facil';
    const todasSilabas = PALAVRAS[dificuldade].flatMap(p => p.silabas);
    const erradas = todasSilabas.filter(s => s !== correta).sort(() => 0.5 - Math.random()).slice(0, 2);
    setOpcoes([correta, ...erradas].sort(() => 0.5 - Math.random()));
  }, [configuracoes.dificuldade]);

  useEffect(() => {
    const dificuldade = configuracoes.dificuldade || 'facil';
    const lista = PALAVRAS[dificuldade];
    const sorteada = lista[Math.floor(Math.random() * lista.length)];
    setItemAtual(sorteada);
    gerarOpcoes(sorteada.silabas[0]);
  }, [configuracoes.dificuldade, gerarOpcoes]);

  const realizarSalto = (idx: number) => {
    if (estadoSapo !== 'parado') return;
    const escolhida = opcoes[idx];
    const correta = itemAtual.silabas[indiceSilaba];
    const fonetica = itemAtual.fonetica[indiceSilaba];

    setPosicaoAlvo(idx);
    setEstadoSapo('preparando');

    setTimeout(() => {
      setEstadoSapo('pulando');
      if (configuracoes.sons) somPuloRef.current?.play().catch(() => {});

      setTimeout(() => {
        if (escolhida === correta) {
          if (configuracoes.sons) somAcertoRef.current?.play().catch(() => {});
          const prox = indiceSilaba + 1;
          setIndiceSilaba(prox);

          if (prox === itemAtual.silabas.length) {
            setAnuncioVoz(`${itemAtual.palavra}!`);
            setTimeout(aoVencer, 2500);
          } else {
            setAnuncioVoz(`${fonetica}`);
            setEstadoSapo('parado');
            setPosicaoAlvo(null);
            gerarOpcoes(itemAtual.silabas[prox]);
          }
        } else {
          setEstadoSapo('afundando');
          setFeedbackErro(true);
          if (configuracoes.sons) somSplashRef.current?.play().catch(() => {});
          
          setTimeout(() => {
            setFeedbackErro(false);
            if (configuracoes.penalidade) aoPerder();
            else {
              setEstadoSapo('parado');
              setPosicaoAlvo(null);
              setAnuncioVoz("Tente pular na folha certa agora.");
            }
          }, 1500);
        }
      }, 500);
    }, 150);
  };

  useEffect(() => {
    if (!estaPiscando) { piscadaProcessadaRef.current = false; return; }

    if (estaPiscando && modoOcular && podeInteragirOcular && !piscadaProcessadaRef.current) {
       piscadaProcessadaRef.current = true;
       if (!jogoIniciado) {
          setJogoIniciado(true);
          setAnuncioVoz("Vamos lá! Pule nas folhas para formar a palavra.");
       } else {
          realizarSalto(focoAtual);
       }
    }
  }, [estaPiscando, modoOcular, podeInteragirOcular, jogoIniciado, focoAtual]);

  useEffect(() => {
    if (!modoOcular || estadoSapo !== 'parado' || !jogoIniciado) return;
    const int = setInterval(() => setFocoAtual(p => (p + 1) % 3), 2000);
    return () => clearInterval(int);
  }, [modoOcular, estadoSapo, jogoIniciado]);

  useEffect(() => {
    const tratarTecla = (e: KeyboardEvent) => {
      if (!jogoIniciado && ['Enter', ' '].includes(e.key)) setJogoIniciado(true);
      if (jogoIniciado && estadoSapo === 'parado') {
        if (e.key === '1') realizarSalto(0);
        if (e.key === '2') realizarSalto(1);
        if (e.key === '3') realizarSalto(2);
      }
    };
    window.addEventListener('keydown', tratarTecla);
    return () => window.removeEventListener('keydown', tratarTecla);
  }, [jogoIniciado, estadoSapo, opcoes]);

  useEffect(() => {
    somPuloRef.current = new Audio('/assets/saltoAlfabetico/sounds/pulo.mp3');
    somSplashRef.current = new Audio('/assets/saltoAlfabetico/sounds/splash.mp3');
    somAcertoRef.current = new Audio('/assets/saltoAlfabetico/sounds/acerto.mp3');
  }, []);

  return (
    <S.FundoLagoa $tremendo={feedbackErro}>
      <S.HudPalavra>
        {itemAtual.silabas.map((sil, i) => (
          <S.SlotSilaba 
            key={i} 
            $status={i < indiceSilaba ? 'correto' : (i === indiceSilaba && feedbackErro ? 'erro' : 'pendente')}
            $ehTonica={i === itemAtual.tonica}
          >
            {sil}
          </S.SlotSilaba>
        ))}
      </S.HudPalavra>

      <S.VitoriaRegiaBase>
        <img src="/assets/saltoAlfabetico/vitoria_regia.png" alt="Base" />
      </S.VitoriaRegiaBase>

      {opcoes.map((sil, idx) => (
        <S.WrapperFolha 
          key={`${idx}-${indiceSilaba}`} 
          $pos={idx} 
          $focado={modoOcular && focoAtual === idx && jogoIniciado}
          onClick={() => realizarSalto(idx)}
        >
          <S.VitoriaRegia $afundando={estadoSapo === 'afundando' && posicaoAlvo === idx}>
            <img src="/assets/saltoAlfabetico/vitoria_regia.png" alt="Folha" />
            <S.TextoSilaba>{sil}</S.TextoSilaba>
          </S.VitoriaRegia>
          {estadoSapo === 'afundando' && posicaoAlvo === idx && <S.SplashEffect />}
        </S.WrapperFolha>
      ))}

      <S.SapoWrapper $estado={estadoSapo} $alvo={posicaoAlvo}>
        <S.SapoImg 
          src={estadoSapo === 'pulando' || estadoSapo === 'afundando' 
            ? `/assets/saltoAlfabetico/sapo_pulo_direita.png` 
            : "/assets/saltoAlfabetico/sapo_parado.png"} 
        />
      </S.SapoWrapper>

      {!jogoIniciado && (
        <S.OverlayAviso>
          {modoOcular ? 'PISQUE PARA COMEÇAR' : 'APERTE ESPAÇO PARA COMEÇAR'}
        </S.OverlayAviso>
      )}
    </S.FundoLagoa>
  );
};

export default JogoSaltoAlfabetico;