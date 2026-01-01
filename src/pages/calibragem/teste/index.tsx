import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import * as S from './styles'; 
import { lojaOlho } from '../../../lojas/lojaOlho';
import ModalGenerico from '../../../componentes/ModalGenerico';
import { EstiloGlobal } from '../../../estilos/global';
import ModalLeitorTela from '../../../componentes/ModaLeitorTela';

// Configurações de Intencionalidade (Essencial para AME/ELA)
const LIMIAR_PISCADA = 0.55; 
const DURACAO_MIN_CLIQUE = 250; // Descarta piscadas involuntárias/reflexos
const DURACAO_MAX_CLIQUE = 1000; // Descarta se o olho ficar fechado por cansaço/sono
const TENTATIVAS_TOTAIS = 3;

const CalibragemTeste: React.FC = () => {
  const navegar = useNavigate();
  
  // Referências
  const referenciaVideo = useRef<HTMLVideoElement>(null);
  const referenciaDetectorFace = useRef<FaceLandmarker | null>(null);
  const requestRef = useRef<number | null>(null); // CORREÇÃO: Referência para o loop de animação
  
  // Controle de tempo para validar a intenção da criança
  const inicioOlhoFechado = useRef<number | null>(null);
  const ultimoCliqueTime = useRef<number>(0);

  // Estados
  const [carregando, setCarregando] = useState(true);
  const [tentativas, setTentativas] = useState<S.StatusBolinha[]>(Array(TENTATIVAS_TOTAIS).fill('pendente'));
  const [indiceAtual, setIndiceAtual] = useState<number | null>(null);
  const [mostrarPerguntaLeitor, setMostrarPerguntaLeitor] = useState(false);
  const [estadoModal, setEstadoModal] = useState({
    estaAberto: false,
    imagemSrc: '',
    titulo: '',
    descricao: '',
    acaoAposFechar: undefined as (() => void) | undefined,
  });

  const { alturaMedia, setLeitorAtivo, setMostrarCameraFlutuante } = lojaOlho.getState();

  // Inicialização
  useEffect(() => {
    if (alturaMedia === 0) {
      exibirMensagem('erroRecalibrar', () => navegar('/calibragem-ocular'));
      return;
    }

    const inicializar = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm");
        referenciaDetectorFace.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-assets/face_landmarker.task", delegate: "GPU" },
          runningMode: "VIDEO", numFaces: 1
        });
        await abrirCamera();
        setCarregando(false);
      } catch (err) {
        console.error("Erro ao carregar detector:", err);
      }
    };

    const abrirCamera = async () => {
      if (!referenciaVideo.current) return;
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      referenciaVideo.current.srcObject = stream;
      referenciaVideo.current.onloadeddata = () => {
        referenciaVideo.current?.play();
        requestRef.current = requestAnimationFrame(processarFrames);
      };
    };

    inicializar();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (referenciaVideo.current?.srcObject) {
        (referenciaVideo.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [alturaMedia]);

  const processarFrames = () => {
    const video = referenciaVideo.current;
    const detector = referenciaDetectorFace.current;

    if (detector && video && video.readyState >= 2) {
      const resultado = detector.detectForVideo(video, performance.now());

      if (resultado.faceLandmarks?.[0]) {
        const pontos = resultado.faceLandmarks[0];
        
        // Média da altura atual dos dois olhos
        const hE = Math.abs(pontos[145].y - pontos[159].y);
        const hD = Math.abs(pontos[374].y - pontos[386].y);
        const alturaAtual = (hE + hD) / 2;

        const agora = performance.now();
        const estaFechado = alturaAtual < alturaMedia * LIMIAR_PISCADA;

        if (estaFechado) {
          // Se o olho acabou de fechar, marca o início
          if (inicioOlhoFechado.current === null) {
            inicioOlhoFechado.current = agora;
          }
        } else {
          // O olho abriu. Vamos ver quanto tempo ficou fechado?
          if (inicioOlhoFechado.current !== null) {
            const duracao = agora - inicioOlhoFechado.current;

            // Só aceita se for uma piscada "longa o suficiente" para ser intencional (AME/ELA)
            if (duracao >= DURACAO_MIN_CLIQUE && duracao <= DURACAO_MAX_CLIQUE) {
              if (agora - ultimoCliqueTime.current > 600) { // Cooldown de 600ms
                confirmarPiscada();
                ultimoCliqueTime.current = agora;
              }
            }
            inicioOlhoFechado.current = null;
          }
        }
      }
    }
    requestRef.current = requestAnimationFrame(processarFrames);
  };

  const confirmarPiscada = () => {
    // Só valida se o teste já tiver começado e não tiver terminado
    setIndiceAtual(prev => {
      if (prev !== null && prev < TENTATIVAS_TOTAIS) {
        setTentativas(t => {
          const novo = [...t];
          novo[prev] = 'sucesso';
          return novo;
        });
        return prev + 1;
      }
      return prev;
    });
  };

  // Observa o fim das tentativas
  useEffect(() => {
    if (indiceAtual === TENTATIVAS_TOTAIS) {
      exibirMensagem('sucesso', () => setMostrarPerguntaLeitor(true));
    }
  }, [indiceAtual]);

  const exibirMensagem = (tipo: 'erroRecalibrar' | 'sucesso', acao?: () => void) => {
    const configs = {
      erroRecalibrar: { img: '/assets/modal/camera.png', tit: 'Erro na Calibragem', desc: 'Precisamos recalibrar seu olhar.' },
      sucesso: { img: '/assets/modal/sucesso.png', tit: 'Parabéns!', desc: 'Você aprendeu a usar o sensor!' },
    };
    const config = configs[tipo];
    setEstadoModal({ estaAberto: true, imagemSrc: config.img, titulo: config.tit, descricao: config.desc, acaoAposFechar: acao });
  };

  const finalizarTudo = (ativarLeitor: boolean) => {
    setLeitorAtivo(ativarLeitor);
    setMostrarCameraFlutuante(true);
    setMostrarPerguntaLeitor(false);
    navegar('/jogos');
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
      <ModalLeitorTela estaAberto={mostrarPerguntaLeitor} aoEscolher={finalizarTudo} />

      <S.ContainerDaTela>
        <S.ContainerDoTeste>
          <S.BlocoDeDescricao>
            <S.Titulo>Teste de Intencionalidade</S.Titulo>
            <S.Paragrafo>
              {indiceAtual === null 
                ? "Clique no botão e depois tente piscar com calma." 
                : "Muito bem! Agora feche os olhos e abra devagar."}
            </S.Paragrafo>
          </S.BlocoDeDescricao>

          <S.ContainerVideo>
            <S.VideoCamera ref={referenciaVideo} autoPlay playsInline muted />
          </S.ContainerVideo>

          <S.ContainerBolinhas>
            {tentativas.map((s, i) => (
              <S.BolinhaTeste key={i} status={s} />
            ))}
          </S.ContainerBolinhas>

          {indiceAtual === null && (
            <S.BotaoAcao onClick={() => setIndiceAtual(0)} disabled={carregando}>
              {carregando ? "Carregando..." : "INICIAR TESTE"}
            </S.BotaoAcao>
          )}
        </S.ContainerDoTeste>
      </S.ContainerDaTela>
    </>
  );
};

export default CalibragemTeste;