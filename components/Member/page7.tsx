"use client";
import { Form, Typography, Divider, Button, Card, Col, Row } from "antd";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useCallback, useState } from "react";
import MainLayout from "../../components/Layout/layout";
import TextArea from "antd/es/input/TextArea";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { destroyCookie } from "nookies";

const Page7 = () => {
    const router = useRouter()
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)


    const searchParams = useSearchParams();
    const entries = Array.from(searchParams.entries());
    const value = entries.length > 0 ? entries[0][0] : '';
    const type = entries.length > 1 ? entries[1][0] : '';
    const submit = async (values: any) => {
        let items = {
            spring_meeting: {
                userId: value,
                estimating: values?.estimating,
                accountability: values?.accountability,
                productivity: values?.productivity,
            }
        }
        try {
            if (type == "edit") {
                let items = {
                    spring_meeting: {
                        userId: value,
                        estimating: values?.estimating,
                        accountability: values?.accountability,
                        productivity: values?.productivity,
                    }
                } as any
                setLoading(true)
                let res = await api.User.edit(items)
                router.push(`/admin/member/add/page8?${value}&edit`)
            } else {

                setLoading(true)
                let res = await api.Auth.signUp(items)
                if (res?.status == 400) {
                    toast.error("Session Expired Login Again")
                    router.replace("/auth/signin")
                }
                router.push(`/admin/member/add/page8?${res?.userId}`)
            }
        } catch (error) {

            setLoading(false)
        } finally {
        }
    }
    const onFinish1 = async (values: any) => {
        let items = {
            spring_meeting: {
                userId: value,
                estimating: values?.estimating,
                accountability: values?.accountability,
                productivity: values?.productivity,
            }
        }
        try {
            if (type == "edit") {
                let items = {
                    spring_meeting: {
                        userId: value,
                        estimating: values?.estimating,
                        accountability: values?.accountability,
                        productivity: values?.productivity,
                    }
                } as any
                setLoading(true)
                let res = await api.User.edit(items)
                toast.success("Save successfully")
            } else {

                setLoading(true)
                let res = await api.Auth.signUp(items)
                toast.success("Save Successfully")
                if (res?.status == 400) {
                    toast.error("Session Expired Login Again")
                    router.replace("/auth/signin")
                }
            }
        } catch (error) {
            setLoading(false)
        } finally {
        }
    }

    const [state, setState] = useState<any>("")
    const getDataById = async () => {
        const item = {
            user_id: value
        }
        try {
            const res = await api.User.getById(item as any);
            setState(res?.data || null);
            if (res?.status == 400) {
                toast.error("Session Expired Login Again")
                router.replace("/auth/signin")
            }
            form.setFieldsValue(res?.data)
        } catch (error: any) {
            if (error==400) {
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
      
                // }
                toast.error("Session Expired Login Again")
                router.replace("/auth/signin")
            }
        }
    };
    React.useEffect(() => {
        if (type == "edit") {
            getDataById();
        }
    }, [type, form]);
    const onPrevious = () => {
        router.replace(`/admin/member/add/page6?${value}&edit`)
    }
    return (
        <MainLayout>
            <Fragment>

                <section className="club_member">
                    <Row justify="center" gutter={[20, 20]} className='heightCenter'>
                        <Col sm={22} md={20} lg={16} xl={14} xxl={12}>
                            <Card className='common-card'>
                                {/* <div className='mb-4'>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item><Link href="/" className='text-decoration-none'>Home</Link></Breadcrumb.Item>
                                <Breadcrumb.Item><Link href="/admin/member" className='text-decoration-none'>User</Link></Breadcrumb.Item>
                                <Breadcrumb.Item ><Link href="/admin/member/add" className='text-decoration-none'>Add User</Link></Breadcrumb.Item>
                                <Breadcrumb.Item ><Link href="/admin/member/add/page2" className='text-decoration-none'>BUSINESS UPDATE</Link></Breadcrumb.Item>
                                <Breadcrumb.Item ><Link href="/admin/member/add/page3" className='text-decoration-none'>GOALS</Link></Breadcrumb.Item>
                                <Breadcrumb.Item ><Link href="/admin/member/add/page4" className='text-decoration-none'>CRAFTSMEN TOOLBOX</Link></Breadcrumb.Item>
                                <Breadcrumb.Item ><Link href="/admin/member/add/page5" className='text-decoration-none'>CRAFTSMEN CHECK-UP</Link></Breadcrumb.Item>
                                <Breadcrumb.Item ><Link href="/admin/member/add/page6" className='text-decoration-none'>2023 MEETING REVIEW</Link></Breadcrumb.Item>
                            </Breadcrumb>
                        </div> */}
                                {/* Title  */}
                                <div className='mb-2 d-flex justify-content-between'>
                                    <Typography.Title level={3} className='m-0 fw-bold'>FALL 2024 MEETING PREPARATION</Typography.Title>
                                    <Button size={'large'} type="primary" className="text-white" disabled>6/7</Button>
                                </div>

                                {/* form  */}
                                <div className='card-form-wrapper'>
                                    <Form form={form} name="add_staff" className="add-staff-form" scrollToFirstError layout='vertical' onFinish={submit}>


                                        <div className='mt-3 mb-1'>
                                            <Typography.Title level={5} className='m-0 fw-bold'>LIST THREE ROUNDTABLE TOPICS THAT YOU WANT TO COVER IN OUR FALL MEETING (IN ORDER OF IMPORTANCE)</Typography.Title>
                                        </div>
                                        <Divider plain></Divider>
                                        {/* First Name  */}
                                        <Form.Item name="estimating" rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]} >
                                            <TextArea size={'large'} placeholder="Enter..."
                                            // placeholder="Estimating should always be No.1"

                                            />
                                        </Form.Item>
                                        <Form.Item name="accountability" rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]}>
                                            <TextArea size={'large'} placeholder="Enter..."
                                            //  placeholder="Accountability should always be No. 2"

                                            />
                                        </Form.Item>
                                        <Form.Item name="productivity" rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]}>
                                            <TextArea size={'large'}
                                            //  placeholder="Productivity should always be No. 3
// Daily routine for everybody.
// What CRM systems do you use?"

                                            />
                                        </Form.Item>



                                        {/* Button  */}
                                        <div className="d-flex mt-3">
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

export default Page7;
