// src/componentes/CameraFlutuante/index.tsx
import React, { useRef, useEffect } from 'react';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { useStore } from 'zustand';
import { lojaOlho } from '../../lojas/lojaOlho';
import { CONFIG_OCULAR, calcularAlturaMediaOlhos, validarIntencionalidadePiscada } from '../../config/rastreamentoConfig';
import { CanvasFlutuante, ContainerCameraFlutuante } from './estilos';

const CameraFlutuante: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceLandmarkerRef = useRef<any>(null);
  const requestRef = useRef<number | null>(null);
  const inicioPiscadaRef = useRef<number | null>(null);
  const ultimoCliqueTimeRef = useRef<number>(0);

  const mostrarCameraFlutuante = useStore(lojaOlho, (state) => state.mostrarCameraFlutuante);

  const processarLoop = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas?.getContext('2d');

    if (video && canvas && ctx && video.readyState >= 2) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (faceLandmarkerRef.current) {
        const agora = performance.now();
        const resultado = faceLandmarkerRef.current.detectForVideo(video, agora);
        
        if (resultado.faceLandmarks?.[0]) {
          const pontos = resultado.faceLandmarks[0];
          const alturaAtual = calcularAlturaMediaOlhos(pontos);
          const { alturaMedia, setEstaPiscando } = lojaOlho.getState();

          // Desenho visual das pálpebras
          ctx.lineWidth = 3;
          [[159, 145, "#00FF00"], [386, 374, "#00BFFF"]].forEach(([t, b, cor]) => {
            ctx.beginPath();
            ctx.strokeStyle = cor as string;
            ctx.moveTo(pontos[t as number].x * canvas.width, pontos[t as number].y * canvas.height);
            ctx.lineTo(pontos[b as number].x * canvas.width, pontos[b as number].y * canvas.height);
            ctx.stroke();
          });

          // Lógica de Piscada
          const estaFechado = alturaMedia > 0 && alturaAtual < (alturaMedia * CONFIG_OCULAR.LIMIAR_PISCADA);
          if (estaFechado) {
            if (inicioPiscadaRef.current === null) inicioPiscadaRef.current = agora;
          } else if (inicioPiscadaRef.current !== null) {
            const duracao = agora - inicioPiscadaRef.current;
            if (validarIntencionalidadePiscada(duracao, agora, ultimoCliqueTimeRef.current)) {
              setEstaPiscando(true);
              ultimoCliqueTimeRef.current = agora;
              setTimeout(() => setEstaPiscando(false), 200);
            }
            inicioPiscadaRef.current = null;
          }
        } else {
          inicioPiscadaRef.current = null;
        }
      }
      ctx.restore();
    }
    requestRef.current = requestAnimationFrame(processarLoop);
  };

  useEffect(() => {
    if (!mostrarCameraFlutuante) return;
    const init = async () => {
      const vision = await FilesetResolver.forVisionTasks(CONFIG_OCULAR.WASM_PATH);
      faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: CONFIG_OCULAR.MODEL_ASSET_PATH, delegate: "GPU" },
        runningMode: "VIDEO", numFaces: 1
      });
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          videoRef.current?.play();
          requestRef.current = requestAnimationFrame(processarLoop);
        };
      }
    };
    init();
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (videoRef.current?.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    };
  }, [mostrarCameraFlutuante]);

  if (!mostrarCameraFlutuante) return null;
  return (
    <ContainerCameraFlutuante>
      <video ref={videoRef} autoPlay playsInline muted style={{ display: 'none' }} />
      <CanvasFlutuante ref={canvasRef} />
    </ContainerCameraFlutuante>
  );
};

export default CameraFlutuante;