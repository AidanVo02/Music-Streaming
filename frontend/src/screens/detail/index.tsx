import React from 'react';
import { View, Text } from 'react-native';
import THEME from '@/src/constants/theme';

const DetailScreen = () => (
  <View style={{ flex: 1, backgroundColor: THEME.colors.background }}>
    <Text style={{ color: THEME.colors.textPrimary }}>Detail Screen</Text>
  </View>
);

export default DetailScreen;
