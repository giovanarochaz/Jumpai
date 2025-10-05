import React from 'react';
import { ContainerDaTela,  BlocoDeDescricao,  Paragrafo,  AgrupadorDeBotoes,  BotaoEstilizado,  TextoDoBotao} from './styles';
import { Gamepad2 } from 'lucide-react';
import { cores } from '../../estilos/cores';

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
          <Gamepad2 size={64} color={cores.verde}/>
          <TextoDoBotao>Facil</TextoDoBotao>
        </BotaoEstilizado>

        <BotaoEstilizado onClick={abrirOpcoes}>
          <Gamepad2 size={64} color={cores.amarelo} />
          <TextoDoBotao>Medio</TextoDoBotao>
        </BotaoEstilizado>

        <BotaoEstilizado onClick={abrirOpcoes}>
          <Gamepad2 size={64} color={cores.vermelho} />
          <TextoDoBotao>Dificil</TextoDoBotao>
        </BotaoEstilizado>


        <BotaoEstilizado onClick={abrirOpcoes}>
          <Gamepad2 size={64} color={cores.roxo} />
          <TextoDoBotao>Desafio</TextoDoBotao>
        </BotaoEstilizado>

      </AgrupadorDeBotoes>
    </ContainerDaTela>
  );
};

export default Dificuldade;