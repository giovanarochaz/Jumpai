import React from 'react';
import * as S from './styles';
import { ShieldAlert } from 'lucide-react';

interface TelaDerrotaProps {
  onRestart: () => void;
}

const TelaDerrota: React.FC<TelaDerrotaProps> = ({ onRestart }) => {
  return (
    <S.DefeatOverlay>
      <S.DefeatContent>
        <S.DefeatIcon>
          <ShieldAlert size={100} strokeWidth={1.5} />
        </S.DefeatIcon>
        <S.DefeatTitle>MISSÃO FALHOU!</S.DefeatTitle>
        <S.DefeatMessage>
          Oh não! A energia do seu nanosubmarino acabou. O corpo precisa da sua ajuda. Não desista, tente novamente!
        </S.DefeatMessage>
        <S.ButtonContainer>
          <S.DefeatButton onClick={onRestart}>Tentar Novamente</S.DefeatButton>
        </S.ButtonContainer>
      </S.DefeatContent>
    </S.DefeatOverlay>
  );
};

export default TelaDerrota;