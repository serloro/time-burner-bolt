import { GameType } from '@/types/game';

export const GAMES: GameType[] = [
  {
    id: 'sudoku',
    name: 'Sudoku',
    description: 'Fill a 9×9 grid with digits so that each column, row, and 3×3 section contain the digits 1-9.',
    color: '#4a6fd8', // primary blue
    difficultyLevels: ['easy', 'medium', 'hard'],
  },
  {
    id: 'maze',
    name: 'Maze',
    description: 'Navigate through a labyrinth from the start point to the end goal.',
    color: '#7248df', // purple
    difficultyLevels: ['easy', 'medium', 'hard'],
  },
  {
    id: 'minesweeper',
    name: 'Minesweeper',
    description: 'Clear the board without detonating any hidden mines.',
    color: '#f44336', // red
    difficultyLevels: ['easy', 'medium', 'hard'],
  },
  {
    id: 'picross',
    name: 'Picross',
    description: 'Reveal a hidden picture by following number clues for each row and column.',
    color: '#2e97a7', // teal
    difficultyLevels: ['easy', 'medium', 'hard'],
  },
  {
    id: 'sliding_puzzle',
    name: 'Sliding Puzzle',
    description: 'Arrange the scrambled tiles in order by sliding them into the empty space.',
    color: '#ff9142', // orange
    difficultyLevels: ['easy', 'medium', 'hard'],
  },
  {
    id: 'lights_out',
    name: 'Lights Out',
    description: 'Turn all the lights off by toggling them and their adjacent lights.',
    color: '#ff9800', // amber
    difficultyLevels: ['easy', 'medium', 'hard'],
  },
  {
    id: 'kakuro',
    name: 'Kakuro',
    description: 'Fill in the grid so that each row and column sum to the given clues.',
    color: '#4caf50', // green
    difficultyLevels: ['easy', 'medium', 'hard'],
  },
];