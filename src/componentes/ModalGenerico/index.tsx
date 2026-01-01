import React, { useEffect } from 'react';
import * as S from './estilos';

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
  duracaoEmSegundos = 4, 
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

  if (!estaAberto) return null;

  return (
    <S.FundoDoModal>
      <S.ConteudoDoModal>
        <S.ImagemDoModal src={imagemSrc} alt="Ícone" />
        <S.TituloDoModal>{titulo}</S.TituloDoModal>
        <S.DescricaoDoModal>{descricao}</S.DescricaoDoModal>
      </S.ConteudoDoModal>
    </S.FundoDoModal>
  );
};

export default ModalGenerico;