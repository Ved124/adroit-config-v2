import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../styles';

export const GeneralSpecs = ({ data }) => {
  const machine = data?.machine || {};
  
  return (
    <View wrap={false}>
      <Text style={styles.sectionTitle}>Annexure - 1: General Specifications</Text>
      
      <View style={styles.table}>
        <View style={styles.tableRowHeader}>
          <View style={styles.col1}><Text style={styles.colHeader}>Subject</Text></View>
          <View style={styles.col2}><Text style={styles.colHeader}>Description</Text></View>
        </View>

        <View style={styles.tableRow}>
          <View style={styles.col1}><Text style={styles.colText}>Machine Family</Text></View>
          <View style={styles.col2}><Text style={styles.colText}>{data?.machine?.family || ''}</Text></View>
        </View>

        <View style={styles.tableRow}>
          <View style={styles.col1}><Text style={styles.colText}>Machine Model</Text></View>
          <View style={styles.col2}><Text style={styles.colText}>{data?.machine?.model || ''}</Text></View>
        </View>

        <View style={styles.tableRow}>
          <View style={styles.col1}><Text style={styles.colText}>Maximum Output</Text></View>
          <View style={styles.col2}><Text style={styles.colText}>{data?.indicative_performance?.max_output || ''}</Text></View>
        </View>
      </View>
    </View>
  );
};
