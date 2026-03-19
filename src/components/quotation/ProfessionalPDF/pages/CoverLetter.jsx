import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { styles } from '../styles';

export const CoverLetter = ({ data }) => {
  return (
    <View>
      <Text style={[styles.companyName, { fontSize: 20, marginBottom: 20 }]}>PROPOSAL</Text>
      <Text style={styles.colText}>To,</Text>
      <Text style={[styles.colText, { fontWeight: 'bold' }]}>{data?.customer?.company_name || 'CUSTOMER'}</Text>
      <Text style={styles.colText}>{data?.customer?.address || ''}</Text>
      <View style={{ marginTop: 20, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 5 }}>
        <Text style={[styles.colText, { fontWeight: 'bold' }]}>Subject: {data?.quotation?.subject || 'Quotation for Blown Film Plant'}</Text>
      </View>
      <Text style={[styles.colText, { marginTop: 20 }]}>Dear Sir,</Text>
      <Text style={[styles.colText, { marginTop: 10 }]}>
        We are pleased to submit our professional quotation for your review...
      </Text>
    </View>
  );
};
