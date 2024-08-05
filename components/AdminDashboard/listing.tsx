"use client";
import type { NextPage } from "next";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { DownloadOutlined, EyeOutlined, FieldTimeOutlined, FormOutlined, LoginOutlined } from "@ant-design/icons";
import "../../styles/globals.scss";
import { Button, Card, Col, Popconfirm, Row, Spin, Table, Tooltip, Typography } from "antd";
import api from "@/utils/api";
import { useSelector } from "react-redux";
import Icons from "@/components/common/Icons";
import MainLayout from "../../components/Layout/layout";
import dayjs from "dayjs";
import Timmer from "../common/Timmer";
import validation, { capFirst, replaceUnderScore } from "@/utils/validation";
import { pdf } from "@react-pdf/renderer";
import Pdf from "../common/Pdf";
import saveAs from "file-saver";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";
type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode;
};

const AdminDashboard: Page = (props: any) => {
  const getUserdata = useSelector((state: any) => state?.user?.userData)
  const [loading, setLoading] = useState<any>(true)
  const [state1, setState1] = useState<any>([])
  const [areas, setAreas] = useState<any>([]);
  const [complete, setComplete] = useState<any>("")
  const [check, setCheck] = useState<any>("")
  const hasClubMemberPermission = (getUserdata?.permission?.length && getUserdata.permission.includes("CLUB_MEMEBR")) || getUserdata?.email === "nahbcraftsmen@gmail.com";
  const Countdown = areas?.result?.length
    ? areas?.result
      .sort((a: any, b: any) => new Date(a.start_meeting_date).getTime() - new Date(b.start_meeting_date).getTime()) // Sort by start_meeting_date
      .map((res: any, index: number) => (
        <div key={index}>
          <Timmer endDate={res?.start_meeting_date} />
        </div>
      ))
    : [];

  const updateDue = async () => {
    let res = await api.Meeting.update()

  }
  useEffect(() => {
    if (getUserdata?.is_admin == false) {
      updateDue()
    }
  }, [])
  const start_date = 1725993000000;
  const fiveDaysInMilliseconds = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds

  const new_date = start_date - fiveDaysInMilliseconds;

  const formatWithOrdinal = (date:any) => {
    const day = dayjs(date).date();
    
    const getOrdinalSuffix = (day:any) => {
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
  
    const monthYear = dayjs(date).format('MMMM YYYY');
    const formattedDate = `${dayjs(date).format('MMMM')} ${getOrdinalSuffix(day)}, ${dayjs(date).format('YYYY')}`;
    return formattedDate;
  };
  const DashboardData = [
    {
      cardBackground: "#D3D3D3", // Light gray background
      iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
      icon: <FieldTimeOutlined style={{ fontSize: '30px', color: '#08c' }} />,
      title: "Update Due",
      textColor: "#000000",
      count: <span style={{ fontSize: '20px' }}> <Timmer endDate={new_date} /></span>,
      link: "/admin/dashboard"

    },
    {
      cardBackground: "#D3D3D3", // Light gray background
      iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
      icon: <FieldTimeOutlined style={{ fontSize: '30px', color: '#08c' }} />,
      title: "Meeting Kick off",
      textColor: "#000000",
      count: <span style={{ fontSize: '20px' }}> <Timmer endDate={start_date} /></span>,
      link: "/admin/dashboard"

    },
    {
      cardBackground: "#D3D3D3", // Light gray background
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Black shadow
      iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
      icon: <Icons.Users />,
      title: "Fall 2024 (80 days)",
      textColor: "#000000",
      count: <span style={{ fontSize: '20px' }}>{check?.data?.fall || "0"}</span>
      // "Fall 2024 (80 days)"
      ,
      link: "/admin/dashboard"

    },
    {
      cardBackground: "#D3D3D3", // Light gray background
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Black shadow
      iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
      icon: <Icons.Users />,
      textColor: "#000000",
      title: "Spring 2025 (408 days)",
      count: <span style={{ fontSize: '20px' }}>{check?.data?.spring || "0"}</span>
      // "Spring 2025 (408 days)"
      ,
      link: "/admin/dashboard"
    },
    // {
    //   cardBackground: "#FFF5CC",
    //   iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
    //   icon: <Icons.Users />,
    //   textColor: "#B76E00",
    //   title: `${total_count?.data || "0"}`,
    //   count: "Total Club Members",
    //   link: hasClubMemberPermission ? `/admin/member` : "/admin/dashboard"

    // },

  ]

  const DashboardData2 = [
    // getUserdata?.is_admin==false?
    {
      cardBackground: "#D3D3D3", // Light gray background
      iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
      icon: <FieldTimeOutlined style={{ fontSize: '30px', color: '#08c' }} />,
      title: "Update Due",
      textColor: "#000000",
      count: <span style={{ fontSize: '20px' }}> <Timmer endDate={new_date} /></span>,
      link: "/admin/dashboard"

    },
    {
      cardBackground: "#D3D3D3", // Light gray background
      iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
      icon: <FieldTimeOutlined style={{ fontSize: '30px', color: '#08c' }} />,
      title: "Meeting Kick off",
      textColor: "#000000",
      count: <span style={{ fontSize: '20px' }}> <Timmer endDate={start_date} /></span>,
      link: "/admin/dashboard"

    },
    {
      cardBackground: "#D3D3D3", // Light gray background
      iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
      icon: <Icons.Users />,
      title: "Updates Completed",
      textColor: "#000000",
      count: <span style={{ fontSize: '20px' }}>{complete?.totalCompleted || "0"}</span>
      //  "No. of Users fillled the Form for coming meeting"
      ,
      link: "/admin/dashboard"

    },
    {
      // cardBackground: "#FFF5CC",
      // iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
      cardBackground: "#D3D3D3", // Light gray background
      iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
      icon: <FormOutlined style={{ fontSize: '30px', color: '#08c' }} />,
      title: "Updates yet to be completed",
      textColor: "#000000",
      count: <span style={{ fontSize: '20px' }}>{complete?.totalUncompleted || "0"}</span>
      // "No. of Users remains to fill the Form for coming meeting"
      ,
      link: "/admin/dashboard"
    },
  ]
  const getDataById = async (id: any) => {
    const item = { user_id: id };
    try {
      const res = await api.User.getById(item as any);
      // setState3(res?.data || null);
      return res?.data || null; // Ensure to return the data
    } catch (error: any) {
      alert(error.message);
      return null; // Return null in case of error
    }
  };

  const generatePdf = async (data?: any) => {

    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
    const blob = await pdf(<Pdf state={data} />).toBlob();
    const pdfUrl = URL.createObjectURL(blob);
    return { blob, pdfUrl, timestamp };
  };

  const downLoadPdf = async (data: any) => {
    const { blob, timestamp } = await generatePdf(data);
    saveAs(blob, `${capFirst(data?.company_name)}.pdf`);
  };

  const handleDownloadAndFetchData = async (id: any) => {
    const res = await getDataById(id);

    if (res) {
      await downLoadPdf(res);
    } else {
    }
  };
  const completed = state1?.filter((res: any) => res?.is_completed === true);
  const non_completed = state1?.filter((res: any) => res?.is_completed == false)
  const dataSource = state1?.slice(0, 5).map((res: any, index: number) => {
    return {
      key: index + 1,
      name: capFirst(res?.firstname ? `${res?.firstname} ${res?.lastname}` : "N/A"),
      company: capFirst(replaceUnderScore(res?.company_name || "N/A")),
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
  const dataSource1 = completed?.map((res: any, index: number) => {
    return {
      key: index + 1,
      name: res?.firstname ? `${validation.capitalizeFirstLetter(res?.firstname)} ${validation.capitalizeFirstLetter(res?.lastname)}` : "N/A",
      company: validation.replaceUnderScore(validation.capitalizeFirstLetter(res?.company_name)) || "N/A",
      email: res?.email || "N/A",
      action: <ul className='m-0 list-unstyled d-flex gap-2'><li>
        {hasClubMemberPermission || getUserdata?.is_admin == false ?
          <Link href={`/admin/member/${res?.id}/view`}><Button className='ViewMore'><EyeOutlined /></Button></Link> :
          <Link href={`/admin/dashboard`}><Button className='ViewMore'><EyeOutlined /></Button></Link>}</li>
      </ul>,
      action1: <ul className='m-0 list-unstyled d-flex gap-2'>
        <li>
          <Tooltip title="Download Pdf">
            <Button className='ViewMore '
              onClick={() => handleDownloadAndFetchData(res?.id)}
            ><DownloadOutlined /></Button>
          </Tooltip>
        </li>

      </ul>
    }
  }
  );
  const dataSource2 = non_completed?.map((res: any, index: number) => {
    return {
      key: index + 1,
      name: res?.firstname ? `${validation.capitalizeFirstLetter(validation.capitalizeFirstLetter(res?.firstname))} ${res?.lastname}` : "N/A",
      company: validation.replaceUnderScore(validation.capitalizeFirstLetter(res?.company_name)) || "N/A",
      // email: res?.email,
      action: <ul className='m-0 list-unstyled d-flex gap-2'>
        <li>
          <Tooltip title="Download Pdf">
            <Button className='ViewMore '
              onClick={() => handleDownloadAndFetchData(res?.id)}
            ><DownloadOutlined /></Button>
          </Tooltip>
        </li>

      </ul>
    }
  }
  );
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



  const columns = [
    // {
    //   title: 'Order No.',
    //   dataIndex: 'key',
    //   key: 'key',
    // },
    // {
    //   title: 'Name',
    //   dataIndex: 'name',
    //   key: 'name',
    // },
    {
      title: 'Company Name',
      dataIndex: 'company',
      key: 'company',
    },
    // {
    //   title: 'Email',
    //   dataIndex: 'email',
    //   key: 'email',
    // },
    // {
    //   title: 'Action',
    //   dataIndex: 'action',
    //   key: 'action',
    // }
  ];
  const columns1 = [
    {
      title: 'Order No.',
      dataIndex: 'key',
      key: 'key',
    },
    // {
    //   title: 'Name',
    //   dataIndex: 'name',
    //   key: 'name',
    // },
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
      let apiRes1 = await api.User.user_completed_noncompleted()
        setComplete(apiRes1.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
const userlist=async()=>{
  setLoading(true)
try {
  let res = await api.User.listing()
  setState1(res?.data)
setLoading(false)
} catch (error) {
  setLoading(false)
}
}
useEffect(() => {
  const hasReloaded = localStorage.getItem('hasReloaded');
  if (!hasReloaded ) {
  // if (!hasReloaded && state1?.status === '400') {
    localStorage.setItem('hasReloaded', 'true');
    window.location.reload();
  } else {
    userlist();
  }
}, [state1?.status=== '400']);
  const initialise = async () => {
    try {
      if (getUserdata?.is_admin == false) {
        let res = await api.Meeting.upcoming_meeting();
        setAreas(res);
      } else if (getUserdata?.is_admin == true) {
        let apiRes1 = await api.User.check_fall_spring()
        setCheck(apiRes1)
      }
    } catch (error) {
      //   if (error==400) {
      //     destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });

      //     // }
      //     toast.error("Session Expired Login Again")
      //     router.replace("/auth/signin")
      // }


    }
  };
  useEffect(() => {

    initialise();

  }, []);
  useEffect(() => {
    getData()

  }, [])

  return (
    <MainLayout>

      <Fragment>
        {/* <h1 className="">check main layout</h1> */}
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

                          <div className='dashboard-widget-card-content'>
                            <Typography.Title level={3} className='m-0 mb-1 fw-bold' style={{ color: data.textColor }}>{data.title}</Typography.Title>
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
                    <Table dataSource={dataSource2} columns={columns} pagination={{
                      position: ['bottomCenter'],
                      pageSize: 5,
                    }} />
                  </div>

                </Card>
              </Col> : ""}
            {getUserdata?.is_admin == true ?
              <Col span={24} >
                <Card className='common-card'>
                  <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-3'>
                    <Typography.Title level={4} className='m-0 fw-bold'>Club Members</Typography.Title>
                    {hasClubMemberPermission ?
                      state1?.length &&
                      <Link href={'/admin/member'}>
                        <Button className='text-center blackViewBtn'> View All</Button>
                      </Link> : ""}
                  </div>
                  <div className='tabs-wrapper'>
                    {loading ? (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
                        <Spin size="large" />
                      </div>
                    ) : (
                      <Table dataSource={dataSource} columns={columns2} pagination={false} />
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
      </Fragment>
    </MainLayout>
  );
};

export default AdminDashboard;