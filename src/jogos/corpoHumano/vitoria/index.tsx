import React from 'react';
import * as S from './styles';
import { Medal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TelaVitoriaProps {
  onRestart: () => void;
}

const TelaVitoria: React.FC<TelaVitoriaProps> = ({ onRestart }) => {
  const navigate = useNavigate();
  
  const handleOutroJogo = () => {
    navigate('/jogos/teclado');
  };

  return (
    <S.VictoryOverlay>
      <S.VictoryContent>
        <S.VictoryIcon>
          <Medal size={100} strokeWidth={1.5} />
        </S.VictoryIcon>
        <S.VictoryTitle>CORPO SAUDÁVEL!</S.VictoryTitle>
        <S.VictoryMessage>
          Incrível! Você completou todas as missões e ajudou a manter o corpo humano seguro e funcionando. Você é um verdadeiro herói celular!
        </S.VictoryMessage>
        <S.ButtonContainer>
          <S.VictoryButton onClick={onRestart}>Nova Missão</S.VictoryButton>
          <S.VictoryButton onClick={handleOutroJogo}>Outros Jogos</S.VictoryButton>
        </S.ButtonContainer>
      </S.VictoryContent>
    </S.VictoryOverlay>
  );
};

export default TelaVitoria;