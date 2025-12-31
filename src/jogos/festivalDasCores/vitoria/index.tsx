import React, { useEffect, useState, useRef } from 'react';
import * as S from './styles';
import { Palette, Home, RotateCcw, Star } from 'lucide-react';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';
import { useNavigate } from 'react-router-dom';

const CORES_CONFETE = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
const NUMERO_CONFETES = 30;

interface Props { 
  aoReiniciar: () => void; 
  aoSair: () => void; // Caso queira usar para voltar ao manual
}

const TelaVitoriaCores: React.FC<Props> = ({ aoReiniciar, aoSair }) => {
  const { estaPiscando } = useStore(lojaOlho);
  const [foco, setFoco] = useState<'reiniciar' | 'sair'>('reiniciar');
  const [bloqueado, setBloqueado] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef<any>(null);
  
  // Áudio de vitória
  useEffect(() => {
    const audio = new Audio('/assets/festivalCores/sounds/victory_fanfare.mp3'); // Opcional: Adicione um som festivo
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }, []);

  // Ciclo de foco automático
  useEffect(() => {
    const intervalo = setInterval(() => { 
      setFoco(prev => prev === 'reiniciar' ? 'sair' : 'reiniciar'); 
    }, 2000);
    return () => clearInterval(intervalo);
  }, []);

  // Detecção de piscada
  useEffect(() => {
    if (estaPiscando && !bloqueado) {
      setBloqueado(true);
      if (foco === 'reiniciar') aoReiniciar(); 
      else navigate('/jogos/teclado'); // Volta para seleção de jogos
      
      timerRef.current = setTimeout(() => setBloqueado(false), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [estaPiscando, foco, bloqueado]);

  return (
    <S.FundoVitoria>
      {/* Chuva de Tinta (Confetes) */}
      {Array.from({ length: NUMERO_CONFETES }).map((_, i) => (
        <S.ConfeteTinta
          key={i}
          style={{
            '--left': `${Math.random() * 100}%`,
            '--color': CORES_CONFETE[Math.floor(Math.random() * CORES_CONFETE.length)],
            '--size': `${Math.random() * 15 + 10}px`, // Tamanhos variados
            '--duration': `${Math.random() * 2 + 2}s`,
            '--delay': `${Math.random() * 2}s`
          } as React.CSSProperties}
        />
      ))}

      <S.PlacaVitoria>
        <S.IconeContainer>
          <S.HaloLuz />
          <S.IconePrincipal>
            <Palette size={80} strokeWidth={1.5} />
          </S.IconePrincipal>
          {/* Estrelinhas decorativas */}
          <Star size={30} fill="#FFD700" style={{position: 'absolute', top: -10, right: -10}} stroke="none" />
          <Star size={20} fill="#FFD700" style={{position: 'absolute', bottom: 0, left: -10}} stroke="none" />
        </S.IconeContainer>
        
        <S.Titulo>Obra-Prima!</S.Titulo>
        
        <S.Mensagem>
          Uau! Você pintou o quadro perfeitamente. As cores ficaram lindas!<br/>
          <strong>Você é um verdadeiro artista!</strong>
        </S.Mensagem>

        <S.ContainerBotoes>
          <S.Botao onClick={aoReiniciar} $focado={foco === 'reiniciar'}>
             <RotateCcw size={28} /> Pintar Outro
          </S.Botao>
          <S.Botao onClick={() => navigate('/jogos/teclado')} $focado={foco === 'sair'}>
             <Home size={28} /> Sair
          </S.Botao>
        </S.ContainerBotoes>
      </S.PlacaVitoria>
    </S.FundoVitoria>
  );
};

export default TelaVitoriaCores;