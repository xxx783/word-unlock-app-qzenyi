
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { wordCategories } from '../data/wordCategories';
import { colors, commonStyles } from '../styles/commonStyles';
import CategoryCard from '../components/CategoryCard';
import ProgressChart from '../components/ProgressChart';
import Icon from '../components/Icon';

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.centerContent}>
          <Text style={commonStyles.text}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.centerContent}>
          <Text style={commonStyles.title}>单词学习</Text>
          <Text style={[commonStyles.text, { textAlign: 'center', marginBottom: 32 }]}>
            通过分类学习单词，完成测试解锁新内容
          </Text>
          
          <TouchableOpacity
            style={[styles.authButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.authButtonText}>登录</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.authButton, { backgroundColor: colors.backgroundAlt, marginTop: 12 }]}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={[styles.authButtonText, { color: colors.text }]}>注册</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const totalCategories = wordCategories.length;
  const completedCategories = user?.progress.completedCategories.length || 0;
  const totalWords = wordCategories.reduce((sum, cat) => sum + cat.words.length, 0);
  const learnedWords = user?.progress.totalWordsLearned || 0;

  const isCategoryUnlocked = (category: any) => {
    if (!category.requiredCategory) return true;
    return user?.progress.completedCategories.includes(category.requiredCategory) || false;
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={commonStyles.title}>你好, {user?.username}!</Text>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
          >
            <Icon name="person-circle" size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ProgressChart completed={completedCategories} total={totalCategories} size={80} />
            <Text style={styles.statLabel}>分类进度</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statNumber}>
              <Text style={styles.statValue}>{learnedWords}</Text>
              <Text style={styles.statTotal}>/{totalWords}</Text>
            </View>
            <Text style={styles.statLabel}>学习单词</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statNumber}>
              <Text style={styles.statValue}>{user?.progress.currentStreak || 0}</Text>
              <Text style={styles.statUnit}>天</Text>
            </View>
            <Text style={styles.statLabel}>连续学习</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.categoriesContainer} showsVerticalScrollIndicator={false}>
        <Text style={[commonStyles.subtitle, { marginHorizontal: 16, marginBottom: 16 }]}>
          学习分类
        </Text>
        
        {wordCategories.map((category) => {
          const isUnlocked = isCategoryUnlocked(category);
          const progress = user?.progress.categoryProgress[category.id];
          
          return (
            <CategoryCard
              key={category.id}
              category={category}
              progress={progress}
              isLocked={!isUnlocked}
              onPress={() => {
                if (isUnlocked) {
                  router.push(`/category/${category.id}`);
                }
              }}
            />
          );
        })}
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileButton: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    height: 80,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  statTotal: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  statUnit: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  categoriesContainer: {
    flex: 1,
    paddingTop: 20,
  },
  authButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  authButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});
