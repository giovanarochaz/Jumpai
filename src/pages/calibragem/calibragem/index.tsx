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

const TOTAL_AMOSTRAS = 150;

const CalibragemOcular: React.FC = () => {
  const navegar = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  
  const streamRef = useRef<MediaStream | null>(null);
  
  const amostrasERef = useRef<number[]>([]);
  const amostrasDRef = useRef<number[]>([]);
  const calibrandoRef = useRef(false);

  const [iaPronta, setIaPronta] = useState(false);
  const [fase, setFase] = useState<'prep' | 'contagem' | 'foco'>('prep');
  const [contagem, setContagem] = useState(3);
  const [progresso, setProgresso] = useState(0);
  const [exibirFlash, setExibirFlash] = useState(false);

  const desligarCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop(); 
        track.enabled = false;
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    const carregarIA = async () => {
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
        await iniciarCamera();
        setIaPronta(true);
      } catch (err) {
        console.error("Erro ao carregar IA:", err);
      }
    };

    const iniciarCamera = async () => {
      if (!videoRef.current) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        
        videoRef.current.onloadeddata = () => {
          videoRef.current?.play();
          requestAnimationFrame(processar);
        };
      } catch (err) {
        console.error("Erro ao acessar câmera:", err);
      }
    };

    carregarIA();

    return () => {
      desligarCamera();
      calibrandoRef.current = false; 
    };
  }, []);

  const processar = () => {
    // Verifica se a IA e o vídeo ainda estão ativos antes de processar
    if (faceLandmarkerRef.current && videoRef.current && videoRef.current.readyState >= 2 && streamRef.current) {
      const resultado = faceLandmarkerRef.current.detectForVideo(videoRef.current, performance.now());
      
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
      requestAnimationFrame(processar);
    }
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
        setTimeout(() => {
          calibrandoRef.current = true;
        }, 500);
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
    
    lojaOlho.getState().setAlturaMediaEsquerda(medE);
    lojaOlho.getState().setAlturaMediaDireita(medD);
    lojaOlho.getState().setAlturaMedia((medE + medD) / 2);

    setTimeout(() => navegar("/calibragem-teste"), 800);
  };

  return (
    <ConteinerPrincipal>
      <EstiloGlobal />
      {exibirFlash && <Flash />}

      <AreaCamera $visivel={fase === 'prep'}>
        <ElementoVideo ref={videoRef} autoPlay muted playsInline />
      </AreaCamera>

      {fase === 'prep' && (
        <BlocoPreparacao>
          <Titulo>Prepare seu Olhar</Titulo>
          <TextoInstrucao>
            Centralize seu rosto. Ao começar, olhe fixamente para o alvo 
            e mantenha os olhos abertos normalmente até completar 100%.
          </TextoInstrucao>
          <BotaoIniciar onClick={iniciarFluxo} disabled={!iaPronta}>
            {iaPronta ? "Começar Calibragem" : "Carregando Sensor..."}
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