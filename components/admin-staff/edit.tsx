"use client"
import type { GetServerSideProps, NextPage } from 'next'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'
import { Breadcrumb, Form, Select, Input, Upload, Modal, Spin, Typography, SelectProps } from 'antd';
import Link from 'next/link';
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import EmployeeRoles from '@/utils/EmployeeRoles.json'
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { UploadChangeParam } from 'antd/es/upload';
import MainLayout from '../Layout/layout';
import api from '@/utils/api';
import { permission } from 'process';
import { toast, ToastContainer } from 'react-toastify';

const { Row, Col, Card, Button } = {
  Button: dynamic(() => import("antd").then(module => module.Button), { ssr: false }),
  Row: dynamic(() => import("antd").then(module => module.Row), { ssr: false }),
  Col: dynamic(() => import("antd").then(module => module.Col), { ssr: false }),
  Card: dynamic(() => import("antd").then(module => module.Card), { ssr: false }),
}

const { Option } = Select;
type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode;
};

const EditStaff: Page = () => {
  const router = useRouter()
  const [form] = Form.useForm();
  const [state, setState] = useState({} as any)
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
console.log(state,"statestatestate");

//   const prefixSelector = (
//     <Form.Item name="country_code" noStyle>
//       <Select style={{ width: 70 }}>
//         {CountryCode.map((res) =>
//           <Option key={res.dial_code} value={res.dial_code}>{res.dial_code}</Option>)}
//       </Select>
//     </Form.Item>
//   );
const searchParam = useParams();
const id = searchParam.id;
console.log(searchParam,"iiiii");

  const options: SelectProps['options'] = [];
  for (let i = 0; i < 10; i++) {
    options.push({
      value: i.toString(10) + i,
      label: i.toString(10) + i,
    });
  }

  const onFinish = async (values: any) => {
 

let item={
    admin_uuid: id,
    firstname:values?.firstname,
    lastname:values?.lastname,
    phone_number:values?.phone_number,
    permission:values?.permission,
}

    try {
    //   setLoading(true)

        let apiRes = await api.Admin.edit(item as any)
        toast.success('Edit Successful', {
            position: 'top-center',
            autoClose: 300,
            onClose: () => {
                router.push('/admin/admin-staff');
            },
        });
        setState(apiRes)
        router.back()
      
    } catch (error: any) {
      console.error(error)
    //   Toast.error(error)
    } finally {
    //   setLoading(false)
    }
  };


  const handleCancel = () => setPreviewOpen(false);


  const initialise = async () => {
    const item = {
        admin_uuid: id
      }
    try {
      let apiRes = await api.Admin.getById(item as any)
      setState(apiRes?.data)
      console.log('apiRes edit data', apiRes);
      form.setFieldsValue(apiRes)
      form.setFieldValue("phone_no", apiRes.mobile)
    //   setFileList([{
    //     uid: '-1',
    //     name: '',
    //     status: 'done',
    //     url: apiRes.profile_pic ? s3bucket.getUrl(apiRes.profile_pic) : User.src
    //   }])
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    if (state) {
      form.setFieldsValue(state)
    }
  }, [state])

  useEffect(() => {
    initialise()
  }, [])

  return (
    <MainLayout>
    <Fragment>
    <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
      <section>
        {/* <Spin spinning={loading}> */}
          <Row gutter={[20, 20]}>
            <Col sm={22} md={12} lg={11} xl={10} xxl={9}>
              <Card className='common-card'>
                <div className='mb-4'>
                  <Breadcrumb separator=">">
                    <Breadcrumb.Item><Link href="/" className='text-decoration-none'>Home</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link href="/staff/page/1" className='text-decoration-none'>Admin</Link></Breadcrumb.Item>
                    {/* <Breadcrumb.Item><Link href={`/staff/${router.query._id}/view`} className='text-decoration-none text-capitalize'>{state?.firstname ? `${state?.firstname} ${state?.lastname}` : 'N/A'}</Link></Breadcrumb.Item> */}
                    <Breadcrumb.Item className='text-decoration-none'>Edit</Breadcrumb.Item>
                  </Breadcrumb>
                </div>
                {/* Title  */}
                <div className='mb-4'>
                  <Typography.Title level={3} className='m-0 fw-bold'>Edit Admin</Typography.Title>
                </div>
                {/* form  */}
                <div className='card-form-wrapper'>
                  <Form name="edit_staff"
                    form={form}
                    className="add-staff-form"
                    onFinish={onFinish}
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
                    {/* Email  */}
                    <Form.Item name="email" rules={[{ required: true, message: 'Please Enter Email' }]} label="Email">
                      <Input size='large' type='email' placeholder="Email" disabled />
                    </Form.Item>
                    {/* Phone No  */}
                    <Form.Item name="phone_number" rules={[{ required: true, whitespace: true, message: 'Please Enter Phone No' }]} label="Phone No">
                      <Input size='large' type="text" minLength={10} maxLength={10} placeholder="Phone No" />
                    </Form.Item>
                    {/* Password  */}
                    {/* <Form.Item name="password" label="Password">
                      <Input.Password type="password" placeholder="Password" />
                    </Form.Item> */}
                    {/* Roles  */}
                    <Form.Item name="permission" label="Roles" rules={[{ required: true, message: 'Please Select Roles' }]}>
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
        {/* </Spin> */}
      </section>
    </Fragment>
    </MainLayout>
  )
}


export default EditStaff