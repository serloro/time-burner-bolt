import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Flag } from 'lucide-react-native';

interface MinesweeperProps {
  onComplete: () => void;
  isPaused: boolean;
}

// Board size (adjust for different difficulties)
const BOARD_SIZE = 8;
const MINES_COUNT = 10;
const CELL_SIZE = Math.min(35, (Dimensions.get('window').width - 40) / BOARD_SIZE);

type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

export default function Minesweeper({ onComplete, isPaused }: MinesweeperProps) {
  const [board, setBoard] = useState<CellState[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [flagMode, setFlagMode] = useState(false);
  const [minesLeft, setMinesLeft] = useState(MINES_COUNT);
  
  useEffect(() => {
    initializeBoard();
  }, []);
  
  const initializeBoard = () => {
    // Create an empty board
    const newBoard: CellState[][] = Array(BOARD_SIZE).fill(null).map(() => 
      Array(BOARD_SIZE).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      }))
    );
    
    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < MINES_COUNT) {
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);
      
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }
    
    // Calculate adjacent mines for each cell
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!newBoard[row][col].isMine) {
          newBoard[row][col].adjacentMines = countAdjacentMines(newBoard, row, col);
        }
      }
    }
    
    setBoard(newBoard);
    setGameOver(false);
    setMinesLeft(MINES_COUNT);
  };
  
  const countAdjacentMines = (board: CellState[][], row: number, col: number): number => {
    let count = 0;
    
    for (let r = Math.max(0, row - 1); r <= Math.min(BOARD_SIZE - 1, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(BOARD_SIZE - 1, col + 1); c++) {
        if (r === row && c === col) continue;
        if (board[r][c].isMine) count++;
      }
    }
    
    return count;
  };
  
  const handleCellPress = (row: number, col: number) => {
    if (isPaused || gameOver || board[row][col].isRevealed) return;
    
    const newBoard = [...board];
    
    if (flagMode) {
      // Toggle flag
      if (!newBoard[row][col].isRevealed) {
        newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
        setMinesLeft(prev => newBoard[row][col].isFlagged ? prev - 1 : prev + 1);
      }
    } else {
      // Reveal cell
      if (newBoard[row][col].isFlagged) return;
      
      if (newBoard[row][col].isMine) {
        // Game over
        revealAllMines(newBoard);
        setGameOver(true);
        return;
      }
      
      // Reveal the cell and potentially adjacent cells
      revealCell(newBoard, row, col);
    }
    
    setBoard(newBoard);
    
    // Check if all non-mine cells are revealed (win condition)
    if (checkWinCondition(newBoard)) {
      setGameOver(true);
      onComplete();
    }
  };
  
  const revealCell = (board: CellState[][], row: number, col: number) => {
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return;
    if (board[row][col].isRevealed || board[row][col].isFlagged) return;
    
    board[row][col].isRevealed = true;
    
    // If this cell has no adjacent mines, reveal all adjacent cells
    if (board[row][col].adjacentMines === 0) {
      for (let r = Math.max(0, row - 1); r <= Math.min(BOARD_SIZE - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(BOARD_SIZE - 1, col + 1); c++) {
          if (r === row && c === col) continue;
          revealCell(board, r, c);
        }
      }
    }
  };
  
  const revealAllMines = (board: CellState[][]) => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col].isMine) {
          board[row][col].isRevealed = true;
        }
      }
    }
  };
  
  const checkWinCondition = (board: CellState[][]): boolean => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!board[row][col].isMine && !board[row][col].isRevealed) {
          return false;
        }
      }
    }
    return true;
  };
  
  const getCellColor = (cell: CellState): string => {
    if (cell.isRevealed) {
      if (cell.isMine) {
        return COLORS.error;
      }
      return '#fff';
    }
    return '#ccc';
  };
  
  const getCellTextColor = (count: number): string => {
    switch (count) {
      case 1: return '#0000FF'; // blue
      case 2: return '#008000'; // green
      case 3: return '#FF0000'; // red
      case 4: return '#000080'; // navy
      case 5: return '#800000'; // maroon
      case 6: return '#008080'; // teal
      case 7: return '#000000'; // black
      case 8: return '#808080'; // gray
      default: return '#000000';
    }
  };

  if (board.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Setting up Minesweeper...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minesweeper</Text>
      
      <View style={styles.gameInfo}>
        <View style={styles.mineCounter}>
          <Flag size={18} color={COLORS.error} />
          <Text style={styles.mineCountText}>{minesLeft}</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.flagToggle, flagMode && styles.flagToggleActive]}
          onPress={() => setFlagMode(!flagMode)}
        >
          <Flag size={20} color={flagMode ? '#fff' : COLORS.text} />
          <Text style={[styles.flagToggleText, flagMode && styles.flagToggleTextActive]}>
            {flagMode ? 'Flag Mode' : 'Dig Mode'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.boardContainer}>
        {board.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={`cell-${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  { 
                    backgroundColor: getCellColor(cell),
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                  },
                  cell.isRevealed && styles.revealedCell
                ]}
                onPress={() => handleCellPress(rowIndex, colIndex)}
                disabled={gameOver}
              >
                {cell.isFlagged && !cell.isRevealed && (
                  <Flag size={CELL_SIZE * 0.6} color={COLORS.error} />
                )}
                
                {cell.isRevealed && cell.isMine && (
                  <View style={styles.mine} />
                )}
                
                {cell.isRevealed && !cell.isMine && cell.adjacentMines > 0 && (
                  <Text 
                    style={[
                      styles.cellText, 
                      { color: getCellTextColor(cell.adjacentMines) }
                    ]}
                  >
                    {cell.adjacentMines}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      
      {gameOver && (
        <TouchableOpacity 
          style={styles.restartButton}
          onPress={initializeBoard}
        >
          <Text style={styles.restartButtonText}>New Game</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.text,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 20,
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  mineCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  mineCountText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 5,
  },
  flagToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  flagToggleActive: {
    backgroundColor: COLORS.primary,
  },
  flagToggleText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 5,
  },
  flagToggleTextActive: {
    color: '#fff',
  },
  boardContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
  },
  revealedCell: {
    borderColor: '#ddd',
  },
  cellText: {
    fontFamily: 'Inter-Bold',
    fontSize: CELL_SIZE * 0.6,
  },
  mine: {
    width: CELL_SIZE * 0.6,
    height: CELL_SIZE * 0.6,
    borderRadius: CELL_SIZE * 0.3,
    backgroundColor: '#000',
  },
  restartButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  restartButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#fff',
  },
});