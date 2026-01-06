import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as S from './styles';
import { useStore } from 'zustand'; 
import { lojaOlho } from '../../../lojas/lojaOlho'; 
import { pararNarracao } from '../../../servicos/acessibilidade';
import { useLeitorOcular } from '../../../hooks/useLeitorOcular';
import type { EstadoPlaneta, Jogos, VelocidadeGeracao } from '../../../interface/types';

// --- CONSTANTES ---
const planetasDoHudOrdem = [
 { nome: 'Mercúrio', imagem: '/assets/sistemaSolar/mercurio.png' },
 { nome: 'Vênus', imagem: '/assets/sistemaSolar/venus.png' },
 { nome: 'Terra', imagem: '/assets/sistemaSolar/terra.png' },
 { nome: 'Marte', imagem: '/assets/sistemaSolar/marte.png' },
 { nome: 'Júpiter', imagem: '/assets/sistemaSolar/jupiter.png' },
 { nome: 'Saturno', imagem: '/assets/sistemaSolar/saturno.png' },
 { nome: 'Urano', imagem: '/assets/sistemaSolar/urano.png' },
 { nome: 'Netuno', imagem: '/assets/sistemaSolar/netuno.png' },
];

const meteorosParaGerar = [{ nome: 'meteoro', imagem: '/assets/sistemaSolar/meteoro.png' }];

const MAPA_VELOCIDADE: Record<VelocidadeGeracao, { min: number; max: number }> = {
 lenta: { min: 8, max: 12 },
 normal: { min: 5, max: 7 },
 rapida: { min: 2.5, max: 4 },
};

const POSICAO_TOPO = '12vh';
const POSICAO_BASE = '70vh';

const JogoSistemaSolar: React.FC<Jogos> = ({ aoVencer, aoPerder, configuracoes }) => {
 const { estaPiscando, mostrarCameraFlutuante: modoOcular, leitorAtivo } = useStore(lojaOlho); 
  
 const [jogoIniciado, setJogoIniciado] = useState(false);
 const [planetasVisiveis, setPlanetasVisiveis] = useState<EstadoPlaneta[]>([]);
 const [posicaoAstronauta, setPosicaoAstronauta] = useState(POSICAO_BASE); 
 const [posicaoHorizontal, setPosicaoHorizontal] = useState('-20vw'); 
 const [estaVisivel, setEstaVisivel] = useState(true);

 const [estaColidindo, setEstaColidindo] = useState(false);
 const [faiscas, setFaiscas] = useState<{ top: number; left: number } | null>(null);
 const [planetasColetados, setPlanetasColetados] = useState<Record<string, boolean>>({});
 const [proximoPlanetaIndex, setProximoPlanetaIndex] = useState(0);
 const [planetaAnunciado, setPlanetaAnunciado] = useState<{ nome: string; id: number } | null>(null);

 const [podeInteragirOcular, setPodeInteragirOcular] = useState(false);
 const piscadaProcessadaRef = useRef(false);
 const timerDebounceRef = useRef<NodeJS.Timeout | null>(null);
 const proximoIdRef = useRef(0);
 const astronautaRef = useRef<HTMLDivElement>(null);
 const containerRef = useRef<HTMLDivElement>(null);
 const musicaFundoRef = useRef<HTMLAudioElement | null>(null);
 const somColetaRef = useRef<HTMLAudioElement | null>(null);

 useEffect(() => {
    if (!modoOcular) { setPodeInteragirOcular(true); return; }
    setPodeInteragirOcular(false);
    if (timerDebounceRef.current) clearTimeout(timerDebounceRef.current);
    
    if (!leitorAtivo) {
       timerDebounceRef.current = setTimeout(() => setPodeInteragirOcular(true), 1200);
    }
 }, [modoOcular, leitorAtivo]);


 const textoParaLeitura = useMemo(() => {
    if (!leitorAtivo) return null;
    
    if (!jogoIniciado) {
       return "Prepare-se! A nave está em posição. Pisque os olhos agora para decolar e começar a missão!";
    }
    if (planetaAnunciado) {
       const proximo = planetasDoHudOrdem[proximoPlanetaIndex]?.nome;
       return proximo 
          ? `${planetaAnunciado.nome} coletado! Agora busque por ${proximo}.` 
          : "Parabéns! Você coletou todos os planetas!";
    }
    return "";
 }, [leitorAtivo, jogoIniciado, proximoPlanetaIndex, planetaAnunciado]);

 useLeitorOcular(textoParaLeitura, [textoParaLeitura], () => {
    if (modoOcular && leitorAtivo) setPodeInteragirOcular(true);
 });

 useEffect(() => {
    if (!estaPiscando) { 
       piscadaProcessadaRef.current = false; 
       return; 
    }

    if (estaPiscando && modoOcular && podeInteragirOcular && !piscadaProcessadaRef.current) {
       piscadaProcessadaRef.current = true;
       
       if (!jogoIniciado) {
          setJogoIniciado(true);
       } else {
          setPosicaoAstronauta(p => p === POSICAO_BASE ? POSICAO_TOPO : POSICAO_BASE);
       }
    }
 }, [estaPiscando, modoOcular, podeInteragirOcular, jogoIniciado]);

 useEffect(() => {
  if (!jogoIniciado || !estaVisivel || proximoPlanetaIndex === planetasDoHudOrdem.length) return;

  const gerarCorpo = () => {
   const lote = planetasDoHudOrdem.slice(proximoPlanetaIndex, proximoPlanetaIndex + 3);
   const corposParaGerar = [...lote, ...meteorosParaGerar];
   const corpoAleatorio = corposParaGerar[Math.floor(Math.random() * corposParaGerar.length)];
   const isMeteoro = corpoAleatorio.nome === 'meteoro';
   
   const topProposto = Math.random() * 65 + 15;
   const vel = MAPA_VELOCIDADE[configuracoes.velocidade];
   const duracao = Math.random() * (vel.max - vel.min) + vel.min;
   const vmin = Math.min(window.innerWidth, window.innerHeight);
   const tamanho = isMeteoro ? vmin * 0.08 : vmin * 0.14; 

   setPlanetasVisiveis(atuais => [...atuais, {
     id: proximoIdRef.current++, nome: corpoAleatorio.nome, imagem: corpoAleatorio.imagem, top: topProposto,
     duracao: isMeteoro ? duracao * 0.7 : duracao,
     tamanho: tamanho
   }]);
  };

  const intervalo = setInterval(gerarCorpo, 2800);
  return () => clearInterval(intervalo);
 }, [jogoIniciado, proximoPlanetaIndex, configuracoes.velocidade, estaVisivel]);

 useEffect(() => {
    const manipularVisibilidade = () => {
       const visivel = !document.hidden;
       setEstaVisivel(visivel);
       if (!visivel) { musicaFundoRef.current?.pause(); pararNarracao(); }
       else if (configuracoes.sons) musicaFundoRef.current?.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', manipularVisibilidade);
    return () => document.removeEventListener('visibilitychange', manipularVisibilidade);
 }, [configuracoes.sons]);

 useEffect(() => { setTimeout(() => { setPosicaoHorizontal('50vw'); }, 100); }, []);

 const removerPlaneta = useCallback((id: number) => { 
    setPlanetasVisiveis(p => p.filter(pl => pl.id !== id)); 
 }, []);

 useEffect(() => {
  if (proximoPlanetaIndex === planetasDoHudOrdem.length) {
     setTimeout(() => { setPosicaoHorizontal('120vw'); setTimeout(aoVencer, 1500); }, 500);
  }
 }, [proximoPlanetaIndex, aoVencer]);

 useEffect(() => {
  musicaFundoRef.current = new Audio('/assets/sistemaSolar/sounds/ambiente.mp3');
  musicaFundoRef.current.loop = true;
  musicaFundoRef.current.volume = 0.2;
  somColetaRef.current = new Audio('/assets/sistemaSolar/sounds/coleta.mp3');
  if (configuracoes.sons && estaVisivel) musicaFundoRef.current.play().catch(() => {});
  return () => musicaFundoRef.current?.pause();
 }, [configuracoes.sons, estaVisivel]);

 useEffect(() => {
  const tratarTecla = (e: KeyboardEvent) => {
   if (!estaVisivel) return;
   if (['ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
      if (!jogoIniciado) {
         setJogoIniciado(true);
      } else {
         if (e.key === 'ArrowUp') setPosicaoAstronauta(POSICAO_TOPO);
         else if (e.key === 'ArrowDown') setPosicaoAstronauta(POSICAO_BASE);
         else if (e.key === ' ') setPosicaoAstronauta(p => p === POSICAO_BASE ? POSICAO_TOPO : POSICAO_BASE);
      }
   }
  };
  window.addEventListener('keydown', tratarTecla);
  return () => window.removeEventListener('keydown', tratarTecla);
 }, [estaVisivel, jogoIniciado]);

 useEffect(() => {
  let idFrame: number;
  const loop = () => {
   if (!estaVisivel || !astronautaRef.current || !containerRef.current || !jogoIniciado) { 
      idFrame = requestAnimationFrame(loop); return; 
   }
   
   const astroRect = astronautaRef.current.getBoundingClientRect();
   const planetasDOM = containerRef.current.querySelectorAll<HTMLElement>('.planeta');
   
   for (const el of planetasDOM) {
    const pRect = el.getBoundingClientRect();
    if (astroRect.left < pRect.right && astroRect.right > pRect.left && astroRect.top < pRect.bottom && astroRect.bottom > pRect.top) {
     const pNome = el.dataset.nome as string;
     const pId = Number(el.dataset.id);
     const alvoNome = planetasDoHudOrdem[proximoPlanetaIndex]?.nome;
     
     setEstaColidindo(true);
     setTimeout(() => setEstaColidindo(false), 400);
     setFaiscas({ top: pRect.top + pRect.height/2, left: pRect.left + pRect.width/2 });
     setTimeout(() => setFaiscas(null), 500);
     removerPlaneta(pId);

     if (configuracoes.penalidade && (pNome === 'meteoro' || pNome !== alvoNome)) {
       aoPerder();
     } else if (pNome === alvoNome) {
      if (configuracoes.sons && somColetaRef.current) { somColetaRef.current.currentTime = 0; somColetaRef.current.play(); }
      setPlanetaAnunciado({ nome: pNome, id: Date.now() });
      setTimeout(() => setPlanetaAnunciado(null), 1800);
      setPlanetasColetados(prev => ({ ...prev, [pNome]: true }));
      setProximoPlanetaIndex(i => i + 1);
     }
     break;
    }
   }
   idFrame = requestAnimationFrame(loop);
  };
  idFrame = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(idFrame);
 }, [proximoPlanetaIndex, configuracoes.penalidade, configuracoes.sons, aoPerder, removerPlaneta, estaVisivel, jogoIniciado]);

 return (
  <S.FundoEspacial ref={containerRef}>
   <S.HudContainer>
    {planetasDoHudOrdem.map(p => (
     <S.HudPlanetaImagem key={p.nome} src={p.imagem} $coletado={!!planetasColetados[p.nome]} />
    ))}
   </S.HudContainer>

   <S.EstrelasPequenas />
   <S.EstrelasMedias />
   <S.EstrelasGrandes />

   {planetasVisiveis.map(p => (
    <S.Planeta key={p.id} className="planeta" data-id={p.id} data-nome={p.nome} src={p.imagem} $top={p.top} $duracao={p.duracao} $tamanho={p.tamanho} onAnimationEnd={() => removerPlaneta(p.id)} />
   ))}

   <S.AstronautaWrapper ref={astronautaRef} $top={posicaoAstronauta} $left={posicaoHorizontal}>
      <S.AstronautaImg src="/assets/sistemaSolar/astronauta.png" $colidindo={estaColidindo} />
   </S.AstronautaWrapper>

   {!jogoIniciado && (
      <S.NomePlanetaAnuncio>PISQUE PARA COMEÇAR</S.NomePlanetaAnuncio>
   )}

   {faiscas && (
    <S.ContainerFaiscas top={faiscas.top} left={faiscas.left}>
     {Array.from({ length: 6 }).map((_, i) => <S.Faisca key={i} />)}
    </S.ContainerFaiscas>
   )}

   {planetaAnunciado && <S.NomePlanetaAnuncio key={planetaAnunciado.id}>{planetaAnunciado.nome}</S.NomePlanetaAnuncio>}
  </S.FundoEspacial>
 );
};

export default JogoSistemaSolar;