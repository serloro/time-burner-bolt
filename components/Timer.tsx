import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '@/constants/colors';

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  isPaused: boolean;
  onTimeChange?: (timeRemaining: number) => void;
}

export default function Timer({ initialTime, onTimeUp, isPaused, onTimeChange }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const isLowTime = timeRemaining <= 30; // last 30 seconds
  
  useEffect(() => {
    if (isLowTime && !isPaused) {
      // Create pulsing animation when time is low
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Stop animation
      pulseAnim.setValue(1);
      Animated.timing(pulseAnim).stop();
    }
  }, [isLowTime, isPaused]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (onTimeChange) {
            onTimeChange(newTime);
          }
          return newTime;
        });
      }, 1000);
    } else if (timeRemaining === 0) {
      onTimeUp();
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPaused, timeRemaining]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Calculate color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining <= 10) return COLORS.error;
    if (timeRemaining <= 30) return COLORS.warning;
    return COLORS.text;
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        isLowTime && styles.lowTimeContainer,
        {
          transform: [{ scale: isLowTime ? pulseAnim : 1 }]
        }
      ]}
    >
      <Text 
        style={[
          styles.timerText,
          { color: getTimerColor() }
        ]}
      >
        {formatTime(timeRemaining)}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  lowTimeContainer: {
    backgroundColor: COLORS.error + '15',
  },
  timerText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
});