import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import { useSessionStore } from '@/store/sessionStore';

interface GameCardProps {
  game: {
    id: string;
    name: string;
    description: string;
    color: string;
  };
}

export default function GameCard({ game }: GameCardProps) {
  const { selectGame } = useSessionStore();
  
  const handleSelectGame = () => {
    selectGame(game.id);
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { borderColor: game.color }]}
      onPress={handleSelectGame}
    >
      <View style={[styles.header, { backgroundColor: game.color }]}>
        <Text style={styles.title}>{game.name}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.description} numberOfLines={2}>
          {game.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 170,
    height: 130,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginRight: 15,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  header: {
    padding: 12,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#fff',
  },
  content: {
    padding: 12,
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
  },
});