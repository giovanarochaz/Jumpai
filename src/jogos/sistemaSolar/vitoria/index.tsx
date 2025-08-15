import React, { useState, useEffect } from 'react';
import * as S from './styles';
import { Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CORES_FOGOS = ['#FFD700', '#FF4500', '#2AD352', '#00BFFF', '#FF1493', '#ADFF2F'];
const NUMERO_FOGOS = 50;
const PARTICULAS_POR_FOGO = 12;

interface FireworkData {
  id: number;
  top: string;
  left: string;
  color: string;
  delay: string;
}

interface TelaVitoriaProps {
  onRestart: () => void;
}

const TelaVitoria: React.FC<TelaVitoriaProps> = ({ onRestart }) => {
  const [fogosData, setFogosData] = useState<FireworkData[]>([]);
  const navigate = useNavigate();

  // Gera os dados aleatórios para os fogos de artifício apenas uma vez
  useEffect(() => {
    const data: FireworkData[] = [];
    for (let i = 0; i < NUMERO_FOGOS; i++) {
      data.push({
        id: i,
        top: `${Math.random() * 80 + 10}%`, // Evita as bordas extremas
        left: `${Math.random() * 80 + 10}%`,
        color: CORES_FOGOS[Math.floor(Math.random() * CORES_FOGOS.length)],
        delay: `${Math.random() * 2}s`, // Delay inicial da explosão
      });
    }
    setFogosData(data);
  }, []);

  const handleOutroJogo = () => {
    navigate('/jogos/teclado');
  };

  return (
    <S.VictoryOverlay>
      {/* Mapeia os dados dos fogos e renderiza CADA EXPLOSÃO na tela cheia */}
      {fogosData.map(fogo => (
        <S.FireworkContainer
          key={fogo.id}
          style={{
            '--top': fogo.top,
            '--left': fogo.left,
          } as React.CSSProperties}
        >
          {/* Renderiza as partículas para CADA explosão */}
          {Array.from({ length: PARTICULAS_POR_FOGO }).map((_, index) => (
            <S.FireworkParticle
              key={index}
              style={{
                '--color': fogo.color,
                '--delay': fogo.delay,
              } as React.CSSProperties}
            />
          ))}
        </S.FireworkContainer>
      ))}

      <S.VictoryContent>
        <S.TrophyIcon>
          <Trophy size={100} strokeWidth={1.5} />
        </S.TrophyIcon>
        <S.VictoryTitle>MISSÃO COMPLETA!</S.VictoryTitle>
        <S.VictoryMessage>
          Parabéns, explorador espacial! Você catalogou todos os planetas na ordem correta e se tornou um mestre do Sistema Solar!
        </S.VictoryMessage>
        <S.ButtonContainer>
          <S.VictoryButton onClick={onRestart}>Jogar Novamente</S.VictoryButton>
          <S.VictoryButton onClick={handleOutroJogo}>Outro Jogo</S.VictoryButton>
        </S.ButtonContainer>
      </S.VictoryContent>
    </S.VictoryOverlay>
  );
};

export default TelaVitoria;