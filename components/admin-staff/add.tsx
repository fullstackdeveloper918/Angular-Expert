"use client"
import type { GetServerSideProps, NextPage } from 'next'
import React, { Fragment, ReactNode, useState } from 'react'
import { Breadcrumb, Form, Select, Input, Upload, Modal, message, Typography, SelectProps } from 'antd';
import Link from 'next/link';
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import EmployeeRoles from '../../utils/EmployeeRoles.json'
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
// import api from '@/utils/api';
import { toast, ToastContainer } from 'react-toastify';
import MainLayout from '../Layout/layout';
import { destroyCookie } from 'nookies';
import { useDispatch } from 'react-redux';
import api from '../../utils/api';
import { clearUserData } from '../../lib/features/userSlice';
// import { clearUserData } from '@/lib/features/userSlice';



const { Row, Col, Card, Button } = {
    Button: dynamic(() => import("antd").then(module => module.Button), { ssr: false }),
    Row: dynamic(() => import("antd").then(module => module.Row), { ssr: false }),
    Col: dynamic(() => import("antd").then(module => module.Col), { ssr: false }),
    Card: dynamic(() => import("antd").then(module => module.Card), { ssr: false }),
}

const { Option } = Select;
type Page<P = {}> = NextPage<P> & {
    getLayout?: (page: ReactNode) => ReactNode;
};

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const AddStaff: Page = () => {
    const router = useRouter()
    const [form] = Form.useForm();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState<any>(false)
    const dispatch = useDispatch()
    const options: SelectProps['options'] = [];
    for (let i = 0; i < 10; i++) {
        options.push({
            value: i.toString(10) + i,
            label: i.toString(10) + i,
        });
    }

    const onFinish = async (values: any) => {
        let items = {
            firstname: String(values.firstname).trim(),
            lastname: String(values.lastname).trim(),
            email: String(values.email).trim(),
            password: String(values.password).trim(),
            phone_number: String(values.mobile).trim(),
            permission: values.roles,
        } as any

        try {
            setLoading(true)
            let res = await api.Admin.create(items)

            toast.success(res?.message, {
                position: 'top-center',
                autoClose: 300,
                onClose: () => {
                    router.push('/admin/admin-staff');
                },
            });
            form.resetFields()
            if (res?.status == 400) {
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                localStorage.removeItem('hasReloaded');
                // }
                dispatch(clearUserData({}));
                toast.error("Session Expired Login Again")
                router.replace("/auth/signin")
            }
        } catch (error: any) {


            setLoading(false)
            if (error?.status==400) {
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                localStorage.removeItem('hasReloaded');
                // }
                dispatch(clearUserData({}));
                toast.error("Session Expired Login Again")
                router.replace("/auth/signin")
            }
        } finally {
        }
    };

    return (
        <MainLayout>
            <Fragment>
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
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
                        <Col sm={22} md={12} lg={11} xl={10} xxl={9}>
                            <Card className='common-card'>
                                <div className='mb-4'>
                                    <Breadcrumb separator=">">
                                        <Breadcrumb.Item><Link href="/admin/dashboard" className='text-decoration-none'>Home</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item><Link href="/staff/page/1" className='text-decoration-none'>Admin</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item className='text-decoration-none'>Add Admin</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                                {/* Title  */}
                                <div className='mb-4'>
                                    <Typography.Title level={3} className='m-0 fw-bold'>Add Admin</Typography.Title>
                                </div>

                                {/* form  */}
                                <div className='card-form-wrapper'>
                                    <Form form={form} name="add_staff" className="add-staff-form" onFinish={onFinish} scrollToFirstError layout='vertical'>

                                        {/* First Name  */}
                                        <Form.Item name="firstname" rules={[{ required: true, whitespace: true, message: 'Please Enter First Name' }]} label="First Name">
                                            <Input size={'large'} placeholder="First Name"
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
                                        <Form.Item name="lastname" rules={[{ required: true, whitespace: true, message: 'Please Enter Last Name' }]} label="Last Name">
                                            <Input size={'large'} placeholder="Last Name"
                                                onKeyPress={(e: any) => {
                                                    if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                        e.preventDefault();
                                                    } else {
                                                        e.target.value = String(e.target.value).trim()
                                                    }
                                                }}
                                            />
                                        </Form.Item>
                                        {/* Email  */}
                                        <Form.Item name="email" rules={[{ required: true, message: 'Please Enter Email' }]} label="Email">
                                            <Input size={'large'} type='email' placeholder="Email" />
                                        </Form.Item>
                                        {/* Password  */}
                                        <Form.Item name="password" rules={[{ required: true, message: 'Please Enter Password!' },
                                            //  { pattern: validation.strongPasswordRegEx, message: "Password must contains 8 characters including combination of uppercase, lowercase letter, number and special characters" }
                                        ]}
                                            label="Password">
                                            <Input.Password size={'large'} type="password" placeholder="Password" />
                                        </Form.Item>
                                        {/* Phone No  */}
                                        <Form.Item name="mobile" rules={[{ required: true, whitespace: true, message: 'Please Enter Phone No' }]} label="Phone No">
                                            <Input size={'large'} type="text" minLength={6} onKeyPress={(event) => {
                                                
                                                if (!/[0-9\s\(\)\-\+\,]/.test(event.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                                                    event.preventDefault();
                                                }
                                            }} placeholder="Phone No" />
                                        </Form.Item>
                                        {/* Roles  */}
                                        <Form.Item name="roles" label="Permissions" rules={[{ required: true, message: 'Please Select Permissions' }]}>
                                            <Select
                                                mode="tags"
                                                size={'large'}
                                                placeholder="Please select"
                                                style={{ width: '100%' }}
                                                options={EmployeeRoles.map((res) => {
                                                    return {
                                                        value: res.rol,
                                                        label: res.name
                                                    }
                                                })}
                                            />
                                        </Form.Item>
                                        {/* Button  */}
                                        <Button size={'large'} type="primary" htmlType="submit" className="login-form-button w-100" loading={loading}>
                                            Add Admin
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


export default AddStaff