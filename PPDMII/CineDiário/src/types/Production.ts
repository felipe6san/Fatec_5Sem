export type ProductionType = 'filme' | 'série';

export interface Production {
  id: string;
  titulo: string;
  anoLancamento: number;
  genero: string;
  tipo: ProductionType;
  minhaNotas: number; // 0-10
  ondeAssistiu: string; // Netflix, Cinema, etc
  posterUrl?: string;
  resumo?: string;
  dateCriacao?: string;
  dataAtualizacao?: string;
}
