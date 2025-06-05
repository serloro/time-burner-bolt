import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import { useSessionStore } from '@/store/sessionStore';
import { Check, X, Clock, Chrome as Home, RotateCcw } from 'lucide-react-native';

export default function SummaryScreen() {
  const router = useRouter();
  const { session, startNewSession } = useSessionStore();
  
  if (!session) {
    router.replace('/');
    return null;
  }
  
  const completedGames = session.selectedGames.filter(game => game.completed).length;
  const totalGames = session.selectedGames.length;
  const completionRate = Math.round((completedGames / totalGames) * 100);
  
  const goHome = () => {
    router.replace('/');
  };
  
  const playAgain = () => {
    startNewSession();
    router.replace('/session/game');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Session Summary</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Time Spent</Text>
          <View style={styles.timeDisplay}>
            <Clock size={24} color={COLORS.primary} />
            <Text style={styles.timeText}>{session.totalTime} minutes</Text>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalGames}</Text>
              <Text style={styles.statLabel}>Games</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completedGames}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completionRate}%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.gamesCard}>
          <Text style={styles.gamesTitle}>Games Played</Text>
          
          {session.selectedGames.map((game, index) => (
            <View key={`${game.id}-${index}`} style={styles.gameRow}>
              <View style={styles.gameInfo}>
                <View 
                  style={[
                    styles.gameColorDot, 
                    { backgroundColor: game.color }
                  ]} 
                />
                <Text style={styles.gameName}>{game.name}</Text>
              </View>
              
              <View style={styles.gameResult}>
                <Text style={styles.gameTime}>{game.timeAllocation} min</Text>
                <View style={styles.gameStatus}>
                  {game.completed ? (
                    <Check size={20} color={COLORS.success} />
                  ) : (
                    <X size={20} color={COLORS.error} />
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>Overall Performance</Text>
          
          <Text style={styles.feedbackText}>
            {completionRate >= 80 
              ? 'Excellent job! You completed most of your games in the allocated time.'
              : completionRate >= 50
                ? 'Good effort! You completed some of your games in the allocated time.'
                : 'Keep practicing! Time management is a skill that improves with practice.'
            }
          </Text>
          
          <Text style={styles.tipTitle}>Tips:</Text>
          <Text style={styles.tipText}>
            • Try to focus on one problem at a time{'\n'}
            • For puzzles like Sudoku, look for obvious patterns first{'\n'}
            • In Minesweeper, start from the corners{'\n'}
            • Practice regularly to improve your solving speed
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={goHome}
        >
          <Home size={22} color="#fff" />
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.playAgainButton}
          onPress={playAgain}
        >
          <RotateCcw size={22} color="#fff" />
          <Text style={styles.buttonText}>Play Again</Text>
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
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: COLORS.primary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 15,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: COLORS.primary,
    marginLeft: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: COLORS.text,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.7,
    marginTop: 4,
  },
  gamesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  gamesTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 15,
  },
  gameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  gameInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  gameName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.text,
  },
  gameResult: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
    marginRight: 10,
  },
  gameStatus: {
    width: 26,
    alignItems: 'center',
  },
  feedbackCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  feedbackTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 15,
  },
  feedbackText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 15,
  },
  tipTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
  },
  tipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  homeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.text,
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
  },
  playAgainButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 15,
    marginLeft: 10,
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
});