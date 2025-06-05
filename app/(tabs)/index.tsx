import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import GameCard from '@/components/GameCard';
import { useSessionStore } from '@/store/sessionStore';
import { GAMES } from '@/constants/games';
import { Clock, Shuffle, List } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const startSession = useSessionStore((state) => state.startSession);
  const [availableTime, setAvailableTime] = useState('15');
  const [gameMode, setGameMode] = useState<'random' | 'specific' | 'multiple'>('specific');

  const handleStartSession = () => {
    const timeInMinutes = parseInt(availableTime) || 15;
    
    let selectedGames = [];
    if (gameMode === 'random') {
      // Select a random game
      const randomIndex = Math.floor(Math.random() * GAMES.length);
      selectedGames = [{ ...GAMES[randomIndex], timeAllocation: timeInMinutes }];
    } else if (gameMode === 'specific') {
      // Use the currently selected game (default to first)
      selectedGames = [{ ...GAMES[0], timeAllocation: timeInMinutes }];
    } else {
      // For multiple, go to config screen
      startSession({
        totalTime: timeInMinutes,
        mode: gameMode,
        selectedGames: GAMES.map(game => ({ ...game, selected: true, timeAllocation: Math.floor(timeInMinutes / GAMES.length) }))
      });
      router.push('/session/config');
      return;
    }

    // Start session directly for random or specific
    startSession({
      totalTime: timeInMinutes,
      mode: gameMode,
      selectedGames
    });
    router.push('/session/game');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>TimeBurner</Text>
        <Text style={styles.subtitle}>How much time do you want to burn today?</Text>
      </View>
      
      <View style={styles.timeInputContainer}>
        <View style={styles.timeInput}>
          <Clock size={24} color={COLORS.primary} />
          <TextInput
            style={styles.input}
            value={availableTime}
            onChangeText={setAvailableTime}
            keyboardType="number-pad"
            placeholder="15"
            maxLength={3}
          />
          <Text style={styles.inputLabel}>minutes</Text>
        </View>
      </View>

      <View style={styles.optionsContainer}>
        <Text style={styles.sectionTitle}>Choose your mode:</Text>
        
        <View style={styles.modeSelector}>
          <TouchableOpacity 
            style={[styles.modeButton, gameMode === 'random' && styles.selectedMode]}
            onPress={() => setGameMode('random')}
          >
            <Shuffle size={24} color={gameMode === 'random' ? '#fff' : COLORS.text} />
            <Text style={[styles.modeText, gameMode === 'random' && styles.selectedModeText]}>
              Random Game
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modeButton, gameMode === 'specific' && styles.selectedMode]}
            onPress={() => setGameMode('specific')}
          >
            <List size={24} color={gameMode === 'specific' ? '#fff' : COLORS.text} />
            <Text style={[styles.modeText, gameMode === 'specific' && styles.selectedModeText]}>
              Specific Game
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modeButton, gameMode === 'multiple' && styles.selectedMode]}
            onPress={() => setGameMode('multiple')}
          >
            <View style={styles.multipleIcon}>
              <List size={20} color={gameMode === 'multiple' ? '#fff' : COLORS.text} />
              <List size={20} color={gameMode === 'multiple' ? '#fff' : COLORS.text} style={{ marginTop: -10, marginLeft: 10 }} />
            </View>
            <Text style={[styles.modeText, gameMode === 'multiple' && styles.selectedModeText]}>
              Multiple Games
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {gameMode === 'specific' && (
        <View style={styles.gamesContainer}>
          <Text style={styles.sectionTitle}>Select a game:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.gamesScrollContent}
          >
            {GAMES.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.startButtonContainer}>
        <TouchableOpacity 
          style={styles.startButton}
          onPress={handleStartSession}
        >
          <Text style={styles.startButtonText}>
            {gameMode === 'multiple' ? 'Configure Session' : 'Start Game'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: COLORS.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.8,
  },
  timeInputContainer: {
    padding: 20,
    paddingTop: 10,
  },
  timeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: COLORS.primary,
    flex: 1,
    marginLeft: 10,
    padding: 0,
  },
  inputLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: COLORS.text,
    opacity: 0.7,
  },
  optionsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 15,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedMode: {
    backgroundColor: COLORS.primary,
  },
  modeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.text,
    marginTop: 10,
    textAlign: 'center',
  },
  selectedModeText: {
    color: '#fff',
  },
  multipleIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
  },
  gamesContainer: {
    padding: 20,
    paddingTop: 0,
  },
  gamesScrollContent: {
    paddingRight: 20,
  },
  startButtonContainer: {
    padding: 20,
    marginTop: 'auto',
  },
  startButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#fff',
  },
});