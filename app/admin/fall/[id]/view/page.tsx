"use client"
import dynamic from 'next/dynamic';
import EmployeeRoles from '@/utils/EmployeeRoles.json'
import Link from 'next/link';
import User from "../../../../assests/images/placeholder.png"
import { Avatar, Breadcrumb, Divider, Spin, Tag, Typography, theme } from 'antd';
import React, { Fragment, ReactNode, useEffect, useState } from 'react'
// import Head from 'next/head';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import MainLayout from '@/app/layouts/page';
import { fetchMeeting, fetchMeetingById } from '@/utils/fakeApi';
import dayjs from "dayjs"
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

  const [meeting, setMeeting] = useState<any>({

    end_time: "",
    id: 1,
    location: "",
    meeting_name: "",
    organizer: "",
    purpose: "",
    start_time: ""

  });
  let meetingId: any = '1'
  const searchParam = useParams();
  console.log(searchParam, "cheee");

  const id: any = searchParam.id;
  // const searchParams = useSearchParams();
  // const fall = searchParams.get('fall');
  // console.log(fall,"fallccc");

  const getDataById = async (id: string) => {
    console.log(id);
    try {
      const res = await fetchMeetingById(Number(id));
      console.log(res, "Fetched Meeting");
      setMeeting(res || null);
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (id) {
      getDataById(id);
    }
  }, [id]);
  useEffect(() => {
    fetchMeeting().then((data) => {
      console.log(data);

      // setAreas(data);
    });
  }, []);
  console.log(meeting, "hghghgh");

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
                      {/* <Breadcrumb.Item><Link href="/staff/page/1" className='text-decoration-none'>User's</Link></Breadcrumb.Item> */}
                      <Breadcrumb.Item className='text-decoration-none'>Meeting Details</Breadcrumb.Item>
                    </Breadcrumb>
                  </div>
                  {/* Title  */}
                  <div>
                    <Typography.Title level={3} className='m-0 fw-bold'>Meeting Details</Typography.Title>
                  </div>
                  {/* Car Listing  */}
                  <div className='card-listing'>
                    {/* <div className='card-listing-image my-4 text-center'>
                  <Avatar size={120} src={User.src}>{state?.firstname?.charAt(0)?.toUpperCase()}</Avatar>
                </div>
                <Divider plain></Divider> */}

                    {/* Detail  */}
                    <ul className='list-unstyled my-4 mb-4'>
                      <li className='mb-3'><Typography.Text >Loaction:</Typography.Text > <Typography.Text className='ms-1 text-capitalize'>{meeting?.location || "N/A"}</Typography.Text ></li>
                      <li className='mb-3'><Typography.Text >Meeting Dates:</Typography.Text > <Typography.Text className='ms-1'>{dayjs(meeting?.start_time).format('h A DD-MM-YYYY')}</Typography.Text ></li>
                      <li className='mb-3'><Typography.Text >Hotel:</Typography.Text > <Typography.Text className='ms-1'>{meeting?.hotel || "Abc"}</Typography.Text ></li>
                      <li className='mb-3'><Typography.Text >Nearest Airport</Typography.Text > <Typography.Text className='ms-10'>
                        {meeting?.airport || "Airport"}
                      </Typography.Text ></li>
                      <li className='mb-3'><Typography.Text >Host Company:</Typography.Text > <Typography.Text className='ms-1'>{meeting?.host_company || "XYZ"}</Typography.Text ></li>
                      <li className='mb-3'><Typography.Text >Host:</Typography.Text > <Typography.Text className='ms-1'>{meeting?.host || "Qwerty"}</Typography.Text ></li>
                      <li className='mb-3'><Typography.Text >Cell:</Typography.Text > <Typography.Text className='ms-1'>{meeting?.cell || "Cell name"}</Typography.Text ></li>
                      <li className='mb-3'><Typography.Text >Weather:</Typography.Text > <Typography.Text className='ms-1'>{meeting?.weather || "10°C"}</Typography.Text ></li>

                    </ul>
                    {/* Button  */}
                    <div className='card-listing-button d-inline-flex flex-wrap gap-3 w-100'>
                      {/* <Link href={`/admin/users/view/edit`} className='text-decoration-none text-white flex-grow-1'>
                    <Button size='large' type="primary" htmlType='button' className='w-100'>
                      Edit
                    </Button>
                  </Link> */}

                      <Link href={`/admin/meetings/${meeting?.id}/edit`} className='text-decoration-none text-white flex-grow-1'>
                        <Button size='large' type="primary" htmlType='button' className='flex-grow-1 w-100' >Update</Button>
                      </Link>
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
