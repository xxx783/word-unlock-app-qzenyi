
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { colors, commonStyles } from '../styles/commonStyles';

interface ProgressChartProps {
  completed: number;
  total: number;
  size?: number;
}

export default function ProgressChart({ completed, total, size = 120 }: ProgressChartProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  const data = [
    {
      key: 'completed',
      value: completed,
      svg: { fill: colors.success },
    },
    {
      key: 'remaining',
      value: total - completed,
      svg: { fill: colors.backgroundAlt },
    },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.chartContainer, { width: size, height: size }]}>
        <PieChart
          style={{ width: size, height: size }}
          data={data}
          innerRadius="60%"
          outerRadius="100%"
        />
        <View style={styles.centerText}>
          <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
          <Text style={styles.labelText}>完成</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  labelText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
