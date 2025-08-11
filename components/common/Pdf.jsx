import React from "react";
// import { useSelector } from "react-redux";
// import dayjs from "dayjs";
import {
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
  usePage,
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
    fontFamily: "Open Sans",  // Use the registered font family
    fontWeight: "bold",       // You can also set font weight directly here
    fontSize: 16,
    textTransform: "uppercase",
  },
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
    marginTop: 20,
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
    fontFamily: "Open Sans",
  },
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
    // display: "inline-block",
    fontSize: 11,
    // break: "auto",
    // minHeight: 35,
    // overflow: "wrap",
    fontWeight: "400",
    color: "#333",
  },
  textareanew: {
    padding: ' 8px ',
    border: "1px solid #000",
    marginBottom: 10,
    width: "100%",
    // display: "inline-block",
    fontSize: 11,
    // break: "auto",
    // minHeight: 35,
    // overflow: "wrap",
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
    minHeight: 550,
  },
  heightGiventab: {
    minHeight: 450,
  },
  heightGiventbottom: {
    minHeight: 390,
  },
  heightGivenwrap: {
    minHeight: 350,
    marginBottom: '20px',
  },
  heightGivenwrapper: {
    minHeight: 330,
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
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
  },
  pageNumber: {
    fontSize: 12,
    color: "#ff6347", // Change color here (e.g., tomato red)
  },
});



const MemberUpdatePDF = (props) => {
  console.log(props?.state, "props s");
  // console.log(props?.subheadinglist1, "sadas");

  const options = { httpHeaders: { crossOrigin: "anonymous" } };


  // const companyName = companyNameMap[props?.state?.company_name || ""] || "N/A";


  // console.log("game changers", companyName)
  const newArr =
    props?.state?.photo_section?.fileUrls?.length &&
    Object.values(props?.state?.photo_section?.fileUrls[0]);





  // const getSeasonByReviewMonth = (month) =>
  //     month >= 1 && month <= 6 ? 'Spring' : month >= 7 && month <= 12 ? 'Fall' : 'Invalid Month';


  // const meeting_review_month= dayjs(props?.state?.meetings?.lastMeeting?.start_meeting_date).format("MM")
  // const season_review_month = getSeasonByReviewMonth(meeting_review_month);
  // console.log(season_review_month,"season");

  // const meeting_review_year= dayjs(props?.state?.meetings?.lastMeeting?.start_meeting_date).format("YYYY")
  // console.log(meeting_review_year,"meeting_review_year");


  // const meeting_prepration_month= dayjs(props?.state?.meetings?.NextMeeting?.start_meeting_date).format("MM")
  // const season_prepration_month = getSeasonByReviewMonth(meeting_prepration_month);
  // console.log(season_prepration_month,"season_prepration_month");



  // const meeting_prepration_year= dayjs(props?.state?.meetings?.NextMeeting?.start_meeting_date).format("YYYY")
  // console.log(meeting_prepration_year,"meeting_prepration_year");
  const groupedQuestions = props?.state?.businessUpdate[0]?.business_update_questions.reduce((acc, question) => {
    const { subheading_title } = question;
    if (!acc[subheading_title]) {
      acc[subheading_title] = [];
    }
    acc[subheading_title].push(question);
    return acc;
  }, {});
  console.log(groupedQuestions, "groupedQuestions");
  // if (!groupedQuestions) {
  //   return
  // }
  console.log("running properly")
  return (
    <>
      <Document>
        <Page size="A4" style={styles.page} wrap >
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
                  textTransform: "capitalize",
                }}
              >
                {props?.state?.businessUpdate.length ? "Spring 2025" :
                  "Fall 2024"}
              </Text>
            </Text>
            <Text style={styles.subheader}>{props?.companyName}</Text>
          </View>
          {props?.state?.logo_url?
          <View style={{ textAlign: "center", display: "block" }}>
            <Image
              src={props?.state?.logo_url}
              style={{
                width: "50%",
                objectFit: "contain",
                textAlign: "center",
                margin: "10px auto 15px",
              }}
              alt="Image"
            />
          </View>:""}
          {/* Bussines Update */}
          <View style={styles.section}>
            <Text style={styles.main_heading}>Business Update</Text>
            {props?.state?.businessUpdate[0]?.business_update_questions?.length ?
             
             Object.keys(groupedQuestions).map((subheadingTitle) => (
               <>
                 <Text style={styles.textBold}>{subheadingTitle}</Text>
                 {/* Display questions for the current subheading */}
                 {groupedQuestions[subheadingTitle].map((res) => (
                   // console.log(question,"yyy")
                   <>
                     <Text style={styles.text} >{res?.question}</Text>
                     <Text style={[styles.textarea]} wrap={true}>
                       {res.answer}
                     </Text>
                   </>
                 ))}
               </>



             ))
              :
              <> 
              <Text style={styles.text}>Current financial position:</Text>
              <Text style={[styles.textarea, styles.heightGivenwrapper]} wrap={false}>
                {props?.state?.businessUpdate[0]?.financial_position}
              </Text>
              <Text style={styles.text} wrap={false}>
                Current sales positions, hot prospects, recently contracted work:
              </Text>
              <Text style={styles.textarea} wrap={false}>
                {props?.state?.businessUpdate[0]?.sales_position}
              </Text>
              <Text style={styles.text}>
                Accomplishments in the last 6 months:
              </Text>
              <Text style={styles.textarea} wrap={false}>
                {props?.state?.businessUpdate[0]?.accomplishments}
              </Text>
              <Text style={styles.text}> HR position &/or needs: </Text>
              <Text style={styles.textarea} wrap={false}>
                {props?.state?.businessUpdate[0]?.hr_position}
              </Text>
              <Text style={styles.text}>
                Current challenges (e.g., problem client, personnel issue(s),
                trade availability, rising costs, supply chain):
              </Text>
              <Text style={styles.textarea} wrap={false}>
                {props?.state?.businessUpdate[0]?.current_challenges}
              </Text>
              <Text style={styles.text}>
                How can the Craftsmen aid or support you with these challenges?
              </Text>
              <Text style={styles.textarea} wrap={true}>
                {props?.state?.businessUpdate[0]?.craftsmen_support}
              </Text>
            </> 
            }
          </View>
          {/* Goals Last Meeting */}
          <View style={styles.section}>
            <Text style={styles.main_heading}>Goals</Text>
            <Text style={styles.subheading}>Goals from Last Meeting</Text>
            {props?.state?.lastNextMeetings[0]?.goal_next_meeting?.map((res, index) => (
              <View style={styles.goal} key={index}>
                <View style={styles.div_per}>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text} > Goal #{index + 1}: </Text>
                    <Text style={styles.textareanew} wrap={true}>
                      {res?.name}
                    </Text>
                  </View>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text}> Status of Goal: {res?.status}</Text>
                    {/* <Text style={styles.textarea} wrap={false}>
                         {res?.status}  
                    </Text> */}
                  </View>
                </View>
                <Text style={styles.text} > Comments: </Text>
                <Text style={styles.textareanew} wrap={true}>
                  {res?.comment}
                </Text>
              </View>
            ))}
          </View>
          {/* Goals Next Meeting */}
          <View style={styles.section}>
            <Text style={styles.subheading}>Goals for Next Meeting</Text>
            {props?.state?.futureMeetings[0]?.goal_next_meeting.slice(0,3)?.map((res, index) => (
              <View style={styles.goal} key={index}>
                <View style={styles.div_per}>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text} wrap={false}> Business Goal #{index + 1}: </Text>
                    <Text style={styles.textareanew} wrap={false}>
                      {res?.name}
                    </Text>
                  </View>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text}> Priority: </Text>
                    <Text style={styles.textareanew} wrap={true}>  {res?.status}   </Text>
                  </View>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text} wrap={true}> To be Completed By:</Text>
                    <Text style={styles.textareanew} wrap={true}>
                      {res?.to_be_completed_by}

                    </Text>
                  </View>
                </View>
              </View>
            ))}
            {props?.state?.futureMeetings[0]?.goal_next_meeting.slice(3,4)?.map((res, index) => (
              <View style={styles.goal} key={index}>
                <View style={styles.div_per}>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text} wrap={false}> Personal Goal: </Text>
                    <Text style={styles.textareanew} wrap={false}>
                      {res?.name}
                    </Text>
                  </View>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text}> Priority: </Text>
                    <Text style={styles.textareanew} wrap={true}>  {res?.status}   </Text>
                  </View>
                  <View style={styles.Flex_div}>
                    <Text style={styles.text} wrap={true}> To be Completed By:</Text>
                    <Text style={styles.textareanew} wrap={true}>
                      {res?.to_be_completed_by}

                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          {/* Creaftsmen Toolbox */}
          <View style={styles.section}>
            <Text style={styles.main_heading}>CRAFTSMEN TOOLBOX</Text>
            <View style={styles.goal}>

              {props?.state?.technologyData[0]?.craftsmen_toolbox_update_questions ?
                props?.state?.technologyData[0]?.craftsmen_toolbox_update_questions.map((res, index) =>
                (
                  <>
                    <Text style={styles.text} key={index}>{res?.question}</Text>
                    <Text
                      // style={[styles.textarea, styles.heightGivenwrapper]} wrap={false}
                      style={[styles.textarea]} wrap={true}
                    >
                      {res.answer}
                    </Text>
                  </>
                )
                )
                :

                <>
                  <Text style={styles.text}>
                    Describe any new technology you started using and share the name
                    of the app or website:
                  </Text>
                  <Text style={styles.textarea} wrap={false}>
                    {props?.state?.technologyData[0]?.technology}
                  </Text>

                  <Text style={styles.text}>
                    Describe any new products you have used in the last 6 months &
                    share the name and website:
                  </Text>
                  <Text style={styles.textarea} wrap={false}>
                    {props?.state?.technologyData[0]?.products}
                  </Text>

                  <Text style={styles.text}>
                    Describe something that you do with each project that sets you
                    apart from your competition:
                  </Text>
                  <Text style={styles.textarea} wrap={false}>
                    {props?.state?.technologyData[0]?.project}
                  </Text>
                </>}
            </View>

          </View>
          {/* Craftsmen Checkup */}
          <View style={styles.section}>
            <Text style={styles.main_heading}>CRAFTSMEN CHECK-UP</Text>
            <View style={styles.goal}>


              {props?.state?.craftsMenUpdates[0]?.craftsmen_checkup_update_questions ?
                props?.state?.craftsMenUpdates[0]?.craftsmen_checkup_update_questions.map((res, index) =>
                (
                  <>
                    <Text style={styles.text} key={index}>{res?.question}</Text>
                    <Text
                      // style={[styles.textarea, styles.heightGivenwrapper]} wrap={false}
                      style={[styles.textarea]} wrap={true}
                    >
                      {res.answer}
                    </Text>
                  </>
                )
                )
                :

                <>


                  <Text style={styles.text}>
                    What is your level of commitment to our club?
                  </Text>
                  <Text style={styles.textarea} wrap={false}>
                    {props?.state?.craftsMenUpdates[0]?.commitment}
                  </Text>

                  <Text style={styles.text}>
                    List Something(s) you can do to contribute to our club.
                  </Text>
                  <Text style={styles.textarea} wrap={false}>
                    {props?.state?.craftsMenUpdates[0]?.contribute}
                  </Text>

                  <Text style={styles.text}>
                    How is your present health, wellbeing, family life?
                  </Text>
                  <Text style={styles.textarea} wrap={false}>
                    {props?.state?.craftsMenUpdates[0]?.wellbeing}
                  </Text>

                  <Text style={styles.text}>
                    Have any items on your contact info changed?
                  </Text>
                  <Text style={styles.textarea} wrap={false}>
                    {props?.state?.craftsMenUpdates[0]?.contact_info}
                  </Text>

                </>}
            </View>
          </View>



          {/* Personal Well being check in  */}
          {props?.state?.personalWellBeingUpdates?.length ?
            <View style={styles.section}>
              {/* <Text style={styles.main_heading}>{meeting_review_month} {meeting_review_year} MEETING REVIEW</Text> */}
              <Text style={styles.main_heading}>PERSONAL WELL-BEING CHECK-IN</Text>
              <View style={styles.goal}>

                {props?.state?.personalWellBeingUpdates[0].personal_well_being_update_checkup ?
                  props?.state?.personalWellBeingUpdates[0].personal_well_being_update_checkup?.map((res, index) =>
                  (
                    <>
                      <Text style={styles.text} key={index}>{res?.question}</Text>
                      <Text style={[styles.textarea]} wrap={true}>
                        {res.answer}
                      </Text>
                    </>
                  )
                  )
                  : ""}
              </View>
            </View> : ""}

            {/* Business evolution and industry trends */}
          {props?.state?.businessEvolutionIndustryTrendsUpdates?.length ?
            <View style={styles.section}>
              {/* <Text style={styles.main_heading}>{meeting_review_month} {meeting_review_year} MEETING REVIEW</Text> */}
              <Text style={styles.main_heading}>BUSINESS EVOLUTION & INDUSTRY TRENDS</Text>
              <View style={styles.goal}>

                {props?.state?.businessEvolutionIndustryTrendsUpdates[0].business_evolution_update_industry_trends ?
                  props?.state?.businessEvolutionIndustryTrendsUpdates[0].business_evolution_update_industry_trends?.map((res, index) =>
                  (
                    <>
                      <Text style={styles.text} key={index}>{res?.question}</Text>
                      <Text style={[styles.textarea]} wrap={true}>
                        {res.answer}
                      </Text>
                    </>
                  )
                  )
                  : ""}
              </View>
            </View> : ""}

            {/* Fall 2024 MEETING REVIEW */}
          <View style={styles.section}>
            {/* <Text style={styles.main_heading}>{meeting_review_month} {meeting_review_year} MEETING REVIEW</Text> */}
            <Text style={styles.main_heading}>Fall 2024 MEETING REVIEW</Text>
            <View style={styles.goal}>

              {props?.state?.meetingReviews?.length == 0 || props?.state?.meetingReviews?.length >= 0 ?
                props?.state?.meetingReviews[0]?.fallmeeting_review_update_questions?.map((res, index) =>
                (
                  <>
                    <Text style={styles.text} key={index}>{res?.question}</Text>
                    <Text style={[styles.textarea]} wrap={true}>
                      {res.answer}
                    </Text>
                  </>
                )
                )
                :

                <>

                  <Text style={styles.text}>
                    What was your most valuable take away from our fall meeting?
                  </Text>
                  <Text style={styles.textarea} wrap={false}>
                    {props?.state?.meetingReviews[0]?.fall_meeting}
                  </Text>

                  <Text style={styles.text}>
                    Have you implemented any of Jim Weber’s estate/financial
                    planning reccomendations into your business and/or personal
                    finances?
                  </Text>
                  <Text style={styles.textarea} wrap={false}>
                    {props?.state?.meetingReviews[0]?.personal_finances}
                  </Text>
                </>}
            </View>
          </View>

          {/* ROUNDTABLE TOPICS */}
          {props?.state?.roundTableTopics[0]?.round_table ?
            <View style={styles.section}>
              <Text style={styles.main_heading}>
                {/* {meeting_prepration_month} {meeting_prepration_year} MEETING PREPARATION */}
                ROUNDTABLE TOPICS
              </Text>
              <Text style={styles.subheading}>
                LIST THREE ROUNDTABLE TOPICS THAT YOU WANT TO COVER WITH SPRING
                MEETING (IN ORDER OF IMPORTANCE)
              </Text>
              <View style={styles.goal}>
                <Text style={styles.text}>
                  First roundtable topic
                </Text>
                <Text style={styles.textarea} wrap={true}>
                  {props?.state?.roundTableTopics[0]?.estimating}
                </Text>
                <Text style={styles.text}>
                  Second roundtable topic
                </Text>
                <Text style={styles.textarea} wrap={true}>
                  {props?.state?.roundTableTopics[0]?.accountability}
                </Text>
                <Text style={styles.text}>
                  Third roundtable topic
                </Text>
                <Text style={styles.textarea} wrap={true}>
                  {props?.state?.roundTableTopics[0]?.productivity}
                </Text>

                {props?.state?.roundTableTopics[0]?.round_table?.map((res, index) =>
                (
                  <>
                    <Text style={styles.text} key={index}>{res?.question}</Text>
                    <Text style={[styles.textarea]} wrap={true}>
                      {res.answer}
                    </Text>
                  </>
                )
                )}
              </View>
            </View>

            :
            <View style={styles.section}>
              <Text style={styles.main_heading}>
                {/* {meeting_prepration_month} {meeting_prepration_year} MEETING PREPARATION */}
                Spring 2025 MEETING PREPARATION
              </Text>
              <Text style={styles.subheading}>
                LIST THREE ROUNDTABLE TOPICS THAT YOU WANT TO COVER WITH SPRING
                MEETING (IN ORDER OF IMPORTANCE)
              </Text>
              <View style={styles.goal}>
                <Text style={styles.textarea} wrap={false}>
                  {props?.state?.roundTableTopics[0]?.estimating}
                </Text>

                <Text style={styles.textarea} wrap={false}>
                  {props?.state?.roundTableTopics[0]?.accountability}
                </Text>
                <Text style={styles.textarea} wrap={false}>
                  {props?.state?.roundTableTopics[0]?.productivity}
                </Text>
              </View>
            </View>}

            {/* Adddinational Questions */}
          {props?.state?.personalWellBeingUpdates ? "" :
            <View style={styles.section}>
              <Text style={styles.main_heading} wrap={false}> ADDITIONAL QUESTIONS</Text>
              {props?.state?.answer?.map((res, index) => (
                <View style={styles.goal} key={index}>
                  <View style={styles.div_wrapper}>
                    <View style={styles.Flex_div}>
                      <Text style={styles.text}> {res?.questions[0]?.question} </Text>
                      <Text style={styles.textarea} wrap={true}>
                        {res?.questions[0]?.answer}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>}


           {/* Photo Section */}
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
                            <Text
                              style={[
                                styles.subheading,
                                styles.marginequal,
                                styles.block,
                              ]}
                            >
                              Project Name: {item?.project||"N/A"}
                            </Text>
                            <Text
                              style={[
                                styles.subheading,
                                styles.marginequal,
                                styles.block,
                              ]}
                            >
                              Comment: {item?.comment}
                            </Text>
                            {Array.isArray(item?.images) &&
                              item.images.map((imageUrl, imgIndex) => (

                                <React.Fragment key={imgIndex}>
                                  {console.log(imageUrl, "imageUrl")}
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
