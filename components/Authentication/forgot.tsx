"use client";
import logo from "../../assests/images/image.png";
import React, { useState } from "react";
import { Form, Input } from "antd";
import dynamic from "next/dynamic";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import api from "@/utils/api";
const { Row, Col, Button, Divider } = {
  Row: dynamic(() => import("antd").then((module) => module.Row), {
    ssr: false,
  }),
  Col: dynamic(() => import("antd").then((module) => module.Col), {
    ssr: false,
  }),
  Button: dynamic(() => import("antd").then((module) => module.Button), {
    ssr: false,
  }),
  Divider: dynamic(() => import("antd").then((module) => module.Divider), {
    ssr: false,
  }),
};
interface User {
  accessToken: string;
}
const Forgotpaswrd = () => {
 
    const [loading, setLoading] = useState<any>(false)
    const onFinish = async (values: any) => {
        setLoading(true)
        let items = {
            to: values.email,
            link: `https://nahbcraftsmen.com/auth/update_password?${values.email}`
            // link: `https://angular-expert-mu.vercel.app/auth/update_password?${values.email}`
        };
        try {
            let res = await api.Auth.forgotPassword(items)
            console.log(res,"reeeeee");
            
            toast.success(res?.message)
            // if(res.status == 200) {
            //     toast.success('OTP sent to your email', {
            //         position: 'top-center',
            //         autoClose: 1500
            //     })
            //     setLoading(false)
            // }

        } catch (error) {
            setLoading(false)
            toast.error("Invalid Email")
        }
        finally{
            setLoading(false)
        }
    }

  return (
    <section className='auth-pages d-flex align-items-center h-100'>
         <ToastContainer
         position="top-right"
         autoClose={1000}
         hideProgressBar={false}
         newestOnTop={false}
         closeOnClick
         rtl={false}
         pauseOnFocusLoss
         draggable
         pauseOnHover
       />
    <div className="container">
        <Row justify="center">

            <Col className="gutter-row" xs={22} sm={18} md={12} lg={10} xl={10}>
                <div className='form-wrapper d-flex justify-content-center align-items-center h-100 bg-white py-5 px-4 px-md-5'>
                    <div>
                        <div className="logo mb-5">
                            <img src={`${logo.src}`} alt="logo" className='img-fluid' />
                        </div>
                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{ remember: false }}
                            onFinish={onFinish}
                            scrollToFirstError
                        >
                            {/* Email  */}
                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Please input your Email!' },
                                    { type: 'email', message: 'The input is not valid E-mail!' }
                                ]}
                            >
                                {/* <label className="labelSignup">Email</label> */}
                                <Input size={'large'} prefix={<i className="fa-regular fa-envelope"></i>} placeholder="Email" />
                            </Form.Item>

                            {/* Button  */}
                            <Form.Item>
                                <Button size={'large'} type="primary" htmlType="submit" className="login-form-button w-100" loading={loading}>
                                    {"Submit"}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
</section>
  );
};

export default Forgotpaswrd;
