/**
 * Narra um texto e executa uma função ao finalizar.
 * @param texto Frase a ser dita
 * @param onEnd Callback opcional executado quando a fala termina
 */
export const narrarParaOcular = (texto: string, onEnd?: () => void) => {
  window.speechSynthesis.cancel();

  const mensagem = new SpeechSynthesisUtterance(texto);
  mensagem.lang = 'pt-BR';
  mensagem.rate = 1.1; 

  if (onEnd) {
    mensagem.onend = () => {
      onEnd();
    };
  }

  window.speechSynthesis.speak(mensagem);
};

export const pararNarracao = () => {
  window.speechSynthesis.cancel();
};