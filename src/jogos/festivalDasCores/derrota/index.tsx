import React, { useEffect, useState, useRef } from 'react';
import * as S from './styles'; // Importa os estilos de "Ateliê Bagunçado"
import { XCircle, Home, RotateCcw } from 'lucide-react';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';
import { useNavigate } from 'react-router-dom';

interface Props { 
  aoReiniciar: () => void; 
  aoSair: () => void; 
}

const TelaDerrotaCores: React.FC<Props> = ({ aoReiniciar, aoSair }) => {
  const { estaPiscando } = useStore(lojaOlho);
  const [foco, setFoco] = useState<'reiniciar' | 'sair'>('reiniciar');
  const [bloqueado, setBloqueado] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef<any>(null);

  // Efeito Sonoro de "Erro/Tinta Caindo"
  useEffect(() => {
    const audio = new Audio('/assets/festivalCores/sounds/erro.mp3'); // Certifique-se de ter esse som ou remova
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }, []);

  // Ciclo de foco automático para acessibilidade
  useEffect(() => {
    const intervalo = setInterval(() => { 
      setFoco(prev => prev === 'reiniciar' ? 'sair' : 'reiniciar'); 
    }, 2000);
    return () => clearInterval(intervalo);
  }, []);

  // Detecção de piscada ou Tecla Enter
  useEffect(() => {
    const acaoConfirmada = () => {
      if (bloqueado) return;
      setBloqueado(true);
      
      if (foco === 'reiniciar') aoReiniciar(); 
      else navigate('/jogos/teclado');
      
      timerRef.current = setTimeout(() => setBloqueado(false), 1000);
    };

    if (estaPiscando) acaoConfirmada();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') acaoConfirmada();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener('keydown', handleKey);
    };
  }, [estaPiscando, foco, bloqueado, aoReiniciar, navigate]);

  return (
    <S.FundoDerrota>
      <S.PlacaDerrota>
        <S.IconeContainer>
          {/* Ícone de Erro Artístico */}
          <XCircle size={60} strokeWidth={2.5} />
        </S.IconeContainer>
        
        <S.Titulo>Pintura Incompleta</S.Titulo>
        
        <S.Mensagem>
          Ops! As cores não ficaram iguais ao modelo. A arte exige prática!<br/>
          <strong>Vamos limpar o pincel e tentar de novo?</strong>
        </S.Mensagem>

        <S.ContainerBotoes>
          <S.Botao 
            onClick={aoReiniciar} 
            $focado={foco === 'reiniciar'}
          >
             <RotateCcw size={24} /> Tentar
          </S.Botao>
          
          <S.Botao 
            onClick={() => navigate('/jogos/teclado')} 
            $focado={foco === 'sair'}
          >
             <Home size={24} /> Sair
          </S.Botao>
        </S.ContainerBotoes>
      </S.PlacaDerrota>
    </S.FundoDerrota>
  );
};

export default TelaDerrotaCores;