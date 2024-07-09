"use client"
import { Breadcrumb, Form, Select, Input, Upload, Modal, message, Typography, SelectProps, Divider } from 'antd';
import { Head } from 'next/document';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { Fragment, useState } from 'react'
import Link from 'next/link';
import validation from '@/utils/validation';
import MainLayout from '@/app/layouts/page';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import EmployeeRoles from '@/utils/EmployeeRoles.json'
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

    const onFinish = async (values: any) => {
        console.log('Received values of form: ', values);
        let items = {
            firstname: String(values.firstname).trim(),
            lastname: String(values.lastname).trim(),
            email: String(values.email).trim(),
            password: String(values.password).trim(),
            country_code: values.country_code ?? "+93",
            mobile: String(values.mobile).trim(),
            roles: values.roles
        } as any
        if (!items.firstname) {
            // return Toast.warn("Please Enter Valid First Name")
        }
        if (!items.lastname) {
            // return Toast.warn("Please Enter Valid Last Name")
        }
        // if (!henceforthValidations.email(items.email)) {
        //   return Toast.warn("Please Enter Valid E-mail")
        // }
        // if (!henceforthValidations.strongPassword(items.password)) {
        //   return Toast.warn("Please Enter Valid Password")
        // }
        if (!Number(items.mobile)) {
            // return Toast.warn("Please Enter Valid Phone No.")
        }
        if (!items.country_code) {
            // return Toast.warn("Please Select Country Code")
        }
        if (!values?.profile_pic?.fileList[0].originFileObj) {
            // return Toast.warn("Please Add Image")
        }
        try {
            setLoading(true)


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

            form.resetFields()
            // Toast.success("Staff Added Successfully");
            // router.replace(`/staff/${apiRes?._id}/view`)
        } catch (error: any) {
            // Toast.error(error)
            console.log(error);
        } finally {
            setLoading(false)
        }
    };
    const submit = () => {
        // router.push("/admin/users/add/page4")
    }

    const [inputPairs, setInputPairs] = useState([
        { id: 1, goalName: 'goal1', goalLabel: 'PROJECT 1:', commentName: 'comments1', commentLabel: 'PROJECT 1 COMMENTS:' }
    ]);

    const addInputPair = () => {
        const nextIndex = inputPairs.length + 1;
        setInputPairs([
            ...inputPairs,
            { id: nextIndex, goalName: `goal${nextIndex}`, goalLabel: `PROJECT #${nextIndex}`, commentName: `comments${nextIndex}`, commentLabel: `PROJECT #${nextIndex} COMMENTS:` }
        ]);
    };

    const removeInputPair = (id: any) => {
        setInputPairs(inputPairs.filter(pair => pair.id !== id));
    };
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
                                        <Breadcrumb.Item><Link href="/admin/users" className='text-decoration-none'>User</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/users/add" className='text-decoration-none'>Add User</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/users/add/page2" className='text-decoration-none'>BUSINESS UPDATE</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/users/add/page3" className='text-decoration-none'>GOALS</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/users/add/page4" className='text-decoration-none'>CRAFTSMEN TOOLBOX</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/users/add/page5" className='text-decoration-none'>CRAFTSMEN CHECK-UP</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/users/add/page6" className='text-decoration-none'>2023 MEETING REVIEW</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/users/add/page7" className='text-decoration-none'>2024 MEETING PREPARATION</Link></Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                                {/* Title  */}
                                <div className='mb-2'>
                                    <Typography.Title level={3} className='m-0 fw-bold'>PHOTO SECTION</Typography.Title>
                                </div>

                                {/* form  */}
                                <div className='card-form-wrapper'>
                                    <div className='mt-3 mb-1'>
                                        <Typography.Title level={5} className='m-0 fw-bold'>Share photos of current projects or additional information regarding comments in your
                                            update.
                                        </Typography.Title>
                                    </div>
                                    <div className='mt-3 mb-1'>
                                        <Typography.Title level={5} className='m-0 fw-bold'>Please paste a dropbox link for each project in the boxes indicated below, and write a brief
                                            summary of each project in the comment section
                                        </Typography.Title>
                                    </div>
                                    <Divider plain></Divider>
                                    <Form form={form} name="add_staff" className="add-staff-form" scrollToFirstError layout='vertical' onFinish={submit}>
                                        {/* First Name  */}

                                        <div className="">
                                            {inputPairs.map((pair: any, index: any) => (
                                                <div key={pair.id} style={{ position: 'relative' }}>
                                                    <Form.Item
                                                        name={pair.goalName}
                                                        rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]}
                                                        label={pair.goalLabel}
                                                    >
                                                        <Input
                                                            size={'large'}
                                                            placeholder="Enter..."
                                                            onKeyPress={(e: any) => {
                                                                if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                                    e.preventDefault();
                                                                } else {
                                                                    e.target.value = String(e.target.value).trim();
                                                                }
                                                            }}
                                                        />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name={pair.commentName}
                                                        rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]}
                                                        label={pair.commentLabel}
                                                    >
                                                        <Input
                                                            size={'large'}
                                                            placeholder="Enter..."
                                                            onKeyPress={(e: any) => {
                                                                if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                                    e.preventDefault();
                                                                } else {
                                                                    e.target.value = String(e.target.value).trim();
                                                                }
                                                            }}
                                                        />
                                                    </Form.Item>
                                                    {inputPairs.length > 1 && (
                                                        <MinusCircleOutlined
                                                            style={{ position: 'absolute', top: '0', right: '0', fontSize: '24px', cursor: 'pointer' }}
                                                            onClick={() => removeInputPair(pair.id)}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                            <Button type="dashed" onClick={addInputPair} block icon={<PlusOutlined />}>
                                                Add Project and Comment
                                            </Button>
                                        </div>

                                        {/* Button  */}
                                        <Button size={'large'} type="primary" htmlType="submit" className="login-form-button w-100 mt-2" loading={loading}>
                                            Submit 
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