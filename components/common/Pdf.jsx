import React from "react";
import {
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
const styles = StyleSheet.create({
  page: {
    padding: 20,
    background: "#fff",
    break: "auto",
    overflow: "wrap",
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
    fontStyle: "italic",
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
    fontSize: 13,
    color: "#000",
    break: "auto",
    overflow: "wrap",
    fontWeight: "bold",
  },
  textarea: {
    padding: 8,
    border: "1px solid #000",
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
    // display: "flex",
    // gap: 5,
    width: "100%",
    // flexWrap:"wrap",
  },
  memberUpdate: {
    fontWeight: 900,
    fontSize: 24,
  },
  heightGiven: {
    minHeight: 400,
  },
  images_div: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    flexDirection: "row",
  },
  innderImg: {
    width: `100%`,
    maxWidth: "270px",
    height: "auto",
    minHeight: "350px",
    maxHeight: "350px",
    objectFit: "cover",
    // flex:'1 0 47%'
  },
});

const MemberUpdatePDF = (props) => {
  const photoSection = props?.state?.photo_section || [];

  const options = { httpHeaders: { crossOrigin: "anonymous" } };
  // <Image key={imageIndex} style={{ width: 100, height: 100 }} options={options} src={{ uri: ${file.url}, method: "GET", headers: { Pragma: 'no-cache', "Cache-Control": "no-cache" }, body: "" }} />
  const companyNameMap = {
    augusta: "Augusta Homes, Inc.",
    buffington: "Buffington Homes, L.P.",
    cabin: "Cabin John Builders",
    cataldo: "Cataldo Custom Builders",
    david_campbell: "The DCB",
    dc_building: "DC Building Inc.",
    Ddenman_construction: "Denman Construction, Inc.",
    ellis: "Ellis Custom Homes",
    tm_grady_builders: "T.M. Grady Builders",
    hardwick: "Hardwick G. C.",
    homeSource: "HomeSource Construction",
    ed_nikles: "Ed Nikles Custom Builder, Inc.",
    olsen: "Olsen Custom Homes",
    raykon: "Raykon Construction",
    matt_sitra: "Matt Sitra Custom Homes",
    schneider: "Schneider Construction, LLC",
    shaeffer: "Shaeffer Hyde Construction",
    split: "Split Rock Custom Homes",
    tiara: "Tiara Sun Development",
  };

  const companyName = companyNameMap[props?.state?.company_name || ""] || "N/A";

  const newArr =
    props?.state?.photo_section?.fileUrls?.length &&
    Object.values(props?.state?.photo_section?.fileUrls[0]);

  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={{ textAlign: "center", display: "block" }}>
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/craftsmen-cadd2.appspot.com/o/image%20(3)%20(1).png?alt=media&token=c033130e-7304-4715-980e-95f25f3501aa"
              style={{
                width: "50%",
                objectFit: "contain",
                textAlign: "center",
                margin: "10px auto 15px",
              }}
              alt="Image"
            />
          </View>
          <View style={styles.header}>
            <Text style={styles.memberUpdate}>
              Member Update /
              <Text
                style={{
                  fontStyle: "italic",
                  fontSize: 18,
                  textTransform: "capitalize",
                }}
              >
                Fall 2024
              </Text>
            </Text>
            <Text style={styles.subheader}>{companyName}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.main_heading}>Business Update</Text>
            <Text style={styles.text}>Current financial position:</Text>
            <Text style={[styles.textarea, styles.heightGiven]} wrap={false}>
              {props?.state?.financial_position}
            </Text>
            <Text style={styles.text} wrap={false}>
              Current sales positions, hot prospects, recently contracted work:
            </Text>
            <Text style={styles.textarea} wrap={false}>
              {props?.state?.sales_position}
            </Text>
            <Text style={styles.text}>
              Accomplishments in the last 6 months:
            </Text>
            <Text style={styles.textarea} wrap={false}>
              {props?.state?.accomplishments}
            </Text>
            <Text style={styles.text}> HR position &/or needs: </Text>
            <Text style={styles.textarea} wrap={false}>
              {props?.state?.hr_position}
            </Text>
            <Text style={styles.text}>
              Current challenges (e.g., problem client, personnel issue(s),
              trade availability, rising costs, supply chain):
            </Text>
            <Text style={styles.textarea} wrap={false}>
              {props?.state?.current_challenges}
            </Text>
            <Text style={styles.text}>
              How can the Craftsmen aid or support you with these challenges?
            </Text>
            <Text style={styles.textarea} wrap={false}>
              {props?.state?.craftsmen_support}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.main_heading}>Goals</Text>
            <Text style={styles.subheading}>Goals from Last Meeting</Text>
            {props?.state?.goal_last_meeting?.map((res, index) => (
              <View style={styles.goal} key={index}>
                <View style={styles.div_per}>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text}> Goal #{index + 1}: </Text>
                    <Text style={styles.textarea} wrap={false}>
                         {res?.goal}  
                    </Text>
                  </View>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text}> Status of Goal: </Text>
                    <Text style={styles.textarea} wrap={false}>
                         {res?.status}  
                    </Text>
                  </View>
                </View>
                <Text style={styles.text}> Comments: </Text>
                <Text style={styles.textarea} wrap={false}>
                    {res?.comment}   
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.subheading}>Goals for Next Meeting</Text>
            {props?.state?.goal_next_meeting?.map((res, index) => (
              <View style={styles.goal} key={index}>
                <View style={styles.div_per}>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text}> Goal #{index + 1}: </Text>
                    <Text style={styles.textarea} wrap={false}>
                         {res?.goal}  
                    </Text>
                  </View>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text}> Priority: </Text>
                    <Text style={styles.textarea} wrap={false}>
                        {res?.status}   
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.main_heading}>CRAFTSMEN TOOLBOX</Text>
            <View style={styles.goal}>
              <Text style={styles.text}>
                Describe any new technology you started using and share the name
                of the app or website:
              </Text>
              <Text style={styles.textarea} wrap={false}>
                {props?.state?.technology}
              </Text>

              <Text style={styles.text}>
                Describe any new products you have used in the last 6 months &
                share the name and website:
              </Text>
              <Text style={styles.textarea} wrap={false}>
                {props?.state?.products}
              </Text>

              <Text style={styles.text}>
                Describe something that you do with each project that sets you
                apart from your competition:
              </Text>
              <Text style={styles.textarea} wrap={false}>
                   {props?.state?.project}   
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.main_heading}>CRAFTSMEN CHECK-UP</Text>
            <View style={styles.goal}>
              <Text style={styles.text}>
                What is your level of commitment to our club?
              </Text>
              <Text style={styles.textarea} wrap={false}>
                {props?.state?.commitment}
              </Text>

              <Text style={styles.text}>
                List Something(s) you can do to contribute to our club.
              </Text>
              <Text style={styles.textarea} wrap={false}>
                {props?.state?.contribute}
              </Text>

              <Text style={styles.text}>
                How is your present health, wellbeing, family life?
              </Text>
              <Text style={styles.textarea} wrap={false}>
                {props?.state?.wellbeing}
              </Text>

              <Text style={styles.text}>
                Have any items on your contact info changed?
              </Text>
              <Text style={styles.textarea} wrap={false}>
                {props?.state?.contact_info}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.main_heading}>FALL 2023 MEETING REVIEW</Text>
            <View style={styles.goal}>
              <Text style={styles.text}>
                What was your most valuable take away from our fall meeting?
              </Text>
              <Text style={styles.textarea} wrap={false}>
                {props?.state?.fall_meeting}
              </Text>

              <Text style={styles.text}>
                Have you implemented any of Jim Weber’s estate/financial
                planning reccomendations into your business and/or personal
                finances?
              </Text>
              <Text style={styles.textarea} wrap={false}>
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
              <Text style={styles.textarea} wrap={false}>
                {props?.state?.estimating}
              </Text>

              <Text style={styles.textarea} wrap={false}>
                {props?.state?.accountability}
              </Text>
              <Text style={styles.textarea} wrap={false}>
                {props?.state?.productivity}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.main_heading}> ADDITIONAL QUESTIONS</Text>
            {props?.state?.questions?.map((res, index) => (
              <View style={styles.goal} key={index}>
                <View style={styles.div_wrapper}>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text}> {res?.question} </Text>
                    <Text style={styles.textarea} wrap={false}>
                         {res?.answer}  
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.section}>
            <Text style={styles.main_heading}>PHOTO SECTION</Text>

            <View style={styles.goal}>
              <View style={styles.div_wrapper}>
                {Array.isArray(newArr) &&
                  newArr
                    .sort((a, b) => a - b)
                    .map((item, index) => (
                      <View style={styles.goal} key={index}>
                        <View style={styles.goal_two}>
                          <View style={styles.images_div}>
                            {Array.isArray(item?.images) &&
                              item.images.map((imageUrl, imgIndex) => (
                                <React.Fragment key={imgIndex}>
                                  <Image
                                    style={styles.innderImg}
                                    options={options}
                                    src={imageUrl}
                                    method="GET"
                                    headers={{
                                      Pragma: "no-cache",
                                      "Cache-Control": "no-cache",
                                    }}
                                    alt={item?.comment}
                                  />
                                </React.Fragment>
                              ))}
                          </View>

                          <Text
                            style={[
                              styles.subheading,
                              styles.marginequal,
                              styles.block,
                            ]}
                          >
                            Comment: {item?.comment}
                          </Text>
                        </View>
                      </View>
                    ))}
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </>
  );
};

export default MemberUpdatePDF;
