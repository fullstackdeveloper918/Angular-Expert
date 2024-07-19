"use client"
import { Breadcrumb, Form, Select, Input, Upload, Modal, message, Typography, SelectProps, DatePickerProps, DatePicker } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { Fragment, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import validation from '@/utils/validation';
import MainLayout from '@/app/layouts/page';

import EmployeeRoles from '@/utils/EmployeeRoles.json'
import dayjs from "dayjs"
const { Row, Col, Card, Button } = {
    Button: dynamic(() => import("antd").then(module => module.Button), { ssr: false }),
    Row: dynamic(() => import("antd").then(module => module.Row), { ssr: false }),
    Col: dynamic(() => import("antd").then(module => module.Col), { ssr: false }),
    Card: dynamic(() => import("antd").then(module => module.Card), { ssr: false }),
}
const index = () => {

    const router = useRouter()
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const onChange: DatePickerProps['onChange'] = (_, dateStr) => {
    };

 
    return (
        <MainLayout>
            <Fragment>

                <section>
                    <Row gutter={[20, 20]}>
                        <Col sm={22} md={12} lg={11} xl={10} xxl={9} className='mx-auto'>
                            <Card className='common-card'>
                                <div className='mb-4'>
                                    <Breadcrumb separator=">">
                                        <Breadcrumb.Item><Link href="/" className='text-decoration-none'>Home</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item><Link href="/admin/meetings" className='text-decoration-none'>Meetings</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item className='text-decoration-none'>Edit Meeting</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                                {/* Title  */}
                                <div className='mb-4'>
                                    <Typography.Title level={3} className='m-0 fw-bold'>Edit Meeting</Typography.Title>
                                </div>

                                {/* form  */}
                                <div className='card-form-wrapper'>
                                    <Form form={form} name="add_staff" className="add-staff-form" scrollToFirstError layout='vertical'>
                                       


                                        {/* First Name  */}
                                        <Form.Item name="meeting" rules={[{ required: true, whitespace: true, message: 'Please Enter Meeting Name' }]} label="Meeting Name">
                                            <Input size={'large'} placeholder="Meeting Name"
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


                                        {/* Email  */}
                                        <Form.Item name="start" rules={[{ required: true, message: 'Please Enter Start Meeting' }]} label="Start Meeting">
                                            <DatePicker
                                           style={{ width: '100%' }}
                                                // defaultValue={defaultValue}
                                                showTime
                                                // locale={buddhistLocale}
                                                onChange={onChange}
                                            />
                                        </Form.Item>
                                        <Form.Item name="end" rules={[{ required: true, whitespace: true, message: 'Please Enter End Meeting' }]} label="End Meeting">
                                            <DatePicker
                                                // defaultValue={defaultValue}
                                                style={{ width: '100%' }}
                                                showTime
                                                // locale={buddhistLocale}
                                                onChange={onChange}
                                            />
                                        </Form.Item>


                                        {/* Button  */}
                                        <Button size={'large'} type="primary" htmlType="submit" className="login-form-button w-100" loading={loading}>
                                            Edit Meeting
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

export default index