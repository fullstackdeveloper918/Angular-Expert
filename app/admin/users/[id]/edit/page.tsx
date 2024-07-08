"use client"
import dynamic from 'next/dynamic';
import EmployeeRoles from '@/utils/EmployeeRoles.json'
import Link from 'next/link';
import User from "@/assets/images/placeholder.png"
import { Breadcrumb, Form, Select, Input, Upload, Modal, Spin, Typography, SelectProps } from 'antd';
import React, { Fragment, ReactNode, useEffect, useState } from 'react'
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import MainLayout from '@/app/layouts/page';

// import React from 'react'
const { Row, Col, Card, Button, Space, Popconfirm } = {
  Button: dynamic(() => import("antd").then(module => module.Button), { ssr: false }),
  Row: dynamic(() => import("antd").then(module => module.Row), { ssr: false }),
  Col: dynamic(() => import("antd").then(module => module.Col), { ssr: false }),
  Card: dynamic(() => import("antd").then(module => module.Card), { ssr: false }),
  Space: dynamic(() => import("antd").then(module => module.Space), { ssr: false }),
  Popconfirm: dynamic(() => import("antd").then(module => module.Popconfirm), { ssr: false }),
}
interface StaffDetailInterface {
  is_blocked: boolean,
  email?: string,
  firstname?: string,
  lastname?: string,
  profile_pic?: any,
  roles?: Array<any>,
  country_code?: number,
  mobile?: number,
  _id: string
}
 const page=() =>{
  const [loading,setLoading]=useState(false)
  const router = useRouter()
  const [state, setState] = React.useState<StaffDetailInterface>({
    email: "",
    is_blocked: false,
    firstname: "",
    lastname: "",
    profile_pic: "",
    country_code: 0,
    mobile: 0,
    roles: [] as Array<string>,
    _id: ""
  })

  return (
    <MainLayout>
    <Fragment>
    {/* <Head>
      <title>Edit Staff</title>
      <meta name="description" content="Edit Staff" />
    </Head> */}
    <section>
      <Spin spinning={loading}>
        <Row gutter={[20, 20]}>
          <Col sm={22} md={12} lg={11} xl={10} xxl={9}>
            <Card className='common-card'>
              <div className='mb-4'>
                <Breadcrumb separator=">">
                  <Breadcrumb.Item><Link href="/" className='text-decoration-none'>Home</Link></Breadcrumb.Item>
                  <Breadcrumb.Item><Link href="/admin/users" className='text-decoration-none'>User</Link></Breadcrumb.Item>
                  <Breadcrumb.Item><Link href={`/admin/users/view`} className='text-decoration-none text-capitalize'>{state?.firstname ? `${state?.firstname} ${state?.lastname}` : 'View'}</Link></Breadcrumb.Item>
                  <Breadcrumb.Item className='text-decoration-none'>Edit</Breadcrumb.Item>
                </Breadcrumb>
              </div>
              {/* Title  */}
              <div className='mb-4'>
                <Typography.Title level={3} className='m-0 fw-bold'>Edit User</Typography.Title>
              </div>
              {/* form  */}
              <div className='card-form-wrapper'>
                <Form name="edit_staff"
                  // form={form}
                  className="add-staff-form"
                  // onFinish={onFinish}
                  scrollToFirstError
                  layout='vertical'
                >
                
                  {/* First Name  */}
                  <Form.Item name="firstname" rules={[{ required: true, whitespace: true, message: 'Please Enter First Name' }]} label="First Name">
                    <Input size='large' placeholder="First Name"
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
                    <Input size='large' placeholder="Last Name"
                      onKeyPress={(e: any) => {
                        if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                          e.preventDefault();
                        } else {
                          e.target.value = String(e.target.value).trim()
                        }
                      }}
                    />
                  </Form.Item>
                  {/* Comapny Name  */}
                  <Form.Item name="companyname" rules={[{ required: true, whitespace: true, message: 'Please Enter Comapny Name' }]} label="Comapny Name">
                    <Input size='large' placeholder="Comapny Name"
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
                    <Input size='large' type='email' placeholder="Email" disabled />
                  </Form.Item>
                  {/* Phone No  */}
                  <Form.Item name="phone_no" rules={[{ required: true, whitespace: true, message: 'Please Enter Phone No' }]} label="Phone No">
                    <Input size='large' type="text"  minLength={10} maxLength={10} placeholder="Phone No" />
                  </Form.Item>
                  {/* Password  */}
                  {/* <Form.Item name="password" label="Password">
                    <Input.Password type="password" placeholder="Password" />
                  </Form.Item> */}
                  <Form.Item name="position" rules={[{ required: true, message: 'Please Enter Position' }]} label="Position">
                    <Input size='large' type='text' placeholder="Position" disabled />
                  </Form.Item>
                  <Form.Item name="homecity" rules={[{ required: true, message: 'Please Enter Home City' }]} label="Home City">
                    <Input size='large' type='text' placeholder="Home City" disabled />
                  </Form.Item>
                  {/* Roles  */}
                  <Form.Item name="roles" label="Roles" rules={[{ required: true, message: 'Please Select Roles' }]}>
                    <Select
                      mode="tags"
                      size={'large'}
                      placeholder="Please select"
                      style={{ width: '100%' }}
                      options={EmployeeRoles.map((res) => {
                        return {
                          value: res.rol
                        }
                      })}
                    />
                  </Form.Item>
                  
                  {/* Button  */}
                  <Button size='large' type="primary" htmlType="submit" className="login-form-button w-100">
                    Save Changes
                  </Button>
                </Form>
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>
    </section>
  </Fragment>
  </MainLayout>
  )
}
export default page;
