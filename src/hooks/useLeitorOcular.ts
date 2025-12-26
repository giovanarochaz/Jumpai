// src/hooks/useLeitorOcular.ts
import { useEffect } from 'react';
import { useStore } from 'zustand';
import { lojaOlho } from '../lojas/lojaOlho';
import { narrarParaOcular, pararNarracao } from '../servicos/acessibilidade';

export const useLeitorOcular = (
  texto: string | null, 
  dependencias: any[], 
  aoTerminar?: () => void
) => {
  const mostrarCameraFlutuante = useStore(lojaOlho, (state) => state.mostrarCameraFlutuante);

  useEffect(() => {
    // Só narra se o modo ocular estiver ativo e houver texto
    if (mostrarCameraFlutuante && texto) {
      const timer = setTimeout(() => {
        narrarParaOcular(texto, aoTerminar);
      }, 600); // Aguarda o fim da animação de deslize do carrossel
      
      return () => {
        clearTimeout(timer);
        pararNarracao();
      };
    } else if (!mostrarCameraFlutuante) {
      pararNarracao();
    }
  }, [mostrarCameraFlutuante, texto, ...dependencias]);
};