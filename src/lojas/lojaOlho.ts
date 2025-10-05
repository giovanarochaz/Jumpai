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
  alturaMedia: number; // Média combinada dos dois olhos
  alturaMediaEsquerda: number; // NOVO: Média específica do olho esquerdo
  alturaMediaDireita: number; // NOVO: Média específica do olho direito
  estaPiscando: boolean;
  piscadaEsquerda: boolean;
  piscadaDireita: boolean;
  
  setAlturaMedia: (altura: number) => void;
  setAlturaMediaEsquerda: (altura: number) => void; // NOVA AÇÃO
  setAlturaMediaDireita: (altura: number) => void; // NOVA AÇÃO
  setEstaPiscando: (piscando: boolean) => void;
  setPiscadaEsquerda: (piscando: boolean) => void;
  setPiscadaDireita: (piscando: boolean) => void;

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
  alturaMediaEsquerda: 0, // NOVO ESTADO
  alturaMediaDireita: 0, // NOVO ESTADO
  estaPiscando: false,
  piscadaEsquerda: false,
  piscadaDireita: false,
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
  // NOVAS AÇÕES
  setAlturaMediaEsquerda: (altura) => {
    set({ alturaMediaEsquerda: altura });
  },
  setAlturaMediaDireita: (altura) => {
    set({ alturaMediaDireita: altura });
  },
  setEstaPiscando: (piscando) => {
    if (get().estaPiscando !== piscando) {
      set({ estaPiscando: piscando });
    }
  },
  setPiscadaEsquerda: (piscando) => {
    if (get().piscadaEsquerda !== piscando) {
      set({ piscadaEsquerda: piscando });
    }
  },
  setPiscadaDireita: (piscando) => {
    if (get().piscadaDireita !== piscando) {
      set({ piscadaDireita: piscando });
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