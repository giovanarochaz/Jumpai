import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, Play } from 'lucide-react';
import { useStore } from 'zustand';
import { lojaOlho } from '../../lojas/lojaOlho';
import {
  MainContainer,ContentWrapper,HeaderSection,GameTitle,SubtitleWrapper,CarrosselContainer,BotaoNavegacao,
  CarrosselViewport,CarrosselTrilha,CardJogo,CardImageContainer,CardBadge,CardContent,CardTitle,CardDescription, PlayButton, StatusEyeControl
} from './styles';
import { ImageWithLoader } from '../../componentes/Imagem/ImageWithLoader';
import Menu from '../../componentes/Menu';


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

  const timerRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const mostrarCameraFlutuante = useStore(lojaOlho, (state) => state.mostrarCameraFlutuante);
  const estaPiscando = useStore(lojaOlho, (state) => state.estaPiscando);

  const indiceReal = indiceAtual % totalOriginal;

  const irParaProximo = useCallback(() => {
    setSemTransicao(false);
    setIndiceAtual(prev => prev + 1);
  }, []);

  const irParaAnterior = useCallback(() => {
    setSemTransicao(false);
    setIndiceAtual(prev => prev - 1);
  }, []);

  useEffect(() => {
    if (indiceAtual >= totalOriginal * 2) {
      setTimeout(() => {
        setSemTransicao(true);
        setIndiceAtual(totalOriginal);
      }, 500); 
    } else if (indiceAtual < totalOriginal) {
      setTimeout(() => {
        setSemTransicao(true);
        setIndiceAtual(totalOriginal * 2 - 1);
      }, 500);
    }
  }, [indiceAtual, totalOriginal]);

  // Autoplay
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mostrarCameraFlutuante) {
      timerRef.current = window.setInterval(irParaProximo, 3500);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [indiceAtual, mostrarCameraFlutuante, irParaProximo]);

  // Piscada
  useEffect(() => {
    if (mostrarCameraFlutuante && estaPiscando) {
      if (timerRef.current) clearInterval(timerRef.current);
      navigate(dadosJogos[indiceReal].rota);
    }
  }, [estaPiscando, mostrarCameraFlutuante, indiceReal, navigate]);

  const handleCardClick = (indexNoLoop: number) => {
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
              <span>Controle Ocular Ativo: Pisque para entrar!</span>
            </StatusEyeControl>
          ) : (
            <SubtitleWrapper>
              Escolha seu desafio e comece a aventura!
            </SubtitleWrapper>
          )}
        </HeaderSection>

        <CarrosselContainer>
          <BotaoNavegacao 
            $direcao="esquerda" 
            onClick={irParaAnterior} 
            disabled={mostrarCameraFlutuante}
          >
            <ArrowLeft size={32} />
          </BotaoNavegacao>

          <CarrosselViewport>
            <CarrosselTrilha 
              $indiceAtual={indiceAtual} 
              $semTransicao={semTransicao}
            >
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

          <BotaoNavegacao 
            $direcao="direita" 
            onClick={irParaProximo} 
            disabled={mostrarCameraFlutuante}
          >
            <ArrowRight size={32} />
          </BotaoNavegacao>
        </CarrosselContainer>
      </ContentWrapper>
    </MainContainer>
  );
};

export default Jogo;