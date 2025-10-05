import type { StateCreator } from 'zustand';

export interface EstadoIluminacao {
  precisaDeIluminacao: boolean;
  setPrecisaDeIluminacao: (valor: boolean) => void;
}

export const lojaIluminacao: StateCreator<EstadoIluminacao> = (set) => ({
  precisaDeIluminacao: false,
  setPrecisaDeIluminacao: (valor) => set({ precisaDeIluminacao: valor }),
});
