import React from 'react';
import * as S from './styles';

interface DesenhoProps {
  id: string;
  cores: Record<string, string>;
  parteFocada?: string | null;
  partesLimpando?: string[];
  onClickParte?: (parte: string) => void;
}

export const DesenhoCanvas: React.FC<DesenhoProps> = ({ id, cores, parteFocada, partesLimpando = [], onClickParte }) => {
  const getS = (parte: string) => ({
    fill: cores[parte] || '#FFFFFF',
    stroke: parteFocada === parte ? '#FACC15' : '#333',
    strokeWidth: parteFocada === parte ? '8px' : '2px',
    transition: 'fill 0.4s ease',
  });

  const render = (parte: string, Elemento: any, props: any) => {
    const isLimpando = partesLimpando.includes(parte);
    return (
      <Elemento 
        {...props} 
        className={isLimpando ? 'limpando' : ''} 
        style={getS(parte)} 
        onClick={() => !isLimpando && onClickParte?.(parte)} 
      />
    );
  };

  switch (id) {
    // --- FÁCIL (4-5 áreas) ---
    case 'paisagem': return (
      <S.SvgContainer viewBox="0 0 400 300">
        {render('ceu', 'rect', { x: 0, y: 0, width: 400, height: 200 })}
        {render('grama', 'rect', { x: 0, y: 200, width: 400, height: 100 })}
        {render('sol', 'circle', { cx: 330, cy: 60, r: 40 })}
        {render('montanha', 'path', { d: "M0 200 L120 50 L240 200 Z" })}
      </S.SvgContainer>
    );
    case 'peixe': return (
      <S.SvgContainer viewBox="0 0 400 300">
        {render('mar', 'rect', { x: 0, y: 0, width: 400, height: 300 })}
        {render('corpo', 'ellipse', { cx: 200, cy: 150, rx: 100, ry: 70 })}
        {render('cauda', 'path', { d: "M100 150 L30 100 L30 200 Z" })}
        {render('olho', 'circle', { cx: 250, cy: 135, r: 10 })}
      </S.SvgContainer>
    );
    case 'escudo': return (
      <S.SvgContainer viewBox="0 0 400 300">
        {render('fundo', 'rect', { x: 0, y: 0, width: 400, height: 300 })}
        {render('base', 'path', { d: "M100 50 L300 50 L300 180 Q 200 280 100 180 Z" })}
        {render('detalhe', 'path', { d: "M150 100 L250 100 L200 180 Z" })}
        {render('faixa', 'rect', { x: 100, y: 50, width: 200, height: 20 })}
      </S.SvgContainer>
    );
    // --- MÉDIO (6-7 áreas) ---
    case 'foguete': return (
      <S.SvgContainer viewBox="0 0 400 300">
        {render('espaco', 'rect', { x: 0, y: 0, width: 400, height: 300 })}
        {render('corpo', 'rect', { x: 170, y: 80, width: 60, height: 130, rx: 30 })}
        {render('bico', 'path', { d: "M170 100 L200 30 L230 100 Z" })}
        {render('asa_e', 'path', { d: "M170 160 L140 210 L170 210 Z" })}
        {render('asa_d', 'path', { d: "M230 160 L260 210 L230 210 Z" })}
        {render('fogo', 'path', { d: "M180 210 L200 270 L220 210 Z" })}
        {render('janela', 'circle', { cx: 200, cy: 130, r: 15 })}
      </S.SvgContainer>
    );
    case 'casa': return (
      <S.SvgContainer viewBox="0 0 400 300">
        {render('ceu', 'rect', { x: 0, y: 0, width: 400, height: 200 })}
        {render('chao', 'rect', { x: 0, y: 200, width: 400, height: 100 })}
        {render('parede', 'rect', { x: 100, y: 120, width: 200, height: 120 })}
        {render('telhado', 'path', { d: "M80 120 L200 40 L320 120 Z" })}
        {render('porta', 'rect', { x: 180, y: 170, width: 40, height: 70 })}
        {render('janela', 'rect', { x: 130, y: 140, width: 40, height: 40 })}
      </S.SvgContainer>
    );
    case 'barco': return (
      <S.SvgContainer viewBox="0 0 400 300">
        {render('ceu', 'rect', { x: 0, y: 0, width: 400, height: 200 })}
        {render('mar', 'rect', { x: 0, y: 200, width: 400, height: 100 })}
        {render('casco', 'path', { d: "M80 200 L120 260 L280 260 L320 200 Z" })}
        {render('mastro', 'rect', { x: 195, y: 60, width: 10, height: 140 })}
        {render('vela_d', 'path', { d: "M205 70 L290 180 L205 180 Z" })}
        {render('vela_e', 'path', { d: "M195 90 L140 180 L195 180 Z" })}
      </S.SvgContainer>
    );
    // --- DIFÍCIL (8-10 áreas) ---
    case 'robo': return (
      <S.SvgContainer viewBox="0 0 400 300">
        {render('fundo', 'rect', { x: 0, y: 0, width: 400, height: 300 })}
        {render('corpo', 'rect', { x: 150, y: 130, width: 100, height: 100, rx: 10 })}
        {render('cabeca', 'rect', { x: 170, y: 60, width: 60, height: 60, rx: 15 })}
        {render('braco_e', 'rect', { x: 110, y: 140, width: 30, height: 60, rx: 5 })}
        {render('braco_d', 'rect', { x: 260, y: 140, width: 30, height: 60, rx: 5 })}
        {render('perna_e', 'rect', { x: 165, y: 230, width: 25, height: 50 })}
        {render('perna_d', 'rect', { x: 210, y: 230, width: 25, height: 50 })}
        {render('olho_e', 'circle', { cx: 185, cy: 85, r: 8 })}
        {render('olho_d', 'circle', { cx: 215, cy: 85, r: 8 })}
        {render('antena', 'path', { d: "M200 60 L200 30" })}
      </S.SvgContainer>
    );
    case 'balao': return (
      <S.SvgContainer viewBox="0 0 400 300">
        {render('ceu', 'rect', { x: 0, y: 0, width: 400, height: 300 })}
        {render('nuvem', 'ellipse', { cx: 80, cy: 60, rx: 50, ry: 25 })}
        {render('cesta', 'rect', { x: 180, y: 230, width: 40, height: 35 })}
        {render('gomos1', 'path', { d: "M130 130 Q 130 50 200 50 Q 270 50 270 130" })}
        {render('gomos2', 'path', { d: "M270 130 Q 270 180 200 210 Q 130 180 130 130" })}
        {render('faixa', 'rect', { x: 130, y: 120, width: 140, height: 20 })}
        {render('sol', 'circle', { cx: 340, cy: 50, r: 30 })}
        {render('corda_e', 'path', { d: "M180 230 L150 180" })}
        {render('corda_d', 'path', { d: "M220 230 L250 180" })}
      </S.SvgContainer>
    );
    case 'carro': return (
      <S.SvgContainer viewBox="0 0 400 300">
        {render('ceu', 'rect', { x: 0, y: 0, width: 400, height: 180 })}
        {render('estrada', 'rect', { x: 0, y: 180, width: 400, height: 120 })}
        {render('corpo', 'rect', { x: 50, y: 160, width: 300, height: 70, rx: 20 })}
        {render('teto', 'path', { d: "M100 160 L140 100 L260 100 L300 160 Z" })}
        {render('janela_e', 'path', { d: "M145 150 L170 115 L200 115 L200 150 Z" })}
        {render('janela_d', 'path', { d: "M205 115 L235 115 L255 150 L205 150 Z" })}
        {render('roda_e', 'circle', { cx: 110, cy: 230, r: 35 })}
        {render('roda_d', 'circle', { cx: 290, cy: 230, r: 35 })}
        {render('calota_e', 'circle', { cx: 110, cy: 230, r: 15 })}
        {render('calota_d', 'circle', { cx: 290, cy: 230, r: 15 })}
      </S.SvgContainer>
    );
    default: return null;
  }
};