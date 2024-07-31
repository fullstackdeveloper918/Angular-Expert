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
    Spin,
} from "antd";
import { clearUserData } from "../../lib/features/userSlice";
import { parseCookies, destroyCookie } from "nookies";
import Link from "next/link";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import MainLayout from "../../components/Layout/layout";
import { useRouter } from "next/navigation";
import FilterSelect from "@/components/common/FilterSelect";

import dayjs from "dayjs";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import validation, { capFirst } from "@/utils/validation";
const { Row, Col, Card, Button, Pagination, Tooltip } = {
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

};
const { Search } = Input;
const MeetingList = () => {
    const router = useRouter()
    const dispatch = useDispatch();
    const [areas, setAreas] = useState<any>([]);
    const [filteredData, setFilteredData] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true);
    const getUserdata = useSelector((state: any) => state?.user?.userData)
    useEffect(() => {
        // Filter data when searchTerm or state1 changes
        const filtered = areas?.filter((res: any) => {
            const name = res?.host ? `${res?.host}` : "";
            const meeting_type = res?.meeting_type || "";
            const city = res?.location || "";
            return name.toLowerCase().includes(searchTerm.toLowerCase()) || meeting_type.toLowerCase().includes(searchTerm.toLowerCase()) || city.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setFilteredData(filtered);
    }, [searchTerm, areas]);
    const handleDelete = async (_id: string) => {
        try {

        } catch (error) {
        }

    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
    };
    const archive = async (id: any) => {
        const item = {
            meeting_id: id,
        }
        try {
            let res = await api.Meeting.delete(item as any)
            initialise(id)
            toast.success(res?.message)
            //   setAreas
        } catch (error) {

        }
    }
    const dataSource = filteredData?.length && filteredData
        .sort((a: any, b: any) => a.start_meeting_date - b.start_meeting_date)
        .map((res: any, index: number) => {
            return {
                key: index + 1,
                meeting: `${validation.capitalizeFirstLetter(res?.meeting_type)} ${dayjs(res?.start_meeting_date).format('YYYY')}` || "N/A",
                host_name: capFirst(res?.host) || "N/A",
                host_city:
                    <Tooltip title={res?.location}>
                        {res?.location ? `${res?.location.slice(0, 20)}...` : "N/A"}
                    </Tooltip>,
                start_date: dayjs(res?.start_meeting_date).format('DD-MM-YYYY') || "N/A",
                start_time: dayjs(res?.start_time).format('hh:mm A') || "N/A",
                end_date: dayjs(res?.end_meeting_date).format('DD-MM-YYYY') || "N/A",
                end_time: dayjs(res?.end_time).format('hh:mm A') || "N/A",
                action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
                    <li>
                        <Link href={`/admin/meetings/${res?.id}/edit`} >
                            <Button type="text" className='px-0 border-0 bg-transparent shadow-none'><i className="fa-solid fa-pen-to-square"></i></Button>
                        </Link>
                    </li>
                    {getUserdata?.is_admin == false ? "" :
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
                    <li>
                        <Link href={`/admin/meetings/${res?.id}/view`}> <Tooltip title="View Details"><Button className='ViewMore'><EyeOutlined /></Button> </Tooltip></Link>
                    </li>
                </ul>
            }
        })
    const baseColumns = [
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
            title: 'Meeting Date',
            dataIndex: 'start_date',
            key: 'start_date',
        },
        {
            title: 'Meeting Time',
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
        }
    ];

    // Conditionally add the 'Action' column
    const columns = [
        ...baseColumns,
        ...(getUserdata?.is_admin ? [
            {
                title: 'Action',
                dataIndex: 'action',
                key: 'action',
            }
        ] : [])
    ];


    const initialise = async (query: string) => {
        setLoading(true);
        try {
            const query: any = searchTerm ? `searchTerm=${searchTerm}` : '';
            let res = await api.Meeting.listing(query);
            setAreas(res);
            setLoading(false);
            if (res?.status == 400) {
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });

                // }
                dispatch(clearUserData({}));
                toast.error("Session Expired Login Again")
                router.replace("/auth/signin")
            }
        } catch (error) {
            setLoading(false);
            // if (error) {
            //     destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });

            //     // }
            //     dispatch(clearUserData({}));
            //     toast.error("Session Expired Login Again")
            //     router.replace("/auth/signin")
            // }
        }
    };
    useEffect(() => {
        const query: any = searchTerm ? `searchTerm=${searchTerm}` : '';
        initialise(query);
    }, [searchTerm]);





    const add = () => {
        router.push("/admin/meetings/add")
    }


    return (
        <MainLayout>

            <Fragment>
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
                                    {/* {getUserdata?.is_admin==false?"":
                                    <div className='d-flex gap-2'>
                                        <Button type="primary" style={{ width: 190 }} htmlType="button" size='large' icon={<PlusOutlined />} onClick={add}>Add Meeting</Button>
                                    </div>
                                    } */}
                                </div>
                                {/* Search  */}
                                <div className='my-4 d-flex gap-3'>
                                    <Search size='large' placeholder="Search by Meeting Name or year" enterButton value={searchTerm}
                                        onChange={handleSearch}
                                    />

                                    {getUserdata?.is_admin == false ? "" :
                                        <div className='d-flex gap-2'>
                                            <Button type="primary" style={{ width: 190 }} htmlType="button" size='large' icon={<PlusOutlined />} onClick={add}>Add Meeting</Button>
                                        </div>
                                    }
                                </div>
                                {/* Tabs  */}
                                <div className='tabs-wrapper'>
                                    {loading ? (
                                       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                                       <Spin />
                                   </div>
                                    ) : (
                                        <Table dataSource={dataSource} columns={baseColumns} pagination={{
                                            position: ['bottomCenter'],
                                        }} />)}
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
