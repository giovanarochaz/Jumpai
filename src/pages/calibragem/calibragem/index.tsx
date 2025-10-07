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
} from './styles';
import { lojaOlho } from '../../../lojas/lojaOlho';
import { useIluminacaoAutomatica } from '../../../hooks/useIluminacaoAutomatica';
import { lojaIluminacao } from '../../../lojas/lojaIluminacao';
import ModalGenerico from '../../../componentes/ModalGenerico';

const TEMPO_SEM_ROSTO_PARA_AVISO = 3000;
const TOTAL_AMOSTRAS_CALIBRAGEM = 150;

interface EstadoModal {
  estaAberto: boolean;
  imagemSrc: string;
  titulo: string;
  descricao: string;
}

const CalibragemOcular: React.FC = () => {

  const imagens = {
    semRosto: '/assets/modal/aviso.png',
    permissaoCamera: '/assets/modal/camera.png'
  };

  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const isCalibrandoRef = useRef(false);
  
  const alturasOlhoEsquerdoRef = useRef<number[]>([]);
  const alturasOlhoDireitoRef = useRef<number[]>([]);
  const temporizadorSemRostoRef = useRef<number | null>(null);

  useIluminacaoAutomatica(videoRef);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [isCalibrando, setIsCalibrando] = useState(false);
  const [contagem, setContagem] = useState<number | null>(null);
  const [mostrarBolinha, setMostrarBolinha] = useState(false);
  const [mostrarFlashDeEfeito, setMostrarFlashDeEfeito] = useState(false);
  const [estadoDoModal, setEstadoDoModal] = useState<EstadoModal>({
    estaAberto: false,
    imagemSrc: '',
    titulo: '',
    descricao: '',
  });

  const exibirModal = (tipo: 'semRosto' | 'permissaoCamera') => {
    let dadosModal = { imagemSrc: '', titulo: '', descricao: '' };
    if (tipo === 'semRosto') {
      dadosModal = {
        imagemSrc: imagens.semRosto,
        titulo: 'Rosto não Detectado',
        descricao: 'Por favor, posicione seu rosto no centro da câmera.',
      };
    } else if (tipo === 'permissaoCamera') {
      dadosModal = {
        imagemSrc: imagens.permissaoCamera,
        titulo: 'Acesso à Câmera Necessário',
        descricao: 'Você precisa permitir o acesso à câmera no seu navegador para continuar.',
      };
    }
    setEstadoDoModal({ ...dadosModal, estaAberto: true });
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
          requestAnimationFrame(detectar);
        };
      } catch (err) {
        console.error("Erro ao acessar câmera:", err);
        setErro("Você precisa permitir o acesso à câmera.");
        exibirModal('permissaoCamera');
      }
    };

    iniciarMediaPipe();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const detectar = () => {
    const { current: faceLandmarker } = faceLandmarkerRef;
    const video = videoRef.current;
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

    if (resultado.faceLandmarks.length > 0) {
      if (temporizadorSemRostoRef.current) {
        clearTimeout(temporizadorSemRostoRef.current);
        temporizadorSemRostoRef.current = null;
      }

      const pontos = resultado.faceLandmarks[0];
      const olhoEsquerdoTopo = pontos[159];
      const olhoEsquerdoBase = pontos[145];
      const olhoDireitoTopo = pontos[386];
      const olhoDireitoBase = pontos[374];

      if (olhoEsquerdoTopo && olhoEsquerdoBase && olhoDireitoTopo && olhoDireitoBase) {
        // --- CÓDIGO DE DESENHO HARMONIZADO ---
        // Desenha linha no olho esquerdo (do usuário)
        ctx.beginPath();
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 2;
        ctx.moveTo(canvas.width - olhoEsquerdoTopo.x * canvas.width, olhoEsquerdoTopo.y * canvas.height);
        ctx.lineTo(canvas.width - olhoEsquerdoBase.x * canvas.width, olhoEsquerdoBase.y * canvas.height);
        ctx.stroke();
        
        // Desenha linha no olho direito (do usuário)
        ctx.beginPath();
        ctx.strokeStyle = "cyan"; // Mudado para cyan para consistência com a tela de teste
        ctx.lineWidth = 2;
        ctx.moveTo(canvas.width - olhoDireitoTopo.x * canvas.width, olhoDireitoTopo.y * canvas.height);
        ctx.lineTo(canvas.width - olhoDireitoBase.x * canvas.width, olhoDireitoBase.y * canvas.height);
        ctx.stroke();
        
        const alturaOlhoEsquerdo = Math.abs(olhoEsquerdoBase.y - olhoEsquerdoTopo.y);
        const alturaOlhoDireito = Math.abs(olhoDireitoBase.y - olhoDireitoTopo.y);

        if (isCalibrandoRef.current && alturasOlhoEsquerdoRef.current.length < TOTAL_AMOSTRAS_CALIBRAGEM) {
          alturasOlhoEsquerdoRef.current.push(alturaOlhoEsquerdo);
          alturasOlhoDireitoRef.current.push(alturaOlhoDireito);

          if (alturasOlhoEsquerdoRef.current.length >= TOTAL_AMOSTRAS_CALIBRAGEM) {
            finalizarCalibragem();
          }
        }
      }
    } else {
      if (!temporizadorSemRostoRef.current && !isCalibrandoRef.current) {
        temporizadorSemRostoRef.current = window.setTimeout(() => {
          exibirModal('semRosto');
          temporizadorSemRostoRef.current = null;
        }, TEMPO_SEM_ROSTO_PARA_AVISO);
      }
    }

    requestAnimationFrame(detectar);
  };
  
  const finalizarCalibragem = () => {
    isCalibrandoRef.current = false;

    if (alturasOlhoEsquerdoRef.current.length > 0 && alturasOlhoDireitoRef.current.length > 0) {
      
      const calcularMediana = (alturas: number[]): number => {
        const alturasOrdenadas = [...alturas].sort((a, b) => a - b);
        const meio = Math.floor(alturasOrdenadas.length / 2);
        return alturasOrdenadas.length % 2 !== 0
          ? alturasOrdenadas[meio]
          : (alturasOrdenadas[meio - 1] + alturasOrdenadas[meio]) / 2;
      };

      const medianaEsquerda = calcularMediana(alturasOlhoEsquerdoRef.current);
      const medianaDireita = calcularMediana(alturasOlhoDireitoRef.current);
      const mediaCombinada = (medianaEsquerda + medianaDireita) / 2;

      lojaOlho.getState().setAlturaMediaEsquerda(medianaEsquerda);
      lojaOlho.getState().setAlturaMediaDireita(medianaDireita);
      lojaOlho.getState().setAlturaMedia(mediaCombinada);
    }

    alturasOlhoEsquerdoRef.current = [];
    alturasOlhoDireitoRef.current = [];
    setIsCalibrando(false);
    setMostrarBolinha(false);

    lojaIluminacao.getState().desligarIluminacao();
    
    navigate("/calibragem-teste");
  };

  const handleCalibrar = () => {
    setContagem(3);
    setMostrarBolinha(true);
    alturasOlhoEsquerdoRef.current = [];
    alturasOlhoDireitoRef.current = [];
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
            Mantenha os olhos abertos normalmente.
          </Paragrafo>
        </BlocoDeDescricao>

        {erro && <MensagemDeErro>{erro}</MensagemDeErro>}

        <ContainerVideo>
          <VideoCam ref={videoRef} autoPlay playsInline muted />
          <CanvasSobreposicao ref={canvasRef} />
          {mostrarBolinha && <BolinhaDeFoco />}
        </ContainerVideo>

        {contagem !== null && contagem > 0 && (
          <OverlayContagem>
            <TextoContagem>{contagem}</TextoContagem>
          </OverlayContagem>
        )}
        
        {mostrarFlashDeEfeito && <Flash />}

        <BotaoCalibrar onClick={handleCalibrar} disabled={estaProcessando}>
          {isCalibrando ? "Calibrando..." : "Calibrar Altura do Olho"}
        </BotaoCalibrar>
      </ContainerDaTela>
    </>
  );
};

export default CalibragemOcular;