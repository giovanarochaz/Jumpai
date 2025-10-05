import React, { useEffect } from 'react';
import { lojaIluminacao } from '../lojas/lojaIluminacao';

/**
 * Um Hook customizado que gerencia automaticamente a iluminação da tela
 * com base na luminosidade do ambiente capturada por um elemento de vídeo.
 * @param videoRef A referência (criada com useRef) para o elemento <video> que está exibindo a câmera.
 */
export const useIluminacaoAutomatica = (videoRef: React.RefObject<HTMLVideoElement | null>) => {
  // Acessando as ações do nosso estado global de iluminação
  const setVideoRef = lojaIluminacao((estado) => estado.setVideoRef);
  const verificarLuminosidade = lojaIluminacao((estado) => estado.verificarLuminosidade);
  const desligarIluminacao = lojaIluminacao((estado) => estado.desligarIluminacao);

  useEffect(() => {
    const elementoDeVideo = videoRef.current;

    // Se não houver um elemento de vídeo, não fazemos nada.
    if (!elementoDeVideo) {
      return;
    }

    // Esta função será nosso gatilho automático.
    const handleVideoLigado = () => {
      console.log("[Hook de Iluminação] Câmera está ativa. Verificando luminosidade...");
      // 1. Informa ao estado global qual vídeo deve ser analisado.
      setVideoRef(videoRef);
      // 2. Comanda a verificação de luminosidade.
      verificarLuminosidade();
    };

    // Adicionamos um "ouvinte" ao elemento de vídeo. O evento 'playing'
    // é disparado assim que a câmera começa a transmitir imagens.
    elementoDeVideo.addEventListener('playing', handleVideoLigado);

    // Esta é a função de "limpeza". Ela é executada quando o componente que usa o hook
    // é desmontado (ou seja, quando o usuário sai da tela).
    return () => {
      console.log("[Hook de Iluminação] Desligando câmera. Limpando e desligando iluminação.");
      // Remove o ouvinte de evento para evitar vazamentos de memória.
      elementoDeVideo.removeEventListener('playing', handleVideoLigado);
      // Informa ao estado global que não há mais um vídeo ativo.
      setVideoRef(null);
      // Garante que a iluminação seja desligada ao sair.
      desligarIluminacao();
    };
  }, [videoRef, setVideoRef, verificarLuminosidade, desligarIluminacao]); // Dependências do useEffect
};