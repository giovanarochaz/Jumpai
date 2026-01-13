export type EstadoJogo = 'manual' | 'jogando' | 'vitoria' | 'derrota';

export type VelocidadeGeracao = 'lenta' | 'normal' | 'rapida';
export type DificuldadeJogo = 'facil' | 'medio' | 'dificil';

export interface ConfiguracoesJogo {
  dificuldade: DificuldadeJogo;
  penalidade: boolean;
  sons: boolean;
}

export interface BaseManualProps<T> {
  aoIniciar: (configuracoes: T) => void;
}

export interface Planeta {
  nome: string;
  imagem: string;
  descricao: string;
}

export interface PlanetaBase {
  nome: string;
  imagem: string;
  descricao?: string;
}

export interface EstadoPlaneta {
  id: number;
  nome: string;
  imagem: string;
  top: number;
  duracao: number;
  tamanho: number;
}

export interface Jogos {
  aoVencer: () => void;
  aoPerder: () => void;
  configuracoes: ConfiguracoesJogo;
}

export interface PosicaoFaisca {
  top: number;
  left: number;
}