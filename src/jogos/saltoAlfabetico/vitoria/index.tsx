import React, { useEffect, useState, useRef } from 'react';
import * as S from './styles'; // Importa do vitoria/styles.ts
import { Trophy, Home, RotateCcw } from 'lucide-react';
import { useStore } from 'zustand';
import { useNavigate } from 'react-router-dom';
import { lojaOlho } from '../../../lojas/lojaOlho';

interface Props { aoReiniciar: () => void; aoSair: () => void; }

const TelaVitoriaSalto: React.FC<Props> = ({ aoReiniciar, aoSair }) => {
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
    <S.FundoVitoria>
      <S.PlacaVitoria>
        <S.IconeContainer>
          <Trophy size={60} strokeWidth={2.5} />
        </S.IconeContainer>
        
        <S.Titulo>Lagoa Conquistada!</S.Titulo>
        
        <S.Mensagem>
          Incrível! O sapinho atravessou em segurança.<br/>
          <strong>Você é um mestre das palavras!</strong>
        </S.Mensagem>

        <S.ContainerBotoes>
          <S.Botao onClick={aoReiniciar} $focado={foco === 'reiniciar'}>
             <RotateCcw size={24} /> De Novo
          </S.Botao>
          <S.Botao onClick={() => navigate('/jogos')} $focado={foco === 'sair'}>
             <Home size={24} /> Sair
          </S.Botao>
        </S.ContainerBotoes>
      </S.PlacaVitoria>
    </S.FundoVitoria>
  );
};

export default TelaVitoriaSalto;