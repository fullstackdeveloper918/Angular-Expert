"use client";
import type { NextPage } from "next";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
import {
    Table,
    Input,
    Breadcrumb,
    Tabs,
    Typography,
    Spin,
} from "antd";
import { clearUserData } from "../../lib/features/userSlice";
import {  destroyCookie, parseCookies } from "nookies";
import Link from "next/link";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

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
const PastMeetingList = () => {
    const router = useRouter()
    const dispatch = useDispatch();
    const cookies = parseCookies();
        const accessToken = cookies.COOKIES_USER_ACCESS_TOKEN;
    const [areas, setAreas] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredData, setFilteredData] = useState<any>([]);
    const getUserdata=useSelector((state:any)=>state?.user?.userData)
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
      
        const formattedDate = `${dayjs(date).format('MMMM')} ${getOrdinalSuffix(day)}, ${dayjs(date).format('YYYY')}`;
        return formattedDate;
      };
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
   
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
    };
    const [state,setState]=useState<any>("")
    const getDataById = async (id: any) => {
        //  
        const item = {
            user_id: getUserdata.user_id,
            meeting_id:id
        }
        try {
            const res = await api.User.getById(item as any);
            setState(res?.data || null);
            // if (res?.data?.status == 500) {
            //     destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });

            //     // }
            //     // dispatch(clearUserData({}));
            //     toast.error("Session Expired Login Again")
            //     router.replace("/auth/signin")
            // }
            return res.data
        } catch (error: any) {
            alert(error.message);
        }
    };
    const [companyNameData,setCompanyNameData] = useState<any>("")
    
    const fetchCompanyData = async () => {
        try {
          const res = await fetch("https://cybersify.tech/sellmacdev/company.php");
          const data = await res.json();
    
          const objectContent = Object.entries(data);
    
    
          console.log(objectContent,"here to se companies")
          setCompanyNameData(objectContent);
    
          // setFilteredData(allNames);
        } catch (err) {
          console.log("Failed to fetch companies",err);
        }
      };
    
      useEffect(() => {
        fetchCompanyData();
      },[]);
    
       function getDisplayNameByKey(key: string | undefined): string {
          if (!key) return "N/A";
    
          const keyLower = key.toLowerCase();
    
          const found = companyNameData.find(
            ([k, _]: [string, string]) => k.toLowerCase() === keyLower
          );
    
          return found ? found[1] : "N/A";
        }
  
  
    const generatePdf = async (data?: any) => {
                const companyName  = getDisplayNameByKey(data?.company_name)

        console.log(data,"asjldjas");
        const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
        const blob = await pdf(<Pdf state={data} companyName={companyName} />).toBlob();
        const pdfUrl = URL.createObjectURL(blob);
        return { blob, pdfUrl, timestamp };
    };

    // Function to handle PDF download
    const downLoadPdf = async (res: any) => {

        const { blob, timestamp } = await generatePdf(res);
        saveAs(blob, `${capFirst(res?.company_name)}.pdf`);
    };

    // Function to handle PDF sharing
    const sharePdf = async (item: any) => {
        //  
        // const companyName = companyNameMap[item?.company_name || ""] || "N/A";
     const companyName = getDisplayNameByKey(item?.company_name)
        const { pdfUrl, timestamp } = await generatePdf(item);
        const response = await fetch(pdfUrl);
        const blob = await response.blob();

        // Convert the blob to a file
        const file = new File([blob], `${capFirst(item?.company_name)}.pdf`, { type: 'application/pdf' });
        const formData = new FormData();
        formData.append('file', file);
        formData.append("user_id", getUserdata?.user_id);
        formData.append("meeting_id", getUserdata.meetings.NextMeeting.id);
        formData.append("company_name", companyName);


        const res = await fetch('https://frontend.goaideme.com/save-pdf', {
        // const res = await fetch('https://app-uilsndszlq-uc.a.run.app/save-pdf', {

            method: 'POST',
            body: formData,
            headers: {
                Token: `${accessToken}`,
                // 'Content-Type': 'application/json',
            }
        },);

        const apiRes: any = await res.json()
        navigator.clipboard.writeText(apiRes?.fileUrl)
            .then(() => {
                toast.success('Link copied to clipboard');
            })
            .catch(() => {
                toast.error('Failed to copy link to clipboard');
            });

    };


  const [loadingState, setLoadingState] = useState<{ [key: string]: boolean }>({});
    const handleDownloadAndFetchData = async (id: any) => {
        setLoadingState((prevState) => ({ ...prevState, [id]: true })); // Set loading state for the specific item
        try {
            let res = await getDataById(id);
            await downLoadPdf(res);
        } catch (error) {
        } finally {
            setLoadingState((prevState) => ({ ...prevState, [id]: false })); // Reset loading state for the specific item
        }
    };



    const archive = async (id: any) => {
        const item = {
            meeting_id: id,
        }
        try {
            let res = await api.Meeting.delete(item as any)
            initialise(id)
            //   setAreas
        } catch (error) {

        }
    }
    const dataSource = filteredData?.length && filteredData
    .sort((a:any, b:any) => a.start_meeting_date - b.start_meeting_date)
    .map((res: any, index: number) => {
     const companyName = getDisplayNameByKey(res?.host_company)
        const isLoading = loadingState[res?.id];
        return {
            key: index + 1,
            meeting: `${validation.capitalizeFirstLetter(res?.meeting_type)} ${dayjs(res?.start_meeting_date).format('YYYY')}`||"N/A",
            host_company:res?.host_company||"N/A",
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
                {/* {getUserdata?.is_admin? */}
                <li>
              <Link href={`/admin/meetings/${res?.id}/meeting-user?${dayjs(res?.start_meeting_date).format('YYYY')}`}> <Tooltip title="View Details"><Button className='ViewMore'><EyeOutlined /></Button> </Tooltip></Link>
          </li>
          {/* :
          <li>
                    <Tooltip title="Download Pdf">
                        <Button className='ViewMore ' onClick={() => handleDownloadAndFetchData(res?.id)}>   {isLoading ? <Spin /> : <DownloadOutlined />}</Button>
                    </Tooltip>
                </li>} */}
            </ul>
        //     action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
        //         {getUserdata?.is_admin?
        //         <li>
        //       <Link href={`/admin/meetings/${res?.id}/meeting-user?${dayjs(res?.start_meeting_date).format('YYYY')}`}> <Tooltip title="View Details"><Button className='ViewMore'><EyeOutlined /></Button> </Tooltip></Link>
        //   </li>:
        //   <li>
        //             <Tooltip title="Download Pdf">
        //                 <Button className='ViewMore ' onClick={() => handleDownloadAndFetchData(res?.id)}>   {isLoading ? <Spin /> : <DownloadOutlined />}</Button>
        //             </Tooltip>
        //         </li>}
        //     </ul>
        }
    })
    const isUserAvailable = true;
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
            title: 'Host Company',
            dataIndex: 'host_company',
            key: 'host_company',
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
        getUserdata?.is_admin
        ?
        {
            title: 'Information',
            dataIndex: 'action',
            key: 'action',
          }:
        {
            title: 'Download',
            dataIndex: 'action',
            key: 'action',
          }
       
        
    ];
    

    const initialise = async (query:string) => {
        try {
            const query: any = searchTerm ? `searchTerm=${searchTerm}` : '';
            let res = await api.Meeting.past_meeting(query);
            setAreas(res?.result);
            if (res?.status == 500) {
                localStorage.setItem('redirectAfterLogin', window.location.pathname);
                localStorage.removeItem("hasReloaded")
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                dispatch(clearUserData({}));
                toast.error("Session Expired. Login Again");
                router.replace("/auth/signin");
            }
        } catch (error:any) {
            if (error?.status==500) {
                localStorage.setItem('redirectAfterLogin', window.location.pathname);
                localStorage.removeItem("hasReloaded")
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                dispatch(clearUserData({}));
                toast.error("Session Expired. Login Again");
                router.replace("/auth/signin");
            }
        }
    };
    useEffect(() => {
        const query: any = searchTerm ? `searchTerm=${searchTerm}` : '';
        initialise(query);

    }, []);





    const add = () => {
        router.push("/admin/meetings/add")
    }


    return (
        <>

            <Fragment>
                <section>
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <Card className='common-card'>
                                <div className='mb-4'>
                                    <Breadcrumb separator=">">
                                        <Breadcrumb.Item><Link className='text-decoration-none' href="/admin/dashboard">General</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item className='text-decoration-none'>Past Meetings</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                                {/* title  */}
                                <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3'>
                                    <Typography.Title level={3} className='m-0 fw-bold'>Past Meetings</Typography.Title>
                                </div>
                                {/* Search  */}
                                <div className='my-4 d-flex gap-3'>
                                    <Search size='large' placeholder="Search by Meeting Name or year" enterButton value={searchTerm} onChange={handleSearch}
                                    />
                                </div>
                                {/* Tabs  */}
                                <div className='tabs-wrapper'>
                                    <Table dataSource={dataSource} columns={baseColumns} pagination={{
                                            position: ['bottomCenter'],
                                          }} />
                                </div>
                            </Card>
                        </Col>
                    </Row>


                </section>
            </Fragment>
        </>
    );
};

export default PastMeetingList;
