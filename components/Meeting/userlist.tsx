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
} from "antd";
import Link from "next/link";
import { DownloadOutlined, EyeOutlined, PlusOutlined, ShareAltOutlined } from "@ant-design/icons";
import MainLayout from "../../components/Layout/layout";
import { useRouter } from "next/navigation";
// import api from "@/utils/api";
import { destroyCookie, parseCookies } from "nookies";
import { toast, ToastContainer } from "react-toastify";
import { pdf } from "@react-pdf/renderer";
import Pdf from "../common/Pdf";
import saveAs from "file-saver";
import { useSelector } from "react-redux";
import validation, { capFirst } from "../../utils/validation";
import api from "@/utils/api";

const { Search } = Input;
type Page<P = {}> = NextPage<P> & {
    getLayout?: (page: ReactNode) => ReactNode;
};

const UserList = ({subheadinglist}:any) => {
    const router = useRouter()
    const [loading1, setLoading1] = useState(true);
    const getUserdata = useSelector((state: any) => state?.user?.userData)
    const hasClubMemberPermission = (getUserdata?.permission?.length && getUserdata.permission.includes("CLUB_MEMEBR")) || getUserdata?.email === "nahbcraftsmen@gmail.com";
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
    const [loadingState, setLoadingState] = useState<{ [key: string]: boolean }>({});
    const [state1, setState1] = useState<any>([])
    const [state2, setState2] = useState<any>([])
    const cookies = parseCookies();
    const accessToken = cookies.COOKIES_USER_ACCESS_TOKEN;
    const [loading, setLoading] = React.useState(false)
    const [searchTerm, setSearchTerm] = useState<any>('');
    const [filteredData, setFilteredData] = useState(state1);
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
console.log(data,"popopo");

        const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
        const blob = await pdf(<Pdf state={data} />).toBlob();
        console.log(blob,"sdglsdfkgsd");
        const pdfUrl = URL.createObjectURL(blob);
        console.log(pdfUrl,"rtrtrt");
        
        return { blob, pdfUrl, timestamp };
    };

    // Function to handle PDF download
    const downLoadPdf = async (res: any) => {
        console.log(res,"iyiyy");
        
        const companyName = companyNameMap[res?.company_name || ""] || "N/A";
        const { blob, timestamp } = await generatePdf(res);
        saveAs(blob, `${companyName}.pdf`);
    };

    // Function to handle PDF sharing
    const sharePdf = async (item: any) => {
        const companyName = companyNameMap[item?.company_name || ""] || "N/A";

        const { pdfUrl, timestamp } = await generatePdf(item);
        const response = await fetch(pdfUrl);
        const blob = await response.blob();

        // Convert the blob to a file
        const file = new File([blob], `${companyName}.pdf`, { type: 'application/pdf' });
        const formData = new FormData();
        formData.append('file', file);


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

    const formatPhoneNumber = (phoneNumber: any) => {
        // Remove any non-numeric characters
        const cleanNumber = phoneNumber.replace(/\D/g, "");
      
        // Check if the number starts with +61 and has 10 digits
        if (cleanNumber.length === 10 && cleanNumber.startsWith("6")) {
            // Format for numbers starting with +61 (e.g., +61 414580011)
            const countryCode = cleanNumber.slice(0, 2);  // Country code (+61)
            const restOfNumber = cleanNumber.slice(2);  // The remaining part of the number
        
            // Correct the formatting to include the space after the country code
            return `+${countryCode} ${restOfNumber}`;  // Format: +61 414580011
          }
      
        // Check if the number starts with +1 and has 11 digits
        if (cleanNumber.length === 11 && cleanNumber.startsWith("1")) {
          // Format for numbers starting with +1 (e.g., +1 (xxx) xxx-xxxx)
          const countryCode = cleanNumber.slice(0, 1);  // Country code (+1)
          const areaCode = cleanNumber.slice(1, 4);  // Area code (next 3 digits)
          const firstPart = cleanNumber.slice(4, 7);  // First part of the phone number (next 3 digits)
          const secondPart = cleanNumber.slice(7);  // Second part of the phone number (last 4 digits)
      
          return `+${countryCode} (${areaCode}) ${firstPart}-${secondPart}`;
        }
      
        // Return the original number if it doesn't fit the expected pattern
        return` ${phoneNumber.slice(0,3)} ${phoneNumber.slice(3)}`;
      };
    // const completed2 = state2?.filter((res:any) => res?.is_completed === true);
    const user_completed = state2?.slice(0, 5).map((res: any, index: number) => {
        const companyName = companyNameMap[res?.company_name||getUserdata?.master_user_detail?.company_name] || "N/A";
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
                        <Button className='ViewMore ' onClick={() => handleDownloadAndFetchData(res?.uid)}> {isLoading ? <Spin /> : <DownloadOutlined />}</Button>
                    </Tooltip>
                </li>
                <li>
                    <Tooltip title="Share Pdf link">
                        <Button className='ViewMore ' onClick={() => handleFetchAndFetchData(res?.uid)}><ShareAltOutlined /></Button>
                    </Tooltip>
                </li>
                {getUserdata?.parent_user_id?"":
                <li>
                    <Link href={`/admin/member/add/page2?${getUserdata?.user_id}&edit`}> <Tooltip title="Edit Documents"><Button type="text" className='px-0 border-0 bg-transparent shadow-none'><i className="fa-solid fa-pen-to-square"></i></Button> </Tooltip></Link>
                    {/* <Link href={`/admin/meetings/${res?.id}/edit`} >
                            <Button type="text" className='px-0 border-0 bg-transparent shadow-none'><i className="fa-solid fa-pen-to-square"></i></Button>
                        </Link> */}
                </li>}

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
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
    ];
    const dataSource = filteredData?.map((res: any, index: number) => {
        const companyName = companyNameMap[res?.company_name || res?.master_user_detail?.company_name] || "N/A";
        const isLoading = loadingState[res?.id];
        return {
            key: index + 1,
            name: res?.firstname ? `${validation?.capitalizeFirstLetter(res?.firstname)} ${validation?.capitalizeFirstLetter(res?.lastname)}` : "N/A",
            company:companyName||"N/A",
            email: res?.email||"N/A",
            phone: formatPhoneNumber(res?.phone_number)||"N/A",
            position: validation?.capitalizeFirstLetter(res?.position||"N/A"),
            city: validation?.capitalizeFirstLetter(res?.home_city||"N/A"),
            action: <ul className='m-0 list-unstyled d-flex gap-2'>
                <li>
                    <Tooltip title="Download Pdf">
                        <Button className='ViewMore ' onClick={() => handleDownloadAndFetchData(res?.id)}> {isLoading ? <Spin /> : <DownloadOutlined />}</Button>
                    </Tooltip>
                </li>
                <li>
                    <Tooltip title="Share Pdf link">
                        <Button className='ViewMore ' onClick={() => handleFetchAndFetchData(res?.id)}><ShareAltOutlined /></Button>
                    </Tooltip>
                </li>
                <li>
                    <Link href={`/admin/member/${res?.id}/view`}> <Tooltip title="View Details"><Button className='ViewMore'><EyeOutlined /></Button> </Tooltip></Link>
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



    const getData = async (query: string, lastVisibleId?: string) => {
        setLoading1(true)
        try {
            let query = searchTerm ? `searchTerm=${searchTerm}` : '';
            let res = await api.User.listing(query,getUserdata.meetings.NextMeeting.id);
            setState1(res?.data || []);
            if (res?.data?.status == 500||res?.data?.message=="Firebase ID token has expired. Get a fresh ID token from your client app and try again (auth/id-token-expired). See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token.") {
                localStorage.setItem('redirectAfterLogin', window.location.pathname);
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                localStorage.removeItem("hasReloaded")
                // dispatch(clearUserData({}));
                toast.error("Session Expired. Login Again");
                router.replace("/auth/signin");
            }
            let apiRes = await api.User.user_listing(getUserdata.meetings.NextMeeting.id)
            setState2(apiRes?.data)
            setLoading1(false)
            
        } catch (error:any) {
            setLoading1(false)
            if (error?.status==500) {
                localStorage.setItem('redirectAfterLogin', window.location.pathname);
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                localStorage.removeItem("hasReloaded")
                // dispatch(clearUserData({}));
                toast.error("Session Expired. Login Again");
                router.replace("/auth/signin");
            }
        }
    };

    useEffect(() => {
        const query = searchTerm ? `searchTerm=${searchTerm}` : '';
        getData(query);
    }, [searchTerm]);

    const loadMore = () => {
        if (!loading) {
            const query = searchTerm ? `searchTerm=${searchTerm}` : '';
            getData(query);
        }
    };
    return (
        <>

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
                                        <Breadcrumb.Item className='text-decoration-none'>{capFirst(getUserdata?.firstname)} {capFirst(getUserdata?.lastname)}</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                                {/* title  */}
                                <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3'>
                                    <Typography.Title level={3} className='m-0 fw-bold'>{capFirst(getUserdata?.firstname)} {capFirst(getUserdata?.lastname)}</Typography.Title>
                                    {hasClubMemberPermission ?
                                        <div className='d-flex gap-2'>
                                            {/* <Upload className='tooltip-img' showUploadList={false} accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'> */}
                                            <Button type="primary" htmlType="button" size='large' className='primaryBtn' icon={<PlusOutlined />} onClick={addUser}>Add Member</Button>
                                            {/* </Upload> */}
                                        </div> : ""}
                                </div>
                                {/* Search  */}
                                <div className='my-4 '>
                                    <Search size='large' className='' placeholder="Search by Name & Email" enterButton value={searchTerm}
                                        onChange={handleSearch} />
                                </div>
                                {/* Tabs  */}
                                <div className='tabs-wrapper'>
                                    {loading1 ? (
                                       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
                                       <Spin size="large"/>
                                   </div>
                                    ) : (
                                        <>
                                    {getUserdata?.is_admin == false ?
                                        <Table className="tableBox" dataSource={user_completed} columns={user_completed_columns} 
                                        pagination={false}
                                         /> :
                                        <Table className="tableBox" dataSource={dataSource} columns={columns}  pagination={{
                                            position: ['bottomCenter'],
                                        }}/>
                                    }
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


export default UserList;
