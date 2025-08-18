import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as S from './styles';

const ITENS_JOGO = {
  oxigenio: { nome: 'Oxigênio', imagem: '/assets/corpoHumano/oxigenio.png', tipo: 'coletavel' },
  leucocito: { nome: 'Leucócito', imagem: '/assets/corpoHumano/leucocito.png', tipo: 'aliado' },
  anticorpo: { nome: 'Anticorpo', imagem: '/assets/corpoHumano/anticorpo.png', tipo: 'coletavel' },
  virus: { nome: 'Vírus', imagem: '/assets/corpoHumano/virus.png', tipo: 'obstaculo' },
  hemacia: { nome: 'Hemácia', imagem: '/assets/corpoHumano/hemacia.png', tipo: 'ambiente' },
};
type ItemKey = keyof typeof ITENS_JOGO;

const MISSOES = [
  { tipo: 'oxigenio', total: 5, texto: 'Nível 1: Entregue Oxigênio' },
  { tipo: 'anticorpo', total: 3, texto: 'Nível 2: Colete Anticorpos' },
  { tipo: 'virusMarcado', total: 3, texto: 'Nível 3: Marque 3 Vírus com Anticorpos' },
  { tipo: 'leucocito', total: 1, texto: 'Nível 4: Recrute um Leucócito' },
  { tipo: 'virusDestruido', total: 3, texto: 'Nível 5: Destrua os Vírus Marcados!' },
];

const ENERGIA_INICIAL = 100;
const DANO_VIRUS = 34;
const VELOCIDADE_VERTICAL = 4;

interface ItemState { id: number; nome: string; imagem: string; tipo: string; top: number; duracao: number; tamanho: number; isMarked?: boolean; }
interface JogoCorpoHumanoProps { onVictory: () => void; onDefeat: () => void; }

const JogoCorpoHumano: React.FC<JogoCorpoHumanoProps> = ({ onVictory, onDefeat }) => {
  const [itensVisiveis, setItensVisiveis] = useState<ItemState[]>([]);
  const [posicaoSubmarino, setPosicaoSubmarino] = useState(window.innerHeight / 2);
  const [missaoAtualIndex, setMissaoAtualIndex] = useState(0);
  const [missaoProgresso, setMissaoProgresso] = useState(0);
  const [energia, setEnergia] = useState(ENERGIA_INICIAL);
  const [isDamaged, setIsDamaged] = useState(false);
  const [anticorposColetados, setAnticorposColetados] = useState(0);
  const [leucocitoAtivo, setLeucocitoAtivo] = useState(false);
  
  const direcaoVertical = useRef(1);
  const proximoIdRef = useRef(0);
  const submarinoRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const missaoAtual = MISSOES[missaoAtualIndex];

  useEffect(() => {
    if (missaoProgresso >= missaoAtual.total) {
      if (missaoAtualIndex < MISSOES.length - 1) {
        setMissaoAtualIndex(i => i + 1);
        setMissaoProgresso(0);
      } else {
        onVictory();
      }
    }
  }, [missaoProgresso, missaoAtual, missaoAtualIndex, onVictory]);

  useEffect(() => { if (energia <= 0) { onDefeat(); } }, [energia, onDefeat]);
  
  const inverterDirecao = useCallback(() => { direcaoVertical.current *= -1; }, []);

  useEffect(() => {
    const gerarItem = () => {
      let tipoItem: ItemKey;
      const chance = Math.random();

      switch (missaoAtual.tipo) {
        case 'anticorpo': tipoItem = chance < 0.6 ? 'anticorpo' : 'hemacia'; break;
        case 'virusMarcado': case 'virusDestruido': tipoItem = chance < 0.6 ? 'virus' : 'hemacia'; break;
        case 'leucocito': tipoItem = chance < 0.5 ? 'leucocito' : 'hemacia'; break;
        default: tipoItem = chance < 0.4 ? 'oxigenio' : (chance < 0.7 ? 'virus' : 'hemacia');
      }
      
      const itemData = ITENS_JOGO[tipoItem];
      const novoItem: ItemState = {
        id: proximoIdRef.current++,
        nome: itemData.nome, imagem: itemData.imagem, tipo: itemData.tipo,
        top: Math.random() * window.innerHeight,
        duracao: Math.random() * 4 + 6,
        tamanho: itemData.tipo === 'ambiente' ? 80 : 60,
        isMarked: false,
      };
      setItensVisiveis(atuais => [...atuais.slice(-50), novoItem]);
    };
    const intervalo = setInterval(gerarItem, 1000);
    return () => clearInterval(intervalo);
  }, [missaoAtual.tipo]);
  
  useEffect(() => {
    let animationFrameId: number;
    const gameLoop = () => {
      setPosicaoSubmarino(pos => {
        const novaPos = pos + (VELOCIDADE_VERTICAL * direcaoVertical.current);
        const limiteSuperior = 60, limiteInferior = window.innerHeight - 60;
        if (novaPos >= limiteInferior || novaPos <= limiteSuperior) { direcaoVertical.current *= -1; }
        return Math.max(limiteSuperior, Math.min(limiteInferior, novaPos));
      });

      if (!submarinoRef.current || !containerRef.current) { animationFrameId = requestAnimationFrame(gameLoop); return; }
      const subRect = submarinoRef.current.getBoundingClientRect();
      let leucocitoRect: DOMRect | null = containerRef.current.querySelector<HTMLElement>('.leucocito-aliado')?.getBoundingClientRect() ?? null;
      
      const itensParaRemover = new Set<number>();

      for (const item of itensVisiveis) {
        const itemEl = containerRef.current.querySelector<HTMLElement>(`[data-id='${item.id}']`);
        if (!itemEl) continue;
        const itemRect = itemEl.getBoundingClientRect();
        
        const colideComSub = subRect.left < itemRect.right && subRect.right > itemRect.left && subRect.top < itemRect.bottom && subRect.bottom > itemRect.top;
        const colideComLeucocito = leucocitoAtivo && leucocitoRect && leucocitoRect.left < itemRect.right && leucocitoRect.right > itemRect.left && leucocitoRect.top < itemRect.bottom && leucocitoRect.bottom > itemRect.top;

        if (colideComSub) {
          if (item.tipo === 'obstaculo' && !item.isMarked) {
            setEnergia(e => Math.max(0, e - DANO_VIRUS));
            setIsDamaged(true); setTimeout(() => setIsDamaged(false), 300);
            itensParaRemover.add(item.id);
          } else if (item.tipo === 'coletavel' && missaoAtual.tipo === item.nome.toLowerCase()) {
            setMissaoProgresso(p => p + 1);
            if (item.nome.toLowerCase() === 'anticorpo') setAnticorposColetados(a => a + 1);
            itensParaRemover.add(item.id);
          } else if (item.tipo === 'aliado' && missaoAtual.tipo === 'leucocito') {
            setLeucocitoAtivo(true);
            setMissaoProgresso(p => p + 1);
            itensParaRemover.add(item.id);
          }
        }

        if (colideComLeucocito && item.tipo === 'obstaculo' && item.isMarked) {
          if (missaoAtual.tipo === 'virusDestruido') setMissaoProgresso(p => p + 1);
          itensParaRemover.add(item.id);
        }
      }

      if (anticorposColetados > 0 && missaoAtual.tipo === 'virusMarcado') {
        const virusNaoMarcado = itensVisiveis.find(item => item.tipo === 'obstaculo' && !item.isMarked);
        if (virusNaoMarcado) {
          setItensVisiveis(atuais => atuais.map(item => item.id === virusNaoMarcado.id ? { ...item, isMarked: true } : item));
          setAnticorposColetados(a => a - 1);
          setMissaoProgresso(p => p + 1);
        }
      }

      if (itensParaRemover.size > 0) {
        setItensVisiveis(atuais => atuais.filter(i => !itensParaRemover.has(i.id)));
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };
    animationFrameId = requestAnimationFrame(gameLoop);
    
    const handleUserCommand = () => inverterDirecao();
    const handleKeyDown = (e: KeyboardEvent) => { if (e.code === 'Space') handleUserCommand(); };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleUserCommand);
    window.addEventListener('touchstart', handleUserCommand);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleUserCommand);
      window.removeEventListener('touchstart', handleUserCommand);
    };
  }, [inverterDirecao, missaoAtual.tipo, leucocitoAtivo, anticorposColetados, itensVisiveis]);

  return (
    <S.FundoSanguineo ref={containerRef}>
      <S.CamadaCelulas speed={40} opacity={0.1} size="600px" />
      <S.CamadaCelulas speed={25} opacity={0.2} size="400px" />
      <S.HudContainer>
        <S.HudBox>
          <h3>Missão Atual</h3>
          <p>{missaoAtual.texto} ({missaoProgresso}/{missaoAtual.total})</p>
        </S.HudBox>
        <S.HudBox>
          <h3>Energia do Submarino</h3>
          <S.BarraEnergiaContainer><S.BarraEnergiaFill percent={energia} /></S.BarraEnergiaContainer>
        </S.HudBox>
      </S.HudContainer>
      {itensVisiveis.map(item => (
        <S.ItemCorrenteSanguinea key={item.id} data-id={item.id} data-tipo={item.tipo} data-nome={item.nome.toLowerCase()} data-ismarked={item.isMarked} src={item.imagem} alt={item.nome} top={item.top} duracao={item.duracao} tamanho={item.tamanho} isMarked={item.isMarked}/>
      ))}
      <S.Nanosubmarino ref={submarinoRef} src="/assets/corpoHumano/nanosub.png" alt="Nanosubmarino" top={posicaoSubmarino} isDamaged={isDamaged}/>
      {leucocitoAtivo && submarinoRef.current && (
        <S.LeucocitoAliado className="leucocito-aliado" src={ITENS_JOGO.leucocito.imagem} style={{ top: submarinoRef.current.getBoundingClientRect().top + 40, left: submarinoRef.current.getBoundingClientRect().left - 80 }}/>
      )}
    </S.FundoSanguineo>
  );
};

export default JogoCorpoHumano;