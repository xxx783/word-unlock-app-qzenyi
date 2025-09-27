
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { wordCategories } from '../../data/wordCategories';
import { TestQuestion, Word } from '../../types';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import Icon from '../../components/Icon';

export default function TestScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, updateUserProgress } = useAuth();
  
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [testStarted, setTestStarted] = useState(false);

  const category = wordCategories.find(cat => cat.id === id);
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  useEffect(() => {
    if (category) {
      generateQuestions();
    }
  }, [category]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testStarted && timeLeft > 0 && !showResult) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showResult) {
      finishTest();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, testStarted, showResult]);

  const generateQuestions = () => {
    if (!category) return;

    const testQuestions: TestQuestion[] = [];
    const words = [...category.words];

    // Generate questions for each word
    words.forEach((word, index) => {
      // Create wrong answers from other words
      const otherWords = words.filter(w => w.id !== word.id);
      const wrongAnswers = otherWords
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.definition);

      const options = [word.definition, ...wrongAnswers].sort(() => Math.random() - 0.5);

      testQuestions.push({
        id: `q${index}`,
        word,
        options,
        correctAnswer: word.definition,
        type: 'definition'
      });
    });

    setQuestions(testQuestions.sort(() => Math.random() - 0.5));
  };

  const startTest = () => {
    setTestStarted(true);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    const finalScore = selectedAnswer === currentQuestion?.correctAnswer ? score + 1 : score;
    const percentage = Math.round((finalScore / totalQuestions) * 100);
    const passed = percentage >= 70; // 70% to pass

    setScore(finalScore);
    setShowResult(true);

    if (user && category && passed) {
      // Update user progress
      const newProgress = {
        ...user.progress,
        completedCategories: user.progress.completedCategories.includes(category.id)
          ? user.progress.completedCategories
          : [...user.progress.completedCategories, category.id],
        categoryProgress: {
          ...user.progress.categoryProgress,
          [category.id]: {
            ...user.progress.categoryProgress[category.id],
            testsPassed: (user.progress.categoryProgress[category.id]?.testsPassed || 0) + 1,
            bestScore: Math.max(
              user.progress.categoryProgress[category.id]?.bestScore || 0,
              percentage
            ),
            isCompleted: true,
          }
        }
      };

      // Unlock next category
      const nextCategory = wordCategories.find(cat => cat.requiredCategory === category.id);
      if (nextCategory) {
        newProgress.unlockedCategories = [
          ...new Set([...newProgress.unlockedCategories, nextCategory.id])
        ];
      }

      updateUserProgress(newProgress);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!category) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.centerContent}>
          <Text style={commonStyles.text}>测试不存在</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!testStarted) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={commonStyles.title}>测试准备</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={commonStyles.centerContent}>
          <Text style={styles.testTitle}>{category.name} 测试</Text>
          <View style={styles.testInfo}>
            <Text style={styles.infoText}>• 总共 {totalQuestions} 道题</Text>
            <Text style={styles.infoText}>• 时间限制: 5 分钟</Text>
            <Text style={styles.infoText}>• 及格分数: 70%</Text>
            <Text style={styles.infoText}>• 通过测试解锁下一分类</Text>
          </View>

          <TouchableOpacity
            style={[buttonStyles.primary, { marginTop: 32 }]}
            onPress={startTest}
          >
            <Text style={styles.startButtonText}>开始测试</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 70;

    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.centerContent}>
          <View style={[styles.resultCard, passed ? styles.passedCard : styles.failedCard]}>
            <Icon 
              name={passed ? "checkmark-circle" : "close-circle"} 
              size={64} 
              color={passed ? colors.success : colors.error} 
            />
            <Text style={styles.resultTitle}>
              {passed ? '测试通过!' : '测试未通过'}
            </Text>
            <Text style={styles.scoreText}>
              得分: {score}/{totalQuestions} ({percentage}%)
            </Text>
            
            {passed && (
              <Text style={styles.congratsText}>
                恭喜！你已解锁下一个分类
              </Text>
            )}
            
            {!passed && (
              <Text style={styles.encourageText}>
                继续学习，再次挑战！
              </Text>
            )}
          </View>

          <View style={styles.resultActions}>
            <TouchableOpacity
              style={[buttonStyles.secondary, { marginBottom: 12 }]}
              onPress={() => router.back()}
            >
              <Text style={styles.actionButtonText}>返回学习</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={buttonStyles.primary}
              onPress={() => router.push('/')}
            >
              <Text style={styles.primaryActionText}>回到首页</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.testHeader}>
        <View style={styles.testProgress}>
          <Text style={styles.questionCounter}>
            {currentQuestionIndex + 1}/{totalQuestions}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          "{currentQuestion?.word.word}" 的中文意思是？
        </Text>
        
        <View style={styles.optionsContainer}>
          {currentQuestion?.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === option && styles.selectedOption
              ]}
              onPress={() => handleAnswerSelect(option)}
            >
              <Text style={[
                styles.optionText,
                selectedAnswer === option && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            buttonStyles.primary,
            { marginTop: 32 },
            !selectedAnswer && styles.disabledButton
          ]}
          onPress={handleNextQuestion}
          disabled={!selectedAnswer}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex < totalQuestions - 1 ? '下一题' : '完成测试'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  testTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  testInfo: {
    backgroundColor: colors.backgroundAlt,
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  startButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  testProgress: {
    flex: 1,
    marginRight: 16,
  },
  questionCounter: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  timer: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: colors.background,
    fontWeight: '600',
  },
  nextButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  resultCard: {
    backgroundColor: colors.card,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    ...commonStyles.shadow,
  },
  passedCard: {
    borderColor: colors.success,
    borderWidth: 2,
  },
  failedCard: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 16,
  },
  congratsText: {
    fontSize: 14,
    color: colors.success,
    textAlign: 'center',
  },
  encourageText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  resultActions: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 32,
  },
  actionButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryActionText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
