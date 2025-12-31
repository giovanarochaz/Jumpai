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
  // --- Calibragem e Sensibilidade ---
  alturaMedia: number; 
  alturaMediaEsquerda: number; 
  alturaMediaDireita: number; 
  
  // --- Estados de Detecção em Tempo Real ---
  estaPiscando: boolean;
  piscadaEsquerda: boolean;
  piscadaDireita: boolean;
  
  // --- Acessibilidade e Preferências (NOVO) ---
  leitorAtivo: boolean; // Controla se o narrador deve falar ou não
  
  // --- Funções de Escrita (Ações) ---
  setAlturaMedia: (altura: number) => void;
  setAlturaMediaEsquerda: (altura: number) => void;
  setAlturaMediaDireita: (altura: number) => void;
  setEstaPiscando: (piscando: boolean) => void;
  setPiscadaEsquerda: (piscando: boolean) => void;
  setPiscadaDireita: (piscando: boolean) => void;
  setLeitorAtivo: (ativo: boolean) => void; // NOVA AÇÃO

  // --- Câmera Flutuante e Detecção Global ---
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
  // --- Estados Iniciais ---
  alturaMedia: 0,
  alturaMediaEsquerda: 0,
  alturaMediaDireita: 0,
  estaPiscando: false,
  piscadaEsquerda: false,
  piscadaDireita: false,
  
  leitorAtivo: false, // Por padrão, o leitor começa desativado
  
  videoRefGlobal: null,
  mostrarCameraFlutuante: false,
  pontosDoOlho: {
    topoEsquerdo: null,
    baseEsquerdo: null,
    topoDireito: null,
    baseDireito: null
  },

  setAlturaMedia: (altura) => set({ alturaMedia: altura }),
  setAlturaMediaEsquerda: (altura) => set({ alturaMediaEsquerda: altura }),
  setAlturaMediaDireita: (altura) => set({ alturaMediaDireita: altura }),
  
  setLeitorAtivo: (ativo) => set({ leitorAtivo: ativo }), 

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

  setVideoRefGlobal: (ref) => set({ videoRefGlobal: ref }),
  
  setMostrarCameraFlutuante: (mostrar) => set({ mostrarCameraFlutuante: mostrar }),
  
  setPontosDoOlho: (pontos) => set({ pontosDoOlho: pontos }),
}));