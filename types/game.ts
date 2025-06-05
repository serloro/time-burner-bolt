export type GameType = {
  id: string;
  name: string;
  description: string;
  color: string;
  difficultyLevels: string[];
  selected?: boolean;
  timeAllocation?: number;
  completed?: boolean;
};