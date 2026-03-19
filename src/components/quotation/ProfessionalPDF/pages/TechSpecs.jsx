import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../styles';

export const TechSpecs = ({ data }) => {
  const components = data?.components || [];

  return (
    <View>
      <Text style={styles.sectionTitle} break>Annexure - 3: Technical Specifications</Text>
      
      {components.map((item, index) => {
        // Normalise tech_desc: Convert to array of { label, value }
        let rows = [];
        if (Array.isArray(item.tech_desc)) {
          rows = item.tech_desc.map(row => ({
            label: row.label || 'Details',
            value: typeof row.value === 'object' ? JSON.stringify(row.value) : String(row.value || '')
          }));
        } else if (item.tech_desc && typeof item.tech_desc === 'object') {
          rows = Object.entries(item.tech_desc).map(([label, value]) => ({
            label,
            value: typeof value === 'object' ? JSON.stringify(value) : String(value || '')
          }));
        } else if (typeof item.tech_desc === 'string' && item.tech_desc) {
          rows = [{ label: 'Description', value: item.tech_desc }];
        }

        if (rows.length === 0) return null;

        return (
          <View key={index} wrap={false} style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#C8181E', marginBottom: 5 }}>
              {item.name}
            </Text>
            
            <View style={styles.table}>
              <View style={styles.tableRowHeader}>
                <View style={styles.col1}><Text style={styles.colHeader}>Subject</Text></View>
                <View style={styles.col2}><Text style={styles.colHeader}>Description</Text></View>
              </View>

              {rows.map((row, i) => (
                <View style={styles.tableRow} key={i}>
                  <View style={styles.col1}><Text style={styles.colText}>{row.label}</Text></View>
                  <View style={styles.col2}><Text style={styles.colText}>{row.value}</Text></View>
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
};
