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
// import dynamic from "next/dynamic";
import MainLayout from "../../components/Layout/layout";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { parseCookies } from "nookies";
import { toast, ToastContainer } from "react-toastify";
import { pdf } from "@react-pdf/renderer";
import Pdf from "../common/Pdf";
import saveAs from "file-saver";
// const { Row, Col, Avatar, Card, Button, Pagination, Tooltip } = {
//   Button: dynamic(() => import("antd").then((module) => module.Button), {
//     ssr: false,
//   }),
//   Row: dynamic(() => import("antd").then((module) => module.Row), {
//     ssr: false,
//   }),
//   Col: dynamic(() => import("antd").then((module) => module.Col), {
//     ssr: false,
//   }),
//   Card: dynamic(() => import("antd").then((module) => module.Card), {
//     ssr: false,
//   }),
//   Pagination: dynamic(
//     () => import("antd").then((module) => module.Pagination),
//     { ssr: false }
//   ),
//   Tooltip: dynamic(() => import("antd").then((module) => module.Tooltip), {
//     ssr: false,
//   }),
//   Avatar: dynamic(() => import("antd").then((module) => module.Avatar), {
//     ssr: false,
//   }),
// };
const { Search } = Input;
type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode;
};

const MemberList = () => {
  const router = useRouter()
  //   const { userInfo, downloadCSV, Toast, uploadCSV } = React.useContext(GlobalContext)
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
  const [copiedText, setCopiedText] = useState('');

  const [loading, setLoading] = React.useState(false)
  const [exportModal, setExportModal] = React.useState(false);
  const [areas, setAreas] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<any>('');
  const [filteredData, setFilteredData] = useState(state1);
  useEffect(() => {
      // Filter data when searchTerm or state1 changes
      const filtered = state1?.filter((res:any) => {
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
  const getDataById = async (id:any) => {
      const item = {
        user_id: id
      }
      try {
        const res = await api.User.getById(item as any);
        setState(res?.data || null);
      } catch (error: any) {
        alert(error.message);
      }
    };
  const generatePdf = async () => {
      const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
      const blob = await pdf(<Pdf state={state} />).toBlob()
      const file = new File([blob], `Order_${timestamp}.pdf`, { type: 'application/pdf' });
    return { file, blob, timestamp };
    };
  
    // Function to handle PDF download
    const downLoadPdf = async () => {
      const { blob, timestamp } = await generatePdf();
      
      saveAs(blob, `Order_${timestamp}.pdf`);
    };
  
    // Function to handle PDF sharing
    const sharePdf = async () => {
        const { file } = await generatePdf();

        const formData = new FormData();
        formData.append('file', file);
        console.log(formData, 'checkfordata')
        
        try {
            const res = await api.User.create(formData);
            console.log(res?.fileUrl, 'response from api')
           
            await navigator.clipboard.writeText(res?.fileUrl);
            toast.success('PDF copied to clipboard!', {
              position: 'top-center',
              autoClose: 300
            });
          } catch (err) {
            console.error('Failed to copy: ', err);
          }
  
    };
 

    const handleDownloadAndFetchData = (id:any) => {
        getDataById(id);
        downLoadPdf();
  };
    const handleFetchAndFetchData = (id:any) => {
        getDataById(id);
        sharePdf();
  };
  const dataSource = filteredData?.map((res: any, index: number) => {
      return {
          key: index + 1,
          name: res?.firstname ? `${res?.firstname} ${res?.lastname}` : "N/A",
          company: res?.company_name,
          email: res?.email,
          phone: res?.phone_number,
          position: res?.position,
          city: res?.home_city,
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
      {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
      },
  ];


  
 

 
  const addUser = () => {
      router.push("/admin/member/add")
  }

  const cookies = parseCookies();
  const accessToken = cookies.COOKIES_USER_ACCESS_TOKEN;

  const getData = async (query: string) => {
      try {
          let res = await api.User.listing(query);
          setState1(res?.data || []);
      } catch (error) {
          console.error(error);
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
                                <Breadcrumb.Item><Link className='text-decoration-none' href="/">General</Link></Breadcrumb.Item>
                                <Breadcrumb.Item className='text-decoration-none'>Club Members</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        {/* title  */}
                        <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3'>
                            <Typography.Title level={3} className='m-0 fw-bold'>Club Members</Typography.Title>
                            <div className='d-flex gap-2'>
                                {/* <Upload className='tooltip-img' showUploadList={false} accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'> */}
                                <Button type="primary" htmlType="button" size='large' className='primaryBtn' icon={<PlusOutlined />} onClick={addUser}>Add New Club Member</Button>
                                {/* </Upload> */}
                            </div>
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
                            <Table dataSource={dataSource} columns={columns} pagination={false} />
                        </div>
                        {/* Pagination  */}
                        <Row justify={'center'} className="mt-5" style={{ paddingLeft: "650px" }}>
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
  );
};

// Page.getLayout = (Page: ReactNode) => <MainLayout>{Page}</MainLayout>;

export default MemberList;
