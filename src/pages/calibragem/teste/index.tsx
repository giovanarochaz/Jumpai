// src/paginas/CalibragemTeste/index.tsx
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import * as S from './styles'; 
import { lojaOlho } from '../../../lojas/lojaOlho';
import { 
  CONFIG_OCULAR, 
  calcularAlturaMediaOlhos, 
  validarIntencionalidadePiscada 
} from '../../../config/rastreamentoConfig';
import ModalGenerico from '../../../componentes/ModalGenerico';
import { EstiloGlobal } from '../../../estilos/global';
import ModalLeitorTela from '../../../componentes/ModaLeitorTela';

const TENTATIVAS_TOTAIS = 3;

const CalibragemTeste: React.FC = () => {
  const navegar = useNavigate();
  
  // Referências
  const videoRef = useRef<HTMLVideoElement>(null);
  const detectorRef = useRef<FaceLandmarker | null>(null);
  const requestRef = useRef<number | null>(null);
  
  // Controle de tempo para validar a intenção (AME/ELA)
  const inicioFechado = useRef<number | null>(null);
  const ultimoClique = useRef<number>(0);

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

  // Inicialização do MediaPipe e Câmera
  useEffect(() => {
    // Se não houver calibragem prévia, volta para a tela de calibragem
    if (alturaMedia === 0) {
      exibirMensagem('erroRecalibrar', () => navegar('/calibragem-ocular'));
      return;
    }

    const inicializar = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(CONFIG_OCULAR.WASM_PATH);
        detectorRef.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: { 
            modelAssetPath: CONFIG_OCULAR.MODEL_ASSET_PATH, 
            delegate: "GPU" 
          },
          runningMode: "VIDEO", 
          numFaces: 1
        });
        await abrirCamera();
        setCarregando(false);
      } catch (err) {
        console.error("Erro ao carregar detector:", err);
      }
    };

    const abrirCamera = async () => {
      if (!videoRef.current) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          videoRef.current?.play();
          requestRef.current = requestAnimationFrame(processarFrames);
        };
      } catch (err) {
        console.error("Erro ao abrir câmera:", err);
      }
    };

    inicializar();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [alturaMedia, navegar]);

  // Loop de Processamento (Lógica centralizada aplicada aqui)
  const processarFrames = () => {
    const video = videoRef.current; // Criamos referência local para evitar erro de null do TS
    const detector = detectorRef.current;

    if (detector && video && video.readyState >= 2) {
      const agora = performance.now();
      const resultado = detector.detectForVideo(video, agora);

      if (resultado.faceLandmarks?.[0]) {
        const pontos = resultado.faceLandmarks[0];
        const alturaAtual = calcularAlturaMediaOlhos(pontos);
        
        // Verifica se o olho está abaixo do limiar de fechamento
        const estaFechado = alturaAtual < (alturaMedia * CONFIG_OCULAR.LIMIAR_PISCADA);

        if (estaFechado) {
          if (inicioFechado.current === null) {
            inicioFechado.current = agora;
          }
        } else {
          if (inicioFechado.current !== null) {
            const duracao = agora - inicioFechado.current;

            // Valida se a piscada foi intencional usando a regra centralizada
            if (validarIntencionalidadePiscada(duracao, agora, ultimoClique.current)) {
              confirmarPiscada();
              ultimoClique.current = agora;
            }
            inicioFechado.current = null;
          }
        }
      }
    }
    requestRef.current = requestAnimationFrame(processarFrames);
  };

  const confirmarPiscada = () => {
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

  // Observa conclusão do teste
  useEffect(() => {
    if (indiceAtual === TENTATIVAS_TOTAIS) {
      exibirMensagem('sucesso', () => setMostrarPerguntaLeitor(true));
    }
  }, [indiceAtual]);

  const exibirMensagem = (tipo: 'erroRecalibrar' | 'sucesso', acao?: () => void) => {
    const configs = {
      erroRecalibrar: { 
        img: '/assets/modal/camera.png', 
        tit: 'Erro na Calibragem', 
        desc: 'Precisamos recalibrar seu olhar.' 
      },
      sucesso: { 
        img: '/assets/modal/sucesso.png', 
        tit: 'Parabéns!', 
        desc: 'Você aprendeu a usar o sensor!' 
      },
    };
    const config = configs[tipo];
    setEstadoModal({ 
      estaAberto: true, 
      imagemSrc: config.img, 
      titulo: config.tit, 
      descricao: config.desc, 
      acaoAposFechar: acao 
    });
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
      
      <ModalLeitorTela 
        estaAberto={mostrarPerguntaLeitor} 
        aoEscolher={finalizarTudo} 
      />

      <S.ContainerDaTela>
        <S.ContainerDoTeste>
          <S.BlocoDeDescricao>
            <S.Titulo>Teste de Intencionalidade</S.Titulo>
            <S.Paragrafo>
              {carregando 
                ? "Carregando sensor..." 
                : (indiceAtual === null 
                    ? "Clique no botão e depois tente piscar com calma." 
                    : "Muito bem! Agora feche os olhos e abra devagar.")
              }
            </S.Paragrafo>
          </S.BlocoDeDescricao>

          <S.ContainerVideo>
            <S.VideoCamera ref={videoRef} autoPlay playsInline muted />
            {carregando && (
              <div style={{ position: 'absolute', color: 'white' }}>Iniciando câmera...</div>
            )}
          </S.ContainerVideo>

          <S.ContainerBolinhas>
            {tentativas.map((s, i) => (
              <S.BolinhaTeste key={i} status={s} />
            ))}
          </S.ContainerBolinhas>

          {indiceAtual === null && (
            <S.BotaoAcao 
              onClick={() => setIndiceAtual(0)} 
              disabled={carregando}
            >
              {carregando ? "AGUARDE..." : "INICIAR TESTE"}
            </S.BotaoAcao>
          )}
        </S.ContainerDoTeste>
      </S.ContainerDaTela>
    </>
  );
};

export default CalibragemTeste;