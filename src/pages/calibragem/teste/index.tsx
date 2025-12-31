import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import * as S from './styles'; 
import { lojaOlho } from '../../../lojas/lojaOlho';
import ModalGenerico from '../../../componentes/ModalGenerico';
import { EstiloGlobal } from '../../../estilos/global';
import ModalLeitorTela from '../../../componentes/ModaLeitorTela';

// Configurações Técnicas
const LIMIAR_PISCADA = 0.5;
const TENTATIVAS_TOTAIS = 3;
const TEMPO_POR_PISCADA = 2000;
const INTERVALO_ENTRE_TENTATIVAS = 800;
const TEMPO_AVISO_SEM_ROSTO = 3000;

const TemporizadorVisual: React.FC<{ duracao: number }> = ({ duracao }) => (
  <S.SvgContagem viewBox="0 0 90 90">
    <S.CirculoContagem duracao={duracao} />
  </S.SvgContagem>
);

const CalibragemTeste: React.FC = () => {
  const navegar = useNavigate();
  
  // Referências
  const referenciaVideo = useRef<HTMLVideoElement>(null);
  const referenciaCanvas = useRef<HTMLCanvasElement>(null);
  const referenciaDetectorFace = useRef<FaceLandmarker | null>(null);
  const referenciaEstaPiscando = useRef(false);
  const referenciaTemporizador = useRef<number | null>(null);
  const statusDoTesteRef = useRef<'pronto' | 'testando' | 'finalizado'>('pronto');
  const temporizadorSemRostoRef = useRef<number | null>(null);

  // Estados
  const [carregando, setCarregando] = useState(true);
  const [tentativas, setTentativas] = useState<S.StatusBolinha[]>(Array(TENTATIVAS_TOTAIS).fill('pendente'));
  const [indiceTentativaAtual, setIndiceTentativaAtual] = useState<number | null>(null);
  const [mostrarPerguntaLeitor, setMostrarPerguntaLeitor] = useState(false);
  const [estadoModal, setEstadoModal] = useState({
    estaAberto: false,
    imagemSrc: '',
    titulo: '',
    descricao: '',
    acaoAposFechar: undefined as (() => void) | undefined,
  });

  const { alturaMedia, setLeitorAtivo, setMostrarCameraFlutuante } = lojaOlho.getState();

  // Função para exibir modais de sistema
  const exibirMensagem = (tipo: 'semRosto' | 'erroRecalibrar' | 'sucesso' | 'falha', acao?: () => void) => {
    const configuracoes = {
      semRosto: { img: '/assets/modal/aviso.png', tit: 'Rosto não Detectado', desc: 'Por favor, centralize seu rosto na câmera.' },
      erroRecalibrar: { img: '/assets/modal/camera.png', tit: 'Erro na Calibragem', desc: 'Algo deu errado. Precisamos recalibrar.' },
      sucesso: { img: '/assets/modal/sucesso.png', tit: 'Tudo Certo!', desc: 'Piscadas validadas com sucesso!' },
      falha: { img: '/assets/modal/erro.png', tit: 'Falha no Teste', desc: 'Não detectamos suas piscadas. Vamos tentar de novo?' },
    };
    
    const config = configuracoes[tipo];
    setEstadoModal({
      estaAberto: true,
      imagemSrc: config.img,
      titulo: config.tit,
      descricao: config.desc,
      acaoAposFechar: acao
    });
  };

  useEffect(() => {
    if (alturaMedia === 0) {
      exibirMensagem('erroRecalibrar', () => navegar('/calibragem-ocular'));
      return;
    }

    const inicializarMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm");
        referenciaDetectorFace.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-assets/face_landmarker.task", delegate: "GPU" },
          runningMode: "VIDEO", numFaces: 1
        });
        await abrirCamera();
        setCarregando(false);
      } catch (err) {
        exibirMensagem('erroRecalibrar', () => navegar('/calibragem-ocular'));
      }
    };

    const abrirCamera = async () => {
      if (!referenciaVideo.current) return;
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      referenciaVideo.current.srcObject = stream;
      referenciaVideo.current.onloadeddata = () => {
        referenciaVideo.current?.play();
        processarFrames();
      };
    };

    inicializarMediaPipe();
    return () => {
      if (referenciaTemporizador.current) clearTimeout(referenciaTemporizador.current);
      if (referenciaVideo.current?.srcObject) {
        (referenciaVideo.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [alturaMedia]);

  const processarFrames = () => {
    if (!referenciaVideo.current || !referenciaDetectorFace.current || !referenciaCanvas.current) return;
    
    const video = referenciaVideo.current;
    const canvas = referenciaCanvas.current;
    const ctx = canvas.getContext("2d");

    if (ctx && video.readyState >= 2) {
      if (canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const resultado = referenciaDetectorFace.current.detectForVideo(video, performance.now());
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (resultado.faceLandmarks.length > 0) {
        if (temporizadorSemRostoRef.current) {
          clearTimeout(temporizadorSemRostoRef.current);
          temporizadorSemRostoRef.current = null;
        }

        const pontos = resultado.faceLandmarks[0];
        const olhoE = { t: pontos[159], b: pontos[145] };
        const olhoD = { t: pontos[386], b: pontos[374] };

        // Desenhar guias (Lime para esquerdo, Ciano para direito)
        ctx.lineWidth = 3;
        ctx.strokeStyle = "lime";
        [olhoE, olhoD].forEach(olho => {
          ctx.beginPath();
          ctx.moveTo(canvas.width - olho.t.x * canvas.width, olho.t.y * canvas.height);
          ctx.lineTo(canvas.width - olho.b.x * canvas.width, olho.b.y * canvas.height);
          ctx.stroke();
        });

        // Detecção
        const media = (Math.abs(olhoE.b.y - olhoE.t.y) + Math.abs(olhoD.b.y - olhoD.t.y)) / 2;
        if (media < alturaMedia * LIMIAR_PISCADA) {
          if (!referenciaEstaPiscando.current) {
            referenciaEstaPiscando.current = true;
            confirmarPiscada();
          }
        } else {
          referenciaEstaPiscando.current = false;
        }
      } else if (statusDoTesteRef.current === 'testando' && !temporizadorSemRostoRef.current) {
        temporizadorSemRostoRef.current = window.setTimeout(() => exibirMensagem('semRosto'), TEMPO_AVISO_SEM_ROSTO);
      }
    }
    requestAnimationFrame(processarFrames);
  };

  const confirmarPiscada = () => {
    if (statusDoTesteRef.current !== 'testando' || referenciaTemporizador.current === null) return;
    clearTimeout(referenciaTemporizador.current);
    referenciaTemporizador.current = null;

    setTentativas(prev => {
      const novo = [...prev];
      const idx = novo.findIndex(s => s === 'ativo');
      if (idx !== -1) novo[idx] = 'sucesso';
      return novo;
    });
    setIndiceTentativaAtual(prev => (prev !== null ? prev + 1 : 0));
  };

  useEffect(() => {
    if (indiceTentativaAtual === null) return;
    if (indiceTentativaAtual >= TENTATIVAS_TOTAIS) {
      finalizarFluxo();
      return;
    }

    const timerDelay = setTimeout(() => {
      setTentativas(prev => {
        const n = [...prev];
        n[indiceTentativaAtual] = 'ativo';
        return n;
      });

      referenciaTemporizador.current = window.setTimeout(() => {
        setTentativas(prev => {
          const n = [...prev];
          if (n[indiceTentativaAtual] === 'ativo') n[indiceTentativaAtual] = 'falha';
          return n;
        });
        setIndiceTentativaAtual(indiceTentativaAtual + 1);
      }, TEMPO_POR_PISCADA);
    }, INTERVALO_ENTRE_TENTATIVAS);

    return () => clearTimeout(timerDelay);
  }, [indiceTentativaAtual]);

  const finalizarFluxo = () => {
    statusDoTesteRef.current = 'finalizado';
    const acertos = tentativas.filter(t => t === 'sucesso').length;
    
    if (acertos >= 2) {
      exibirMensagem('sucesso', () => {
        // Passo 2: Após fechar o sucesso, pergunta do leitor
        setMostrarPerguntaLeitor(true);
      });
    } else {
      exibirMensagem('falha', iniciarAvaliacao);
    }
  };

  const finalizarTudo = (ativarLeitor: boolean) => {
    setLeitorAtivo(ativarLeitor);
    setMostrarCameraFlutuante(true);
    setMostrarPerguntaLeitor(false);
    navegar('/jogos');
  };

  const iniciarAvaliacao = () => {
    statusDoTesteRef.current = 'testando';
    setTentativas(Array(TENTATIVAS_TOTAIS).fill('pendente'));
    setIndiceTentativaAtual(0);
  };

  return (
    <>
      <EstiloGlobal />
      
      <ModalGenerico
        estaAberto={estadoModal.estaAberto}
        aoFechar={() => setEstadoModal(p => ({ ...p, estaAberto: false }))}
        imagemSrc={estadoModal.imagemSrc}
        titulo={estadoModal.titulo}
        descricao={estadoModal.descricao}
        acaoAposFechar={estadoModal.acaoAposFechar}
      />

      <ModalLeitorTela 
        estaAberto={mostrarPerguntaLeitor} 
        aoEscolher={finalizarTudo} 
      />

      <S.ContainerDaTela>
        <S.ContainerDoTeste>
          <S.BlocoDeDescricao>
            <S.Titulo>Teste de Piscada</S.Titulo>
            <S.Paragrafo>
              {statusDoTesteRef.current === 'pronto' 
                ? "Clique para validar seu sensor ocular." 
                : "Pisque rápido quando o círculo pulsar!"}
            </S.Paragrafo>
          </S.BlocoDeDescricao>

          <S.ContainerVideo>
            <S.VideoCamera ref={referenciaVideo} autoPlay playsInline muted />
            <S.CanvasSobreposicao ref={referenciaCanvas} />
          </S.ContainerVideo>

          <S.ContainerBolinhas>
            {tentativas.map((s, i) => (
              <S.BolinhaTeste key={i} status={s}>
                {s === 'ativo' && <TemporizadorVisual duracao={TEMPO_POR_PISCADA} />}
              </S.BolinhaTeste>
            ))}
          </S.ContainerBolinhas>

          {statusDoTesteRef.current === 'pronto' && (
            <S.BotaoAcao onClick={iniciarAvaliacao} disabled={carregando}>
              {carregando ? "Iniciando câmera..." : "INICIAR TESTE"}
            </S.BotaoAcao>
          )}
        </S.ContainerDoTeste>
      </S.ContainerDaTela>
    </>
  );
};

export default CalibragemTeste;