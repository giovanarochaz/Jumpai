import { create } from 'zustand';

export interface EstadoOlho {
  alturaMedia: number;
  estaPiscando: boolean;
  setAlturaMedia: (altura: number) => void;
  setEstaPiscando: (piscando: boolean) => void;
  subscribePiscando: (callback: (piscando: boolean) => void) => () => void;
}

export const lojaOlho = create<EstadoOlho>((set, get) => ({
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
  subscribePiscando: (callback: (piscando: boolean) => void): () => void => {
    const unsubscribe = lojaOlho.subscribe(
      (state, prevState) => {
        if (state.estaPiscando !== prevState.estaPiscando) {
          callback(state.estaPiscando);
        }
      }
    );
    return unsubscribe;
  },
}));
