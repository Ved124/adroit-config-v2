import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// --- PROFESSIONAL STYLES ---
const styles = StyleSheet.create({
  page: { paddingTop: 80, paddingBottom: 90, paddingHorizontal: 40, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },

  // Native Header
  header: { position: 'absolute', top: 20, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 2, borderBottomColor: '#C8181E', paddingBottom: 10 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#C8181E' },
  headerTagline: { fontSize: 10, color: '#555', marginTop: 2 },
  headerCert: { fontSize: 9, color: '#333', textAlign: 'right' },

  // Native Footer
  footer: { position: 'absolute', bottom: 20, left: 40, right: 40, borderTopWidth: 2, borderTopColor: '#C8181E', paddingTop: 10 },
  footerLine: { flexDirection: 'row', marginBottom: 3 },
  footerBold: { fontSize: 8, fontWeight: 'bold', color: '#C8181E' },
  footerText: { fontSize: 8, color: '#333' },
  pageNumber: { position: 'absolute', right: 0, bottom: -10, fontSize: 8, color: '#888' },

  // Cover Page
  coverTitle: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginTop: 40, letterSpacing: 2 },
  coverMachine: { fontSize: 20, color: '#C8181E', textAlign: 'center', marginTop: 15, marginBottom: 20, fontWeight: 'bold' },
  mainImage: { width: 350, height: 200, objectFit: 'contain', alignSelf: 'center', marginBottom: 20 },
  coverFor: { fontSize: 14, textAlign: 'center', color: '#555', marginBottom: 10 },
  coverCompany: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#1a1a1a' },
  coverCity: { textAlign: 'center', fontSize: 14, marginTop: 5, color: '#555' },

  // Inner Pages Info Bar
  infoBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, backgroundColor: '#f9f9f9', padding: 8, borderRadius: 4 },
  infoText: { fontSize: 9, fontWeight: 'bold', color: '#333' },

  // Sections & Tables
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#1a1a1a', paddingVertical: 6, paddingHorizontal: 10, marginTop: 15, marginBottom: 15 },
  table: { display: 'flex', width: '100%', borderStyle: 'solid', borderWidth: 1, borderColor: '#000', marginBottom: 20 },
  tableRowHeader: { flexDirection: 'row', backgroundColor: '#f2f2f2', borderBottomWidth: 1, borderBottomColor: '#000' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#bfbfbf' },
  col1: { width: '30%', borderRightWidth: 1, borderRightColor: '#bfbfbf', padding: 6 },
  col2: { width: '70%', padding: 6 },
  colHeader: { fontSize: 10, fontWeight: 'bold', color: '#000' },
  colText: { fontSize: 9, color: '#333', lineHeight: 1.4 },

  // Point-Wise Component Image
  componentImage: { width: 220, height: 140, objectFit: 'contain', alignSelf: 'center', marginBottom: 10, padding: 5, borderStyle: 'solid', borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 4 }
});

// Helper to safely convert relative images (/images/...) to absolute URLs for the PDF Engine
const getAbsoluteImage = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
  if (typeof window !== 'undefined') return window.location.origin + imagePath;
  return null;
};

export const MasterQuotationPDF = ({ data }) => {
  const customer = data?.customer || {};
  const machine = data?.machine || {};
  const quot = data?.quotation || {};

  const components = data?.components || [];
  const optional = data?.optional_items || data?.optionalItems || [];
  const allItems = [...components, ...optional];

  const companyName = customer.company_name || customer.company || 'VALUED CUSTOMER';
  const refNo = quot.ref_no || quot.refNo || 'DRAFT';

  // --- NATIVE HEADER ---
  const LetterheadHeader = () => (
    <View style={styles.header} fixed>
      <View>
        <Text style={styles.headerTitle}>ADROIT EXTRUSION</Text>
        <Text style={styles.headerTagline}>Explorers of Innovation</Text>
      </View>
      <View>
        <Text style={styles.headerCert}>An ISO 9001:2015 Certified Company</Text>
        <Text style={styles.headerCert}>CE Mark</Text>
      </View>
    </View>
  );

  // --- NATIVE FOOTER ---
  const LetterheadFooter = () => (
    <View style={styles.footer} fixed>
      <View style={styles.footerLine}>
        <Text style={styles.footerBold}>Unit: 1- </Text>
        <Text style={styles.footerText}>Survey 822, Bhumapura Jinjar Road, Village Bhumapura, Ahmedabad - Mahemdavad Road, Dist: Kheda - 387130 (Gujarat) INDIA</Text>
      </View>
      <View style={styles.footerLine}>
        <Text style={styles.footerBold}>Unit: 2- </Text>
        <Text style={styles.footerText}>75/A, Akshar Industrial Park, B/H Amba Estate, Near Hathijan Circle, Vatva, GIDC Phase-4, Ahmedabad - 382445</Text>
      </View>
      <View style={styles.footerLine}>
        <Text style={styles.footerBold}>E-mail: </Text><Text style={styles.footerText}>info@adroitextrusion.com   |   </Text>
        <Text style={styles.footerBold}>Web: </Text><Text style={styles.footerText}>www.adroitextrusion.com   |   </Text>
        <Text style={styles.footerBold}>Cell: </Text><Text style={styles.footerText}>+91 99251 43048 | 87586 65507</Text>
      </View>
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  );

  return (
    <Document>
      {/* PAGE 1: COVER PAGE */}
      <Page size="A4" style={styles.page}>
        <LetterheadHeader />

        <Text style={styles.coverTitle}>PROPOSAL OF</Text>
        <Text style={styles.coverMachine}>AE {machine.type?.toUpperCase() || 'INNOFLEX'} BLOWN FILM LINE</Text>

        {/* Main Machine Image */}
        {getAbsoluteImage(machine.image) ? (
          <Image src={getAbsoluteImage(machine.image)} style={styles.mainImage} />
        ) : (
          <View style={{ height: 180 }} />
        )}

        <Text style={styles.coverFor}>PREPARED FOR</Text>
        <Text style={styles.coverCompany}>{companyName}</Text>
        <Text style={styles.coverCity}>{customer.city || ''} {customer.state ? `, ${customer.state}` : ''}</Text>

        <LetterheadFooter />
      </Page>

      {/* PAGE 2+: TECHNICAL SPECIFICATIONS (WITH POINT-WISE IMAGES) */}
      <Page size="A4" style={styles.page}>
        <LetterheadHeader />

        <View style={styles.infoBar} fixed>
          <Text style={styles.infoText}>Ref: {refNo}</Text>
          <Text style={styles.infoText}>Date: {quot.date || new Date().toLocaleDateString()}</Text>
        </View>

        <Text style={styles.sectionTitle}>Annexure: Technical Specifications</Text>

        {allItems.map((item, index) => {
          const specs = item.tech_desc || item.techDesc;
          if (!specs || Object.keys(specs).length === 0) return null;

          // Check if this specific item has an image assigned to it
          const itemImgUrl = getAbsoluteImage(item.image);

          return (
            <View key={index} wrap={false} style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#C8181E', marginBottom: 8, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' }}>
                {index + 1}. {item.name}
              </Text>

              {/* Point-wise Image Injection */}
              {itemImgUrl && (
                <Image src={itemImgUrl} style={styles.componentImage} />
              )}

              <View style={styles.table}>
                <View style={styles.tableRowHeader}>
                  <View style={styles.col1}><Text style={styles.colHeader}>Subject</Text></View>
                  <View style={styles.col2}><Text style={styles.colHeader}>Description</Text></View>
                </View>

                {Object.entries(specs).map(([key, value], i) => (
                  <View style={styles.tableRow} key={i}>
                    <View style={styles.col1}><Text style={styles.colText}>{key}</Text></View>
                    <View style={styles.col2}><Text style={styles.colText}>{value}</Text></View>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        <LetterheadFooter />
      </Page>
    </Document>
  );
};