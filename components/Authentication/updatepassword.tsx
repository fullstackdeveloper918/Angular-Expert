"use client";
import logo from "../../assests/images/image.png";
import React from "react";
import { Form, Input } from "antd";
import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { parseCookies } from "nookies";

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
const Updatepswrd = () => {
  const cookies = parseCookies();
  const accessToken = cookies.COOKIES_USER_ACCESS_TOKEN;
  const searchParams = useSearchParams();
  const entries = Array.from(searchParams.entries());
  const value = entries.length > 0 ? entries[0][0] : '';
  const type = entries.length > 1 ? entries[1][0] : '';
 const onFinish = async (values: any) => {
        let items = {
            email:value,
            password: values.new_password
        };
        try {
            let res = await axios.put("https://frontend.goaideme.com/update-password", items,
              {
                headers: {
                  Token: `${accessToken}`,
              }
              }
            )

        } catch (error) {

        }
    }
  return (
    <section className='auth-pages d-flex align-items-center h-100'>
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
                            <label className="labelSignup">New Password</label>
                            <Form.Item name="new_password" rules={[{ message: 'Please enter password' }]}>
                                <Input size={'large'} prefix={<i className="fa-solid fa-lock"></i>} type="text" placeholder="New Password" />
                            </Form.Item>
                            <label className="labelSignup">Confirm Password</label>
                            <Form.Item name="password" rules={[{ message: 'Please enter password' }]} >
                                <Input.Password size={'large'} prefix={<i className="fa-solid fa-lock"></i>} type="password" placeholder="Confirm Password" />
                            </Form.Item>

                            {/* Button  */}
                            <Form.Item>
                                <Button size={'large'} type="primary" htmlType="submit" className="login-form-button w-100" >
                                    Submit
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

export default Updatepswrd;
