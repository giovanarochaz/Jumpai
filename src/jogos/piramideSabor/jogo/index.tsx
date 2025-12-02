import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as S from './styles';
import type { ConfiguracoesJogo, VelocidadeGeracao } from '../manual';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';

// --- BANCO DE DADOS E CONFIGURAÇÕES DE JOGO ---
const PAO_BASE = { nome: 'pao_base', imagem: '/assets/piramideSabor/pao_base.png' };
const PAO_TOPO = { nome: 'pao_topo', imagem: '/assets/piramideSabor/pao_topo.png' };
const RECHEIOS_POSSIVEIS = [
  { nome: 'hamburguer', imagem: '/assets/piramideSabor/carne.png' },
  { nome: 'queijo', imagem: '/assets/piramideSabor/queijo.png' },
  { nome: 'salada', imagem: '/assets/piramideSabor/salada.png' },
];
const COMIDAS_INIMIGAS = [
  { nome: 'inimigo', imagem: '/assets/piramideSabor/donut.png' },
  { nome: 'inimigo', imagem: '/assets/piramideSabor/fritas.png' },
];
const MAPA_VELOCIDADE_ITENS: Record<VelocidadeGeracao, { min: number; max: number }> = {
  lenta: { min: 7, max: 12 },
  normal: { min: 5, max: 7 },
  rapida: { min: 2.5, max: 3.5 },
};
const MAPA_INTERVALO_GERACAO: Record<VelocidadeGeracao, { min: number; max: number }> = {
  lenta: { min: 4000, max: 4000 },
  normal: { min: 4000, max: 4000 },
  rapida: { min: 4000, max: 4000 },
};

// --- CONSTANTES DE JOGABILIDADE ---
const LIMITE_ESQUERDA_CHEF = 15;
const LIMITE_DIREITA_CHEF = 85;
const HITBOX_LARGURA_PERCENTUAL = 0.1;
const HITBOX_ALTURA_PERCENTUAL = 0.2;
const HITBOX_VERTICAL_OFFSET_PERCENTUAL = 0.3;

// --- TIPOS E INTERFACES ---
interface IngredienteDaReceita { nome: string; imagem: string; quantidade: number; coletados: number; }
type Receita = IngredienteDaReceita[];
interface EstadoItem { id: number; nome: string; imagem: string; left: number; duracao: number; tamanho: number; }
interface JogoPiramideSaborProps {
  aoVencer: () => void;
  aoPerder: () => void;
  configuracoes: ConfiguracoesJogo;
}

// --- FUNÇÃO AUXILIAR ---
const gerarReceitaAleatoria = (): Receita => {
  const novaReceita: Receita = [{ ...PAO_BASE, quantidade: 1, coletados: 1 }];
  const numTiposDeRecheio = Math.floor(Math.random() * 2) + 2;
  const recheiosEmbaralhados = [...RECHEIOS_POSSIVEIS].sort(() => 0.5 - Math.random());
  for (let i = 0; i < numTiposDeRecheio; i++) {
    const recheio = recheiosEmbaralhados[i];
    const quantidade = Math.floor(Math.random() * 2) + 1;
    novaReceita.push({ ...recheio, quantidade, coletados: 0 });
  }
  novaReceita.push({ ...PAO_TOPO, quantidade: 1, coletados: 0 });
  return novaReceita;
};

// --- COMPONENTE PRINCIPAL ---
const JogoPiramideSabor: React.FC<JogoPiramideSaborProps> = ({ aoVencer, aoPerder, configuracoes }) => {
  const { estaPiscando } = useStore(lojaOlho);

  const [receitaAtual, setReceitaAtual] = useState<Receita>([]);
  const [ingredientesMontados, setIngredientesMontados] = useState<({ nome: string, imagem: string })[]>([]);
  const [itensVisiveis, setItensVisiveis] = useState<EstadoItem[]>([]);
  const [posicaoChef, setPosicaoChef] = useState(50);
  const [jogoFinalizado, setJogoFinalizado] = useState(false);
  
  // Estado para controlar a animação de impacto no prato
  const [animacaoImpacto, setAnimacaoImpacto] = useState(false);
  
  const [animacaoFinal, setAnimacaoFinal] = useState({
    iniciada: false,
    telaEscura: false,
    cortinasAbertas: false,
    revelacaoFinal: false,
  });

  const proximoIdRef = useRef(0);
  const chefRef = useRef<HTMLImageElement>(null);
  const somColetaRef = useRef<HTMLAudioElement | null>(null);
  const somAmbienteRef = useRef<HTMLAudioElement | null>(null);
  const somPedidoCompletoRef = useRef<HTMLAudioElement | null>(null);
  const somBateriaRef = useRef<HTMLAudioElement | null>(null);
  const timeoutGeradorRef = useRef<number | undefined>(0);
  const itensProcessadosRef = useRef(new Set<number>());
  const ultimoLadoGeradoRef = useRef<'esquerda' | 'direita'>('direita');
  const receitaAtualRef = useRef(receitaAtual);
  const avaliarPedidoRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const novaReceita = gerarReceitaAleatoria();
    console.log('--- PEDIDO CORRETO ---');
    console.table(novaReceita.map(i => ({ Ingrediente: i.nome, Quantidade: i.quantidade })));
    setReceitaAtual(novaReceita);
    setIngredientesMontados([{ ...PAO_BASE }]);
    somColetaRef.current = new Audio('/assets/piramideSabor/sounds/coleta.mp3');
    somPedidoCompletoRef.current = new Audio('/assets/piramideSabor/sounds/pedidoCompleto.mp3');
    somBateriaRef.current = new Audio('/assets/piramideSabor/sounds/bateria_suspense.mp3');
  }, []);

  useEffect(() => {
    if (configuracoes.sons && !jogoFinalizado) {
      somAmbienteRef.current = new Audio('/assets/piramideSabor/sounds/ambiente.mp3');
      somAmbienteRef.current.loop = true;
      somAmbienteRef.current.volume = 0.3;
      somAmbienteRef.current.play();
    }
    return () => { somAmbienteRef.current?.pause(); };
  }, [configuracoes.sons, jogoFinalizado]);

  useEffect(() => {
    if (animacaoFinal.iniciada) {
      setTimeout(() => setAnimacaoFinal(prev => ({ ...prev, telaEscura: true })), 500);
      setTimeout(() => {
        if (configuracoes.sons) somBateriaRef.current?.play();
        setAnimacaoFinal(prev => ({ ...prev, cortinasAbertas: true, revelacaoFinal: true }));
      }, 2500);
      setTimeout(() => avaliarPedidoRef.current?.(), 5500);
    }
  }, [animacaoFinal.iniciada, configuracoes.sons]);

  useEffect(() => {
    const agendarProximoItem = () => {
      const gerarItem = () => {
        if (jogoFinalizado) return;
        const itensPossiveis = [...RECHEIOS_POSSIVEIS, PAO_TOPO, ...COMIDAS_INIMIGAS, ...RECHEIOS_POSSIVEIS];
        const itemAleatorio = itensPossiveis[Math.floor(Math.random() * itensPossiveis.length)];
        const proximoLado = ultimoLadoGeradoRef.current === 'esquerda' ? 'direita' : 'esquerda';
        
        // --- AJUSTE AQUI: MUDANÇA NAS COORDENADAS DE GERAÇÃO ---
        // Antes era 10-40 (Esq) e 60-90 (Dir). Muito perto das bordas.
        // Agora é 20-45 (Esq) e 55-80 (Dir). Garantido que o chef alcança.
        let novoLeft;
        if (proximoLado === 'esquerda') { 
            novoLeft = 20 + Math.random() * 25; 
        } else { 
            novoLeft = 55 + Math.random() * 25; 
        }
        // --------------------------------------------------------

        ultimoLadoGeradoRef.current = proximoLado;
        const velocidadeConfig = MAPA_VELOCIDADE_ITENS[configuracoes.velocidade];
        const duracao = Math.random() * (velocidadeConfig.max - velocidadeConfig.min) + velocidadeConfig.min;
        const tamanho = window.innerWidth / 12;
        setItensVisiveis(atuais => [...atuais, { id: proximoIdRef.current++, ...itemAleatorio, left: novoLeft, duracao, tamanho }]);
        agendarProximoItem();
      };
      const intervaloConfig = MAPA_INTERVALO_GERACAO[configuracoes.velocidade];
      const delayAleatorio = Math.random() * (intervaloConfig.max - intervaloConfig.min) + intervaloConfig.min;
      timeoutGeradorRef.current = window.setTimeout(gerarItem, delayAleatorio);
    };
    if (!jogoFinalizado) {
        agendarProximoItem();
    }
    return () => clearTimeout(timeoutGeradorRef.current);
  }, [configuracoes.velocidade, jogoFinalizado]);

  useEffect(() => {
    if (!estaPiscando) return;
    setPosicaoChef(p => (p < 50 ? LIMITE_DIREITA_CHEF : LIMITE_ESQUERDA_CHEF));
  }, [estaPiscando]);

  useEffect(() => {
    const tratarTecla = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setPosicaoChef(LIMITE_ESQUERDA_CHEF);
      else if (e.key === 'ArrowRight') setPosicaoChef(LIMITE_DIREITA_CHEF);
    };
    window.addEventListener('keydown', tratarTecla);
    return () => window.removeEventListener('keydown', tratarTecla);
  }, []);

  const avaliarPedido = useCallback(() => {
    const receitaMaisRecente = receitaAtualRef.current;
    const sucesso = receitaMaisRecente.every(item => item.coletados >= item.quantidade);
    setTimeout(() => {
      if (sucesso) aoVencer();
      else aoPerder();
    }, 1500);
  }, [aoVencer, aoPerder]);

  const removerItemForaDaTela = useCallback((id: number) => {
    setItensVisiveis(prev => prev.filter(item => item.id !== id));
    if (itensProcessadosRef.current.has(id)) {
        itensProcessadosRef.current.delete(id);
    }
  }, []);

  useEffect(() => { receitaAtualRef.current = receitaAtual; }, [receitaAtual]);
  useEffect(() => { avaliarPedidoRef.current = avaliarPedido; }, [avaliarPedido]);

  useEffect(() => {
    let animacaoId: number;
    const loopJogo = () => {
      animacaoId = requestAnimationFrame(loopJogo);
      if (!chefRef.current || jogoFinalizado) return;
      
      const chefRetangulo = chefRef.current.getBoundingClientRect();
      const hitboxLargura = chefRetangulo.width * HITBOX_LARGURA_PERCENTUAL;
      const hitboxOffset = (chefRetangulo.width - hitboxLargura) / 2;
      const hitboxLeft = chefRetangulo.left + hitboxOffset;
      const hitboxRight = chefRetangulo.right - hitboxOffset;
      const hitboxAltura = chefRetangulo.height * HITBOX_ALTURA_PERCENTUAL;
      const hitboxVerticalOffset = chefRetangulo.height * HITBOX_VERTICAL_OFFSET_PERCENTUAL;
      const hitboxTop = chefRetangulo.top + hitboxVerticalOffset;
      const hitboxBottom = hitboxTop + hitboxAltura;

      for (const itemEl of document.querySelectorAll<HTMLElement>('.item-caindo')) {
        const itemId = Number(itemEl.dataset.id);
        if (itensProcessadosRef.current.has(itemId)) continue;

        const itemRetangulo = itemEl.getBoundingClientRect();
        
        if (!(hitboxRight < itemRetangulo.left || hitboxLeft > itemRetangulo.right || hitboxBottom < itemRetangulo.top || hitboxTop > itemRetangulo.bottom)) {
          itensProcessadosRef.current.add(itemId);
          const itemNome = itemEl.dataset.nome!;
          const itemImagem = itemEl.getAttribute('src')!;
          
          setItensVisiveis(prev => prev.filter(i => i.id !== itemId));

          if (itemNome === 'inimigo') {
            if (configuracoes.penalidade) aoPerder();
            return;
          }
          
          if (itemNome === 'pao_topo') {
            setJogoFinalizado(true);
            somAmbienteRef.current?.pause();
            if (configuracoes.sons) somPedidoCompletoRef.current?.play();
            const pedidoFinal = [...ingredientesMontados, { nome: itemNome, imagem: itemImagem }];
            console.log('--- PEDIDO FINAL ---');
            console.table(pedidoFinal.map((item, index) => ({ 'Ordem': index + 1, 'Ingrediente': item.nome })));
            setIngredientesMontados(pedidoFinal);
            setReceitaAtual(prev => prev.map(ing => ing.nome === 'pao_topo' ? { ...ing, coletados: 1 } : ing));
            setAnimacaoFinal(prev => ({ ...prev, iniciada: true }));
            return;
          }

          const ehRecheioValido = RECHEIOS_POSSIVEIS.some(r => r.nome === itemNome);

          if (ehRecheioValido) {
            if (configuracoes.sons) somColetaRef.current?.play();
            
            // Dispara a animação (suave no CSS)
            setAnimacaoImpacto(true);
            setTimeout(() => setAnimacaoImpacto(false), 300);

            setIngredientesMontados(prev => [...prev, { nome: itemNome, imagem: itemImagem }]);
            
            setReceitaAtual(prev => prev.map(ing => 
              ing.nome === itemNome 
                ? { ...ing, coletados: ing.coletados + 1 } 
                : ing
            ));
          }
          return;
        }
      }
    };
    loopJogo();
    return () => cancelAnimationFrame(animacaoId);
  }, [configuracoes.penalidade, configuracoes.sons, aoPerder, jogoFinalizado, avaliarPedido, ingredientesMontados]);
  
  return (
    <S.FundoLanchonete>
      {!animacaoFinal.iniciada && (
        <>
          <S.Comanda>
            <h3>Pedido do Mestre:</h3>
            <ul>
              {receitaAtual.map(item => (
                <S.ItemDaLista key={item.nome} $concluido={item.coletados >= item.quantidade}>
                  <img src={item.imagem} alt={item.nome} />
                  <span>{item.quantidade}x {item.nome.replace(/_/g, ' ')}</span>
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
              alt={item.nome}
              $left={item.left} 
              $duracao={item.duracao} 
              $tamanho={item.tamanho}
              onAnimationEnd={() => removerItemForaDaTela(item.id)}
            />
          ))}
          <S.Balcao />
          <S.PratoMontagem $animando={animacaoImpacto}>
            {ingredientesMontados.map((item, index) => (
              <S.IngredienteEmpilhado key={index} src={item.imagem} alt={item.nome} $index={index} />
            ))}
          </S.PratoMontagem>
        </>
      )}

      <S.Chef ref={chefRef} src="/assets/piramideSabor/chef.png" alt="Chef Nutri" $left={posicaoChef} $escondido={animacaoFinal.iniciada} />
      
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
                {ingredientesMontados.map((item, index) => (
                  <S.IngredienteEmpilhado key={index} src={item.imagem} alt={item.nome} $index={index} />
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