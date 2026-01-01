import React from 'react';
import * as S from './styles';

interface ModalInstrucaoProps {
  estaAberto: boolean;
  podePular: boolean;
  aoFinalizar: () => void;
  aoPular: () => void;
}

const ModalInstrucao: React.FC<ModalInstrucaoProps> = ({ estaAberto, podePular, aoFinalizar, aoPular }) => {
  if (!estaAberto) return null;

  return (
    <S.Overlay>
      <S.ConteudoModal>
        <S.Titulo>INSTRUÇÃO</S.Titulo>
        
        <S.ContainerVideo>
          <S.VideoInstrucao controls autoPlay loop>
            <source src="/assets/videos/instrucao.mp4" type="video/mp4" />
            Seu navegador não suporta vídeos.
          </S.VideoInstrucao>
        </S.ContainerVideo>

        <S.ListaInstrucoes>
          <S.ItemInstrucao>
            <span>(:</span>
            <p>Lembre-se de piscar com calma e seguir as instruções do vídeo.</p>
          </S.ItemInstrucao>
        </S.ListaInstrucoes>
        
        <S.ContainerBotoes>
          <S.BotaoEntendi onClick={aoFinalizar}>
            ENTENDI, VAMOS LÁ!
          </S.BotaoEntendi>
          
          {podePular && (
            <S.BotaoPular onClick={aoPular}>
              Pular instrução
            </S.BotaoPular>
          )}
        </S.ContainerBotoes>
      </S.ConteudoModal>
    </S.Overlay>
  );
};

export default ModalInstrucao;