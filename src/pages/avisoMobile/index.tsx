import React from 'react';
import { Gamepad2, Trophy, BookOpen, Smartphone, Monitor } from 'lucide-react';
import { 
  MainContainer, NavBar, NavLogo, NavMenu, NavItem, ContentWrapper, HeaderSection,
  GameTitle, DescriptionText, CardText,
  WarningCard,
  IconGroup,
  CardTitle
} from './styles';
import { cores } from '../../estilos/cores';

const TelaDeAvisoMobile: React.FC = () => {
  const handleHome = () => {};
  const handlePremios = () => {};
  const handleHistoria = () => {};

  return (
    <MainContainer>
      <NavBar>
        <NavLogo onClick={handleHome} aria-label="JUMPAI Home">
          <Gamepad2 size={32} strokeWidth={2.5} />
          <span>JUMPAI</span>
        </NavLogo>

        <NavMenu>
          <NavItem onClick={handlePremios}>
            <Trophy size={18} />
            <span>Prêmios</span>
          </NavItem>
          <NavItem onClick={handleHistoria}>
            <BookOpen size={18} />
            <span>História</span>
          </NavItem>
        </NavMenu>
      </NavBar>

      <ContentWrapper>
        <HeaderSection>
          <GameTitle>
            JUMPAI
          </GameTitle>
          
          <DescriptionText>
            A aventura te espera, mas precisamos de uma tela maior!
          </DescriptionText>
        </HeaderSection>

        <WarningCard>
          <div className="card-content">
            <IconGroup>
              <Smartphone size={40} className="mobile-icon" color={cores.roxo} />
              <span className="arrow">➔</span>
              <Monitor size={56} className="monitor-icon" color={cores.roxo} />
            </IconGroup>
            
            <CardTitle>Tela Pequena</CardTitle>
            
            <CardText>
              O <strong>JumpAI</strong> foi criado para ser jogado em <strong>computadores</strong> ou <strong>notebooks</strong> para garantir a melhor experiência com a câmera.
              <br /><br />
              Por favor, acesse de um dispositivo maior!
            </CardText>
          </div>
        </WarningCard>

      </ContentWrapper>
    </MainContainer>
  );
};

export default TelaDeAvisoMobile;