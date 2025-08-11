"use client";
import type { NextPage } from "next";
import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { DownloadOutlined, EyeOutlined, FieldTimeOutlined, FormOutlined } from "@ant-design/icons";
import "../../styles/globals.scss";
import { Button, Card, Col, Row, Spin, Table, Tooltip, Typography } from "antd";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import Timmer from "../common/Timmer";
import { pdf } from "@react-pdf/renderer";
import Pdf from "../common/Pdf";
import saveAs from "file-saver";
import Timmerday from "../common/Timmerday";
import api from "../../utils/api";
import Icons from "../common/Icons";
import validation, { capFirst } from "../../utils/validation";
type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode;
};

const AdminDashboard: Page = (props: any) => {
  const getUserdata = useSelector((state: any) => state?.user?.userData)  
  const [loading, setLoading] = useState<any>(true)
  const [state1, setState1] = useState<any>([])
  const [state2, setState2] = useState<any>([])
  const [areas, setAreas] = useState<any>([]);
  const [complete, setComplete] = useState<any>("")
  const [check, setCheck] = useState<any>("")
  const [companyNameData,setCompanyNameData] = useState<any>("")
  const [loadingState, setLoadingState] = useState<{ [key: string]: boolean }>({});
  const hasClubMemberPermission = (getUserdata?.permission?.length && getUserdata.permission.includes("CLUB_MEMEBR")) || getUserdata?.email === "nahbcraftsmen@gmail.com";
  const xyz = areas?.result?.length > 0 
  ? areas.result
      .sort((a: any, b: any) => new Date(a.start_meeting_date).getTime() - new Date(b.start_meeting_date).getTime())[0]?.start_meeting_date 
  : undefined;
  const springDate = areas?.result?.length > 0 
  ? areas.result
      .sort((a: any, b: any) => new Date(a.start_meeting_date).getTime() - new Date(b.start_meeting_date).getTime())[1]?.start_meeting_date 
  : undefined;
  console.log(areas,"kkkk");
  
  const xyz1 = areas?.result?.length > 0 
  ? areas.result
      .sort((a: any, b: any) => new Date(a.start_meeting_date).getTime() - new Date(b.start_meeting_date).getTime())[0]?.location 
  : undefined;

    const xyz1_meeting = areas?.result?.length > 0 
  ? areas.result
      .sort((a: any, b: any) => new Date(a.start_meeting_date).getTime() - new Date(b.start_meeting_date).getTime())[0]?.meeting_type 
  : undefined;
  const xyz2 = areas?.result?.length > 0 
  ? areas.result
      .sort((a: any, b: any) => new Date(a.start_meeting_date).getTime() - new Date(b.start_meeting_date).getTime())[1]?.location 
  : undefined;
  console.log(xyz1,"xyz1");
  
  const abc:any = xyz ? dayjs.tz(xyz, 'America/New_York').valueOf() : undefined;
// console.log(getUserdata.meetings.NextMeeting.id, "axfz");


console.log(xyz1_meeting,"getUserdatagetUserdatahayiyan");
  const updateDue = async () => {

    let item={
      meeting_id:getUserdata.meetings.NextMeeting.id
    }
    let res = await api.Meeting.update(getUserdata.meetings.NextMeeting.id)

  }
  useEffect(() => {
    if (getUserdata?.is_admin == false) {
      updateDue()
    }
  }, [])


  const start_date = 1725993000000;
  const spring_start_date = 1745951400000;
  const fiveDaysInMilliseconds = 5 * 24 * 60 * 60 * 1000; 
const [error,setError]=useState<any>("")
  const new_date = xyz - fiveDaysInMilliseconds;

  const formatWithOrdinal = (date: any) => {
    const day = dayjs(date).date();

    const getOrdinalSuffix = (day: any) => {
      const j = day % 10,
        k = day % 100;
      if (j === 1 && k !== 11) {
        return day + "st";
      }
      if (j === 2 && k !== 12) {
        return day + "nd";
      }
      if (j === 3 && k !== 13) {
        return day + "rd";
      }
      return day + "th";
    };

    const formattedDate = `${dayjs(date).format('MMMM')} ${getOrdinalSuffix(day)}, ${dayjs(date).format('YYYY')}`;
    return formattedDate;
  };


   function getDisplayNameByKey(key: string | undefined): string {
      if (!key) return "N/A";

      const keyLower = key.toLowerCase();

      const found = companyNameData.find(
        ([k, _]: [string, string]) => k.toLowerCase() === keyLower
      );

      return found ? found[1] : "N/A";
    }

  const DashboardData = [
    {
      cardBackground: "#D3D3D3",
      iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
      icon: <FieldTimeOutlined style={{ fontSize: '30px', color: '#08c' }} />,
      title: `${xyz1} Member Update Due`,
      textColor: "#000000",
      count: <span style={{ fontSize: '20px' }}> <Timmer endDate={new_date} /></span>,
      link: "/admin/dashboard"
    },
    {
      cardBackground: "#D3D3D3",
      iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
      icon: <FieldTimeOutlined style={{ fontSize: '30px', color: '#08c' }} />,
      title: `${xyz1} Member Meeting Kick off`,
      textColor: "#000000",
      count: <span style={{ fontSize: '20px' }}> <Timmer endDate={abc} /></span>,
      link: "/admin/dashboard"
    },
    {
      cardBackground: "#D3D3D3", 
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", 
      iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
      icon: <Icons.Users />,
      textColor: "#000000",
      title: <span >{xyz2} Fall Member 2025(<Timmerday endDate={springDate} />)</span>,
      count: <span style={{ fontSize: '20px' }}></span>,
      link: "/admin/dashboard"
    },

  ]

  console.log(xyz1,"here to see xyz1")
  const DashboardData2 = [
    {
      cardBackground: "#D3D3D3",
      iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
      icon: <FieldTimeOutlined style={{ fontSize: '30px', color: '#08c' }} />,
      title: `${xyz1} Member Update Due`,
      textColor: "#000000",
      count: <span style={{ fontSize: '20px' }}> <Timmer endDate={new_date} /></span>,
      link: "/admin/dashboard"

    },
    {
      cardBackground: "#D3D3D3",
      iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
      icon: <FieldTimeOutlined style={{ fontSize: '30px', color: '#08c' }} />,
      title: `${xyz1} Member Meeting Kick off`,
      textColor: "#000000",
      count: <span style={{ fontSize: '20px' }}> <Timmer endDate={xyz} /></span>,
      link: "/admin/dashboard"

    },
    {
      cardBackground: "#D3D3D3",
      iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
      icon: <Icons.Users />,
      title: "Member Update Completed",
      textColor: "#000000",
      count: <span style={{ fontSize: '20px' }}>{complete?.totalCompleted || "0"}</span>,
      link: "/admin/dashboard"

    },
    {
      cardBackground: "#D3D3D3",
      iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
      icon: <FormOutlined style={{ fontSize: '30px', color: '#08c' }} />,
      title: "Member Update yet to be completed",
      textColor: "#000000",
      count: <span style={{ fontSize: '20px' }}>{complete?.totalUncompleted || "0"}</span>,
      link: "/admin/dashboard"
    },
  ]
  const getDataById = async (id: any) => {
    const item = { user_id: id,meeting_id:getUserdata.meetings.NextMeeting.id };
    try {
      const res = await api.User.getById(item as any);
      return res?.data || null; 
    } catch (error: any) {
      alert(error.message);
      return null; 
    }
  };

  const generatePdf = async (data?: any) => {

        const companyName  = getDisplayNameByKey(data?.company_name)

    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
    const blob = await pdf(<Pdf state={data} companyName={companyName}  />).toBlob();
    console.log(blob,"blob");
    
    const pdfUrl = URL.createObjectURL(blob);
    console.log(pdfUrl,"rtrtrt");
    
    return { blob, pdfUrl, timestamp };
};
  // const companyNameData: any = {
  //   "augusta": "Augusta Homes, Inc.",
  //   "buffington": "Buffington Homes, L.P.",
  //   "cabin": "Cabin John Builders",
  //   "cataldo": "Cataldo Custom Builders",
  //   "The DCB": "The DCB",
  //   "dc_building": "DC Building Inc.",
  //   "Ddenman_construction": "Denman Construction, Inc.",
  //   "ellis": "Ellis Custom Homes",
  //   "tm_grady_builders": "T.M. Grady Builders",
  //   "hardwick": "Hardwick G. C.",
  //   "homeSource": "HomeSource Construction",
  //   "ed_nikles": "Ed Nikles Custom Builder, Inc.",
  //   "olsen": "Olsen Custom Homes",
  //   "raykon": "Raykon Construction",
  //   "matt_sitra": "Matt Sitra Custom Homes",
  //   "schneider": "Schneider Construction, LLC",
  //   "shaeffer": "Shaeffer Hyde Construction",
  //   "split": "Split Rock Custom Homes",
  //   "tiara": "Tiara Sun Development",
  //   "Hickory Construction, Inc": "Hickory Construction, Inc"
  // };




const fetchCompanyData = async () => {
    try {
      const res = await fetch("https://cybersify.tech/sellmacdev/company.php");
      const data = await res.json();

      const objectContent = Object.entries(data);


      console.log(objectContent,"here to se companies")
      setCompanyNameData(objectContent);

      // setFilteredData(allNames);
    } catch (err) {
      console.log("Failed to fetch companies",err);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  },[]);


  const downLoadPdf = async (data: any) => {
    console.log(data,"sjlsjdfl");
    
        const companyName  = getDisplayNameByKey(data?.company_name)
    const { blob, timestamp } = await generatePdf(data);
    saveAs(blob, `${capFirst(companyName)}.pdf`);
  };

  const handleDownloadAndFetchData = async (id: any) => {
    setLoadingState((prevState) => ({ ...prevState, [id]: true }));
    try {
        let res = await getDataById(id);
        await downLoadPdf(res);
    } catch (error) {
    } finally {
        setLoadingState((prevState) => ({ ...prevState, [id]: false }));
    }
};

const formatPhoneNumber = (phoneNumber: any) => {
  // Remove any non-numeric characters
  const cleanNumber = phoneNumber.replace(/\D/g, "");

  // Check if the number starts with +61 and has 10 digits
  if (cleanNumber.length === 10 && cleanNumber.startsWith("6")) {
      // Format for numbers starting with +61 (e.g., +61 414580011)
      const countryCode = cleanNumber.slice(0, 2);  // Country code (+61)
      const restOfNumber = cleanNumber.slice(2);  // The remaining part of the number
  
      // Correct the formatting to include the space after the country code
      return `+${countryCode} ${restOfNumber}`;  // Format: +61 414580011
    }

  // Check if the number starts with +1 and has 11 digits
  if (cleanNumber.length === 11 && cleanNumber.startsWith("1")) {
    // Format for numbers starting with +1 (e.g., +1 (xxx) xxx-xxxx)
    const countryCode = cleanNumber.slice(0, 1);  // Country code (+1)
    const areaCode = cleanNumber.slice(1, 4);  // Area code (next 3 digits)
    const firstPart = cleanNumber.slice(4, 7);  // First part of the phone number (next 3 digits)
    const secondPart = cleanNumber.slice(7);  // Second part of the phone number (last 4 digits)

    return `+${countryCode} (${areaCode}) ${firstPart}-${secondPart}`;
  }

  // Return the original number if it doesn't fit the expected pattern
  return` ${phoneNumber.slice(0,3)} ${phoneNumber.slice(3)}`;
};
  const filteredData = state1?.reduce((acc: any[], res: any) => {
    
    
    if (!res?.is_additional_user) {
      acc.push(res);
    }
    
    return acc;
  }, []);
  console.log(state2,"state2");
  
  // const filteredArray = state2.filter((item:any) => item.is_form_completed == true);
  const non_completed = state2?.filter((res: any) => res?.is_form_completed == false);
  console.log(non_completed,"non_completed");
  
  // const non_completed = filteredData?.filter((res: any) => res?.is_completed === false);
  
  
  const dataSource = state1?.map((res: any, index: number) => {
        const companyName = getDisplayNameByKey(res?.company_name);
    // const companyName = companyNameData[res?.company_name || ""] || "N/A";
    return {
      key: index + 1,
      name: capFirst(res?.firstname ? `${res?.firstname} ${res?.lastname}` : "N/A"),
      company: companyName || "N/A",
      email: res?.email || "N/A",
      phone: formatPhoneNumber(res?.phone_number) || "N/A",
      position: capFirst(res?.position || "N/A"),
      city: capFirst(res?.home_city || "N/A"),
      action: <ul className='m-0 list-unstyled d-flex gap-2'><li>
        {hasClubMemberPermission || getUserdata?.is_admin == false ?
          <Link href={`/admin/member/${res?.id}/view`}><Button className='ViewMore'><EyeOutlined /></Button></Link> :
          <Link href={`/admin/dashboard`}><Button className='ViewMore'><EyeOutlined /></Button></Link>}
      </li>
      </ul>
    }
  }
  );
  const filteredArray = state2.filter((item:any) => item.is_form_completed == true);
console.log(filteredArray,"filteredArray");

const dataSource1 = filteredArray
?.sort((a: any, b: any) => {
  const dateA = new Date(
    a?.photo_section?.form_completed_date?._seconds * 1000 +
    a?.photo_section?.form_completed_date?._nanoseconds / 1000000
  );
  const dateB = new Date(
    b?.photo_section?.form_completed_date?._seconds * 1000 +
    b?.photo_section?.form_completed_date?._nanoseconds / 1000000
  );
  return dateA.getTime() - dateB.getTime(); // Ascending: older first
})
.map((res: any, index: number) => {
      const companyName = getDisplayNameByKey(res?.company_name);
  // const companyName = companyNameData[res?.company_name || ""] || "N/A";
  const isLoading = loadingState[res?.id];

  return {
    key: index + 1,
    name: res?.firstname
      ? `${validation.capitalizeFirstLetter(res?.firstname)} ${validation.capitalizeFirstLetter(res?.lastname)}`
      : "N/A",
    company: companyName,
    email: res?.email || "N/A",
    action: (
      <ul className='m-0 list-unstyled d-flex gap-2'>
        <li>
          {hasClubMemberPermission || getUserdata?.is_admin === false ? (
            <Link href={`/admin/member/${res?.id}/view`}>
              <Button className='ViewMore'><EyeOutlined /></Button>
            </Link>
          ) : (
            <Link href={`/admin/dashboard`}>
              <Button className='ViewMore'><EyeOutlined /></Button>
            </Link>
          )}
        </li>
      </ul>
    ),
    action1: (
      // getUserdata?.is_admin == false ?
      <ul className='m-0 list-unstyled d-flex gap-2'>
        <li>
          <Tooltip title="Download Pdf">
            <Button
            // disabled
              className='ViewMore'
              onClick={() => handleDownloadAndFetchData(res?.id)}
            >
              {isLoading ? <Spin /> : <DownloadOutlined />}
            </Button>
          </Tooltip>
        </li>
      </ul>
    //   :
    //   <ul className='m-0 list-unstyled d-flex gap-2'>
    //   <li>
    //     <Tooltip title="Download Pdf">
    //       <Button
    //         className='ViewMore'
    //         onClick={() => handleDownloadAndFetchData(res?.id)}
    //       >
    //         {isLoading ? <Spin /> : <DownloadOutlined />}
    //       </Button>
    //     </Tooltip>
    //   </li>
    // </ul>
    ),
  };
});


  // const filteredArray = state2.filter((item:any) => item.is_form_completed == true);

  console.log(non_completed,"non_completed seeememmememe")
  const dataSource2 = non_completed?.map((res: any, index: number) => {
    
        const companyName = getDisplayNameByKey(res?.company_name);
    // const companyName = companyNameData[res?.company_name || ""] || "N/A";
    const isLoading = loadingState[res?.id];
    return {
      key: index + 1,
      name: res?.firstname ? `${validation.capitalizeFirstLetter(validation.capitalizeFirstLetter(res?.firstname))} ${res?.lastname}` : "N/A",
      company: companyName || "N/A",
      action: <ul className='m-0 list-unstyled d-flex gap-2'>
        <li>
          <Tooltip title="Download Pdf">
            <Button className='ViewMore '
              onClick={() => handleDownloadAndFetchData(res?.id)}
            >{isLoading ? <Spin /> : <DownloadOutlined />}</Button>
          </Tooltip>
        </li>

      </ul>
    }
  }
  );

  console.log(dataSource2,"dataSource2 ssss")
  const columnData: any = [];
  for (let i = 0; i < dataSource2.length; i += 7) {
    columnData.push(dataSource2.slice(i, i + 7));
  }

  const columns: any = [];
  for (let i = 0; i < columnData.length; i++) {
    columns.push({
      title: `Company Name`,
      dataIndex: `column${i + 1}`,
      key: `column${i + 1}`,
      render: (_: any, __: any, rowIndex: any) => {
        const item = columnData[i][rowIndex];
        return item ? (
          <>
            <div>{item.company}</div>
          </>
        ) : null;
      },
    });
  }

  const maxRows = Math.max(...columnData.map((col: any) => col.length));
  const tableData = Array.from({ length: maxRows }).map((_, rowIndex) => {
    const row: any = {};
    columnData.forEach((col: any, colIndex: any) => {
      row[`column${colIndex + 1}`] = col[rowIndex] || {};
    });
    return row;
  });

  console.log(columnData,tableData,"tableData here to see")

  const dataSource3 = areas?.result?.length
    ? areas?.result
      .sort((a: any, b: any) => a.start_meeting_date - b.start_meeting_date)
      .map((res: any, index: number) => {
        return {
          key: index + 1,
          meeting: `${validation.capitalizeFirstLetter(res?.meeting_type)} ${dayjs(res?.start_meeting_date).format('YYYY')}` || "N/A",
          host_name: res?.host || "N/A",
          host_city: <Tooltip title={res?.location}>
            {res?.location ? `${res?.location.slice(0, 20)}...` : "N/A"}
          </Tooltip>,
          start: formatWithOrdinal(res?.start_meeting_date) || "N/A",
          end: formatWithOrdinal(res?.end_meeting_date) || "N/A",
          action: <Timmer endDate={res?.start_meeting_date} />,
          action1: <ul className='m-0 list-unstyled d-flex gap-2'><li>
            <Link href={`/admin/meetings/${res?.id}/view`}><Button type="primary" className='ViewMore primary'><EyeOutlined /></Button></Link></li>
          </ul>
        }
      })
    : [];
  const columns3 = [
    {
      title: 'Order No.',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Meeting Name',
      dataIndex: 'meeting',
      key: 'meeting',
    },
    {
      title: 'Host Name',
      dataIndex: 'host_name',
      key: 'host_name',
    },
    {
      title: 'Host City',
      dataIndex: 'host_city',
      key: 'host_city',
    },
    {
      title: 'Start Date',
      dataIndex: 'start',
      key: 'start',
    },
    {
      title: 'End Date',
      dataIndex: 'end',
      key: 'end',
    },
    {
      title: 'Countdown',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Information',
      dataIndex: 'action1',
      key: 'action1',
    },
  ];


  const columns1 = [
    {
      title: 'Order No.',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Company Name',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Pdf',
      dataIndex: 'action1',
      key: 'action1',
    },
    ...(hasClubMemberPermission ? [{
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    }] : []),
    ...(hasClubMemberPermission ? [{
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    }] : []),

  ];
  const columns2 = [
    {
      title: 'Order No.',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Company Name',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone No',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Home City',
      dataIndex: 'city',
      key: 'city',
    },
    ...(hasClubMemberPermission ? [{
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    }] : [])
  ];

  const getData = async () => {
    setLoading(true)
    try {
      let apiRes1 = await api.User.user_completed_noncompleted(getUserdata.meetings.NextMeeting.id)
      
      
      setComplete(apiRes1.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  console.log(state2,"ljlsjdfl");
  
  const userlist = async () => {
    setLoading(true)
    try {
      let res = await api.User.listing(getUserdata.meetings.NextMeeting.id)
      let response = await api.User.completelist(getUserdata.meetings.NextMeeting.id)
    
    console.log(res.data,"here to see response")
      setState1(res?.data)
      setState2(response)
      setLoading(false)
    } catch (error:any) {
      setError(error?.response?.status)
      setLoading(false)
    }
  }
  
  useEffect(() => {
      userlist();
  }, []);
  const initialise = async () => {
    try {
        let res = await api.Meeting.upcoming_meeting(getUserdata.meetings.NextMeeting.id);
     
     console.log(res,"res here mer laam se jao")
        setAreas(res);
        let apiRes1 = await api.User.check_fall_spring(getUserdata.meetings.NextMeeting.id)
        setCheck(apiRes1)
    } catch (error) {
    }
  };
  useEffect(() => {

    initialise();

  }, []);


  useEffect(() => {
    getData()

  }, [])



   
//   const getSeasonByReviewMonth = (month:any) =>
//     month >= 1 && month <= 6 ? 'Spring' : month >= 7 && month <= 12 ? 'Fall' : 'Invalid Month';


// const meeting_review_month= dayjs(props?.state?.meetings?.lastMeeting?.start_meeting_date).format("MM")
// const season_review_month = getSeasonByReviewMonth(meeting_review_month);
// console.log(season_review_month,"season");

// const meeting_review_year= dayjs(props?.state?.meetings?.lastMeeting?.start_meeting_date).format("YYYY")
// console.log(meeting_review_year,"meeting_review_year");
{console.log(getUserdata,"getUserdata here to see")}
{console.log(DashboardData2,"getUserdata here to see jjajajaja")}

  
  return (
        <section>
          <Row gutter={[20, 20]} className="mb-4 ">

            {getUserdata?.is_admin == true ?
              <>
                {DashboardData && DashboardData?.map((data: any, index: number) => {
                  return (
                    <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} className="gutter-row" key={index}>
                      <Link className='text-decoration-none' href={data.link}>
                        <Card className='dashboard-widget-card text-center h-100 border-0' style={{ background: data.cardBackground }} >

                          <div className='dashboard-widget-card-content mt-3 mb-3'>
                            <Typography.Title level={3} className='m-0 mb-2 fw-bold' style={{ color: data.textColor }}>{data.title}</Typography.Title>
                            <Typography.Paragraph className="m-0" style={{ color: data.textColor }}>{data.count}</Typography.Paragraph>
                          </div>
                        </Card>
                      </Link>
                    </Col>
                  )
                })}
              </> : <>
                {DashboardData2 && DashboardData2?.map((data: any, index: number) => {
                  return (
                    <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} className="gutter-row" key={index}>
                      <Link className='text-decoration-none' href={data.link}>
                        <Card className='dashboard-widget-card text-center h-80 border-0' style={{ background: data.cardBackground }} >

                          <div className='dashboard-widget-card-content px-2'>
                            <Typography.Title level={4} className='m-0 mb-1 fw-bold' style={{ color: data.textColor }}>{data.title}</Typography.Title>
                            <Typography.Paragraph className="m-0" style={{ color: data.textColor }}>{data.count}</Typography.Paragraph>
                          </div>
                        </Card>
                      </Link>
                    </Col>
                  )
                })}
              </>}
          </Row>
          <Row gutter={[20, 20]} className='dashboradTable'>
            {getUserdata?.is_admin == false ?
              <Col sm={24} md={24} lg={24} xxl={12}>
                <Card className='common-card'>
                  <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-3'>
                    <Typography.Title level={4} className='m-0 fw-bold'>Complete Updates for {xyz1_meeting} 2025</Typography.Title>

                  </div>
                  <div className='tabs-wrapper'>
                    {/* <Table className="tableBox" dataSource={dataSource1} columns={columns1} pagination={{
                      position: ['bottomCenter'],
                      pageSize: 5,
                    }} /> */}
                    {!state2?.length ? (
                      <div className="justify-center align-items-center">

        <Spin size="large" />
                      </div>
      ) : (
        <Table
          className="tableBox"
          dataSource={dataSource1}
          columns={columns1}
          pagination={{
            position: ['bottomCenter'],
            pageSize: 5,
          }}
        />
      )}
                  </div>
                </Card>
              </Col> : ""}
            {getUserdata?.is_admin == false ?
              <Col sm={24} md={24} lg={24} xxl={12}>
                <Card className='common-card'>

                  <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-3'>
                    <Typography.Title level={4} className='m-0 fw-bold'>Incomplete Updates for {xyz1_meeting} 2025</Typography.Title>
                  </div>
                  <div className='tabs-wrapper'>
                  {!state2.length ? (
        <Spin size="large" />
      ) : (
        <Table
          className="tableBox"
          
          dataSource={tableData}
          columns={columns}
          pagination={false}
          rowKey={(record, index) => `row-${index}`}
        />
      )}
                    {/* <Table
                      // dataSource={loading?<Spin size="large" />:}
                      dataSource={tableData}
                      columns={columns}
                      pagination={false}
                      rowKey={(record, index) => `row-${index}`}
                    /> */}
                  </div>

                </Card>
              </Col> : ""}
            {getUserdata?.is_admin == true ?
              <Col span={24} >
                <Card className='common-card'>
                  <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-3'>
                    <Typography.Title level={4} className='m-0 fw-bold'>Club Members</Typography.Title>
                    {/* {hasClubMemberPermission ?
                      state1?.length &&
                      <Link href={'/admin/member'}>
                        <Button className='text-center blackViewBtn'> View All</Button>
                      </Link> : ""} */}
                  </div>
                  <div className='tabs-wrapper'>
                    {loading ? (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
                        <Spin size="large" />
                      </div>
                    ) : (
                      <Table dataSource={dataSource} columns={columns2} pagination={{
                        position: ['bottomCenter'],
                    }} />
                    )}
                  </div>

                </Card>
              </Col> : ""}

            {getUserdata?.is_admin == false ?
              <Col span={24} >
                <Card className='common-card'>
                  <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-3'>
                    <Typography.Title level={4} className='m-0 fw-bold'>Upcoming Meetings</Typography.Title>
                  </div>
                  <div className='tabs-wrapper'>

                    <Table dataSource={dataSource3} columns={columns3} pagination={{
                      position: ['bottomCenter'],
                      pageSize: 5,
                    }} />
                  </div>

                </Card>
              </Col>
              : ""}
          </Row>
        </section>
        );
};

export default AdminDashboard;