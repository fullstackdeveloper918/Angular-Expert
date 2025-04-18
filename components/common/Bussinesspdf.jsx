import React from "react";
import logo from "../../assests/images/logo.png"
import {
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
  Font 
} from "@react-pdf/renderer";
Font.register({
  family: 'Open Sans',
  fonts: [
  { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
  { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 }
  ]
  });

  const styles = StyleSheet.create({
    textBold: {
      fontFamily: "Open Sans",
      fontWeight: "bold",
      fontSize: 16,
      textTransform: "uppercase",
    },
    page: {
      padding: 20,
      background: "#fff",
    },
    header: {
      fontSize: 15,
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: 10,
    },
    subheader: {
      fontSize: 15,
      textAlign: "center",
      marginBottom: 20,
    },
    question: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 5,
    },
    answer: {
      fontSize: 12,
      marginBottom: 15,
      marginTop: 5,
    },
    section: {
      marginBottom: 20,
    },
    main_heading: {
      fontSize: "16px",
      padding: "8px",
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      fontWeight: "bold",
      textTransform: "uppercase",
      backgroundColor: "#000",
      width: "100%",
      color: "#fff",
      marginBottom: "30px",
    },
  });

const BussinessPDF = (props) => {
  console.log(props,"popopopopo");
  
  const photoSection = props?.state?.photo_section || [];

  const companyNameMap = {
    "augusta": "Augusta Homes, Inc.",
    "buffington": "Buffington Homes, L.P.",
    "cabin": "Cabin John Builders",
    "cataldo": "Cataldo Custom Builders",
    "david_campbell": "The DCB",
    "dc_building": "DC Building Inc.",
    "Ddenman_construction": "Denman Construction, Inc.",
    "ellis": "Ellis Custom Homes",
    "tm_grady_builders": "T.M. Grady Builders",
    "hardwick": "Hardwick G. C.",
    "homeSource": "HomeSource Construction",
    "ed_nikles": "Ed Nikles Custom Builder, Inc.",
    "olsen": "Olsen Custom Homes",
    "raykon": "Raykon Construction",
    "matt_sitra": "Matt Sitra Custom Homes",
    "schneider": "Schneider Construction, LLC",
    "shaeffer": "Shaeffer Hyde Construction",
    "split": "Split Rock Custom Homes",
    "tiara": "Tiara Sun Development"
  };

  const companyName = companyNameMap[props?.state?.company_name || ""] || "N/A";

  const groupedQuestions = props?.state?.businessUpdate[0]?.business_update_questions.reduce((acc, question) => {
    const { subheading_title } = question;
    if (!acc[subheading_title]) {
      acc[subheading_title] = [];
    }
    acc[subheading_title].push(question);
    return acc;
  }, {});

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/craftsmen-cadd2.appspot.com/o/image%20(3)%20(1).png?alt=media&token=c033130e-7304-4715-980e-95f25f3501aa"
            style={{ width: "50%", objectFit: "contain", margin: "10px auto 15px" }}
            alt="Image"
          />
        </View>

     <View style={styles.header}>
                 <Text style={styles.memberUpdate}>
                   Member Update /
                   <Text
                     style={{
                       fontStyle: "italic",
                       textTransform: "capitalize",
                     }}
                   >
                     {props?.state?.businessUpdate.length ? "Spring 2025" :
                       "Fall 2024"}
                   </Text>
                 </Text>
                 <Text style={styles.subheader}>{companyName}</Text>
               </View>
        
        <View style={styles.subheader}>
          <Text>{props?.companyName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.main_heading}>Business Update</Text>

          {Object.keys(groupedQuestions).map((subheadingTitle) => (
            <View key={subheadingTitle}>
              {/* Render the subheading just once */}
              <Text style={styles.textBold}>{subheadingTitle}</Text>

              {/* Render questions and answers for this subheading */}
              {groupedQuestions[subheadingTitle].map((res, index) => (
                <View key={index} style={{ marginBottom: 20 }}>
                  {/* Question */}
                  <Text style={styles.question}>{res?.question}</Text>

                  {/* Answer */}
                  <Text style={styles.answer}>{res?.answer}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default BussinessPDF;
