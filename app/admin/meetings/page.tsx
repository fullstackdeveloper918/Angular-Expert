"use client"
// import { setViewItem } from '@/lib/features/userSlice'
// import React from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// const page = () => {
//     const dispatch = useDispatch()
//     const userName = useSelector((state: any) => state.user.viewItem)
//     const handleClick = () => {
//         dispatch(setViewItem("Abhay Singh"))

//     }
//     return (
//         <div className="container">
//             <div className="row mt-3">
//                 <h1 className="text-center">Meetings Listing</h1>
//                 {/* <h3 className="">{userName}</h3> */}
//                 <button className="" onClick={handleClick}>change view item</button>
//             </div>
//         </div>
//     )
// }

// export default page

"use client"
// const userName=useSelector((state:any) => state.user.viewItem)
import type { GetServerSideProps, NextPage } from 'next'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'
// import MainLayout from '@/layouts/MainLayout';
import { Table, Input, Breadcrumb, Tabs, Typography, Upload, Badge, Tag, Select, Popconfirm } from 'antd';
import user from "@/assets/images/placeholder.png"
import Link from 'next/link';
import { Space } from 'antd';
import type { TabsProps } from 'antd';
import { PlusOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons'
// import { useRouter } from 'next/router';
// import henceforthApi from '@/utils/henceforthApi';
// import { GlobalContext } from '@/context/Provider';
// import ColumnsType from '@/interfaces/ColumnsType';
import dynamic from 'next/dynamic';
import MainLayout from '@/app/layouts/page';
import { useRouter } from 'next/navigation';
import FilterSelect from '@/app/common/FilterSelect';
import Icons from '@/app/common/Icons';
// import { deleteMeetingById, fetchMeeting, fetchMeetingById, searchMeetingByName } from '@/utils/fakeApi';
// import ExportFile from '@/components/ExportFile';
// import s3bucket from '@/utils/s3bucket';
import dayjs from "dayjs"
import api from '@/utils/api';
const { Row, Col, Avatar, Card, Button, Pagination, Tooltip } = {
    Button: dynamic(() => import("antd").then(module => module.Button), { ssr: false }),
    Row: dynamic(() => import("antd").then(module => module.Row), { ssr: false }),
    Col: dynamic(() => import("antd").then(module => module.Col), { ssr: false }),
    Card: dynamic(() => import("antd").then(module => module.Card), { ssr: false }),
    Pagination: dynamic(() => import("antd").then(module => module.Pagination), { ssr: false }),
    Tooltip: dynamic(() => import("antd").then(module => module.Tooltip), { ssr: false }),
    Avatar: dynamic(() => import("antd").then(module => module.Avatar), { ssr: false }),
}
const { Search } = Input;
let timer: any
type Page<P = {}> = NextPage<P> & {
    getLayout?: (page: ReactNode) => ReactNode;
};

const Page = () => {
    const router = useRouter()

    const [loading, setLoading] = React.useState(false)
    const [areas, setAreas] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState('')
  
    const handleDelete = async (_id: string) => {
        try {
       
        } catch (error) {
        }

    }
    const dataSource1 = [
        {
            key: '1',
            meeting: "abc",
            start: '08:20 pm 15-07-2024',
            end: "06:20 pm 18-07-2024",
            action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
                <li>
                    <Link href={`/admin/meetings/edit`} >
                        <Button type="text" className='px-0 border-0 bg-transparent shadow-none'><i className="fa-solid fa-pen-to-square"></i></Button>
                    </Link>
                </li>
                <li>
                    <Popconfirm
                        title="Delete"
                        description="Are you sure you want to delete ?"
                        onConfirm={(event) => { event?.stopPropagation(); handleDelete("res._id") }}
                    // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
                    >
                        <Button type="text" danger htmlType='button' className='px-0' ><i className="fa-solid fa-trash-can"></i></Button>
                    </Popconfirm>
                </li>
            </ul>
        },
        {
            key: '2',
            meeting: "abc",
            start: '08:20 pm 15-07-2024',
            end: "06:20 pm 18-07-2024",
            action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
                <li>
                    <Link href={`/admin/meetings/edit`} >
                        <Button type="text" className='px-0 border-0 bg-transparent shadow-none'><i className="fa-solid fa-pen-to-square"></i></Button>
                    </Link>
                </li>
                <li>
                    <Popconfirm
                        title="Delete"
                        description="Are you sure you want to delete ?"
                        onConfirm={(event) => { event?.stopPropagation(); handleDelete("res._id") }}
                    // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
                    >
                        <Button type="text" danger htmlType='button' className='px-0' ><i className="fa-solid fa-trash-can"></i></Button>
                    </Popconfirm>
                </li>
            </ul>
        },
        {
            key: '3',
            meeting: "abc",
            start: '08:20 pm 15-07-2024',
            end: "06:20 pm 18-07-2024",
            action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
                <li>
                    <Link href={`/admin/meetings/edit`} >
                        <Button type="text" className='px-0 border-0 bg-transparent shadow-none'><i className="fa-solid fa-pen-to-square"></i></Button>
                    </Link>
                </li>
                <li>
                    <Popconfirm
                        title="Delete"
                        description="Are you sure you want to delete ?"
                        onConfirm={(event) => { event?.stopPropagation(); handleDelete("res._id") }}
                    // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
                    >
                        <Button type="text" danger htmlType='button' className='px-0' ><i className="fa-solid fa-trash-can"></i></Button>
                    </Popconfirm>
                </li>
            </ul>
        },
        {
            key: '4',
            meeting: "abc",
            start: '08:20 pm 15-07-2024',
            end: "06:20 pm 18-07-2024",
            action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
                <li>
                    <Link href={`/admin/meetings/edit`} >
                        <Button type="text" className='px-0 border-0 bg-transparent shadow-none'><i className="fa-solid fa-pen-to-square"></i></Button>
                    </Link>
                </li>
                <li>
                    <Popconfirm
                        title="Delete"
                        description="Are you sure you want to delete ?"
                        onConfirm={(event) => { event?.stopPropagation(); handleDelete("res._id") }}
                    // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
                    >
                        <Button type="text" danger htmlType='button' className='px-0' ><i className="fa-solid fa-trash-can"></i></Button>
                    </Popconfirm>
                </li>
            </ul>
        },
        {
            key: '5',
            meeting: "abc",
            start: '08:20 pm 15-07-2024',
            end: "06:20 pm 18-07-2024",
            action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
                <li>
                    <Link href={`/admin/meetings/edit`} >
                        <Button type="text" className='px-0 border-0 bg-transparent shadow-none'><i className="fa-solid fa-pen-to-square"></i></Button>
                    </Link>
                </li>
                <li>
                    <Popconfirm
                        title="Delete"
                        description="Are you sure you want to delete ?"
                        onConfirm={(event) => { event?.stopPropagation(); handleDelete("res._id") }}
                    // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
                    >
                        <Button type="text" danger htmlType='button' className='px-0' ><i className="fa-solid fa-trash-can"></i></Button>
                    </Popconfirm>
                </li>
            </ul>
        },
    ];

    const archive = async (id:any) => {
        const item = {
          meeting_id: id,
        }
        try {
          let res = await api.Meeting.delete(item as any)
          initialise()
        //   setAreas
        } catch (error) {
    
        }
      }
    const dataSource = areas?.map((res: any, index: number) => {
        return {
            key: index+1,
            meeting:res?.meeting_name,
            start: dayjs(res?.start_time).format('h A DD-MM-YYYY'),
            end: dayjs(res?.end_time).format('h A DD-MM-YYYY'),
            action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
                <li>
                    <Link href={`/admin/meetings/${res?.id}/edit`} >
                        <Button type="text" className='px-0 border-0 bg-transparent shadow-none'><i className="fa-solid fa-pen-to-square"></i></Button>
                    </Link>
                </li>
                <li>
                    <Popconfirm
                        title="Delete"
                        description="Are you sure you want to delete ?"
                        onConfirm={(event:any) => {archive(res?.id)}}
                    // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
                    >
                        <Button type="text" danger htmlType='button' className='px-0' ><i className="fa-solid fa-trash-can"></i></Button>
                    </Popconfirm>
                </li>
            </ul>
        }})
    const columns = [
        {
            title: 'Key',
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
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
    ];
    const [meeting, setMeeting] = useState<any>(null);
    let meetingId:any=1


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

  



    const add = () => {
        router.push("/admin/meetings/add")
    }


    // const initialise=async()=>{
    //     try {
    //         let res= await api.Meeting.listing()
    //     } catch (error) {
            
    //     }
    // }
    return (
        <MainLayout>

            <Fragment>
                {/* <Head>
                    <title>Meetings</title>
                    <meta name="meetings" content="Meetings" />
                </Head> */}
                <section>
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <Card className='common-card'>
                                <div className='mb-4'>
                                    <Breadcrumb separator=">">
                                        <Breadcrumb.Item><Link className='text-decoration-none' href="/">General</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item className='text-decoration-none'>Meetings</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                                {/* title  */}
                                <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3'>
                                    <Typography.Title level={3} className='m-0 fw-bold'>Meetings</Typography.Title>
                                    <div className='d-flex gap-2'>
                                        {/* <Upload className='tooltip-img' showUploadList={false} accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'> */}
                                        <Button type="primary" style={{ width: 190 }} htmlType="button" size='large' icon={<PlusOutlined />} onClick={add}>Add Meeting</Button>
                                        {/* </Upload> */}
                                    </div>
                                </div>
                                {/* Search  */}
                                <div className='my-4 d-flex gap-3'>
                                    <Search size='large' placeholder="Search by Meeting Name or year" enterButton value={searchTerm}
                                        />
                                    {/* <Button type="primary" size='large' htmlType="button"  icon={<DownloadOutlined />} onClick={() => setExportModal(true)}>Export</Button> */}
                                    {/* <Space wrap> */}
                                    <FilterSelect />
                                </div>
                                {/* Tabs  */}
                                <div className='tabs-wrapper'>
                                    <Table dataSource={dataSource} columns={columns} pagination={false} />
                                </div>
                                {/* Pagination  */}
                                <Row justify={'center'} className="mt-5 d-flex paginationCenter">
                                    <Col span={24}>
                                        <Pagination total={15} hideOnSinglePage={true} disabled={loading} />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>


                </section>
            </Fragment>
        </MainLayout>

    )
}

Page.getLayout = (Page: ReactNode) => (
    <MainLayout>
        {Page}
    </MainLayout>
);



export default Page;
