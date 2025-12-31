import React, { useState, useEffect, useRef } from 'react';
import * as S from './styles';
import { Palette, Brush, Zap, Music, ShieldOff, ArrowRight, ArrowLeft, Target } from 'lucide-react';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';

// --- CONTEÚDO EDUCATIVO COMPLETO ---
const slidesEducativos = [
    {
      titulo: 'Cores Primárias',
      texto: "Tudo começa aqui! Vermelho, Amarelo e Azul são as 'cores pais'. Elas existem sozinhas e não podem ser criadas misturando outras tintas.",
      renderVisual: () => (
        <S.ContainerMistura>
           <S.BolhaCor $cor="#EF4444" title="Vermelho" />
           <S.BolhaCor $cor="#FACC15" title="Amarelo" />
           <S.BolhaCor $cor="#3B82F6" title="Azul" />
        </S.ContainerMistura>
      )
    },
    {
      titulo: 'Cores Secundárias',
      texto: "Acontecem quando misturamos duas Cores Primárias em partes iguais.",
      renderVisual: () => (
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {/* Laranja */}
            <S.ContainerMistura>
                <S.BolhaCor $cor="#EF4444" /> <S.Operador>+</S.Operador> <S.BolhaCor $cor="#FACC15" /> 
                <S.Operador>=</S.Operador> <S.BolhaCor $cor="#F97316" title="Laranja" />
            </S.ContainerMistura>
            {/* Verde */}
            <S.ContainerMistura>
                <S.BolhaCor $cor="#3B82F6" /> <S.Operador>+</S.Operador> <S.BolhaCor $cor="#FACC15" /> 
                <S.Operador>=</S.Operador> <S.BolhaCor $cor="#22C55E" title="Verde" />
            </S.ContainerMistura>
            {/* Roxo */}
            <S.ContainerMistura>
                <S.BolhaCor $cor="#3B82F6" /> <S.Operador>+</S.Operador> <S.BolhaCor $cor="#EF4444" /> 
                <S.Operador>=</S.Operador> <S.BolhaCor $cor="#9333EA" title="Roxo" />
            </S.ContainerMistura>
        </div>
      )
    },
    {
      titulo: 'Terciárias (Quentes)',
      texto: "As Cores Terciárias nascem da mistura de uma Primária com uma Secundária. Veja os tons quentes!",
      renderVisual: () => (
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {/* Vermelho + Laranja = Vermelho Alaranjado */}
            <S.ContainerMistura>
                <S.BolhaCor $cor="#EF4444" /> <S.Operador>+</S.Operador> <S.BolhaCor $cor="#F97316" /> 
                <S.Operador>=</S.Operador> <S.BolhaCor $cor="#EA580C" title="Vermelho-Alaranjado" />
            </S.ContainerMistura>
            {/* Amarelo + Laranja = Amarelo Alaranjado */}
            <S.ContainerMistura>
                <S.BolhaCor $cor="#FACC15" /> <S.Operador>+</S.Operador> <S.BolhaCor $cor="#F97316" /> 
                <S.Operador>=</S.Operador> <S.BolhaCor $cor="#FDBA74" title="Amarelo-Alaranjado" />
            </S.ContainerMistura>
            {/* Vermelho + Roxo = Magenta */}
            <S.ContainerMistura>
                <S.BolhaCor $cor="#EF4444" /> <S.Operador>+</S.Operador> <S.BolhaCor $cor="#9333EA" /> 
                <S.Operador>=</S.Operador> <S.BolhaCor $cor="#BE185D" title="Magenta" />
            </S.ContainerMistura>
        </div>
      )
    },
    {
      titulo: 'Terciárias (Frias)',
      texto: "Também temos os tons frios! Misturando azuis e verdes criamos cores da natureza.",
      renderVisual: () => (
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {/* Azul + Verde = Turquesa */}
            <S.ContainerMistura>
                <S.BolhaCor $cor="#3B82F6" /> <S.Operador>+</S.Operador> <S.BolhaCor $cor="#22C55E" /> 
                <S.Operador>=</S.Operador> <S.BolhaCor $cor="#06B6D4" title="Turquesa" />
            </S.ContainerMistura>
            {/* Amarelo + Verde = Lima */}
            <S.ContainerMistura>
                <S.BolhaCor $cor="#FACC15" /> <S.Operador>+</S.Operador> <S.BolhaCor $cor="#22C55E" /> 
                <S.Operador>=</S.Operador> <S.BolhaCor $cor="#84CC16" title="Lima" />
            </S.ContainerMistura>
            {/* Azul + Roxo = Violeta */}
            <S.ContainerMistura>
                <S.BolhaCor $cor="#3B82F6" /> <S.Operador>+</S.Operador> <S.BolhaCor $cor="#9333EA" /> 
                <S.Operador>=</S.Operador> <S.BolhaCor $cor="#4F46E5" title="Violeta" />
            </S.ContainerMistura>
        </div>
      )
    },
    {
      titulo: 'Seu Objetivo',
      texto: "Use o pincel mágico! Pinte o desenho da esquerda para ficar igualzinho ao modelo da direita. Misture as tintas para encontrar a cor certa!",
      renderVisual: () => <Target size={100} color="#E11D48" style={{filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))'}} />
    }
];

export type DificuldadeCores = 'facil' | 'medio' | 'dificil';

export interface ConfiguracoesCores {
   dificuldade: DificuldadeCores;
   penalidade: boolean;
   sons: boolean;
}

interface ManualProps {
   aoIniciar: (config: ConfiguracoesCores) => void;
}

type FocoConfig = 'dificuldade' | 'penalidade' | 'sons' | 'iniciar';
const DIFICULDADES: DificuldadeCores[] = ['facil', 'medio', 'dificil'];

const ManualFestivalDasCores: React.FC<ManualProps> = ({ aoIniciar }) => {
   const [tela, setTela] = useState<'educativo' | 'configuracoes'>('educativo');
   const [slideIndex, setSlideIndex] = useState(0);

   const [config, setConfig] = useState<ConfiguracoesCores>({
      dificuldade: 'facil',
      penalidade: false,
      sons: true,
   });

   const { mostrarCameraFlutuante, estaPiscando } = useStore(lojaOlho);
   const [focoConfig, setFocoConfig] = useState<FocoConfig>('dificuldade');
   const [bloquearPiscada, setBloquearPiscada] = useState(true);
   const timerRef = useRef<any>(null);
   const cicloRef = useRef<any>(null);

   const avancar = () => {
      if (tela === 'educativo') {
         if (slideIndex < slidesEducativos.length - 1) setSlideIndex(s => s + 1);
         else setTela('configuracoes');
      }
   };

   const voltar = () => {
      if (tela === 'educativo' && slideIndex > 0) setSlideIndex(s => s - 1);
      else if (tela === 'configuracoes') { setTela('educativo'); setSlideIndex(slidesEducativos.length - 1); }
   };

   // Lógica de Controle Ocular
   useEffect(() => {
      timerRef.current = setTimeout(() => setBloquearPiscada(false), 1000);
      return () => { clearTimeout(timerRef.current); clearInterval(cicloRef.current); };
   }, []);

   useEffect(() => {
      if (bloquearPiscada || !mostrarCameraFlutuante || !estaPiscando) return;
      setBloquearPiscada(true);

      if (tela !== 'configuracoes') {
         avancar();
         timerRef.current = setTimeout(() => setBloquearPiscada(false), 800);
      } else {
         switch (focoConfig) {
            case 'dificuldade':
                const idx = DIFICULDADES.indexOf(config.dificuldade);
                setConfig(c => ({...c, dificuldade: DIFICULDADES[(idx + 1) % 3]}));
                setFocoConfig('penalidade');
                break;
            case 'penalidade':
                setConfig(c => ({...c, penalidade: !c.penalidade}));
                setFocoConfig('sons');
                break;
            case 'sons':
                setConfig(c => ({...c, sons: !c.sons}));
                setFocoConfig('iniciar');
                break;
            case 'iniciar':
                aoIniciar(config);
                break;
         }
         timerRef.current = setTimeout(() => setBloquearPiscada(false), 800);
      }
   }, [estaPiscando, mostrarCameraFlutuante, bloquearPiscada]);

   // Ciclo de foco automático nas configurações
   useEffect(() => {
      if (tela !== 'configuracoes' || !mostrarCameraFlutuante) return;
      cicloRef.current = setInterval(() => {
         setFocoConfig(prev => {
            if (prev === 'dificuldade') return 'penalidade';
            if (prev === 'penalidade') return 'sons';
            if (prev === 'sons') return 'iniciar';
            return 'dificuldade';
         });
      }, 2000);
      return () => clearInterval(cicloRef.current);
   }, [tela, mostrarCameraFlutuante]);

   const renderTela = () => {
      const isEye = mostrarCameraFlutuante && !bloquearPiscada;

      if (tela === 'educativo') {
         const slide = slidesEducativos[slideIndex];
         return (
            <>
               <S.TituloManual>
                  <Palette size={40} style={{marginRight: 10, verticalAlign: 'middle', color: '#F97316'}} />
                  {slide.titulo}
               </S.TituloManual>
               
               <S.ContainerSlide>
                  {slide.renderVisual()}
                  <S.TextoExplicativo>{slide.texto}</S.TextoExplicativo>
               </S.ContainerSlide>

               <S.BarraNavegacao>
                  <S.BotaoNav onClick={voltar} disabled={slideIndex === 0}>
                     <ArrowLeft /> Voltar
                  </S.BotaoNav>
                  <S.BotaoNav onClick={avancar} $destaque={isEye}>
                     {slideIndex === slidesEducativos.length - 1 ? 'Configurar' : 'Próximo'} <ArrowRight />
                  </S.BotaoNav>
               </S.BarraNavegacao>
            </>
         );
      }

      return (
         <S.ContainerConfig>
            <S.TituloManual>Mesa de Trabalho</S.TituloManual>
            
            <S.LinhaConfig $focado={focoConfig === 'dificuldade'}>
               <S.Label><Brush size={28}/> Nível de Cor</S.Label>
               <S.GrupoBotoes>
                  <S.BotaoDificuldade 
                     $ativo={config.dificuldade === 'facil'} 
                     onClick={() => setConfig(c => ({...c, dificuldade: 'facil'}))} 
                     $cor="#EF4444"
                  >
                     Primárias
                  </S.BotaoDificuldade>
                  <S.BotaoDificuldade 
                     $ativo={config.dificuldade === 'medio'} 
                     onClick={() => setConfig(c => ({...c, dificuldade: 'medio'}))} 
                     $cor="#F97316"
                  >
                     + Secundárias
                  </S.BotaoDificuldade>
                  <S.BotaoDificuldade 
                     $ativo={config.dificuldade === 'dificil'} 
                     onClick={() => setConfig(c => ({...c, dificuldade: 'dificil'}))} 
                     $cor="#9333EA"
                  >
                     + Terciárias
                  </S.BotaoDificuldade>
               </S.GrupoBotoes>
            </S.LinhaConfig>

            <S.LinhaConfig $focado={focoConfig === 'penalidade'}>
               <S.Label><ShieldOff size={28}/> Borracha Automática (Resetar ao errar)</S.Label>
               <S.ToggleContainer>
                  <input type="checkbox" checked={config.penalidade} onChange={e => setConfig(c => ({...c, penalidade: e.target.checked}))} />
                  <span className="slider"></span>
               </S.ToggleContainer>
            </S.LinhaConfig>

            <S.LinhaConfig $focado={focoConfig === 'sons'}>
               <S.Label><Music size={28}/> Sons do Ateliê</S.Label>
               <S.ToggleContainer>
                  <input type="checkbox" checked={config.sons} onChange={e => setConfig(c => ({...c, sons: e.target.checked}))} />
                  <span className="slider"></span>
               </S.ToggleContainer>
            </S.LinhaConfig>

            <S.BotaoIniciar $focado={focoConfig === 'iniciar'} onClick={() => aoIniciar(config)}>
               PEGAR PINCEL E PINTAR!
            </S.BotaoIniciar>
         </S.ContainerConfig>
      );
   };

   return (
      <S.FundoModal>
         <S.ConteudoModal>
            {renderTela()}
         </S.ConteudoModal>
      </S.FundoModal>
   );
};

export default ManualFestivalDasCores;