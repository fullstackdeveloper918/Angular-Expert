"use client"
import type { GetServerSideProps, NextPage } from 'next'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'
import MainLayout from '../../layouts/page';
import { Avatar } from 'antd';
import Icons from '../../common/Icons';
// import Graph from '@/components/Graph';
import user from "@/assets/images/placeholder.png"
import Link from 'next/link';
import { EyeOutlined, LoginOutlined, } from "@ant-design/icons"
// import { useRouter } from 'next/router';
// import henceforthApi from '@/utils/henceforthApi';
// import ColumnsType from '@/interfaces/ColumnsType';
import dynamic from 'next/dynamic';
import { UserOutlined } from '@ant-design/icons';
// import { COOKIES_USER_ACCESS_TOKEN } from '@/context/actionTypes';
// import { GlobalContext } from '@/context/Provider';
// import henceofrthEnums from '@/utils/henceofrthEnums';
// import DashboardGraph from '@/components/common/DashboardGraph';
import henceofrthEnums from '@/utils/henceofrthEnums';
import { useRouter } from 'next/navigation';
import type { TabsProps } from 'antd';
import '../../styles/globals.scss';
import { Table, Input, Breadcrumb, Tabs, Typography, Upload, Badge, Tag } from 'antd';
// import { fetchAreas, searchAreasByName } from "../../../utils/fakeApi"
import api from '@/utils/api';
import { useSelector } from 'react-redux';
const { Row, Col, Card, Button, Pagination, Tooltip, Select, Image } = {
  Button: dynamic(() => import("antd").then(module => module.Button), { ssr: false }),
  Row: dynamic(() => import("antd").then(module => module.Row), { ssr: false }),
  Col: dynamic(() => import("antd").then(module => module.Col), { ssr: false }),
  Card: dynamic(() => import("antd").then(module => module.Card), { ssr: false }),
  Pagination: dynamic(() => import("antd").then(module => module.Pagination), { ssr: false }),
  Tooltip: dynamic(() => import("antd").then(module => module.Tooltip), { ssr: false }),
  Select: dynamic(() => import("antd").then(module => module.Select), { ssr: false }),
  Image: dynamic(() => import("antd").then(module => module.Image), { ssr: false }),

}

type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode;
};
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}
interface Area {
  name: string;
  id: number;
  usersSize: number;
  users: number[];
  workgroupsSize: number;
  workgroups: number[];
  assetsSize: number;
  assets: string[];
}
const Home: Page = (props: any) => {
  const getUserdata=useSelector((state:any)=>state?.user?.userData)
  const router = useRouter()
  const [state, setState] = React.useState({
    data: [],
    TotalUsers: 0,
    TotalArtist: 0,
    TotalSongs: 0,
    TotalWatches: 0,
    TotalUserTransection: 0,
    TotalArtistTransection: 0
  })
  const [graphState, setGraphState] = React.useState({
    data: [],
    total_count: 0
  })
  const [loading, setLoading] = React.useState(false)
  const array = [henceofrthEnums.GraphType.Yearly, henceofrthEnums.GraphType.Monthly, henceofrthEnums.GraphType.Weekly, henceofrthEnums.GraphType.Daily]
  const [areas, setAreas] = useState<any>([]);
  const[state1,setState1]=useState<any>([])
  const[upcoming,setUpcoming]=useState<any>([])
  const[next,setNext]=useState<any>([])


  const DashboardData = [
    {
      cardBackground: "#C8FACD",
      iconBackground: "linear-gradient(135deg, rgba(0, 171, 85, 0) 0%, rgba(0, 171, 85, 0.24) 97.35%)",
      icon: <Icons.Users />,
      title: "20",
      textColor: "#007B55",
      count: "Fall 2024 (80 days)",
      link: "/"

    },
    {
      cardBackground: "#CAFDF5",
      iconBackground: "linear-gradient(135deg, rgba(0, 184, 217, 0) 0%, rgba(0, 184, 217, 0.24) 97.35%)",
      icon: <Icons.Users />,
      textColor: "#006C9C",
      title: "3",
      count: "Spring 2025 (408 days)",
      link: "/"
    },
    {
      cardBackground: "#FFF5CC",
      iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
      icon: <Icons.Users />,
      textColor: "#B76E00",
      title: "20",
      count: "Total Club Members",
      link: "/"


    },
    // {
    //   cardBackground: "#EBEDFF",
    //   iconBackground: "linear-gradient(135deg, rgba(201, 206, 255, 0.00) 0%, rgba(201, 206, 255, 0.44) 90.25%, rgba(201, 206, 255, 0.48) 97.35%)",
    //   icon: <Icons.ArtistIcon />,
    //   textColor: "#747EDF",
    //   title: "30",
    //   count: "Total Meetings",
    //   link: "/"


    // },
    // {
    //   cardBackground: "#FFE3D3",
    //   iconBackground: "linear-gradient(135deg, rgba(201, 206, 255, 0.00) 0%, rgba(255, 176, 134, 0.00) 0.01%, rgba(255, 176, 134, 0.48) 97.35%)",
    //   icon: <Icons.Transactions />,
    //   textColor: "#EB854E",
    //   title: state?.TotalUserTransection,
    //   count: "Total Transactions Users",
    //   link: "/transaction/user/page/1?limit=10"
    // },
    // {
    //   cardBackground: "#FFE3D3",
    //   iconBackground: "linear-gradient(135deg, rgba(201, 206, 255, 0.00) 0%, rgba(255, 176, 134, 0.00) 0.01%, rgba(255, 176, 134, 0.48) 97.35%)",
    //   icon: <Icons.Transactions />,
    //   textColor: "#EB854E",
    //   title: state?.TotalArtistTransection,
    //   count: "Total Transactions Artists",
    //   link: "/transaction/artist/page/1?limit=10"
    // },
  ]







  const completed = state1.filter((res:any) => res?.is_completed === true);
  const non_completed=state1.filter((res:any)=>res?.is_completed==false)
  console.log(completed,"completed");
  console.log(non_completed,"non_completed");
  const hasClubMemberPermission = (getUserdata?.permission?.length && getUserdata.permission.includes("CLUB_MEMEBR")) || getUserdata?.email === "nahbcraftsmen@gmail.com";
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

  //   key: '1',
  //   name: 'Mike',
  //   company:"xyz solutions",
  //   email:"example@gmail.com",
  //   phone:"76785678***",
  //   position:"ABC",
  //   city:"New York",
  //   age: 32,
  //   address: '10 Downing Street',
  //   action: <ul className='m-0 list-unstyled d-flex gap-2'><li>
  //   <Link href={`/admin/users/view`}><Button  className='ViewMore'><EyeOutlined /></Button></Link></li>
  // </ul>

  const TableData = () => <Row gutter={[20, 20]} >
    <Col span={24} >
      {/* <Table dataSource={dataSource} pagination={false} scroll={{ x: '100%' }} /> */}
    </Col>
  </Row>

  const items: TabsProps['items'] = [
    {
      key: '',
      label: 'All',
      children: <TableData />,
    },
    {
      key: 'active',
      label: 'Active',
      children: <TableData />,
    },
    {
      key: 'deactive',
      label: 'Deactive',
      children: <TableData />,
    },
    {
      key: 'blocked',
      label: 'Blocked',
      children: <TableData />,
    }
  ];

  const GraphType = [
    { heading: "Trends", areaKeys: ["total_songs", "total_videos"] },
    { heading: "Analytics", areaKeys: ["total_payments"] }
  ]
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
useEffect(()=>{
    getData()

},[])
console.log(upcoming,"upcoming");
console.log(next,"next");

  console.log(areas, "areas");

  // useEffect(() => {
  //   fetchAreas().then((data) => {
  //     setAreas(data);
  //   });
  // }, []);

  // const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = event.target.value;
  //   setSearchTerm(value);

  //   if (value.trim() === '') {
  //     fetchAreas().then((data) => {
  //       setAreas(data);
  //     });
  //   } else {
  //     searchAreasByName(value).then((data) => {
  //       setAreas(data);
  //     });
  //   }
  // };

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
            {DashboardData.map((data: any, index: number) => {
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
          </Row>
          <Row gutter={[20, 20]} className='dashboradTable'>


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
            </Col>

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
            </Col>

          </Row>
          {/*  Graphs   */}
          {/* {GraphType.map((res)=><DashboardGraph key={res.heading} {...res}/>)} */}

        </section>
      </Fragment>
    </MainLayout>

  )
}

Home.getLayout = (page: ReactNode) => (
  <MainLayout>
    {page}
  </MainLayout>
);

export default Home