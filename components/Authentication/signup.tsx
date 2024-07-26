"use client";
import logo from "../../assests/images/image.png";
import React from "react";
import { Form, Input } from "antd";
import dynamic from "next/dynamic";

const { Row, Col, Button } = {
  Row: dynamic(() => import("antd").then((module) => module.Row), {
    ssr: false,
  }),
  Col: dynamic(() => import("antd").then((module) => module.Col), {
    ssr: false,
  }),
  Button: dynamic(() => import("antd").then((module) => module.Button), {
    ssr: false,
  }),
};

const Signup = () => {
  const onFinish = async (values: any) => {
    if (values.email == "") {
    }

    let items = {
      email: String(values.email).toLowerCase(),
      password: values.password,
      device_type: "WEB",
    };

    try {
    } catch (error: any) {
    }
  };
  return (
    <section className="auth-pages d-flex align-items-center h-100">
      <div className="container">
        <Row justify="center">
          <Col className="gutter-row" xs={23} sm={21} md={19} lg={12} xl={10}>
            <div className="form-wrapper d-flex justify-content-center align-items-center h-100 bg-white py-5 px-4 px-md-5">
              <div>
                <div className="logo mb-5">
                  <img src={`${logo.src}`} alt="logo" className="img-fluid" />
                </div>

                <Form
                  name="normal_login"
                  className="login-form"
                  initialValues={{ remember: false }}
                  onFinish={onFinish}
                  scrollToFirstError
                >
                  {/* Email  */}
                  <div className="d-flex gap-2 flexWrapper">
                    <Form.Item
                      name="firstname"
                      className="col-md-6 col-sm-12 col-lg-6"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please enter valid first name",
                        },
                      ]}
                    >
                      <label className=" labelSignup">First Name</label>
                      <Input
                        size={"large"}
                        prefix={<i className="fa-regular fa-user"></i>}
                        placeholder="First Name"
                      />
                    </Form.Item>
                    <Form.Item
                      name="lastname"
                      className="col-md-6 col-sm-12 col-lg-6"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please enter valid last name",
                        },
                      ]}
                    >
                      <label className=" labelSignup">Last Name</label>
                      <Input
                        size={"large"}
                        prefix={<i className="fa-regular fa-user"></i>}
                        placeholder="Last Name"
                      />
                    </Form.Item>
                  </div>
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please enter valid email",
                      },
                    ]}
                  >
                    <label className=" labelSignup">Email</label>
                    <Input
                      size={"large"}
                      prefix={<i className="fa-regular fa-envelope"></i>}
                      placeholder="Email"
                    />
                  </Form.Item>
                  {/* Password  */}
                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: "Please enter password" },
                    ]}
                  >
                    <label className=" labelSignup">Password</label>
                    <Input.Password
                      size={"large"}
                      prefix={<i className="fa-solid fa-lock"></i>}
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Item>

                  {/* Button  */}
                  <Button
                    size={"large"}
                    type="primary"
                    htmlType="submit"
                    className="login-form-button w-100"
                  >
                    Sign Up
                  </Button>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Signup;
