import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../styles';

export const Pricing = ({ data }) => {
  const pricing = data?.pricing || {};
  
  return (
    <View wrap={false}>
      <Text style={styles.sectionTitle}>Annexure - 2: Commercial Offer</Text>
      
      <View style={styles.table}>
        <View style={styles.tableRowHeader}>
          <View style={styles.col1}><Text style={styles.colHeader}>Item</Text></View>
          <View style={styles.col2}><Text style={styles.colHeader}>Price</Text></View>
        </View>

        <View style={styles.tableRow}>
          <View style={styles.col1}><Text style={styles.colText}>Basic Price</Text></View>
          <View style={styles.col2}><Text style={styles.colText}>{pricing.basic_price_text || 'Contact for Pricing'}</Text></View>
        </View>
        
        <View style={styles.tableRow}>
          <View style={styles.col1}><Text style={styles.colText}>Total Amount in Words</Text></View>
          <View style={styles.col2}><Text style={styles.colText}>{pricing.final_price_in_words || '-'}</Text></View>
        </View>
      </View>
    </View>
  );
};
