import React from 'react';
import { lojaIluminacao } from '../../lojas/lojaIluminacao';
import { RingLightInferior, RingLightSuperior } from './estilos';

const IluminacaoGlobal: React.FC = () => {
  const precisaDeIluminacao = lojaIluminacao((estado) => estado.precisaDeIluminacao);
  if (!precisaDeIluminacao) {
    return null;
  }
  return (
    <><RingLightSuperior /><RingLightInferior /></>
  );
};

export default IluminacaoGlobal;
