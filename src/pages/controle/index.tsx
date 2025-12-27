import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Keyboard, Sparkles } from 'lucide-react';

import { 
  MainContainer, ContentWrapper, HeaderSection,
  GameTitle, SubtitleWrapper, DescriptionText,
  NavigationSection, SelectionCard, CardText, CardDescription
} from './styles';
import Menu from '../../componentes/Menu';

const Controle: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToEyeControl = useCallback(() => {
    navigate('/calibragemOcular');
  }, [navigate]);

  const handleNavigateToKeyboardControl = useCallback(() => {
    navigate('/jogos');
  }, [navigate]);

  return (
    <MainContainer>
      
      <Menu />

      <ContentWrapper>
        <HeaderSection>
          <GameTitle>
            JUMPAI
            <Sparkles className="decor-icon" size={40} />
          </GameTitle>

          <DescriptionText>
            Um jogo educativo e acessível para todos! Explore mundos incríveis 
            usando o poder dos seus olhos ou a agilidade dos seus dedos.
          </DescriptionText>

          <SubtitleWrapper>Como você quer jogar hoje?</SubtitleWrapper>
        </HeaderSection>

        <NavigationSection>
          <SelectionCard onClick={handleNavigateToEyeControl}>
            <Eye size={56} />
            <CardText>Controle Ocular</CardText>
            <CardDescription>Pisque para jogar</CardDescription>
          </SelectionCard>

          <SelectionCard onClick={handleNavigateToKeyboardControl}>
            <Keyboard size={56} />
            <CardText>Controle Teclado</CardText>
            <CardDescription>Use as setas</CardDescription>
          </SelectionCard>
        </NavigationSection>
      </ContentWrapper>

    </MainContainer>
  );
};

export default Controle;
