import React, { useState, useEffect } from 'react';
import * as S from './styles';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';
import type { ConfiguracoesSalto } from '../manual/index';

const PALAVRAS_POR_NIVEL = {
  facil: [
    { palavra: 'SAPO', silabas: ['SA', 'PO'] },
    { palavra: 'BOLA', silabas: ['BO', 'LA'] },
    { palavra: 'CASA', silabas: ['CA', 'SA'] },
    { palavra: 'DADO', silabas: ['DA', 'DO'] },
    { palavra: 'GATO', silabas: ['GA', 'TO'] },
    { palavra: 'PATO', silabas: ['PA', 'TO'] },
    { palavra: 'MALA', silabas: ['MA', 'LA'] },
    { palavra: 'VACA', silabas: ['VA', 'CA'] },
    { palavra: 'LIXO', silabas: ['LI', 'XO'] },
    { palavra: 'FADA', silabas: ['FA', 'DA'] },
  ],
  medio: [
    { palavra: 'PIPOCA', silabas: ['PI', 'PO', 'CA'] },
    { palavra: 'BONECA', silabas: ['BO', 'NE', 'CA'] },
    { palavra: 'SALADA', silabas: ['SA', 'LA', 'DA'] },
    { palavra: 'TOMATE', silabas: ['TO', 'MA', 'TE'] },
    { palavra: 'CABIDE', silabas: ['CA', 'BI', 'DE'] },
    { palavra: 'JANELA', silabas: ['JA', 'NE', 'LA'] },
    { palavra: 'BATATA', silabas: ['BA', 'TA', 'TA'] },
    { palavra: 'CAVALO', silabas: ['CA', 'VA', 'LO'] },
    { palavra: 'MENINO', silabas: ['ME', 'NI', 'NO'] },
    { palavra: 'SACOLA', silabas: ['SA', 'CO', 'LA'] },
  ],
  dificil: [
    { palavra: 'ELEFANTE', silabas: ['E', 'LE', 'FAN', 'TE'] },
    { palavra: 'BORBOLETA', silabas: ['BOR', 'BO', 'LE', 'TA'] },
    { palavra: 'CHOCOLATE', silabas: ['CHO', 'CO', 'LA', 'TE'] },
    { palavra: 'TARTARUGA', silabas: ['TAR', 'TA', 'RU', 'GA'] },
    { palavra: 'BICICLETA', silabas: ['BI', 'CI', 'CLE', 'TA'] },
    { palavra: 'MELANCIA', silabas: ['ME', 'LAN', 'CIA'] },
    { palavra: 'GELADEIRA', silabas: ['GE', 'LA', 'DEI', 'RA'] },
    { palavra: 'DINOSSAURO', silabas: ['DI', 'NOS', 'SAU', 'RO'] },
    { palavra: 'TELEFONE', silabas: ['TE', 'LE', 'FO', 'NE'] },
    { palavra: 'COMPUTADOR', silabas: ['COM', 'PU', 'TA', 'DOR'] },
  ]
};

const JogoSaltoAlfabetico: React.FC<{ aoVencer: () => void; aoPerder: () => void; configuracoes: ConfiguracoesSalto }> = ({ aoVencer, aoPerder, configuracoes }) => {
  const { estaPiscando, mostrarCameraFlutuante } = useStore(lojaOlho);

  const [itemAtual, setItemAtual] = useState(PALAVRAS_POR_NIVEL.facil[0]);
  const [indiceSilaba, setIndiceSilaba] = useState(0);
  const [opcoes, setOpcoes] = useState<string[]>([]);
  const [focoAtual, setFocoAtual] = useState<number>(1);
  const [estadoSapo, setEstadoSapo] = useState<'parado' | 'preparando' | 'pulando' | 'afundando'>('parado');
  const [posicaoAlvo, setPosicaoAlvo] = useState<number | null>(null);
  const [direcaoPulo, setDirecaoPulo] = useState<'direita' | 'esquerda'>('direita');
  const [feedbackErro, setFeedbackErro] = useState(false);
  const [audioAtivo, setAudioAtivo] = useState(false);

  // Inicialização do nível
  useEffect(() => {
    const lista = PALAVRAS_POR_NIVEL[configuracoes.dificuldade] || PALAVRAS_POR_NIVEL.facil;
    const sorteada = lista[Math.floor(Math.random() * lista.length)];
    setItemAtual(sorteada);
    gerarNovasOpcoes(sorteada.silabas[0], lista);
  }, [configuracoes.dificuldade]);

  const gerarNovasOpcoes = (correta: string, listaOrigem: any[]) => {
    const todas = listaOrigem.flatMap(i => i.silabas);
    const erradas = todas.filter(s => s !== correta).sort(() => 0.5 - Math.random()).slice(0, 2);
    setOpcoes([correta, ...erradas].sort(() => 0.5 - Math.random()));
  };

  const falar = (texto: string, ehPalavraCompleta = false) => {
    if (!window.speechSynthesis || !configuracoes.sons) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(texto.toLowerCase());
    msg.lang = 'pt-BR';
    msg.rate = ehPalavraCompleta ? 0.8 : 0.7;
    window.speechSynthesis.speak(msg);
  };

  const tocarSom = (nome: string) => {
    if (!configuracoes.sons) return;
    const som = new Audio(`/assets/saltoAlfabetico/sounds/${nome}.mp3`);
    som.volume = 0.4;
    som.play().catch(() => {});
  };

  const realizarSalto = (idx: number) => {
    if (estadoSapo !== 'parado') return; // Bloqueia cliques múltiplos
    if (!audioAtivo) setAudioAtivo(true);

    const escolhida = opcoes[idx];
    const correta = itemAtual.silabas[indiceSilaba];

    setDirecaoPulo(idx === 0 ? 'esquerda' : 'direita');
    setPosicaoAlvo(idx);
    setEstadoSapo('preparando');

    // 1. Inicia o pulo após preparação
    setTimeout(() => {
      setEstadoSapo('pulando');
      tocarSom('pulo');

      // 2. Chegada na vitória-régia
      setTimeout(() => {
        if (escolhida === correta) {
          // --- LÓGICA DE ACERTO ---
          tocarSom('tap');
          falar(escolhida);
          const prox = indiceSilaba + 1;
          setIndiceSilaba(prox);

          if (prox === itemAtual.silabas.length) {
            // Completou a palavra
            setTimeout(() => falar(itemAtual.palavra, true), 600);
            setTimeout(aoVencer, 2500);
          } else {
            // Próxima sílaba
            setEstadoSapo('parado');
            setPosicaoAlvo(null);
            const lista = PALAVRAS_POR_NIVEL[configuracoes.dificuldade];
            gerarNovasOpcoes(itemAtual.silabas[prox], lista);
          }
        } else {
          // --- LÓGICA DE ERRO ---
          setEstadoSapo('afundando');
          setFeedbackErro(true);
          tocarSom('splash');
          
          setTimeout(() => {
            setFeedbackErro(false);
            if (configuracoes.penalidade) {
              aoPerder(); // Chama a tela de derrota
            } else {
              // Se não tiver penalidade, reseta o sapo para tentar de novo
              setEstadoSapo('parado');
              setPosicaoAlvo(null);
            }
          }, 1500); // Tempo da animação de afundar
        }
      }, 500);
    }, 150);
  };

  // Ciclo de Eye Tracking (Foco nas opções)
  useEffect(() => {
    if (!mostrarCameraFlutuante || estadoSapo !== 'parado') return;
    const int = setInterval(() => {
      setFocoAtual(p => (p + 1) % 3);
    }, 1800);
    return () => clearInterval(int);
  }, [mostrarCameraFlutuante, estadoSapo]);

  // Gatilho do Piscar (Blink)
  useEffect(() => {
    if (mostrarCameraFlutuante && estaPiscando && estadoSapo === 'parado') {
      realizarSalto(focoAtual);
    }
  }, [estaPiscando, mostrarCameraFlutuante, focoAtual, estadoSapo]);

  return (
    <S.ContainerCenario $tremendo={feedbackErro}>
      <S.PlacaMadeira>
        <S.SlotsContainer>
          {itemAtual.silabas.map((sil, i) => (
            <S.SlotSilaba 
              key={i}
              $status={i < indiceSilaba ? 'correto' : (i === indiceSilaba && feedbackErro ? 'erro' : 'pendente')}
            >
              {sil}
            </S.SlotSilaba>
          ))}
        </S.SlotsContainer>
      </S.PlacaMadeira>

      <S.AreaLago>
        <S.VitoriaRegiaBase>
          <img src="/assets/saltoAlfabetico/vitoria_regia.png" alt="Base" />
        </S.VitoriaRegiaBase>

        {opcoes.map((sil, idx) => (
          <S.WrapperOpcao 
            key={`${itemAtual.palavra}-${indiceSilaba}-${idx}`}
            $pos={idx}
            $focado={mostrarCameraFlutuante && focoAtual === idx}
            onClick={() => realizarSalto(idx)}
          >
            <S.VitoriaRegia $afundando={estadoSapo === 'afundando' && posicaoAlvo === idx}>
              <img src="/assets/saltoAlfabetico/vitoria_regia.png" alt="Folha" />
              <S.TextoSilaba>{sil}</S.TextoSilaba>
            </S.VitoriaRegia>
            {estadoSapo === 'afundando' && posicaoAlvo === idx && <S.SplashEffect />}
          </S.WrapperOpcao>
        ))}

        <S.SapoContainer $estado={estadoSapo} $alvo={posicaoAlvo}>
          <S.SapoImg 
            src={estadoSapo === 'pulando' || estadoSapo === 'afundando' 
              ? `/assets/saltoAlfabetico/sapo_pulo_${direcaoPulo}.png` 
              : "/assets/saltoAlfabetico/sapo_parado.png"
            } 
          />
          {estadoSapo === 'parado' && <S.SombraSapo />}
        </S.SapoContainer>
      </S.AreaLago>
    </S.ContainerCenario>
  );
};

export default JogoSaltoAlfabetico;