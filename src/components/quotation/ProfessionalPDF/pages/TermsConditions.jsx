import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../styles';

export const TermsConditions = () => {
  return (
    <View wrap={false}>
      <Text style={styles.sectionTitle}>Terms and Conditions</Text>
      <Text style={styles.colText}>Standard Terms and Conditions...</Text>
    </View>
  );
};
