"use client";
import type { NextPage } from "next";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
import {
    Table,
    Input,
    Breadcrumb,
    Tabs,
    Typography,
    Upload,
    Badge,
    Tag,
    Select,
    Popconfirm,
} from "antd";
import { clearUserData } from "../../lib/features/userSlice";
import { parseCookies, destroyCookie } from "nookies";
import Link from "next/link";
import { PlusOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import MainLayout from "../../components/Layout/layout";
import { useRouter } from "next/navigation";
import FilterSelect from "@/components/common/FilterSelect";

import dayjs from "dayjs";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import validation from "@/utils/validation";
const { Row, Col, Avatar, Card, Button, Pagination, Tooltip } = {
    Button: dynamic(() => import("antd").then((module) => module.Button), {
        ssr: false,
    }),
    Row: dynamic(() => import("antd").then((module) => module.Row), {
        ssr: false,
    }),
    Col: dynamic(() => import("antd").then((module) => module.Col), {
        ssr: false,
    }),
    Card: dynamic(() => import("antd").then((module) => module.Card), {
        ssr: false,
    }),
    Pagination: dynamic(
        () => import("antd").then((module) => module.Pagination),
        { ssr: false }
    ),
    Tooltip: dynamic(() => import("antd").then((module) => module.Tooltip), {
        ssr: false,
    }),
    Avatar: dynamic(() => import("antd").then((module) => module.Avatar), {
        ssr: false,
    }),
};
const { Search } = Input;
const MeetingList = () => {
    const router = useRouter()
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(false)
    const [areas, setAreas] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState('')
    const getUserdata=useSelector((state:any)=>state?.user?.userData)
    const handleDelete = async (_id: string) => {
        try {

        } catch (error) {
        }

    }


    const archive = async (id: any) => {
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
    const dataSource = areas?.length && areas?.map((res: any, index: number) => {
        return {
            key: index + 1,
            meeting: `${validation.capitalizeFirstLetter(res?.meeting_type)}`,
            start_date: dayjs(res?.start_meeting_date).format('DD-MM-YYYY'),
            start_time: dayjs(res?.start_time).format('hh:mm A'),
            end_date: dayjs(res?.end_meeting_date).format('DD-MM-YYYY'),
            end_time: dayjs(res?.end_time).format('hh:mm A'),
            action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
                <li>
                    <Link href={`/admin/meetings/${res?.id}/edit`} >
                        <Button type="text" className='px-0 border-0 bg-transparent shadow-none'><i className="fa-solid fa-pen-to-square"></i></Button>
                    </Link>
                </li>
                {getUserdata?.is_admin==false?"":
                <li>
                    <Popconfirm
                        title="Delete"
                        description="Are you sure you want to delete ?"
                        onConfirm={(event: any) => { archive(res?.id) }}
                    // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
                    >
                        <Button type="text" danger htmlType='button' className='px-0' ><i className="fa-solid fa-trash-can"></i></Button>
                    </Popconfirm>
                </li>}
            </ul>
        }
    })
    const columns = [
        {
            title: 'Sr.No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Meeting Type',
            dataIndex: 'meeting',
            key: 'meeting',
        },
        {
            title: 'Meeting Start Date',
            dataIndex: 'start_date',
            key: 'start_date',
        },
        {
            title: 'Meeting Start Time',
            dataIndex: 'start_time',
            key: 'start_time',
        },
        {
            title: 'Meeting End Date',
            dataIndex: 'end_date',
            key: 'end_date',
        },
        {
            title: 'Meeting End Time',
            dataIndex: 'end_time',
            key: 'end_time',
        },

        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
    ];
    const [meeting, setMeeting] = useState<any>(null);
    let meetingId: any = 1


    const initialise = async () => {
        try {
            let res = await api.Meeting.listing();
            setAreas(res);
            if (res?.status == 400) {
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });

                // }
                dispatch(clearUserData({}));
                toast.error("Session Expired Login Again")
                router.replace("/auth/signin")
            }
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
                                        <Breadcrumb.Item><Link className='text-decoration-none' href="/admin/dashboard">General</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item className='text-decoration-none'>Meetings</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                                {/* title  */}
                                <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3'>
                                    <Typography.Title level={3} className='m-0 fw-bold'>Meetings</Typography.Title>
                                    {getUserdata?.is_admin==false?"":
                                    <div className='d-flex gap-2'>
                                        {/* <Upload className='tooltip-img' showUploadList={false} accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'> */}
                                        <Button type="primary" style={{ width: 190 }} htmlType="button" size='large' icon={<PlusOutlined />} onClick={add}>Add Meeting</Button>
                                        {/* </Upload> */}
                                    </div>
                                    }
                                </div>
                                {/* Search  */}
                                <div className='my-4 d-flex gap-3'>
                                    <Search size='large' placeholder="Search by Meeting Name or year" enterButton value={searchTerm}
                                    />
                                    {/* <Button type="primary" size='large' htmlType="button"  icon={<DownloadOutlined />} onClick={() => setExportModal(true)}>Export</Button> */}
                                    {/* <Space wrap> */}
                                    {getUserdata?.is_admin==false?"":
                                    <FilterSelect />}
                                </div>
                                {/* Tabs  */}
                                <div className='tabs-wrapper'>
                                    <Table dataSource={dataSource} columns={columns} pagination={false} />
                                </div>
                                {/* Pagination  */}
                                {/* <Row justify={'center'} className="mt-5 d-flex paginationCenter">
                                    <Col span={24}>
                                        <Pagination total={15} hideOnSinglePage={true} disabled={loading} />
                                    </Col>
                                </Row> */}
                            </Card>
                        </Col>
                    </Row>


                </section>
            </Fragment>
        </MainLayout>
    );
};

export default MeetingList;
