"use client"
import { Breadcrumb, Form, Select, Input, Upload, Modal, message, Typography, SelectProps, DatePickerProps, DatePicker } from 'antd';
import { Head } from 'next/document';
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
const page = () => {
  // const defaultValue = dayjs('2024-01-01');

  const router = useRouter()
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const onChange: DatePickerProps['onChange'] = (_, dateStr) => {
    console.log('onChange:', dateStr);
  };

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
                    <Form.Item name="location" rules={[{ required: true, whitespace: true, message: 'Please Enter Location' }]} label="Location">
                      <Input size={'large'} placeholder="Location"
                        onKeyPress={(e: any) => {
                          if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                            e.preventDefault();
                          } else {
                            e.target.value = String(e.target.value).trim()
                          }
                        }}
                      />
                    </Form.Item>
                    <Form.Item name="hotel" rules={[{ required: true, whitespace: true, message: 'Please Enter Hotel' }]} label="Hotel">
                      <Input size={'large'} placeholder="Hotel"
                        onKeyPress={(e: any) => {
                          if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                            e.preventDefault();
                          } else {
                            e.target.value = String(e.target.value).trim()
                          }
                        }}
                      />
                    </Form.Item>
                    <Form.Item name="airport " rules={[{ required: true, whitespace: true, message: 'Please Enter Nearest Airport' }]} label="Nearest Airport">
                      <Input size={'large'} placeholder="Nearest Airport"
                        onKeyPress={(e: any) => {
                          if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                            e.preventDefault();
                          } else {
                            e.target.value = String(e.target.value).trim()
                          }
                        }}
                      />
                    </Form.Item>
                    <Form.Item name="host_company" rules={[{ required: true, whitespace: true, message: 'Please Enter Host Company' }]} label="Host Company">
                      <Input size={'large'} placeholder="Host Company"
                        onKeyPress={(e: any) => {
                          if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                            e.preventDefault();
                          } else {
                            e.target.value = String(e.target.value).trim()
                          }
                        }}
                      />
                    </Form.Item>
                    <Form.Item name="host" rules={[{ required: true, whitespace: true, message: 'Please Enter Host' }]} label="Host">
                      <Input size={'large'} placeholder="Host"
                        onKeyPress={(e: any) => {
                          if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                            e.preventDefault();
                          } else {
                            e.target.value = String(e.target.value).trim()
                          }
                        }}
                      />
                    </Form.Item>
                    <Form.Item name="cell" rules={[{ required: true, whitespace: true, message: 'Please Enter Cell' }]} label="Cell">
                      <Input size={'large'} placeholder="Cell"
                        onKeyPress={(e: any) => {
                          if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                            e.preventDefault();
                          } else {
                            e.target.value = String(e.target.value).trim()
                          }
                        }}
                      />
                    </Form.Item>
                    <Form.Item name="weather" rules={[{ required: true, whitespace: true, message: 'Please Enter Weather' }]} label="Weather">
                      <Input size={'large'} placeholder="Weather"
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

export default page