import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import { useSessionStore } from '@/store/sessionStore';
import { Clock, Calendar } from 'lucide-react-native';

export default function HistoryScreen() {
  const sessionHistory = useSessionStore((state) => state.sessionHistory);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderHistoryItem = ({ item }: { item: any }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <View style={styles.dateContainer}>
          <Calendar size={16} color={COLORS.text} />
          <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Clock size={16} color={COLORS.text} />
          <Text style={styles.timeText}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
      
      <Text style={styles.sessionTitle}>
        {item.mode === 'multiple' ? 'Multiple Games' : item.selectedGames[0]?.name || 'Game'} Session
      </Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.totalTime}</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.selectedGames.length}</Text>
          <Text style={styles.statLabel}>Games</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.gamesCompleted || 0}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>
      
      <View style={styles.gamesList}>
        {item.selectedGames.map((game: any, index: number) => (
          <View key={`${game.id}-${index}`} style={styles.gameItem}>
            <View 
              style={[
                styles.gameColorDot, 
                { backgroundColor: game.color || COLORS.primary }
              ]} 
            />
            <Text style={styles.gameName}>{game.name}</Text>
            <Text style={styles.gameTime}>{game.timeAllocation} min</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>Your previous gaming sessions</Text>
      </View>
      
      {sessionHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No History Yet</Text>
          <Text style={styles.emptyMessage}>
            Your completed game sessions will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessionHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item, index) => `session-${index}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  listContainer: {
    padding: 15,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    color: COLORS.text,
    marginLeft: 5,
    fontSize: 14,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    color: COLORS.text,
    marginLeft: 5,
    fontSize: 14,
  },
  sessionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: COLORS.primary,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.7,
  },
  gamesList: {
    marginTop: 5,
  },
  gameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  gameColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  gameName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  gameTime: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.text,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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