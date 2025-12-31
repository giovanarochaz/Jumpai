import React, { useState, useEffect, useCallback } from 'react';
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
  
  // Criamos uma lista gigante para o carrossel ser virtualmente infinito e sem "pulos"
  const MULTIPLICADOR = 20; 
  const listaInfinita = Array(MULTIPLICADOR).fill(DADOS_JOGOS).flat();

  // Começamos no meio da lista gigante para permitir navegação livre para ambos os lados
  const [indiceAtual, setIndiceAtual] = useState(Math.floor(listaInfinita.length / 2));
  const [semTransicao, setSemTransicao] = useState(false);

  const { mostrarCameraFlutuante, estaPiscando } = useStore(lojaOlho);
  const indiceReal = indiceAtual % totalJogos;
  const jogoAtivo = DADOS_JOGOS[indiceReal];

  const mover = useCallback((direcao: 'proximo' | 'anterior') => {
    setSemTransicao(false);
    setIndiceAtual(prev => direcao === 'proximo' ? prev + 1 : prev - 1);
  }, []);

  // Reset silencioso: quando o usuário chega perto do fim da lista gigante, 
  // voltamos para o meio sem animação (imperceptível)
  useEffect(() => {
    if (indiceAtual > listaInfinita.length - 10 || indiceAtual < 10) {
      setSemTransicao(true);
      setIndiceAtual(Math.floor(listaInfinita.length / 2) + (indiceAtual % totalJogos));
    }
  }, [indiceAtual, totalJogos, listaInfinita.length]);

  // Narrador Ocular: Lê o título e descrição e move o carrossel se o modo ocular estiver ativo
  useLeitorOcular(`${jogoAtivo.titulo}. ${jogoAtivo.descricao}`, [indiceReal], () => {
    if (mostrarCameraFlutuante) {
      setTimeout(() => mover('proximo'), 3000);
    }
  });

  // Seleção por piscada
  useEffect(() => {
    if (estaPiscando && mostrarCameraFlutuante) {
      pararNarracao();
      navegar(jogoAtivo.rota);
    }
  }, [estaPiscando, mostrarCameraFlutuante, jogoAtivo, navegar]);

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
            {listaInfinita.map((jogo, index) => (
              <S.CardDoJogo 
                key={`${jogo.id}-${index}`} 
                $estaAtivo={index === indiceAtual}
                onClick={() => {
                  if (index === indiceAtual) navegar(jogo.rota);
                  else setIndiceAtual(index);
                }}
              >
                <S.ContainerImagemCard>
                  <ImageWithLoader src={jogo.imagem} alt={jogo.titulo} />
                </S.ContainerImagemCard>

                <S.ConteudoCard>
                  <S.BlocoTexto>
                    <S.TituloCard>{jogo.titulo}</S.TituloCard>
                    <S.DescricaoCard>{jogo.descricao}</S.DescricaoCard>
                  </S.BlocoTexto>

                  <S.BotaoJogar $estaAtivo={index === indiceAtual}>
                    <Play fill="currentColor" size={20} />
                    {index === indiceAtual ? 'JOGAR AGORA' : 'SELECIONAR'}
                  </S.BotaoJogar>
                </S.ConteudoCard>
              </S.CardDoJogo>
            ))}
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