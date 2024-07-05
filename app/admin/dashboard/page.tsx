"use client"
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head';
import React, { Fragment, ReactNode } from 'react'
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
const Home: Page = (props: any) => {
  const router = useRouter()
//   const { userInfo } = React.useContext(GlobalContext)
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
  // const [graphType, setGraphType] = React.useState(henceofrthEnums.GraphType.Yearly.toUpperCase() as string)

  // const handlePagination = (page: number, pageSize: number) => {
  //   router.replace({
  //     query: { ...router.query, pagination: page, limit: pageSize }
  //   })
  // }

  // const _content = (
  //   <div>
  //     <p>Content</p>
  //     <p>Content</p>
  //   </div>
  // );

  const DashboardData = [
    {
      cardBackground: "#C8FACD",
      iconBackground: "linear-gradient(135deg, rgba(0, 171, 85, 0) 0%, rgba(0, 171, 85, 0.24) 97.35%)",
      icon: <Icons.Users />,
      title: "20",
      textColor: "#007B55",
      count: "Total Users",
      link: "/users/page/1?limit=10"

    },
    {
      cardBackground: "#CAFDF5",
      iconBackground: "linear-gradient(135deg, rgba(0, 184, 217, 0) 0%, rgba(0, 184, 217, 0.24) 97.35%)",
      icon: <Icons.ArtistIcon />,
      textColor: "#006C9C",
      title: "3",
      count: "Total Meetings",
      link: "/artists/page/1?limit=10"


    },
    // {
    //   cardBackground: "#FFF5CC",
    //   iconBackground: "linear-gradient(135deg, rgba(255, 171, 0, 0) 0%, rgba(255, 171, 0, 0.24) 97.35%)",
    //   icon: <Icons.SongsIcon />,
    //   textColor: "#B76E00",
    //   title: state?.TotalSongs,
    //   count: "Total Songs",
    //   link: "/"


    // },
    // {
    //   cardBackground: "#EBEDFF",
    //   iconBackground: "linear-gradient(135deg, rgba(201, 206, 255, 0.00) 0%, rgba(201, 206, 255, 0.44) 90.25%, rgba(201, 206, 255, 0.48) 97.35%)",
    //   icon: <Icons.WatchIcon />,
    //   textColor: "#747EDF",
    //   title: state?.TotalWatches,
    //   count: "Total Watch",
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







  const initialise = async () => {
    try {
      setLoading(true)
      // let query = router.query
      // let urlSearchParam = new URLSearchParams()
      // urlSearchParam.set('pagination', query.pagination ? `${Number(query.pagination) - 1}` : '0')
      // urlSearchParam.set('limit', `${query.limit || 10}`)
      // let apiRes = await henceforthApi.Dashboard.listing(urlSearchParam.toString())

    //   let apiRes = await henceforthApi.Dashboard.listing()

    //   setState(apiRes)
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  const typeChange = async (type: string) => {
    // onChangeRouter("type", type)
    console.log("typeChange", type)
    // if (type === graphType) return
    // await handleProductGraph(type)
    // setGraphType(type)
  }

//   const onChangeRouter = (key: string, value: string) => {
//     router.replace({
//       query: { ...router.query, [key]: value }
//     })
//     console.log("router query", router.query);
//   }

  // const handleProductGraph = async (type: string) => {
  //   setLoading(true)
  //   try {

  //     let urlSearchParam = new URLSearchParams()
  //     urlSearchParam.set('type', type)

  //     let resApi = await henceforthApi.Graph.create(urlSearchParam.toString())
  //     console.log("resapi", resApi.data);
  //     setGraphState({
  //       ...graphState,
  //       data: resApi.data,
  //       total_count: resApi.total_count
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   }
  //   finally {
  //     setLoading(false)
  //   }
  // }

  React.useEffect(() => {
    initialise()
  }, [])
  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
      action:"view"
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
      action:"view"
    },
    {
      key: '3',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
      action:"view"
    },
    {
      key: '4',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
      action:"view"
    },
    {
      key: '5',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
      action:"view"
    },
  ];
  

  const TableData = () => <Row gutter={[20, 20]} >
    <Col span={24} >
      <Table dataSource={dataSource}  pagination={false} scroll={{ x: '100%' }} />
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
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
  ];
  return (
    <MainLayout>

    <Fragment>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Homepage desc" />
      </Head>
      <section>
        {/* <div className="container-fluid"> */}
        <Row gutter={[20, 20]} className="mb-4">
          {DashboardData.map((data: any, index: number) => {
            return (
              <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4} className="gutter-row" key={index}>
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
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Card className='common-card'>
              
              {/* title  */}
              <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3'>
                <Typography.Title level={4} className='m-0 fw-bold'>Recent Users</Typography.Title>
                
              </div>
              {/* Search  */}
              
              {/* Tabs  */}
              <div className='tabs-wrapper'>

              <Table dataSource={dataSource} columns={columns} />
              </div>
              <div className=' justify-content-center'>
              <Button className='text-center'> View All</Button>

              {/* <Table dataSource={dataSource} columns={columns} />; */}
              </div>
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