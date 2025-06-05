import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import { useSessionStore } from '@/store/sessionStore';
import { ArrowLeft, Clock, CircleCheck as CheckCircle, CirclePlay as PlayCircle } from 'lucide-react-native';

export default function SessionConfigScreen() {
  const router = useRouter();
  const { session, updateSession } = useSessionStore();
  const [games, setGames] = useState(session?.selectedGames || []);
  
  const totalTime = session?.totalTime || 15;
  const averageTime = Math.floor(totalTime / games.filter(g => g.selected).length) || 1;
  
  const toggleGame = (gameId: string) => {
    const updatedGames = games.map(game => {
      if (game.id === gameId) {
        const newSelectedState = !game.selected;
        return {
          ...game,
          selected: newSelectedState,
          timeAllocation: newSelectedState ? averageTime : 0
        };
      }
      return game;
    });
    
    setGames(updatedGames);
  };
  
  const updateGameTime = (gameId: string, time: string) => {
    const timeValue = parseInt(time) || 0;
    
    setGames(games.map(game => 
      game.id === gameId ? { ...game, timeAllocation: timeValue } : game
    ));
  };
  
  const calculateRemainingTime = () => {
    const allocatedTime = games
      .filter(game => game.selected)
      .reduce((sum, game) => sum + (game.timeAllocation || 0), 0);
    
    return totalTime - allocatedTime;
  };
  
  const handleStartSession = () => {
    const selectedGames = games.filter(game => game.selected);
    
    if (selectedGames.length === 0) {
      // Handle error - need at least one game
      return;
    }
    
    updateSession({
      ...session,
      selectedGames
    });
    
    router.push('/session/game');
  };
  
  const remainingTime = calculateRemainingTime();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Configure Session</Text>
      </View>
      
      <View style={styles.timeInfo}>
        <View style={styles.timeDisplay}>
          <Clock size={22} color={COLORS.primary} />
          <Text style={styles.timeText}>
            Total Time: {totalTime} minutes
          </Text>
        </View>
        
        <View style={[
          styles.remainingTime,
          remainingTime < 0 ? styles.timeError : 
          remainingTime === 0 ? styles.timeSuccess : null
        ]}>
          <Text style={[
            styles.remainingTimeText,
            remainingTime < 0 ? styles.timeErrorText : 
            remainingTime === 0 ? styles.timeSuccessText : null
          ]}>
            {remainingTime < 0 
              ? `Overallocated: ${Math.abs(remainingTime)} min` 
              : remainingTime === 0 
                ? 'Perfectly allocated!'
                : `Remaining: ${remainingTime} min`
            }
          </Text>
        </View>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>
          Select and configure games:
        </Text>
        
        {games.map(game => (
          <View key={game.id} style={styles.gameItem}>
            <TouchableOpacity 
              style={[
                styles.gameSelection,
                game.selected ? { backgroundColor: game.color + '20' } : null
              ]}
              onPress={() => toggleGame(game.id)}
            >
              {game.selected && (
                <CheckCircle size={20} color={game.color} style={styles.checkIcon} />
              )}
              <View 
                style={[
                  styles.gameColorDot, 
                  { backgroundColor: game.color }
                ]} 
              />
              <Text style={styles.gameName}>{game.name}</Text>
            </TouchableOpacity>
            
            {game.selected && (
              <View style={styles.timeInputContainer}>
                <TextInput
                  style={styles.timeInput}
                  keyboardType="number-pad"
                  value={game.timeAllocation?.toString() || ''}
                  onChangeText={(text) => updateGameTime(game.id, text)}
                  maxLength={3}
                />
                <Text style={styles.timeInputLabel}>min</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.startButton,
            games.filter(g => g.selected).length === 0 ? styles.startButtonDisabled : null
          ]}
          onPress={handleStartSession}
          disabled={games.filter(g => g.selected).length === 0}
        >
          <PlayCircle size={24} color="#fff" />
          <Text style={styles.startButtonText}>Start Session</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: COLORS.text,
  },
  timeInfo: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 20,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 8,
  },
  remainingTime: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  timeSuccess: {
    backgroundColor: COLORS.success + '20',
  },
  timeError: {
    backgroundColor: COLORS.error + '20',
  },
  remainingTimeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.text,
  },
  timeSuccessText: {
    color: COLORS.success,
  },
  timeErrorText: {
    color: COLORS.error,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 15,
  },
  gameItem: {
    marginBottom: 15,
  },
  gameSelection: {
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
  checkIcon: {
    position: 'absolute',
    right: 15,
  },
  gameColorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  gameName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.text,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 8,
    marginLeft: 28,
    padding: 10,
    width: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  timeInput: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.primary,
    flex: 1,
    padding: 0,
  },
  timeInputLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
    marginLeft: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 18,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonDisabled: {
    backgroundColor: '#ccc',
    shadowColor: '#999',
  },
  startButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
  },
});