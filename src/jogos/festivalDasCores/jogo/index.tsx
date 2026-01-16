import React, { useState, useEffect, useRef } from 'react';
import * as S from './styles';
import { DesenhoCanvas } from './desenhos';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';
import type { ConfiguracoesJogo } from '../../../interface/types';

const CORES = {
  v: '#EF4444', a: '#FACC15', az: '#3B82F6',
  l: '#F97316', ver: '#22C55E', r: '#9333EA',
  vl: '#EA580C', al: '#FDBA74', av: '#84CC16', azv: '#06B6D4'
};

const DIFICULDADES = {
  facil: { paleta: [CORES.v, CORES.a, CORES.az], desenhos: ['paisagem', 'peixe', 'escudo'] },
  medio: { paleta: [CORES.v, CORES.a, CORES.az, CORES.l, CORES.ver, CORES.r], desenhos: ['foguete', 'casa', 'barco'] },
  dificil: { paleta: Object.values(CORES), desenhos: ['robo', 'balao', 'carro'] }
};

const FestivalDasCoresJogo: React.FC<{ aoVencer: () => void; aoPerder: () => void; configuracoes: ConfiguracoesJogo }> = ({ aoVencer, aoPerder, configuracoes }) => {
  const { estaPiscando, mostrarCameraFlutuante: modoOcular } = useStore(lojaOlho);
  const config = DIFICULDADES[configuracoes.dificuldade as keyof typeof DIFICULDADES] || DIFICULDADES.facil;

  const [jogoIniciado, setJogoIniciado] = useState(!modoOcular);
  const [desenhoAtivo, setDesenhoAtivo] = useState('');
  const [coresUsuario, setCoresUsuario] = useState<Record<string, string>>({});
  const [gabarito, setGabarito] = useState<Record<string, string>>({});
  const [partesLimpando, setPartesLimpando] = useState<string[]>([]);
  
  const [fase, setFase] = useState<'area' | 'cor'>('area');
  const [indiceFoco, setIndiceFoco] = useState(0);
  const [areaEscolhida, setAreaEscolhida] = useState<string | null>(null);
  const [corMouse, setCorMouse] = useState(config.paleta[0]);

  const lock = useRef(false);

  useEffect(() => {
    const id = config.desenhos[Math.floor(Math.random() * 3)];
    setDesenhoAtivo(id);
    
    const partesMap: Record<string, string[]> = {
      paisagem: ['ceu', 'grama', 'sol', 'montanha'],
      peixe: ['mar', 'corpo', 'cauda', 'olho'],
      escudo: ['fundo', 'base', 'detalhe', 'faixa'],
      foguete: ['espaco', 'corpo', 'bico', 'asa_e', 'asa_d', 'fogo', 'janela'],
      casa: ['ceu', 'chao', 'parede', 'telhado', 'porta', 'janela'],
      barco: ['ceu', 'mar', 'casco', 'mastro', 'vela_d', 'vela_e'],
      robo: ['fundo', 'corpo', 'cabeca', 'braco_e', 'braco_d', 'perna_e', 'perna_d', 'olho_e', 'olho_d', 'antena'],
      balao: ['ceu', 'nuvem', 'cesta', 'gomos1', 'gomos2', 'faixa', 'sol', 'corda_e', 'corda_d'],
      carro: ['ceu', 'estrada', 'corpo', 'teto', 'janela_e', 'janela_d', 'roda_e', 'roda_d', 'calota_e', 'calota_d']
    };

    const ps = partesMap[id] || [];
    const g: Record<string, string> = {};
    const u: Record<string, string> = {};
    ps.forEach(p => { 
        g[p] = config.paleta[Math.floor(Math.random() * config.paleta.length)]; 
        u[p] = '#FFFFFF'; 
    });
    setGabarito(g); setCoresUsuario(u);
  }, [configuracoes.dificuldade]);

  const validar = (novas: Record<string, string>) => {
    if (Object.values(novas).every(c => c !== '#FFFFFF')) {
      const erros = Object.keys(gabarito).filter(p => novas[p] !== gabarito[p]);
      if (erros.length === 0) setTimeout(aoVencer, 1000);
      else if (configuracoes.penalidade) setTimeout(aoPerder, 1000);
      else {
        // Treme e some (desaparece)
        setPartesLimpando(erros);
        setTimeout(() => {
          const reset = { ...novas };
          erros.forEach(p => reset[p] = '#FFFFFF');
          setCoresUsuario(reset);
          setPartesLimpando([]);
        }, 850);
      }
    }
  };

  // Scanning
  useEffect(() => {
    if (!modoOcular || !jogoIniciado) return;
    const interval = setInterval(() => {
      setIndiceFoco(prev => {
        const max = fase === 'area' ? Object.keys(coresUsuario).length : config.paleta.length;
        return (prev + 1) % max;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [modoOcular, jogoIniciado, fase, coresUsuario]);

  // Blink Logic
  useEffect(() => {
    if (!modoOcular || !estaPiscando || lock.current) return;
    lock.current = true;
    
    if (!jogoIniciado) {
      setJogoIniciado(true);
    } else {
      const chaves = Object.keys(coresUsuario);
      if (fase === 'area') {
        setAreaEscolhida(chaves[indiceFoco]);
        setFase('cor'); setIndiceFoco(0);
      } else {
        const novas = { ...coresUsuario, [areaEscolhida!]: config.paleta[indiceFoco] };
        setCoresUsuario(novas); setFase('area'); setIndiceFoco(0); setAreaEscolhida(null);
        validar(novas);
      }
    }
    setTimeout(() => lock.current = false, 1000);
  }, [estaPiscando]);

  return (
    <S.ContainerAtelie>
      {modoOcular && !jogoIniciado && <S.OverlayStart>PISQUE PARA COMEÇAR A PINTAR!</S.OverlayStart>}
      
      <S.TituloFase>
        {modoOcular ? (fase === 'area' ? "Escolha onde pintar" : "Escolha a cor") : "Pinte o desenho igual ao modelo"}
      </S.TituloFase>

      <S.AreaCavaletes>
        <S.CavaleteContainer>
          <S.Quadro>
            <DesenhoCanvas 
              id={desenhoAtivo} cores={coresUsuario} partesLimpando={partesLimpando}
              parteFocada={modoOcular ? (fase === 'area' ? Object.keys(coresUsuario)[indiceFoco] : areaEscolhida) : null}
              onClickParte={(p) => { if(!modoOcular) { const n = {...coresUsuario, [p]: corMouse}; setCoresUsuario(n); validar(n); }}}
            />
          </S.Quadro>
        </S.CavaleteContainer>
        <S.CavaleteContainer>
          <S.Quadro><DesenhoCanvas id={desenhoAtivo} cores={gabarito} /></S.Quadro>
        </S.CavaleteContainer>
      </S.AreaCavaletes>

      <S.BarraFerramentas>
        {config.paleta.map((c, i) => (
          <S.Tinta 
            key={i} $cor={c} $podeClicar={!modoOcular}
            $selecionada={modoOcular ? (fase === 'cor' && indiceFoco === i) : (corMouse === c)}
            onClick={() => !modoOcular && setCorMouse(c)}
          />
        ))}
      </S.BarraFerramentas>
    </S.ContainerAtelie>
  );
};

export default FestivalDasCoresJogo;