import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import { useSessionStore } from '@/store/sessionStore';
import { GAMES } from '@/constants/games';
import { Clock, Check, X } from 'lucide-react-native';

export default function StatsScreen() {
  const sessionHistory = useSessionStore((state) => state.sessionHistory);

  // Calculate total time spent
  const totalMinutes = sessionHistory.reduce((acc, session) => acc + session.totalTime, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  // Calculate games stats
  const gameStats = GAMES.map(game => {
    const gameHistory = sessionHistory.flatMap(session => 
      session.selectedGames.filter(g => g.id === game.id)
    );
    
    return {
      ...game,
      timesPlayed: gameHistory.length,
      totalTime: gameHistory.reduce((acc, g) => acc + (g.timeAllocation || 0), 0),
      completed: gameHistory.filter(g => g.completed).length
    };
  });
  
  // Sort by most played
  const sortedGameStats = [...gameStats].sort((a, b) => b.timesPlayed - a.timesPlayed);
  
  // Get favorite game (most time spent)
  const favoriteGame = sortedGameStats.length > 0 ? sortedGameStats[0] : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>Your TimeBurner activity</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sessionHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Stats Yet</Text>
            <Text style={styles.emptyMessage}>
              Complete game sessions to see your statistics here.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.summaryCard}>
              <Text style={styles.cardTitle}>Total Time Spent</Text>
              <View style={styles.timeDisplay}>
                <Clock size={24} color={COLORS.primary} />
                <Text style={styles.timeText}>
                  {hours > 0 ? `${hours}h ` : ''}{minutes}m
                </Text>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{sessionHistory.length}</Text>
                  <Text style={styles.statLabel}>Sessions</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {sessionHistory.reduce((acc, session) => 
                      acc + session.selectedGames.length, 0
                    )}
                  </Text>
                  <Text style={styles.statLabel}>Games</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {sessionHistory.reduce((acc, session) => 
                      acc + (session.gamesCompleted || 0), 0
                    )}
                  </Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
              </View>
            </View>
            
            {favoriteGame && (
              <View style={styles.favoriteCard}>
                <Text style={styles.cardTitle}>Favorite Game</Text>
                <View style={styles.favoriteContent}>
                  <View 
                    style={[
                      styles.favoriteColorBox, 
                      { backgroundColor: favoriteGame.color }
                    ]} 
                  />
                  <View style={styles.favoriteInfo}>
                    <Text style={styles.favoriteName}>{favoriteGame.name}</Text>
                    <Text style={styles.favoriteStats}>
                      Played {favoriteGame.timesPlayed} times • {favoriteGame.totalTime} minutes
                    </Text>
                  </View>
                </View>
              </View>
            )}
            
            <View style={styles.gamesStatsCard}>
              <Text style={styles.cardTitle}>Games Statistics</Text>
              
              {sortedGameStats.map(game => (
                <View key={game.id} style={styles.gameStatRow}>
                  <View style={styles.gameNameSection}>
                    <View 
                      style={[
                        styles.gameColorDot, 
                        { backgroundColor: game.color }
                      ]} 
                    />
                    <Text style={styles.gameStatName}>{game.name}</Text>
                  </View>
                  
                  <View style={styles.gameStatDetails}>
                    <Text style={styles.gameTimePlayed}>{game.timesPlayed}×</Text>
                    <View style={styles.completionStats}>
                      <View style={styles.completionStat}>
                        <Check size={14} color={COLORS.success} />
                        <Text style={styles.completionNumber}>{game.completed}</Text>
                      </View>
                      <View style={styles.completionStat}>
                        <X size={14} color={COLORS.error} />
                        <Text style={styles.completionNumber}>
                          {game.timesPlayed - game.completed}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
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
  cardTitle: {
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
    fontSize: 28,
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
  favoriteCard: {
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
  favoriteContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteColorBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 5,
  },
  favoriteStats: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
  },
  gamesStatsCard: {
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
  gameStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  gameNameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  gameColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  gameStatName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.text,
  },
  gameStatDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameTimePlayed: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.text,
    marginRight: 15,
  },
  completionStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completionStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  completionNumber: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: COLORS.text,
    marginBottom: 10,
  },
  emptyMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.7,
    textAlign: 'center',
  },
});