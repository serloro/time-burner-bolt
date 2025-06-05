import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import { useSessionStore } from '@/store/sessionStore';
import Timer from '@/components/Timer';
import GameRenderer from '@/components/GameRenderer';
import { Check, X, Pause, Play } from 'lucide-react-native';
import { Platform } from 'react-native';

const { width } = Dimensions.get('window');

export default function GameScreen() {
  const router = useRouter();
  const { session, completeGame, failGame, finishSession } = useSessionStore();
  
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  const currentGame = session?.selectedGames[currentGameIndex];
  
  useEffect(() => {
    // Redirect if no session
    if (!session || !session.selectedGames || session.selectedGames.length === 0) {
      router.replace('/');
      return;
    }
    
    // Initialize the timer for the current game
    setTimeRemaining(currentGame?.timeAllocation * 60 || 0);
    setGameComplete(false);
  }, [currentGameIndex, session]);
  
  const handleGameComplete = () => {
    // Mark current game as completed
    completeGame(currentGameIndex);
    setGameComplete(true);
    
    // Trigger haptic feedback if on native platforms
    if (Platform.OS !== 'web') {
      try {
        // Using require here to avoid importing on web
        const Haptics = require('expo-haptics');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {
        // Silently fail if haptics not available
      }
    }
    
    // Move to next game after a short delay
    setTimeout(() => {
      moveToNextGame();
    }, 1500);
  };
  
  const handleTimeUp = () => {
    // Mark current game as failed
    failGame(currentGameIndex);
    
    // Trigger haptic feedback if on native platforms
    if (Platform.OS !== 'web') {
      try {
        const Haptics = require('expo-haptics');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch (e) {
        // Silently fail if haptics not available
      }
    }
    
    // Move to next game
    moveToNextGame();
  };
  
  const moveToNextGame = () => {
    if (currentGameIndex >= session!.selectedGames.length - 1) {
      // We've completed all games, go to summary
      finishSession();
      router.replace('/session/summary');
      return;
    }
    
    // Animate transition to next game
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Update state after animation
      setCurrentGameIndex(currentGameIndex + 1);
      slideAnim.setValue(width);
      
      // Animate new game in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };
  
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  const exitSession = () => {
    router.replace('/');
  };

  if (!currentGame) {
    return null; // Should never happen due to redirect
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentGame.color + '15' }]} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.gameInfo}>
          <View 
            style={[
              styles.gameColorDot, 
              { backgroundColor: currentGame.color }
            ]} 
          />
          <Text style={styles.gameName}>{currentGame.name}</Text>
        </View>
        
        <Timer 
          initialTime={currentGame.timeAllocation * 60}
          onTimeUp={handleTimeUp}
          isPaused={isPaused}
          onTimeChange={setTimeRemaining}
        />
        
        <TouchableOpacity
          style={styles.pauseButton}
          onPress={togglePause}
        >
          {isPaused ? (
            <Play size={24} color={COLORS.text} />
          ) : (
            <Pause size={24} color={COLORS.text} />
          )}
        </TouchableOpacity>
      </View>
      
      <Animated.View 
        style={[
          styles.gameContainer,
          {
            transform: [{ translateX: slideAnim }],
            opacity: fadeAnim
          }
        ]}
      >
        <GameRenderer 
          game={currentGame}
          onComplete={handleGameComplete}
          isPaused={isPaused}
        />
      </Animated.View>
      
      {gameComplete && (
        <View style={styles.completeBanner}>
          <Check size={24} color="#fff" />
          <Text style={styles.completeText}>Game Completed!</Text>
        </View>
      )}
      
      <View style={styles.progressBar}>
        {session?.selectedGames.map((game, index) => (
          <View 
            key={index} 
            style={[
              styles.progressDot,
              index === currentGameIndex && styles.progressDotCurrent,
              index < currentGameIndex && styles.progressDotComplete,
              { backgroundColor: index === currentGameIndex ? currentGame.color : '#ccc' }
            ]} 
          />
        ))}
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.exitButton}
          onPress={exitSession}
        >
          <X size={20} color={COLORS.error} />
          <Text style={styles.exitButtonText}>End Session</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  gameInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameColorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  gameName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.text,
  },
  pauseButton: {
    padding: 8,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeBanner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -25 }],
    backgroundColor: COLORS.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  completeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  progressDotCurrent: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  progressDotComplete: {
    backgroundColor: COLORS.success + '80',
  },
  footer: {
    padding: 15,
    alignItems: 'center',
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  exitButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.error,
    marginLeft: 5,
  },
});