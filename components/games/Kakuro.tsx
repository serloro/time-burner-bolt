import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';

interface KakuroProps {
  onComplete: () => void;
  isPaused: boolean;
}

// Board dimensions
const BOARD_SIZE = 6; // 6x6 board
const CELL_SIZE = Math.min(45, (Dimensions.get('window').width - 40) / BOARD_SIZE);

// Cell types
type CellType = 'black' | 'white';

// Clue type
type Clue = {
  down?: number;
  right?: number;
};

// Board cell structure
type BoardCell = {
  type: CellType;
  clue?: Clue;
  value?: number;
};

export default function Kakuro({ onComplete, isPaused }: KakuroProps) {
  const [board, setBoard] = useState<BoardCell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  
  useEffect(() => {
    initializeBoard();
  }, []);
  
  const initializeBoard = () => {
    // Create a simple Kakuro puzzle
    // This is a predefined puzzle for demonstration
    const newBoard: BoardCell[][] = [
      [
        { type: 'black' },
        { type: 'black', clue: { down: 16 } },
        { type: 'black', clue: { down: 24 } },
        { type: 'black', clue: { down: 17 } },
        { type: 'black' },
        { type: 'black' },
      ],
      [
        { type: 'black', clue: { right: 16 } },
        { type: 'white', value: undefined },
        { type: 'white', value: undefined },
        { type: 'white', value: undefined },
        { type: 'black', clue: { down: 29 } },
        { type: 'black' },
      ],
      [
        { type: 'black', clue: { right: 17 } },
        { type: 'white', value: undefined },
        { type: 'white', value: undefined },
        { type: 'white', value: undefined },
        { type: 'white', value: undefined },
        { type: 'black' },
      ],
      [
        { type: 'black', clue: { right: 35 } },
        { type: 'white', value: undefined },
        { type: 'white', value: undefined },
        { type: 'white', value: undefined },
        { type: 'white', value: undefined },
        { type: 'black', clue: { down: 12 } },
      ],
      [
        { type: 'black' },
        { type: 'black', clue: { right: 7 } },
        { type: 'white', value: undefined },
        { type: 'white', value: undefined },
        { type: 'black' },
        { type: 'white', value: undefined },
      ],
      [
        { type: 'black' },
        { type: 'black' },
        { type: 'black', clue: { right: 8 } },
        { type: 'white', value: undefined },
        { type: 'white', value: undefined },
        { type: 'white', value: undefined },
      ],
    ];
    
    setBoard(newBoard);
    setSelectedCell(null);
  };
  
  const handleCellPress = (row: number, col: number) => {
    if (isPaused) return;
    
    if (board[row][col].type === 'white') {
      setSelectedCell({ row, col });
    }
  };
  
  const handleInputChange = (value: string) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    
    // Allow empty input or numbers 1-9
    if (value === '' || (value >= '1' && value <= '9')) {
      const newBoard = [...board];
      newBoard[row][col].value = value === '' ? undefined : parseInt(value);
      setBoard(newBoard);
      
      // Check if the puzzle is complete and correct
      if (isPuzzleComplete(newBoard) && isPuzzleCorrect(newBoard)) {
        onComplete();
      }
    }
  };
  
  const isPuzzleComplete = (board: BoardCell[][]): boolean => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col].type === 'white' && board[row][col].value === undefined) {
          return false;
        }
      }
    }
    return true;
  };
  
  const isPuzzleCorrect = (board: BoardCell[][]): boolean => {
    // Check all row sums
    for (let row = 0; row < BOARD_SIZE; row++) {
      let col = 0;
      while (col < BOARD_SIZE) {
        if (board[row][col].type === 'black' && board[row][col].clue?.right) {
          const targetSum = board[row][col].clue.right;
          let actualSum = 0;
          let startCol = col + 1;
          
          // Sum all white cells in this run
          while (startCol < BOARD_SIZE && board[row][startCol].type === 'white') {
            actualSum += board[row][startCol].value || 0;
            startCol++;
          }
          
          if (actualSum !== targetSum) {
            return false;
          }
          
          col = startCol;
        } else {
          col++;
        }
      }
    }
    
    // Check all column sums
    for (let col = 0; col < BOARD_SIZE; col++) {
      let row = 0;
      while (row < BOARD_SIZE) {
        if (board[row][col].type === 'black' && board[row][col].clue?.down) {
          const targetSum = board[row][col].clue.down;
          let actualSum = 0;
          let startRow = row + 1;
          
          // Sum all white cells in this run
          while (startRow < BOARD_SIZE && board[startRow][col].type === 'white') {
            actualSum += board[startRow][col].value || 0;
            startRow++;
          }
          
          if (actualSum !== targetSum) {
            return false;
          }
          
          row = startRow;
        } else {
          row++;
        }
      }
    }
    
    return true;
  };

  if (board.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Setting up Kakuro puzzle...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kakuro</Text>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.boardContainer}>
          {board.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((cell, colIndex) => (
                <TouchableOpacity
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={[
                    styles.cell,
                    cell.type === 'black' ? styles.blackCell : styles.whiteCell,
                    selectedCell?.row === rowIndex && selectedCell?.col === colIndex && styles.selectedCell,
                  ]}
                  onPress={() => handleCellPress(rowIndex, colIndex)}
                  activeOpacity={cell.type === 'white' ? 0.6 : 1}
                >
                  {cell.type === 'black' && cell.clue && (
                    <View style={styles.clueContainer}>
                      {cell.clue.down !== undefined && (
                        <Text style={styles.downClue}>{cell.clue.down}</Text>
                      )}
                      {cell.clue.right !== undefined && (
                        <Text style={styles.rightClue}>{cell.clue.right}</Text>
                      )}
                    </View>
                  )}
                  
                  {cell.type === 'white' && (
                    <Text style={styles.cellValue}>
                      {cell.value !== undefined ? cell.value : ''}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
        
        {selectedCell && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter a number (1-9):</Text>
            <View style={styles.numberPad}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <TouchableOpacity
                  key={`num-${num}`}
                  style={styles.numberButton}
                  onPress={() => handleInputChange(num.toString())}
                >
                  <Text style={styles.numberButtonText}>{num}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.numberButton, styles.clearButton]}
                onPress={() => handleInputChange('')}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>How to Play:</Text>
          <Text style={styles.instructionText}>
            Fill in the white cells with numbers 1-9 so that the sum of numbers in each row equals the right clue,
            and the sum of numbers in each column equals the down clue. No number can be used more than once in a single sum.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    padding: 15,
  },
  scrollView: {
    width: '100%',
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
    marginBottom: 15,
  },
  boardContainer: {
    backgroundColor: '#fff',
    padding: 8,
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
    borderWidth: 1,
    borderColor: '#ccc',
  },
  blackCell: {
    backgroundColor: '#333',
  },
  whiteCell: {
    backgroundColor: '#fff',
  },
  selectedCell: {
    backgroundColor: COLORS.primaryLight,
  },
  clueContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  downClue: {
    position: 'absolute',
    top: 2,
    right: 2,
    fontSize: 10,
    color: '#fff',
    fontFamily: 'Inter-Medium',
  },
  rightClue: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    fontSize: 10,
    color: '#fff',
    fontFamily: 'Inter-Medium',
  },
  cellValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.text,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 10,
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 240,
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
  numberButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.text,
  },
  clearButton: {
    width: 110,
    backgroundColor: '#f0f0f0',
  },
  clearButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.text,
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
});