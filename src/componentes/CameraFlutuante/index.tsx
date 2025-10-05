import React, { useRef, useEffect } from 'react';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import type { FaceLandmarkerResult } from "@mediapipe/tasks-vision";
import { useStore } from 'zustand';
import { lojaOlho } from '../../lojas/lojaOlho';
import { CanvasFlutuante, ContainerCameraFlutuante } from './estilos';

const CameraFlutuante: React.FC = () => {
  // Controle de piscada separado para cada olho
  const isPiscandoEsquerdoRef = useRef(false);
  const isPiscandoDireitoRef = useRef(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceLandmarkerRef = useRef<any>(null);
  const [carregando, setCarregando] = React.useState(true);
  const [erro, setErro] = React.useState<string | null>(null);
  const requestRef = useRef<number | null>(null);

  const mostrarCameraFlutuante = useStore(lojaOlho, (estado) => estado.mostrarCameraFlutuante);

  // --- FUNÇÃO DE DESENHO COM DETECÇÃO INDIVIDUAL DE PISCADAS ---
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

          // Desenha traço no olho esquerdo (do usuário)
          if (olhoEsquerdoTopo && olhoEsquerdoBase) {
            contexto.beginPath();
            contexto.strokeStyle = "#00FF00"; // Verde
            contexto.lineWidth = 3;
            contexto.moveTo(olhoEsquerdoTopo.x * canvas.width, olhoEsquerdoTopo.y * canvas.height);
            contexto.lineTo(olhoEsquerdoBase.x * canvas.width, olhoEsquerdoBase.y * canvas.height);
            contexto.stroke();
          }

          // Desenha traço no olho direito (do usuário)
          if (olhoDireitoTopo && olhoDireitoBase) {
            contexto.beginPath();
            contexto.strokeStyle = "#00BFFF"; // Azul
            contexto.lineWidth = 3;
            contexto.moveTo(olhoDireitoTopo.x * canvas.width, olhoDireitoTopo.y * canvas.height);
            contexto.lineTo(olhoDireitoBase.x * canvas.width, olhoDireitoBase.y * canvas.height);
            contexto.stroke();
          }

          // --- LÓGICA DE DETECÇÃO DE PISCADA INDIVIDUAL ---
          const alturaMediaCalibrada = lojaOlho.getState().alturaMedia;
          const LIMIAR_PISCADA = 0.6; // Aumentado ligeiramente para evitar falsos positivos

          if (alturaMediaCalibrada > 0) {
            // Verifica o olho ESQUERDO
            const alturaEsquerdo = Math.abs(olhoEsquerdoBase.y - olhoEsquerdoTopo.y);
            const piscouEsquerdo = alturaEsquerdo < alturaMediaCalibrada * LIMIAR_PISCADA;

            if (piscouEsquerdo && !isPiscandoEsquerdoRef.current) {
              isPiscandoEsquerdoRef.current = true;
            } else if (!piscouEsquerdo && isPiscandoEsquerdoRef.current) {
              isPiscandoEsquerdoRef.current = false;
              lojaOlho.getState().setEstaPiscando(true);
              lojaOlho.getState().setPiscadaEsquerda(true);
              setTimeout(() => {
                lojaOlho.getState().setEstaPiscando(false);
                lojaOlho.getState().setPiscadaEsquerda(false);
              }, 150); // Reset rápido para registrar como evento único
            }

            // Verifica o olho DIREITO
            const alturaDireito = Math.abs(olhoDireitoBase.y - olhoDireitoTopo.y);
            const piscouDireito = alturaDireito < alturaMediaCalibrada * LIMIAR_PISCADA;

            if (piscouDireito && !isPiscandoDireitoRef.current) {
              isPiscandoDireitoRef.current = true;
            } else if (!piscouDireito && isPiscandoDireitoRef.current) {
              isPiscandoDireitoRef.current = false;
              lojaOlho.getState().setEstaPiscando(true);
              lojaOlho.getState().setPiscadaDireita(true);
              setTimeout(() => {
                lojaOlho.getState().setEstaPiscando(false);
                lojaOlho.getState().setPiscadaDireita(false);
              }, 150); // Reset rápido para registrar como evento único
            }
          }
        }
      }
      contexto.restore();
    }
    requestRef.current = requestAnimationFrame(desenhar);
  };

  // Efeito para inicializar MediaPipe e a câmera (sem alterações)
  useEffect(() => {
    if (!mostrarCameraFlutuante) return;
    
    const iniciarMediaPipe = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm");
        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-assets/face_landmarker.task", delegate: "GPU" },
          runningMode: "VIDEO", numFaces: 1,
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

  if (!mostrarCameraFlutuante) {
    return null;
  }

  return (
    <ContainerCameraFlutuante>
      <video ref={videoRef} autoPlay playsInline muted style={{ display: 'none' }} />
      <CanvasFlutuante ref={canvasRef} />
      {carregando && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}>Carregando...</div>}
      {erro && <div style={{ position: 'absolute', bottom: '10px', left: '10px', color: 'red', fontSize: '12px' }}>{erro}</div>}
    </ContainerCameraFlutuante>
  );
};

export default CameraFlutuante;