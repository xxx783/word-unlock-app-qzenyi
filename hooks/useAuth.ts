
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState, UserProgress } from '../types';

const STORAGE_KEYS = {
  USER: 'user_data',
  USERS: 'all_users',
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (userData) {
        const user = JSON.parse(userData);
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    } catch (error) {
      console.log('Error loading user:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      // Get existing users
      const existingUsersData = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const existingUsers: User[] = existingUsersData ? JSON.parse(existingUsersData) : [];

      // Check if user already exists
      const userExists = existingUsers.some(u => u.email === email || u.username === username);
      if (userExists) {
        return false;
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        isAdmin: existingUsers.length === 0, // First user is admin
        progress: {
          unlockedCategories: ['basic-animals'],
          completedCategories: [],
          currentStreak: 0,
          totalWordsLearned: 0,
          categoryProgress: {},
        },
        createdAt: new Date().toISOString(),
      };

      // Save to all users
      const updatedUsers = [...existingUsers, newUser];
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));

      // Set as current user
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));

      setAuthState({
        isAuthenticated: true,
        user: newUser,
        loading: false,
      });

      return true;
    } catch (error) {
      console.log('Registration error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const existingUsersData = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const existingUsers: User[] = existingUsersData ? JSON.parse(existingUsersData) : [];

      const user = existingUsers.find(u => u.email === email);
      if (user) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.log('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const updateUserProgress = async (progress: UserProgress) => {
    if (!authState.user) return;

    try {
      const updatedUser = { ...authState.user, progress };
      
      // Update current user
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      // Update in all users list
      const existingUsersData = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const existingUsers: User[] = existingUsersData ? JSON.parse(existingUsersData) : [];
      const updatedUsers = existingUsers.map(u => 
        u.id === authState.user!.id ? updatedUser : u
      );
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));

      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error) {
      console.log('Error updating user progress:', error);
    }
  };

  const getAllUsers = async (): Promise<User[]> => {
    try {
      const existingUsersData = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      return existingUsersData ? JSON.parse(existingUsersData) : [];
    } catch (error) {
      console.log('Error getting all users:', error);
      return [];
    }
  };

  return {
    ...authState,
    register,
    login,
    logout,
    updateUserProgress,
    getAllUsers,
  };
};
