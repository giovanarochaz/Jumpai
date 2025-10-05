import { create } from 'zustand';
import React from 'react';

const LIMIAR_LUMINOSIDADE = 20;

export interface EstadoIluminacao {
  precisaDeIluminacao: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null> | null;
  setVideoRef: (ref: React.RefObject<HTMLVideoElement | null> | null) => void;
  verificarLuminosidade: () => Promise<void>;
  ligarIluminacao: () => void;
  desligarIluminacao: () => void;
}

export const lojaIluminacao = create<EstadoIluminacao>((set, get) => ({
  precisaDeIluminacao: false,
  videoRef: null,
  setVideoRef: (ref) => {
    set({ videoRef: ref });
  },
  ligarIluminacao: () => {
    set({ precisaDeIluminacao: true });
  },
  desligarIluminacao: () => {
    set({ precisaDeIluminacao: false });
  },
  verificarLuminosidade: async () => {
    const { videoRef } = get();
    const video = videoRef?.current;
    if (!video) {
      console.warn("[Iluminação Global] O Ref do vídeo não foi definido. Impossível verificar a luminosidade.");
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const contexto = canvas.getContext('2d', { willReadFrequently: true });
    if (!contexto) return;
    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = contexto.getImageData(0, 0, canvas.width, canvas.height);
    const dadosDosPixels = imageData.data;
    let somaLuminosidade = 0;
    for (let i = 0; i < dadosDosPixels.length; i += 400) {
        somaLuminosidade += (dadosDosPixels[i] + dadosDosPixels[i + 1] + dadosDosPixels[i + 2]) / 3;
    }
    const mediaLuminosidade = somaLuminosidade / (dadosDosPixels.length / 400);
    console.log(`[Iluminação Global] Média de luminosidade detectada: ${mediaLuminosidade.toFixed(2)}`);
    if (mediaLuminosidade < LIMIAR_LUMINOSIDADE) {
      console.log("[Iluminação Global] Ambiente escuro detectado. Ativando iluminação.");
      set({ precisaDeIluminacao: true });
    } else {
      console.log("[Iluminação Global] Ambiente claro o suficiente. Iluminação não necessária.");
      set({ precisaDeIluminacao: false });
    }
  },
}));
