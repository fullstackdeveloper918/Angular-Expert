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
import { DownloadOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import MainLayout from "../../components/Layout/layout";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import FilterSelect from "@/components/common/FilterSelect";

import dayjs from "dayjs";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import validation, { capFirst } from "@/utils/validation";
import { pdf } from "@react-pdf/renderer";
import Pdf from "../common/Pdf";
import saveAs from "file-saver";
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
const PastMeetingUserList = () => {
    const router = useRouter()
    const dispatch = useDispatch();
    const [state, setState] = useState<any>([]);
    const [state1, setState1] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredData, setFilteredData] = useState<any>([]);
    const getUserdata=useSelector((state:any)=>state?.user?.userData)
    const searchParam = useParams();
    const id: any = searchParam.id;
    const searchParams = useSearchParams();
    const entries = Array.from(searchParams.entries());
    const value = entries.length > 0 ? entries[0][0] : '';
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
      const getDataById = async (id: any) => {
        //  
        const item = {
            user_id: id
        }
        try {
            const res = await api.User.getById(item as any);
            setState1(res?.data || null);
            return res.data
        } catch (error: any) {
            alert(error.message);
        }
    };
    const generatePdf = async (data?: any) => {
        //  

        const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
        const blob = await pdf(<Pdf state={data} />).toBlob();
        const pdfUrl = URL.createObjectURL(blob);
        return { blob, pdfUrl, timestamp };
    };

    // Function to handle PDF download
    const downLoadPdf = async (res: any) => {

        const { blob, timestamp } = await generatePdf(res);
        saveAs(blob, `${capFirst(res?.company_name)}.pdf`);
    };
      const handleDownloadAndFetchData = async (id: any) => {
        let res = await getDataById(id);
        await downLoadPdf(res);
    };
    const dataSource = state?.length && state
    .sort((a:any, b:any) => a.start_meeting_date - b.start_meeting_date)
    .map((res: any, index: number) => {
        return {
            key: index + 1,
            meeting: `${validation.capitalizeFirstLetter(res?.meeting_type)} ${dayjs(res?.start_meeting_date).format('YYYY')}`||"N/A",
            host_company:capFirst(res?.company_name||"N/A"),
            host_name:capFirst(res?.host)||"N/A",
            host_city:
            <Tooltip title={res?.location}>
           { res?.location? `${res?.location.slice(0,20)}...`:"N/A"}
            </Tooltip>,
            start_date: formatWithOrdinal(res?.start_meeting_date)||"N/A",
            start_time: dayjs(res?.start_time).format('hh:mm A')||"N/A",
            end_date: formatWithOrdinal(res?.end_meeting_date)||"N/A",
            end_time: dayjs(res?.end_time).format('hh:mm A')||"N/A",
            action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
                <li>
                    <Tooltip title="Download Pdf">
                        <Button className='ViewMore ' 
                        onClick={() => handleDownloadAndFetchData(res?.user_id)}
                            ><DownloadOutlined /></Button>
                    </Tooltip>
                </li>
                
                {/* <li>
              <Link href={`/admin/meetings/${res?.id}/view`}> <Tooltip title="View Details"><Button className='ViewMore'><EyeOutlined /></Button> </Tooltip></Link>
          </li> */}
            </ul>
        }
    })
    const baseColumns = [
        {
            title: 'Order No.',
            dataIndex: 'key',
            key: 'key',
        },
        // {
        //     title: 'Meeting Name',
        //     dataIndex: 'meeting',
        //     key: 'meeting',
        // },
        {
            title: 'Host Company',
            dataIndex: 'host_company',
            key: 'host_company',
        },
        // {
        //     title: 'Host Name',
        //     dataIndex: 'host_name',
        //     key: 'host_name',
        // },
        // {
        //     title: 'Host City',
        //     dataIndex: 'host_city',
        //     key: 'host_city',
        // },
        // {
        //     title: 'Meeting Date',
        //     dataIndex: 'start_date',
        //     key: 'start_date',
        // },
        // {
        //     title: 'Meeting Time',
        //     dataIndex: 'start_time',
        //     key: 'start_time',
        // },
        // {
        //     title: 'Meeting End Date',
        //     dataIndex: 'end_date',
        //     key: 'end_date',
        // },
        // {
        //     title: 'Meeting End Time',
        //     dataIndex: 'end_time',
        //     key: 'end_time',
        // },
        {
            title: 'Pdf',
            dataIndex: 'action',
            key: 'action',
        }
    ];
    

    const initialise = async () => {
        let item={
            meeting_id:id
        } as any
        try {
            let res = await api.Meeting.meeting_user(item);
            setState(res?.newResult);
            if (res?.status == 400) {
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });

                // }
                dispatch(clearUserData({}));
                toast.error("Session Expired Login Again")
                router.replace("/auth/signin")
            }
        } catch (error) {
            // if (error) {
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



console.log(state,"check");


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
                                        <Breadcrumb.Item className='text-decoration-none'>{value} Meeting</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                                {/* title  */}
                                <div className='d-flex my-4 flex-column flex-md-row justify-content-between align-items-center gap-3'>
                                    <Typography.Title level={3} className='m-0 fw-bold'>{value} Meeting</Typography.Title>
                                </div>
                                {/* Search  */}
                                {/* <div className='my-4 d-flex gap-3'>
                                    <Search size='large' placeholder="Search by Meeting Name or year" enterButton value={searchTerm} onChange={handleSearch}
                                    />
                                </div> */}
                                {/* Tabs  */}
                                <div className='tabs-wrapper'>
                                    <Table dataSource={dataSource} columns={baseColumns} pagination={{
                                            position: ['bottomCenter'],
                                          }} />
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

export default PastMeetingUserList;
