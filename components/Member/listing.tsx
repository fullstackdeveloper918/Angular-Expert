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
} from "antd";
import Link from "next/link";
import { DownloadOutlined, EyeOutlined, PlusOutlined, ShareAltOutlined } from "@ant-design/icons";
import MainLayout from "../../components/Layout/layout";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { parseCookies } from "nookies";
import { toast, ToastContainer } from "react-toastify";
import { pdf } from "@react-pdf/renderer";
import Pdf from "../common/Pdf";
import saveAs from "file-saver";
import { useSelector } from "react-redux";
import validation from "../../utils/validation";

const { Search } = Input;
type Page<P = {}> = NextPage<P> & {
    getLayout?: (page: ReactNode) => ReactNode;
};

const MemberList = () => {
    const router = useRouter()
    //   const { userInfo, downloadCSV, Toast, uploadCSV } = React.useContext(GlobalContext)
    const getUserdata = useSelector((state: any) => state?.user?.userData)
    const hasClubMemberPermission = (getUserdata?.permission?.length && getUserdata.permission.includes("CLUB_MEMEBR")) || getUserdata?.email === "nahbcraftsmen@gmail.com";
    const [show, setShow] = useState(true);
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
        debugger
        const item = {
            user_id: id
        }
        try {
            const res = await api.User.getById(item as any);
            setState(res?.data || null);
            return res.data
        } catch (error: any) {
            alert(error.message);
        }
    };
    const generatePdf = async (data?:any) => {
        debugger
        const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
        const blob = await pdf(<Pdf state={data} />).toBlob();
        const pdfUrl = URL.createObjectURL(blob);
        return { blob, pdfUrl, timestamp };
    };

    // Function to handle PDF download
    const downLoadPdf = async (res:any) => {
        const { blob, timestamp } = await generatePdf(res);
        saveAs(blob, `Detail_${timestamp}.pdf`);
    };

    // Function to handle PDF sharing
    const sharePdf = async (item:any) => {
        debugger

        const { pdfUrl, timestamp } = await generatePdf(item);
        const response = await fetch(pdfUrl);
        const blob = await response.blob();

        // Convert the blob to a file
        const file = new File([blob], `Detail_${timestamp}.pdf`, { type: 'application/pdf' });
        const formData = new FormData();
        formData.append('file', file);


        const res = await fetch('https://frontend.goaideme.com/save-pdf', {

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
       let res = await getDataById(id);
        await downLoadPdf(res);
    };
    const handleFetchAndFetchData = async(id: any) => {
        debugger
      let item= await  getDataById(id);
       await sharePdf(item);
    };
    // const completed2 = state2?.filter((res:any) => res?.is_completed === true);
    const user_completed = state2?.slice(0, 5).map((res: any, index: number) => {
        return {
            key: index + 1,
            name: res?.firstname ? `${res?.firstname} ${res?.lastname}` : "N/A",
            company: validation?.replaceUnderScore(res?.company_name),
            email: res?.email,
            status: res?.is_completed == true ? "Completed" : "Pending",
            action: <ul className='m-0 list-unstyled d-flex gap-2'>
                <li>
                    <Tooltip title="Download Pdf">
                        <Button className='ViewMore ' onClick={() => handleDownloadAndFetchData(res?.uid)}><DownloadOutlined /></Button>
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
            title: 'Sr.No',
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
        return {
            key: index + 1,
            name: res?.firstname ? `${validation?.capitalizeFirstLetter(res?.firstname)} ${validation?.capitalizeFirstLetter(res?.lastname)}` : "N/A",
            company: validation?.replaceUnderScore(validation?.capitalizeFirstLetter(res?.company_name)),
            email: res?.email,
            phone: res?.phone_number,
            position: validation?.capitalizeFirstLetter(res?.position),
            city: validation?.capitalizeFirstLetter(res?.home_city),
            action: <ul className='m-0 list-unstyled d-flex gap-2'>
                <li>
                    <Tooltip title="Download Pdf">
                        <Button className='ViewMore ' onClick={() => handleDownloadAndFetchData(res?.id)}><DownloadOutlined /></Button>
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
            title: 'Sr.No',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Club Name',
            dataIndex: 'company',
            key: 'company',
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
        {
            title: 'Home City',
            dataIndex: 'city',
            key: 'city',
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



    const getData = async (query: string) => {
        try {
            let res = await api.User.listing(query);
            setState1(res?.data || []);
            let apiRes = await api.User.user_listing()
            setState2(apiRes?.data)
            if (res?.status == 400) {
                toast.error("Session Expired Login Again")
                router.replace("/auth/signin")
            }
        } catch (error) {
        }
    };

    useEffect(() => {
        const query = searchTerm ? `searchTerm=${searchTerm}` : '';
        getData(query);
    }, [searchTerm]);


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
                                        <Breadcrumb.Item className='text-decoration-none'>Club Members</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                                {/* title  */}
                                <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3'>
                                    <Typography.Title level={3} className='m-0 fw-bold'>Club Members</Typography.Title>
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
                                    {getUserdata?.is_admin == false ?
                                        <Table className="tableBox" dataSource={user_completed} columns={user_completed_columns} pagination={false} /> :
                                        <Table className="tableBox" dataSource={dataSource} columns={columns} pagination={false} />
                                    }
                                </div>
                                {/* Pagination  */}
                                {/* <Row justify={'center'} className="mt-5">
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

// Page.getLayout = (Page: ReactNode) => <MainLayout>{Page}</MainLayout>;

export default MemberList;
