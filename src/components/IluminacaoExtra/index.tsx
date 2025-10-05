import React from 'react';
import { useStore } from 'zustand';
import { iluminacaoStore } from '../../interface/iluminacaoStore';
import { RingLightInferior, RingLightSuperior } from './styles';

const IluminacaoGlobal: React.FC = () => {
  // O componente "escuta" o estado global.
  // Sempre que 'precisaDeIluminacao' mudar, o componente será re-renderizado.
  const precisaDeIluminacao = useStore(iluminacaoStore, (estado) => estado.precisaDeIluminacao);

  // Se a iluminação não for necessária, não renderiza nada.
  if (!precisaDeIluminacao) {
    return null;
  }

  // Se for necessária, renderiza a barra de luz no topo.
  return (
    <><RingLightSuperior /><RingLightInferior /></>
  );
};

export default IluminacaoGlobal;