import React from "react";
import logo from "../../assests/images/logo.png"
import {
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";



import validation from "@/utils/validation";
const styles = StyleSheet.create({
  page: {
    padding: 20,
    background: "#fff",
    break: 'auto', // Ensure text can break across pages
    overflow: 'wrap',
  },
  section: {
    padding: 10,
    flexDirection: "column",
    display: "flex",
  },
  header: {
    fontSize: 15,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    fontWeight: "bold",
    textTransform: "uppercase",
    padding: "10",
    marginBottom: "10px",
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
  itali_text: {
    fontSize: "13px",
    fontStyle: 'italic',
    fontWeight: "400",
    fontFamily: "Roboto",
  },
  subheader: {
    fontSize: 15,
    // marginBottom: ,
    textTransform: "capitalize",
    textDecoration: "underline",
  },
  subheading: {
    fontSize: 13,
    marginBottom: 10,
    textTransform: "capitalize",
    textAlign: "left",
    fontWeight: "bold",
    textTransform: "uppercase",
    borderBottom: "3px solid #d2d2d2",
    marginBottom: "20px",
    paddingBottom: "10px",
  },
  text: {
    marginBottom: 8,
    fontSize: 12,
    color: "#000",
    break: 'auto',
    overflow: "wrap",
  },
  textarea: {
    padding: 8,
    border: "1px solid #000",
    marginBottom: 10,
    width: "100%",
    display: "inline-block",
    color: "#000",
    fontSize: 12,
    break: 'auto',
    minHeight: 35,
    overflow: 'wrap',
  },
  goal: {
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
  },

  div_wrapper: {
    display: "flex",
    gap: "30px",
    width: "100%",
  },
  checkbox: {
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 5,
  },
  checked: {
    width: "12px",
    height: "12px",
    backgroundColor: "#0000001a",
    display: "inline-block",
    border: "1px solid #000",
    cursor: "pointer",
    marginRight: 5,
  },
  imgg: {
    margin: "auto",
    objectFit: "contain",
    width: "400px",
    height: "400px",
  },
  logoNew: {
    width: "100%",
    maxWidth: "100%",
    margin: "auto",
  },
  marginequal: {
    marginVertical: 10,
  },
  flexBox: {
    display: "flex",
  },
  goal_two: {
    display: "flex",
    gap: 5,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  memberUpdate: {
    fontWeight: 900,
    fontSize: 24,
  },
  heightGiven: {
    minHeight: 400,
  },
});

const GoalsPDF = (props) => {
  const photoSection = props?.state?.photo_section || [];

  const options = { httpHeaders: { 'crossOrigin': 'anonymous' }, };
  // <Image key={imageIndex} style={{ width: 100, height: 100 }} options={options} src={{ uri: ${file.url}, method: "GET", headers: { Pragma: 'no-cache', "Cache-Control": "no-cache" }, body: "" }} />
  
  const newArr = props?.state?.photo_section?.fileUrls?.length && Object.values(props?.state?.photo_section?.fileUrls[0])

  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={{ textAlign: "center", display: "block" }}>
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/craftsmen-cadd2.appspot.com/o/image%20(3)%20(1).png?alt=media&token=c033130e-7304-4715-980e-95f25f3501aa"
              style={{ width: "50%", objectFit: 'contain', textAlign: "center", margin: "10px auto 15px" }}
              alt="Image"
            /></View>
          <View style={styles.header}>
            <Text style={styles.memberUpdate}>
              Member Update / <Text style={{ fontStyle: 'italic', fontSize: 18, textTransform: "capitalize" }}>  {props?.state?.futureMeetings[0]?.goal_next_meeting?.length ? "Spring 2025" :
                "Fall 2024"}</Text>
            </Text>
            <Text style={styles.subheader}>
              {props?.companyName}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.main_heading}>Goals</Text>
            <Text style={styles.subheading}>Goals from Last Meeting</Text>
            {props?.state?.lastNextMeetings[0]?.goal_next_meeting?.map((res, index) => (
              <View style={styles.goal} key={index}>
                <View style={styles.div_wrapper}>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text}> Goal #{index + 1}: </Text>
                    <Text style={styles.textarea}>   {res?.name}  </Text>
                  </View>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text}> Status of Goal: </Text>
                    <Text style={styles.textarea}>   {res?.status}  </Text>
                  </View>
                </View>
                <Text style={styles.text}> Comments: </Text>
                <Text style={styles.textarea}>  {res?.comment}   </Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.subheading}>Goals for Next Meeting</Text>
            {props?.state?.futureMeetings[0]?.goal_next_meeting?.map((res, index) => (
              <View style={styles.goal} key={index}>
                <View style={styles.div_wrapper}>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text}> Business Goal #{index + 1}: </Text>
                    <Text style={styles.textarea}>   {res?.name}  </Text>
                  </View>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text}> Priority: </Text>
                    <Text style={styles.textarea}>  {res?.status}   </Text>
                  </View>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text}> To be Completed By:</Text>
                    <Text style={styles.textarea} wrap={false}>
                      {res?.to_be_completed_by}

                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    </>
  );
};

export default GoalsPDF;
