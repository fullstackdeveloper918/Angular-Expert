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
import Unarchive from "../../assests/images/3669187_unarchive_ic_icon (2).png"
const { Search } = Input;
type Page<P = {}> = NextPage<P> & {
    getLayout?: (page: ReactNode) => ReactNode;
};

const ArchiveMemberList = () => {
    const router = useRouter()
    const [loading1, setLoading1] = useState(true);
    //   const { userInfo, downloadCSV, Toast, uploadCSV } = React.useContext(GlobalContext)
    const getUserdata = useSelector((state: any) => state?.user?.userData)
    console.log(getUserdata,"getUserdata");
    
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
    const [filteredData, setFilteredData] = useState(state1?.data);
    const [data, setData] = useState<any>([]);
    const [loadingState, setLoadingState] = useState<{ [key: string]: boolean }>({});
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
    const getDataById = async (id: any) => {
        //  
        const item = {
            user_id: id,
            meeting_id:getUserdata.meetings.NextMeeting.id
        }
        try {
            const res = await api.User.getById(item as any);
            setState(res?.data || null);
            return res.data
        } catch (error: any) {
            alert(error.message);
        }
    };
    const generatePdf = async (data?: any) => {
        //  
        console.log(data,"asjldjas");
        

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

    // Function to handle PDF sharing
    const sharePdf = async (item: any) => {
        //  

        const { pdfUrl, timestamp } = await generatePdf(item);
        const response = await fetch(pdfUrl);
        const blob = await response.blob();

        // Convert the blob to a file
        const file = new File([blob], `${capFirst(item?.company_name)}.pdf`, { type: 'application/pdf' });
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('https://frontend.goaideme.com/save-pdf', {
            method: 'POST',
            body: formData,
            headers: {
                Token: `${accessToken}`,
             
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
    const handleFetchAndFetchData = async (id: any) => {
         
        let item = await getDataById(id);
        await sharePdf(item);
    };
    // const completed2 = state2?.filter((res:any) => res?.is_completed === true);
    const user_completed = state2?.slice(0, 5).map((res: any, index: number) => {
        const companyName = companyNameMap[res?.company_name || ""] || "N/A";
        const isLoading = loadingState[res?.uid];
        return {
            key: index + 1,
            name: res?.firstname ? `${res?.firstname} ${res?.lastname}` : "N/A",
            company: companyName||"N/A",
            email: res?.email||"N/A",
            status: res?.is_completed == true ? "Completed" : "Pending",
            action: <ul className='m-0 list-unstyled d-flex gap-2'>
                <li>
                    <Tooltip title="Download Pdf">
                        <Button className='ViewMore ' onClick={() => handleDownloadAndFetchData(res?.uid)}>{isLoading ? <Spin /> : <DownloadOutlined />}</Button>
                    </Tooltip>
                </li>
                <li>
                    <Tooltip title="Share Pdf link">
                        <Button className='ViewMore ' onClick={() => handleFetchAndFetchData(res?.uid)}><ShareAltOutlined /></Button>
                    </Tooltip>
                </li>
                <li>
                    <Link href={`/admin/member/${res?.uid}/view`}> <Tooltip title="View Details"><Button className='ViewMore'><EyeOutlined /></Button> </Tooltip></Link>
                </li>

            </ul>
        }
    }
    );
    const user_completed_columns = [
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
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
    ];
    const dataSource = filteredData?.map((res: any, index: number) => {
        const companyName = companyNameMap[res?.company_name || ""] || "N/A";
        const isLoading = loadingState[res?.id];
        return {
            key: index + 1,
            name: res?.firstname ? `${validation?.capitalizeFirstLetter(res?.firstname)} ${validation?.capitalizeFirstLetter(res?.lastname)}` : "N/A",
            company:companyName||"N/A",
            email: res?.email||"N/A",
            phone: res?.phone_number||"N/A",
            position: validation?.capitalizeFirstLetter(res?.position||"N/A"),
            city: validation?.capitalizeFirstLetter(res?.home_city||"N/A"),
            action: <ul className='m-0 list-unstyled d-flex gap-2'>
                <li>
                    <Tooltip title="Download Pdf">
                        <Button className='ViewMore ' onClick={() => handleDownloadAndFetchData(res?.id)}>{isLoading ? <Spin /> : <DownloadOutlined />}</Button>
                    </Tooltip>
                </li>
                <li>
                    <Tooltip title="Share Pdf link">
                        <Button className='ViewMore ' onClick={() => handleFetchAndFetchData(res?.id)}><ShareAltOutlined /></Button>
                    </Tooltip>
                </li>
                <li>
                            <Popconfirm
                                title="Unarchive"
                                description="Are you sure you want to Unarchive ?"
                                onConfirm={(event: any) => { unarchive(res?.id) }}
                            // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
                            >
                                <Button type="text" danger htmlType='button' className='px-0' ><img src={Unarchive.src} alt="" /></Button>
                            </Popconfirm>
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
                {/* <li>
                    <Link href={`/admin/member/${res?.id}/view`}> <Tooltip title="View Details"><Button className='ViewMore'><EyeOutlined /></Button> </Tooltip></Link>
                </li> */}

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
            title: 'Home City',
            dataIndex: 'city',
            key: 'city',
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
       
        ...(hasClubMemberPermission ? [{
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        }] : [])
    ];

    const addUser = () => {
        router.push("/admin/member/add")
    }



    const getData = async () => {
        setLoading1(true)
        try {
            let query = searchTerm ? `searchTerm=${searchTerm}` : '';
            let res = await api.User.arcivelisting(query);
          
            
            setState1(res?.data);
         
            let apiRes = await api.User.user_listing()
            setState2(apiRes?.data)
            setLoading1(false)
            
        } catch (error:any) {
            setLoading1(false)
            
        }
    };


    const archive = async (id: any) => {
        const item = {
            userId: id,
        }
        try {
            let res = await api.User.archive_user_delete(item as any)
            // initialise(id)
            toast.success(res?.message)
            getData()
            //   setAreas
        } catch (error) {

        }
    }

    
    const unarchive = async (id: any) => {
        const item = {
            user_id: id,
        }
        try {
            let res = await api.User.unarchive_user(item as any)
            // initialise(id)
            toast.success(res?.message)
            getData()
            //   setAreas
        } catch (error) {

        }
    }


    useEffect(() => {
        const query = searchTerm ? `searchTerm=${searchTerm}` : '';
        getData();
    }, [searchTerm]);

    const loadMore = () => {
        if (!loading) {
            const query = searchTerm ? `searchTerm=${searchTerm}` : '';
            getData();
        }
    };
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
                                    </Breadcrumb>
                                </div>
                                {/* title  */}
                                <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3'>
                                    <Typography.Title level={3} className='m-0 fw-bold'>Archive Members</Typography.Title>
                                </div>
                                {/* Search  */}
                                <div className='my-4 '>
                                    <Search size='large' className='' placeholder="Search by Name & Email" enterButton value={searchTerm}
                                        onChange={handleSearch} />
                                    {/* <Button type="primary" size='large' htmlType="button"  icon={<DownloadOutlined />} onClick={() => setExportModal(true)}>Export</Button> */}
                                    {/* <Space wrap> */}
                                    {/* <Select
                                defaultValue="lucy"
                                style={{ width: 220 }}
                                // onChange={handleChange}
                                size='large'
                                options={[
                                    { value: 'jack', label: 'Jack' },
                                    { value: 'lucy', label: 'Lucy' },
                                    { value: 'Yiminghe', label: 'yiminghe' },
                                    { value: 'disabled', label: 'Disabled', disabled: true },
                                ]}
                            /> */}
                                </div>
                                {/* Tabs  */}
                                <div className='tabs-wrapper'>
                                    {loading1 ? (
                                       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
                                       <Spin size="large"/>
                                   </div>
                                    ) : (
                                        <>
                                         <Table className="tableBox" dataSource={dataSource} columns={columns}  pagination={{
                                            position: ['bottomCenter'],
                                        }}/>
                                    {/* {getUserdata?.is_admin == false ?
                                        <Table className="tableBox" dataSource={user_completed} columns={user_completed_columns} pagination={{
                                            position: ['bottomCenter'],
                                        }} /> :
                                        <Table className="tableBox" dataSource={dataSource} columns={columns}  pagination={{
                                            position: ['bottomCenter'],
                                        }}/>
                                    } */}
                                    </>)}
                                </div>
                               
                            </Card>
                        </Col>
                    </Row>


                </section>
            </Fragment>
        </>
    );
};

// Page.getLayout = (Page: ReactNode) => <>{Page}</>;

export default ArchiveMemberList;
