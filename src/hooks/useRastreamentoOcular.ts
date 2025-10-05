import React, { useRef, useEffect } from 'react';
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
import type { FaceLandmarkerResult } from "@mediapipe/tasks-vision";
import { lojaOlho } from '../lojas/lojaOlho';

// Constantes para os índices dos pontos dos olhos
const PONTO_TOPO_ESQUERDO = 159;
const PONTO_BASE_ESQUERDO = 145;
const PONTO_TOPO_DIREITO = 386;
const PONTO_BASE_DIREITO = 374;
const LIMIAR_PISCADA = 0.5;

/**
 * Hook customizado para encapsular a lógica de detecção facial e de piscada com MediaPipe.
 * @param videoRef A referência para o elemento <video> que exibe a câmera.
 * @param onRostoDetectado Callback opcional executado quando um rosto é encontrado.
 * @param onNenhumRosto Callback opcional executado quando nenhum rosto é encontrado.
 */
export const useRastreamentoOcular = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  onRostoDetectado?: () => void,
  onNenhumRosto?: () => void
) => {
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const requestRef = useRef<number | null>(null);
  const isPiscandoRef = useRef(false);
  
  const { alturaMedia, setPontosDoOlho, setEstaPiscando } = lojaOlho.getState();

  const detectar = async () => {
    const video = videoRef.current;
    if (!video || !faceLandmarkerRef.current || video.readyState < 2) {
      requestRef.current = requestAnimationFrame(detectar);
      return;
    }

    const resultado: FaceLandmarkerResult = faceLandmarkerRef.current.detectForVideo(video, performance.now());

    if (resultado.faceLandmarks.length > 0) {
      if (onRostoDetectado) {
        onRostoDetectado();
      }
      
      const pontos = resultado.faceLandmarks[0];
      // Olho esquerdo
      const olhoTopoEsquerdo = pontos[PONTO_TOPO_ESQUERDO];
      const olhoBaseEsquerdo = pontos[PONTO_BASE_ESQUERDO];
      // Olho direito
      const olhoTopoDireito = pontos[PONTO_TOPO_DIREITO];
      const olhoBaseDireito = pontos[PONTO_BASE_DIREITO];

      if (olhoTopoEsquerdo && olhoBaseEsquerdo && olhoTopoDireito && olhoBaseDireito) {
        setPontosDoOlho({
          topoEsquerdo: olhoTopoEsquerdo,
          baseEsquerdo: olhoBaseEsquerdo,
          topoDireito: olhoTopoDireito,
          baseDireito: olhoBaseDireito
        });

        // Calcular altura média dos dois olhos
        const alturaEsquerdo = Math.abs(olhoBaseEsquerdo.y - olhoTopoEsquerdo.y);
        const alturaDireito = Math.abs(olhoBaseDireito.y - olhoTopoDireito.y);
        const alturaMediaOlhos = (alturaEsquerdo + alturaDireito) / 2;
        const piscou = alturaMedia > 0 && alturaMediaOlhos < alturaMedia * LIMIAR_PISCADA;

        if (piscou && !isPiscandoRef.current) {
          isPiscandoRef.current = true;
        } else if (!piscou && isPiscandoRef.current) {
          isPiscandoRef.current = false;
          setEstaPiscando(true);
          setTimeout(() => setEstaPiscando(false), 100);
        }
      }
    } else {
      if (onNenhumRosto) {
        onNenhumRosto();
      }
      setPontosDoOlho({
        topoEsquerdo: null,
        baseEsquerdo: null,
        topoDireito: null,
        baseDireito: null
      });
    }

    requestRef.current = requestAnimationFrame(detectar);
  };

  useEffect(() => {
    const iniciarMediaPipe = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm");
        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-assets/face_landmarker.task", delegate: "GPU" },
          runningMode: "VIDEO", numFaces: 1,
        });
        requestRef.current = requestAnimationFrame(detectar);
      } catch (err) {
        console.error("Falha ao inicializar MediaPipe:", err);
      }
    };
    iniciarMediaPipe();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);
};