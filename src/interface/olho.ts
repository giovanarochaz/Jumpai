// CÓDIGO CORRIGIDO (com a solução)

import { create } from 'zustand';

// A interface já está correta, o que é ótimo!
interface OlhoState {
  alturaMedia: number;
  estaPiscando: boolean;
  setAlturaMedia: (altura: number) => void;
  setEstaPiscando: (piscando: boolean) => void;
  // Esta linha define o "contrato" da nossa função
  subscribePiscando: (callback: (piscando: boolean) => void) => () => void;
}

export const olhoStore = create<OlhoState>((set, get) => ({
  alturaMedia: 0,
  estaPiscando: false,

  setAlturaMedia: (altura) => {
    set({ alturaMedia: altura });
  },
  setEstaPiscando: (piscando) => {
    if (get().estaPiscando !== piscando) {
      set({ estaPiscando: piscando });
    }
  },

  // AQUI ESTÁ A CORREÇÃO:
  subscribePiscando: (callback: (piscando: boolean) => void): () => void => {
    const unsubscribe = olhoStore.subscribe(
      (state, prevState) => {
        if (state.estaPiscando !== prevState.estaPiscando) {
          callback(state.estaPiscando);
        }
      }
    );
    return unsubscribe;
  },
}));