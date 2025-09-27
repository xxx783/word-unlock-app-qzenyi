
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Word } from '../types';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface WordCardProps {
  word: Word;
  showDefinition?: boolean;
  onPress?: () => void;
}

export default function WordCard({ word, showDefinition = false, onPress }: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(showDefinition);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      setIsFlipped(!isFlipped);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return colors.success;
      case 'medium':
        return colors.warning;
      case 'hard':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <View style={styles.wordContainer}>
          <Text style={styles.word}>{word.word}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(word.difficulty) }]}>
            <Text style={styles.difficultyText}>{word.difficulty}</Text>
          </View>
        </View>
        <Icon 
          name={isFlipped ? "eye-off" : "eye"} 
          size={20} 
          color={colors.textSecondary} 
        />
      </View>

      {isFlipped && (
        <View style={styles.content}>
          <Text style={styles.definition}>{word.definition}</Text>
          <View style={styles.exampleContainer}>
            <Text style={styles.exampleLabel}>例句:</Text>
            <Text style={styles.example}>{word.example}</Text>
          </View>
        </View>
      )}

      {!isFlipped && (
        <View style={styles.tapHint}>
          <Text style={styles.tapHintText}>点击查看释义</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    ...commonStyles.card,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  word: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  content: {
    marginTop: 8,
  },
  definition: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
  },
  exampleContainer: {
    backgroundColor: colors.backgroundAlt,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  example: {
    fontSize: 14,
    color: colors.text,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  tapHint: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  tapHintText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
