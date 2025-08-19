import React, { useEffect, useState } from "react";
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
    display: "inline-block",
    fontSize: 11,
    break: "auto",
    minHeight: 35,
    overflow: "wrap",
    fontWeight: "400",
    color: "#333",
  },
  textareanew: {
    padding: ' 8px ',
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

const PhotoSectionPdf = (props) => {
  const photoSection = props?.state?.photo_section || [];


  console.log(props ,"here to see photo props")
  const options = { httpHeaders: { 'crossOrigin': 'anonymous' }, };
  // <Image key={imageIndex} style={{ width: 100, height: 100 }} options={options} src={{ uri: ${file.url}, method: "GET", headers: { Pragma: 'no-cache', "Cache-Control": "no-cache" }, body: "" }} />
 
  const newArr = props?.state?.photo_section?.fileUrls?.length && Object.values(props?.state?.photo_section?.fileUrls[0])

  console.log(newArr,"here to check video ")
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
              Member Update / <Text style={{ fontStyle: 'italic', fontSize: 18, textTransform: "capitalize" }}>Fall 2024</Text>
            </Text>
            <Text style={styles.subheader}>
              {props?.companyName}
            </Text>
          </View>



          <View style={styles.section}>
            <Text style={styles.main_heading}>PHOTO SECTION</Text>
            {/* <Text style={styles.subheading}>
              Share photos of current projects or additional information
              regarding comments in your update.
            </Text> */}
            {/* <Text style={styles.subheading} >
              Please paste a dropbox link for each project in the boxes
              indicated below, and write a brief summary of each project in the
              comment section.
            </Text> */}
            <View style={styles.goal}>
              <View style={styles.div_wrapper}>
                {Array.isArray(newArr) && newArr
                  .sort((a, b) => a - b) // Sort newArr in descending order
                  .map((item, index) => (
                    <View style={styles.goal} key={index}>
                      <View style={styles.goal_two}>

                        {Array.isArray(item?.images) && item.images.map((imageUrl, imgIndex) => (
                          <>

                            <Image
                              style={{ width: "100%", height: "100%", objectFit: "cover", }}
                              options={options}
                              src={imageUrl}
                              method="GET"
                              headers={{ Pragma: 'no-cache', "Cache-Control": "no-cache" }}
                              body=""
                            />
                          </>
                        ))}
                        <Text style={[styles.subheading, styles.marginequal, styles.block]} >
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

export default PhotoSectionPdf;
