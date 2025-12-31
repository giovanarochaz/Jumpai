import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Keyboard } from 'lucide-react';

import { 
  ConteinerPrincipal, AreaConteudo, SecaoCabecalho,
  TituloJogo, EnvoltorioSubtitulo, TextoDescricao,
  SecaoNavegacao, CartaoSelecao, TextoCartao, DescricaoCartao
} from './styles';

import Menu from '../../componentes/Menu';

const Controle: React.FC = () => {
  const navegar = useNavigate();

  const irParaCalibragem = useCallback(() => {
    navegar('/calibragemOcular');
  }, [navegar]);

  const irParaJogos = useCallback(() => {
    navegar('/jogos');
  }, [navegar]);

  return (
    <ConteinerPrincipal>
      <Menu />
      <AreaConteudo>
        <SecaoCabecalho>
          <TituloJogo>JUMPAI</TituloJogo>

          <TextoDescricao>
            Um jogo educativo e acessível para todos! Explore mundos incríveis 
            usando o poder dos seus olhos ou a agilidade dos seus dedos.
          </TextoDescricao>

          <EnvoltorioSubtitulo>Como você quer jogar hoje?</EnvoltorioSubtitulo>
        </SecaoCabecalho>

        <SecaoNavegacao>
          <CartaoSelecao onClick={irParaCalibragem}>
            <Eye />
            <TextoCartao>Controle Ocular</TextoCartao>
            <DescricaoCartao>Pisque para jogar</DescricaoCartao>
          </CartaoSelecao>

          <CartaoSelecao onClick={irParaJogos}>
            <Keyboard />
            <TextoCartao>Controle Teclado</TextoCartao>
            <DescricaoCartao>Use as setas</DescricaoCartao>
          </CartaoSelecao>
        </SecaoNavegacao>
      </AreaConteudo>
    </ConteinerPrincipal>
  );
};

export default Controle;