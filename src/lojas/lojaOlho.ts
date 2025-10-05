import { create } from 'zustand';
import React from 'react';

// Interface para os pontos do olho (landmarks)
interface Ponto {
  x: number;
  y: number;
  z?: number;
}

// Interface principal da nossa loja global
interface EstadoOlho {
  alturaMedia: number;
  estaPiscando: boolean;
  setAlturaMedia: (altura: number) => void;
  setEstaPiscando: (piscando: boolean) => void;

  // Estados e Ações para a Câmera Flutuante e Detecção Global
  videoRefGlobal: React.RefObject<HTMLVideoElement | null> | null;
  mostrarCameraFlutuante: boolean;
  pontosDoOlho: {
    topoEsquerdo: Ponto | null,
    baseEsquerdo: Ponto | null,
    topoDireito: Ponto | null,
    baseDireito: Ponto | null
  };
  setVideoRefGlobal: (ref: React.RefObject<HTMLVideoElement | null>) => void;
  setMostrarCameraFlutuante: (mostrar: boolean) => void;
  setPontosDoOlho: (pontos: {
    topoEsquerdo: Ponto | null,
    baseEsquerdo: Ponto | null,
    topoDireito: Ponto | null,
    baseDireito: Ponto | null
  }) => void;
}

export const lojaOlho = create<EstadoOlho>((set, get) => ({
  // Estados
  alturaMedia: 0,
  estaPiscando: false,
  videoRefGlobal: null,
  mostrarCameraFlutuante: false,
  pontosDoOlho: {
    topoEsquerdo: null,
    baseEsquerdo: null,
    topoDireito: null,
    baseDireito: null
  },

  // Ações
  setAlturaMedia: (altura) => {
    set({ alturaMedia: altura });
  },
  setEstaPiscando: (piscando) => {
    if (get().estaPiscando !== piscando) {
      set({ estaPiscando: piscando });
    }
  },
  setVideoRefGlobal: (ref) => {
    set({ videoRefGlobal: ref });
  },
  setMostrarCameraFlutuante: (mostrar) => {
    set({ mostrarCameraFlutuante: mostrar });
  },
  setPontosDoOlho: (pontos) => {
    set({ pontosDoOlho: pontos });
  },
}));