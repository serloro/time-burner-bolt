import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameType } from '@/types/game';
import Sudoku from './games/Sudoku';
import Maze from './games/Maze';
import Minesweeper from './games/Minesweeper';
import Picross from './games/Picross';
import SlidingPuzzle from './games/SlidingPuzzle';
import LightsOut from './games/LightsOut';
import Kakuro from './games/Kakuro';

interface GameRendererProps {
  game: GameType;
  onComplete: () => void;
  isPaused: boolean;
}

export default function GameRenderer({ game, onComplete, isPaused }: GameRendererProps) {
  const renderGame = () => {
    switch (game.id) {
      case 'sudoku':
        return <Sudoku onComplete={onComplete} isPaused={isPaused} />;
      case 'maze':
        return <Maze onComplete={onComplete} isPaused={isPaused} />;
      case 'minesweeper':
        return <Minesweeper onComplete={onComplete} isPaused={isPaused} />;
      case 'picross':
        return <Picross onComplete={onComplete} isPaused={isPaused} />;
      case 'sliding_puzzle':
        return <SlidingPuzzle onComplete={onComplete} isPaused={isPaused} />;
      case 'lights_out':
        return <LightsOut onComplete={onComplete} isPaused={isPaused} />;
      case 'kakuro':
        return <Kakuro onComplete={onComplete} isPaused={isPaused} />;
      default:
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Game not implemented</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {isPaused ? (
        <View style={styles.pausedOverlay}>
          <Text style={styles.pausedText}>PAUSED</Text>
          <Text style={styles.pausedSubtext}>Tap play to continue</Text>
        </View>
      ) : (
        renderGame()
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
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#ff3b30',
  },
  pausedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  pausedText: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#fff',
    marginBottom: 10,
  },
  pausedSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
});