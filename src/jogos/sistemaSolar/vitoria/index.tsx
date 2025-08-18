import React, { useState, useEffect } from 'react';
import * as S from './styles';
import { Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CORES_FOGOS = ['#FFD700', '#FF4500', '#2AD352', '#00BFFF', '#FF1493', '#ADFF2F'];
const NUMERO_FOGOS = 15;
const PARTICULAS_POR_FOGO = 12;

interface DadosFogos {
  id: number;
  top: string;
  left: string;
  cor: string;
  delay: string;
}

interface TelaVitoriaProps {
  aoReiniciar: () => void;
}

const TelaVitoria: React.FC<TelaVitoriaProps> = ({ aoReiniciar }) => {
  const [dadosDosFogos, setDadosDosFogos] = useState<DadosFogos[]>([]);
  const navigate = useNavigate();

  // Gera os dados aleatórios para os fogos de artifício apenas uma vez, quando o componente é montado.
  useEffect(() => {
    const dados: DadosFogos[] = [];
    for (let i = 0; i < NUMERO_FOGOS; i++) {
      dados.push({
        id: i,
        top: `${Math.random() * 80 + 10}%`, // Evita que os fogos estourem muito perto das bordas
        left: `${Math.random() * 80 + 10}%`,
        cor: CORES_FOGOS[Math.floor(Math.random() * CORES_FOGOS.length)],
        delay: `${Math.random() * 2}s`, // Atraso aleatório para cada explosão
      });
    }
    setDadosDosFogos(dados);
  }, []);

  const tratarCliqueOutroJogo = () => {
    navigate('/jogos/teclado');
  };

  return (
    <S.FundoVitoria>
      {/* Mapeia e renderiza cada explosão de fogos na tela */}
      {dadosDosFogos.map(fogo => (
        <S.ContainerFogos
          key={fogo.id}
          style={{
            '--top': fogo.top,
            '--left': fogo.left,
          } as React.CSSProperties}
        >
          {/* Renderiza as partículas para cada explosão */}
          {Array.from({ length: PARTICULAS_POR_FOGO }).map((_, index) => (
            <S.ParticulaFogos
              key={index}
              style={{
                '--color': fogo.cor,
                '--delay': fogo.delay,
              } as React.CSSProperties}
            />
          ))}
        </S.ContainerFogos>
      ))}

      {/* O conteúdo do modal é renderizado depois, ficando por cima dos fogos */}
      <S.ConteudoVitoria>
        <S.IconeTrofeu>
          <Trophy size={100} strokeWidth={1.5} />
        </S.IconeTrofeu>
        <S.TituloVitoria>MISSÃO COMPLETA!</S.TituloVitoria>
        <S.MensagemVitoria>
          Parabéns, explorador espacial! Você catalogou todos os planetas na ordem correta e se tornou um mestre do Sistema Solar!
        </S.MensagemVitoria>
        <S.ContainerBotoes>
          <S.BotaoVitoria onClick={aoReiniciar}>Jogar Novamente</S.BotaoVitoria>
          <S.BotaoVitoria onClick={tratarCliqueOutroJogo}>Outro Jogo</S.BotaoVitoria>
        </S.ContainerBotoes>
      </S.ConteudoVitoria>
    </S.FundoVitoria>
  );
};

export default TelaVitoria;