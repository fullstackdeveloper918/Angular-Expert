"use client";
import {
  Breadcrumb,
  Form,
  Select,
  Input,
  Upload,
  Modal,
  message,
  Typography,
  SelectProps,
  Button,
  Card,
  Col,
  Row,
} from "antd";
import dynamic from "next/dynamic";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import validation from "@/utils/validation";
import MainLayout from "../../components/Layout/layout";

import EmployeeRoles from "@/utils/EmployeeRoles.json";
import TextArea from "antd/es/input/TextArea";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { destroyCookie, setCookie } from "nookies";
import henceforthApi from "@/utils/api";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";
import nookies from 'nookies';
// const { Row, Col, Card, Button } = {
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
// };
const Page1 = () => {
  const router = useRouter()
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const [state, setState] = useState<any>("")
  const searchParams = useSearchParams();
  const entries = Array.from(searchParams.entries());
  const getUserdata=useSelector((state:any)=>state?.user?.userData)
  const value = entries.length > 0 ? entries[0][0] : '';
  const type = entries.length > 1 ? entries[1][0] : '';
  const setCookie = (name:any, value:any, days:any) => {
    nookies.set(null, name, value, {
      maxAge: days * 24 * 60 * 60,
      path: '/',
    });
  };
  const onFinish = async (values: any) => {
      let items = {
         bussiness_update:{
          userId:value,
          financial_position:values?.financial_position,
          sales_position:values?.sales_position,
          accomplishments:values?.accomplishments,
          hr_position:values?.hr_position,
          current_challenges:values?.current_challenges,
          craftsmen_support:values?.craftsmen_support,
         }
      } as any
      
   
      try {
          if (type == "edit") {
              let items = {
                  bussiness_update: {
                  userId:value,
                  financial_position:values?.financial_position,
                  sales_position:values?.sales_position,
                  accomplishments:values?.accomplishments,
                  hr_position:values?.hr_position,
                  current_challenges:values?.current_challenges,
                  craftsmen_support:values?.craftsmen_support,
              }
          } as any
          setLoading(true)
          let res = await api.User.edit(items)
              router.push(`/admin/member/add/page3?${value}&edit`)
          }else{

              setLoading(true)
              let res =await api.Auth.signUp(items)
              if (res?.status == 400) {
                toast.error("Session Expired Login Again")
                router.replace("/auth/signin")
              }
              router.push(`/admin/member/add/page3?${res?.user_id}`)
          }

         
      } catch (error: any) {
       
          setLoading(false)
      } finally {
      }
  };
  const getDataById = async () => {
      const item = {
        user_id: value
      }
      try {
        const res = await api.User.getById(item as any);
        setState(res?.data || null);
        if (res?.data?.status == 400) {
            toast.error("Session Expired Login Again")
            router.replace("/auth/signin")
          }
        form.setFieldsValue(res?.data)
      } catch (error: any) {
        // const handleError = (error:any) =>{
            if(error == 400){
                // const refreshToken = async () => {
                    onAuthStateChanged(auth, async (user) => {
                      if (user) {
                        try {
                          const idToken = await user.getIdToken();
                          console.log("ID Token:", idToken);
                          // setToken(idToken);
                          henceforthApi.setToken(idToken)
                          setCookie("COOKIES_USER_ACCESS_TOKEN", idToken, 30); // 30 days
                        } catch (error) {
                          console.error("Error getting ID token:", error);
                        }
                      }
                    });
                //   };
            // }
        }
        // if (error) {
        //     destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
  
        //     // }
        //     toast.error("Session Expired Login Again")
        //     router.replace("/auth/signin")
        // }
      }
    };
  
    useEffect(() => {
        if (type =="edit") {

         getDataById();
        }
     
    }, [type]);
    const onFinish1 = async (values: any) => {
        
        let items = {
           bussiness_update:{
            userId:value,
            financial_position:values?.financial_position,
            sales_position:values?.sales_position,
            accomplishments:values?.accomplishments,
            hr_position:values?.hr_position,
            current_challenges:values?.current_challenges,
            craftsmen_support:values?.craftsmen_support,
           }
        } as any
        
    
     
        try {
            if (type == "edit") {
                let items = {
                    bussiness_update: {
                    userId:value,
                    financial_position:values?.financial_position,
                    sales_position:values?.sales_position,
                    accomplishments:values?.accomplishments,
                    hr_position:values?.hr_position,
                    current_challenges:values?.current_challenges,
                    craftsmen_support:values?.craftsmen_support,
                }
            } as any
            setLoading(true)
            let res = await api.User.edit(items)
                // router.push(`/admin/member/add/page3?${value}&edit`)
            }else{
  
                setLoading(true)
                let res =await api.Auth.signUp(items)
                toast.success("Added Successfully")
                if (res?.status == 400) {
                  toast.error("Session Expired Login Again")
                  router.replace("/auth/signin")
                }
                // router.push(`/admin/member/add/page3?${res?.user_id}`)
            }
  
           
        } catch (error: any) {
            
        } finally {
            setLoading(false)
        }
    };
  const onPrevious=()=>{
      router.replace(`/admin/member/add?${value}&edit`)
    }
  return (
    <MainLayout>
            <Fragment>

                <section>
                    <Row justify="center" gutter={[20, 20]}>
                        <Col sm={22} md={24} lg={16} xl={16} xxl={12}>
                            <Card className='common-card'>
                              
                                <div className='mb-2 d-flex justify-content-between'>
                                    <Typography.Title level={3} className='m-0 fw-bold'>BUSINESS UPDATE</Typography.Title>
                                    <Button size={'large'} type="primary" className="text-white" disabled>1/7</Button>
                                </div>

                                {/* form  */}
                                <div className='card-form-wrapper'>
                                    <Form form={form} name="add_staff" className="add-staff-form" scrollToFirstError layout='vertical' onFinish={onFinish}>



                                        {/* First Name  */}
                                        <Form.Item name="financial_position" rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]} label="Describe your current financial position:">
                                            <TextArea size={'large'} placeholder="Enter..."
                                                // onKeyPress={(e: any) => {
                                                //     if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                //         e.preventDefault();
                                                //     } else {
                                                //         e.target.value = String(e.target.value).trim()
                                                //     }
                                                // }}
                                            />
                                        </Form.Item>
                                        {/* Last Name  */}
                                        <Form.Item name="sales_position" rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]} label="Describe your current sales positions, hot prospects, recently contracted work:">
                                            <TextArea size={'large'} placeholder="Enter..."
                                                // onKeyPress={(e: any) => {
                                                //     if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                //         e.preventDefault();
                                                //     } else {
                                                //         e.target.value = String(e.target.value).trim()
                                                //     }
                                                // }}
                                            />
                                        </Form.Item>
                                        <Form.Item name="accomplishments" rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]} label="Describe your accomplishments in the last 6 months:">
                                            <TextArea size={'large'} placeholder="Enter..."
                                                // onKeyPress={(e: any) => {
                                                //     if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                //         e.preventDefault();
                                                //     } else {
                                                //         e.target.value = String(e.target.value).trim()
                                                //     }
                                                // }}
                                            />
                                        </Form.Item>
                                        <Form.Item name="hr_position" rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]} label="Describe your HR position &/or needs:">
                                            <TextArea size={'large'} placeholder="Enter..."
                                                // onKeyPress={(e: any) => {
                                                //     if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                //         e.preventDefault();
                                                //     } else {
                                                //         e.target.value = String(e.target.value).trim()
                                                //     }
                                                // }}
                                            />
                                        </Form.Item>
                                        <Form.Item name="current_challenges" rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]} label="Describe any current challenges your business is facing (i.e. problem client, personnel
issue(s), trade availability, rising costs, supply chain, etc.):">
                                            <TextArea size={'large'} placeholder="Enter..."
                                                // onKeyPress={(e: any) => {
                                                //     if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                //         e.preventDefault();
                                                //     } else {
                                                //         e.target.value = String(e.target.value).trim()
                                                //     }
                                                // }}
                                            />
                                        </Form.Item>


                                        <Form.Item name="craftsmen_support" rules={[{ required: true, message: 'Please Fill Field' }]} label="How can the Craftsmen aid or support you with these challenges?">
                                            <TextArea size={'large'} placeholder="Enter..."
                                                // onKeyPress={(e: any) => {
                                                //     if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                //         e.preventDefault();
                                                //     } else {
                                                //         e.target.value = String(e.target.value).trim()
                                                //     }
                                                // }}
                                            />
                                        </Form.Item>

                                        {/* Button  */}
                                        {getUserdata?.is_admin==true?
                                        <div className="d-flex">
                                            <div className="col-2">

                                        <Button size={'large'} type="primary" className=" " onClick={onFinish1}>
                                            Save
                                        </Button>
                                            </div>
                                        <div className=" col-8 d-flex gap-5 justify-content-center">
                                        <Button size={'large'} type="primary" className=" " onClick={onPrevious}>
                                            Previous
                                        </Button>
                                        <Button size={'large'} type="primary" htmlType="submit" className="login-form-button " loading={loading}>
                                        Next
                                        </Button>
                                        </div>
                                        </div>:<div className="d-flex">
                                            <div className="col-2">

                                            </div>
                                        <div className=" col-8 d-flex gap-5 justify-content-center">
                                        <Button size={'large'} type="primary" className=" " onClick={onFinish1}>
                                            Save
                                        </Button>
                                        <Button size={'large'} type="primary" htmlType="submit" className="login-form-button " loading={loading}>
                                        Next
                                        </Button>
                                        </div>
                                        </div>}
                                    </Form>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                </section>
            </Fragment >
        </MainLayout>
  );
};

export default Page1;
