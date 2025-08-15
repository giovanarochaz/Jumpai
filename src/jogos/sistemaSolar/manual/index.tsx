import React, { useState } from 'react';
import * as S from './styles';
import { ArrowUp, ArrowDown, Gamepad2, AlertTriangle, Trophy, Badge } from 'lucide-react';

const planetasInfo = [
    { nome: 'Mercúrio', imagem: '/assets/sistemaSolar/mercurio.png', descricao: "Sou o menor planeta e o mais próximo do Sol! Um dia aqui é super quente, mas a noite é congelante. Um ano em Mercúrio dura apenas 88 dias terrestres. Sou um planeta rochoso, cheio de crateras." },
    { nome: 'Vênus', imagem: '/assets/sistemaSolar/venus.png', descricao: "Me chamam de 'gêmeo' da Terra pelo meu tamanho, mas sou o planeta mais quente de todos! Minha atmosfera é super densa e tóxica, criando um efeito estufa extremo. Eu também giro ao contrário dos outros planetas!" },
    { nome: 'Terra', imagem: '/assets/sistemaSolar/terra.png', descricao: "Nosso lar! Sou o único planeta conhecido com oceanos de água líquida, placas tectônicas e, claro, vida! Minha atmosfera nos protege da radiação solar e de pequenos meteoros." },
    { nome: 'Marte', imagem: '/assets/sistemaSolar/marte.png', descricao: "Sou conhecido como o Planeta Vermelho por causa do ferro enferrujado no meu solo. Tenho a maior montanha do Sistema Solar, o Monte Olimpo, e calotas polares de gelo, assim como a Terra." },
    { nome: 'Júpiter', imagem: '/assets/sistemaSolar/jupiter.png', descricao: "Eu sou o gigante do Sistema Solar! Sou um planeta gasoso, tão grande que todos os outros planetas caberiam dentro de mim. Aquela 'Grande Mancha Vermelha' é uma tempestade que dura séculos!" },
    { nome: 'Saturno', imagem: '/assets/sistemaSolar/saturno.png', descricao: "Sou famoso pelos meus incríveis anéis! Eles são feitos de bilhões de pedaços de gelo e rocha. Sou o segundo maior planeta, mas sou tão leve que poderia flutuar em uma piscina gigante!" },
    { nome: 'Urano', imagem: '/assets/sistemaSolar/urano.png', descricao: "Sou um gigante de gelo e tenho uma característica muito engraçada: eu giro de lado! Enquanto outros planetas giram como um pião, eu rolo pelo espaço. Também tenho anéis, mas são mais finos que os de Saturno." },
    { nome: 'Netuno', imagem: '/assets/sistemaSolar/netuno.png', descricao: "Eu sou o planeta mais distante do Sol, um mundo azul escuro, frio e com os ventos mais rápidos do Sistema Solar! Um ano aqui demora quase 165 anos terrestres para passar. Uau!" },
];

interface ManualSistemaSolarProps {
  onStartMission: () => void;
}

const ManualSistemaSolar: React.FC<ManualSistemaSolarProps> = ({ onStartMission }) => {
  const [view, setView] = useState<'planets' | 'howToPlay' | 'dangers'>('planets');
  const [slideAtual, setSlideAtual] = useState(0);

  const conteudoAtual = planetasInfo[slideAtual];
  
  const proximoSlide = () => {
    if (slideAtual < planetasInfo.length - 1) setSlideAtual(slideAtual + 1);
  };
  const slideAnterior = () => {
    if (slideAtual > 0) setSlideAtual(slideAtual - 1);
  };
  
  const renderView = () => {
    switch (view) {
      case 'planets':
        return (
          <>
            <S.SlideContainer>
              <S.PlanetaModalAnimado src={conteudoAtual.imagem} alt={conteudoAtual.nome} />
              <S.TextoSlide>
                <h2>{conteudoAtual.nome}</h2>
                <p>{conteudoAtual.descricao}</p>
              </S.TextoSlide>
            </S.SlideContainer>
            <S.NavegacaoCarrossel>
              <S.BotaoNavegacao onClick={slideAnterior} disabled={slideAtual === 0}>Voltar</S.BotaoNavegacao>
              <span>{slideAtual + 1} / {planetasInfo.length}</span>
              <S.BotaoNavegacao onClick={slideAtual === planetasInfo.length - 1 ? () => setView('howToPlay') : proximoSlide}>
                {slideAtual === planetasInfo.length - 1 ? 'Como Jogar?' : 'Próximo'}
              </S.BotaoNavegacao>
            </S.NavegacaoCarrossel>
          </>
        );
      
      case 'howToPlay':
        return (
          <S.ExplicacaoContainer>
            <S.TextoSlide><h2>Como Jogar</h2></S.TextoSlide>
            <S.SecaoExplicacao>
              <S.IconeWrapper><Gamepad2 size={32} strokeWidth={2.5} /></S.IconeWrapper>
              <S.TextoWrapper>
                <h3>Controle Simples e Intuitivo</h3>
                <p>Use as teclas <ArrowUp size={18} /> <strong>SETA PARA CIMA</strong> e <ArrowDown size={18} /> <strong>SETA PARA BAIXO</strong> para mover seu astronauta.</p>
              </S.TextoWrapper>
            </S.SecaoExplicacao>
            <S.SecaoExplicacao>
              <S.IconeWrapper><Trophy size={32} strokeWidth={2.5} /></S.IconeWrapper>
              <S.TextoWrapper>
                <h3>Missão de Coleta Ordenada</h3>
                <p>Seu objetivo é coletar os planetas na ordem certa do Sistema Solar. Cada acerto acenderá o planeta na barra superior!</p>
              </S.TextoWrapper>
            </S.SecaoExplicacao>
            <S.BotaoNavegacao style={{ margin: '30px auto 0' }} onClick={() => setView('dangers')}>
              Entendi! E os perigos?
            </S.BotaoNavegacao>
          </S.ExplicacaoContainer>
        );
        
      case 'dangers':
        return (
          <S.ExplicacaoContainer>
            <S.TextoSlide><h2>Perigos e Objetivos</h2></S.TextoSlide>
             <S.SecaoExplicacao>
              <S.IconeWrapper><Badge size={32} strokeWidth={2.5} /></S.IconeWrapper>
              <S.TextoWrapper>
                <h3>Desvie dos Meteoros</h3>
                <p>O espaço é cheio de rochas! Se você colidir com um meteoro, todo o seu progresso será perdido e a missão recomeça.</p>
              </S.TextoWrapper>
            </S.SecaoExplicacao>
            <S.SecaoExplicacao>
              <S.IconeWrapper><AlertTriangle size={32} strokeWidth={2.5} /></S.IconeWrapper>
              <S.TextoWrapper>
                <h3>Cuidado com a Sequência</h3>
                <p>A ordem é TUDO! Coletar um planeta fora da sequência correta também reinicia sua missão. Fique atento!</p>
              </S.TextoWrapper>
            </S.SecaoExplicacao>
            <br /><br />
            <S.BotaoIniciarMissao onClick={onStartMission}>COMEÇAR MISSÃO!</S.BotaoIniciarMissao>
          </S.ExplicacaoContainer>
        );
    }
  };

  return (
    <S.ModalOverlay>
      <S.ModalContent>
        {renderView()}
      </S.ModalContent>
    </S.ModalOverlay>
  );
};

export default ManualSistemaSolar;