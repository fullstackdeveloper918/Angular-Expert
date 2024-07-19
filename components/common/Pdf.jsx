import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
const styles = StyleSheet.create({
  page: {
    padding: 30,
    background: "#fff",
    paddingLeft: 10,
    paddingBottom: 20,
    paddingRight: 10,
    paddingTop: 20,
  },
  section: {
    padding: 10,
    flexDirection: "column",
    display: "flex",
  },
  header: {
    fontSize: 15,
    marginBottom: 30,
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
    fontSize: "14px",
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
    fontStyle: "italic",
    fontWeight: "400",
  },
  subheader: {
    fontSize: 13,
    marginBottom: 10,
    textTransform: "capitalize",
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
  },
  textarea: {
    padding: 8,
    border: "1px solid #ccc",
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    width: "100%",
    display: "inline-block",
    color: "#000",
    fontSize: 12,
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
    width: "100%",
    maxWidth: "70%",
    overflow: "hidden",
  },
});

const MemberUpdatePDF = (props) => {
  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text>
              Member Update / <Text style={styles.itali_text}>Spring 2024</Text>
            </Text>
            <Text style={styles.subheader}>Select Company Name</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.main_heading}>Business Update</Text>
            <Text style={styles.text}>Current financial position:</Text>
            <Text style={styles.textarea}>
                {props?.state?.financial_position}   
            </Text>
            <Text style={styles.text}>
              {" "}
              Current sales positions, hot prospects, recently contracted work:{" "}
            </Text>
            <Text style={styles.textarea}>
                 {props?.state?.sales_position}  
            </Text>
            <Text style={styles.text}>
              {" "}
              Accomplishments in the last 6 months:{" "}
            </Text>
            <Text style={styles.textarea}>
                 {props?.state?.accomplishments}  
            </Text>
            <Text style={styles.text}> HR position &/or needs: </Text>
            <Text style={styles.textarea}>
                {props?.state?.hr_position}   
            </Text>
            <Text style={styles.text}>
              {" "}
              Current challenges (e.g., problem client, personnel issue(s),
              trade availability, rising costs, supply chain):{" "}
            </Text>
            <Text style={styles.textarea}>
                {props?.state?.current_challenges}   
            </Text>
            <Text style={styles.text}>
              {" "}
              How can the Craftsmen aid or support you with these challenges?{" "}
            </Text>
            <Text style={styles.textarea}>
                {props?.state?.craftsmen_support}   
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.main_heading}>Goals</Text>
            <Text style={styles.subheading}>Goals from Last Meeting</Text>
            {props?.state?.goal_last_meeting?.map((res, index) => (
              <View style={styles.goal} key={index}>
                <View style={styles.div_wrapper}>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text}> Goal #{index + 1}: </Text>
                    <Text style={styles.textarea}>   {res?.goal}  </Text>
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
            {props?.state?.goal_next_meeting?.map((res, index) => (
              <View style={styles.goal} key={index}>
                <View style={styles.div_wrapper}>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text}> Goal #{index + 1}: </Text>
                    <Text style={styles.textarea}>   {res?.goal}  </Text>
                  </View>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text}> Priority: </Text>
                    <Text style={styles.textarea}>  {res?.status}   </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.main_heading}>CRAFTSMEN TOOLBOX</Text>
            <View style={styles.goal}>
              <Text style={styles.text}>
                {" "}
                Describe any new technology you started using and share the name
                of the app or website:{" "}
              </Text>
              <Text style={styles.textarea}>
                   {props?.state?.technology}  
              </Text>

              <Text style={styles.text}>
                {" "}
                Describe any new products you have used in the last 6 months &
                share the name and website:{" "}
              </Text>
              <Text style={styles.textarea}>
                  {props?.state?.products}    
              </Text>

              <Text style={styles.text}>
                {" "}
                Describe something that you do with each project that sets you
                apart from your competition:{" "}
              </Text>
              <Text style={styles.textarea}>   {props?.state?.project}   </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.main_heading}>CRAFTSMEN CHECK-UP</Text>
            <View style={styles.goal}>
              <Text style={styles.text}>
                {" "}
                What is your level of commitment to our club?{" "}
              </Text>
              <Text style={styles.textarea}>
                   {props?.state?.commitment}   
              </Text>

              <Text style={styles.text}>
                {" "}
                List Something(s) you can do to contribute to our club.{" "}
              </Text>
              <Text style={styles.textarea}>
                   {props?.state?.contribute}   
              </Text>

              <Text style={styles.text}>
                {" "}
                How is your present health, wellbeing, family life?{" "}
              </Text>
              <Text style={styles.textarea}>
                    {props?.state?.wellbeing}  
              </Text>

              <Text style={styles.text}>
                {" "}
                Have any items on your contact info changed?
              </Text>
              <Text style={styles.textarea}>
                   {props?.state?.contact_info}   
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.main_heading}>FALL 2023 MEETING REVIEW</Text>
            <View style={styles.goal}>
              <Text style={styles.text}>
                {" "}
                What was your most valuable take away from our fall meeting?{" "}
              </Text>
              <Text style={styles.textarea}>
                   {props?.state?.fall_meeting}   
              </Text>

              <Text style={styles.text}>
                {" "}
                Have you implemented any of Jim Weber’s estate/financial
                planning reccomendations into your business and/or personal
                finances?{" "}
              </Text>
              <Text style={styles.textarea}>
                   {props?.state?.personal_finances}   
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.main_heading}>
              SPRING 2024 MEETING PREPARATION
            </Text>
            <Text style={styles.subheading}>
              LIST THREE ROUNDTABLE TOPICS THAT YOU WANT TO COVER WITH SPRING
              MEETING (IN ORDER OF IMPORTANCE)
            </Text>
            <View style={styles.goal}>
              <Text style={styles.textarea}>
                   {props?.state?.estimating}   
              </Text>

              <Text style={styles.textarea}>
                   {props?.state?.accountability}   
              </Text>
              <Text style={styles.textarea}>
                   {props?.state?.productivity}   
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.main_heading}>PHOTO SECTION</Text>
            <Text style={styles.subheading}>
              Share photos of current projects or additional information
              regarding comments in your update.
            </Text>
            <Text style={styles.subheading}>
              Please paste a dropbox link for each project in the boxes
              indicated below, and write a brief summary of each project in the
              comment section.
            </Text>
            {props?.state?.photo_comment?.map((res, index) => (
              <View style={styles.goal} key={index}>
                <View style={styles.div_wrapper}>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text}> PROJECT #{index + 1}: </Text>
                    <Image
                      src={
                        "https://pbs.twimg.com/profile_images/1797665112440045568/305XgPDq_400x400.png"
                      }
                      style={styles.imgg}
                      width={500}
                      height={500}
                    />
                  </View>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text}>
                      {" "}
                      PROJECT {index + 1} COMMENTS::{" "}
                    </Text>
                    <Text style={styles.textarea}>  {res?.comment}   </Text>
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

export default MemberUpdatePDF;
