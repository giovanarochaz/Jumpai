import React from 'react';
import { ContainerDaTela,  BlocoDeDescricao,  Titulo,  Paragrafo,  AgrupadorDeBotoes,  BotaoEstilizado,  TextoDoBotao} from './styles';
import { Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Controle: React.FC = () => {

  const navigate = useNavigate();
  
  const controleOcular = () => {
    navigate('/calibragemOcular') 
  };

  const controleTeclado = () => {
    navigate('/jogos/teclado')  
  };

  return (
    <ContainerDaTela>
      <BlocoDeDescricao>
        <Titulo>JUMPAI</Titulo>
        <Paragrafo>
          Um jogo educativo e acessível, criado para crianças com mobilidade reduzida.
          Pule obstáculos e explore mundos incríveis usando apenas piscadas ou
          movimentos da mão, com o poder da inteligência artificial!
          Selecione um tipo de controle e comece a explorar um universo de possibilidades!
        </Paragrafo>
      </BlocoDeDescricao>

      <AgrupadorDeBotoes>
        <BotaoEstilizado onClick={controleOcular}>
          <Gamepad2 size={64} color="currentColor" />
          <TextoDoBotao>Controlar Pelos Olhos</TextoDoBotao>
        </BotaoEstilizado>

        <BotaoEstilizado onClick={controleTeclado}>
          <Gamepad2 size={64} color="currentColor" />
          <TextoDoBotao>Controlar Pelo teclado</TextoDoBotao>
        </BotaoEstilizado>
      </AgrupadorDeBotoes>
    </ContainerDaTela>
  );
};

export default Controle;