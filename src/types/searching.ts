import { CodeLanguage } from './sorting';

export type SearchAlgorithmId = 'linear' | 'binary' | 'jump' | 'interpolation';

export interface SearchStep {
  array: number[];
  target: number;
  checking: number[];
  eliminated: number[];
  foundIndex: number | null;
  windowRange?: [number, number];
  pointers: Record<string, number>;
  narration: string;
  codeLine: number;
  checks: number;
  isDone?: boolean;
}

export interface SearchQuizQuestion {
  id: string;
  algorithmId: SearchAlgorithmId;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SearchAlgorithmMeta {
  id: SearchAlgorithmId;
  name: string;
  shortName: string;
  tagline: string;
  difficulty: 'Pemula' | 'Menengah';
  requiresSorted: boolean;
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
  codeSnippets: Record<CodeLanguage, string[]>;
}
