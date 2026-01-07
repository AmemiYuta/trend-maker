export interface VideoStructure {
  time: string;
  label: string;
  content: string;
  memo?: string;
}

export interface Idea {
  id: number;
  title: string;
  tags: string[];
  difficulty: string;
  time: string;
  reason: string;
  structure: VideoStructure[];
}