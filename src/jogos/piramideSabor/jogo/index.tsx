import React, { useState, useEffect, useRef } from 'react';
import * as S from './styles';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';
import type { ConfiguracoesJogo } from '../../../interface/types';

// --- CONFIGURAÇÕES E ATIVOS ---
const PAO_BASE = { nome: 'pao_base', imagem: '/assets/piramideSabor/pao_base.png' };
const PAO_TOPO = { nome: 'pao_topo', imagem: '/assets/piramideSabor/pao_topo.png' };
const RECHEIOS = [
  { nome: 'hamburguer', imagem: '/assets/piramideSabor/carne.png' },
  { nome: 'queijo', imagem: '/assets/piramideSabor/queijo.png' },
  { nome: 'salada', imagem: '/assets/piramideSabor/salada.png' },
  { nome: 'tomate', imagem: '/assets/piramideSabor/tomate.png' },
];
const INIMIGOS = [
  { nome: 'inimigo', imagem: '/assets/piramideSabor/donut.png' },
  { nome: 'inimigo', imagem: '/assets/piramideSabor/fritas.png' },
];

const gerarReceitaAleatoria = (dificuldade: string) => {
  const limites = {
    facil: { min: 2, max: 3 },
    medio: { min: 4, max: 6 },
    dificil: { min: 7, max: 10 }
  }[dificuldade as 'facil' | 'medio' | 'dificil'] || { min: 2, max: 4 };

  const qtdRecheios = Math.floor(Math.random() * (limites.max - limites.min + 1)) + limites.min;
  
  const miolo = [];
  for (let i = 0; i < qtdRecheios; i++) {
    const sorteado = RECHEIOS[Math.floor(Math.random() * RECHEIOS.length)];
    miolo.push({ ...sorteado, coletado: false, idPasso: i });
  }

  return [
    { ...PAO_BASE, coletado: true, idPasso: 'base' },
    ...miolo,
    { ...PAO_TOPO, coletado: false, idPasso: 'topo' }
  ];
};

const JogoPiramideSabor: React.FC<{ aoVencer: () => void; aoPerder: () => void; configuracoes: ConfiguracoesJogo }> = ({ aoVencer, aoPerder, configuracoes }) => {
  const { estaPiscando } = useStore(lojaOlho);
  
  // Estados
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
  const ultimoNomeSorteadoRef = useRef<string | null>(null);
  const ultimaPosicaoRef = useRef<number>(20);

  const sons = useRef({
    coleta: new Audio('/assets/piramideSabor/sounds/coleta.mp3'),
    sucesso: new Audio('/assets/piramideSabor/sounds/pedidoCompleto.mp3'),
    ambiente: new Audio('/assets/piramideSabor/sounds/ambiente.mp3'),
  });

  useEffect(() => {
    const novaReceita = gerarReceitaAleatoria(configuracoes.dificuldade);
    setReceitaAtual(novaReceita);
    setIngredientesMontados([PAO_BASE]);

    if (configuracoes.sons) {
      sons.current.ambiente.loop = true;
      sons.current.ambiente.play().catch(() => {});
    }
    return () => {
      sons.current.ambiente.pause();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [configuracoes.sons, configuracoes.dificuldade]);

  useEffect(() => { receitaRef.current = receitaAtual; }, [receitaAtual]);

  useEffect(() => {
    const gerar = () => {
      if (jogoFinalizado) return;

      const delays = { facil: 4000, medio: 3000, dificil: 2000 };
      const baseDelay = delays[configuracoes.dificuldade as 'facil' | 'medio' | 'dificil'];
      const jitter = baseDelay * (0.8 + Math.random() * 0.4);

      timerRef.current = setTimeout(() => {
        if (jogoFinalizado) return;

        const proximoNecessario = receitaRef.current.find(i => !i.coletado);
        const nomesNaTela = itensVisiveis.map(item => item.nome);
        const jaEstaCaindoOQueEuPreciso = proximoNecessario && nomesNaTela.includes(proximoNecessario.nome);

        let itemSorteado;
        const rand = Math.random();

        if (rand < 0.45 && proximoNecessario && !jaEstaCaindoOQueEuPreciso) {
          itemSorteado = proximoNecessario;
        } else if (rand < 0.8) {
          // 35% de vir recheio aleatório (mas evita repetir o último ou o que está na tela)
          const opcoes = RECHEIOS.filter(r => 
            r.nome !== ultimoNomeSorteadoRef.current && !nomesNaTela.includes(r.nome)
          );
          itemSorteado = opcoes.length > 0 
            ? opcoes[Math.floor(Math.random() * opcoes.length)] 
            : RECHEIOS[Math.floor(Math.random() * RECHEIOS.length)];
        } else {
          // 20% de vir inimigo
          itemSorteado = INIMIGOS[Math.floor(Math.random() * INIMIGOS.length)];
        }

        ultimoNomeSorteadoRef.current = itemSorteado.nome;
        
        // Alterna posição (20% ou 80%) para não encavalar
        const novaPosicao = ultimaPosicaoRef.current === 20 ? 80 : 20;
        ultimaPosicaoRef.current = novaPosicao;

        setItensVisiveis(prev => [...prev, { 
          id: proximoIdRef.current++, 
          ...itemSorteado, 
          left: novaPosicao, 
          duracao: configuracoes.dificuldade === 'dificil' ? 3.5 : 5 
        }]);

        gerar();
      }, jitter);
    };

    gerar();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [configuracoes.dificuldade, jogoFinalizado, itensVisiveis.length]);

  // 3. Detecção de Colisão
  useEffect(() => {
    let animId: number;
    const loop = () => {
      if (jogoFinalizado || !chefRef.current) return;

      const chefRect = chefRef.current.getBoundingClientRect();
      // Hitbox do prato (topo do chef)
      const hX = chefRect.left + chefRect.width * 0.2;
      const hY = chefRect.top; 
      const hW = chefRect.width * 0.6;
      const hH = chefRect.height * 0.2;

      document.querySelectorAll<HTMLElement>('.item-caindo').forEach(el => {
        const id = Number(el.dataset.id);
        if (itensProcessados.current.has(id)) return;

        const r = el.getBoundingClientRect();

        if (!(hX + hW < r.left || hX > r.right || hY + hH < r.top || hY > r.bottom)) {
          itensProcessados.current.add(id);
          const nomeColidido = el.dataset.nome!;
          const src = el.getAttribute('src')!;
          
          setItensVisiveis(prev => prev.filter(i => i.id !== id));

          if (nomeColidido === 'inimigo') {
            if (configuracoes.penalidade) { setJogoFinalizado(true); aoPerder(); }
            return;
          }

          const indiceProximo = receitaRef.current.findIndex(i => !i.coletado);
          const itemEsperado = receitaRef.current[indiceProximo];

          if (nomeColidido === itemEsperado?.nome) {
            if (configuracoes.sons) sons.current.coleta.play().catch(() => {});
            setAnimacaoImpacto(true);
            setTimeout(() => setAnimacaoImpacto(false), 200);
            
            setIngredientesMontados(prev => [...prev, { nome: nomeColidido, imagem: src }]);
            setReceitaAtual(prev => {
              const nova = [...prev];
              nova[indiceProximo] = { ...nova[indiceProximo], coletado: true };
              return nova;
            });

            if (nomeColidido === 'pao_topo') { 
              setJogoFinalizado(true); 
              vencer(); 
            }
          } else {
            // Pegou ingrediente fora de ordem
            if (configuracoes.penalidade) { setJogoFinalizado(true); aoPerder(); }
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

  // 4. Movimentação
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
                  $concluido={item.coletado} 
                  $proximo={!item.coletado && (idx === 0 || receitaAtual[idx-1].coletado)}
                >
                  <img src={item.imagem} alt={item.nome} />
                  <span>{item.nome.replace('_', ' ')}</span>
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

      <S.Chef 
        ref={chefRef} 
        src="/assets/piramideSabor/chef.png" 
        $left={posicaoChef} 
        $escondido={animacaoFinal.iniciada} 
      />

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