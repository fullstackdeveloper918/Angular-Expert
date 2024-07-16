"use client"
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    background: "#fff",
    paddingLeft:100,
    paddingBottom:50,
    paddingRight:100,
    paddingTop:50,
  },
  section: {
    padding: 10,
    // borderBottom: '1px solid #ccc',
    flexDirection: 'column',
    display:'flex',
  },
  header: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
    display:'flex',
    justifyContent:'center',
    flexDirection: 'column',
    fontWeight:'bold',
    textTransform: 'uppercase',
    padding:'10',
    marginBottom: '30px',
  },
  main_heading:{
    fontSize: '24px',
    padding: '10px',
    textAlign: 'center',
    display:'flex',
    justifyContent:'center',
    flexDirection: 'column',
    fontWeight:'bold',
    textTransform: 'uppercase',
    background:'#000',
    width:'100%',
    color:'#fff',
    padding:'10px',
    marginBottom: '30px',
  },
  itali_text:{
    fontSize: '18px',
    fontStyle:'italic',
    fontWeight:'400',
  },
  subheader: {
    fontSize: 18,
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  subheading:{
    fontSize: 18,
    marginBottom: 10,
    textTransform: 'capitalize',
    textAlign:'left',
    fontWeight:'bold',
    textTransform: 'uppercase',
    borderBottom:'3px solid #d2d2d2',
    marginBottom:'20px',
    paddingBottom:'10px',
  },
  text: {
    marginBottom: 10,
    fontSize: 12,
  },
  textarea: {
    padding: 10,
    border: '1px solid #ccc',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    width:'100%',
    display:'inline-block'
  },
  goal: {
    marginBottom: 20,
    display: 'flex',
    flexDirection:'column'
  },
  div_wrapper:{
    display: 'flex',
    gap:'30px',
    width:'100%',
  },
  Flex_div:{
width:'50%'
  },
  checkbox: {
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 5,
  },
  checked: {
    width: '12px',
    height: '12px',
    backgroundColor: '#0000001a',
    display:'inline-block',
    border:'1px solid #000',
    cursor:'pointer', 
    marginRight: 5,
  },

});

// Create Document Component
const MemberUpdatePDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text>Member Update / <Text style={styles.itali_text}>Spring 2024</Text></Text>
        <Text style={styles.subheader}>Select Company Name</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.main_heading}>Business Update</Text>
        <Text style={styles.text}><strong>Current financial position:</strong></Text>
        <Text style={styles.textarea}>     </Text>
        <Text style={styles.text}><strong>Current sales positions, hot prospects, recently contracted work:</strong></Text>
        <Text style={styles.textarea}>     </Text>
        <Text style={styles.text}><strong>Accomplishments in the last 6 months:</strong></Text>
        <Text style={styles.textarea}>     </Text>
        <Text style={styles.text}><strong>HR position &/or needs:</strong></Text>
        <Text style={styles.textarea}>     </Text>
        <Text style={styles.text}><strong>Current challenges (e.g., problem client, personnel issue(s), trade availability, rising costs, supply chain):</strong></Text>
        <Text style={styles.textarea}>     </Text>
        <Text style={styles.text}><strong>How can the Craftsmen aid or support you with these challenges?</strong></Text>
        <Text style={styles.textarea}>     </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.main_heading}>Goals</Text>
        <Text style={styles.subheading}>Goals from Last Meeting</Text>
        <View style={styles.goal}>
          <View style={styles.div_wrapper}>
          <View style={styles.Flex_div}><Text style={styles.text}><strong>Goal #1:</strong></Text>
          <Text style={styles.textarea}>     </Text>
          </View>
          <View  style={styles.Flex_div}>
            <Text style={styles.text}><strong>Status of Goal:</strong></Text>
          <Text style={styles.textarea}>     </Text>
          </View>
          </View>
          <Text style={styles.text}><strong>Comments:</strong></Text>
          <Text style={styles.textarea}>     </Text>
        </View>
        <View style={styles.goal}>
          <View style={styles.div_wrapper}>
          <View style={styles.Flex_div}><Text style={styles.text}><strong>Goal #2:</strong></Text>
          <Text style={styles.textarea}>     </Text>
          </View>
          <View  style={styles.Flex_div}>
            <Text style={styles.text}><strong>Status of Goal:</strong></Text>
          <Text style={styles.textarea}>     </Text>
          </View>
          </View>
          <Text style={styles.text}><strong>Comments:</strong></Text>
          <Text style={styles.textarea}>     </Text>
        </View>

        <View style={styles.goal}>
          <View style={styles.div_wrapper}>
          <View style={styles.Flex_div}><Text style={styles.text}><strong>Goal #3:</strong></Text>
          <Text style={styles.textarea}>     </Text>
          </View>
          <View  style={styles.Flex_div}>
            <Text style={styles.text}><strong>Status of Goal:</strong></Text>
          <Text style={styles.textarea}>     </Text>
          </View>
          </View>
          <Text style={styles.text}><strong>Comments:</strong></Text>
          <Text style={styles.textarea}>     </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>Goals for Next Meeting</Text>
        <View style={styles.goal}>

          <View style={styles.div_wrapper}>
          <View style={styles.Flex_div}>
            <Text style={styles.text}><strong>Goal #1:</strong></Text>
          <Text style={styles.textarea}>     </Text>
          </View>
          <View  style={styles.Flex_div}>
            <Text style={styles.text}><strong>Priority:</strong></Text>
          <Text style={styles.textarea}>     </Text>
          </View>
          <View  style={styles.Flex_div}>
            <Text style={styles.text}><strong>To be completed by:</strong></Text>
          <Text style={styles.textarea}>     </Text>
          </View>
          </View>

          <View style={styles.div_wrapper}>
          <View style={styles.Flex_div}>
            <Text style={styles.text}><strong>Goal #1:</strong></Text>
          <Text style={styles.textarea}>     </Text>
          </View>
          <View  style={styles.Flex_div}>
            <Text style={styles.text}><strong>Priority:</strong></Text>
          <Text style={styles.textarea}>     </Text>
          </View>
          <View  style={styles.Flex_div}>
            <Text style={styles.text}><strong>To be completed by:</strong></Text>
          <Text style={styles.textarea}>     </Text>
          </View>
          </View>

          <View style={styles.div_wrapper}>
          <View style={styles.Flex_div}>
            <Text style={styles.text}><strong>Goal #1:</strong></Text>
          <Text style={styles.textarea}>     </Text>
          </View>
          <View  style={styles.Flex_div}>
            <Text style={styles.text}><strong>Priority:</strong></Text>
          <Text style={styles.textarea}>     </Text>
          </View>
          <View  style={styles.Flex_div}>
            <Text style={styles.text}><strong>To be completed by:</strong></Text>
          <Text style={styles.textarea}>     </Text>
          </View>
          </View>
        </View>
      </View>


      <View style={styles.section}>
        <Text style={styles.main_heading}>CRAFTSMEN TOOLBOX</Text>
        <View style={styles.goal}>
          <Text style={styles.text}><strong>Describe any new technology you started using and share the name of the app or website:</strong></Text>
          <Text style={styles.textarea}>     </Text>

          <Text style={styles.text}><strong>Describe any new products you have used in the last 6 months & share the name and website:</strong></Text>
          <Text style={styles.textarea}>     </Text>

          
          <Text style={styles.text}><strong>Describe something that you do with each project that sets you apart from your competition:</strong></Text>
          <Text style={styles.textarea}>     </Text>
        </View>
      </View>


      <View style={styles.section}>
        <Text style={styles.main_heading}>CRAFTSMEN CHECK-UP</Text>
        <View style={styles.goal}>
          <Text style={styles.text}><strong>What is your level of commitment to our club?</strong></Text>
          <Text style={styles.textarea}>     </Text>

          <Text style={styles.text}><strong>List Something(s) you can do to contribute to our club.</strong></Text>
          <Text style={styles.textarea}>     </Text>

          
          <Text style={styles.text}><strong>How is your present health, wellbeing, family life?</strong></Text>
          <Text style={styles.textarea}>     </Text>

          <Text style={styles.text}><strong>Have any items on your contact info changed? </strong>
          <View style={styles.checkbox}><View style={styles.checked} />Yes</View> <View style={styles.checkbox}><View style={styles.checked} />No</View></Text>
          <Text style={styles.textarea}>     </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default MemberUpdatePDF;
