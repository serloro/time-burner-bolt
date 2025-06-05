import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, PanResponder, PanResponderInstance } from 'react-native';
import { COLORS } from '@/constants/colors';

interface MazeProps {
  onComplete: () => void;
  isPaused: boolean;
}

// Cell types
type CellType = 'wall' | 'path' | 'start' | 'end' | 'player' | 'visited';

// Maze size (adjust for different difficulties)
const MAZE_SIZE = 9;
const CELL_SIZE = Math.min(30, (Dimensions.get('window').width - 40) / MAZE_SIZE);

export default function Maze({ onComplete, isPaused }: MazeProps) {
  const [maze, setMaze] = useState<CellType[][]>([]);
  const [playerPosition, setPlayerPosition] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  const [endPosition, setEndPosition] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  const [panResponder, setPanResponder] = useState<PanResponderInstance | null>(null);
  
  // Generate a maze when component mounts
  useEffect(() => {
    generateMaze();
    
    // Initialize the pan responder for swipe gestures
    const responder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (isPaused) return;
        
        // Determine the direction of the swipe
        const { dx, dy } = gestureState;
        const isHorizontal = Math.abs(dx) > Math.abs(dy);
        
        if (isHorizontal) {
          if (dx > 10) movePlayer('right');
          else if (dx < -10) movePlayer('left');
        } else {
          if (dy > 10) movePlayer('down');
          else if (dy < -10) movePlayer('up');
        }
      },
      onPanResponderRelease: () => {},
    });
    
    setPanResponder(responder);
  }, [playerPosition, isPaused]);
  
  const generateMaze = () => {
    // Initialize maze with walls
    const newMaze: CellType[][] = Array(MAZE_SIZE).fill(null).map(() => 
      Array(MAZE_SIZE).fill('wall')
    );
    
    // Use a simple algorithm to generate a maze
    // For this demo, we'll create a predefined maze
    
    // Create a path through the maze
    const path = [
      [0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 3], [2, 4],
      [3, 4], [4, 4], [4, 3], [4, 2], [4, 1], [5, 1], [6, 1],
      [6, 2], [6, 3], [6, 4], [6, 5], [5, 5], [4, 5], [4, 6],
      [4, 7], [5, 7], [6, 7], [7, 7], [7, 6], [7, 5], [8, 5],
      [8, 6], [8, 7], [8, 8]
    ];
    
    // Set paths
    path.forEach(([row, col]) => {
      newMaze[row][col] = 'path';
    });
    
    // Set start and end positions
    newMaze[0][0] = 'start';
    newMaze[8][8] = 'end';
    
    setMaze(newMaze);
    setPlayerPosition({ row: 0, col: 0 });
    setEndPosition({ row: 8, col: 8 });
  };
  
  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    const { row, col } = playerPosition;
    let newRow = row;
    let newCol = col;
    
    // Calculate new position based on direction
    switch (direction) {
      case 'up':
        newRow = Math.max(0, row - 1);
        break;
      case 'down':
        newRow = Math.min(MAZE_SIZE - 1, row + 1);
        break;
      case 'left':
        newCol = Math.max(0, col - 1);
        break;
      case 'right':
        newCol = Math.min(MAZE_SIZE - 1, col + 1);
        break;
    }
    
    // Check if the move is valid (not a wall)
    if (maze[newRow][newCol] !== 'wall') {
      // Update maze to mark the path as visited
      const newMaze = [...maze];
      if (newMaze[row][col] !== 'start') {
        newMaze[row][col] = 'visited';
      }
      
      setMaze(newMaze);
      setPlayerPosition({ row: newRow, col: newCol });
      
      // Check if player reached the end
      if (newRow === endPosition.row && newCol === endPosition.col) {
        onComplete();
      }
    }
  };
  
  // Get cell color based on type
  const getCellColor = (type: CellType): string => {
    switch (type) {
      case 'wall':
        return '#333';
      case 'path':
        return '#fff';
      case 'start':
        return COLORS.success;
      case 'end':
        return COLORS.primary;
      case 'player':
        return COLORS.primary;
      case 'visited':
        return COLORS.primaryLight;
      default:
        return '#fff';
    }
  };

  if (maze.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Generating maze...</Text>
      </View>
    );
  }

  return (
    <View 
      style={styles.container}
      {...(panResponder?.panHandlers || {})}
    >
      <Text style={styles.title}>Maze</Text>
      <Text style={styles.subtitle}>Swipe to move through the maze</Text>
      
      <View style={styles.mazeContainer}>
        {maze.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, colIndex) => (
              <View
                key={`cell-${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  { 
                    backgroundColor: getCellColor(cell),
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                  }
                ]}
              >
                {playerPosition.row === rowIndex && playerPosition.col === colIndex && (
                  <View style={styles.player} />
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
      
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Find your way from the green start to the blue end!
        </Text>
      </View>
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
    marginBottom: 5,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.7,
    marginBottom: 20,
  },
  mazeContainer: {
    backgroundColor: '#fff',
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
    borderColor: '#ddd',
  },
  player: {
    width: CELL_SIZE * 0.7,
    height: CELL_SIZE * 0.7,
    borderRadius: CELL_SIZE * 0.35,
    backgroundColor: COLORS.warning,
  },
  instructions: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    width: '100%',
  },
  instructionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
  },
});