"use client"
import loginImg from "../../../assests/images/login-bg.png"
import logo from "../../../assests/images/image.png"
import React, { useContext, useState } from 'react';
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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { setCookie } from "nookies";
// import Icons from "@/components/Icons";
// import { lowerCase } from "lodash";
// import { getFirebaseMessageToken } from "@/utils/firebase";

const { Row, Col, Button, Divider } = {
    Row: dynamic(() => import("antd").then(module => module.Row), { ssr: false }),
    Col: dynamic(() => import("antd").then(module => module.Col), { ssr: false }),
    Button: dynamic(() => import("antd").then(module => module.Button), { ssr: false }),
    Divider: dynamic(() => import("antd").then(module => module.Divider), { ssr: false }),
}
interface User {
    accessToken: string;
    // other properties
}
const page = () => {
    const router = useRouter()
    // const { loading, setLoading, Toast, setUserInfo } = React.useContext(GlobalContext)
    const [rememberMe, setRememberMe] = React.useState<any>(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [state,setState]=useState<any>("")
    const onFinish = async (values: any) => {
        console.log('Received values of form: ', values);
        // router.push("/admin/dashboard")
      
console.log(values.email,"email");
console.log(values.password,"pass");

        // const fcmTokenId = await getFirebaseMessageToken()
        // console.log("fcmTokenId----", fcmTokenId)
        let items = {
            email: String(values.email).toLowerCase(),
            password: values.password,
        }
        // if (fcmTokenId.tokenId) {
        //     items = { ...items, ...{ fcm_token: fcmTokenId.tokenId } }
        // }
        try {
            // setLoading(true)
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            console.log( state,"userCredential");
            setState(userCredential)
            // const Token= await userCredential.user
            setState(userCredential)
            const idToken = await userCredential.user.getIdToken();
            setToken(idToken);
            console.log('Token ID:', idToken);
            // Toast.success("Login successfully")
            if (rememberMe) {
                setCookie(this, "COOKIES_USER_ACCESS_TOKEN", idToken, {
                    maxAge: 60 * 60 * 24 * 30,
                    path: "/",
                });
            } else {
                setCookie(this, "COOKIES_USER_ACCESS_TOKEN", idToken, {
                    path: "/",
                });
            }
            router.replace('/admin/dashboard')
            // setState(userCredential)
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
    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredential,"userCredential");
            
            const idToken = await userCredential.user.getIdToken();
            setToken(idToken);
            console.log('Token ID:', idToken);
        } catch (error: any) {
            setError(error.message);
            console.error('Error logging in:', error);
        }
    };
    console.log(token, "token");

    return (
        <section className='auth-pages d-flex align-items-center h-100'>
            <div className="container">
                {/* <div>
                    <h1>Login</h1>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <button onClick={handleLogin}>Login</button>
                    {error && <p>Error: {error}</p>}
                </div> */}
                <Row justify="center">
                    <Col className="gutter-row d-none d-md-block" xs={0} sm={6} md={12} lg={10} xl={8}>
                        <div className='image-wrapper '>
                            <img src={loginImg.src} alt="login" style={{ width: "100%" }} />
                            {/* <h2 className="">D</h2> */}
                        </div>
                    </Col>
                    <Col className="gutter-row" xs={22} sm={18} md={12} lg={10} xl={8}>
                        <div className='form-wrapper d-flex justify-content-center align-items-center h-100 bg-white py-5 px-4 px-md-5'>
                            <div>
                                {/* <div className='logo-wrapper text-center mb-5'>
                                </div> */}
                                {/* <img src={logo.src} alt="login" /> */}
                                {/* <h1 className="">DCB</h1> */}
                                <div className="logo mb-5">
                                    <img src={`${logo.src}`} alt="logo" className='img-fluid' />

                                </div>
                                <Form name="normal_login" className="login-form" initialValues={{ remember: false }} onFinish={onFinish} scrollToFirstError>
                                    {/* Email  */}
                                    <Form.Item name="email" rules={[{ required: true, whitespace: true, message: 'Please enter valid email' }]} >
                                        <Input size={'large'} prefix={<i className="fa-regular fa-envelope"></i>} placeholder="Email" />
                                    </Form.Item>
                                    {/* Password  */}
                                    <Form.Item name="password" rules={[{ message: 'Please enter password' }]}>
                                        <Input.Password size={'large'} prefix={<i className="fa-solid fa-lock"></i>} type="password" placeholder="Password" />
                                    </Form.Item>
                                        <div className="">
                                            <Link href={"/auth/forgot_password"} className="forgotPassword">
                                                Forgot your password?
                                            </Link>
                                        </div>
                                    {/* Button  */}
                                    <Button size={'large'} type="primary" htmlType="submit" className="login-form-button w-100" >
                                        Log In
                                    </Button>
                                </Form>
                                <Divider plain className="hrdivider"></Divider>
                                <div className="d-flex justify-content-center align-items-baseline">
                                    <span className="mt-2">
                                        {/* <p className=""> */}
                                        Don't have a account yet?
                                        {/* </p> */}
                                    </span>
                                    <Link href={"/auth/signup"}>

                                        <Button  htmlType="submit" className="signBtn" >
                                            Sign Up
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </section>
    )
}

export default page;