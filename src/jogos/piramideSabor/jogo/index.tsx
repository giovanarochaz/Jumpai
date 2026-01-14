import React, { useState, useEffect, useRef } from 'react';
import * as S from './styles';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';
import type { ConfiguracoesJogo } from '../../../interface/types';

const PAO_BASE = { nome: 'pao_base', imagem: '/assets/piramideSabor/pao_base.png' };
const PAO_TOPO = { nome: 'pao_topo', imagem: '/assets/piramideSabor/pao_topo.png' };
const RECHEIOS = [
  { nome: 'hamburguer', imagem: '/assets/piramideSabor/carne.png' },
  { nome: 'queijo', imagem: '/assets/piramideSabor/queijo.png' },
  { nome: 'salada', imagem: '/assets/piramideSabor/salada.png' },
];
const INIMIGOS = [
  { nome: 'inimigo', imagem: '/assets/piramideSabor/donut.png' },
  { nome: 'inimigo', imagem: '/assets/piramideSabor/fritas.png' },
];

const JogoPiramideSabor: React.FC<{ aoVencer: () => void; aoPerder: () => void; configuracoes: ConfiguracoesJogo }> = ({ aoVencer, aoPerder, configuracoes }) => {
  const { estaPiscando } = useStore(lojaOlho);
  
  const [receitaAtual, setReceitaAtual] = useState<any[]>([]);
  const [ingredientesMontados, setIngredientesMontados] = useState<any[]>([]);
  const [itensVisiveis, setItensVisiveis] = useState<any[]>([]);
  const [posicaoChef, setPosicaoChef] = useState(50);
  const [jogoFinalizado, setJogoFinalizado] = useState(false);
  const [animacaoImpacto, setAnimacaoImpacto] = useState(false);
  const [animacaoFinal, setAnimacaoFinal] = useState({ iniciada: false, telaEscura: false, cortinasAbertas: false, revelacaoFinal: false });

  const proximoIdRef = useRef(0);
  const chefRef = useRef<HTMLImageElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const receitaRef = useRef<any[]>([]);
  const itensProcessados = useRef(new Set<number>());

  const sons = useRef({
    coleta: new Audio('/assets/piramideSabor/sounds/coleta.mp3'),
    sucesso: new Audio('/assets/piramideSabor/sounds/pedidoCompleto.mp3'),
    ambiente: new Audio('/assets/piramideSabor/sounds/ambiente.mp3'),
  });

  useEffect(() => {
    const r = [
      { ...PAO_BASE, quantidade: 1, coletados: 1 },
      ...RECHEIOS.sort(() => Math.random() - 0.5).slice(0, 2).map(i => ({ ...i, quantidade: 2, coletados: 0 })),
      { ...PAO_TOPO, quantidade: 1, coletados: 0 }
    ];
    setReceitaAtual(r);
    setIngredientesMontados([PAO_BASE]);

    if (configuracoes.sons) {
      sons.current.ambiente.loop = true;
      sons.current.ambiente.play().catch(() => {});
    }
    return () => {
      sons.current.ambiente.pause();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [configuracoes.sons]);

  useEffect(() => { receitaRef.current = receitaAtual; }, [receitaAtual]);

  // Gerador de um item por vez em 20% ou 80%
  useEffect(() => {
    const gerar = () => {
      if (jogoFinalizado) return;
      const delay = { facil: 4000, medio: 3000, dificil: 1800 }[configuracoes.dificuldade];
      
      timerRef.current = setTimeout(() => {
        if (jogoFinalizado) return;
        const proximo = receitaRef.current.find(i => i.coletados < i.quantidade);
        const rand = Math.random();
        
        let item = rand < 0.6 && proximo ? proximo : 
                   rand < 0.85 ? RECHEIOS[Math.floor(Math.random() * RECHEIOS.length)] : 
                   INIMIGOS[Math.floor(Math.random() * INIMIGOS.length)];

        const novoLeft = Math.random() < 0.5 ? 20 : 80;
        setItensVisiveis(prev => [...prev, { id: proximoIdRef.current++, ...item, left: novoLeft, duracao: 5 }]);
        gerar();
      }, delay);
    };
    gerar();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [configuracoes.dificuldade, jogoFinalizado]);

  // Colisão e Penalidade
  useEffect(() => {
    let animId: number;
    const loop = () => {
      if (jogoFinalizado || !chefRef.current) return;
      const chefRect = chefRef.current.getBoundingClientRect();
      const hX = chefRect.left + chefRect.width * 0.3;
      const hY = chefRect.top + chefRect.height * 0.3;
      const hW = chefRect.width * 0.4;
      const hH = chefRect.height * 0.1;

      document.querySelectorAll<HTMLElement>('.item-caindo').forEach(el => {
        const id = Number(el.dataset.id);
        if (itensProcessados.current.has(id)) return;
        const r = el.getBoundingClientRect();

        if (!(hX + hW < r.left || hX > r.right || hY + hH < r.top || hY > r.bottom)) {
          itensProcessados.current.add(id);
          const nome = el.dataset.nome!;
          const src = el.getAttribute('src')!;
          setItensVisiveis(prev => prev.filter(i => i.id !== id));

          // 1. Inimigo
          if (nome === 'inimigo' && configuracoes.penalidade) { 
            setJogoFinalizado(true); 
            aoPerder(); 
            return; 
          }

          // 2. Ordem Errada
          const esperado = receitaRef.current.find(i => i.coletados < i.quantidade);
          if (nome !== esperado?.nome && nome !== 'inimigo') {
            if (configuracoes.penalidade) { 
              setJogoFinalizado(true); 
              aoPerder(); 
            }
            return;
          }

          // 3. Coleta de Sucesso
          if (nome !== 'inimigo') {
            if (configuracoes.sons) sons.current.coleta.play().catch(() => {});
            setAnimacaoImpacto(true);
            setTimeout(() => setAnimacaoImpacto(false), 200);
            setIngredientesMontados(prev => [...prev, { nome, imagem: src }]);
            setReceitaAtual(prev => prev.map(i => i.nome === nome ? { ...i, coletados: i.coletados + 1 } : i));

            if (nome === 'pao_topo') { setJogoFinalizado(true); vencer(); }
          }
        }
      });
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [jogoFinalizado, configuracoes, aoPerder]);

  const vencer = () => {
    setAnimacaoFinal(prev => ({ ...prev, iniciada: true }));
    setTimeout(() => setAnimacaoFinal(prev => ({ ...prev, telaEscura: true })), 500);
    setTimeout(() => {
      if (configuracoes.sons) sons.current.sucesso.play().catch(() => {});
      setAnimacaoFinal(prev => ({ ...prev, cortinasAbertas: true, revelacaoFinal: true }));
    }, 2200);
    setTimeout(aoVencer, 6500);
  };

  useEffect(() => {
    if (estaPiscando) setPosicaoChef(p => (p < 50 ? 80 : 20));
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setPosicaoChef(20);
      if (e.key === 'ArrowRight') setPosicaoChef(80);
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [estaPiscando]);

  return (
    <S.FundoLanchonete>
      {!animacaoFinal.iniciada && (
        <>
          <S.Comanda>
            <h3>Ordem do Mestre:</h3>
            <ul>
              {receitaAtual.map((item, idx) => (
                <S.ItemDaLista 
                  key={idx} 
                  $concluido={item.coletados >= item.quantidade} 
                  $proximo={item.coletados < item.quantidade && (idx === 0 || receitaAtual[idx-1].coletados >= receitaAtual[idx-1].quantidade)}
                >
                  <img src={item.imagem} alt={item.nome} />
                  <span>{Math.max(0, item.quantidade - item.coletados)}x {item.nome.replace('_', ' ')}</span>
                </S.ItemDaLista>
              ))}
            </ul>
          </S.Comanda>
          {itensVisiveis.map(item => (
            <S.ItemCaindo 
              key={item.id} 
              className="item-caindo" 
              data-id={item.id} 
              data-nome={item.nome} 
              src={item.imagem} 
              $left={item.left} 
              $duracao={item.duracao}
              onAnimationEnd={() => setItensVisiveis(prev => prev.filter(i => i.id !== item.id))}
            />
          ))}
          <S.Balcao />
          <S.PratoMontagem $animando={animacaoImpacto}>
            {ingredientesMontados.map((ing, i) => (
              <S.IngredienteEmpilhado key={i} src={ing.imagem} $index={i} />
            ))}
          </S.PratoMontagem>
        </>
      )}
      <S.Chef ref={chefRef} src="/assets/piramideSabor/chef.png" $left={posicaoChef} $escondido={animacaoFinal.iniciada} />
      {animacaoFinal.iniciada && (
        <>
          <S.TelaEscura $ativa={animacaoFinal.telaEscura} />
          <S.CortinaContainer>
            <S.Cortina $lado="esquerdo" $aberta={animacaoFinal.cortinasAbertas} />
            <S.Cortina $lado="direito" $aberta={animacaoFinal.cortinasAbertas} />
          </S.CortinaContainer>
          {animacaoFinal.revelacaoFinal && (
            <S.PalcoFinal>
              <S.Spotlight />
              <S.PratoMontagem $finalizado>
                {ingredientesMontados.map((ing, i) => (
                  <S.IngredienteEmpilhado key={i} src={ing.imagem} $index={i} />
                ))}
              </S.PratoMontagem>
            </S.PalcoFinal>
          )}
        </>
      )}
    </S.FundoLanchonete>
  );
};

export default JogoPiramideSabor;