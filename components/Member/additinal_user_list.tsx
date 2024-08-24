"use client";
import type { NextPage } from "next";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
import {
    Table,
    Input,
    Breadcrumb,
    Typography,
    Tooltip,
    Button,
    Row,
    Col,
    Card,
    Pagination,
    Spin,
    Popconfirm,
    Divider,
} from "antd";
import Link from "next/link";
import { DownloadOutlined, EyeOutlined, PlusOutlined, ShareAltOutlined } from "@ant-design/icons";
import MainLayout from "../../components/Layout/layout";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { destroyCookie, parseCookies } from "nookies";
import { toast, ToastContainer } from "react-toastify";
import { pdf } from "@react-pdf/renderer";
import Pdf from "../common/Pdf";
import saveAs from "file-saver";
import { useSelector } from "react-redux";
import validation, { capFirst } from "../../utils/validation";

const { Search } = Input;
type Page<P = {}> = NextPage<P> & {
    getLayout?: (page: ReactNode) => ReactNode;
};

const AdditionalList = () => {
    const router = useRouter()
    const [loading1, setLoading1] = useState(true);
    //   const { userInfo, downloadCSV, Toast, uploadCSV } = React.useContext(GlobalContext)
    const getUserdata = useSelector((state: any) => state?.user?.userData)
  
    
    const hasClubMemberPermission = (getUserdata?.permission?.length && getUserdata.permission.includes("CLUB_MEMEBR")) || getUserdata?.email === "nahbcraftsmen@gmail.com";
    const [show, setShow] = useState(true);
    const [lastVisibleId, setLastVisibleId] = useState<any>(null);
    const [state, setState] = React.useState<any>({
        id: "",
        name: "",
        company: "",
        email: "",
        phone: "",
        position: "",
        home: "",
        is_activate: "",
        is_archive: ""
    })
    const [state1, setState1] = useState<any>([])
    const [state2, setState2] = useState<any>([])
    const cookies = parseCookies();
    const accessToken = cookies.COOKIES_USER_ACCESS_TOKEN;
    const [loading, setLoading] = React.useState(false)
    const [exportModal, setExportModal] = React.useState(false);
    const [areas, setAreas] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState<any>('');
    const [filteredData, setFilteredData] = useState(state1);
    const [data, setData] = useState<any>([]);
    // const [lastVisibleId, setLastVisibleId] = useState(null);
    useEffect(() => {
        // Filter data when searchTerm or state1 changes
        const filtered = state1?.filter((res: any) => {
            const name = res?.firstname ? `${res?.firstname} ${res?.lastname}` : "";
            const email = res?.email || "";
            return name.toLowerCase().includes(searchTerm.toLowerCase()) || email.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setFilteredData(filtered);
    }, [searchTerm, state1]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
    };
    
    const companyNameMap:any = {
        "augusta": "Augusta Homes, Inc.",
        "buffington": "Buffington Homes, L.P.",
        "cabin": "Cabin John Builders",
        "cataldo": "Cataldo Custom Builders",
        "david_campbell": "The DCB",
        "dc_building": "DC Building Inc.",
        "Ddenman_construction": "Denman Construction, Inc.",
        "ellis": "Ellis Custom Homes",
        "tm_grady_builders": "T.M. Grady Builders",
        "hardwick": "Hardwick G. C.",
        "homeSource": "HomeSource Construction",
        "ed_nikles": "Ed Nikles Custom Builder, Inc.",
        "olsen": "Olsen Custom Homes",
        "raykon": "Raykon Construction",
        "matt_sitra": "Matt Sitra Custom Homes",
        "schneider": "Schneider Construction, LLC",
        "shaeffer": "Shaeffer Hyde Construction",
        "split": "Split Rock Custom Homes",
        "tiara": "Tiara Sun Development"
    };
    const archive = async (id: any) => {
        const item = {
            user_id: id,
        }
        try {
            let res = await api.User.delete1(item as any)
            // if(res) {
            //     toast.success(res?.message)
            // }
            getData()
         
        } catch (error) {
           
        }
    }
    const dataSource = state1?.map((res: any, index: number) => {
        const companyName = companyNameMap[res?.company_name || ""] || "N/A";
        return {
            key: index + 1,
            name: res?.firstname ? `${validation?.capitalizeFirstLetter(res?.firstname)} ${validation?.capitalizeFirstLetter(res?.lastname)}` : "N/A",
            company:companyName||"N/A",
            email: res?.email||"N/A",
            action: <ul className='m-0 list-unstyled d-flex gap-2'>
               <li>
                        <Link href={`/admin/additional_users/${res?.id}/edit`} >
                            <Button type="text" className='px-0 border-0 bg-transparent shadow-none'><i className="fa-solid fa-pen-to-square"></i></Button>
                        </Link>
                    </li>
                        <li>
                            <Popconfirm
                                title="Delete"
                                description="Are you sure you want to delete ?"
                                onConfirm={(event: any) => { archive(res?.id) }}
                            // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
                            >
                                <Button type="text" danger htmlType='button' className='px-0' ><i className="fa-solid fa-trash-can"></i></Button>
                            </Popconfirm>
                        </li>

            </ul>
        }
    }
    );
    const columns = [
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
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        }
    ];






    const addUser = () => {
        router.push(`/admin/member/additional_user?${getUserdata?.user_id}`)
    }



    const getData = async () => {
        setLoading1(true)
        let item={
            parent_user_id:getUserdata?.user_id
        } as any
        try {
          
            let res = await api.User.additional_user_listing(item);
            
            setState1(res?.data || []);
            if (res?.data?.status == 500 || res?.data?.message=="Firebase ID token has expired. Get a fresh ID token from your client app and try again (auth/id-token-expired). See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token.") {
                // destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                // localStorage.removeItem('hasReloaded');
                // toast.error("Session Expired Login Again")
                // router.replace("/auth/signin")
                localStorage.setItem('redirectAfterLogin', window.location.pathname);
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                // dispatch(clearUserData({}));
                toast.error("Session Expired. Login Again");
                router.replace("/auth/signin");
            }

            console.log('app crashed')
            
        } catch (error:any) {
            setLoading1(false)
            if (error?.status==500) {
                // destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                // localStorage.removeItem('hasReloaded');

                // toast.error("Session Expired Login Again")
                // router.replace("/auth/signin")
                localStorage.setItem('redirectAfterLogin', window.location.pathname);
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                // dispatch(clearUserData({}));
                toast.error("Session Expired. Login Again");
                router.replace("/auth/signin");
            }
        }
        finally{
            setLoading1(false)
        }
    };

    useEffect(() => {
     
        getData();
    }, [searchTerm]);

    const loadMore = () => {
        if (!loading) {
            const query = searchTerm ? `searchTerm=${searchTerm}` : '';
            getData();
        }
    };
    return (
        <MainLayout>

            <Fragment>
                {/* <Head>
            <title>Users</title> 
            <meta name="description" content="Users" />
        </Head> */}
                <ToastContainer
                    position="top-center"
                    autoClose={300}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                <section>
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <Card className='common-card'>
                                <div className='mb-4'>
                                    <Breadcrumb separator=">">
                                        <Breadcrumb.Item><Link className='text-decoration-none' href="/admin/dashboard">General</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item className='text-decoration-none'>Additional Users</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                                {/* title  */}
                                <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3'>
                                    <Typography.Title level={3} className='m-0 fw-bold'>Additional Users</Typography.Title>

                                        <div className='d-flex gap-2'>
                                            {/* <Upload className='tooltip-img' showUploadList={false} accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'> */}
                                            <Button type="primary" htmlType="button" size='large' className='primaryBtn' icon={<PlusOutlined />} onClick={addUser}>Add Additional Users</Button>
                                            {/* </Upload> */}
                                        </div>
                                </div>
                                {/* Search  */}
                             <Divider/>
                                {/* Tabs  */}
                                <div className='tabs-wrapper my-4'>
                                    {loading1 ? (
                                       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
                                       <Spin size="large"/>
                                   </div>
                                    ) : (
                                        <>
                                
                                        <Table className="tableBox" dataSource={dataSource} columns={columns}  pagination={{
                                            position: ['bottomCenter'],
                                        }}/>
                                    
                                    </>)}
                                </div>
                               
                            </Card>
                        </Col>
                    </Row>


                </section>
            </Fragment>
        </MainLayout>
    );
};

// Page.getLayout = (Page: ReactNode) => <MainLayout>{Page}</MainLayout>;

export default AdditionalList;
