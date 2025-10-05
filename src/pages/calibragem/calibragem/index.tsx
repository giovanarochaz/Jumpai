import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
import type { FaceLandmarkerResult } from "@mediapipe/tasks-vision";

// Importando os componentes estilizados da tela
import {
  ContainerDaTela,
  BlocoDeDescricao,
  Titulo,
  Paragrafo,
  MensagemDeErro,
  ContainerVideo,
  VideoCam,
  CanvasSobreposicao,
  BotaoCalibrar,
  OverlayContagem,
  TextoContagem,
  BolinhaDeFoco,
  Flash,
  GlobalStyle
} from './styles'; // Assumindo que os estilos estão em './estilos.ts'
import { olhoStore } from '../../../interface/olho';


import ModalGenerico from '../../../components/modal';

const LIMIAR_LUMINOSIDADE = 70;
const TEMPO_SEM_ROSTO_PARA_AVISO = 3000; // 3 segundos até avisar que não há rosto

// Interface para definir a estrutura do estado do nosso modal
interface EstadoModal {
  estaAberto: boolean;
  imagemSrc: string;
  titulo: string;
  descricao: string;
}

const CalibragemOcular: React.FC = () => {
  const navigate = useNavigate();

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const isCalibrandoRef = useRef(false);
  const alturasOlhoRef = useRef<number[]>([]);
  // Novo Ref: Usado para controlar o temporizador que verifica a ausência de rosto
  const temporizadorSemRostoRef = useRef<number | null>(null);

  // Estados
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [isCalibrando, setIsCalibrando] = useState(false);
  const [contagem, setContagem] = useState<number | null>(null);
  const [mostrarBolinha, setMostrarBolinha] = useState(false);
  const [mostrarFlashDeEfeito, setMostrarFlashDeEfeito] = useState(false);
  const [usarFlashDeTela, setUsarFlashDeTela] = useState(false);

  // Novo Estado: Controla o conteúdo e a visibilidade do modal
  const [estadoDoModal, setEstadoDoModal] = useState<EstadoModal>({
    estaAberto: false,
    imagemSrc: '',
    titulo: '',
    descricao: '',
  });

  // Função centralizada para exibir o modal com diferentes conteúdos
  const exibirModal = (tipo: 'semRosto' | 'permissaoCamera') => {
    if (tipo === 'semRosto') {
      setEstadoDoModal({
        estaAberto: true,
        imagemSrc: '../../../../public/assets/modal/aviso.png',
        titulo: 'Rosto não Detectado',
        descricao: 'Por favor, posicione seu rosto no centro da câmera para que possamos detectá-lo.',
      });
    } else if (tipo === 'permissaoCamera') {
      setEstadoDoModal({
        estaAberto: true,
        imagemSrc: '../../../../public/assets/modal/camera.png',
        titulo: 'Acesso à Câmera Necessário',
        descricao: 'Você precisa permitir o acesso à câmera no seu navegador para continuar.',
      });
    }
  };

  useEffect(() => {
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
        setErro("Não foi possível carregar o sistema de detecção. Tente recarregar a página.");
      }
    };

    const iniciarCamera = async () => {
      if (!videoRef.current) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          videoRef.current?.play();
          requestAnimationFrame(detectar);
        };
      } catch (err) {
        console.error("Erro ao acessar câmera:", err);
        setErro("Você precisa permitir o acesso à câmera para continuar.");
        // Se der erro ao pedir permissão, exibe o modal específico
        exibirModal('permissaoCamera');
      }
    };

    iniciarMediaPipe();
  }, []);

  const detectar = () => {
    const { current: faceLandmarker } = faceLandmarkerRef;
    const { current: video } = videoRef;
    const { current: canvas } = canvasRef;

    if (!faceLandmarker || !video || !canvas || video.readyState < 2) {
      requestAnimationFrame(detectar);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const resultado: FaceLandmarkerResult = faceLandmarker.detectForVideo(video, performance.now());
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    // Lógica para o aviso de "nenhum rosto detectado"
    if (resultado.faceLandmarks.length > 0) {
      // Se um rosto foi detectado, nós cancelamos qualquer aviso pendente.
      if (temporizadorSemRostoRef.current) {
        clearTimeout(temporizadorSemRostoRef.current);
        temporizadorSemRostoRef.current = null;
      }

      const pontos = resultado.faceLandmarks[0];
      const olhoEsquerdoTopo = pontos[159];
      const olhoEsquerdoBase = pontos[145];

      if (olhoEsquerdoTopo && olhoEsquerdoBase) {
        ctx.beginPath();
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 2;
        ctx.moveTo(canvas.width - olhoEsquerdoTopo.x * canvas.width, olhoEsquerdoTopo.y * canvas.height);
        ctx.lineTo(canvas.width - olhoEsquerdoBase.x * canvas.width, olhoEsquerdoBase.y * canvas.height);
        ctx.stroke();
        
        const alturaAtual = Math.abs(olhoEsquerdoBase.y - olhoEsquerdoTopo.y);

        if (isCalibrandoRef.current && alturasOlhoRef.current.length < 100) {
          alturasOlhoRef.current.push(alturaAtual);
          if (alturasOlhoRef.current.length === 100) {
            finalizarCalibragem();
          }
        }
      }
    } else {
      // Nenhum rosto foi detectado no frame atual.
      // Se já não houver um temporizador rodando e não estivermos no meio da calibragem, iniciamos um.
      if (!temporizadorSemRostoRef.current && !isCalibrandoRef.current) {
        temporizadorSemRostoRef.current = window.setTimeout(() => {
          exibirModal('semRosto');
          temporizadorSemRostoRef.current = null; // Reseta para que possa ser ativado novamente
        }, TEMPO_SEM_ROSTO_PARA_AVISO);
      }
    }

    requestAnimationFrame(detectar);
  };

  const ajustarIluminacao = async () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let somaLuminosidade = 0;

    for (let i = 0; i < data.length; i += 400) {
        somaLuminosidade += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    const mediaLuminosidade = somaLuminosidade / (data.length / 400);

    if (mediaLuminosidade < LIMIAR_LUMINOSIDADE) {
      const stream = video.srcObject as MediaStream;
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();

      if (capabilities.torch) {
        try {
          await track.applyConstraints({ advanced: [{ torch: true }] });
          console.log("[Iluminação] Flash de hardware (torch) ativado.");
        } catch (err) {
          console.error("[Iluminação] Erro ao tentar ativar o torch, usando flash de tela.", err);
          setUsarFlashDeTela(true);
        }
      } else {
        console.warn("[Iluminação] Dispositivo não suporta torch. Usando flash de tela.");
        setUsarFlashDeTela(true);
      }
    }
  };

  const desligarIluminacao = async () => {
      setUsarFlashDeTela(false);
      const video = videoRef.current;
      if (!video || !video.srcObject) return;
      const stream = video.srcObject as MediaStream;
      const track = stream.getVideoTracks()[0];
      if (track.getCapabilities().torch) {
          try {
              await track.applyConstraints({ advanced: [{ torch: false }] });
              console.log("[Iluminação] Flash de hardware (torch) desligado.");
          } catch(err) { /* Ignora erros ao desligar */ }
      }
  };

  const finalizarCalibragem = () => {
    isCalibrandoRef.current = false; 
    const soma = alturasOlhoRef.current.reduce((acc, val) => acc + val, 0); 
    const media = soma / alturasOlhoRef.current.length; 
    olhoStore.getState().setAlturaMedia(media); 
    alturasOlhoRef.current = []; 
    setIsCalibrando(false); 
    setMostrarBolinha(false); 
    desligarIluminacao();
    navigate("/calibragem-teste"); 
  };

  const handleCalibrar = () => {
    setContagem(3);
    setMostrarBolinha(true); 
    alturasOlhoRef.current = [];
    setIsCalibrando(false);

    const intervalo = setInterval(() => {
      setContagem(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(intervalo);
          setMostrarFlashDeEfeito(true);
          setTimeout(() => setMostrarFlashDeEfeito(false), 300);
          isCalibrandoRef.current = true;
          setIsCalibrando(true);
          ajustarIluminacao();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const estaProcessando = carregando || isCalibrando || contagem !== null;

  return (
    <>
      <GlobalStyle />
      
      {/* O Modal Genérico é renderizado aqui, no topo da árvore de elementos */}
      <ModalGenerico
        estaAberto={estadoDoModal.estaAberto}
        aoFechar={() => setEstadoDoModal(prev => ({ ...prev, estaAberto: false }))}
        imagemSrc={estadoDoModal.imagemSrc}
        titulo={estadoDoModal.titulo}
        descricao={estadoDoModal.descricao}
      />
      
      <ContainerDaTela>
        <BlocoDeDescricao>
          <Titulo>Calibragem Ocular</Titulo>
          <Paragrafo>
            Vamos ajustar o sensor para o seu piscar. Clique no botão abaixo,
            e quando a contagem terminar, olhe fixamente para a bolinha branca que aparecerá na tela.
            Mantenha o olho aberto normalmente.
          </Paragrafo>
        </BlocoDeDescricao>

        {erro && <MensagemDeErro>{erro}</MensagemDeErro>}

        <ContainerVideo>
          <VideoCam ref={videoRef} autoPlay playsInline muted />
          <CanvasSobreposicao ref={canvasRef} />
        </ContainerVideo>

        {contagem !== null && contagem > 0 && (
          <OverlayContagem>
            <TextoContagem>{contagem}</TextoContagem>
          </OverlayContagem>
        )}

        {mostrarBolinha && <BolinhaDeFoco />}
        
        {(mostrarFlashDeEfeito || usarFlashDeTela) && <Flash />}

        <BotaoCalibrar onClick={handleCalibrar} disabled={estaProcessando}>
          {isCalibrando ? "Calibrando..." : "Calibrar Altura do Olho"}
        </BotaoCalibrar>
      </ContainerDaTela>
    </>
  );
};

export default CalibragemOcular;