/**
 * Narra um texto e executa uma função ao finalizar.
 * @param texto Frase a ser dita
 * @param onEnd Callback opcional executado quando a fala termina
 */
export const narrarParaOcular = (texto: string, onEnd?: () => void) => {
  window.speechSynthesis.cancel();

  const mensagem = new SpeechSynthesisUtterance(texto);
  
  // 1. Tenta selecionar uma voz de alta qualidade
  const vozes = window.speechSynthesis.getVoices();
  const vozMelhorada = vozes.find(v => v.name.includes('Google') && v.lang === 'pt-BR') 
                    || vozes.find(v => v.lang === 'pt-BR');

  if (vozMelhorada) mensagem.voice = vozMelhorada;

  // 2. Ajustes para Alfabetização
  mensagem.lang = 'pt-BR';
  mensagem.rate = 0.85; // Um pouco mais lento para clareza
  mensagem.pitch = 1.1; // Tom levemente mais agudo soa mais amigável/infantil

  if (onEnd) {
    mensagem.onend = () => onEnd();
  }

  window.speechSynthesis.speak(mensagem);
};

// Importante: as vozes demoram um pouco para carregar no navegador
window.speechSynthesis.onvoiceschanged = () => {
  window.speechSynthesis.getVoices();
};

export const pararNarracao = () => {
  window.speechSynthesis.cancel();
};