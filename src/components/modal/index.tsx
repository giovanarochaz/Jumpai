import React, { useEffect } from 'react';
import {
  FundoDoModal,
  ConteudoDoModal,
  ImagemDoModal,
  TituloDoModal,
  DescricaoDoModal
} from './styles';

// ATUALIZADO: Definindo as novas propriedades que o modal aceitará
interface ModalGenericoProps {
  estaAberto: boolean;
  aoFechar: () => void;
  imagemSrc: string;
  titulo: string;
  descricao: string;
  duracaoEmSegundos?: number; // NOVO: Duração opcional, em segundos
  acaoAposFechar?: () => void; // NOVO: Ação a ser executada quando o modal terminar de fechar
}

const ModalGenerico: React.FC<ModalGenericoProps> = ({
  estaAberto,
  aoFechar,
  imagemSrc,
  titulo,
  descricao,
  duracaoEmSegundos = 5, // Valor padrão de 5 segundos
  acaoAposFechar,
}) => {

  // ATUALIZADO: O efeito agora também executa a 'acaoAposFechar'
  useEffect(() => {
    if (estaAberto) {
      const temporizador = setTimeout(() => {
        // Primeiro, chama a função para fechar o modal (esconder da tela)
        aoFechar();
        
        // Em seguida, se uma ação foi fornecida, ela é executada.
        if (acaoAposFechar) {
          acaoAposFechar();
        }
      }, duracaoEmSegundos * 1000); // Usa a duração fornecida

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