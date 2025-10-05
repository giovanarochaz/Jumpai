import React, { useEffect } from 'react';
import {
  FundoDoModal,
  ConteudoDoModal,
  ImagemDoModal,
  TituloDoModal,
  DescricaoDoModal
} from './estilos';

interface ModalGenericoProps {
  estaAberto: boolean;
  aoFechar: () => void;
  imagemSrc: string;
  titulo: string;
  descricao: string;
  duracaoEmSegundos?: number;
  acaoAposFechar?: () => void;
}

const ModalGenerico: React.FC<ModalGenericoProps> = ({
  estaAberto,
  aoFechar,
  imagemSrc,
  titulo,
  descricao,
  duracaoEmSegundos = 5,
  acaoAposFechar,
}) => {
  useEffect(() => {
    if (estaAberto) {
      const temporizador = setTimeout(() => {
        aoFechar();
        if (acaoAposFechar) {
          acaoAposFechar();
        }
      }, duracaoEmSegundos * 1000);
      return () => clearTimeout(temporizador);
    }
  }, [estaAberto, aoFechar, acaoAposFechar, duracaoEmSegundos]);

  if (!estaAberto) {
    return null;
  }

  return (
    <FundoDoModal>
      <ConteudoDoModal>
        <ImagemDoModal src={imagemSrc} alt="Ícone do modal" />
        <TituloDoModal>{titulo}</TituloDoModal>
        <DescricaoDoModal>{descricao}</DescricaoDoModal>
      </ConteudoDoModal>
    </FundoDoModal>
  );
};

export default ModalGenerico;
