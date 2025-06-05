import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS } from '@/constants/colors';

interface SlidingPuzzleProps {
  onComplete: () => void;
  isPaused: boolean;
}

// Board size (4x4 for classic 15-puzzle)
const GRID_SIZE = 4;
const CELL_SIZE = Math.min(70, (Dimensions.get('window').width - 40) / GRID_SIZE);

export default function SlidingPuzzle({ onComplete, isPaused }: SlidingPuzzleProps) {
  const [board, setBoard] = useState<number[][]>([]);
  const [emptyCell, setEmptyCell] = useState<{ row: number; col: number }>({ row: GRID_SIZE - 1, col: GRID_SIZE - 1 });
  const [moves, setMoves] = useState(0);
  
  useEffect(() => {
    initializeBoard();
  }, []);
  
  const initializeBoard = () => {
    // Create a solved board first
    const solvedBoard: number[][] = [];
    let value = 1;
    
    for (let row = 0; row < GRID_SIZE; row++) {
      const newRow: number[] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        if (row === GRID_SIZE - 1 && col === GRID_SIZE - 1) {
          // Last cell is empty (represented by 0)
          newRow.push(0);
        } else {
          newRow.push(value++);
        }
      }
      solvedBoard.push(newRow);
    }
    
    // Shuffle the board
    const shuffledBoard = shuffleBoard([...solvedBoard]);
    
    setBoard(shuffledBoard);
    setMoves(0);
    
    // Find the empty cell
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (shuffledBoard[row][col] === 0) {
          setEmptyCell({ row, col });
          break;
        }
      }
    }
  };
  
  const shuffleBoard = (board: number[][]): number[][] => {
    // Make random moves to shuffle the board
    const moves = 100; // Number of random moves to make
    let currentRow = GRID_SIZE - 1;
    let currentCol = GRID_SIZE - 1;
    
    for (let i = 0; i < moves; i++) {
      const possibleMoves = [];
      
      // Check which moves are possible
      if (currentRow > 0) possibleMoves.push('up');
      if (currentRow < GRID_SIZE - 1) possibleMoves.push('down');
      if (currentCol > 0) possibleMoves.push('left');
      if (currentCol < GRID_SIZE - 1) possibleMoves.push('right');
      
      // Pick a random move
      const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      
      // Make the move
      let newRow = currentRow;
      let newCol = currentCol;
      
      switch (move) {
        case 'up':
          newRow = currentRow - 1;
          break;
        case 'down':
          newRow = currentRow + 1;
          break;
        case 'left':
          newCol = currentCol - 1;
          break;
        case 'right':
          newCol = currentCol + 1;
          break;
      }
      
      // Swap the empty cell with the adjacent cell
      board[currentRow][currentCol] = board[newRow][newCol];
      board[newRow][newCol] = 0;
      
      // Update current position
      currentRow = newRow;
      currentCol = newCol;
    }
    
    return board;
  };
  
  const handleCellPress = (row: number, col: number) => {
    if (isPaused) return;
    
    // Check if the pressed cell is adjacent to the empty cell
    if ((Math.abs(row - emptyCell.row) === 1 && col === emptyCell.col) ||
        (Math.abs(col - emptyCell.col) === 1 && row === emptyCell.row)) {
      
      // Swap the cells
      const newBoard = [...board];
      newBoard[emptyCell.row][emptyCell.col] = newBoard[row][col];
      newBoard[row][col] = 0;
      
      setBoard(newBoard);
      setEmptyCell({ row, col });
      setMoves(moves + 1);
      
      // Check if the puzzle is solved
      if (isSolved(newBoard)) {
        onComplete();
      }
    }
  };
  
  const isSolved = (board: number[][]): boolean => {
    let value = 1;
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (row === GRID_SIZE - 1 && col === GRID_SIZE - 1) {
          // Last cell should be empty
          if (board[row][col] !== 0) return false;
        } else {
          if (board[row][col] !== value++) return false;
        }
      }
    }
    
    return true;
  };
  
  const getCellColor = (value: number): string => {
    if (value === 0) return 'transparent';
    return COLORS.primary;
  };

  if (board.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Setting up Sliding Puzzle...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sliding Puzzle</Text>
      
      <View style={styles.gameInfo}>
        <Text style={styles.movesText}>Moves: {moves}</Text>
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
                  },
                  cell === 0 && styles.emptyCell
                ]}
                onPress={() => handleCellPress(rowIndex, colIndex)}
                disabled={cell === 0}
              >
                {cell !== 0 && (
                  <Text style={styles.cellText}>{cell}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.resetButton}
        onPress={initializeBoard}
      >
        <Text style={styles.resetButtonText}>New Game</Text>
      </TouchableOpacity>
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
    marginBottom: 15,
  },
  gameInfo: {
    marginBottom: 20,
  },
  movesText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.text,
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
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyCell: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  cellText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
  },
  resetButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  resetButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#fff',
  },
});