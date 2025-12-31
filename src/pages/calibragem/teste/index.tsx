import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import * as S from './styles'; 
import { lojaOlho } from '../../../lojas/lojaOlho';
import ModalGenerico from '../../../componentes/ModalGenerico';
import { EstiloGlobal } from '../../../estilos/global';

// Configurações do Teste
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
  const referenciaVideo = useRef<HTMLVideoElement>(null);
  const referenciaCanvas = useRef<HTMLCanvasElement>(null);
  const referenciaDetectorFace = useRef<FaceLandmarker | null>(null);
  
  const referenciaEstaPiscando = useRef(false);
  const referenciaTemporizador = useRef<number | null>(null);
  const statusDoTesteRef = useRef<'pronto' | 'testando' | 'finalizado'>('pronto');
  const temporizadorSemRostoRef = useRef<number | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [tentativas, setTentativas] = useState<S.StatusBolinha[]>(Array(TENTATIVAS_TOTAIS).fill('pendente'));
  const [indiceTentativaAtual, setIndiceTentativaAtual] = useState<number | null>(null);
  const [estadoModal, setEstadoModal] = useState({
    estaAberto: false,
    imagemSrc: '',
    titulo: '',
    descricao: '',
    acaoAposFechar: undefined as (() => void) | undefined,
  });

  const alturaMediaOlhoSalva = lojaOlho.getState().alturaMedia;

  const exibirMensagem = (tipo: 'semRosto' | 'erroRecalibrar' | 'sucesso' | 'falha', acao?: () => void) => {
    const configuracoes = {
      semRosto: { img: '/assets/modal/aviso.png', tit: 'Rosto não Detectado', desc: 'Por favor, centralize seu rosto na câmera.' },
      erroRecalibrar: { img: '/assets/modal/camera.png', tit: 'Erro na Calibragem', desc: 'Algo deu errado. Precisamos recalibrar.' },
      sucesso: { img: '/assets/modal/sucesso.png', tit: 'Tudo Certo!', desc: 'Piscadas validadas! Vamos começar os jogos.' },
      falha: { img: '/assets/modal/erro.png', tit: 'Falha no Teste', desc: 'Não conseguimos detectar suas piscadas. Tentar novamente?' },
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
    if (alturaMediaOlhoSalva === 0) {
      exibirMensagem('erroRecalibrar', () => navegar('/calibragem-ocular'));
      return;
    }

    const inicializarDetector = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm");
        referenciaDetectorFace.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-assets/face_landmarker.task", delegate: "GPU" },
          runningMode: "VIDEO", numFaces: 1
        });
        await iniciarCamera();
        setCarregando(false);
      } catch (err) {
        exibirMensagem('erroRecalibrar', () => navegar('/calibragem-ocular'));
      }
    };

    const iniciarCamera = async () => {
      if (!referenciaVideo.current) return;
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      referenciaVideo.current.srcObject = stream;
      referenciaVideo.current.onloadeddata = () => {
        referenciaVideo.current?.play();
        processarFrames();
      };
    };

    inicializarDetector();
    return () => {
      if (referenciaTemporizador.current) clearTimeout(referenciaTemporizador.current);
      if (referenciaVideo.current?.srcObject) {
        (referenciaVideo.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

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
        const olhoE = { topo: pontos[159], base: pontos[145] };
        const olhoD = { topo: pontos[386], base: pontos[374] };

        // Desenha as guias nos olhos
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 3;
        [olhoE, olhoD].forEach(olho => {
          ctx.beginPath();
          ctx.moveTo(canvas.width - olho.topo.x * canvas.width, olho.topo.y * canvas.height);
          ctx.lineTo(canvas.width - olho.base.x * canvas.width, olho.base.y * canvas.height);
          ctx.stroke();
        });

        // Lógica de Detecção de Piscada
        const alturaE = Math.abs(olhoE.base.y - olhoE.topo.y);
        const alturaD = Math.abs(olhoD.base.y - olhoD.topo.y);
        const mediaAtual = (alturaE + alturaD) / 2;

        if (mediaAtual < alturaMediaOlhoSalva * LIMIAR_PISCADA) {
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
      finalizarAvaliacao();
      return;
    }

    const timerInicio = setTimeout(() => {
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

    return () => clearTimeout(timerInicio);
  }, [indiceTentativaAtual]);

  const finalizarAvaliacao = () => {
    statusDoTesteRef.current = 'finalizado';
    const acertos = tentativas.filter(t => t === 'sucesso').length;
    
    if (acertos >= 2) {
      lojaOlho.getState().setMostrarCameraFlutuante(true);
      exibirMensagem('sucesso', () => navegar('/jogos'));
    } else {
      exibirMensagem('falha', iniciarTesteDePiscada);
    }
  };

  const iniciarTesteDePiscada = () => {
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
      <S.ContainerDaTela>
        <S.ContainerDoTeste>
          <S.BlocoDeDescricao>
            <S.Titulo>Teste de Piscada</S.Titulo>
            <S.Paragrafo>
              {statusDoTesteRef.current === 'pronto' 
                ? "Vamos validar sua câmera antes de começar." 
                : "Pisque rápido sempre que a bolinha pulsar!"}
            </S.Paragrafo>
          </S.BlocoDeDescricao>

          <S.ContainerVideo>
            <S.VideoCamera ref={referenciaVideo} autoPlay playsInline muted />
            <S.CanvasSobreposicao ref={referenciaCanvas} />
          </S.ContainerVideo>

          <S.ContainerBolinhas>
            {tentativas.map((status, i) => (
              <S.BolinhaTeste key={i} status={status}>
                {status === 'ativo' && <TemporizadorVisual duracao={TEMPO_POR_PISCADA} />}
              </S.BolinhaTeste>
            ))}
          </S.ContainerBolinhas>

          {statusDoTesteRef.current === 'pronto' && (
            <S.BotaoAcao onClick={iniciarTesteDePiscada} disabled={carregando}>
              {carregando ? "Carregando Câmera..." : "INICIAR TESTE"}
            </S.BotaoAcao>
          )}
        </S.ContainerDoTeste>
      </S.ContainerDaTela>
    </>
  );
};

export default CalibragemTeste;