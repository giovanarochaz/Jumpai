import React, { useRef, useEffect } from 'react';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import type { FaceLandmarkerResult } from "@mediapipe/tasks-vision";
import { useStore } from 'zustand';
import { lojaOlho } from '../../lojas/lojaOlho';
import { CanvasFlutuante, ContainerCameraFlutuante } from './estilos';

const CameraFlutuante: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceLandmarkerRef = useRef<any>(null);
  const [carregando, setCarregando] = React.useState(true);
  const [erro, setErro] = React.useState<string | null>(null);
  const requestRef = useRef<number | null>(null);

  const mostrarCameraFlutuante = useStore(lojaOlho, (estado) => estado.mostrarCameraFlutuante);

  // Refs para controle de piscada combinada
  const isPiscandoRef = useRef(false);
  const inicioPiscadaRef = useRef<number | null>(null);

  const desenhar = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const contexto = canvas?.getContext('2d');

    if (video && canvas && contexto && video.readyState >= 2) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      contexto.clearRect(0, 0, canvas.width, canvas.height);

      contexto.save();
      contexto.scale(-1, 1);
      contexto.translate(-canvas.width, 0);
      contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (faceLandmarkerRef.current) {
        const resultado: FaceLandmarkerResult = faceLandmarkerRef.current.detectForVideo(video, performance.now());
        if (resultado.faceLandmarks.length > 0) {
          const pontos = resultado.faceLandmarks[0];

          const olhoEsquerdoTopo = pontos[159];
          const olhoEsquerdoBase = pontos[145];
          const olhoDireitoTopo = pontos[386];
          const olhoDireitoBase = pontos[374];

          // Desenhar linha nos olhos (visual)
          if (olhoEsquerdoTopo && olhoEsquerdoBase) {
            contexto.beginPath();
            contexto.strokeStyle = "#00FF00";
            contexto.lineWidth = 3;
            contexto.moveTo(olhoEsquerdoTopo.x * canvas.width, olhoEsquerdoTopo.y * canvas.height);
            contexto.lineTo(olhoEsquerdoBase.x * canvas.width, olhoEsquerdoBase.y * canvas.height);
            contexto.stroke();
          }

          if (olhoDireitoTopo && olhoDireitoBase) {
            contexto.beginPath();
            contexto.strokeStyle = "#00BFFF";
            contexto.lineWidth = 3;
            contexto.moveTo(olhoDireitoTopo.x * canvas.width, olhoDireitoTopo.y * canvas.height);
            contexto.lineTo(olhoDireitoBase.x * canvas.width, olhoDireitoBase.y * canvas.height);
            contexto.stroke();
          }

          // --- Lógica de piscada conjunta (os dois olhos) ---
          const alturaMediaCalibrada = lojaOlho.getState().alturaMedia;
          const LIMIAR_PISCADA = 0.6;
          const TEMPO_MINIMO_PISCADA_MS = 100;

          if (alturaMediaCalibrada > 0) {
            const alturaEsquerdo = Math.abs(olhoEsquerdoBase.y - olhoEsquerdoTopo.y);
            const alturaDireito = Math.abs(olhoDireitoBase.y - olhoDireitoTopo.y);

            const olhosFechados =
              alturaEsquerdo < alturaMediaCalibrada * LIMIAR_PISCADA &&
              alturaDireito < alturaMediaCalibrada * LIMIAR_PISCADA;

            if (olhosFechados) {
              if (!isPiscandoRef.current) {
                isPiscandoRef.current = true;
                inicioPiscadaRef.current = performance.now();
              }
            } else {
              if (isPiscandoRef.current) {
                const duracaoPiscada = performance.now() - (inicioPiscadaRef.current ?? 0);
                isPiscandoRef.current = false;
                inicioPiscadaRef.current = null;

                if (duracaoPiscada >= TEMPO_MINIMO_PISCADA_MS) {
                  lojaOlho.getState().setEstaPiscando(true);
                  setTimeout(() => {
                    lojaOlho.getState().setEstaPiscando(false);
                  }, 150);
                }
              }
            }
          }
        }
      }

      contexto.restore();
    }

    requestRef.current = requestAnimationFrame(desenhar);
  };

  useEffect(() => {
    if (!mostrarCameraFlutuante) return;

    const iniciarMediaPipe = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );

        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-assets/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        });

        await iniciarCamera();
        setCarregando(false);
      } catch (err) {
        console.error("Erro ao inicializar MediaPipe:", err);
        setErro("Não foi possível carregar o sistema de detecção.");
      }
    };

    const iniciarCamera = async () => {
      if (!videoRef.current) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          videoRef.current?.play();
          requestRef.current = requestAnimationFrame(desenhar);
        };
      } catch (err) {
        console.error("Erro ao acessar câmera:", err);
        setErro("Você precisa permitir o acesso à câmera.");
      }
    };

    iniciarMediaPipe();

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [mostrarCameraFlutuante]);

  if (!mostrarCameraFlutuante) return null;

  return (
    <ContainerCameraFlutuante>
      <video ref={videoRef} autoPlay playsInline muted style={{ display: 'none' }} />
      <CanvasFlutuante ref={canvasRef} />
      {carregando && (
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white'
        }}>
          Carregando...
        </div>
      )}
      {erro && (
        <div style={{
          position: 'absolute',
          bottom: '10px', left: '10px',
          color: 'red', fontSize: '12px'
        }}>
          {erro}
        </div>
      )}
    </ContainerCameraFlutuante>
  );
};

export default CameraFlutuante;
