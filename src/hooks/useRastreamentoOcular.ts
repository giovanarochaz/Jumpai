import { useRef, useEffect } from 'react';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { lojaOlho } from '../lojas/lojaOlho';

// Constantes unificadas de Intencionalidade
const LIMIAR_PISCADA = 0.55;
const DURACAO_MINIMA = 250; 
const DURACAO_MAXIMA = 900; 
const COOLDOWN = 600; 

export const useRastreamentoOcular = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  onRostoDetectado?: () => void,
  onNenhumRosto?: () => void
) => {
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const requestRef = useRef<number | null>(null);
  
  const tempoInicioFechado = useRef<number | null>(null);
  const ultimoCliqueTime = useRef<number>(0);

  // Acessamos o estado da loja
  const { alturaMedia, setEstaPiscando, setPontosDoOlho } = lojaOlho.getState();

  const detectar = async () => {
    const video = videoRef.current;
    if (!video || !faceLandmarkerRef.current || video.readyState < 2) {
      requestRef.current = requestAnimationFrame(detectar);
      return;
    }

    const resultado = faceLandmarkerRef.current.detectForVideo(video, performance.now());

    if (resultado.faceLandmarks?.[0]) {
      onRostoDetectado?.();
      const pontos = resultado.faceLandmarks[0];
      
      // Cálculo da altura média atual (Esquerdo + Direito / 2)
      const hE = Math.abs(pontos[145].y - pontos[159].y);
      const hD = Math.abs(pontos[374].y - pontos[386].y);
      const alturaAtual = (hE + hD) / 2;

      const agora = performance.now();
      const estaFechado = alturaMedia > 0 && alturaAtual < (alturaMedia * LIMIAR_PISCADA);

      if (estaFechado) {
        // Olho acabou de fechar
        if (tempoInicioFechado.current === null) {
          tempoInicioFechado.current = agora;
        }
      } else {
        // Olho abriu, validar a duração do fechamento
        if (tempoInicioFechado.current !== null) {
          const duracao = agora - tempoInicioFechado.current;

          // REGRAS DE INTENCIONALIDADE
          if (
            duracao >= DURACAO_MINIMA && 
            duracao <= DURACAO_MAXIMA &&
            (agora - ultimoCliqueTime.current) > COOLDOWN
          ) {
            setEstaPiscando(true);
            ultimoCliqueTime.current = agora;
            // Feedback de 200ms para a detecção ser percebida pelo sistema
            setTimeout(() => setEstaPiscando(false), 200);
          }
          tempoInicioFechado.current = null;
        }
      }

      // Atualiza landmarks para a câmera flutuante (opcional)
      setPontosDoOlho({
        topoEsquerdo: pontos[159], baseEsquerdo: pontos[145],
        topoDireito: pontos[386], baseDireito: pontos[374]
      });
    } else {
      onNenhumRosto?.();
      tempoInicioFechado.current = null;
    }
    requestRef.current = requestAnimationFrame(detectar);
  };

  useEffect(() => {
    const carregar = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm");
        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: { 
            modelAssetPath: "https://storage.googleapis.com/mediapipe-assets/face_landmarker.task", 
            delegate: "GPU" 
          },
          runningMode: "VIDEO", 
          numFaces: 1,
        });
        requestRef.current = requestAnimationFrame(detectar);
      } catch (err) {
        console.error("Erro ao carregar MediaPipe no Hook:", err);
      }
    };
    carregar();
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [alturaMedia]); // Recarrega se a altura média mudar (recalibragem)
};