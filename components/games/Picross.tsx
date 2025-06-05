import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS } from '@/constants/colors';
import { X } from 'lucide-react-native';

interface PicrossProps {
  onComplete: () => void;
  isPaused: boolean;
}

// Board size (adjust for different difficulties)
const BOARD_SIZE = 5;
const CELL_SIZE = Math.min(40, (Dimensions.get('window').width - 80) / BOARD_SIZE);

export default function Picross({ onComplete, isPaused }: PicrossProps) {
  const [solution, setSolution] = useState<boolean[][]>([]);
  const [playerBoard, setPlayerBoard] = useState<('filled' | 'crossed' | 'empty')[][]>([]);
  const [rowHints, setRowHints] = useState<number[][]>([]);
  const [colHints, setColHints] = useState<number[][]>([]);
  const [markMode, setMarkMode] = useState<'fill' | 'cross'>('fill');
  
  useEffect(() => {
    generatePuzzle();
  }, []);
  
  const generatePuzzle = () => {
    // Generate a random solution
    // For simplicity, we'll use a pre-defined pattern
    const patterns = [
      [
        [1, 1, 1, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 0, 0],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0],
      ],
      [
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [1, 0, 0, 0, 1],
      ],
      [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
      ],
    ];
    
    // Select a random pattern
    const randomIndex = Math.floor(Math.random() * patterns.length);
    const selectedPattern = patterns[randomIndex];
    
    // Convert to boolean grid
    const booleanGrid = selectedPattern.map(row => 
      row.map(cell => cell === 1)
    );
    
    setSolution(booleanGrid);
    
    // Initialize player board as all empty
    const emptyBoard: ('filled' | 'crossed' | 'empty')[][] = Array(BOARD_SIZE).fill(null).map(() => 
      Array(BOARD_SIZE).fill('empty')
    );
    
    setPlayerBoard(emptyBoard);
    
    // Calculate row hints
    const rowH = booleanGrid.map(row => {
      const hints = [];
      let count = 0;
      
      for (let i = 0; i < row.length; i++) {
        if (row[i]) {
          count++;
        } else if (count > 0) {
          hints.push(count);
          count = 0;
        }
      }
      
      if (count > 0) {
        hints.push(count);
      }
      
      return hints.length > 0 ? hints : [0];
    });
    
    setRowHints(rowH);
    
    // Calculate column hints
    const colH = Array(BOARD_SIZE).fill(null).map((_, colIndex) => {
      const hints = [];
      let count = 0;
      
      for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex++) {
        if (booleanGrid[rowIndex][colIndex]) {
          count++;
        } else if (count > 0) {
          hints.push(count);
          count = 0;
        }
      }
      
      if (count > 0) {
        hints.push(count);
      }
      
      return hints.length > 0 ? hints : [0];
    });
    
    setColHints(colH);
  };
  
  const handleCellPress = (row: number, col: number) => {
    if (isPaused) return;
    
    const newBoard = [...playerBoard];
    
    if (markMode === 'fill') {
      newBoard[row][col] = newBoard[row][col] === 'filled' ? 'empty' : 'filled';
    } else {
      newBoard[row][col] = newBoard[row][col] === 'crossed' ? 'empty' : 'crossed';
    }
    
    setPlayerBoard(newBoard);
    
    // Check if the puzzle is solved
    checkSolution(newBoard);
  };
  
  const checkSolution = (board: ('filled' | 'crossed' | 'empty')[][]) => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        // If a cell should be filled but isn't, or vice versa
        if ((solution[row][col] && board[row][col] !== 'filled') ||
            (!solution[row][col] && board[row][col] === 'filled')) {
          return;
        }
      }
    }
    
    // If we get here, the puzzle is solved
    onComplete();
  };

  if (solution.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Generating Picross puzzle...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Picross</Text>
      
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeButton, markMode === 'fill' && styles.modeButtonActive]}
          onPress={() => setMarkMode('fill')}
        >
          <View style={styles.fillIcon} />
          <Text style={styles.modeButtonText}>Fill</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.modeButton, markMode === 'cross' && styles.modeButtonActive]}
          onPress={() => setMarkMode('cross')}
        >
          <X size={20} color={markMode === 'cross' ? '#fff' : COLORS.text} />
          <Text style={styles.modeButtonText}>Mark</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.boardContainer}>
        {/* Column hints */}
        <View style={styles.columnHints}>
          <View style={styles.emptyCorner} />
          {colHints.map((hints, colIndex) => (
            <View key={`colhint-${colIndex}`} style={styles.colHintContainer}>
              {hints.map((hint, hintIndex) => (
                <Text 
                  key={`colhint-${colIndex}-${hintIndex}`}
                  style={styles.hintText}
                >
                  {hint}
                </Text>
              ))}
            </View>
          ))}
        </View>
        
        <View style={styles.boardWithRowHints}>
          {/* Row hints and board */}
          {playerBoard.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.rowWithHints}>
              <View style={styles.rowHintContainer}>
                {rowHints[rowIndex].map((hint, hintIndex) => (
                  <Text 
                    key={`rowhint-${rowIndex}-${hintIndex}`}
                    style={styles.hintText}
                  >
                    {hint}
                  </Text>
                ))}
              </View>
              
              <View style={styles.row}>
                {row.map((cell, colIndex) => (
                  <TouchableOpacity
                    key={`cell-${rowIndex}-${colIndex}`}
                    style={[
                      styles.cell,
                      cell === 'filled' && styles.filledCell,
                    ]}
                    onPress={() => handleCellPress(rowIndex, colIndex)}
                  >
                    {cell === 'crossed' && (
                      <X size={CELL_SIZE * 0.6} color="#999" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.resetButton}
        onPress={generatePuzzle}
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
  modeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  modeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  modeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 5,
  },
  fillIcon: {
    width: 16,
    height: 16,
    backgroundColor: COLORS.text,
    borderRadius: 2,
  },
  boardContainer: {
    alignItems: 'center',
  },
  columnHints: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  emptyCorner: {
    width: 40,
    height: 40,
  },
  colHintContainer: {
    width: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 5,
  },
  boardWithRowHints: {
    flexDirection: 'column',
  },
  rowWithHints: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowHintContainer: {
    width: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 5,
  },
  hintText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.text,
    marginHorizontal: 2,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledCell: {
    backgroundColor: COLORS.text,
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