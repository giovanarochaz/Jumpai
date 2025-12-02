// src/components/Menu/index.tsx
import React from 'react';
import { Gamepad2, Trophy, BookOpen } from 'lucide-react';
import { NavBar, NavItem, NavLogo, NavMenu } from './styles';

const Menu: React.FC = () => {
  return (
    <NavBar>
      <NavLogo aria-label="JUMPAI Home">
        <Gamepad2 size={32} strokeWidth={2.5} />
        <span>JUMPAI</span>
      </NavLogo>

      <NavMenu>
        <NavItem>
          <Trophy size={18} />
          <span>Prêmios</span>
        </NavItem>
        <NavItem>
          <BookOpen size={18} />
          <span>História</span>
        </NavItem>
      </NavMenu>
    </NavBar>
  );
};

export default Menu;
