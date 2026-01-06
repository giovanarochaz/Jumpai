import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as S from './styles';
import { ShieldX, RotateCcw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';
import { useLeitorOcular } from '../../../hooks/useLeitorOcular';
import { pararNarracao } from '../../../servicos/acessibilidade';

const CORES_DETRITOS = ['#94a3b8', '#f97316', '#ef4444', '#1e293b'];
const NUMERO_DETRITOS = 15;

interface TelaDerrotaSistemaSolarProps {
  aoReiniciar: () => void;
}

const TelaDerrotaSistemaSolar: React.FC<TelaDerrotaSistemaSolarProps> = ({ aoReiniciar }) => {
  const { estaPiscando, mostrarCameraFlutuante, leitorAtivo } = useStore(lojaOlho);
  const [detritos, setDetritos] = useState<any[]>([]);
  const [botaoFocado, setBotaoFocado] = useState<'reiniciar' | 'outroJogo'>('reiniciar');
  const [podeInteragirOcular, setPodeInteragirOcular] = useState(false);
  const [introConcluida, setIntroConcluida] = useState(false);
  
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const obterTextoParaLeitura = useCallback(() => {
    if (!leitorAtivo) return null;
    if (!introConcluida) return "Falha na Missão. Houston, temos um problema. A nave sofreu danos ou a rota foi perdida. Reiniciar sistemas?";
    return botaoFocado === 'reiniciar' ? "Reiniciar missão." : "Voltar para o menu.";
  }, [introConcluida, botaoFocado, leitorAtivo]);

  useEffect(() => {
    if (!mostrarCameraFlutuante) { setPodeInteragirOcular(true); return; }
    setPodeInteragirOcular(false);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!leitorAtivo) {
      timerRef.current = setTimeout(() => {
        setPodeInteragirOcular(true);
        setIntroConcluida(true);
      }, 2000);
    }
  }, [mostrarCameraFlutuante, leitorAtivo]);

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

  useEffect(() => {
    if (estaPiscando && mostrarCameraFlutuante && podeInteragirOcular) {
      setPodeInteragirOcular(false);
      confirmarAcao();
    }
  }, [estaPiscando, mostrarCameraFlutuante, podeInteragirOcular, confirmarAcao]);

  useEffect(() => {
    const dados = Array.from({ length: NUMERO_DETRITOS }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      size: `${Math.random() * 15 + 5}px`,
      cor: CORES_DETRITOS[Math.floor(Math.random() * CORES_DETRITOS.length)],
    }));
    setDetritos(dados);
  }, []);

  return (
    <S.FundoDerrota>
      <S.LuzEmergencia />
      {detritos.map(d => (
        <S.Detrito key={d.id} style={{ top: d.top, left: d.left, backgroundColor: d.cor, width: d.size, height: d.size, animationDelay: d.delay } as any} />
      ))}

      <S.ConteudoDerrota>
        <S.IconeContainer>
          <ShieldX size={80} />
        </S.IconeContainer>
        
        <S.TituloDerrota>FALHA NA MISSÃO</S.TituloDerrota>
        
        <S.MensagemDerrota>
          Houston, temos um problema! A nave sofreu danos ou a rota foi perdida.
          Deseja reiniciar os sistemas e tentar novamente?
        </S.MensagemDerrota>
        
        <S.ContainerBotoes>
          <S.BotaoDerrota 
            onClick={() => { setBotaoFocado('reiniciar'); confirmarAcao(); }}
            $isFocused={mostrarCameraFlutuante && podeInteragirOcular && botaoFocado === 'reiniciar'} 
          >
            <RotateCcw size={20} /> REINICIAR
          </S.BotaoDerrota>

          <S.BotaoDerrota 
            onClick={() => { setBotaoFocado('outroJogo'); confirmarAcao(); }}
            $isFocused={mostrarCameraFlutuante && podeInteragirOcular && botaoFocado === 'outroJogo'} 
          >
            <Home size={20} /> CANCELAR
          </S.BotaoDerrota>
        </S.ContainerBotoes>
      </S.ConteudoDerrota>
    </S.FundoDerrota>
  );
};

export default TelaDerrotaSistemaSolar;