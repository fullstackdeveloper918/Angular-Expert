"use client"
import { Breadcrumb, Form, Select, Input, Upload, Modal, message, Typography, SelectProps } from 'antd';
import { Head } from 'next/document';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { Fragment, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import validation from '@/utils/validation';
import MainLayout from '@/app/layouts/page';

import EmployeeRoles from '@/utils/EmployeeRoles.json'
import api from '@/utils/api';
const { Row, Col, Card, Button } = {
  Button: dynamic(() => import("antd").then(module => module.Button), { ssr: false }),
  Row: dynamic(() => import("antd").then(module => module.Row), { ssr: false }),
  Col: dynamic(() => import("antd").then(module => module.Col), { ssr: false }),
  Card: dynamic(() => import("antd").then(module => module.Card), { ssr: false }),
}
const Page1=()=> {

  const router = useRouter()
  const [form] = Form.useForm();
  const [loading,setLoading]=useState(false)

console.log(form,"form");

  const onFinish = async (values: any) => {
    console.log('Received values of form: ', values);
    // country_code: values.country_code ?? "+93",
    let items = {
      first_step:{
      firstname: String(values.firstname).trim(),
      lastname: String(values.lastname).trim(),
      email: String(values.email).trim(),
      password: String(values.password).trim(),
      mobile: String(values.mobile).trim(),
      roles: values.roles,
      company_name:values?.company_name,
      position:values?.position,
      home_city:values?.homecity,
      }
    } as any
    console.log(items,"items");
    
   
    // if (!items.firstname) {
    //   // return Toast.warn("Please Enter Valid First Name")
    // }
    // if (!items.lastname) {
    //   // return Toast.warn("Please Enter Valid Last Name")
    // }
    // if (!Number(items.mobile)) {
    //   // return Toast.warn("Please Enter Valid Phone No.")
    // }
    // if (!items.country_code) {
    //   // return Toast.warn("Please Select Country Code")
    // }
    // if (!values?.profile_pic?.fileList[0].originFileObj) {
    //   // return Toast.warn("Please Add Image")
    // }
    try {
      setLoading(true)
     
let res =await api.Auth.signUp(items)
console.log(res,"resssssssssssss");

// router.push(`/admin/users/add/page2?${res?.user_id}`)
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

      // form.resetFields()
      // Toast.success("Staff Added Successfully");
      // router.replace(`/staff/${apiRes?._id}/view`)
    } catch (error: any) {
      // Toast.error(error)
      console.log(error);
    } finally {
      setLoading(false)
    }
  };
  const submit=()=>{
    router.push("/admin/users/add/page2")
  }
  return (
    <>
  
   
            <div className=''>
              <Typography.Title level={3} className='m-0 fw-bold'>Add Club Member</Typography.Title>
            </div>
                <div className='row mt-4'>
                <Form.Item name="firstname" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter First Name' }]} >
                    <label htmlFor="" className='mb-2'>First Name</label>
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
                <Form.Item name="lastname" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Last Name' }]} >
                <label htmlFor="" className='mb-2'>Last Name</label>
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
                <Form.Item name="company_name" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Company Name' }]} >
                <label htmlFor="" className='mb-2'>Company Name</label>
                  <Input size={'large'} placeholder="Company Name" 
                     onKeyPress={(e: any) => {
                      if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                        e.preventDefault();
                      } else {
                        e.target.value = String(e.target.value).trim()
                      }
                    }}
                    />
                </Form.Item>
                <Form.Item name="mobile" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Phone No' }]} >
                <label htmlFor="" className='mb-2'>Phone No.</label>
                  <Input size={'large'} type="text" minLength={10} maxLength={10} placeholder="Phone No" />
                </Form.Item>
                <Form.Item name="position" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Position' }]} >
                <label htmlFor="" className='mb-2'>Position</label>
                  <Input size={'large'} type='position' placeholder="Position" />
                </Form.Item>
                <Form.Item name="homecity" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Home City' }]} >
                <label htmlFor="" className='mb-2'>Home City</label>
                  <Input size={'large'} type='homecity' placeholder="Home City" />
                </Form.Item>
                
                  {/* Email  */}
                  <Form.Item name="email" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Email' }]} >
                  <label htmlFor="" className='mb-2'>Email</label>
                  <Input size={'large'} type='email' placeholder="Email" />
                </Form.Item>
                {/* Password  */}
                <Form.Item name="password" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Password!' }]} >
                <label htmlFor="" className='mb-2'>Password</label>
                  <Input.Password size={'large'} type="password" placeholder="Password" />
                </Form.Item>
                {/* Phone No  */}
               
                {/* Roles  */}
                <label htmlFor="" className='mb-2'>Roles</label>
                <Form.Item name="roles" className=' col-sm-12'   rules={[{ required: true, message: 'Please Select Roles' }]}>
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
                </div>
                {/* Button  */}
                {/* <Button size={'large'} type="primary" htmlType="submit" className="login-form-button w-100" loading={loading}>
                  Save & Next
                </Button> */}
              {/* </Form> */}
            {/* </div> */}
    </>
        
  )
}

export default Page1