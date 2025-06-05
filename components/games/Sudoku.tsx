import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '@/constants/colors';

interface SudokuProps {
  onComplete: () => void;
  isPaused: boolean;
}

export default function Sudoku({ onComplete, isPaused }: SudokuProps) {
  const [board, setBoard] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    // Generate a new Sudoku puzzle when component mounts
    const { puzzle, solution } = generateSudoku();
    setBoard(puzzle);
    setSolution(solution);
  }, []);
  
  const generateSudoku = () => {
    // Generate a valid Sudoku puzzle
    // This is a simplified version - in a real app, you'd use a more sophisticated algorithm
    
    // Create an empty 9x9 grid
    const emptyGrid = Array(9).fill(0).map(() => Array(9).fill(0));
    
    // Solve the empty grid to get a full solution
    const solvedGrid = solveSudoku([...emptyGrid]);
    
    // Create a puzzle by removing some numbers from the solution
    const puzzle = createPuzzle(solvedGrid);
    
    return { puzzle, solution: solvedGrid };
  };
  
  const solveSudoku = (grid: number[][]) => {
    // A very simple solver for demonstration
    // In a real app, you'd use a more efficient backtracking algorithm
    
    // For now, just return a pre-filled valid Sudoku
    return [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];
  };
  
  const createPuzzle = (solvedGrid: number[][]) => {
    // Create a copy of the solved grid
    const puzzle = solvedGrid.map(row => [...row]);
    
    // Remove some numbers to create the puzzle
    // In a real app, you'd ensure the puzzle has a unique solution
    const cellsToRemove = 40; // Adjust difficulty by changing this number
    
    let count = 0;
    while (count < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
        count++;
      }
    }
    
    return puzzle;
  };
  
  const handleCellPress = (row: number, col: number) => {
    if (board[row][col] === 0 || !isOriginalCell(row, col)) {
      setSelectedCell({ row, col });
    }
  };
  
  const handleNumberPress = (number: number) => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      
      // Update the board
      const newBoard = [...board];
      newBoard[row][col] = number;
      setBoard(newBoard);
      
      // Check if the puzzle is complete
      checkCompletion(newBoard);
    }
  };
  
  const isOriginalCell = (row: number, col: number): boolean => {
    // Original cells are those that were provided in the initial puzzle
    // For this demo, we'll just check if the value is non-zero in the initial board
    return board[row][col] !== 0 && board[row][col] === solution[row][col];
  };
  
  const checkCompletion = (currentBoard: number[][]) => {
    // Check if the current board matches the solution
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (currentBoard[row][col] !== solution[row][col]) {
          return;
        }
      }
    }
    
    // If we get here, the puzzle is complete
    setIsComplete(true);
    onComplete();
  };
  
  const isCellValid = (row: number, col: number): boolean => {
    return board[row][col] === solution[row][col];
  };

  if (board.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Sudoku puzzle...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sudoku</Text>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.boardContainer}>
          <View style={styles.board}>
            {board.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.row}>
                {row.map((cell, colIndex) => (
                  <TouchableOpacity
                    key={`cell-${rowIndex}-${colIndex}`}
                    style={[
                      styles.cell,
                      (rowIndex === 2 || rowIndex === 5) && styles.bottomBorder,
                      (colIndex === 2 || colIndex === 5) && styles.rightBorder,
                      selectedCell?.row === rowIndex && selectedCell?.col === colIndex && styles.selectedCell,
                      isOriginalCell(rowIndex, colIndex) && styles.originalCell,
                      cell !== 0 && !isCellValid(rowIndex, colIndex) && styles.invalidCell,
                    ]}
                    onPress={() => handleCellPress(rowIndex, colIndex)}
                  >
                    <Text 
                      style={[
                        styles.cellText,
                        isOriginalCell(rowIndex, colIndex) && styles.originalCellText,
                        cell !== 0 && !isCellValid(rowIndex, colIndex) && styles.invalidCellText,
                      ]}
                    >
                      {cell !== 0 ? cell : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.numbersContainer}>
          <View style={styles.numbersRow}>
            {[1, 2, 3, 4, 5].map(number => (
              <TouchableOpacity
                key={`number-${number}`}
                style={styles.numberButton}
                onPress={() => handleNumberPress(number)}
              >
                <Text style={styles.numberText}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.numbersRow}>
            {[6, 7, 8, 9, 0].map(number => (
              <TouchableOpacity
                key={`number-${number}`}
                style={styles.numberButton}
                onPress={() => handleNumberPress(number === 0 ? 0 : number)}
              >
                <Text style={styles.numberText}>{number === 0 ? 'Clear' : number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
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
  boardContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  board: {
    borderWidth: 2,
    borderColor: COLORS.text,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  bottomBorder: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.text,
  },
  rightBorder: {
    borderRightWidth: 2,
    borderRightColor: COLORS.text,
  },
  selectedCell: {
    backgroundColor: COLORS.primaryLight,
  },
  originalCell: {
    backgroundColor: '#f0f0f0',
  },
  invalidCell: {
    backgroundColor: COLORS.error + '20',
  },
  cellText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: COLORS.primary,
  },
  originalCellText: {
    fontFamily: 'Inter-Bold',
    color: COLORS.text,
  },
  invalidCellText: {
    color: COLORS.error,
  },
  numbersContainer: {
    marginTop: 20,
    width: '100%',
  },
  numbersRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  numberButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  numberText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: COLORS.text,
  },
});