"use client";
import type { NextPage } from "next";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
// import MainLayout from "../../layouts/page";
// import Icons from "../../common/Icons";
import Link from "next/link";
import { EyeOutlined, LoginOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import henceofrthEnums from "@/utils/henceofrthEnums";
import { useRouter } from "next/navigation";
import type { TabsProps } from "antd";
import "../../styles/globals.scss";
import { Button, Card, Col, Popconfirm, Row, Table, Typography } from "antd";
import api from "@/utils/api";
import { useSelector } from "react-redux";
import Icons from "@/components/common/Icons";
import MainLayout from "../../components/Layout/layout";
import dayjs from "dayjs";

type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode;
};

const AdminDashboard: Page = (props: any) => {
  const getUserdata=useSelector((state:any)=>state?.user?.userData)

  const[state1,setState1]=useState<any>([])
  const[upcoming,setUpcoming]=useState<any>("")
  const[next,setNext]=useState<any>("")
  const [areas, setAreas] = useState<any>([]);
  const hasClubMemberPermission = (getUserdata?.permission?.length && getUserdata.permission.includes("CLUB_MEMEBR")) || getUserdata?.email === "nahbcraftsmen@gmail.com";

  const DashboardData = [
    // getUserdata?.is_admin==false?
    
    // getUserdata?.is_admin==true?
    {
      cardBackground: "#C8FACD",
      iconBackground: "linear-gradient(135deg, rgba(0, 171, 85, 0) 0%, rgba(0, 171, 85, 0.24) 97.35%)",
      icon: <Icons.Users />,
      title: "20",
      textColor: "#007B55",
      count: "Fall 2024 (80 days)",
      link: "/admin/dashboard"

    },
    // getUserdata?.is_admin==true?
    {
      cardBackground: "#CAFDF5",
      iconBackground: "linear-gradient(135deg, rgba(0, 184, 217, 0) 0%, rgba(0, 184, 217, 0.24) 97.35%)",
      icon: <Icons.Users />,
      textColor: "#006C9C",
      title: "3",
      count: "Spring 2025 (408 days)",
      link: "/admin/dashboard"
    },
    // getUserdata?.is_admin==true?
    {
      cardBackground: "#FFF5CC",
      iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
      icon: <Icons.Users />,
      textColor: "#B76E00",
      title: "20",
      count: "Total Club Members",
      link:hasClubMemberPermission? `/admin/member`:"/admin/dashboard"

    },
 
  ]
  const DashboardData2 = [
    // getUserdata?.is_admin==false?
    {
      cardBackground: "#C8FACD",
      iconBackground: "linear-gradient(135deg, rgba(0, 171, 85, 0) 0%, rgba(0, 171, 85, 0.24) 97.35%)",
      icon: <Icons.Users />,
      title: "2",
      textColor: "#007B55",
      count: "No. of Users fillled the Form for coming meeting",
      link: "/admin/dashboard"

    },
    // getUserdata?.is_admin==false?
    {
      cardBackground: "#FFF5CC",
      iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
      icon: <Icons.Users />,
      title: "3",
      textColor: "#B76E00",
      count: "No. of Users remains to fill the Form for coming meeting",
      link: "/admin/dashboard"

    },
   
 
  ]



  const completed = state1?.filter((res:any) => res?.is_completed === true);
  const non_completed=state1?.filter((res:any)=>res?.is_completed==false)
  const dataSource = state1?.slice(0, 5).map((res: any, index: number) => {
    return {
      key: index + 1,
      name: res?.firstname? `${res?.firstname} ${res?.lastname}`:"N/A",
      company: res?.company_name,
      email: res?.email,
      phone: res?.phone_number,
      position: res?.position,
      city: res?.home_city,
      action: <ul className='m-0 list-unstyled d-flex gap-2'><li>
        {hasClubMemberPermission? 
        <Link href={`/admin/member/${res?.id}/view`}><Button className='ViewMore'><EyeOutlined /></Button></Link>:
        <Link href={`/admin/dashboard`}><Button className='ViewMore'><EyeOutlined /></Button></Link>}
        </li>
      </ul>
    }
  }
  );
  const dataSource1 = completed?.slice(0, 5).map((res: any, index: number) => {
    return {
      key: index + 1,
      name: res?.firstname? `${res?.firstname} ${res?.lastname}`:"N/A",
      company: res?.company_name,
      email: res?.email,
      action: <ul className='m-0 list-unstyled d-flex gap-2'><li>
       {hasClubMemberPermission? 
        <Link href={`/admin/member/${res?.id}/view`}><Button className='ViewMore'><EyeOutlined /></Button></Link>:
        <Link href={`/admin/dashboard`}><Button className='ViewMore'><EyeOutlined /></Button></Link>}</li>
      </ul>
    }
  }
  );
  const dataSource2 = non_completed?.slice(0, 5).map((res: any, index: number) => {
    return {
      key: index + 1,
      name: res?.firstname? `${res?.firstname} ${res?.lastname}`:"N/A",
      company: res?.company_name,
      email: res?.email,
      action: <ul className='m-0 list-unstyled d-flex gap-2'><li>
       {hasClubMemberPermission? 
        <Link href={`/admin/member/${res?.id}/view`}><Button className='ViewMore'><EyeOutlined /></Button></Link>:
        <Link href={`/admin/dashboard`}><Button className='ViewMore'><EyeOutlined /></Button></Link>}</li>
      </ul>
    }
  }
  );
  const dataSource3 = areas?.length &&areas?.map((res: any, index: number) => {
    return {
        key: index+1,
        meeting:res?.meeting_name,
        start: dayjs(res?.start_time).format('h A DD-MM-YYYY'),
        end: dayjs(res?.end_time).format('h A DD-MM-YYYY'),
        // action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
        //     <li>
        //         <Link href={`/admin/meetings/${res?.id}/edit`} >
        //             <Button type="text" className='px-0 border-0 bg-transparent shadow-none'><i className="fa-solid fa-pen-to-square"></i></Button>
        //         </Link>
        //     </li>
           
        // </ul>
    }})


    const columns3 = [
      {
          title: 'Sr.no',
          dataIndex: 'key',
          key: 'key',
      },
      {
          title: 'Meeting Name',
          dataIndex: 'meeting',
          key: 'meeting',
      },
      {
          title: 'Start Time',
          dataIndex: 'start',
          key: 'start',
      },
      {
          title: 'End Time',
          dataIndex: 'end',
          key: 'end',
      },
      // {
      //     title: 'Action',
      //     dataIndex: 'action',
      //     key: 'action',
      // },
  ];



  const columns = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Club Name',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
  ];
  const columns1 = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Club Name',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
  ];
  const columns2 = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Club Name',
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
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
  ];

  const getData=async()=>{
    try {
        let res=await api.User.listing()
        let res1=await api.dashboard.upcoming()
        let res2=await api.dashboard.next()
        setState1(res?.data)
        setUpcoming(res1)
        setNext(res2)
    } catch (error) {
        
    }
}
const initialise = async () => {
  try {
      let res = await api.Meeting.listing();
      setAreas(res); 
  } catch (error) {
      console.error('Error fetching meeting listing:', error);
  }
};
useEffect(() => {

initialise(); 

}, []);
useEffect(()=>{
    getData()

},[])

  return (
    <MainLayout>

      <Fragment>
        {/* <Head>
          <title>Dashboard</title>
          <meta name="description" content="Homepage desc" />
        </Head> */}
        <section>
          {/* <div className="container-fluid"> */}
          <Row gutter={[20, 20]} className="mb-4 ">
{getUserdata?.is_admin==true?
<>
{DashboardData && DashboardData?.map((data: any, index: number) => {
  return (
    <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} className="gutter-row" key={index}>
      <Link className='text-decoration-none' href={data.link}>
        <Card className='dashboard-widget-card text-center h-100 border-0' style={{ background: data.cardBackground }} >
          <div className='dashboard-widget-card-icon rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3' style={{ background: data.iconBackground }}>
            {data.icon}
          </div>
          <div className='dashboard-widget-card-content'>
            <Typography.Title level={3} className='m-0 mb-1 fw-bold' style={{ color: data.textColor }}>{data.title}</Typography.Title>
            <Typography.Paragraph className="m-0" style={{ color: data.textColor }}>{data.count}</Typography.Paragraph>
          </div>
        </Card>
      </Link>
    </Col>
  )
})}
</>:<>
{DashboardData2 && DashboardData2?.map((data: any, index: number) => {
  return (
    <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} className="gutter-row" key={index}>
      <Link className='text-decoration-none' href={data.link}>
        <Card className='dashboard-widget-card text-center h-100 border-0' style={{ background: data.cardBackground }} >
          <div className='dashboard-widget-card-icon rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3' style={{ background: data.iconBackground }}>
            {data.icon}
          </div>
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

{getUserdata?.is_admin==true?
            <Col sm={24} md={24} xl={12}>
              <Card className='common-card'>

                {/* title  */}
                <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-3'>
                  <Typography.Title level={4} className='m-0 fw-bold'>Complete Updates</Typography.Title>

                  {/* <Button className='text-center blackViewBtn'> View All</Button> */}

                  {/* <Table dataSource={dataSource} columns={columns} />; */}

                </div>
                {/* Search  */}

                {/* Tabs  */}
                <div className='tabs-wrapper'>

                  <Table dataSource={dataSource1} columns={columns1} pagination={false} />
                </div>

                {/* Pagination  */}

              </Card>
            </Col>
            :""}
{getUserdata?.is_admin==true?
            <Col sm={24} md={24} xl={12}>
              <Card className='common-card'>

                {/* title  */}
                <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-3'>
                  <Typography.Title level={4} className='m-0 fw-bold'>Non-Complete Updates</Typography.Title>

                  {/* <Button className='text-center blackViewBtn'> View All</Button> */}

                  {/* <Table dataSource={dataSource} columns={columns} />; */}


                </div>
                {/* Search  */}

                {/* Tabs  */}
                <div className='tabs-wrapper'>

                  <Table dataSource={dataSource2} columns={columns} pagination={false} />
                </div>

                {/* Pagination  */}

              </Card>
            </Col>:""}
            {getUserdata?.is_admin==true?
            <Col span={24} >
              <Card className='common-card'>

                {/* title  */}
                <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-3'>
                  <Typography.Title level={4} className='m-0 fw-bold'>Club Members</Typography.Title>
                  {hasClubMemberPermission?
                  <Link href={'/admin/member'}>
                  <Button className='text-center blackViewBtn'> View All</Button>
                  </Link>:""}
                </div>
                {/* Search  */}

                {/* Tabs  */}
                <div className='tabs-wrapper'>

                  <Table dataSource={dataSource} columns={columns2} pagination={false} />
                </div>
                {/* <div className=' justify-content-center mt-4 d-flex'> */}


                {/* <Table dataSource={dataSource} columns={columns} />; */}
                {/* </div> */}
                {/* Pagination  */}

              </Card>
            </Col>:""}
            {getUserdata?.is_admin==false?
            <Col span={24} >
              <Card className='common-card'>

                {/* title  */}
                <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-3'>
                  <Typography.Title level={4} className='m-0 fw-bold'>Coming Meetings</Typography.Title>
                </div>
                {/* Search  */}

                {/* Tabs  */}
                <div className='tabs-wrapper'>

                  <Table dataSource={dataSource3} columns={columns3} pagination={false} />
                </div>
                {/* <div className=' justify-content-center mt-4 d-flex'> */}


                {/* <Table dataSource={dataSource} columns={columns} />; */}
                {/* </div> */}
                {/* Pagination  */}

              </Card>
            </Col>:""}
          </Row>
          {/*  Graphs   */}
          {/* {GraphType.map((res)=><DashboardGraph key={res.heading} {...res}/>)} */}

        </section>
      </Fragment>
    </MainLayout>
  );
};

export default AdminDashboard;