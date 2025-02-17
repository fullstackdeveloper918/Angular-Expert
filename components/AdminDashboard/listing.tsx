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
  console.log(getUserdata,"getUserdata");
  
  const [loading, setLoading] = useState<any>(true)
  const [state1, setState1] = useState<any>([])
  const [state2, setState2] = useState<any>([])
  const [areas, setAreas] = useState<any>([]);
  const [complete, setComplete] = useState<any>("")
  const [check, setCheck] = useState<any>("")
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
  const xyz2 = areas?.result?.length > 0 
  ? areas.result
      .sort((a: any, b: any) => new Date(a.start_meeting_date).getTime() - new Date(b.start_meeting_date).getTime())[1]?.location 
  : undefined;
  console.log(xyz1,"xyz1");
  
  const abc:any = xyz ? dayjs.tz(xyz, 'America/New_York').valueOf() : undefined;
// console.log(getUserdata.meetings.NextMeeting.id, "axfz");


  const updateDue = async () => {
console.log(getUserdata,"getUserdatagetUserdata");

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

    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
    const blob = await pdf(<Pdf state={data} />).toBlob();
    const pdfUrl = URL.createObjectURL(blob);
    return { blob, pdfUrl, timestamp };
  };
  const companyNameMap: any = {
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
  const downLoadPdf = async (data: any) => {
    const companyName = companyNameMap[data?.company_name || ""] || "N/A";
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
  const filteredData = state1?.reduce((acc: any[], res: any) => {
    
    
    if (!res?.is_additional_user) {
      acc.push(res);
    }
    
    return acc;
  }, []);
  

  const non_completed = filteredData?.filter((res: any) => res?.is_completed === false);
  
  
  const dataSource = state1?.map((res: any, index: number) => {
    const companyName = companyNameMap[res?.company_name || ""] || "N/A";
    return {
      key: index + 1,
      name: capFirst(res?.firstname ? `${res?.firstname} ${res?.lastname}` : "N/A"),
      company: companyName || "N/A",
      email: res?.email || "N/A",
      phone: res?.phone_number || "N/A",
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
  const dataSource1 = state2
  ?.sort((a: any, b: any) => {
    const dateA = new Date(a.updatedAt._seconds * 1000 + a.updatedAt._nanoseconds / 1000000);
    const dateB = new Date(b.updatedAt._seconds * 1000 + b.updatedAt._nanoseconds / 1000000);
    return   dateB.getTime() -dateA.getTime();
  })
  .map((res: any, index: number) => {
    const companyName = companyNameMap[res?.company_name || ""] || "N/A";
    const isLoading = loadingState[res?.id];
    return {
      key: index + 1,
      name: res?.firstname ? `${validation.capitalizeFirstLetter(res?.firstname)} ${validation.capitalizeFirstLetter(res?.lastname)}` : "N/A",
      company: companyName || "N/A",
      email: res?.email || "N/A",
      action: (
        <ul className='m-0 list-unstyled d-flex gap-2'>
          <li>
            {hasClubMemberPermission || getUserdata?.is_admin == false ? (
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
        <ul className='m-0 list-unstyled d-flex gap-2'>
          <li>
            <Tooltip title="Download Pdf">
              <Button
                className='ViewMore'
                onClick={() => handleDownloadAndFetchData(res?.id)}
              >
             {isLoading ? <Spin /> : <DownloadOutlined />}
              </Button>
            </Tooltip>
          </li>
        </ul>
      ),
    };
  });

  const dataSource2 = non_completed?.map((res: any, index: number) => {
    const companyName = companyNameMap[res?.company_name || ""] || "N/A";
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
  const userlist = async () => {
    setLoading(true)
    try {
      let res = await api.User.listing(getUserdata.meetings.NextMeeting.id)
      let response = await api.User.completelist(getUserdata.meetings.NextMeeting.id)
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
                    <Typography.Title level={4} className='m-0 fw-bold'>Complete Updates for Fall 2024</Typography.Title>

                  </div>
                  <div className='tabs-wrapper'>
                    <Table className="tableBox" dataSource={dataSource1} columns={columns1} pagination={{
                      position: ['bottomCenter'],
                      pageSize: 5,
                    }} />
                  </div>
                </Card>
              </Col> : ""}
            {getUserdata?.is_admin == false ?
              <Col sm={24} md={24} lg={24} xxl={12}>
                <Card className='common-card'>

                  <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-3'>
                    <Typography.Title level={4} className='m-0 fw-bold'>Non-Complete Updates for Fall 2024</Typography.Title>
                  </div>
                  <div className='tabs-wrapper'>
                    <Table
                      dataSource={tableData}
                      columns={columns}
                      pagination={false}
                      rowKey={(record, index) => `row-${index}`}
                    />
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