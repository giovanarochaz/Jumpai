// src/pages/Jogo/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Paragrafo, CarrosselViewport, CarrosselTrilha, TextoCard, CardJogo, ImagemCard, BotaoNavegacao, CarrosselContainer } from './styles';
import { BlocoDeDescricao, ContainerDaTela } from '../controle/styles';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  // {
  //   id: 2,
  //   titulo: 'Corrida de Obstáculos',
  //   imagem: '/assets/jogo-obstaculos.png',
  //   texto: "Desafio de reflexos! Pule e desvie de obstáculos na velocidade da luz para alcançar a maior pontuação.",
  //   rota: "/sistemaSolar",
  // },
  // {
  //   id: 3,
  //   titulo: 'Labirinto da Memória',
  //   imagem: '/assets/jogo-memoria.png',
  //   texto: "Teste sua memória e lógica. Resolva quebra-cabeças que usam suas piscadas para combinar padrões e cores.",
  //   rota: "/sistemaSolar",
  // },
  // {
  //   id: 5,
  //   titulo: 'Caça às Constelações',
  //   imagem: '/assets/jogo-constelacoes.png',
  //   texto: "Use suas piscadas para conectar as estrelas e formar figuras no céu noturno.",
  //   rota: "/sistemaSolar",
  // },
  // {
  //   id: 6,
  //   titulo: 'Escalada Radical',
  //   imagem: '/assets/jogo-escalada.png',
  //   texto: "Escale a montanha mais alta do mundo! Escolha o caminho certo para chegar ao topo com segurança.",
  //   rota: "/sistemaSolar",
  // },
  // {
  //   id: 7,
  //   titulo: 'Patrulha da Reciclagem',
  //   imagem: '/assets/jogo-reciclagem.png',
  //   texto: "Salve o planeta! Separe o lixo corretamente e limpe os oceanos neste desafio ecológico.",
  //   rota: "/sistemaSolar",
  // },
  // {
  //   id: 8,
  //   titulo: 'Maestro Musical',
  //   imagem: '/assets/jogo-musical.png',
  //   texto: "Repita as sequências de notas musicais que ficam cada vez mais difíceis e crie sua própria melodia.",
  //   rota: "/sistemaSolar",
  // },
  // {
  //   id: 9,
  //   titulo: 'Ateliê de Pintura',
  //   imagem: '/assets/jogo-pintura.png',
  //   texto: "Misture as cores primárias para criar as cores secundárias pedidas no desafio e pinte belos quadros.",
  //   rota: "/sistemaSolar",
  // },
  // {
  //   id: 10,
  //   titulo: 'Cozinha Maluca',
  //   imagem: '/assets/jogo-culinaria.png',
  //   texto: "Siga a receita e monte os lanches na ordem correta antes que o tempo acabe!",
  //   rota: "/sistemaSolar",
  // },
];

const Jogo: React.FC = () => {
  const [indiceAtivo, setIndiceAtivo] = useState(0);
  const timerRef = useRef<number | null>(null);

  const navigate = useNavigate();

  // 3. Funções para navegação manual
  const irParaProximo = () => {
    setIndiceAtivo((indiceAnterior) => (indiceAnterior + 1) % fasesDoJogo.length);
  };

  const irParaAnterior = () => {
    setIndiceAtivo((indiceAnterior) => 
      (indiceAnterior - 1 + fasesDoJogo.length) % fasesDoJogo.length
    );
  };

  useEffect(() => {
    // Esta função já reinicia o timer a cada 3s a partir do novo card selecionado.
    // Não precisamos mudar nada aqui!
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(irParaProximo, 3000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // A dependência [indiceAtivo] é a chave. Toda vez que ele muda, o timer é resetado.
  }, [indiceAtivo]); 

  const handleCardClick = (index: number) => {
    if (index === indiceAtivo) {
      navigate(fasesDoJogo[index].rota);
    } else {
      setIndiceAtivo(index); // Clicar em um card inativo agora apenas o seleciona
    }
  };

  return (
    <ContainerDaTela>
      <BlocoDeDescricao>
        <Paragrafo>
          Selecione um tipo de Jogo e comece a explorar um universo de possibilidades!
        </Paragrafo>
      </BlocoDeDescricao>

      <CarrosselContainer>
        <BotaoNavegacao direcao="esquerda" onClick={irParaAnterior}>
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

        {/* Botão de avançar */}
        <BotaoNavegacao direcao="direita" onClick={irParaProximo}>
          <ArrowRightCircle size={50} />
        </BotaoNavegacao>
      </CarrosselContainer>
    </ContainerDaTela>
  );
};

export default Jogo;