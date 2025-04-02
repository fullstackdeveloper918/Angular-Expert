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
import { toast } from "react-toastify";
import Pdf from "../common/Pdf";
import { DownloadOutlined, ShareAltOutlined } from "@ant-design/icons";
import { destroyCookie, parseCookies } from "nookies";
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
  const [loadingState, setLoadingState] = useState<any>(false);
  const searchParam = useParams();
  const cookies = parseCookies();
  const accessToken = cookies.COOKIES_USER_ACCESS_TOKEN;
  const id: any = searchParam.id;
  const getDataById = async () => {
    const item = {
      user_id: id,
      meeting_id:getUserdata.meetings.NextMeeting.id
    }
    try {
      const res = await api.User.getById(item as any);
      setState(res?.data || null);
    } catch (error: any) {
      if (error==500) {
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
        toast.error("Session Expired. Login Again");
        router.replace("/auth/signin");
    }
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
      link: `https://nahbcraftsmen.com/auth/update_password?${state.email}`
      // link: `https://nabh-app--nabh-41663.us-central1.hosted.app/auth/update_password?${state.email}`
      // link: `https://angular-expert-mu.vercel.app/auth/update_password?${state.email}`
      
    };
    try {
      setLoading(true)
      let res:any = await axios.post("https://frontend.goaideme.com/reset-password", 
      // let res = await axios.post("https://app-uilsndszlq-uc.a.run.app/reset-password", 
        items, // items is the body of the request
        {
          headers: {
            Token: `${accessToken}`,
            // 'Content-Type': 'application/json', // Uncomment if needed, axios sets this automatically for JSON
          }
        }
      );
      
      
      getDataById()
      toast.success(res?.data?.message)
    } catch (error:any) {
      if (error.status==500) {
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
        toast.error("Session Expired. Login Again");
        router.replace("/auth/signin");
    }
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
  try {
    setLoadingState(true)
      const { blob, timestamp } = await generatePdf();
      saveAs(blob, `Detail_${timestamp}.pdf`); 
  } catch (error) {
      alert('Failed to generate or save the PDF. Please try again.'); 
  }
  finally{
    setLoadingState(false)
  }
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
    // const res = await fetch('https://app-uilsndszlq-uc.a.run.app/save-pdf', {

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


const companyName = companyNameMap[state?.company_name || state?.master_user_detail?.company_name] || "N/A";

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
  return (
      <section className="antShadow">
      
        <Spin spinning={loading}>
          <Row gutter={[20, 20]}>
            <Col xs={24} sm={24} md={12} lg={11} xl={10} xxl={9} className='mx-auto'>
              <Card className='common-card'>
                <div className='mb-1'>
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
                      <Button className='ViewMore ' onClick={downLoadPdf}>{loadingState ? <Spin /> : <DownloadOutlined />}</Button>
                    </Tooltip>
                    
                    <Tooltip title="Share Pdf link">
                      <Button className='ViewMore ' onClick={sharePdf}><ShareAltOutlined /></Button>
                    </Tooltip>
                    
                  </div>
                </div>
                {/* Car Listing  */}
                <div className='card-listing'>

                  <ul className='list-unstyled my-4 mb-4'>
                    <li className='mb-2'><Typography.Text >Name:</Typography.Text > <Typography.Text className='ms-1 text-capitalize'>{state?.firstname ? `${validation.capitalizeFirstLetter(state?.firstname)} ${validation.capitalizeFirstLetter(state?.lastname)}` : 'N/A'}</Typography.Text ></li>
                    <li className='mb-2'><Typography.Text >Company Name:</Typography.Text > <Typography.Text className='ms-1'>{companyName || "N/A"}</Typography.Text ></li>
                    <li className='mb-2'><Typography.Text >Email:</Typography.Text > <Typography.Text className='ms-1'>{state?.email || "N/A"}</Typography.Text ></li>
                   {getUserdata?.parent_user_id?"":
                    <li className='mb-2'><Typography.Text >Phone no:</Typography.Text > <Typography.Text className='ms-10'>
                      {(state?.phone_number) || "N/A"}
                    </Typography.Text ></li>}
                    {getUserdata?.parent_user_id?"":
                    <li className='mb-2'><Typography.Text >Position:</Typography.Text > <Typography.Text className='ms-1'>{validation.capitalizeFirstLetter(state?.position) || "N/A"}</Typography.Text ></li>}
                    <li className='mb-2'><Typography.Text >Home City:</Typography.Text > <Typography.Text className='ms-1'>{validation.capitalizeFirstLetter(state?.home_city|| getUserdata?.master_user_detail?.home_city) || "N/A"}</Typography.Text ></li>
                   
                  </ul>
                  {/* Button  */}
                  {getUserdata?.parent_user_id?"":
                  <div className='card-listing-button d-inline-flex flex-wrap gap-3 w-100 cardButtons'>
                    {getUserdata?.is_admin==true?
                    <Link href={`/admin/member/add?${state?.uid}&edit`} className='text-decoration-none text-white flex-grow-1'>
                      <Button size='large' type="primary" htmlType='button' className='w-100 primaryBtn'>
                        Edit
                      </Button>
                    </Link>:
                    <Link href={`/admin/member/add?${state?.uid}&edit`} className='text-decoration-none text-white flex-grow-1'>
                    <Button size='large' type="primary" htmlType='button' className='w-100 primaryBtn'>
                      Edit
                    </Button>
                  </Link>
                    }
                    {!getUserdata?.is_admin==false?
                    <Popconfirm
                      title={`${state?.is_activate ? 'Deactivate' : 'Activate'} the club member`}
                      // onConfirm={activeDeactive(id)}
                      onConfirm={(e: any) => activeDeactive(id)}
                      description={`Are you sure to ${state?.is_activate ? 'Deactivate' : 'Activate'} this club member?`}
                      okText={state?.is_activate ? 'Deactivate' : 'Activate'}
                      cancelText="No"
                      okButtonProps={{ type: 'primary', danger: true }}
                    >
                      <Button size='large' type="primary" htmlType='button' className='flex-grow-1 activateBtn' ghost>   {state?.is_activate ? 'Activate' : 'Deactivate'}</Button>
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
                  </div>}
                </div>
              </Card>
            </Col>
          </Row>
        </Spin>
      </section>
  );
};
export default MeetingView;
