import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
import type { FaceLandmarkerResult } from "@mediapipe/tasks-vision";

// Importando todos os componentes estilizados
import {
  ContainerDaTela,
  BlocoDeDescricao,
  Titulo,
  Paragrafo,
  ContainerVideo,
  VideoCam,
  CanvasSobreposicao,
  ContainerDoTeste,
  BotaoNavegacao,
  GlobalStyle,
  ContainerBolinhas,
  BolinhaTeste,
  CountdownSVG,
  CountdownCircle
} from './styles';
import { olhoStore } from '../../../interface/olho';
import ModalGenerico from '../../../components/modal';

// Constantes
const LIMIAR_PISCADA = 0.5;
const TENTATIVAS_TOTAIS = 3;
const TEMPO_POR_PISCADA = 2000;
const DELAY_ENTRE_TENTATIVAS = 700;
const TEMPO_SEM_ROSTO_PARA_AVISO = 3000;

// Tipos
type StatusDaTentativa = 'pending' | 'active' | 'success' | 'fail';
interface EstadoModal {
  estaAberto: boolean;
  imagemSrc: string;
  titulo: string;
  descricao: string;
  acaoAposFechar?: () => void;
}

// Componente visual para o relógio
const CountdownTimer: React.FC<{ duration: number }> = ({ duration }) => (
  <CountdownSVG viewBox="0 0 70 70">
    <CountdownCircle duration={duration} />
  </CountdownSVG>
);

const CalibragemTeste: React.FC = () => {
  const navigate = useNavigate();

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const isPiscandoRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const statusDoTesteRef = useRef<'pronto' | 'testando' | 'finalizado'>('pronto');
  const temporizadorSemRostoRef = useRef<number | null>(null);

  // Estados
  const [carregando, setCarregando] = useState(true);
  const [tentativas, setTentativas] = useState<StatusDaTentativa[]>(Array(TENTATIVAS_TOTAIS).fill('pending'));
  const [estadoDoModal, setEstadoDoModal] = useState<EstadoModal>({
    estaAberto: false,
    imagemSrc: '',
    titulo: '',
    descricao: '',
    acaoAposFechar: undefined,
  });
  // NOVO ESTADO: Controla qual tentativa está em andamento.
  const [indiceTentativaAtual, setIndiceTentativaAtual] = useState<number | null>(null);

  const alturaMediaDoOlho = olhoStore.getState().alturaMedia;

  const exibirModal = (tipo: 'semRosto' | 'erroRecalibrar' | 'sucesso' | 'falha', acao?: () => void) => {
    let dadosModal = { imagemSrc: '', titulo: '', descricao: '' };
    switch (tipo) {
      case 'semRosto':
        dadosModal = { imagemSrc: '../../../../public/assets/modal/aviso.png', titulo: 'Rosto não Detectado', descricao: 'Não conseguimos ver seu rosto. Por favor, posicione-se no centro da câmera.' };
        break;
      case 'erroRecalibrar':
        dadosModal = { imagemSrc: '../../../../public/assets/modal/camera.png', titulo: 'Erro na Calibragem', descricao: 'Algo deu errado. Vamos tentar calibrar novamente do início.' };
        break;
      case 'sucesso':
        dadosModal = { imagemSrc: '../../../../public/assets/modal/sucesso.png', titulo: 'Tudo Certo!', descricao: 'Sua calibragem foi um sucesso. Preparando para iniciar os jogos...' };
        break;
      case 'falha':
        dadosModal = { imagemSrc: '../../../../public/assets/modal/erro.png', titulo: 'Falha no Teste', descricao: 'Não conseguimos validar suas piscadas. O teste será reiniciado.' };
        break;
    }
    setEstadoDoModal({ estaAberto: true, ...dadosModal, acaoAposFechar: acao });
  };

  useEffect(() => {
    if (alturaMediaDoOlho === 0) {
      exibirModal('erroRecalibrar', () => navigate('/calibragem-ocular'));
      return;
    }
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
        exibirModal('erroRecalibrar', () => navigate('/calibragem-ocular'));
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
        exibirModal('erroRecalibrar', () => navigate('/calibragem-ocular'));
      }
    };
    iniciarMediaPipe();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      videoRef.current?.srcObject && (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    };
  }, [alturaMediaDoOlho, navigate]);

  // *** LÓGICA CENTRAL CORRIGIDA ***
  // Este useEffect é o motor do teste. Ele é acionado sempre que 'indiceTentativaAtual' muda.
  useEffect(() => {
    // Não faz nada se o teste não começou (índice é nulo)
    if (indiceTentativaAtual === null) {
      return;
    }

    // Se o índice alcançou o total de tentativas, o teste acabou.
    if (indiceTentativaAtual >= TENTATIVAS_TOTAIS) {
      finalizarTeste();
      return;
    }

    // Prepara e inicia a tentativa específica do índice atual
    const delay = indiceTentativaAtual > 0 ? DELAY_ENTRE_TENTATIVAS : 100; // Delay maior entre as tentativas
    const inicioTimer = setTimeout(() => {
      executarTentativa(indiceTentativaAtual);
    }, delay);

    // Função de limpeza para evitar execuções indesejadas
    return () => clearTimeout(inicioTimer);
  }, [indiceTentativaAtual]);

  const detectar = () => {
    const { current: canvas } = canvasRef;
    const { current: video } = videoRef;
    const { current: faceLandmarker } = faceLandmarkerRef;
    if (!canvas || !faceLandmarker || !video || video.readyState < 2) {
      requestAnimationFrame(detectar);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (statusDoTesteRef.current !== 'testando') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      requestAnimationFrame(detectar);
      return;
    }
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
      if (olhoEsquerdoTopo && olhoEsquerdoBase) {
        ctx.beginPath();
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 2;
        ctx.moveTo(canvas.width - olhoEsquerdoTopo.x * canvas.width, olhoEsquerdoTopo.y * canvas.height);
        ctx.lineTo(canvas.width - olhoEsquerdoBase.x * canvas.width, olhoEsquerdoBase.y * canvas.height);
        ctx.stroke();
        const alturaAtual = Math.abs(olhoEsquerdoBase.y - olhoEsquerdoTopo.y);
        const piscou = alturaAtual < alturaMediaDoOlho * LIMIAR_PISCADA;
        if (piscou && !isPiscandoRef.current) {
          isPiscandoRef.current = true;
        } else if (!piscou && isPiscandoRef.current) {
          isPiscandoRef.current = false;
          registrarPiscada();
        }
      }
    } else {
      if (!temporizadorSemRostoRef.current && statusDoTesteRef.current === 'testando') {
        temporizadorSemRostoRef.current = window.setTimeout(() => {
          exibirModal('semRosto');
          temporizadorSemRostoRef.current = null;
        }, TEMPO_SEM_ROSTO_PARA_AVISO);
      }
    }
    requestAnimationFrame(detectar);
  };
  
  const executarTentativa = (index: number) => {
    isPiscandoRef.current = false;
    setTentativas(prev => {
      const novoArray = [...prev];
      novoArray[index] = 'active';
      return novoArray;
    });
    // Inicia o timer de falha para a tentativa atual
    timerRef.current = window.setTimeout(() => {
      setTentativas(prev => {
        const novoArray = [...prev];
        if (novoArray[index] === 'active') {
          novoArray[index] = 'fail';
        }
        return novoArray;
      });
      // Avança para a próxima tentativa
      setIndiceTentativaAtual(prev => (prev !== null ? prev + 1 : 0));
    }, TEMPO_POR_PISCADA);
  };

  const registrarPiscada = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      setTentativas(prev => {
        const novoArray = [...prev];
        // Encontra o índice da tentativa que está ativa no momento
        const indexAtivo = novoArray.findIndex(s => s === 'active');
        if (indexAtivo !== -1) {
          novoArray[indexAtivo] = 'success';
        }
        return novoArray;
      });
      // Avança para a próxima tentativa
      setIndiceTentativaAtual(prev => (prev !== null ? prev + 1 : 0));
    }
  };

  const finalizarTeste = () => {
    statusDoTesteRef.current = 'finalizado';
    const sucessos = tentativas.filter(t => t === 'success').length;
    if (sucessos >= 2) {
      exibirModal('sucesso', () => navigate('/jogos/ocular'));
    } else {
      exibirModal('falha', handleReiniciarTeste);
    }
  };

  const handleReiniciarTeste = () => {
    statusDoTesteRef.current = 'testando';
    setTentativas(Array(TENTATIVAS_TOTAIS).fill('pending'));
    // Apenas define o índice inicial. O useEffect fará o resto.
    setIndiceTentativaAtual(0);
  };
  
  const renderConteudo = () => {
    return (
      <ContainerDoTeste>
        <BlocoDeDescricao>
          <Titulo>Teste de Piscada</Titulo>
          {statusDoTesteRef.current === 'pronto' && <Paragrafo>Clique no botão para iniciar a validação.</Paragrafo>}
          {statusDoTesteRef.current === 'testando' && <Paragrafo>Quando a bolinha pulsar, pisque o olho.</Paragrafo>}
          {statusDoTesteRef.current === 'finalizado' && <Paragrafo>Verificando resultados...</Paragrafo>}
        </BlocoDeDescricao>
        
        <ContainerVideo>
            <VideoCam ref={videoRef} autoPlay playsInline muted />
            <CanvasSobreposicao ref={canvasRef} />
        </ContainerVideo>

        <ContainerBolinhas>
          {tentativas.map((status, index) => (
            <BolinhaTeste key={index} status={status}>
              {status === 'active' && <CountdownTimer duration={TEMPO_POR_PISCADA} />}
            </BolinhaTeste>
          ))}
        </ContainerBolinhas>
        
        {statusDoTesteRef.current === 'pronto' && (
            <BotaoNavegacao onClick={handleReiniciarTeste} disabled={carregando}>
              {carregando ? "Carregando Câmera..." : "Iniciar Teste"}
            </BotaoNavegacao>
        )}
      </ContainerDoTeste>
    );
  };

  return (
    <>
      <GlobalStyle />
      <ModalGenerico
        estaAberto={estadoDoModal.estaAberto}
        aoFechar={() => setEstadoDoModal(prev => ({ ...prev, estaAberto: false }))}
        imagemSrc={estadoDoModal.imagemSrc}
        titulo={estadoDoModal.titulo}
        descricao={estadoDoModal.descricao}
        duracaoEmSegundos={5}
        acaoAposFechar={estadoDoModal.acaoAposFechar}
      />
      <ContainerDaTela>
        {renderConteudo()}
      </ContainerDaTela>
    </>
  );
};

export default CalibragemTeste;