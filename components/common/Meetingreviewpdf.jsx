import React from "react";
import {
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register font
Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
  },
  main_heading: {
    fontSize: 16,
    padding: 8,
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
    backgroundColor: "#000",
    color: "#fff",
    marginBottom: 30,
  },
  subheader: {
    fontSize: 15,
    marginTop: 20,
    textDecoration: "underline",
    textAlign: "center",
  },
  textBold: {
    fontFamily: "Open Sans",
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
  },
  // text: {
  //   marginBottom: 8,
  //   fontSize: 13,
  //   fontFamily: "Open Sans",
  // },
  // textarea: {
  //   padding: 8,
  //   // border: "1px solid #000",
  //   marginBottom: 10,
  //   width: "100%",
  //   fontSize: 11,
  //   minHeight: 35,
  //   fontFamily: "Open Sans",
  // },
     text: {
    marginBottom: 8,
    fontSize: 13,
    color: "#000",
    break: "auto",
    overflow: "wrap",
    fontWeight: "bold",
    fontFamily: "Open Sans",
  },
  textarea: {
    padding: '2 0 8',
    // border: "1px solid #000",
    marginBottom: 10,
    width: "100%",
    display: "inline-block",
    fontSize: 11,
    break: "auto",
    minHeight: 35,
    overflow: "wrap",
    fontWeight: "400",
    color: "#333",
  },
  goal: {
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
  },
  memberUpdate: {
    fontWeight: 900,
    fontSize: 24,
  },
  imageWrapper: {
    textAlign: "center",
    marginVertical: 10,
  },
  image: {
    width: "50%",
    objectFit: "contain",
    marginVertical: 10,
  },
});

const MeetingReviewPdf = (props) => {
  const state = props?.state || {};
  const meetingReviews = state?.meetingReviews?.[0];
  const technologyData = state?.technologyData?.[0];
  const companyName = props?.companyName || "";

  console.log(technologyData,meetingReviews ,"data here  to see of download")
  const fallMeetingQuestions =
    meetingReviews?.fallmeeting_review_update_questions || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.imageWrapper}>
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/craftsmen-cadd2.appspot.com/o/image%20(3)%20(1).png?alt=media&token=c033130e-7304-4715-980e-95f25f3501aa"
            style={styles.image}
          />
        </View>

        <View style={styles.header}>
          <Text style={styles.memberUpdate}>
            Member Update /{" "}
            <Text style={{ fontStyle: "italic", fontSize: 18, textTransform: "capitalize" }}>
              {fallMeetingQuestions.length ? "Spring 2025" : "Fall 2025"}
            </Text>
          </Text>
          <Text style={styles.subheader}>{companyName}</Text>
        </View>

        <View>
          <Text style={styles.main_heading}>FALL 2025 MEETING REVIEW</Text>

          <View style={styles.goal}>
            {fallMeetingQuestions.length ? (
              fallMeetingQuestions.map((res, index) => (
                <React.Fragment key={index}>
                  <Text style={styles.text}>{res?.question}</Text>
                  <Text style={[styles.textarea]}>{res?.answer}</Text>
                </React.Fragment>
              ))
            ) : (
              <>
                <Text style={styles.text}>
                  What was your most valuable take away from our fall meeting?
                </Text>
                <Text style={styles.textarea}>{meetingReviews?.fall_meeting}</Text>

                <Text style={styles.text}>
                  Have you implemented any of Jim Weber’s estate/financial planning recommendations into your business and/or personal finances?
                </Text>
                <Text style={styles.textarea}>{meetingReviews?.personal_finances}</Text>
              </>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MeetingReviewPdf;
