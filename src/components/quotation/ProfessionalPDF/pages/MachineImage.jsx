import React from 'react';
import { View, Image, Text } from '@react-pdf/renderer';
import { styles } from '../styles';

export const MachineImage = ({ data }) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Machine Overview</Text>
      {data?.machine_image ? (
        <Image src={data.machine_image} style={{ width: '100%', height: 'auto' }} />
      ) : (
        <Text>No machine image available</Text>
      )}
    </View>
  );
};
