// src/pages/Jogo/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Paragrafo, CarrosselViewport, CarrosselTrilha, TextoCard, CardJogo, ImagemCard, BotaoNavegacao, CarrosselContainer } from './styles';
import { BlocoDeDescricao, ContainerDaTela } from '../controle/styles';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'zustand'; // Importa useStore
import { lojaOlho } from '../../lojas/lojaOlho'; // Importa sua loja global

const fasesDoJogo = [
  {
    id: 1,
    titulo: 'Aventura Espacial',
    imagem: '/assets/jogos/capa_sistema_solar.png', 
    texto: "Prepare-se para uma aventura espacial educativa! Assuma o controle de um corajoso astronauta, desvie de chuvas de meteoros perigosas e colete os planetas do nosso Sistema Solar na ordem correta. Um erro pode custar toda a sua missão! Com controles simples e um desafio crescente, aprenda sobre astronomia da forma mais divertida possível. Você consegue completar a coleção?",
    rota: "/sistemaSolar",
  },
  // {
  //   id: 4,
  //   titulo: 'Missão Corpo Humano',
  //   imagem: '/assets/jogos/capa_corpo_humano.png',
  //   texto: "Explore o corpo humano! Navegue pela corrente sanguínea e aprenda sobre as células.",
  //   rota: "/corpoHumano",
  // },
  // Os outros jogos comentados no código original podem ser descomentados aqui.
];

const Jogo: React.FC = () => {
  const [indiceAtivo, setIndiceAtivo] = useState(0);
  const timerRef = useRef<number | null>(null);

  const navigate = useNavigate();

  // 1. Acessa o estado de controle ocular e de piscada da loja global
  const mostrarCameraFlutuante = useStore(lojaOlho, (state) => state.mostrarCameraFlutuante);
  const estaPiscando = useStore(lojaOlho, (state) => state.estaPiscando);

  // Funções para navegação manual
  const irParaProximo = () => {
    setIndiceAtivo((indiceAnterior) => (indiceAnterior + 1) % fasesDoJogo.length);
  };

  const irParaAnterior = () => {
    setIndiceAtivo((indiceAnterior) => 
      (indiceAnterior - 1 + fasesDoJogo.length) % fasesDoJogo.length
    );
  };

  // Efeito para a rolagem automática do carrossel
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    // A rolagem automática deve sempre ocorrer para "pré-selecionar" os jogos
    timerRef.current = setInterval(irParaProximo, 3000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // Dependência [indiceAtivo] garante que o timer seja resetado a cada mudança de card
  }, [indiceAtivo]); 

  // 2. Novo efeito para detecção de piscada e confirmação
  useEffect(() => {
    if (mostrarCameraFlutuante && estaPiscando) {
      console.log('Piscada detectada, confirmando seleção:', fasesDoJogo[indiceAtivo].titulo);
      // Para a rolagem automática imediatamente após a confirmação
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null; // Garante que o timer seja explicitamente null
      }
      navigate(fasesDoJogo[indiceAtivo].rota);
      // A lojaOlho já cuida de setar estaPiscando para false após um curto período,
      // evitando múltiplas navegações com uma única piscada.
    }
  }, [estaPiscando, mostrarCameraFlutuante, indiceAtivo, navigate]);


  // 3. Lógica condicional para o clique no card
  const handleCardClick = (index: number) => {
    if (mostrarCameraFlutuante) {
      // Se o controle ocular estiver ativo, o clique apenas seleciona o card
      // A navegação ocorre APENAS com a piscada.
      if (index === indiceAtivo) {
        console.log("Controle Ocular Ativado: pisque para confirmar o jogo.");
        // Opcionalmente, adicione um feedback visual aqui.
      } else {
        setIndiceAtivo(index); // Permite a pré-seleção manual do card
      }
    } else {
      // Comportamento original: clica para navegar
      if (index === indiceAtivo) {
        navigate(fasesDoJogo[index].rota);
      } else {
        setIndiceAtivo(index);
      }
    }
  };

  return (
    <ContainerDaTela>
      <BlocoDeDescricao>
        <Paragrafo>
          Selecione um tipo de Jogo e comece a explorar um universo de possibilidades!
          {/* 5. Mensagem informativa */}
          {mostrarCameraFlutuante && (
            <span> (Controle Ocular Ativado: o jogo muda automaticamente, pisque para confirmar!)</span>
          )}
        </Paragrafo>
      </BlocoDeDescricao>

      <CarrosselContainer>
        {/* 4. Desativa os botões de navegação manual quando o controle ocular está ativo */}
        <BotaoNavegacao direcao="esquerda" onClick={irParaAnterior} disabled={mostrarCameraFlutuante}>
          <ArrowLeftCircle size={50} />
        </BotaoNavegacao>

        <CarrosselViewport>
          <CarrosselTrilha indiceAtual={indiceAtivo}>
            {fasesDoJogo.map((fase, index) => (
              <CardJogo
                key={`${fase.id}-${index}`}
                $isActive={index === indiceAtivo}
                onClick={() => handleCardClick(index)}
              >
                <TextoCard>{fase.titulo}</TextoCard>
                <ImagemCard src={fase.imagem} alt={fase.titulo} />
                <TextoCard>{fase.texto}</TextoCard>
              </CardJogo>
            ))}
          </CarrosselTrilha>
        </CarrosselViewport>

        {/* 4. Desativa os botões de navegação manual quando o controle ocular está ativo */}
        <BotaoNavegacao direcao="direita" onClick={irParaProximo} disabled={mostrarCameraFlutuante}>
          <ArrowRightCircle size={50} />
        </BotaoNavegacao>
      </CarrosselContainer>
    </ContainerDaTela>
  );
};

export default Jogo;