
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { wordCategories } from '../../data/wordCategories';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import WordCard from '../../components/WordCard';
import ProgressChart from '../../components/ProgressChart';
import Icon from '../../components/Icon';

export default function CategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, updateUserProgress } = useAuth();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const category = wordCategories.find(cat => cat.id === id);
  const progress = user?.progress.categoryProgress[id!];
  const learnedWords = progress?.wordsLearned || [];
  const completedWords = learnedWords.length;
  const totalWords = category?.words.length || 0;

  useEffect(() => {
    // Initialize category progress if it doesn't exist
    if (user && category && !progress) {
      const newProgress = {
        ...user.progress,
        categoryProgress: {
          ...user.progress.categoryProgress,
          [category.id]: {
            categoryId: category.id,
            wordsLearned: [],
            testsPassed: 0,
            bestScore: 0,
            isUnlocked: true,
            isCompleted: false,
          }
        }
      };
      updateUserProgress(newProgress);
    }
  }, [user, category, progress]);

  if (!category) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.centerContent}>
          <Text style={commonStyles.text}>分类不存在</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleWordLearned = (wordId: string) => {
    if (!user || learnedWords.includes(wordId)) return;

    const newLearnedWords = [...learnedWords, wordId];
    const newProgress = {
      ...user.progress,
      totalWordsLearned: user.progress.totalWordsLearned + 1,
      categoryProgress: {
        ...user.progress.categoryProgress,
        [category.id]: {
          ...progress!,
          wordsLearned: newLearnedWords,
        }
      }
    };

    updateUserProgress(newProgress);
  };

  const canTakeTest = completedWords === totalWords && !progress?.isCompleted;

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.categoryTitle}>{category.name}</Text>
          <Text style={styles.categoryDescription}>{category.description}</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <ProgressChart completed={completedWords} total={totalWords} size={100} />
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            已学习 {completedWords}/{totalWords} 个单词
          </Text>
          {canTakeTest && (
            <TouchableOpacity
              style={[buttonStyles.success, { marginTop: 12 }]}
              onPress={() => router.push(`/test/${category.id}`)}
            >
              <Text style={styles.testButtonText}>开始测试</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.wordsContainer} showsVerticalScrollIndicator={false}>
        <Text style={[commonStyles.subtitle, { marginHorizontal: 16, marginBottom: 16 }]}>
          单词列表
        </Text>
        
        {category.words.map((word, index) => {
          const isLearned = learnedWords.includes(word.id);
          
          return (
            <View key={word.id} style={styles.wordContainer}>
              <WordCard
                word={word}
                onPress={() => {
                  if (!isLearned) {
                    handleWordLearned(word.id);
                  }
                }}
              />
              {isLearned && (
                <View style={styles.learnedBadge}>
                  <Icon name="checkmark-circle" size={20} color={colors.success} />
                </View>
              )}
            </View>
          );
        })}
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  categoryDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: colors.backgroundAlt,
  },
  progressInfo: {
    flex: 1,
    marginLeft: 20,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  testButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
  wordsContainer: {
    flex: 1,
    paddingTop: 20,
  },
  wordContainer: {
    position: 'relative',
  },
  learnedBadge: {
    position: 'absolute',
    top: 16,
    right: 24,
    backgroundColor: colors.background,
    borderRadius: 15,
    padding: 4,
    ...commonStyles.shadow,
  },
});
