export type AlgorithmId =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'merge'
  | 'quick'
  | 'heap';

export type PresetType = 'random' | 'nearly-sorted' | 'reversed' | 'few-unique';

export type AppMode = 'learn' | 'race' | 'quiz';

export interface ArrayElement {
  id: string;
  value: number;
}

export interface SortStep {
  array: ArrayElement[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  pivot?: number;
  range?: [number, number];
  pointers: Record<string, number>;
  narration: string;
  codeLine: number;
  comparisons: number;
  swaps: number;
  isDone?: boolean;
}

export interface QuizQuestion {
  id: string;
  algorithmId: AlgorithmId;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AlgorithmMeta {
  id: AlgorithmId;
  name: string;
  shortName: string;
  tagline: string;
  difficulty: 'Pemula' | 'Menengah';
  accentColor: string;
  analogyTitle: string;
  analogyDesc: string;
  howItWorks: string[];
  whenToUse: string;
  pros: string[];
  cons: string[];
  complexity: {
    best: string;
    average: string;
    worst: string;
    space: string;
  };
  stable: boolean;
  pseudocode: string[];
}
