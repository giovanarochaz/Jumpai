import { useEffect } from 'react';
import { useStore } from 'zustand';
import { lojaOlho } from '../lojas/lojaOlho';
import { narrarParaOcular, pararNarracao } from '../servicos/acessibilidade';

/**
 * Hook para narrar textos automaticamente
 * @param texto Texto a ser lido
 * @param dependencias Array de dependências para disparar a leitura
 * @param aoTerminar Callback opcional após o fim da fala
 */
export const useLeitorOcular = (
  texto: string | null, 
  dependencias: any[], 
  aoTerminar?: () => void
) => {
  // Acessa os estados da loja Zustand
  const { mostrarCameraFlutuante, leitorAtivo } = useStore(lojaOlho);

  useEffect(() => {
    // Condição de ouro: Câmera flutuante ativa + Usuário permitiu leitor + Existe texto
    if (mostrarCameraFlutuante && leitorAtivo && texto) {
      const timer = setTimeout(() => {
        narrarParaOcular(texto, aoTerminar);
      }, 600); // Pequeno delay para fluidez visual (ex: trocas de tela)
      
      return () => {
        clearTimeout(timer);
        pararNarracao();
      };
    } else {
      // Se qualquer condição falhar, para a narração imediatamente
      pararNarracao();
    }
  }, [mostrarCameraFlutuante, leitorAtivo, texto, ...dependencias]);
};