
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WordCategory, CategoryProgress } from '../types';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface CategoryCardProps {
  category: WordCategory;
  progress?: CategoryProgress;
  isLocked: boolean;
  onPress: () => void;
}

export default function CategoryCard({ category, progress, isLocked, onPress }: CategoryCardProps) {
  const completedWords = progress?.wordsLearned.length || 0;
  const totalWords = category.words.length;
  const progressPercentage = totalWords > 0 ? (completedWords / totalWords) * 100 : 0;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isLocked && styles.lockedCard,
        progress?.isCompleted && styles.completedCard
      ]}
      onPress={onPress}
      disabled={isLocked}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{category.icon}</Text>
          {isLocked && (
            <View style={styles.lockOverlay}>
              <Icon name="lock-closed" size={20} color={colors.textSecondary} />
            </View>
          )}
        </View>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, isLocked && styles.lockedText]}>
            {category.name}
          </Text>
          <Text style={[styles.description, isLocked && styles.lockedText]}>
            {category.description}
          </Text>
        </View>
      </View>

      {!isLocked && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {completedWords}/{totalWords} 单词
          </Text>
        </View>
      )}

      {progress?.isCompleted && (
        <View style={styles.completedBadge}>
          <Icon name="checkmark-circle" size={16} color={colors.success} />
          <Text style={styles.completedText}>已完成</Text>
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
  lockedCard: {
    opacity: 0.6,
    backgroundColor: colors.backgroundAlt,
  },
  completedCard: {
    borderColor: colors.success,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  icon: {
    fontSize: 32,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    right: -8,
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 2,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...commonStyles.subtitle,
    marginBottom: 4,
  },
  description: {
    ...commonStyles.textSecondary,
  },
  lockedText: {
    color: colors.textSecondary,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    ...commonStyles.textSecondary,
    fontSize: 12,
    textAlign: 'right',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  completedText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
