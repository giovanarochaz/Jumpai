import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as S from './styles';

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

interface PlanetaState {
  id: number;
  nome: string;
  imagem: string;
  top: number;
  duracao: number;
  tamanho: number;
}

const criarEstadoInicialColeta = () => {
  const estado: { [key: string]: boolean } = {};
  planetasDoHudOrdem.forEach(planeta => {
    estado[planeta.nome] = false;
  });
  return estado;
};

interface SistemaSolarProps {
  onVictory: () => void;
}

const JogoSistemaSolar: React.FC<SistemaSolarProps> = ({ onVictory }) => {
  const [planetasVisiveis, setPlanetasVisiveis] = useState<PlanetaState[]>([]);
  const [posicaoAstronauta, setPosicaoAstronauta] = useState('50%');
  const [isColliding, setIsColliding] = useState(false);
  const [sparks, setSparks] = useState<{ top: number; left: number } | null>(null);
  const [planetasColetados, setPlanetasColetados] = useState(criarEstadoInicialColeta());
  const [proximoPlanetaIndex, setProximoPlanetaIndex] = useState(0);

  const proximoIdRef = useRef(0);
  const astronautaRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // NOVO REF: para guardar o nome do último corpo gerado sem causar re-renderizações.
  const ultimoGeradoRef = useRef<string | null>(null);

  const removerPlaneta = useCallback((id: number) => {
    setPlanetasVisiveis(planetasAtuais =>
      planetasAtuais.filter(planeta => planeta.id !== id)
    );
  }, []);

  const resetarProgresso = useCallback(() => {
    setPlanetasColetados(criarEstadoInicialColeta());
    setProximoPlanetaIndex(0);
  }, []);
  
  useEffect(() => {
    if (proximoPlanetaIndex >= planetasDoHudOrdem.length) {
      onVictory();
    }
  }, [proximoPlanetaIndex, onVictory]);

  useEffect(() => {
    const gerarPlaneta = () => {
      let planetasDoLote: typeof planetasDoHudOrdem;
      const totalDePlanetas = planetasDoHudOrdem.length;

      if (proximoPlanetaIndex >= totalDePlanetas - 3) {
        planetasDoLote = planetasDoHudOrdem.slice(totalDePlanetas - 4);
      } else {
        planetasDoLote = planetasDoHudOrdem.slice(proximoPlanetaIndex, proximoPlanetaIndex + 4);
      }

      const corposParaGerar = [...planetasDoLote, ...meteorosParaGerar];
      if (corposParaGerar.length === 0) return;

      // --- NOVA LÓGICA ANTI-REPETIÇÃO ---
      // 1. Cria um "pool" de geração. Se houver mais de uma opção, filtra para remover o último gerado.
      let poolDeGeracao = corposParaGerar;
      if (corposParaGerar.length > 1 && ultimoGeradoRef.current) {
        poolDeGeracao = corposParaGerar.filter(corpo => corpo.nome !== ultimoGeradoRef.current);
      }

      // 2. Medida de segurança: se o filtro esvaziar o pool (improvável), usa o pool original.
      if (poolDeGeracao.length === 0) {
        poolDeGeracao = corposParaGerar;
      }
      // --- FIM DA NOVA LÓGICA ---

      const corpoAleatorio = poolDeGeracao[Math.floor(Math.random() * poolDeGeracao.length)];
      const isMeteoro = corpoAleatorio.nome === 'meteoro';
      const MIN_DISTANCIA_VERTICAL = 20;
      const MAX_TENTATIVAS = 15;
      let tentativa = 0;
      let topProposto = 0;
      let posicaoValida = false;

      while (tentativa < MAX_TENTATIVAS && !posicaoValida) {
        topProposto = Math.random() * 85;
        posicaoValida = !planetasVisiveis.some(p => Math.abs(topProposto - p.top) < MIN_DISTANCIA_VERTICAL);
        tentativa++;
      }

      if (posicaoValida) {
        const novoPlaneta: PlanetaState = {
          id: proximoIdRef.current++,
          nome: corpoAleatorio.nome,
          imagem: corpoAleatorio.imagem,
          top: topProposto,
          duracao: isMeteoro ? Math.random() * 4 + 3 : Math.random() * 4 + 4,
          tamanho: isMeteoro ? Math.random() * 45 + 30 : Math.random() * 100 + 60,
        };
        setPlanetasVisiveis(planetasAtuais => [...planetasAtuais, novoPlaneta]);
        
        // 3. Atualiza o ref com o nome do corpo que acabou de ser gerado.
        ultimoGeradoRef.current = corpoAleatorio.nome;
      }
    };
    const intervalo = setInterval(gerarPlaneta, 2000);
    return () => clearInterval(intervalo);
  }, [proximoPlanetaIndex, planetasVisiveis]);

  useEffect(() => {
    const ALTURA_ASTRONAUTA = '200px';
    const POSICAO_TOPO = '20px';
    const POSICAO_BASE = `calc(100vh - 20px - ${ALTURA_ASTRONAUTA})`;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') setPosicaoAstronauta(POSICAO_TOPO);
      else if (event.key === 'ArrowDown') setPosicaoAstronauta(POSICAO_BASE);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const gameLoop = () => {
      if (!astronautaRef.current || !containerRef.current) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }
      const astronautaRect = astronautaRef.current.getBoundingClientRect();
      const planetasNoDOM = containerRef.current.querySelectorAll<HTMLElement>('.planeta');
      for (const planetaEl of planetasNoDOM) {
        const planetaRect = planetaEl.getBoundingClientRect();
        const houveColisao =
          astronautaRect.left < planetaRect.right && astronautaRect.right > planetaRect.left &&
          astronautaRect.top < planetaRect.bottom && astronautaRect.bottom > planetaRect.top;
        if (houveColisao) {
          const planetaId = Number(planetaEl.dataset.id);
          const planetaNome = planetaEl.dataset.nome;
          setIsColliding(true);
          setTimeout(() => setIsColliding(false), 500);
          const colisaoX = (planetaRect.left + planetaRect.right) / 2;
          const colisaoY = (planetaRect.top + planetaRect.bottom) / 2;
          setSparks({ top: colisaoY, left: colisaoX });
          setTimeout(() => setSparks(null), 600);
          removerPlaneta(planetaId);
          if (planetaNome === 'meteoro' || planetaNome !== planetasDoHudOrdem[proximoPlanetaIndex]?.nome) {
            resetarProgresso();
          } else {
            setPlanetasColetados(coletados => ({ ...coletados, [planetaNome]: true }));
            setProximoPlanetaIndex(prevIndex => prevIndex + 1);
          }
          break;
        }
      }
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [removerPlaneta, resetarProgresso, proximoPlanetaIndex]);

  return (
    <S.FundoEspacial ref={containerRef}>
      <S.HudContainer>
        {planetasDoHudOrdem.map(planeta => (
          <S.HudPlanetaImagem
            key={planeta.nome}
            src={planeta.imagem}
            alt={`Ícone de ${planeta.nome}`}
            isCollected={planetasColetados[planeta.nome]}
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
          top={planeta.top}
          duracao={planeta.duracao}
          tamanho={planeta.tamanho}
          onAnimationEnd={() => removerPlaneta(planeta.id)}
        />
      ))}
      <S.Astronauta
        ref={astronautaRef}
        src="/assets/sistemaSolar/astronauta.png"
        alt="Astronauta"
        top={posicaoAstronauta}
        isColliding={isColliding}
      />
      {sparks && (
        <S.SparksContainer top={sparks.top} left={sparks.left}>
          {Array.from({ length: 6 }).map((_, i) => <S.Spark key={i} />)}
        </S.SparksContainer>
      )}
    </S.FundoEspacial>
  );
};

export default JogoSistemaSolar;