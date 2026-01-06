export type EstadoJogo = 'manual' | 'jogando' | 'vitoria' | 'derrota';

export type VelocidadeGeracao = 'lenta' | 'normal' | 'rapida';

export interface ConfiguracoesJogo {
  velocidade: VelocidadeGeracao;
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
