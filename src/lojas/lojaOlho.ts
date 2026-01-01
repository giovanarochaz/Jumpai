import { create } from 'zustand';
import React from 'react';

interface Ponto {
  x: number;
  y: number;
  z?: number;
}

interface EstadoOlho {
  alturaMedia: number; 
  alturaMediaEsquerda: number; 
  alturaMediaDireita: number; 
  
  estaPiscando: boolean;
  piscadaEsquerda: boolean;
  piscadaDireita: boolean;
  
  leitorAtivo: boolean; 
  
  setAlturaMedia: (altura: number) => void;
  setAlturaMediaEsquerda: (altura: number) => void;
  setAlturaMediaDireita: (altura: number) => void;
  setEstaPiscando: (piscando: boolean) => void;
  setPiscadaEsquerda: (piscando: boolean) => void;
  setPiscadaDireita: (piscando: boolean) => void;
  setLeitorAtivo: (ativo: boolean) => void;

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
  alturaMedia: 0,
  alturaMediaEsquerda: 0,
  alturaMediaDireita: 0,
  estaPiscando: false,
  piscadaEsquerda: false,
  piscadaDireita: false,
  leitorAtivo: false, 
  videoRefGlobal: null,
  mostrarCameraFlutuante: false,
  pontosDoOlho: {
    topoEsquerdo: null, baseEsquerdo: null,
    topoDireito: null, baseDireito: null
  },

  setAlturaMedia: (altura) => set({ alturaMedia: altura }),
  setAlturaMediaEsquerda: (altura) => set({ alturaMediaEsquerda: altura }),
  setAlturaMediaDireita: (altura) => set({ alturaMediaDireita: altura }),
  setLeitorAtivo: (ativo) => set({ leitorAtivo: ativo }), 

  setEstaPiscando: (piscando) => {
    // Evita renderizações desnecessárias se o estado for o mesmo
    if (get().estaPiscando !== piscando) {
      set({ estaPiscando: piscando });
    }
  },
  
  setPiscadaEsquerda: (piscando) => set({ piscadaEsquerda: piscando }),
  setPiscadaDireita: (piscando) => set({ piscadaDireita: piscando }),
  setVideoRefGlobal: (ref) => set({ videoRefGlobal: ref }),
  setMostrarCameraFlutuante: (mostrar) => set({ mostrarCameraFlutuante: mostrar }),
  setPontosDoOlho: (pontos) => set({ pontosDoOlho: pontos }),
}));