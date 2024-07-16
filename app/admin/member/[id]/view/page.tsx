"use client"
import dynamic from 'next/dynamic';
import EmployeeRoles from '@/utils/EmployeeRoles.json'
import Link from 'next/link';
import User from "../../../../assests/images/placeholder.png"
import { Avatar, Breadcrumb, Divider, Spin, Tag, Typography, theme } from 'antd';
import React, { Fragment, ReactNode, useEffect, useState } from 'react'
// import Head from 'next/head';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/app/layouts/page';
import { fetchAreaById } from '@/utils/fakeApi';
import api from '@/utils/api';
import axios from 'axios';
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
const page = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [state, setState] = React.useState<any>({
    id: "",
    name: "",
    company: "",
    email: "",
    phone: "",
    position: "",
    home: "",
    is_activate: "",
    is_archive: ""
  })
  const [isActive, setIsActive] = useState(false);
  const searchParam = useParams();
  // console.log(searchParam, "cheee");

  const id: any = searchParam.id;
  const getDataById = async () => {
    console.log(id);
    const item = {
      user_id: id
    }
    try {
      const res = await api.User.getById(item as any);
      console.log(res, "ressssss");
      setState(res?.data || null);
    } catch (error: any) {
      alert(error.message);
    }
  };


  const activeDeactive = async (id: any) => {
    const item = {
      user_id: id,
      activatedeactivate: state?.is_activate ? false : true
    }
    try {
      let res = await api.User.deactivate(item as any)
      console.log(res, "hhhh");
      getDataById()
    } catch (error) {

    }
  }
  const archive = async (id: any) => {
    const item = {
      user_id: id,
      archive: state?.is_archive ? false : true
    }
    try {
      let res = await api.User.deactivate(item as any)
      console.log(res, "hhhh");
      router.back()
    } catch (error) {

    }
  }

  const onFinish = async () => {
    let items = {
      to: state?.email,
      link: `http://localhost:3000/auth/update_password?${state.email}`
    };
    try {
      setLoading(true)
      let res = await axios.post("https://frontend.goaideme.com/reset-password", items)
      console.log(res, "checkkkkkkk");
      getDataById()
    } catch (error) {
      console.log(error);

    }finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    // if (id) {
    getDataById();
    // }
  }, []);
  console.log(state, "state");

  return (
    <MainLayout>
      <Fragment>
        {/* <Head>
      <title>Staff Details</title>
      <meta name="description" content="Staff Details" />
    </Head> */}
        <section>
          <Spin spinning={loading}>
            <Row gutter={[20, 20]}>
              <Col sm={22} md={12} lg={11} xl={10} xxl={9} className='mx-auto'>
                <Card className='common-card'>
                  <div className='mb-4'>
                    <Breadcrumb separator=">">
                      <Breadcrumb.Item><Link href="/" className='text-decoration-none'>Home</Link></Breadcrumb.Item>
                      <Breadcrumb.Item><Link href="/admin/member" className='text-decoration-none'>Club Member</Link></Breadcrumb.Item>
                      <Breadcrumb.Item className='text-decoration-none'>Club Member Details</Breadcrumb.Item>
                    </Breadcrumb>
                  </div>
                  {/* Title  */}
                  <div>
                    <Typography.Title level={3} className='m-0 fw-bold'>Club Member Details</Typography.Title>
                  </div>
                  {/* Car Listing  */}
                  <div className='card-listing'>
                    {/* <div className='card-listing-image my-4 text-center'>
                  <Avatar size={120} src={User.src}>{state?.firstname?.charAt(0)?.toUpperCase()}</Avatar>
                </div>
                <Divider plain></Divider> */}

                    {/* Detail  */}
                    <ul className='list-unstyled my-4 mb-4'>
                      <li className='mb-3'><Typography.Text >Name:</Typography.Text > <Typography.Text className='ms-1 text-capitalize'>{state?.firstname ? `${state?.firstname} ${state?.lastname}` : 'N/A'}</Typography.Text ></li>
                      <li className='mb-3'><Typography.Text >Company Name:</Typography.Text > <Typography.Text className='ms-1'>{state?.company_name || "N/A"}</Typography.Text ></li>
                      <li className='mb-3'><Typography.Text >Email:</Typography.Text > <Typography.Text className='ms-1'>{state?.email || "N/A"}</Typography.Text ></li>
                      <li className='mb-3'><Typography.Text >Phone no:</Typography.Text > <Typography.Text className='ms-10'>
                        {/* {state?.mobile ? `+${String(state?.country_code).replace("+", "")} ${state?.mobile}` : 'N/A'} */}
                        {state?.mobile || "N/A"}
                      </Typography.Text ></li>
                      <li className='mb-3'><Typography.Text >Position:</Typography.Text > <Typography.Text className='ms-1'>{state?.position || "N/A"}</Typography.Text ></li>
                      <li className='mb-3'><Typography.Text >Home City:</Typography.Text > <Typography.Text className='ms-1'>{state?.home_city || "N/A"}</Typography.Text ></li>
                      {/* <li className='d-flex'>
                        <Typography.Text className='text-nowrap'>Roles:</Typography.Text >
                        <Typography>
                          <Space size={[0, 8]} wrap className='ms-1'>
                            {state?.roles?.map((resRole: any) =>
                              <Tag key={resRole} color={(EmployeeRoles.find((resJson) => resJson.rol === resRole))?.color} >
                                {(EmployeeRoles.find((resJson) => resJson.rol === resRole))?.name}
                              </Tag>
                            )}
                          </Space>
                        </Typography>
                      </li> */}
                    </ul>
                    {/* Button  */}
                    <div className='card-listing-button d-inline-flex flex-wrap gap-3 w-100'>
                      <Link href={`/admin/member/add?${state?.uid}&edit`} className='text-decoration-none text-white flex-grow-1'>
                        <Button size='large' type="primary" htmlType='button' className='w-100 primaryBtn'>
                          Edit
                        </Button>
                      </Link>
                      <Popconfirm
                        title={`${state?.is_activate ? 'Activate' : 'Deactivate'} the club member`}
                        // onConfirm={activeDeactive(id)}
                        onConfirm={(e: any) => activeDeactive(id)}
                        description={`Are you sure to ${state?.is_activate ? 'Activate' : 'Deactivate'} this club member?`}
                        okText={state?.is_activate ? 'Activate' : 'Deactivate'}
                        cancelText="No"
                        okButtonProps={{ type: 'primary', danger: true }}
                      >
                        <Button size='large' type="primary" htmlType='button' className='flex-grow-1 activateBtn' ghost>   {state?.is_activate ? 'Deactivate' : 'Activate'}</Button>
                      </Popconfirm>
                      {/* <Popconfirm
                        title="Reset password the club member"
                        // onConfirm={deleteStaffById}archive
                        onConfirm={(res: any) => onFinish}
                        description="Are you sure to reset password this club member?"
                        okText="Reset it!"
                        cancelText="No"
                        okButtonProps={{ type: 'primary', danger: true }}
                      > */}
                        <Button size='large' type="primary" htmlType='button' className='flex-grow-1 w-100 primaryBtn' loading={loading}  onClick={onFinish}>Reset Password</Button>
                      {/* </Popconfirm> */}
                      <Popconfirm
                        title="Archive the club member"
                        // onConfirm={deleteStaffById}
                        onConfirm={(e: any) => archive(id)}
                        description="Are you sure to archive this club member?"
                        okText="Archive it!"
                        cancelText="No"
                        okButtonProps={{ type: 'primary', danger: true }}
                      >
                        <Button size='large' type="primary" htmlType='button' className='flex-grow-1 w-100 archiveBtn' danger>Archive</Button>
                      </Popconfirm>
                    </div>
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
