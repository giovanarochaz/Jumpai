import { create } from 'zustand';
import React from 'react';

// Constante para o limiar de luminosidade (valores de 0 a 255)
const LIMIAR_LUMINOSIDADE = 20;

// A interface define a estrutura do nosso estado e as ações disponíveis
interface EstadoIluminacao {
  precisaDeIluminacao: boolean;
  // MUDANÇA NA TIPAGEM: A RefObject agora pode conter um elemento ou null.
  videoRef: React.RefObject<HTMLVideoElement | null> | null;
  // MUDANÇA NA TIPAGEM: A função setVideoRef agora aceita o tipo correto.
  setVideoRef: (ref: React.RefObject<HTMLVideoElement | null> | null) => void;
  verificarLuminosidade: () => Promise<void>;
  ligarIluminacao: () => void;
  desligarIluminacao: () => void;
}

export const iluminacaoStore = create<EstadoIluminacao>((set, get) => ({
  // O estado inicial
  precisaDeIluminacao: false,
  videoRef: null,

  // Ação para que outros componentes possam nos dizer qual <video> observar
  setVideoRef: (ref) => {
    set({ videoRef: ref });
  },

  // Ação para ligar manualmente a iluminação
  ligarIluminacao: () => {
    set({ precisaDeIluminacao: true });
  },

  // Ação para desligar manualmente a iluminação
  desligarIluminacao: () => {
    set({ precisaDeIluminacao: false });
  },

  // Ação principal que analisa o vídeo e decide se a luz é necessária
  verificarLuminosidade: async () => {
    const { videoRef } = get();
    const video = videoRef?.current;

    if (!video) {
      console.warn("[Iluminação Global] O Ref do vídeo não foi definido. Impossível verificar a luminosidade.");
      return;
    }

    // Usamos um canvas temporário para "ler" os pixels do vídeo
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const contexto = canvas.getContext('2d', { willReadFrequently: true });
    if (!contexto) return;

    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = contexto.getImageData(0, 0, canvas.width, canvas.height);
    const dadosDosPixels = imageData.data;
    let somaLuminosidade = 0;

    // Analisamos uma amostra de pixels para calcular a luminosidade média
    for (let i = 0; i < dadosDosPixels.length; i += 400) {
        somaLuminosidade += (dadosDosPixels[i] + dadosDosPixels[i + 1] + dadosDosPixels[i + 2]) / 3;
    }
    const mediaLuminosidade = somaLuminosidade / (dadosDosPixels.length / 400);

    console.log(`[Iluminação Global] Média de luminosidade detectada: ${mediaLuminosidade.toFixed(2)}`);

    // Com base na média, atualizamos o estado 'precisaDeIluminacao'
    if (mediaLuminosidade < LIMIAR_LUMINOSIDADE) {
      console.log("[Iluminação Global] Ambiente escuro detectado. Ativando iluminação.");
      set({ precisaDeIluminacao: true });
    } else {
      console.log("[Iluminação Global] Ambiente claro o suficiente. Iluminação não necessária.");
      set({ precisaDeIluminacao: false });
    }
  },
}));