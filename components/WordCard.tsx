
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { Word } from '../types';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface WordCardProps {
  word: Word;
  showDefinition?: boolean;
  onPress?: () => void;
  onWordLearned?: () => void;
}

export default function WordCard({ word, showDefinition = false, onPress, onWordLearned }: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(showDefinition);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      setIsFlipped(!isFlipped);
      if (!isFlipped && onWordLearned) {
        // Mark word as learned when user views the definition
        onWordLearned();
      }
    }
  };

  const playPronunciation = async () => {
    if (!word.audioUrl || isPlayingAudio) return;

    try {
      setIsPlayingAudio(true);
      const { sound } = await Audio.Sound.createAsync(
        { uri: word.audioUrl },
        { shouldPlay: true }
      );
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlayingAudio(false);
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Error playing audio:', error);
      setIsPlayingAudio(false);
      Alert.alert('音频播放失败', '无法播放发音，请检查网络连接');
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
      {/* Word Image */}
      {word.image && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: word.image }} 
            style={styles.wordImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <Icon name="image" size={20} color={colors.background} />
          </View>
        </View>
      )}

      <View style={styles.content}>
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

        {/* Pronunciation Section */}
        {word.pronunciation && (
          <View style={styles.pronunciationContainer}>
            <Text style={styles.pronunciation}>{word.pronunciation}</Text>
            {word.audioUrl && (
              <TouchableOpacity 
                style={[styles.audioButton, isPlayingAudio && styles.audioButtonActive]}
                onPress={playPronunciation}
                disabled={isPlayingAudio}
              >
                <Icon 
                  name={isPlayingAudio ? "volume-high" : "volume-medium"} 
                  size={16} 
                  color={isPlayingAudio ? colors.primary : colors.textSecondary} 
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {isFlipped && (
          <View style={styles.definitionContent}>
            <Text style={styles.definition}>{word.definition}</Text>
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleLabel}>例句:</Text>
              <Text style={styles.example}>{word.example}</Text>
            </View>
          </View>
        )}

        {!isFlipped && (
          <View style={styles.tapHint}>
            <Text style={styles.tapHintText}>点击查看释义和发音</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    ...commonStyles.card,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 150,
    width: '100%',
  },
  wordImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 4,
  },
  content: {
    padding: 16,
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
  pronunciationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
  },
  pronunciation: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    flex: 1,
    fontFamily: 'monospace',
  },
  audioButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    ...commonStyles.shadow,
  },
  audioButtonActive: {
    backgroundColor: colors.primary + '20',
  },
  definitionContent: {
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
