import React, { useCallback } from 'react';
import { Gamepad2, BookOpen } from 'lucide-react';
import { NavBar, NavItem, NavLogo, NavMenu } from './styles';
import { useNavigate } from 'react-router-dom';

const Menu: React.FC = () => {
  const navigate = useNavigate();

  const irParaJogos = useCallback(() => {
    navigate('/jogos');
  }, [navigate]);

  const irParaHistoria = useCallback(() => {
    navigate('/historia');
  }, [navigate]);

  
  return (
    <NavBar>
      <NavLogo aria-label="JUMPAI Home">
        <Gamepad2 size={32} strokeWidth={2.5} />
        <span>JUMPAI</span>
      </NavLogo>

      <NavMenu>
        <NavItem onClick={irParaJogos} tabIndex={0} role="button" aria-label="Navegar para Jogos">
          <Gamepad2 size={18} />
          <span>Jogos</span>
        </NavItem>
        <NavItem onClick={irParaHistoria} tabIndex={0} role="button" aria-label="Navegar para História">
          <BookOpen size={18} />
          <span>História</span>
        </NavItem>
      </NavMenu>
    </NavBar>
  );
};

export default Menu;
