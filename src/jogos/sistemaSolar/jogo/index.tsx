import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as S from './styles';
import type { ConfiguracoesJogo, VelocidadeGeracao } from '../manual';
// Importações para o controle ocular
import { useStore } from 'zustand'; 
import { lojaOlho } from '../../../lojas/lojaOlho'; 

const planetasDoHudOrdem = [
 { nome: 'mercurio', imagem: '/assets/sistemaSolar/mercurio.png' },
 { nome: 'venus', imagem: '/assets/sistemaSolar/venus.png' },
 { nome: 'terra', imagem: '/assets/sistemaSolar/terra.png' },
 { nome: 'marte', imagem: '/assets/sistemaSolar/marte.png' },
 { nome: 'jupiter', imagem: '/assets/sistemaSolar/jupiter.png' },
 { nome: 'saturno', imagem: '/assets/sistemaSolar/saturno.png' },
 { nome: 'urano', imagem: '/assets/sistemaSolar/urano.png' },
 { nome: 'netuno', imagem: '/assets/sistemaSolar/netuno.png' },
];
const meteorosParaGerar = [
 { nome: 'meteoro', imagem: '/assets/sistemaSolar/meteoro.png' },
 { nome: 'meteoro', imagem: '/assets/sistemaSolar/meteoro.png' },
];

const MAPA_VELOCIDADE_PLANETAS: Record<VelocidadeGeracao, { min: number; max: number }> = {
 lenta: { min: 7, max: 12 },
 normal: { min: 5, max: 7 },
 rapida: { min: 2.5, max: 3.5 },
};

// --- Constantes de Posição ---
const ALTURA_ASTRONAUTA = '200px';
const POSICAO_TOPO = '20px';
const POSICAO_BASE = `calc(100vh - 20px - ${ALTURA_ASTRONAUTA})`;

interface EstadoPlaneta { id: number; nome: string; imagem: string; top: number; duracao: number; tamanho: number; }

// ALTERAÇÃO 1: Adicionado aoPerder na interface
interface JogoSistemaSolarProps { 
  aoVencer: () => void; 
  aoPerder: () => void; 
  configuracoes: ConfiguracoesJogo; 
}

const criarEstadoInicialColeta = () => {
 const estado: { [key: string]: boolean } = {};
 planetasDoHudOrdem.forEach(planeta => { estado[planeta.nome] = false; });
 return estado;
};

// ALTERAÇÃO 2: Recebendo aoPerder nas props
const JogoSistemaSolar: React.FC<JogoSistemaSolarProps> = ({ aoVencer, aoPerder, configuracoes }) => {
 // CONTROLE OCULAR
 const { estaPiscando } = useStore(lojaOlho); 
  
 const [planetasVisiveis, setPlanetasVisiveis] = useState<EstadoPlaneta[]>([]);
 
 // POSIÇÃO
 const [posicaoAstronauta, setPosicaoAstronauta] = useState(POSICAO_BASE); 
 
 const [estaColidindo, setEstaColidindo] = useState(false);
 const [faiscas, setFaiscas] = useState<{ top: number; left: number } | null>(null);
 const [planetasColetados, setPlanetasColetados] = useState(criarEstadoInicialColeta());
 const [proximoPlanetaIndex, setProximoPlanetaIndex] = useState(0);
 const [planetaAnunciado, setPlanetaAnunciado] = useState<{ nome: string; id: number } | null>(null);

 const proximoIdRef = useRef(0);
 const astronautaRef = useRef<HTMLImageElement>(null);
 const containerRef = useRef<HTMLDivElement>(null);
 const ultimoGeradoRef = useRef<string | null>(null);
 const musicaFundoRef = useRef<HTMLAudioElement | null>(null);
 const somColetaRef = useRef<HTMLAudioElement | null>(null);
 
 const removerPlaneta = useCallback((id: number) => { setPlanetasVisiveis(p => p.filter(planeta => planeta.id !== id)); }, []);
 
 // LÓGICA DE RESET SIMPLIFICADA (Ainda útil para reiniciar estados internos se necessário, mas não é chamada na derrota)
 const resetarProgresso = useCallback(() => { 
    setPlanetasColetados(criarEstadoInicialColeta()); 
    setProximoPlanetaIndex(0); 
    console.warn("[Reset] Progresso resetado.");
 }, [setPlanetasColetados, setProximoPlanetaIndex]); 

 // EFEITO 1: Condição de Vitória
 useEffect(() => {
  if (proximoPlanetaIndex === planetasDoHudOrdem.length) {
   setTimeout(() => { aoVencer(); }, 500);
  }
 }, [proximoPlanetaIndex, aoVencer]);

 // EFEITO 2: Configuração e Limpeza de Áudio
 useEffect(() => {
  musicaFundoRef.current = new Audio('/assets/sistemaSolar/sounds/ambiente.mp3');
  musicaFundoRef.current.loop = true;
  musicaFundoRef.current.volume = 0.3;
  somColetaRef.current = new Audio('/assets/sistemaSolar/sounds/coleta.mp3');
  somColetaRef.current.volume = 1;

  if (configuracoes.sons) {
   musicaFundoRef.current.play().catch(e => console.error("A reprodução de áudio falhou:", e));
  }
  return () => { musicaFundoRef.current?.pause(); };
 }, [configuracoes.sons]);

 // EFEITO 3: Geração de Planetas e Meteoros
 useEffect(() => {
  const gerarPlaneta = () => {
   let planetasDoLote: typeof planetasDoHudOrdem;
   const totalDePlanetas = planetasDoHudOrdem.length;
   if (proximoPlanetaIndex >= totalDePlanetas - 3) {
    planetasDoLote = planetasDoHudOrdem.slice(totalDePlanetas - 4);
   } else {
    planetasDoLote = planetasDoHudOrdem.slice(proximoPlanetaIndex, proximoPlanetaIndex + 4);
   }
   let corposParaGerar = [...planetasDoLote, ...meteorosParaGerar];
   if (corposParaGerar.length > 1 && ultimoGeradoRef.current) {
    corposParaGerar = corposParaGerar.filter(corpo => corpo.nome !== ultimoGeradoRef.current);
   }
   if (corposParaGerar.length === 0) return;

   const corpoAleatorio = corposParaGerar[Math.floor(Math.random() * corposParaGerar.length)];
   const isMeteoro = corpoAleatorio.nome === 'meteoro';
   let topProposto = 0, posicaoValida = false;
   for (let i = 0; i < 15 && !posicaoValida; i++) {
    topProposto = Math.random() * 75;
    posicaoValida = !planetasVisiveis.some(p => Math.abs(topProposto - p.top) < 20);
   }

   if (posicaoValida) {
    const velocidadeConfig = MAPA_VELOCIDADE_PLANETAS[configuracoes.velocidade];
    const duracaoAnimacao = Math.random() * (velocidadeConfig.max - velocidadeConfig.min) + velocidadeConfig.min;
    const duracaoFinal = isMeteoro ? duracaoAnimacao * 0.7 : duracaoAnimacao;

    const largura = window.innerWidth;
    const altura = window.innerHeight;

    const baseProporcional = (largura + altura) / 2;
    const tamanho = isMeteoro ? baseProporcional * (Math.random() * 0.02 + 0.02) : baseProporcional * (Math.random() * 0.03 + 0.05); 

    setPlanetasVisiveis(atuais => [...atuais, {
     id: proximoIdRef.current++, nome: corpoAleatorio.nome, imagem: corpoAleatorio.imagem, top: topProposto,
     duracao: duracaoFinal,
     tamanho: tamanho
    }]);
    ultimoGeradoRef.current = corpoAleatorio.nome;
   }
  };
  const intervalo = setInterval(gerarPlaneta, 3000);
  return () => clearInterval(intervalo);
 }, [proximoPlanetaIndex, planetasVisiveis, configuracoes.velocidade]);

 // EFEITO 4: Movimento por Piscada
 useEffect(() => {
    console.log(`[Efeito Piscada/START] Piscando=${estaPiscando}`);

    if (!estaPiscando) {
        return;
    }

    console.log("[Efeito Piscada/FINAL] *** MOVIMENTO AUTORIZADO INSTANTÂNEO! ***");
    
    setPosicaoAstronauta(p => {
        return p === POSICAO_BASE ? POSICAO_TOPO : POSICAO_BASE;
    });

    console.log("[Efeito Piscada/FINAL] Posição alternada.");

    return () => {
        console.log("[Efeito Piscada/FINAL] Efeito limpo.");
    };
}, [estaPiscando, setPosicaoAstronauta]); 

 // EFEITO 5: Movimento por Teclado
 useEffect(() => {
  const tratarTeclaPressionada = (evento: KeyboardEvent) => {
   if (evento.key === 'ArrowUp') {
    setPosicaoAstronauta(POSICAO_TOPO);
     console.log("[Efeito Teclado] Posição alterada para CIMA.");
   } else if (evento.key === 'ArrowDown') {
    setPosicaoAstronauta(POSICAO_BASE);
     console.log("[Efeito Teclado] Posição alterada para BAIXO.");
   }
  };

  window.addEventListener('keydown', tratarTeclaPressionada);
  return () => window.removeEventListener('keydown', tratarTeclaPressionada);
 }, []);


 // EFEITO 6: Loop do Jogo (Colisão e Detecção)
 useEffect(() => {
  let idFrameAnimacao: number;
  const loopJogo = () => {
   if (!astronautaRef.current || !containerRef.current) { idFrameAnimacao = requestAnimationFrame(loopJogo); return; }
   const astronautaRetangulo = astronautaRef.current.getBoundingClientRect();
   const planetasNoDOM = containerRef.current.querySelectorAll<HTMLElement>('.planeta');
   
   for (const planetaEl of planetasNoDOM) {
    const planetaRetangulo = planetaEl.getBoundingClientRect();
    const houveColisao = astronautaRetangulo.left < planetaRetangulo.right && astronautaRetangulo.right > planetaRetangulo.left && astronautaRetangulo.top < planetaRetangulo.bottom && astronautaRetangulo.bottom > planetaRetangulo.top;
    if (houveColisao) {
     const planetaId = Number(planetaEl.dataset.id);
     const planetaNome = planetaEl.dataset.nome as string;
     const planetaCorreto = planetasDoHudOrdem[proximoPlanetaIndex];
     
     setEstaColidindo(true);
     setTimeout(() => setEstaColidindo(false), 500);
     console.log(`[Colisão] Objeto ${planetaNome} colidiu.`);

     setFaiscas({ top: (planetaRetangulo.top + planetaRetangulo.bottom) / 2, left: (planetaRetangulo.left + planetaRetangulo.right) / 2 });
     setTimeout(() => setFaiscas(null), 600);
     removerPlaneta(planetaId);

     // --- ALTERAÇÃO AQUI: LÓGICA DE DERROTA ---
     if ((configuracoes.penalidade && planetaNome === 'meteoro') || (configuracoes.penalidade && planetaNome !== planetaCorreto?.nome)) {
       // Pausa a música do jogo para não conflitar com a tela de derrota
       musicaFundoRef.current?.pause();
       // Chama a função de derrota que vai trocar a tela
       aoPerder();
     } else if (planetaNome === planetaCorreto?.nome) {
      if (configuracoes.sons && somColetaRef.current) {
       somColetaRef.current.currentTime = 0;
       somColetaRef.current.play();
      }
       console.info(`[Coleta] Planeta correto (${planetaNome}) coletado!`);
      setPlanetaAnunciado({ nome: planetaNome, id: Date.now() });
      setTimeout(() => setPlanetaAnunciado(null), 1500);
      setPlanetasColetados(coletados => ({ ...coletados, [planetaNome]: true }));
      setProximoPlanetaIndex(indiceAnterior => indiceAnterior + 1);
     }
     break;
    }
   }
   idFrameAnimacao = requestAnimationFrame(loopJogo);
  };
  idFrameAnimacao = requestAnimationFrame(loopJogo);
  return () => cancelAnimationFrame(idFrameAnimacao);
 }, [removerPlaneta, resetarProgresso, proximoPlanetaIndex, configuracoes.penalidade, configuracoes.sons, aoPerder]); // Adicionado aoPerder nas dependências

 return (
  <S.FundoEspacial ref={containerRef}>
   <S.HudContainer>
    {planetasDoHudOrdem.map(planeta => (
     <S.HudPlanetaImagem 
      key={planeta.nome} 
      src={planeta.imagem} 
      alt={`Ícone de ${planeta.nome}`} 
      $coletado={planetasColetados[planeta.nome]} // Prop transiente
     />
    ))}
   </S.HudContainer>
   <S.EstrelasPequenas />
   <S.EstrelasMedias />
   <S.EstrelasGrandes />
   {planetasVisiveis.map(planeta => (
    <S.Planeta 
     key={planeta.id} 
     className="planeta" 
     data-id={planeta.id} 
     data-nome={planeta.nome} 
     src={planeta.imagem} 
     alt={planeta.nome} 
     $top={planeta.top} // Prop transiente
     $duracao={planeta.duracao} // Prop transiente
     $tamanho={planeta.tamanho} // Prop transiente
     onAnimationEnd={() => removerPlaneta(planeta.id)} 
    />
   ))}
   <S.Astronauta 
    ref={astronautaRef} 
    src="/assets/sistemaSolar/astronauta.png" 
    alt="Astronauta" 
    $top={posicaoAstronauta} // Prop transiente
    $colidindo={estaColidindo} // Prop transiente
   />
   {faiscas && (
    <S.ContainerFaiscas top={faiscas.top} left={faiscas.left}>
     {Array.from({ length: 6 }).map((_, i) => <S.Faisca key={i} />)}
    </S.ContainerFaiscas>
   )}
   {planetaAnunciado && (
    <S.NomePlanetaAnuncio key={planetaAnunciado.id}>{planetaAnunciado.nome}</S.NomePlanetaAnuncio>
   )}
  </S.FundoEspacial>
 );
};

export default JogoSistemaSolar;