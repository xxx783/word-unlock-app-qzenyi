
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import ProgressChart from '../components/ProgressChart';
import Icon from '../components/Icon';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, getAllUsers } = useAuth();
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Check if current user is admin (only username "123" and email "18432656624@163.com")
  const isAdmin = user?.username === '123' && user?.email === '18432656624@163.com';

  useEffect(() => {
    if (isAdmin) {
      loadAllUsers();
    }
  }, [isAdmin]);

  const loadAllUsers = async () => {
    const users = await getAllUsers();
    setAllUsers(users);
  };

  const handleLogout = () => {
    Alert.alert(
      '确认退出',
      '你确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '退出', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          }
        }
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.centerContent}>
          <Text style={commonStyles.text}>请先登录</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalCategories = 4; // Based on our word categories
  const completedCategories = user.progress.completedCategories.length;

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={commonStyles.title}>个人资料</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Icon name="log-out" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userCard}>
          <View style={styles.userHeader}>
            <View style={styles.avatar}>
              <Icon name="person" size={32} color={colors.primary} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.email}>{user.email}</Text>
              {isAdmin && (
                <View style={styles.adminBadge}>
                  <Text style={styles.adminText}>管理员</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Progress Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>学习统计</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <ProgressChart completed={completedCategories} total={totalCategories} size={80} />
              <Text style={styles.statLabel}>分类完成</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.progress.totalWordsLearned}</Text>
              <Text style={styles.statLabel}>学习单词</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.progress.currentStreak}</Text>
              <Text style={styles.statLabel}>连续天数</Text>
            </View>
          </View>
        </View>

        {/* Category Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.sectionTitle}>分类进度</Text>
          
          {Object.entries(user.progress.categoryProgress).length > 0 ? (
            Object.entries(user.progress.categoryProgress).map(([categoryId, progress]) => (
              <View key={categoryId} style={styles.categoryProgress}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{categoryId}</Text>
                  <Text style={styles.categoryStats}>
                    {progress.wordsLearned.length} 单词 • 最高分: {progress.bestScore}%
                  </Text>
                </View>
                {progress.isCompleted && (
                  <Icon name="checkmark-circle" size={20} color={colors.success} />
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noProgressText}>还没有学习进度，开始学习吧！</Text>
          )}
        </View>

        {/* Admin Panel - Only for specific user */}
        {isAdmin && (
          <View style={styles.adminCard}>
            <Text style={styles.sectionTitle}>管理员面板</Text>
            <Text style={styles.adminNote}>
              只有用户名为 "123" 且邮箱为 "18432656624@163.com" 的用户才能看到此面板
            </Text>
            
            <Text style={styles.adminSubtitle}>用户数据 ({allUsers.length} 用户)</Text>
            
            {allUsers.map((userData) => (
              <View key={userData.id} style={styles.userDataCard}>
                <View style={styles.userDataHeader}>
                  <Text style={styles.userDataName}>{userData.username}</Text>
                  <Text style={styles.userDataEmail}>{userData.email}</Text>
                  {userData.username === '123' && userData.email === '18432656624@163.com' && (
                    <View style={styles.adminIndicator}>
                      <Text style={styles.adminIndicatorText}>管理员</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.userDataStats}>
                  <Text style={styles.userDataStat}>
                    完成分类: {userData.progress.completedCategories.length}
                  </Text>
                  <Text style={styles.userDataStat}>
                    学习单词: {userData.progress.totalWordsLearned}
                  </Text>
                  <Text style={styles.userDataStat}>
                    连续天数: {userData.progress.currentStreak}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
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
  logoutButton: {
    padding: 8,
  },
  userCard: {
    ...commonStyles.card,
    marginBottom: 16,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  adminBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  adminText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: '600',
  },
  statsCard: {
    ...commonStyles.card,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  progressCard: {
    ...commonStyles.card,
    marginBottom: 16,
  },
  categoryProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  categoryStats: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  noProgressText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  adminCard: {
    ...commonStyles.card,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  adminNote: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 16,
    padding: 8,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 6,
  },
  adminSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 16,
  },
  userDataCard: {
    backgroundColor: colors.backgroundAlt,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  userDataHeader: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userDataName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  userDataEmail: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  adminIndicator: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  adminIndicatorText: {
    color: colors.background,
    fontSize: 8,
    fontWeight: '600',
  },
  userDataStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userDataStat: {
    fontSize: 10,
    color: colors.textSecondary,
  },
});
