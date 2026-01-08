import React, { useState, useRef } from 'react';
import * as S from './styles';

interface ModalInstrucaoProps {
  estaAberto: boolean;
  podePular: boolean;
  aoFinalizar: () => void;
  aoPular: () => void;
}

const ModalInstrucao: React.FC<ModalInstrucaoProps> = ({ 
  estaAberto, 
  podePular, 
  aoFinalizar, 
  aoPular 
}) => {
  const [videoIniciado, setVideoIniciado] = useState(false);
  const [videoFinalizado, setVideoFinalizado] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!estaAberto) return null;

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setVideoIniciado(true);
    }
  };

  const handleVideoEnd = () => {
    setVideoFinalizado(true);
  };

  return (
    <S.Overlay>
      <S.ConteudoModal>
        <S.Titulo>INSTRUÇÃO</S.Titulo>
        
        <S.ContainerVideo>
          <S.VideoInstrucao 
            ref={videoRef}
            onEnded={handleVideoEnd}
            controls={videoIniciado}
          >
            <source src="/assets/videos/instrucao.mp4" type="video/mp4" />
            Seu navegador não suporta vídeos.
          </S.VideoInstrucao>

          {!videoIniciado && (
            <S.BotaoPlayCentral onClick={handlePlay}>
              <S.IconePlay />
            </S.BotaoPlayCentral>
          )}
        </S.ContainerVideo>

        <S.ListaInstrucoes>
          <S.ItemInstrucao>
            <span>(:</span>
            <p>Lembre-se de piscar com calma e seguir as instruções do vídeo.</p>
          </S.ItemInstrucao>
        </S.ListaInstrucoes>
        
        <S.ContainerBotoes>
          <S.BotaoEntendi 
            onClick={aoFinalizar}
            disabled={!videoFinalizado}
          >
            {videoFinalizado ? 'ENTENDI, VAMOS LÁ!' : 'ASSISTA O VÍDEO...'}
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