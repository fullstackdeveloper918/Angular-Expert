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
import Head from 'next/head';
import React, { Fragment, ReactNode, useState } from 'react'
// import MainLayout from '@/layouts/MainLayout';
import { Table, Input, Breadcrumb, Tabs, Typography, Upload, Badge, Tag, Select, Popconfirm } from 'antd';
import user from "@/assets/images/placeholder.png"
import Link from 'next/link';
import { Space } from 'antd';
import type { TabsProps } from 'antd';
import { EyeOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons'
// import { useRouter } from 'next/router';
// import henceforthApi from '@/utils/henceforthApi';
// import { GlobalContext } from '@/context/Provider';
// import ColumnsType from '@/interfaces/ColumnsType';
import dynamic from 'next/dynamic';
import MainLayout from '@/app/layouts/page';
import { useRouter } from 'next/navigation';
import FilterSelect from '@/app/common/FilterSelect';
import Icons from '@/app/common/Icons';
// import ExportFile from '@/components/ExportFile';
// import s3bucket from '@/utils/s3bucket';

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

const page = () => {
    const router = useRouter()
    //   const { userInfo, downloadCSV, Toast, uploadCSV } = React.useContext(GlobalContext)
    const [show, setShow] = useState(true);
    const [state, setState] = React.useState({
        data: [],
        count: 0
    })
    const [loading, setLoading] = React.useState(false)
    const [exportModal, setExportModal] = React.useState(false);

    //   const onChangeRouter = (key: string, value: string) => {
    //     router.replace({
    //       query: { ...router.query, [key]: value }
    //     })
    //     console.log("router query", router.query);
    //   }

    //   const onChange = (value: string) => {
    //     onChangeRouter("type", value)
    //   };

    //   const onSearch = (value: string) => {
    //     console.log("onserach value", value);
    //     if (timer) {
    //       clearTimeout(timer)
    //     }
    //     timer = setTimeout(() => {
    //       onChangeRouter("search", String(value).trim())
    //     }, 1000);
    //   }

    //   const handlePagination = (page: number, pageSize: number) => {
    //     console.log('page: number, pageSize', page, pageSize);
    //     router.replace({
    //       query: { ...router.query, pagination: page, limit: pageSize }
    //     })
    //   }

    //   const dataSource2 = state.data.map((res: any, index: number) => {
    //     return {
    //       key: router.query.pagination ? (Number(router.query.pagination) - 1) * Number(router.query.limit || 10) + (index + 1) : index + 1,
    //       name: <div className='user-detail d-inline-flex gap-2 align-items-center'>
    //         {/* <Avatar size={40} src={res?.image ? s3bucket.getUrl(res?.image) : user.src}></Avatar> */}
    //         <Typography.Text className='text-capitalize'>{res.first_name ? `${res?.first_name} ${res?.last_name}` : 'N/A'}</Typography.Text></div>,
    //       email: <Tooltip placement="topLeft" title={`${res?.email}`} arrow={true}>
    //         {res.email ? res.email?.length >= 20 ? `${res.email.slice(0, 20)}...` : res.email : 'N/A'}
    //       </Tooltip>,
    //       phone: res.mobile ? `${res.country_code} ${res.mobile}` : 'N/A',
    //       status: !router.query.type && ((res.is_blocked && !res.is_active) ? <Tag color='#000'>Blocked</Tag> : res.is_blocked ? <Tag color='#000'>Blocked</Tag> : !res.is_active ? <Tag color='red'>De-Activated</Tag> : <Tag color='success'>Active</Tag>),
    //       actions: <ul className='m-0 list-unstyled d-flex gap-2'><li>
    //         <Link href={`/users/${res._id}/view?pagination=1&limit=10`}><Button type='primary' shape='circle'><EyeOutlined /></Button></Link></li>
    //       </ul>
    //     }
    //   }
    //   );

    //   const TableData = () => <Row gutter={[20, 20]} >
    //     <Col span={24} >
    //       <Table dataSource={dataSource} columns={router.query.type ? ColumnsType.userColumns : ColumnsType.allUserColumns} pagination={false} scroll={{ x: '100%' }} />
    //     </Col>
    //   </Row>

    //   const items: TabsProps['items'] = [
    //     {
    //       key: '',
    //       label: 'All',
    //       children: <TableData />,
    //     },
    //     {
    //       key: 'active',
    //       label: 'Active',
    //       children: <TableData />,
    //     },
    //     {
    //       key: 'deactive',
    //       label: 'Deactive',
    //       children: <TableData />,
    //     },
    //     {
    //       key: 'blocked',
    //       label: 'Blocked',
    //       children: <TableData />,
    //     }
    //   ];

    //   const initialise = async () => {
    //     console.log("latest router query", router.query);
    //     try {
    //       setLoading(true)
    //       let query = router.query
    //       let urlSearchParam = new URLSearchParams()
    //       if (query.pagination) {
    //         urlSearchParam.set('pagination', `${Number(router.query.pagination)}`)
    //       }
    //       if (query.limit) {
    //         urlSearchParam.set('limit', router.query.limit as string)
    //       }
    //       if (query.search) {
    //         urlSearchParam.set('search', router.query.search as string)
    //       }
    //       if (query.type) {
    //         urlSearchParam.set('filter_by', String(router.query.type) as string)
    //       }
    //     //   let apiRes = await henceforthApi.User.listing(urlSearchParam.toString())
    //     //   setState(apiRes)
    //     } catch (error) {

    //     } finally {
    //       setLoading(false)
    //     }
    //   }

    //   React.useEffect(() => {
    //     initialise()
    //   }, [router.query.pagination, router.query.limit, router.query.search, router.query.type])


    //   const handleUploadCsvFile = async (info: any) => {
    //     setLoading(true)
    //     if (info.file.status === 'done' || info.file.status === 'error') {
    //       try {
    //         // let data = await uploadCSV(info.file.originFileObj);
    //         // console.log('data', data);
    //         let apiRes = await henceforthApi.User.import(info.file.originFileObj)
    //         Toast.success((apiRes.count2 + apiRes.count1) == 0 ? "No user added" : `${apiRes.message2} ${apiRes.count2} and ${apiRes.message1} ${apiRes.count1}`);
    //       } catch (error) {
    //       }
    //       setLoading(false)
    //     }
    //   }
    const handleDelete = async (_id: string) => {
        // setDeleteLoading(_id)
        try {
            // let apiRes = await henceforthApi.Faq.delete(_id)
            // Toast.success("FAQ is deleted successfully")
            // await initialise()
        } catch (error) {
            console.log(error)
        } finally {
            // setDeleteLoading("")
        }

    }
    const dataSource = [
        {
            key: '1',
            meeting: "abc",
            start: '08:20 pm 15-07-2024',
            end: "06:20 pm 18-07-2024",
            action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
            <li>
                <Link href={`/admin/meetings/edit`} >
                    <Button type="text" className='px-0 border-0 bg-transparent shadow-none'><Icons.Edit /></Button>
                </Link>
            </li>
            <li>
                <Popconfirm
                    title="Delete"
                    description="Are you sure you want to delete ?"
                    onConfirm={(event) => { event?.stopPropagation(); handleDelete("res._id") }}
                    // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
                >
                    <Button type="text" danger htmlType='button' className='px-0' ><Icons.Delete /></Button>
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
                    <Button type="text" className='px-0 border-0 bg-transparent shadow-none'><Icons.Edit /></Button>
                </Link>
            </li>
            <li>
                <Popconfirm
                    title="Delete"
                    description="Are you sure you want to delete ?"
                    onConfirm={(event) => { event?.stopPropagation(); handleDelete("res._id") }}
                    // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
                >
                    <Button type="text" danger htmlType='button' className='px-0' ><Icons.Delete /></Button>
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
                    <Button type="text" className='px-0 border-0 bg-transparent shadow-none'><Icons.Edit /></Button>
                </Link>
            </li>
            <li>
                <Popconfirm
                    title="Delete"
                    description="Are you sure you want to delete ?"
                    onConfirm={(event) => { event?.stopPropagation(); handleDelete("res._id") }}
                    // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
                >
                    <Button type="text" danger htmlType='button' className='px-0' ><Icons.Delete /></Button>
                </Popconfirm>
            </li>
        </ul>
        },
        {
            key: '4',
            meeting: "abc",
            start: '08:20 pm 15-07-2024',
            end: "06:20 pm 18-07-2024",
            action:<ul className='list-unstyled mb-0 gap-3 d-flex'>
            <li>
                <Link href={`/admin/meetings/edit`} >
                    <Button type="text" className='px-0 border-0 bg-transparent shadow-none'><Icons.Edit /></Button>
                </Link>
            </li>
            <li>
                <Popconfirm
                    title="Delete"
                    description="Are you sure you want to delete ?"
                    onConfirm={(event) => { event?.stopPropagation(); handleDelete("res._id") }}
                    // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
                >
                    <Button type="text" danger htmlType='button' className='px-0' ><Icons.Delete /></Button>
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
                    <Button type="text" className='px-0 border-0 bg-transparent shadow-none'><Icons.Edit /></Button>
                </Link>
            </li>
            <li>
                <Popconfirm
                    title="Delete"
                    description="Are you sure you want to delete ?"
                    onConfirm={(event) => { event?.stopPropagation(); handleDelete("res._id") }}
                    // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
                >
                    <Button type="text" danger htmlType='button' className='px-0' ><Icons.Delete /></Button>
                </Popconfirm>
            </li>
        </ul>
        },
    ];
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
    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };


    const add=()=>{
        router.push("/admin/meetings/add")
    }
    return (
        <MainLayout>

            <Fragment>
                <Head>
                    <title>Meetings</title>
                    <meta name="meetings" content="Meetings" />
                </Head>
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
                                        <Button type="primary" style={{ width: 190 }} htmlType="button" size='large' icon={<UploadOutlined />} onClick={add}>Add Meetings</Button>
                                        {/* </Upload> */}
                                    </div>
                                </div>
                                {/* Search  */}
                                <div className='my-4 d-flex gap-3'>
                                    <Search size='large' placeholder="Search by Meeting Name or year" enterButton />
                                    {/* <Button type="primary" size='large' htmlType="button"  icon={<DownloadOutlined />} onClick={() => setExportModal(true)}>Export</Button> */}
                                    {/* <Space wrap> */}
                                    <FilterSelect />
                                </div>
                                {/* Tabs  */}
                                <div className='tabs-wrapper'>
                                    <Table dataSource={dataSource} columns={columns} pagination={false} />
                                </div>
                                {/* Pagination  */}
                                <Row justify={'center'} className="mt-5" style={{ paddingLeft: "550px" }}>
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

page.getLayout = (page: ReactNode) => (
    <MainLayout>
        {page}
    </MainLayout>
);



export default page;
