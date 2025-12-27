import React, { useState, useEffect, useRef } from 'react';
import * as S from './styles'; // Importando do arquivo acima
import { BookOpen, Gamepad2, AlertTriangle, Zap, Music, ShieldOff } from 'lucide-react';
import { useStore } from 'zustand';
import { lojaOlho } from '../../../lojas/lojaOlho';

const slidesEducativos = [
    {
      titulo: 'Bem-vindo à Lagoa!',
      icone: <img src="/assets/saltoAlfabetico/sapo_parado.png" width={80} alt="Sapo" />,
      texto: "Ajude o sapinho a atravessar a lagoa! Ele precisa pular nas vitórias-régias certas para formar palavras.",
      destaque: "Mas cuidado para não cair na água!"
    },
    {
      titulo: 'O que são Sílabas?',
      icone: <BookOpen size={40} />,
      texto: "Sílabas são os pedacinhos de som das palavras. Quando você fala 'SA-PO', você fala dois pedacinhos.",
      destaque: "SA + PO = SAPO"
    },
];

export type DificuldadeJogo = 'facil' | 'medio' | 'dificil';

export interface ConfiguracoesSalto {
   dificuldade: DificuldadeJogo;
   penalidade: boolean;
   sons: boolean;
}

interface ManualSaltoProps {
   aoIniciar: (config: ConfiguracoesSalto) => void;
}

type FocoConfig = 'dificuldade' | 'penalidade' | 'sons' | 'iniciar';
const DIFICULDADES: DificuldadeJogo[] = ['facil', 'medio', 'dificil'];

const ManualSaltoAlfabetico: React.FC<ManualSaltoProps> = ({ aoIniciar }) => {
   const [tela, setTela] = useState<'educativo' | 'comoJogar' | 'configuracoes'>('educativo');
   const [slideIndex, setSlideIndex] = useState(0);

   const [config, setConfig] = useState<ConfiguracoesSalto>({
      dificuldade: 'facil',
      penalidade: true,
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
         else setTela('comoJogar');
      } else if (tela === 'comoJogar') setTela('configuracoes');
   };

   const voltar = () => {
      if (tela === 'educativo' && slideIndex > 0) setSlideIndex(s => s - 1);
      else if (tela === 'comoJogar') { setTela('educativo'); setSlideIndex(0); }
      else if (tela === 'configuracoes') setTela('comoJogar');
   };

   // Lógica de Controle Ocular (Padrão)
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

      switch(tela) {
         case 'educativo':
            const slide = slidesEducativos[slideIndex];
            return (
               <S.ContainerInfo>
                  <S.TituloSlide>{slide.titulo}</S.TituloSlide>
                  <S.CaixaIcone>{slide.icone}</S.CaixaIcone>
                  <S.TextoExplicativo>
                     {slide.texto}
                     <br/><br/>
                     <strong>{slide.destaque}</strong>
                  </S.TextoExplicativo>
                  <S.BarraNavegacao>
                     <S.BotaoNav onClick={voltar} disabled={slideIndex === 0}>Voltar</S.BotaoNav>
                     <S.BotaoNav onClick={avancar} $destaque={isEye}>Próximo</S.BotaoNav>
                  </S.BarraNavegacao>
               </S.ContainerInfo>
            );
         
         case 'comoJogar':
            return (
               <S.ContainerInfo>
                  <S.TituloSlide>Missão do Sapo</S.TituloSlide>
                  <S.InfoRow>
                     <S.CaixaIcone><Gamepad2 size={32} color="#14532D"/></S.CaixaIcone>
                     <S.TextoRow>
                        <h3>Escolha a Vitória-Régia</h3>
                        <p>A palavra vai aparecer faltando pedaços. Pule na folha que tem a sílaba correta!</p>
                     </S.TextoRow>
                  </S.InfoRow>
                  <S.InfoRow>
                     <S.CaixaIcone><AlertTriangle size={32} color="#14532D"/></S.CaixaIcone>
                     <S.TextoRow>
                        <h3>Cuidado!</h3>
                        <p>Se escolher a sílaba errada, a folha afunda e o sapo se molha!</p>
                     </S.TextoRow>
                  </S.InfoRow>
                  <S.BarraNavegacao>
                     <S.BotaoNav onClick={voltar}>Voltar</S.BotaoNav>
                     <S.BotaoNav onClick={avancar} $destaque={isEye}>Vamos lá!</S.BotaoNav>
                  </S.BarraNavegacao>
               </S.ContainerInfo>
            );

         case 'configuracoes':
            return (
               <S.ContainerConfig>
                  <S.TituloSlide>Ajustes</S.TituloSlide>
                  
                  <S.LinhaConfig $focado={focoConfig === 'dificuldade'}>
                     <S.Label><Zap size={28}/> Nível</S.Label>
                     <S.GrupoBotoes>
                        {DIFICULDADES.map(d => (
                           <S.BotaoOpcao 
                              key={d}
                              ativo={config.dificuldade === d}
                              onClick={() => setConfig(c => ({...c, dificuldade: d}))}
                           >
                              {d === 'facil' ? 'Fácil' : d === 'medio' ? 'Médio' : 'Difícil'}
                           </S.BotaoOpcao>
                        ))}
                     </S.GrupoBotoes>
                  </S.LinhaConfig>

                  <S.LinhaConfig $focado={focoConfig === 'penalidade'}>
                     <S.Label><ShieldOff size={28}/> Reiniciar se errar</S.Label>
                     <S.ToggleContainer>
                        <input type="checkbox" checked={config.penalidade} onChange={e => setConfig(c => ({...c, penalidade: e.target.checked}))} />
                        <span className="slider"></span>
                     </S.ToggleContainer>
                  </S.LinhaConfig>

                  <S.LinhaConfig $focado={focoConfig === 'sons'}>
                     <S.Label><Music size={28}/> Sons</S.Label>
                     <S.ToggleContainer>
                        <input type="checkbox" checked={config.sons} onChange={e => setConfig(c => ({...c, sons: e.target.checked}))} />
                        <span className="slider"></span>
                     </S.ToggleContainer>
                  </S.LinhaConfig>

                  <S.BotaoIniciar 
                     $focado={focoConfig === 'iniciar'}
                     onClick={() => aoIniciar(config)}
                  >
                     COMEÇAR AVENTURA!
                  </S.BotaoIniciar>
               </S.ContainerConfig>
            );
      }
   };

   return (
      <S.FundoModal>
         <S.ConteudoModal>
            {renderTela()}
         </S.ConteudoModal>
      </S.FundoModal>
   );
};

export default ManualSaltoAlfabetico;