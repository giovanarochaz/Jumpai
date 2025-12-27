import React, { useEffect, useState, useRef } from 'react';
import * as S from './styles'; // Importa do derrota/styles.ts
import { CloudRain, Home, RotateCcw } from 'lucide-react';
import { useStore } from 'zustand';
import { useNavigate } from 'react-router-dom';
import { lojaOlho } from '../../../lojas/lojaOlho';

interface Props { aoReiniciar: () => void}

const TelaDerrotaSalto: React.FC<Props> = ({ aoReiniciar }) => {
  const { estaPiscando } = useStore(lojaOlho);
  const [foco, setFoco] = useState<'reiniciar' | 'sair'>('reiniciar');
  const [bloqueado, setBloqueado] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const intervalo = setInterval(() => { setFoco(prev => prev === 'reiniciar' ? 'sair' : 'reiniciar'); }, 2000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (estaPiscando && !bloqueado) {
      setBloqueado(true);
      if (foco === 'reiniciar') aoReiniciar(); else navigate('/jogos');
      timerRef.current = setTimeout(() => setBloqueado(false), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [estaPiscando, foco, bloqueado]);

  return (
    <S.FundoDerrota>
      <S.PlacaDerrota>
        <S.IconeContainer>
          <CloudRain size={60} strokeWidth={2.5} />
        </S.IconeContainer>
        
        <S.Titulo>Ops! Caiu na Água!</S.Titulo>
        
        <S.Mensagem>
          O sapinho se molhou todo! As sílabas podem ser escorregadias.<br/>
          <strong>Vamos secar ele e tentar de novo?</strong>
        </S.Mensagem>

        <S.ContainerBotoes>
          <S.Botao onClick={aoReiniciar} $focado={foco === 'reiniciar'}>
             <RotateCcw size={24} /> Tentar
          </S.Botao>
          <S.Botao onClick={() => navigate('/jogos')} $focado={foco === 'sair'}>
             <Home size={24} /> Sair
          </S.Botao>
        </S.ContainerBotoes>
      </S.PlacaDerrota>
    </S.FundoDerrota>
  );
};

export default TelaDerrotaSalto;