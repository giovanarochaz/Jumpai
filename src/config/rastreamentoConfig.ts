// Configurações de Intencionalidade (Essencial para AME/ELA)
export const CONFIG_OCULAR = {
  LIMIAR_PISCADA: 0.50,
  DURACAO_MIN_PISCADA: 350,  // Descarta reflexos
  DURACAO_MAX_PISCADA: 1000, // Descarta se o olho ficar fechado por cansaço
  COOLDOWN_CLIQUE: 600,      // Evita cliques duplos acidentais
  
  // Caminhos dos modelos MediaPipe
  MODEL_ASSET_PATH: "https://storage.googleapis.com/mediapipe-assets/face_landmarker.task",
  WASM_PATH: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
};

/**
 * Calcula a média da altura dos dois olhos baseada nos landmarks do MediaPipe.
 * @param pontos Array de landmarks (faceLandmarks[0])
 */
export const calcularAlturaMediaOlhos = (pontos: any[]) => {
  if (!pontos || pontos.length === 0) return 0;
  
  // Landmarks específicos do MediaPipe para as pálpebras
  const hE = Math.abs(pontos[145].y - pontos[159].y); // Esquerdo
  const hD = Math.abs(pontos[374].y - pontos[386].y); // Direito
  
  return (hE + hD) / 2;
};

/**
 * Valida se uma piscada é intencional baseada no tempo de duração.
 */
export const validarIntencionalidadePiscada = (duracao: number, agora: number, ultimoClique: number) => {
  return (
    duracao >= CONFIG_OCULAR.DURACAO_MIN_PISCADA &&
    duracao <= CONFIG_OCULAR.DURACAO_MAX_PISCADA &&
    (agora - ultimoClique) > CONFIG_OCULAR.COOLDOWN_CLIQUE
  );
};