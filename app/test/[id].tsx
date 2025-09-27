
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
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [testStarted, setTestStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const category = wordCategories.find(cat => cat.id === id);
  const progress = user?.progress.categoryProgress[id!];

  useEffect(() => {
    if (category && testStarted) {
      generateQuestions();
    }
  }, [category, testStarted]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testStarted && timeLeft > 0 && !showResult) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showResult) {
      finishTest();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, testStarted, showResult]);

  if (!category) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.centerContent}>
          <Text style={commonStyles.text}>分类不存在</Text>
        </View>
      </SafeAreaView>
    );
  }

  const generateQuestions = () => {
    const testQuestions: TestQuestion[] = [];
    const words = [...category.words];

    // Generate 10 questions or all words if less than 10
    const questionCount = Math.min(10, words.length);
    
    for (let i = 0; i < questionCount; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      const word = words.splice(randomIndex, 1)[0];
      
      // Create wrong options from other words
      const wrongOptions = category.words
        .filter(w => w.id !== word.id)
        .map(w => w.definition)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [word.definition, ...wrongOptions].sort(() => Math.random() - 0.5);

      testQuestions.push({
        id: `q${i}`,
        word,
        options,
        correctAnswer: word.definition,
        type: 'definition'
      });
    }

    setQuestions(testQuestions);
  };

  const startTest = () => {
    if (!progress || progress.wordsLearned.length < category.words.length) {
      Alert.alert(
        '无法开始测试',
        '请先学习完所有单词再参加测试。',
        [{ text: '确定', onPress: () => router.back() }]
      );
      return;
    }

    setTestStarted(true);
    setTimeLeft(300);
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) {
      Alert.alert('请选择答案', '请选择一个答案后再继续。');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      finishTest();
    }
  };

  const finishTest = async () => {
    if (!user) return;

    const finalScore = Math.round((score / questions.length) * 100);
    const passed = finalScore >= 70; // 70% to pass

    setShowResult(true);

    if (passed) {
      // Update user progress
      const newCompletedCategories = user.progress.completedCategories.includes(category.id)
        ? user.progress.completedCategories
        : [...user.progress.completedCategories, category.id];

      // Find next category to unlock
      const nextCategory = wordCategories.find(cat => cat.requiredCategory === category.id);
      const newUnlockedCategories = nextCategory && !user.progress.unlockedCategories.includes(nextCategory.id)
        ? [...user.progress.unlockedCategories, nextCategory.id]
        : user.progress.unlockedCategories;

      const newProgress = {
        ...user.progress,
        completedCategories: newCompletedCategories,
        unlockedCategories: newUnlockedCategories,
        categoryProgress: {
          ...user.progress.categoryProgress,
          [category.id]: {
            ...progress!,
            testsPassed: (progress?.testsPassed || 0) + 1,
            bestScore: Math.max(progress?.bestScore || 0, finalScore),
            isCompleted: true,
          }
        }
      };

      await updateUserProgress(newProgress);

      Alert.alert(
        '测试通过！',
        `恭喜！您的得分是 ${finalScore}%。${nextCategory ? `已解锁下一分类：${nextCategory.name}` : ''}`,
        [
          { text: '返回', onPress: () => router.back() },
          ...(nextCategory ? [{ text: '下一分类', onPress: () => router.replace(`/category/${nextCategory.id}`) }] : [])
        ]
      );
    } else {
      Alert.alert(
        '测试未通过',
        `您的得分是 ${finalScore}%，需要70%以上才能通过。请继续学习后重新测试。`,
        [{ text: '重新学习', onPress: () => router.back() }]
      );
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
        </View>

        <View style={styles.preparationContainer}>
          <View style={styles.testInfo}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.testDescription}>
              测试包含 {Math.min(10, category.words.length)} 道题目
            </Text>
            <Text style={styles.testDescription}>
              时间限制：5分钟
            </Text>
            <Text style={styles.testDescription}>
              通过分数：70%
            </Text>
          </View>

          <View style={styles.requirements}>
            <Text style={styles.requirementsTitle}>测试要求：</Text>
            <Text style={styles.requirementItem}>• 必须学习完所有单词</Text>
            <Text style={styles.requirementItem}>• 在规定时间内完成</Text>
            <Text style={styles.requirementItem}>• 达到70%以上正确率</Text>
          </View>

          <TouchableOpacity
            style={buttonStyles.primary}
            onPress={startTest}
          >
            <Text style={styles.startButtonText}>开始测试</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (showResult) {
    const finalScore = Math.round((score / questions.length) * 100);
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>测试完成</Text>
          <Text style={styles.scoreText}>{finalScore}%</Text>
          <Text style={styles.resultDescription}>
            {finalScore >= 70 ? '恭喜通过测试！' : '未达到通过标准，请继续学习'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return null;

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.testProgress}>
          <Text style={styles.questionCounter}>
            {currentQuestionIndex + 1}/{questions.length}
          </Text>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          "{currentQuestion.word.word}" 的中文意思是？
        </Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
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
            !selectedAnswer && buttonStyles.disabled
          ]}
          onPress={handleNextQuestion}
          disabled={!selectedAnswer}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex < questions.length - 1 ? '下一题' : '完成测试'}
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
  testProgress: {
    alignItems: 'flex-end',
  },
  questionCounter: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  timer: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '600',
  },
  preparationContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  testInfo: {
    ...commonStyles.card,
    marginBottom: 20,
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  testDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  requirements: {
    ...commonStyles.card,
    marginBottom: 30,
  },
  requirementsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  requirementItem: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  startButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  optionButton: {
    ...commonStyles.card,
    marginBottom: 16,
    paddingVertical: 20,
  },
  selectedOption: {
    backgroundColor: colors.primary,
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
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 20,
  },
  resultDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
