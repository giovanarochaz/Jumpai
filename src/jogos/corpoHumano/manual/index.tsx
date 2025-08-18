import React from 'react';
import * as S from './styles';
import { HeartPulse, Shield, ShieldOff, GitCommit, Dna } from 'lucide-react';

interface ManualCorpoHumanoProps {
  onStart: () => void;
}

const ManualCorpoHumano: React.FC<ManualCorpoHumanoProps> = ({ onStart }) => {
  return (
    <S.ManualOverlay>
      <S.ManualContent>
        <S.Titulo>Missão Corpo Humano!</S.Titulo>

        <S.Secao>
          <S.IconeWrapper>
            <S.ImagemIcone src="/assets/corpoHumano/nanosub.png" alt="Nanosubmarino" />
          </S.IconeWrapper>
          <S.TextoWrapper>
            <h3>Pilote o Nanosub!</h3>
            <p>Pisque ou clique para fazer seu submarino <strong>mudar de direção</strong>. Desvie dos perigos e complete as missões!</p>
          </S.TextoWrapper>
        </S.Secao>

        <S.Secao>
          <S.IconeWrapper><HeartPulse size={48} strokeWidth={2.5} /></S.IconeWrapper>
          <S.TextoWrapper>
            <h3>Objetivos da Missão</h3>
            <p>Colete <strong>Oxigênio</strong> e <strong>Anticorpos</strong> para ajudar o corpo. Sua missão atual aparece no topo da tela.</p>
          </S.TextoWrapper>
        </S.Secao>

        <S.Secao>
          <S.IconeWrapper><Shield size={48} strokeWidth={2.5} /></S.IconeWrapper>
          <S.TextoWrapper>
            <h3>Sistema de Defesa</h3>
            <p>Colete <strong>Leucócitos</strong> (células brancas) para te ajudar! Eles são seus guarda-costas e destroem os vírus.</p>
          </S.TextoWrapper>
        </S.Secao>

        <S.Secao>
          <S.IconeWrapper><ShieldOff size={48} strokeWidth={2.5} /></S.IconeWrapper>
          <S.TextoWrapper>
            <h3>Cuidado com os Vírus!</h3>
            <p>Bater em um <strong>Vírus</strong> diminui a energia do seu submarino. Se a energia acabar, a missão falha!</p>
          </S.TextoWrapper>
        </S.Secao>

        <S.BotaoIniciar onClick={onStart}>
          Iniciar Missão!
        </S.BotaoIniciar>

      </S.ManualContent>
    </S.ManualOverlay>
  );
};

export default ManualCorpoHumano;