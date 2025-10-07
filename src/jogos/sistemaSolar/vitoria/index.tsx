import React, { useState, useEffect, useRef } from 'react';
import * as S from './styles';
import { Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'zustand'; 
import { lojaOlho } from '../../../lojas/lojaOlho';

const CORES_FOGOS = ['#FFD700', '#FF4500', '#2AD352', '#00BFFF', '#FF1493', '#ADFF2F'];
const NUMERO_FOGOS = 15;
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
const TEMPO_FOCO_MS = 1500; // 1.5 segundos
const COOLDOWN_CLIQUE_MS = 800; // Cooldown após a piscada/clique

const TelaVitoria: React.FC<TelaVitoriaProps> = ({ aoReiniciar }) => {
  const { estaPiscando } = useStore(lojaOlho);
  const [dadosDosFogos, setDadosDosFogos] = useState<DadosFogos[]>([]);
  const [botaoFocado, setBotaoFocado] = useState<BotaoFoco>('reiniciar');
  const [bloquearClique, setBloquearClique] = useState(false); // Mudado de 'bloquearPiscada' para 'bloquearClique'
  
  const cooldownTimerRef = useRef<number | null>(null);
  const focoTimerRef = useRef<number | null>(null); // Novo Ref para o timer de foco
  const navigate = useNavigate();

  // --- LÓGICA DE NAVEGAÇÃO E AÇÃO (Função que executa o clique) ---
  const executarAcaoFocada = () => {
    if (botaoFocado === 'reiniciar') {
      aoReiniciar();
    } else if (botaoFocado === 'outroJogo') {
      navigate('/jogos/teclado');
    }
  };

  // --- EFEITO 1: Geração de Fogos de Artifício (Inalterado) ---
  useEffect(() => {
    const dados: DadosFogos[] = [];
    for (let i = 0; i < NUMERO_FOGOS; i++) {
      dados.push({
        id: i,
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`,
        cor: CORES_FOGOS[Math.floor(Math.random() * CORES_FOGOS.length)],
        delay: `${Math.random() * 2}s`,
      });
    }
    setDadosDosFogos(dados);

    // Limpa ambos os timers na desmontagem (Garantia)
    return () => {
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      if (focoTimerRef.current) clearTimeout(focoTimerRef.current);
    };
  }, []);

  // --- EFEITO 2: Foco Automático Temporizado (NOVO) ---
  useEffect(() => {
    const alternarFoco = () => {
      setBotaoFocado(prevFoco => {
        const currentIndex = BOTOES_ORDEM.indexOf(prevFoco);
        const nextIndex = (currentIndex + 1) % BOTOES_ORDEM.length;
        return BOTOES_ORDEM[nextIndex];
      });
    };
    
    // Inicia o loop de foco
    focoTimerRef.current = setInterval(alternarFoco, TEMPO_FOCO_MS) as unknown as number;

    return () => {
      if (focoTimerRef.current) {
        clearInterval(focoTimerRef.current);
      }
    };
  }, []); // Roda apenas uma vez na montagem

  // --- EFEITO 3: Clique por Piscada (ADAPTADO) ---
  useEffect(() => {
    if (!estaPiscando || bloquearClique || !botaoFocado) {
      return;
    }

    // 1. Bloqueia cliques futuros e executa a ação focada
    setBloquearClique(true);
    executarAcaoFocada();
    
    // 2. Limpa o timer de foco para evitar que ele mude imediatamente após o clique
    if (focoTimerRef.current) {
      clearInterval(focoTimerRef.current);
    }
    
    // 3. Reinicia o timer de foco após um pequeno atraso (para dar tempo do clique ocorrer)
    focoTimerRef.current = setTimeout(() => {
        // Reinicia o loop de foco
        focoTimerRef.current = setInterval(() => {
            setBotaoFocado(prevFoco => {
                const currentIndex = BOTOES_ORDEM.indexOf(prevFoco);
                const nextIndex = (currentIndex + 1) % BOTOES_ORDEM.length;
                return BOTOES_ORDEM[nextIndex];
            });
        }, TEMPO_FOCO_MS) as unknown as number;

        // Remove o bloqueio de clique
        setBloquearClique(false);
    }, COOLDOWN_CLIQUE_MS) as unknown as number;
    
  }, [estaPiscando, bloquearClique, botaoFocado, executarAcaoFocada]); // Dependências

  // --- EFEITO 4: Clique por Teclado (Enter) (ADAPTADO) ---
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && botaoFocado) {
        // Pausa o foco automático
        if (focoTimerRef.current) clearInterval(focoTimerRef.current);
        
        // Executa e reinicia o foco automático após um cooldown
        executarAcaoFocada();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [botaoFocado, executarAcaoFocada]);


  return (
    <S.FundoVitoria>
      {/* Mapeia e renderiza cada explosão de fogos na tela */}
      {dadosDosFogos.map(fogo => (
        <S.ContainerFogos
          key={fogo.id}
          style={{
            '--top': fogo.top,
            '--left': fogo.left,
          } as React.CSSProperties}
        >
          {/* Renderiza as partículas para cada explosão */}
          {Array.from({ length: PARTICULAS_POR_FOGO }).map((_, index) => (
            <S.ParticulaFogos
              key={index}
              style={{
                '--color': fogo.cor,
                '--delay': fogo.delay,
              } as React.CSSProperties}
            />
          ))}
        </S.ContainerFogos>
      ))}

      {/* O conteúdo do modal é renderizado depois, ficando por cima dos fogos */}
      <S.ConteudoVitoria>
        <S.IconeTrofeu>
          <Trophy size={100} strokeWidth={1.5} />
        </S.IconeTrofeu>
        <S.TituloVitoria>MISSÃO COMPLETA!</S.TituloVitoria>
        <S.MensagemVitoria>
          Parabéns, explorador espacial! Você catalogou todos os planetas na ordem correta e se tornou um mestre do Sistema Solar!
        </S.MensagemVitoria>
        <S.ContainerBotoes>
          <S.BotaoVitoria 
            onClick={executarAcaoFocada} // Mapeado para a função de execução
            $focado={botaoFocado === 'reiniciar'} 
          >
            Jogar Novamente
          </S.BotaoVitoria>
          <S.BotaoVitoria 
            onClick={executarAcaoFocada} // Mapeado para a função de execução
            $focado={botaoFocado === 'outroJogo'} 
          >
            Outro Jogo
          </S.BotaoVitoria>
        </S.ContainerBotoes>
      </S.ConteudoVitoria>
    </S.FundoVitoria>
  );
};

export default TelaVitoria;