import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

import { 
  ConteinerPrincipal, AreaCamera, ElementoVideo, 
  BotaoIniciar, Titulo, TextoInstrucao, 
  BlocoPreparacao, TelaFocoAtivo, ConteinerAlvo, CirculoProgresso, 
  PontoCentro, TextoStatus, CamadaContagem, NumeroContagem, Flash 
} from './styles';

import { lojaOlho } from '../../../lojas/lojaOlho';
import { EstiloGlobal } from '../../../estilos/global';
import ModalInstrucao from '../../../componentes/ModalInstrucao';

const TOTAL_AMOSTRAS = 150;

const CalibragemOcular: React.FC = () => {
  const navegar = useNavigate();
  
  const [exibirTutorial, setExibirTutorial] = useState(true);
  const [usuarioJaViu, setUsuarioJaViu] = useState(false);

  // Referências
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number | null>(null);
  
  // Dados de Calibragem
  const amostrasERef = useRef<number[]>([]);
  const amostrasDRef = useRef<number[]>([]);
  const calibrandoRef = useRef(false);

  // Estados de UI
  const [iaPronta, setIaPronta] = useState(false);
  const [carregandoIA, setCarregandoIA] = useState(false); 
  const [fase, setFase] = useState<'prep' | 'contagem' | 'foco'>('prep');
  const [contagem, setContagem] = useState(3);
  const [progresso, setProgresso] = useState(0);
  const [exibirFlash, setExibirFlash] = useState(false);

  useEffect(() => {
    const jaVisto = localStorage.getItem('@jumpai:tutorial_visto');
    if (jaVisto === 'true') {
      setUsuarioJaViu(true);
    }

    return () => {
      desligarCamera();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const ativarSensores = async () => {
    setCarregandoIA(true);
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );
      faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: { 
          modelAssetPath: "https://storage.googleapis.com/mediapipe-assets/face_landmarker.task", 
          delegate: "GPU" 
        },
        runningMode: "VIDEO", 
        numFaces: 1
      });

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });

      if (videoRef.current) {
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          videoRef.current?.play();
          requestRef.current = requestAnimationFrame(processar);
          setIaPronta(true);
          setCarregandoIA(false);
        };
      }
    } catch (err) {
      console.error("Erro ao ativar sensores:", err);
      alert("Não conseguimos acessar sua câmera. Verifique as permissões.");
      setCarregandoIA(false);
    }
  };

  const desligarCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const processar = () => {
    const video = videoRef.current;
    const detector = faceLandmarkerRef.current;

    if (detector && video && video.readyState >= 2 && streamRef.current) {
      const resultado = detector.detectForVideo(video, performance.now());
      if (resultado.faceLandmarks && resultado.faceLandmarks.length > 0 && calibrandoRef.current) {
        const pontos = resultado.faceLandmarks[0];
        const hE = Math.abs(pontos[145].y - pontos[159].y);
        const hD = Math.abs(pontos[374].y - pontos[386].y);

        amostrasERef.current.push(hE);
        amostrasDRef.current.push(hD);
        
        const perc = Math.min((amostrasERef.current.length / TOTAL_AMOSTRAS) * 100, 100);
        setProgresso(perc);

        if (amostrasERef.current.length >= TOTAL_AMOSTRAS) {
          finalizar();
          return;
        }
      }
    }
    requestRef.current = requestAnimationFrame(processar);
  };

  const iniciarFluxo = () => {
    setFase('contagem');
    let c = 3;
    const interval = setInterval(() => {
      c--;
      setContagem(c);
      if (c <= 0) {
        clearInterval(interval);
        setFase('foco');
        setTimeout(() => { calibrandoRef.current = true; }, 500);
      }
    }, 1000);
  };

  const finalizar = () => {
    calibrandoRef.current = false;
    setExibirFlash(true);
    const calcularMediana = (arr: number[]) => {
      const s = [...arr].sort((a, b) => a - b);
      return s[Math.floor(s.length / 2)];
    };
    const medE = calcularMediana(amostrasERef.current);
    const medD = calcularMediana(amostrasDRef.current);
    const store = lojaOlho.getState();
    store.setAlturaMediaEsquerda(medE);
    store.setAlturaMediaDireita(medD);
    store.setAlturaMedia((medE + medD) / 2);
    setTimeout(() => navegar("/calibragem-teste"), 800);
  };

  const fecharTutorialEAtivarCamera = (pular: boolean) => {
    if (!pular) localStorage.setItem('@jumpai:tutorial_visto', 'true');
    setExibirTutorial(false);
    ativarSensores(); 
  };

  return (
    <ConteinerPrincipal>
      <EstiloGlobal />
      
      <ModalInstrucao 
        estaAberto={exibirTutorial}
        podePular={usuarioJaViu}
        aoFinalizar={() => fecharTutorialEAtivarCamera(false)}
        aoPular={() => fecharTutorialEAtivarCamera(true)}
      />

      {exibirFlash && <Flash />}

      <AreaCamera $visivel={fase === 'prep' && iaPronta}>
        <ElementoVideo ref={videoRef} autoPlay muted playsInline />
      </AreaCamera>

      {fase === 'prep' && (
        <BlocoPreparacao>
          <Titulo>Prepare seu Olhar</Titulo>
          <TextoInstrucao>
            {carregandoIA 
              ? "Ativando sensores do robô..." 
              : "Centralize seu rosto. Ao começar, olhe fixamente para o alvo até completar 100%."}
          </TextoInstrucao>
          
          <BotaoIniciar onClick={iniciarFluxo} disabled={!iaPronta || carregandoIA}>
            {iaPronta ? "Começar Calibragem" : "Carregando..."}
          </BotaoIniciar>
        </BlocoPreparacao>
      )}

      {fase === 'contagem' && (
        <CamadaContagem>
          <NumeroContagem>{contagem}</NumeroContagem>
        </CamadaContagem>
      )}

      {fase === 'foco' && (
        <TelaFocoAtivo>
          <ConteinerAlvo>
            <CirculoProgresso>
              <circle 
                cx="90" cy="90" r="70" 
                style={{ strokeDashoffset: 440 - (440 * progresso) / 100 }} 
              />
            </CirculoProgresso>
            <PontoCentro />
          </ConteinerAlvo>
          <TextoStatus>Calibrando... Mantenha o Foco</TextoStatus>
          <TextoInstrucao style={{marginTop: '10px'}}>{Math.round(progresso)}%</TextoInstrucao>
        </TelaFocoAtivo>
      )}
    </ConteinerPrincipal>
  );
};

export default CalibragemOcular;