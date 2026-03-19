import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: { 
    paddingTop: 30, 
    paddingBottom: 60, 
    paddingHorizontal: 40, 
    fontFamily: 'Helvetica', 
    backgroundColor: '#ffffff'
  },
  // Headers
  mainHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderBottomWidth: 2, 
    borderBottomColor: '#C8181E', // Professional Red
    paddingBottom: 10, 
    marginBottom: 20 
  },
  companyName: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  tagline: { fontSize: 9, color: '#555', marginTop: 2 },
  
  // Section Titles (Mimicking the reference PDF's grey bands)
  sectionTitle: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#000000', 
    backgroundColor: '#e6e6e6', 
    paddingVertical: 6, 
    paddingHorizontal: 10, 
    marginTop: 15, 
    marginBottom: 10 
  },

  // Professional Tables
  table: { 
    display: 'flex', 
    width: '100%', 
    borderStyle: 'solid', 
    borderWidth: 1, 
    borderColor: '#000000', 
    marginBottom: 15 
  },
  tableRowHeader: { 
    flexDirection: 'row', 
    backgroundColor: '#f2f2f2', 
    borderBottomWidth: 1, 
    borderBottomColor: '#000000' 
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderBottomColor: '#bfbfbf' 
  },
  // Table Columns
  col1: { width: '30%', borderRightWidth: 1, borderRightColor: '#bfbfbf', padding: 6 },
  col2: { width: '70%', padding: 6 },
  colHeader: { fontSize: 10, fontWeight: 'bold', color: '#000' },
  colText: { fontSize: 9, color: '#333', lineHeight: 1.4 },

  // Footer
  footer: { 
    position: 'absolute', 
    bottom: 20, 
    left: 40, 
    right: 40, 
    borderTopWidth: 1, 
    borderTopColor: '#000', 
    paddingTop: 5, 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  footerText: { fontSize: 8, color: '#666' }
});
