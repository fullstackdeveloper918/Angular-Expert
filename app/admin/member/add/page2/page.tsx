"use client"
import { Breadcrumb, Form, Select, Input, Upload, Modal, message, Typography, SelectProps } from 'antd';
import { Head } from 'next/document';
import dynamic from 'next/dynamic';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { Fragment, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import validation from '@/utils/validation';
import MainLayout from '@/app/layouts/page';

import EmployeeRoles from '@/utils/EmployeeRoles.json'
import TextArea from 'antd/es/input/TextArea';
import api from '@/utils/api';
const { Row, Col, Card, Button } = {
    Button: dynamic(() => import("antd").then(module => module.Button), { ssr: false }),
    Row: dynamic(() => import("antd").then(module => module.Row), { ssr: false }),
    Col: dynamic(() => import("antd").then(module => module.Col), { ssr: false }),
    Card: dynamic(() => import("antd").then(module => module.Card), { ssr: false }),
}
const page = () => {

    const router = useRouter()
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)

    console.log(form, "form");
    const searchParams = useSearchParams();
    const entries = Array.from(searchParams.entries());
    console.log(searchParams,"iddd");
    console.log(entries,"entries");

    const value = entries.length > 0 ? entries[0][0] : '';
  
    const onFinish = async (values: any) => {
        console.log('Received values of form: ', values);
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
        console.log(items,"page2");
        
        // router.push("/admin/users/add/page3")
        try {
            setLoading(true)

            let res =await api.Auth.signUp(items)
            console.log(res,"qqqq");
            
            router.push(`/admin/member/add/page3?${res?.user_id}`)
            // setUserInfo((preValue: any) => {
            //   return {
            //     ...preValue,
            //     profile_pic: apiImageRes
            //   }
            // })

            // let apiRes = await henceforthApi.Staff.create(items)
            // console.log('apiRes', apiRes);

            // setUserInfo((preValue: any) => {
            //   return {
            //     ...preValue,
            //     name: apiRes.name,
            //     email: apiRes.email,
            //     mobile: apiRes.mobile
            //   }
            // })

            // form.resetFields()
        } catch (error: any) {
            // Toast.error(error)
            console.log(error);
        } finally {
            setLoading(false)
        }
    };
    const submit = () => {
        router.push("/admin/users/add/page3")
    }
    return (
        <MainLayout>
            <Fragment>

                <section>
                    <Row justify="center" gutter={[20, 20]}>
                        <Col sm={22} md={24} lg={11} xl={10} xxl={9}>
                            <Card className='common-card'>
                                <div className='mb-4'>
                                    <Breadcrumb separator=">">
                                        <Breadcrumb.Item><Link href="/" className='text-decoration-none'>Home</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item><Link href="/admin/member" className='text-decoration-none'>User</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/member/add" className='text-decoration-none'>Add User</Link></Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                                {/* Title  */}
                                <div className='mb-2'>
                                    <Typography.Title level={3} className='m-0 fw-bold'>BUSINESS UPDATE</Typography.Title>
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
                                        <Button size={'large'} type="primary" htmlType="submit" className="login-form-button w-100" loading={loading}>
                                            Save & Next
                                        </Button>
                                    </Form>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                </section>
            </Fragment >
        </MainLayout>
    )
}

export default page