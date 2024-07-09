"use client"
import loginImg from "../../../assests/images/login-bg.png"
import logo from "../../../assests/images/image.png"
import React, { useContext } from 'react';
import {
    Form,
    Input,
} from 'antd';
// import { useRouter } from 'next/router';
// import henceforthApi from '@/utils/henceforthApi';
// import { GlobalContext } from '@/context/Provider';
// import { COOKIES_USER_ACCESS_TOKEN } from '@/context/actionTypes';
// import { setCookie } from 'nookies';
import dynamic from 'next/dynamic';
import Icons from "@/app/common/Icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import Icons from "@/components/Icons";
// import { lowerCase } from "lodash";
// import { getFirebaseMessageToken } from "@/utils/firebase";

const { Row, Col, Button } = {
    Row: dynamic(() => import("antd").then(module => module.Row), { ssr: false }),
    Col: dynamic(() => import("antd").then(module => module.Col), { ssr: false }),
    Button: dynamic(() => import("antd").then(module => module.Button), { ssr: false }),
}

const signup = () => {
    const router = useRouter()
    // const { loading, setLoading, Toast, setUserInfo } = React.useContext(GlobalContext)
    const [rememberMe, setRememberMe] = React.useState(false)

    const onFinish = async (values: any) => {
        console.log('Received values of form: ', values);
        if (values.email == "") {
            // return Toast.error("Please enter valid E-mail")
        }

        // const fcmTokenId = await getFirebaseMessageToken()
        // console.log("fcmTokenId----", fcmTokenId)
        let items = {
            email: String(values.email).toLowerCase(),
            password: values.password,
            device_type: 'WEB'
        }
        // if (fcmTokenId.tokenId) {
        //     items = { ...items, ...{ fcm_token: fcmTokenId.tokenId } }
        // }
        try {
            // setLoading(true)
            // let apiRes = await henceforthApi.Auth.login(items)
            // let data = apiRes
            // Toast.success("Login successfully")
            // if (rememberMe) {
            //     setCookie(this, COOKIES_USER_ACCESS_TOKEN, data.access_token, {
            //         maxAge: 60 * 60 * 24 * 30,
            //         path: "/",
            //     });
            // } else {
            //     setCookie(this, COOKIES_USER_ACCESS_TOKEN, data.access_token, {
            //         path: "/",
            //     });
            // }
            // setUserInfo(data)
            // if (router.asPath?.includes("redirect")) {
            //     router.replace(router?.query?.redirect ? router?.query?.redirect as string : '/')
            // } else {
            //     router.replace('/')
            // }

        } catch (error: any) {
            console.log("login error message", error);
            // Toast.error(error)
            // setLoading(false)
        }
    };
    return (
        <section className='auth-pages d-flex align-items-center h-100'>
            <div className="container">
                <Row justify="center">
                    <Col className="gutter-row d-none d-md-block" xs={0} sm={6} md={12} lg={10} xl={8}>
                        <div className='image-wrapper '>
                            <img src={loginImg.src} alt="login" style={{ width: "100%" }} />
                        </div>
                    </Col>
                    <Col className="gutter-row" xs={22} sm={18} md={12} lg={10} xl={8}>
                        <div className='form-wrapper d-flex justify-content-center align-items-center h-100 bg-white py-5 px-4 px-md-5'>
                            <div>
                            <div className="logo mb-5">
                                    <img src={`${logo.src}`} alt="logo" className='img-fluid' />
                                </div>
                                
                                <Form name="normal_login" className="login-form" initialValues={{ remember: false }} onFinish={onFinish} scrollToFirstError>
                                    {/* Email  */}
                                    <div className="d-flex gap-2">

                                    <Form.Item name="firstname" rules={[{ required: true, whitespace: true, message: 'Please enter valid first name' }]} >
                                        <Input size={'large'}  placeholder="First Name" />
                                    </Form.Item>
                                    <Form.Item name="lastname" rules={[{ required: true, whitespace: true, message: 'Please enter valid last name' }]} >
                                        <Input size={'large'}  placeholder="Last Name" />
                                    </Form.Item>
                                    </div>
                                    <Form.Item name="email" rules={[{ required: true, whitespace: true, message: 'Please enter valid email' }]} >
                                        <Input size={'large'} prefix={<Icons.Email />} placeholder="Email" />
                                    </Form.Item>
                                    {/* Password  */}
                                    <Form.Item name="password" rules={[{ required: true, message: 'Please enter password' }]}>
                                        <Input.Password size={'large'} prefix={<Icons.Password />} type="password" placeholder="Password" />
                                    </Form.Item>
                                    

                                    {/* Button  */}
                                    <Button size={'large'} type="primary" htmlType="submit" className="login-form-button w-100" >
                                        Sign Up
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </section>
    )
}

export default signup;