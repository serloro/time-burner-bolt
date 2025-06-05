import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS } from '@/constants/colors';

interface LightsOutProps {
  onComplete: () => void;
  isPaused: boolean;
}

// Board size
const GRID_SIZE = 5;
const CELL_SIZE = Math.min(50, (Dimensions.get('window').width - 40) / GRID_SIZE);

export default function LightsOut({ onComplete, isPaused }: LightsOutProps) {
  const [board, setBoard] = useState<boolean[][]>([]);
  const [moves, setMoves] = useState(0);
  
  useEffect(() => {
    initializeBoard();
  }, []);
  
  const initializeBoard = () => {
    // Create an empty board
    const emptyBoard: boolean[][] = Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(false)
    );
    
    // Start with a solved board (all lights off)
    // Make random moves to create a solvable puzzle
    const moves = 20; // Number of random moves to make
    let newBoard = [...emptyBoard];
    
    for (let i = 0; i < moves; i++) {
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      
      // Toggle this cell and adjacent cells
      newBoard = toggleLights(newBoard, row, col);
    }
    
    setBoard(newBoard);
    setMoves(0);
  };
  
  const toggleLights = (board: boolean[][], row: number, col: number): boolean[][] => {
    const newBoard = [...board.map(row => [...row])];
    
    // Toggle the clicked cell
    newBoard[row][col] = !newBoard[row][col];
    
    // Toggle adjacent cells
    if (row > 0) newBoard[row - 1][col] = !newBoard[row - 1][col]; // Up
    if (row < GRID_SIZE - 1) newBoard[row + 1][col] = !newBoard[row + 1][col]; // Down
    if (col > 0) newBoard[row][col - 1] = !newBoard[row][col - 1]; // Left
    if (col < GRID_SIZE - 1) newBoard[row][col + 1] = !newBoard[row][col + 1]; // Right
    
    return newBoard;
  };
  
  const handleCellPress = (row: number, col: number) => {
    if (isPaused) return;
    
    const newBoard = toggleLights(board, row, col);
    setBoard(newBoard);
    setMoves(moves + 1);
    
    // Check if all lights are off
    if (isComplete(newBoard)) {
      onComplete();
    }
  };
  
  const isComplete = (board: boolean[][]): boolean => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (board[row][col]) return false;
      }
    }
    return true;
  };

  if (board.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Setting up Lights Out puzzle...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lights Out</Text>
      
      <View style={styles.gameInfo}>
        <Text style={styles.movesText}>Moves: {moves}</Text>
      </View>
      
      <View style={styles.boardContainer}>
        {board.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((isOn, colIndex) => (
              <TouchableOpacity
                key={`cell-${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  isOn ? styles.lightOn : styles.lightOff
                ]}
                onPress={() => handleCellPress(rowIndex, colIndex)}
              />
            ))}
          </View>
        ))}
      </View>
      
      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>Goal:</Text>
        <Text style={styles.instructionText}>
          Turn all the lights off by tapping cells.
          Each tap toggles the tapped cell and its adjacent cells.
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.resetButton}
        onPress={initializeBoard}
      >
        <Text style={styles.resetButtonText}>New Puzzle</Text>
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
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    margin: 4,
    borderRadius: 4,
  },
  lightOn: {
    backgroundColor: COLORS.warning,
    shadowColor: COLORS.warning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  lightOff: {
    backgroundColor: '#555',
  },
  instructions: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    width: '100%',
  },
  instructionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 5,
  },
  instructionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
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