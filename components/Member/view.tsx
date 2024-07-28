"use client";
import dynamic from "next/dynamic";
import Link from "next/link";

import { Breadcrumb, Spin, Tooltip, Typography } from "antd";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "../../components/Layout/layout";
import api from "@/utils/api";
import axios from "axios";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { toast, ToastContainer } from "react-toastify";
import Pdf from "../common/Pdf";
import { DownloadOutlined, ShareAltOutlined } from "@ant-design/icons";
import { parseCookies } from "nookies";
import { useSelector } from "react-redux";
import validation from "@/utils/validation";
const { Row, Col, Card, Button, Space, Popconfirm } = {
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
  Space: dynamic(() => import("antd").then((module) => module.Space), {
    ssr: false,
  }),
  Popconfirm: dynamic(
    () => import("antd").then((module) => module.Popconfirm),
    { ssr: false }
  ),
};

const MeetingView = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const getUserdata=useSelector((state:any)=>state?.user?.userData)
  
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
  const searchParam = useParams();
  const cookies = parseCookies();
  const accessToken = cookies.COOKIES_USER_ACCESS_TOKEN;
  const id: any = searchParam.id;
  const getDataById = async () => {
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


  const activeDeactive = async (id: any) => {
    const item = {
      user_id: id,
      activatedeactivate: state?.is_activate ? false : true
    }
    try {
      let res = await api.User.deactivate(item as any)
      getDataById()
    } catch (error) {

    }
  }
  const archive = async (id: any) => {
    const item = {
      user_id: id,
      archive: state?.is_archive ? false : true
    }
    try {
      let res = await api.User.deactivate(item as any)
      router.back()
    } catch (error) {

    }
  }

  const onFinish = async () => {
    let items = {
      to: state?.email,
      link: `http://localhost:3000/auth/update_password?${state.email}`
      
    };
    try {
      setLoading(true)
      let res = await axios.post("https://frontend.goaideme.com/reset-password", 
        items, // items is the body of the request
        {
          headers: {
            Token: `${accessToken}`,
            // 'Content-Type': 'application/json', // Uncomment if needed, axios sets this automatically for JSON
          }
        }
      );
      getDataById()
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getDataById();
    // }
  }, []);
  const generatePdf = async () => {
    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
    const blob = await pdf(<Pdf state={state} />).toBlob();
    const pdfUrl = URL.createObjectURL(blob);
    return { blob, pdfUrl, timestamp };
};

// Function to handle PDF download
const downLoadPdf = async () => {
    const { blob, timestamp } = await generatePdf();
    saveAs(blob, `Detail_${timestamp}.pdf`);
};

// Function to handle PDF sharing
const sharePdf = async () => {

    const { pdfUrl, timestamp } = await generatePdf();
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

    const apiRes:any = await res.json()
      navigator.clipboard.writeText(apiRes?.fileUrl)
                .then(() => {
                    toast.success('Link copied to clipboard');
                })
                .catch(() => {
                    toast.error('Failed to copy link to clipboard');
                });
};



  return (
    <MainLayout>
    <Fragment>
      <section>
      
        <Spin spinning={loading}>
          <Row gutter={[20, 20]}>
            <Col sm={22} md={12} lg={11} xl={10} xxl={9} className='mx-auto'>
              <Card className='common-card'>
                <div className='mb-4'>
                  <Breadcrumb separator=">">
                    <Breadcrumb.Item><Link href="/admin/dashboard" className='text-decoration-none'>Home</Link></Breadcrumb.Item>
                    {getUserdata?.is_admin==true &&
                    <Breadcrumb.Item><Link href="/admin/member" className='text-decoration-none'>Club Member</Link></Breadcrumb.Item>}
                    <Breadcrumb.Item className='text-decoration-none'>{getUserdata?.firstname ? `${getUserdata?.firstname} ${getUserdata?.lastname}`:""} Details</Breadcrumb.Item>
                  </Breadcrumb>
                </div>
                {/* Title  */}
                <div className='d-flex justify-content-between'>
                  <div className="">

                    <Typography.Title level={3} className='m-0 fw-bold'>{getUserdata?.firstname ? `${getUserdata?.firstname} ${getUserdata?.lastname}`:""} Details</Typography.Title>
                  </div>
                  <div className=" ">
                    <Tooltip title="Download Pdf">
                      <Button className='ViewMore ' onClick={downLoadPdf}><DownloadOutlined /></Button>
                    </Tooltip>
                    
                    <Tooltip title="Share Pdf link">
                      <Button className='ViewMore ' onClick={sharePdf}><ShareAltOutlined /></Button>
                    </Tooltip>
                    
                  </div>
                </div>
                {/* Car Listing  */}
                <div className='card-listing'>

                  <ul className='list-unstyled my-4 mb-4'>
                    <li className='mb-3'><Typography.Text >Name:</Typography.Text > <Typography.Text className='ms-1 text-capitalize'>{state?.firstname ? `${validation.capitalizeFirstLetter(state?.firstname)} ${validation.capitalizeFirstLetter(state?.lastname)}` : 'N/A'}</Typography.Text ></li>
                    <li className='mb-3'><Typography.Text >Company Name:</Typography.Text > <Typography.Text className='ms-1'>{validation.capitalizeFirstLetter(state?.company_name) || "N/A"}</Typography.Text ></li>
                    <li className='mb-3'><Typography.Text >Email:</Typography.Text > <Typography.Text className='ms-1'>{state?.email || "N/A"}</Typography.Text ></li>
                    <li className='mb-3'><Typography.Text >Phone no:</Typography.Text > <Typography.Text className='ms-10'>
                      {state?.phone_number || "N/A"}
                    </Typography.Text ></li>
                    <li className='mb-3'><Typography.Text >Position:</Typography.Text > <Typography.Text className='ms-1'>{validation.capitalizeFirstLetter(state?.position) || "N/A"}</Typography.Text ></li>
                    <li className='mb-3'><Typography.Text >Home City:</Typography.Text > <Typography.Text className='ms-1'>{validation.capitalizeFirstLetter(state?.home_city) || "N/A"}</Typography.Text ></li>
                   
                  </ul>
                  {/* Button  */}
                  <div className='card-listing-button d-inline-flex flex-wrap gap-3 w-100'>
                    {getUserdata?.is_admin==true?
                    <Link href={`/admin/member/add?${state?.uid}&edit`} className='text-decoration-none text-white flex-grow-1'>
                      <Button size='large' type="primary" htmlType='button' className='w-100 primaryBtn'>
                        Edit
                      </Button>
                    </Link>:
                    <Link href={`/admin/member/add/page2?${state?.uid}&edit`} className='text-decoration-none text-white flex-grow-1'>
                    <Button size='large' type="primary" htmlType='button' className='w-100 primaryBtn'>
                      Edit
                    </Button>
                  </Link>
                    }
                    {!getUserdata?.is_admin==false?
                    <Popconfirm
                      title={`${state?.is_activate ? 'Activate' : 'Deactivate'} the club member`}
                      // onConfirm={activeDeactive(id)}
                      onConfirm={(e: any) => activeDeactive(id)}
                      description={`Are you sure to ${state?.is_activate ? 'Activate' : 'Deactivate'} this club member?`}
                      okText={state?.is_activate ? 'Activate' : 'Deactivate'}
                      cancelText="No"
                      okButtonProps={{ type: 'primary', danger: true }}
                    >
                      <Button size='large' type="primary" htmlType='button' className='flex-grow-1 activateBtn' ghost>   {state?.is_activate ? 'Deactivate' : 'Activate'}</Button>
                    </Popconfirm>: <Button size='large' type="primary" htmlType='button' className='flex-grow-1  activateBtn' loading={loading} onClick={onFinish}>Reset Password</Button>}
                   
                    {getUserdata?.is_admin==true?
                    <Button size='large' type="primary" htmlType='button' className='flex-grow-1 w-100 primaryBtn' loading={loading} onClick={onFinish}>Reset Password</Button>:""}
                    {/* </Popconfirm> */}
                    {!getUserdata?.is_admin==false?
                    <Popconfirm
                      title="Archive the club member"
                      onConfirm={(e: any) => archive(id)}
                      description="Are you sure to archive this club member?"
                      okText="Archive it!"
                      cancelText="No"
                      okButtonProps={{ type: 'primary', danger: true }}
                    >
                      <Button size='large' type="primary" htmlType='button' className='flex-grow-1 w-100 archiveBtn' danger>Archive</Button>
                    </Popconfirm>:""}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Spin>
      </section>
    </Fragment>
  </MainLayout>
  );
};
export default MeetingView;
