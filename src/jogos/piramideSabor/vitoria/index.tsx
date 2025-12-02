import React, { useState, useEffect, useRef } from 'react';
import * as S from './styles';
import { Star } from 'lucide-react'; // Trocamos o ChefHat por Estrelas para a nota
import { useNavigate } from 'react-router-dom';
import { useStore } from 'zustand'; 
import { lojaOlho } from '../../../lojas/lojaOlho';

// Configurações para o efeito de confete
const NUMERO_CONFETES = 50;
const CORES_CONFETE = ['#ef4444', '#fbbf24', '#22c55e', '#ffffff']; // Vermelho, Amarelo, Verde, Branco

interface DadosConfete {
  id: number;
  left: string;
  delay: string;
  duration: string;
  color: string;
  size: string;
  radius: string; // Para variar entre quadrados e círculos
}

interface TelaVitoriaPiramideSaborProps {
  aoReiniciar: () => void;
}

type BotaoFoco = 'reiniciar' | 'outroJogo' | null;
const BOTOES_ORDEM: BotaoFoco[] = ['reiniciar', 'outroJogo'];
const TEMPO_FOCO_MS = 1500;
const COOLDOWN_CLIQUE_MS = 800;

const TelaVitoriaPiramideSabor: React.FC<TelaVitoriaPiramideSaborProps> = ({ aoReiniciar }) => {
  const { estaPiscando } = useStore(lojaOlho);
  const [dadosConfetes, setDadosConfetes] = useState<DadosConfete[]>([]);
  const [botaoFocado, setBotaoFocado] = useState<BotaoFoco>('reiniciar');
  const [bloquearClique, setBloquearClique] = useState(false);
  
  const focoTimerRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const executarAcaoFocada = () => {
    if (botaoFocado === 'reiniciar') {
      aoReiniciar();
    } else if (botaoFocado === 'outroJogo') {
      navigate('/jogos/teclado');
    }
  };

  // EFEITO 1: Geração dos Confetes
  useEffect(() => {
    const dados: DadosConfete[] = [];
    for (let i = 0; i < NUMERO_CONFETES; i++) {
      dados.push({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${2 + Math.random() * 3}s`,
        color: CORES_CONFETE[Math.floor(Math.random() * CORES_CONFETE.length)],
        size: `${8 + Math.random() * 8}px`,
        radius: Math.random() > 0.5 ? '50%' : '2px', // Círculo ou Quadrado
      });
    }
    setDadosConfetes(dados);
  }, []);

  // EFEITO 2: Foco automático (Inalterado)
  useEffect(() => {
    const alternarFoco = () => {
      setBotaoFocado(prev => BOTOES_ORDEM[(BOTOES_ORDEM.indexOf(prev) + 1) % BOTOES_ORDEM.length]);
    };
    focoTimerRef.current = setInterval(alternarFoco, TEMPO_FOCO_MS) as unknown as number;
    return () => { if (focoTimerRef.current) clearInterval(focoTimerRef.current); };
  }, []);

  // EFEITO 3: Clique por piscada (Inalterado)
  useEffect(() => {
    if (!estaPiscando || bloquearClique || !botaoFocado) return;

    setBloquearClique(true);
    executarAcaoFocada();
    
    if (focoTimerRef.current) clearInterval(focoTimerRef.current);
    
    const cooldownTimer = setTimeout(() => {
        const newFocoTimer = setInterval(() => {
            setBotaoFocado(prev => BOTOES_ORDEM[(BOTOES_ORDEM.indexOf(prev) + 1) % BOTOES_ORDEM.length]);
        }, TEMPO_FOCO_MS);
        focoTimerRef.current = newFocoTimer as unknown as number;
        setBloquearClique(false);
    }, COOLDOWN_CLIQUE_MS);
    
    return () => clearTimeout(cooldownTimer);
  }, [estaPiscando, bloquearClique, botaoFocado]);

  // EFEITO 4: Teclado (Inalterado)
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
      {/* Chuva de Confetes */}
      {dadosConfetes.map(confete => (
        <S.Confete
          key={confete.id}
          style={{
            '--left': confete.left,
            '--delay': confete.delay,
            '--duration': confete.duration,
            '--color': confete.color,
            '--size': confete.size,
            '--radius': confete.radius,
          } as React.CSSProperties}
        />
      ))}

      <S.ConteudoVitoria>
        {/* 3 Estrelas de Classificação */}
        <S.EstrelasContainer>
            <S.IconeEstrela $delay="0s"><Star size={60} fill="#fbbf24" strokeWidth={3} stroke="#78350f" /></S.IconeEstrela>
            <S.IconeEstrela $delay="0.3s"><Star size={80} fill="#fbbf24" strokeWidth={3} stroke="#78350f" /></S.IconeEstrela>
            <S.IconeEstrela $delay="0.6s"><Star size={60} fill="#fbbf24" strokeWidth={3} stroke="#78350f" /></S.IconeEstrela>
        </S.EstrelasContainer>

        <S.TituloVitoria>Delicioso!</S.TituloVitoria>
        
        <S.MensagemVitoria>
          Parabéns, Chef! Você montou um prato lendário seguindo a receita direitinho. <br/>
          <strong>Sabor e Saúde nota 10!</strong>
        </S.MensagemVitoria>
        
        <S.ContainerBotoes>
          <S.BotaoVitoria 
            onClick={() => aoReiniciar()} 
            $focado={botaoFocado === 'reiniciar'} 
          >
            Cozinhar de Novo
          </S.BotaoVitoria>
          <S.BotaoVitoria 
            onClick={() => navigate('/jogos/teclado')} 
            $focado={botaoFocado === 'outroJogo'} 
          >
            Sair da Cozinha
          </S.BotaoVitoria>
        </S.ContainerBotoes>
      </S.ConteudoVitoria>
    </S.FundoVitoria>
  );
};

export default TelaVitoriaPiramideSabor;