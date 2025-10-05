import React, { useRef, useEffect } from 'react';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import type { FaceLandmarkerResult } from "@mediapipe/tasks-vision";
import { useStore } from 'zustand';
import { lojaOlho } from '../../lojas/lojaOlho';
import { CanvasFlutuante, ContainerCameraFlutuante } from './estilos';

const CameraFlutuante: React.FC = () => {
  // Controle de piscada
  const isPiscandoRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceLandmarkerRef = useRef<any>(null);
  const [carregando, setCarregando] = React.useState(true);
  const [erro, setErro] = React.useState<string | null>(null);
  const requestRef = useRef<number | null>(null);

  // Escuta o estado para exibir ou não a câmera
  const mostrarCameraFlutuante = useStore(lojaOlho, (estado) => estado.mostrarCameraFlutuante);

  // --- FUNÇÃO DE DESENHO ATUALIZADA ---
  const desenhar = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const contexto = canvas?.getContext('2d');

    if (video && canvas && contexto && video.readyState >= 2) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      contexto.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Salva o contexto, aplica o espelhamento e translada para corrigir a posição
      contexto.save();
      contexto.scale(-1, 1);
      contexto.translate(-canvas.width, 0);

      // 2. Desenha o vídeo já espelhado no canvas
      contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 3. Detecção de pontos faciais
      if (faceLandmarkerRef.current) {
        const resultado: FaceLandmarkerResult = faceLandmarkerRef.current.detectForVideo(video, performance.now());
        if (resultado.faceLandmarks.length > 0) {
          const pontos = resultado.faceLandmarks[0];

          // Pontos de referência para os olhos
          const olhoEsquerdoTopo = pontos[159];
          const olhoEsquerdoBase = pontos[145];
          const olhoDireitoTopo = pontos[386];
          const olhoDireitoBase = pontos[374];

          // 4. Desenha o traço vertical no olho esquerdo (do usuário)
          if (olhoEsquerdoTopo && olhoEsquerdoBase) {
            contexto.beginPath();
            contexto.strokeStyle = "#00FF00"; // Verde
            contexto.lineWidth = 3;
            contexto.moveTo(olhoEsquerdoTopo.x * canvas.width, olhoEsquerdoTopo.y * canvas.height);
            contexto.lineTo(olhoEsquerdoBase.x * canvas.width, olhoEsquerdoBase.y * canvas.height);
            contexto.stroke();
          }

          // 5. Desenha o traço vertical no olho direito (do usuário)
          if (olhoDireitoTopo && olhoDireitoBase) {
            contexto.beginPath();
            contexto.strokeStyle = "#00BFFF"; // Azul
            contexto.lineWidth = 3;
            contexto.moveTo(olhoDireitoTopo.x * canvas.width, olhoDireitoTopo.y * canvas.height);
            contexto.lineTo(olhoDireitoBase.x * canvas.width, olhoDireitoBase.y * canvas.height);
            contexto.stroke();
          }

          // 6. Lógica de detecção de piscada (inalterada)
          const alturaEsquerdo = Math.abs(olhoEsquerdoBase.y - olhoEsquerdoTopo.y);
          const alturaDireito = Math.abs(olhoDireitoBase.y - olhoDireitoTopo.y);
          const alturaMediaOlhos = (alturaEsquerdo + alturaDireito) / 2;
          const alturaMediaCalibrada = lojaOlho.getState().alturaMedia;
          const LIMIAR_PISCADA = 0.5;
          const piscou = alturaMediaCalibrada > 0 && alturaMediaOlhos < alturaMediaCalibrada * LIMIAR_PISCADA;

          if (piscou && !isPiscandoRef.current) {
            isPiscandoRef.current = true;
          } else if (!piscou && isPiscandoRef.current) {
            isPiscandoRef.current = false;
            lojaOlho.getState().setEstaPiscando(true);
            setTimeout(() => lojaOlho.getState().setEstaPiscando(false), 100);
          }
        }
      }
      // 7. Restaura o contexto para o estado original
      contexto.restore();
    }
    requestRef.current = requestAnimationFrame(desenhar);
  };

  // Efeito para inicializar MediaPipe e a câmera
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
      {/* O vídeo agora fica oculto, servindo apenas como fonte para o canvas */}
      <video ref={videoRef} autoPlay playsInline muted style={{ display: 'none' }} />
      <CanvasFlutuante ref={canvasRef} />
      {carregando && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}>Carregando...</div>}
      {erro && <div style={{ position: 'absolute', bottom: '10px', left: '10px', color: 'red', fontSize: '12px' }}>{erro}</div>}
    </ContainerCameraFlutuante>
  );
};

export default CameraFlutuante;