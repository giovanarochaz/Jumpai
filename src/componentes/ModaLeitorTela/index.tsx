import React from 'react';
import * as S from './styles';

interface ModalLeitorTelaProps {
  estaAberto: boolean;
  aoEscolher: (ativar: boolean) => void;
}

const ModalLeitorTela: React.FC<ModalLeitorTelaProps> = ({ estaAberto, aoEscolher }) => {
  if (!estaAberto) return null;

  return (
    <S.Overlay>
      <S.ConteudoModal>
        <S.IconeLeitor src="/assets/modal/leitor.png" alt="Ícone de Acessibilidade" />
        <S.Titulo>Leitor de Texto</S.Titulo>
        <S.Descricao>
          Deseja ativar a narração automática? <br />
          <strong>Eu posso ler as instruções e textos dos jogos para você.</strong>
        </S.Descricao>
        
        <S.ContainerBotoes>
          <S.BotaoSim onClick={() => aoEscolher(true)}>
            SIM, ATIVAR
          </S.BotaoSim>
          <S.BotaoNao onClick={() => aoEscolher(false)}>
            NÃO, OBRIGADO
          </S.BotaoNao>
        </S.ContainerBotoes>
      </S.ConteudoModal>
    </S.Overlay>
  );
};

export default ModalLeitorTela;