import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { useStore } from 'zustand';
import { lojaOlho } from '../../lojas/lojaOlho';
import { pararNarracao } from '../../servicos/acessibilidade';
import * as S from './styles';
import { ImageWithLoader } from '../../componentes/Imagem/ImageWithLoader';
import Menu from '../../componentes/Menu';
import { useLeitorOcular } from '../../hooks/useLeitorOcular';

const DADOS_JOGOS = [
  { id: 1, titulo: 'AVENTURA ESPACIAL', categoria: 'Astronomia', imagem: '/assets/jogos/capa_sistema_solar.png', descricao: "Viaje pelo Sistema Solar e desvie de meteoros!", rota: "/sistemaSolar" },
  { id: 2, titulo: 'PIRÂMIDE DO SABOR', categoria: 'Nutrição', imagem: '/assets/jogos/capa_piramide_do_sabor.png', descricao: "Monte pratos saudáveis como um Chef Nutri!", rota: "/piramideDoSabor" },
  { id: 3, titulo: 'SALTO ALFABÉTICO', categoria: 'Linguagem', imagem: '/assets/jogos/capa_salto_alfabetico.png', descricao: "Aprenda o alfabeto brincando de pular!", rota: "/saltoAlfabetico" },
  { id: 4, titulo: 'FESTIVAL DAS CORES', categoria: 'Cores', imagem: '/assets/jogos/capa_festival_das_cores.png', descricao: "Crie obras-primas em um mundo vibrante!", rota: "/festivalDasCores" },
];

const SelecaoJogos: React.FC = () => {
  const navegar = useNavigate();
  const totalJogos = DADOS_JOGOS.length;
  const MULTIPLICADOR = 20; 
  const listaInfinita = Array(MULTIPLICADOR).fill(DADOS_JOGOS).flat();

  const { mostrarCameraFlutuante, estaPiscando, leitorAtivo } = useStore(lojaOlho);

  const [indiceAtual, setIndiceAtual] = useState(Math.floor(listaInfinita.length / 2));
  const [semTransicao, setSemTransicao] = useState(false);
  const [podeInteragir, setPodeInteragir] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const indiceReal = indiceAtual % totalJogos;
  const jogoAtivo = DADOS_JOGOS[indiceReal];

  const mover = useCallback((direcao: 'proximo' | 'anterior') => {
    setSemTransicao(false);
    setIndiceAtual(prev => direcao === 'proximo' ? prev + 1 : prev - 1);
  }, []);

  // Loop infinito do carrossel
  useEffect(() => {
    if (indiceAtual > listaInfinita.length - 10 || indiceAtual < 10) {
      setSemTransicao(true);
      setIndiceAtual(Math.floor(listaInfinita.length / 2) + (indiceAtual % totalJogos));
    }
  }, [indiceAtual, totalJogos, listaInfinita.length]);

  // Função para estimar o tempo de fala (90ms por caractere + margem)
  const estimarTempoDeLeitura = (texto: string) => {
    const tempoCalculado = texto.length * 95; 
    return Math.max(tempoCalculado, 4500); // Garante no mínimo 4.5s
  };

  // CICLO AUTOMÁTICO (CONTROLE OCULAR)
  useEffect(() => {
    if (!mostrarCameraFlutuante) {
      setPodeInteragir(true);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    const textoCompleto = `${jogoAtivo.titulo}. Categoria ${jogoAtivo.categoria}. ${jogoAtivo.descricao}`;

    if (leitorAtivo) {
      setPodeInteragir(false);
      const tempoLeitura = estimarTempoDeLeitura(textoCompleto);
      
      // Timer da leitura
      timerRef.current = setTimeout(() => {
        setPodeInteragir(true); // Libera o clique/piscada

        // Aguarda 2.5 segundos em estado "pronto" antes de passar para o próximo
        timerRef.current = setTimeout(() => {
          mover('proximo');
        }, 2500);

      }, tempoLeitura);

    } else {
      // Se o leitor estiver desligado, apenas espera 3s e move
      setPodeInteragir(true);
      timerRef.current = setTimeout(() => {
        mover('proximo');
      }, 3000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [indiceAtual, mostrarCameraFlutuante, leitorAtivo, mover, jogoAtivo]);

  // Hook do Narrador Ocular
  useLeitorOcular(
    `${jogoAtivo.titulo}. Categoria ${jogoAtivo.categoria}. ${jogoAtivo.descricao}`, 
    [indiceReal]
  );

  // Seleção por piscada
  useEffect(() => {
    if (estaPiscando && mostrarCameraFlutuante && podeInteragir) {
      if (timerRef.current) clearTimeout(timerRef.current);
      pararNarracao();
      navegar(jogoAtivo.rota);
    }
  }, [estaPiscando, mostrarCameraFlutuante, podeInteragir, jogoAtivo, navegar]);

  return (
    <S.ContainerPrincipal>
      <Menu />
      <S.EnvolvedorConteudo>
        <S.SecaoCabecalho>
          <S.TituloPagina>Escolha sua Missão</S.TituloPagina>
        </S.SecaoCabecalho>

        <S.ContainerCarrossel>
          <S.BotaoNavegacao $direcao="esquerda" onClick={() => mover('anterior')}>
            <ArrowLeft size={30} />
          </S.BotaoNavegacao>

          <S.TrilhaCarrossel $indiceAtual={indiceAtual} $semTransicao={semTransicao}>
            {listaInfinita.map((jogo, index) => {
              const estaAtivo = index === indiceAtual;
              return (
                <S.CardDoJogo 
                  key={`${jogo.id}-${index}`} 
                  $estaAtivo={estaAtivo}
                  $podeInteragir={estaAtivo ? podeInteragir : true}
                  onClick={() => {
                    if (estaAtivo) {
                      if (!mostrarCameraFlutuante || podeInteragir) navegar(jogo.rota);
                    } else {
                      setIndiceAtual(index);
                    }
                  }}
                >
                  <S.TagCategoria>{jogo.categoria}</S.TagCategoria>
                  
                  <S.ContainerImagemCard>
                    <ImageWithLoader src={jogo.imagem} alt={jogo.titulo} />
                  </S.ContainerImagemCard>

                  <S.ConteudoCard>
                    <S.BlocoTexto>
                      <S.TituloCard>{jogo.titulo}</S.TituloCard>
                      <S.DescricaoCard>{jogo.descricao}</S.DescricaoCard>
                    </S.BlocoTexto>

                    <S.BotaoJogar 
                      $estaAtivo={estaAtivo} 
                      $podeInteragir={estaAtivo ? podeInteragir : true}
                    >
                      <Play fill="currentColor" size={20} />
                      {estaAtivo ? (podeInteragir ? 'JOGAR AGORA' : 'OUVINDO...') : 'SELECIONAR'}
                    </S.BotaoJogar>
                  </S.ConteudoCard>
                </S.CardDoJogo>
              );
            })}
          </S.TrilhaCarrossel>

          <S.BotaoNavegacao $direcao="direita" onClick={() => mover('proximo')}>
            <ArrowRight size={30} />
          </S.BotaoNavegacao>
        </S.ContainerCarrossel>
      </S.EnvolvedorConteudo>
    </S.ContainerPrincipal>
  );
};

export default SelecaoJogos;