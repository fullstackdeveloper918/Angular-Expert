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
// import Pdf from "@/app/common/Pdf";
import { toast, ToastContainer } from "react-toastify";
import Pdf from "../common/Pdf";
import { DownloadOutlined, ShareAltOutlined } from "@ant-design/icons";
import { parseCookies } from "nookies";
import { useSelector } from "react-redux";
import validation from "@/utils/validation";
import dayjs from "dayjs";
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
interface StaffDetailInterface {
  is_blocked: boolean;
  email?: string;
  firstname?: string;
  lastname?: string;
  profile_pic?: any;
  roles?: Array<any>;
  country_code?: number;
  mobile?: number;
  _id: string;
}
const MeetingViewPage = () => {
  const [loading, setLoading] = useState(false)
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

  
  const [isActive, setIsActive] = useState(false);
  const searchParam = useParams();
  const cookies = parseCookies();
  const accessToken = cookies.COOKIES_USER_ACCESS_TOKEN;
  const id: any = searchParam.id;
  const getDataById = async () => {
    const item = {
      meeting_id: id
    }
    try {
      const res = await api.Meeting.getById(item as any);
      const data = res?.data || {};
      if (data.start_meeting_date) {
        data.start_meeting_date = dayjs(data.start_meeting_date);
      }
      if (data.start_time) {
        data.start_time = dayjs(data.start_time);
      }
      if (data.end_meeting_date) {
        data.end_meeting_date = dayjs(data.end_meeting_date);
      }
      if (data.end_time) {
        data.end_time = dayjs(data.end_time);
      }
      // if (data.year) {
      //   data.year = dayjs(data.year);
      // }

      setState(data);
    //   form.setFieldsValue(data);
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    // if (id) {
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
    saveAs(blob, `Order_${timestamp}.pdf`);
};

// Function to handle PDF sharing
const sharePdf = async () => {

    const { pdfUrl, timestamp } = await generatePdf();
    console.log(pdfUrl, 'pdfUrl')
    const response = await fetch(pdfUrl);
    const blob = await response.blob();
    console.log(blob, 'blob')

    // Convert the blob to a file
    const file = new File([blob], `Order_${timestamp}.pdf`, { type: 'application/pdf' });
    console.log(file, 'file pdf');
    const formData = new FormData();
    formData.append('file', file);

    console.log(formData, "formData");

    const res = await fetch('https://frontend.goaideme.com/save-pdf', {

        method: 'POST',
        body: formData,
        headers: {
            Token: `${accessToken}`,
            // 'Content-Type': 'application/json',
        }
    },);

    const apiRes:any = await res.json()
    console.log(apiRes,"apiRes");
      navigator.clipboard.writeText(apiRes?.fileUrl)
                .then(() => {
                    toast.success('Link copied to clipboard');
                })
                .catch(() => {
                    toast.error('Failed to copy link to clipboard');
                });

    //   })
    //   toast.success('Link Share Successfully', {
    //     position: 'top-center',
    //     autoClose: 300,

    //   });

    // Optionally, open the PDF in a new tab
    // window.open(pdfUrl, '_blank');
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
                    <Breadcrumb.Item><Link href="/admin/meetings" className='text-decoration-none'>Meeting</Link></Breadcrumb.Item>}
                    <Breadcrumb.Item className='text-decoration-none'>Meeting Details</Breadcrumb.Item>
                  </Breadcrumb>
                </div>
                {/* Title  */}
                <div className='d-flex justify-content-between'>
                  <div className="">

                    <Typography.Title level={3} className='m-0 fw-bold'>Meeting Details</Typography.Title>
                  </div>
                  <div className=" ">
                    {/* <Tooltip title="Download Pdf">
                      <Button className='ViewMore ' onClick={downLoadPdf}><DownloadOutlined /></Button>
                    </Tooltip> */}
                 
                    {/* <Tooltip title="Share Pdf link">
                      <Button className='ViewMore ' onClick={sharePdf}><ShareAltOutlined /></Button>
                    </Tooltip> */}
                    
                  </div>
                </div>
                {/* Car Listing  */}
                <div className='card-listing'>

                  <ul className='list-unstyled my-4 mb-4'>
                    <li className='mb-3'><Typography.Text >Meeting Type:</Typography.Text > <Typography.Text className='ms-1 text-capitalize'>{`${validation.capitalizeFirstLetter(state?.meeting_type)}` || 'N/A'} {dayjs(state?.start_meeting_date).format("YYYY")  || "N/A"}</Typography.Text ></li>
                    <li className='mb-3'><Typography.Text >Location:</Typography.Text > <Typography.Text className='ms-1'>{validation.capitalizeFirstLetter(state?.location) || "N/A"}</Typography.Text ></li>
                    <li className='mb-3'><Typography.Text >Meeting Dates:</Typography.Text > <Typography.Text className='ms-1'>{dayjs(state?.start_meeting_date).format("DD-MM-YYYY")  || "N/A"} to {dayjs(state?.end_meeting_date).format("DD-MM-YYYY")  || "N/A"} </Typography.Text ></li>
                    <li className='mb-3'><Typography.Text >Hotel:</Typography.Text > <Typography.Text className='ms-1'>{state?.hotel || "N/A"}</Typography.Text ></li>
                    <li className='mb-3'><Typography.Text >Nearest Airport:</Typography.Text > <Typography.Text className='ms-1'>{state?.airport || "N/A"}</Typography.Text ></li>
                    <li className='mb-3'><Typography.Text >Host Company:</Typography.Text > <Typography.Text className='ms-1'>{state?.host_company || "N/A"}</Typography.Text ></li>
                    <li className='mb-3'><Typography.Text >Host:</Typography.Text > <Typography.Text className='ms-1'>{state?.host || "N/A"}</Typography.Text ></li>
                    <li className='mb-3'><Typography.Text >Cell:</Typography.Text > <Typography.Text className='ms-1'>{state?.cell || "N/A"}</Typography.Text ></li>
                    <li className='mb-3'><Typography.Text >Weather:</Typography.Text > <Typography.Text className='ms-1'>{state?.weather || "N/A"}</Typography.Text ></li>

                    {state?.meeting_type=="spring"&&
                    <li className='mb-3'><Typography.Text >Note:</Typography.Text > <Typography.Text className='ms-1'>{state?.notes || "N/A"}</Typography.Text ></li>}
                  </ul>
                  {/* Button  */}
                  {getUserdata?.is_admin==true&&
                  <div className='card-listing-button d-inline-flex flex-wrap gap-3 w-100'>
                    <Link href={`/admin/meetings/${state?.id}/edit`} className='text-decoration-none text-white flex-grow-1'>
                      <Button size='large' type="primary" htmlType='button' className='w-100 primaryBtn'>
                        Edit
                      </Button>
                    </Link>
                  </div>}
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
export default MeetingViewPage;
