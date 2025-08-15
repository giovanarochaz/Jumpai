import React from 'react';
import { ContainerDaTela,  BlocoDeDescricao,  Titulo,  Paragrafo,  AgrupadorDeBotoes,  BotaoEstilizado,  TextoDoBotao} from './styles';
import { Gamepad2 } from 'lucide-react';
import { colors } from '../../styles/colors';

const Dificuldade: React.FC = () => {
    
  const iniciarJogo = () => {
    alert('Vamos começar a aventura!');
  };

  const abrirOpcoes = () => {
    alert('Abrindo as opções do jogo!');
  };

  return (
    <ContainerDaTela>
      <BlocoDeDescricao>
        <Paragrafo>
          Selecione a Dificuldade do seu Jogo
        </Paragrafo>
      </BlocoDeDescricao>

      <AgrupadorDeBotoes>
        <BotaoEstilizado onClick={iniciarJogo}>
          <Gamepad2 size={64} color={colors.verde}/>
          <TextoDoBotao>Facil</TextoDoBotao>
        </BotaoEstilizado>

        <BotaoEstilizado onClick={abrirOpcoes}>
          <Gamepad2 size={64} color={colors.amarelo} />
          <TextoDoBotao>Medio</TextoDoBotao>
        </BotaoEstilizado>

        <BotaoEstilizado onClick={abrirOpcoes}>
          <Gamepad2 size={64} color={colors.vermelho} />
          <TextoDoBotao>Dificil</TextoDoBotao>
        </BotaoEstilizado>


        <BotaoEstilizado onClick={abrirOpcoes}>
          <Gamepad2 size={64} color={colors.roxo} />
          <TextoDoBotao>Desafio</TextoDoBotao>
        </BotaoEstilizado>

      </AgrupadorDeBotoes>
    </ContainerDaTela>
  );
};

export default Dificuldade;