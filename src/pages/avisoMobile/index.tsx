import React from 'react';
import { ContainerAviso, TituloAviso, MensagemAviso } from './styles';
import { MonitorOff } from 'lucide-react';
import { cores } from '../../estilos/cores';

const TelaDeAvisoMobile: React.FC = () => {
  return (
    <ContainerAviso>
      <MonitorOff size={80} color={cores.amarelo} />
      <TituloAviso>Oops!</TituloAviso>
      <MensagemAviso>
        O JumpAI foi criado para ser jogado em computadores ou notebooks para a
        melhor experiência. Por favor, acesse de um dispositivo maior.
      </MensagemAviso>
    </ContainerAviso>
  );
};

export default TelaDeAvisoMobile;