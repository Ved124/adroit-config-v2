import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../styles';

export const ScopeOfSupply = ({ data }) => {
  const components = data?.components || [];
  
  return (
    <View wrap={false}>
      <Text style={styles.sectionTitle}>Annexure - 4: Scope of Supply</Text>
      
      <View style={styles.table}>
        <View style={styles.tableRowHeader}>
          <View style={styles.col1}><Text style={styles.colHeader}>Item Name</Text></View>
          <View style={styles.col2}><Text style={styles.colHeader}>Description / Qty</Text></View>
        </View>

        {components.map((item, index) => (
          <View key={index} style={styles.tableRow} wrap={false}>
            <View style={styles.col1}><Text style={styles.colText}>{item.name}</Text></View>
            <View style={styles.col2}>
              <Text style={styles.colText}>
                {item.qty} Nos
                {item.tech_desc && typeof item.tech_desc === 'string' ? ` - ${item.tech_desc}` : ''}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
