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

  const value = entries.length > 0 ? entries[0][0] : '';
  const type = entries.length > 1 ? entries[1][0] : '';
  console.log(type,"value");
  
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
              router.push(`/admin/member/add/page3?${res?.user_id}`)
          }

         
      } catch (error: any) {
          
      } finally {
          setLoading(false)
      }
  };
  const getDataById = async () => {
      const item = {
        user_id: value
      }
      try {
        const res = await api.User.getById(item as any);
        setState(res?.data || null);
        form.setFieldsValue(res?.data)
      } catch (error: any) {
        alert(error.message);
      }
    };
    useEffect(() => {
        if (type =="edit") {

         getDataById();
        }
     
    }, [type]);
  
  const onPrevious=()=>{
      router.replace(`/admin/member/add?${value}&edit`)
    }
  return (
    <MainLayout>
            <Fragment>

                <section>
                    <Row justify="center" gutter={[20, 20]}>
                        <Col sm={22} md={24} lg={11} xl={10} xxl={9}>
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
                                                onKeyPress={(e: any) => {
                                                    if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                        e.preventDefault();
                                                    } else {
                                                        e.target.value = String(e.target.value).trim()
                                                    }
                                                }}
                                            />
                                        </Form.Item>
                                        {/* Last Name  */}
                                        <Form.Item name="sales_position" rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]} label="Describe your current sales positions, hot prospects, recently contracted work:">
                                            <TextArea size={'large'} placeholder="Enter..."
                                                onKeyPress={(e: any) => {
                                                    if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                        e.preventDefault();
                                                    } else {
                                                        e.target.value = String(e.target.value).trim()
                                                    }
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item name="accomplishments" rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]} label="Describe your accomplishments in the last 6 months:">
                                            <TextArea size={'large'} placeholder="Enter..."
                                                onKeyPress={(e: any) => {
                                                    if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                        e.preventDefault();
                                                    } else {
                                                        e.target.value = String(e.target.value).trim()
                                                    }
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item name="hr_position" rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]} label="Describe your HR position &/or needs:">
                                            <TextArea size={'large'} placeholder="Enter..."
                                                onKeyPress={(e: any) => {
                                                    if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                        e.preventDefault();
                                                    } else {
                                                        e.target.value = String(e.target.value).trim()
                                                    }
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item name="current_challenges" rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]} label="Describe any current challenges your business is facing (i.e. problem client, personnel
issue(s), trade availability, rising costs, supply chain, etc.):">
                                            <TextArea size={'large'} placeholder="Enter..."
                                                onKeyPress={(e: any) => {
                                                    if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                        e.preventDefault();
                                                    } else {
                                                        e.target.value = String(e.target.value).trim()
                                                    }
                                                }}
                                            />
                                        </Form.Item>


                                        <Form.Item name="craftsmen_support" rules={[{ required: true, message: 'Please Fill Field' }]} label="How can the Craftsmen aid or support you with these challenges?">
                                            <TextArea size={'large'} placeholder="Enter..."
                                                onKeyPress={(e: any) => {
                                                    if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                        e.preventDefault();
                                                    } else {
                                                        e.target.value = String(e.target.value).trim()
                                                    }
                                                }}
                                            />
                                        </Form.Item>

                                        {/* Button  */}
                                        <div className="d-flex gap-3 justify-content-center">
                                        <Button size={'large'} type="primary" className=" " onClick={onPrevious}>
                                            Previous
                                        </Button>
                                        <Button size={'large'} type="primary" htmlType="submit" className="login-form-button " loading={loading}>
                                            Next
                                        </Button>
                                        </div>
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
