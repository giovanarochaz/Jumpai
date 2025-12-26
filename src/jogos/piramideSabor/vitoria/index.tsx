import React, { useState, useEffect, useCallback } from 'react';
import * as S from './styles';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'zustand'; 
import { lojaOlho } from '../../../lojas/lojaOlho';
import { useLeitorOcular } from '../../../hooks/useLeitorOcular';
import { pararNarracao } from '../../../servicos/acessibilidade';

const NUMERO_CONFETES = 50;
const CORES_CONFETE = ['#ef4444', '#fbbf24', '#22c55e', '#ffffff'];

interface DadosConfete {
  id: number;
  left: string;
  delay: string;
  duration: string;
  color: string;
  size: string;
  radius: string;
}

interface TelaVitoriaPiramideSaborProps {
  aoReiniciar: () => void;
}

type BotaoFoco = 'reiniciar' | 'outroJogo';
const BOTOES_ORDEM: BotaoFoco[] = ['reiniciar', 'outroJogo'];

const TelaVitoriaPiramideSabor: React.FC<TelaVitoriaPiramideSaborProps> = ({ aoReiniciar }) => {
  const { estaPiscando, mostrarCameraFlutuante } = useStore(lojaOlho);
  const [dadosConfetes, setDadosConfetes] = useState<DadosConfete[]>([]);
  const [botaoFocado, setBotaoFocado] = useState<BotaoFoco>('reiniciar');
  const [bloquearPiscada, setBloquearPiscada] = useState(true);
  const [introConcluida, setIntroConcluida] = useState(false);
  
  const navigate = useNavigate();

  // --- LÓGICA DE TEXTO PARA O LEITOR ---
  const obterTextoParaLeitura = useCallback(() => {
    if (!introConcluida) {
      return "Delicioso! Parabéns, Chef! Você montou um prato lendário seguindo a receita direitinho. Sabor e Saúde nota 10!";
    }
    if (botaoFocado === 'reiniciar') {
      return "Botão: Cozinhar de Novo. Pisque para começar uma nova receita.";
    }
    if (botaoFocado === 'outroJogo') {
      return "Botão: Sair da Cozinha. Pisque para escolher outro jogo.";
    }
    return null;
  }, [introConcluida, botaoFocado]);

  // --- SINCRONIA VOZ + FOCO ---
  const lidarComFimDaLeitura = useCallback(() => {
    if (!mostrarCameraFlutuante) return;

    if (!introConcluida) {
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

  // --- EFEITOS VISUAIS E CONTROLES ---
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
        radius: Math.random() > 0.5 ? '50%' : '2px',
      });
    }
    setDadosConfetes(dados);
  }, []);

  // Controle por Piscada
  useEffect(() => {
    if (!estaPiscando || bloquearPiscada || !mostrarCameraFlutuante) return;
    executarAcaoFocada();
  }, [estaPiscando, bloquearPiscada, mostrarCameraFlutuante, executarAcaoFocada]);

  // Controle por Teclado
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
            onClick={() => { setBotaoFocado('reiniciar'); executarAcaoFocada(); }}
            $focado={botaoFocado === 'reiniciar'} 
          >
            Cozinhar de Novo
          </S.BotaoVitoria>
          <S.BotaoVitoria 
            onClick={() => { setBotaoFocado('outroJogo'); executarAcaoFocada(); }}
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