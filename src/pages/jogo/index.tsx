import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, Play } from 'lucide-react';
import { useStore } from 'zustand';
import { lojaOlho } from '../../lojas/lojaOlho';
import { pararNarracao } from '../../servicos/acessibilidade';
import {
  MainContainer, ContentWrapper, HeaderSection, GameTitle, SubtitleWrapper, CarrosselContainer, BotaoNavegacao,
  CarrosselViewport, CarrosselTrilha, CardJogo, CardImageContainer, CardBadge, CardContent, CardTitle, CardDescription, PlayButton, StatusEyeControl
} from './styles';
import { ImageWithLoader } from '../../componentes/Imagem/ImageWithLoader';
import Menu from '../../componentes/Menu';
import { useLeitorOcular } from '../../hooks/useLeitorOcular';

const dadosJogos = [
  {
    id: 1,
    titulo: 'Aventura Espacial',
    categoria: 'Astronomia',
    imagem: '/assets/jogos/capa_sistema_solar.png',
    descricao: "Viaje pelo Sistema Solar! Desvie de meteoros e colete planetas na ordem certa.",
    rota: "/sistemaSolar",
  },
  {
    id: 2,
    titulo: 'Pirâmide do Sabor',
    categoria: 'Nutrição',
    imagem: '/assets/jogos/capa_piramide_do_sabor.png',
    descricao: "Monte pratos saudáveis e deliciosos como um verdadeiro Chef Nutri!",
    rota: "/piramideDoSabor",
  },
];

const Jogo: React.FC = () => {
  const listaEstendida = [...dadosJogos, ...dadosJogos, ...dadosJogos];
  const totalOriginal = dadosJogos.length;

  const [indiceAtual, setIndiceAtual] = useState(totalOriginal);
  const [semTransicao, setSemTransicao] = useState(false);
  const [bloqueioEntrada, setBloqueioEntrada] = useState(true);

  const navigate = useNavigate();
  const mostrarCameraFlutuante = useStore(lojaOlho, (state) => state.mostrarCameraFlutuante);
  const estaPiscando = useStore(lojaOlho, (state) => state.estaPiscando);

  const indiceReal = indiceAtual % totalOriginal;

  // Navegação
  const irParaProximo = useCallback(() => {
    setSemTransicao(false);
    setIndiceAtual(prev => prev + 1);
  }, []);

  const irParaAnterior = useCallback(() => {
    setSemTransicao(false);
    setIndiceAtual(prev => prev - 1);
  }, []);

  // Timer de segurança para evitar clique residual da tela anterior
  useEffect(() => {
    const timer = setTimeout(() => setBloqueioEntrada(false), 1500);
    return () => {
      clearTimeout(timer);
      pararNarracao();
    };
  }, []);

  /**
   * CORREÇÃO AQUI: 
   * Removido o !bloqueioEntrada. O carrossel deve girar sozinho 
   * independente do bloqueio de clique.
   */
  const lidarComFimDaLeitura = useCallback(() => {
    if (mostrarCameraFlutuante) {
      setTimeout(() => {
        irParaProximo();
      }, 1500);
    }
  }, [mostrarCameraFlutuante, irParaProximo]);

  const jogoAtual = dadosJogos[indiceReal];
  const textoParaLer = jogoAtual ? `${jogoAtual.titulo}. ${jogoAtual.descricao}` : null;
  
  useLeitorOcular(textoParaLer, [indiceReal], lidarComFimDaLeitura);

  // Loop Infinito do Carrossel
  useEffect(() => {
    if (indiceAtual >= totalOriginal * 2) {
      const t = setTimeout(() => {
        setSemTransicao(true);
        setIndiceAtual(totalOriginal);
      }, 500);
      return () => clearTimeout(t);
    } else if (indiceAtual < totalOriginal) {
      const t = setTimeout(() => {
        setSemTransicao(true);
        setIndiceAtual(totalOriginal * 2 - 1);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [indiceAtual, totalOriginal]);

  // Detecção de Piscada (Seleção do Jogo) - O BLOQUEIO CONTINUA AQUI
  useEffect(() => {
    if (mostrarCameraFlutuante && estaPiscando && !bloqueioEntrada) {
      pararNarracao();
      navigate(dadosJogos[indiceReal].rota);
    }
  }, [estaPiscando, mostrarCameraFlutuante, indiceReal, navigate, bloqueioEntrada]);

  const handleCardClick = (indexNoLoop: number) => {
    if (bloqueioEntrada) return;
    const jogoRealIndex = indexNoLoop % totalOriginal;
    if (mostrarCameraFlutuante) {
      if (indexNoLoop !== indiceAtual) setIndiceAtual(indexNoLoop);
    } else {
      if (indexNoLoop === indiceAtual) navigate(dadosJogos[jogoRealIndex].rota);
      else setIndiceAtual(indexNoLoop);
    }
  };

  return (
    <MainContainer>
      <Menu />
      <ContentWrapper>
        <HeaderSection>
          <GameTitle>SELECIONE A MISSÃO</GameTitle>
          {mostrarCameraFlutuante ? (
            <StatusEyeControl>
              <Eye size={24} className="blink-icon" />
              <span>
                {bloqueioEntrada ? "Aguarde um instante..." : "Pisque para entrar no jogo!"}
              </span>
            </StatusEyeControl>
          ) : (
            <SubtitleWrapper>Escolha seu desafio!</SubtitleWrapper>
          )}
        </HeaderSection>

        <CarrosselContainer>
          <BotaoNavegacao $direcao="esquerda" onClick={irParaAnterior}>
            <ArrowLeft size={32} />
          </BotaoNavegacao>

          <CarrosselViewport>
            <CarrosselTrilha $indiceAtual={indiceAtual} $semTransicao={semTransicao}>
              {listaEstendida.map((fase, index) => (
                <CardJogo
                  key={`${fase.id}-${index}`} 
                  $isActive={index === indiceAtual}
                  onClick={() => handleCardClick(index)}
                >
                  <CardImageContainer>
                    <CardBadge>{fase.categoria}</CardBadge>
                    <ImageWithLoader src={fase.imagem} alt={fase.titulo} />
                  </CardImageContainer>
                  <CardContent>
                    <div>
                        <CardTitle>{fase.titulo}</CardTitle>
                        <CardDescription>{fase.descricao}</CardDescription>
                    </div>
                    <PlayButton>
                        <Play size={20} fill="currentColor" />
                        {index === indiceAtual ? 'JOGAR AGORA' : 'SELECIONAR'}
                    </PlayButton>
                  </CardContent>
                </CardJogo>
              ))}
            </CarrosselTrilha>
          </CarrosselViewport>

          <BotaoNavegacao $direcao="direita" onClick={irParaProximo}>
            <ArrowRight size={32} />
          </BotaoNavegacao>
        </CarrosselContainer>
      </ContentWrapper>
    </MainContainer>
  );
};

export default Jogo;