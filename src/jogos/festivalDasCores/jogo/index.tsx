// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import * as S from './styles';
// import { useStore } from 'zustand';
// import { lojaOlho } from '../../../lojas/lojaOlho';
// import type { ConfiguracoesCores } from '../manual/index';

// // --- SISTEMA DE CORES E MISTURAS ---

// const CORES = {
//   branco: '#FFFFFF',
  
//   // Primárias
//   vermelho: '#EF4444',
//   amarelo: '#FACC15',
//   azul: '#3B82F6',
  
//   // Secundárias
//   laranja: '#F97316',
//   verde: '#22C55E',
//   roxo: '#9333EA',
  
//   // Terciárias
//   vermelhoLaranja: '#EA580C',
//   amareloLaranja: '#FDBA74',
//   amareloVerde: '#84CC16',
//   azulVerde: '#06B6D4',
//   azulRoxo: '#4F46E5',
//   vermelhoRoxo: '#BE185D',
// };

// // Definição das Paletas
// const PALETA_PRIMARIA = [
//   { nome: 'Vermelho', hex: CORES.vermelho },
//   { nome: 'Amarelo', hex: CORES.amarelo },
//   { nome: 'Azul', hex: CORES.azul },
//   { nome: 'Branco (Apagar)', hex: CORES.branco }
// ];

// const PALETA_COMPLETA = [
//   { nome: 'Vermelho', hex: CORES.vermelho },
//   { nome: 'Amarelo', hex: CORES.amarelo },
//   { nome: 'Azul', hex: CORES.azul },
//   { nome: 'Laranja', hex: CORES.laranja },
//   { nome: 'Verde', hex: CORES.verde },
//   { nome: 'Roxo', hex: CORES.roxo },
//   { nome: 'Branco (Apagar)', hex: CORES.branco }
// ];

// // Mapa de Misturas: [Cor1, Cor2] -> Resultado
// const MAPA_MISTURAS: Record<string, string> = {
//   // Primária + Primária = Secundária
//   [[CORES.amarelo, CORES.vermelho].sort().join(',')]: CORES.laranja,
//   [[CORES.amarelo, CORES.azul].sort().join(',')]: CORES.verde,
//   [[CORES.azul, CORES.vermelho].sort().join(',')]: CORES.roxo,

//   // Secundária + Primária = Terciária
//   [[CORES.laranja, CORES.vermelho].sort().join(',')]: CORES.vermelhoLaranja,
//   [[CORES.amarelo, CORES.laranja].sort().join(',')]: CORES.amareloLaranja,
//   [[CORES.amarelo, CORES.verde].sort().join(',')]: CORES.amareloVerde,
//   [[CORES.azul, CORES.verde].sort().join(',')]: CORES.azulVerde,
//   [[CORES.azul, CORES.roxo].sort().join(',')]: CORES.azulRoxo,
//   [[CORES.roxo, CORES.vermelho].sort().join(',')]: CORES.vermelhoRoxo,
// };

// // Mapa de Compatibilidade para a Borracha Automática
// // Define quais cores são "ingredientes válidos" para um alvo
// const COMPONENTES_VALIDOS: Record<string, string[]> = {
//     // Primárias (só aceitam elas mesmas)
//     [CORES.vermelho]: [CORES.vermelho],
//     [CORES.amarelo]: [CORES.amarelo],
//     [CORES.azul]: [CORES.azul],

//     // Secundárias (aceitam elas e suas primárias)
//     [CORES.laranja]: [CORES.laranja, CORES.vermelho, CORES.amarelo],
//     [CORES.verde]: [CORES.verde, CORES.azul, CORES.amarelo],
//     [CORES.roxo]: [CORES.roxo, CORES.azul, CORES.vermelho],

//     // Terciárias (aceitam elas, a secundária base e as primárias envolvidas)
//     [CORES.vermelhoLaranja]: [CORES.vermelhoLaranja, CORES.laranja, CORES.vermelho, CORES.amarelo],
//     [CORES.amareloLaranja]: [CORES.amareloLaranja, CORES.laranja, CORES.amarelo, CORES.vermelho],
//     [CORES.amareloVerde]: [CORES.amareloVerde, CORES.verde, CORES.amarelo, CORES.azul],
//     [CORES.azulVerde]: [CORES.azulVerde, CORES.verde, CORES.azul, CORES.amarelo],
//     [CORES.azulRoxo]: [CORES.azulRoxo, CORES.roxo, CORES.azul, CORES.vermelho],
//     [CORES.vermelhoRoxo]: [CORES.vermelhoRoxo, CORES.roxo, CORES.vermelho, CORES.azul],
// };

// // --- ARQUIVOS DE DESENHO (SVG) ---
// const DESENHOS_DISPONIVEIS = [
//   { id: 'casa', partes: ['ceu', 'grama', 'parede', 'telhado', 'porta', 'janela', 'sol'] },
//   { id: 'foguete', partes: ['fundo', 'corpo', 'bico', 'asas', 'janela', 'fogo'] },
//   { id: 'flor', partes: ['ceu', 'grama', 'caule', 'folhas', 'petalas', 'miolo'] },
//   { id: 'barco', partes: ['ceu', 'mar', 'casco', 'vela_esq', 'vela_dir', 'mastro'] },
//   { id: 'balao', partes: ['ceu', 'balao_topo', 'balao_meio', 'balao_baixo', 'cesta', 'nuvem'] }
// ];

// const DesenhosSVG: React.FC<{ tipo: string; cores: Record<string, string>; onClickParte?: (parte: string) => void }> = ({ tipo, cores, onClickParte }) => {
//   const p = (parte: string) => ({
//     fill: cores[parte] || CORES.branco,
//     onClick: () => onClickParte && onClickParte(parte),
//     style: { cursor: onClickParte ? 'url(/assets/festivalCores/pincel_cursor.png) 0 20, pointer' : 'default' }
//   });

//   switch (tipo) {
//     case 'casa': return (
//         <S.SvgContainer viewBox="0 0 400 300">
//           <rect x="0" y="0" width="400" height="200" {...p('ceu')} />
//           <rect x="0" y="200" width="400" height="100" {...p('grama')} />
//           <circle cx="50" cy="50" r="30" {...p('sol')} />
//           <rect x="120" y="120" width="160" height="130" {...p('parede')} />
//           <path d="M100 120 L200 40 L300 120 Z" {...p('telhado')} />
//           <rect x="180" y="170" width="40" height="80" {...p('porta')} />
//           <circle cx="200" cy="90" r="20" {...p('janela')} />
//         </S.SvgContainer>
//       );
//     case 'foguete': return (
//         <S.SvgContainer viewBox="0 0 400 300">
//           <rect x="0" y="0" width="400" height="300" {...p('fundo')} />
//           <path d="M170 200 L200 250 L230 200 Z" {...p('fogo')} />
//           <path d="M150 200 L170 150 L230 150 L250 200 Z" {...p('asas')} />
//           <rect x="170" y="100" width="60" height="100" rx="10" {...p('corpo')} />
//           <path d="M170 100 L200 50 L230 100 Z" {...p('bico')} />
//           <circle cx="200" cy="140" r="15" {...p('janela')} />
//         </S.SvgContainer>
//       );
//     case 'flor': return (
//         <S.SvgContainer viewBox="0 0 400 300">
//           <rect x="0" y="0" width="400" height="250" {...p('ceu')} />
//           <rect x="0" y="250" width="400" height="50" {...p('grama')} />
//           <rect x="195" y="150" width="10" height="100" {...p('caule')} />
//           <path d="M195 210 Q 160 190 195 230 Z" {...p('folhas')} />
//           <path d="M205 220 Q 240 200 205 240 Z" {...p('folhas')} />
//           <g onClick={() => onClickParte && onClickParte('petalas')}>
//              <circle cx="200" cy="90" r="35" fill={cores['petalas'] || CORES.branco} /> 
//              <circle cx="235" cy="115" r="35" fill={cores['petalas'] || CORES.branco} /> 
//              <circle cx="230" cy="155" r="35" fill={cores['petalas'] || CORES.branco} /> 
//              <circle cx="170" cy="155" r="35" fill={cores['petalas'] || CORES.branco} /> 
//              <circle cx="165" cy="115" r="35" fill={cores['petalas'] || CORES.branco} /> 
//           </g>
//           <circle cx="200" cy="130" r="30" {...p('miolo')} stroke="#000" strokeWidth="2.5" />
//         </S.SvgContainer>
//       );
//     case 'barco': return (
//         <S.SvgContainer viewBox="0 0 400 300">
//           <rect x="0" y="0" width="400" height="220" {...p('ceu')} />
//           <rect x="0" y="220" width="400" height="80" {...p('mar')} />
//           <path d="M100 220 L130 270 L270 270 L300 220 Z" {...p('casco')} />
//           <rect x="195" y="100" width="10" height="120" {...p('mastro')} />
//           <path d="M205 110 L280 200 L205 200 Z" {...p('vela_dir')} />
//           <path d="M195 130 L140 200 L195 200 Z" {...p('vela_esq')} />
//         </S.SvgContainer>
//       );
//     case 'balao': return (
//         <S.SvgContainer viewBox="0 0 400 300">
//           <rect x="0" y="0" width="400" height="300" {...p('ceu')} />
//           <ellipse cx="300" cy="80" rx="40" ry="20" {...p('nuvem')} />
//           <rect x="180" y="220" width="40" height="30" {...p('cesta')} />
//           <path d="M180 220 L160 180 M220 220 L240 180" stroke="#000" fill="none" strokeWidth="2" />
//           <circle cx="200" cy="130" r="70" {...p('balao_meio')} />
//           <path d="M130 130 A 70 70 0 0 1 270 130 Z" {...p('balao_topo')} />
//           <path d="M160 180 L240 180 L200 200 Z" {...p('balao_baixo')} />
//         </S.SvgContainer>
//       );
//     default: return null;
//   }
// };

// interface Props {
//   aoVencer: () => void;
//   aoPerder: () => void;
//   configuracoes: ConfiguracoesCores;
// }

// const FestivalDasCoresJogo: React.FC<Props> = ({ aoVencer, configuracoes }) => {
//   const { estaPiscando } = useStore(lojaOlho);
  
//   const [desenhoAtual, setDesenhoAtual] = useState(DESENHOS_DISPONIVEIS[0]);
//   const [gabaritoCores, setGabaritoCores] = useState<Record<string, string>>({});
//   const [coresUsuario, setCoresUsuario] = useState<Record<string, string>>({});
//   const [corSelecionada, setCorSelecionada] = useState<string>(CORES.vermelho);
//   const [paletaAtiva, setPaletaAtiva] = useState(PALETA_PRIMARIA);
  
//   // Audio Refs
//   const somPincelRef = useRef<HTMLAudioElement | null>(null);
//   const somSucessoRef = useRef<HTMLAudioElement | null>(null);
//   const somErroRef = useRef<HTMLAudioElement | null>(null);

//   // Inicialização de áudio
//   useEffect(() => {
//     somPincelRef.current = new Audio('/assets/festivalCores/sounds/pincel.mp3');
//     somSucessoRef.current = new Audio('/assets/festivalCores/sounds/success.mp3');
//     somErroRef.current = new Audio('/assets/festivalCores/sounds/erro.mp3'); // Adicione este som se tiver, ou reuse outro
//   }, []);

//   useEffect(() => {
//     iniciarNovoJogo();
//   }, [configuracoes.dificuldade]); 

//   const iniciarNovoJogo = () => {
//     // 1. Configurar Paleta baseado na Dificuldade
//     if (configuracoes.dificuldade === 'dificil') {
//         setPaletaAtiva(PALETA_COMPLETA);
//     } else {
//         setPaletaAtiva(PALETA_PRIMARIA);
//     }

//     // 2. Escolher Desenho
//     const desenhoSorteado = DESENHOS_DISPONIVEIS[Math.floor(Math.random() * DESENHOS_DISPONIVEIS.length)];
//     setDesenhoAtual(desenhoSorteado);

//     // 3. Gerar Gabarito
//     const novoGabarito: Record<string, string> = {};
//     const novoUsuario: Record<string, string> = {};

//     let coresPossiveis = [CORES.vermelho, CORES.amarelo, CORES.azul]; 

//     if (configuracoes.dificuldade === 'medio' || configuracoes.dificuldade === 'dificil') {
//         coresPossiveis.push(CORES.laranja, CORES.verde, CORES.roxo);
//     }
//     if (configuracoes.dificuldade === 'dificil') {
//         coresPossiveis.push(
//             CORES.vermelhoLaranja, CORES.amareloLaranja, CORES.amareloVerde, 
//             CORES.azulVerde, CORES.azulRoxo, CORES.vermelhoRoxo
//         );
//     }

//     desenhoSorteado.partes.forEach(parte => {
//       // Garante que a cor escolhida seja diferente do vizinho se possível (opcional, aqui é aleatório simples)
//       const corAleatoria = coresPossiveis[Math.floor(Math.random() * coresPossiveis.length)];
//       novoGabarito[parte] = corAleatoria;
//       novoUsuario[parte] = CORES.branco; 
//     });

//     setGabaritoCores(novoGabarito);
//     setCoresUsuario(novoUsuario);
//   };

//   const misturarCor = (corBase: string, corNova: string): string => {
//     if (corNova === CORES.branco) return CORES.branco; 
//     if (corBase === CORES.branco || !corBase) return corNova; 
//     if (corBase === corNova) return corBase; 

//     const chaveMistura = [corBase, corNova].sort().join(',');
//     if (MAPA_MISTURAS[chaveMistura]) {
//         return MAPA_MISTURAS[chaveMistura];
//     }
//     // Se não misturar, substitui
//     return corNova;
//   };

//   const tocarSomPincel = () => {
//     if (configuracoes?.sons && somPincelRef.current) {
//         const audio = somPincelRef.current;
//         audio.currentTime = 0;
//         audio.play().catch(() => {});

//         setTimeout(() => {
//             audio.pause();
//             audio.currentTime = 0;
//         }, 1000);
//     }
//   };

//   const tocarSomErro = () => {
//     if (configuracoes?.sons && somErroRef.current) {
//         somErroRef.current.currentTime = 0;
//         somErroRef.current.play().catch(() => {});
//     }
//   };

//   const pintarParte = (parte: string) => {
//     const corAtual = coresUsuario[parte];
//     const novaCor = misturarCor(corAtual, corSelecionada);
//     const corAlvo = gabaritoCores[parte];

//     // --- LÓGICA DA BORRACHA AUTOMÁTICA ---
//     if (configuracoes.penalidade && novaCor !== CORES.branco) {
//         // Verifica se a nova cor é o alvo OU se é um componente válido do alvo
//         const componentesValidos = COMPONENTES_VALIDOS[corAlvo] || [];
//         const ehValido = novaCor === corAlvo || componentesValidos.includes(novaCor);

//         if (!ehValido) {
//             // Erro! A cor aplicada não ajuda a chegar no alvo.
//             tocarSomErro();
//             // Reseta para branco
//             const resetCores = { ...coresUsuario, [parte]: CORES.branco };
//             setCoresUsuario(resetCores);
//             return; // Sai da função, não aplica a cor errada
//         }
//     }

//     // Se passou na validação ou não tem penalidade, aplica a cor
//     tocarSomPincel();
//     const novasCores = { ...coresUsuario, [parte]: novaCor };
//     setCoresUsuario(novasCores);
//     verificarVitoria(novasCores);
//   };

//   const verificarVitoria = (estadoAtual: Record<string, string>) => {
//     const venceu = desenhoAtual.partes.every(parte => estadoAtual[parte] === gabaritoCores[parte]);

//     if (venceu) {
//       if (configuracoes?.sons && somSucessoRef.current) somSucessoRef.current.play().catch(() => {});
//       setTimeout(aoVencer, 1000);
//     }
//   };

//   return (
//     <S.ContainerAtelie>
//       <S.TituloFase>PINTE IGUAL AO MODELO</S.TituloFase>

//       <S.AreaCavaletes>
//         <S.CavaleteContainer $delay="0.2s">
//           <S.CavaleteMadeira />
//           <S.Quadro $interativo={true}>
//             <S.LabelQuadro>SEU DESENHO</S.LabelQuadro>
//             <DesenhosSVG 
//               tipo={desenhoAtual.id}
//               cores={coresUsuario} 
//               onClickParte={pintarParte} 
//             />
//           </S.Quadro>
//           <S.BaseQuadro />
//         </S.CavaleteContainer>

//         <S.CavaleteContainer $delay="0.5s">
//           <S.CavaleteMadeira />
//           <S.Quadro>
//             <S.LabelQuadro>MODELO</S.LabelQuadro>
//             <DesenhosSVG 
//               tipo={desenhoAtual.id}
//               cores={gabaritoCores} 
//             />
//           </S.Quadro>
//           <S.BaseQuadro />
//         </S.CavaleteContainer>
//       </S.AreaCavaletes>

//       {/* Paleta Dinâmica (Primárias ou Completa dependendo do nível) */}
//       <S.BarraFerramentas>
//         {paletaAtiva.map((tinta) => (
//           <S.Tinta
//             key={tinta.hex}
//             $cor={tinta.hex}
//             $selecionada={corSelecionada === tinta.hex}
//             onClick={() => setCorSelecionada(tinta.hex)}
//             title={tinta.nome}
//           />
//         ))}
//       </S.BarraFerramentas>
//     </S.ContainerAtelie>
//   );
// };

// export default FestivalDasCoresJogo;