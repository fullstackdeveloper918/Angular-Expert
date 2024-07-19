"use client";
import { Button, Card, Col, Form, Row, Typography } from "antd";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useCallback, useState } from "react";
import MainLayout from "../../components/Layout/layout";
import TextArea from "antd/es/input/TextArea";
import api from "@/utils/api";
// const { Row, Col, Card, Button } = {
//   Button: dynamic(() => import("antd").then((module) => module.Button), {
//     ssr: false,
//   }),
//   Row: dynamic(() => import("antd").then((module) => module.Row), {
//     ssr: false,
//   }),
//   Col: dynamic(() => import("antd").then((module) => module.Col), {
//     ssr: false,
//   }),
//   Card: dynamic(() => import("antd").then((module) => module.Card), {
//     ssr: false,
//   }),
// };
const Page6 = () => {
 
  const router = useRouter()
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)

  console.log(form, "form");

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
  const searchParams = useSearchParams();
  const entries = Array.from(searchParams.entries());
  const value = entries.length > 0 ? entries[0][0] : '';
  const type = entries.length > 1 ? entries[1][0] : '';
  const submit = async(values:any) => {
      let items={
          fall_meeting_review:{
              userId:value,
              fall_meeting:values?.fall_meeting,
              personal_finances:values?.personal_finances,
          }
      }
      try {
          if (type == "edit") {
              let items = {
                  fall_meeting_review:{
                      userId:value,
                      fall_meeting:values?.fall_meeting,
                      personal_finances:values?.personal_finances,
                  }
          } as any
          setLoading(true)
          let res = await api.User.edit(items)
              console.log(res,"yyyy");
              router.push(`/admin/member/add/page7?${value}&edit`)
          }else{

              setLoading(true)
              let res =await api.Auth.signUp(items)
              console.log(res,"qqqq");
              
              router.push(`/admin/member/add/page7?${res?.userId}`)
          }
      } catch (error) {
          console.log(error);
          
      }finally{
          setLoading(false)
      }
  }
  const [state, setState] = useState<any>("")
  const getDataById = async () => {
      // console.log(id);
      const item = {
        user_id: value
      }
      try {
        const res = await api.User.getById(item as any);
        console.log(res, "ressssss");
        setState(res?.data || null);
        form.setFieldsValue(res?.data)
      } catch (error: any) {
        alert(error.message);
      }
    };
    React.useEffect(() => {
      // if (id) {
      getDataById();
      // }
    }, []);
    const onPrevious=()=>{
      router.back()
    }
  return (
    <MainLayout>
            <Fragment>

                <section>
                    <Row justify="center" gutter={[24, 24]}>
                        <Col sm={22} md={24} lg={11} xl={10} xxl={9}>
                            <Card className='common-card'>
                                {/* <div className='mb-4'>
                                    <Breadcrumb separator=">">
                                        <Breadcrumb.Item><Link href="/" className='text-decoration-none'>Home</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item><Link href="/admin/member" className='text-decoration-none'>User</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/member/add" className='text-decoration-none'>Add User</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/member/add/page2" className='text-decoration-none'>BUSINESS UPDATE</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/member/add/page3" className='text-decoration-none'>GOALS</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/member/add/page4" className='text-decoration-none'>CRAFTSMEN TOOLBOX</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/member/add/page5" className='text-decoration-none'>CRAFTSMEN CHECK-UP</Link></Breadcrumb.Item>
                                    </Breadcrumb>
                                </div> */}
                                {/* Title  */}
                                <div className='mb-2 d-flex justify-content-between'>
                                    <Typography.Title level={3} className='m-0 fw-bold'>SPRING 2024 MEETING REVIEW</Typography.Title>
                                    <Button size={'large'} type="primary" className="text-white" disabled>6/8</Button>
                                </div>

                                {/* form  */}
                                <div className='card-form-wrapper'>
                                    <Form form={form} name="add_staff" className="add-staff-form" scrollToFirstError layout='vertical' onFinish={submit}>



                                        {/* First Name  */}
                                        <Form.Item name="fall_meeting" rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]} label="What was your most valuable take away from our fall meeting?">
                                            <TextArea size={'large'} placeholder="Enter..."
                                                onKeyPress={(e: any) => {
                                                    if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                        e.preventDefault();
                                                    } else {
                                                        e.target.value = String(e.target.value).trim()
                                                    }
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item name="personal_finances" rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]} label="Have you implemented any recommendations from Bart Smith’s financial analysis &/or Fred Reikowsky’s project management skills?">
                                            <TextArea size={'large'} placeholder="Enter..."
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
                                        <div className="d-flex gap-3 justify-content-center">
                                        <Button size={'large'} type="primary" className="login-form-button " loading={loading} onClick={onPrevious}>
                                            Previous
                                        </Button>
                                        <Button size={'large'} type="primary" htmlType="submit" className="login-form-button " loading={loading}>
                                            Next
                                        </Button>
                                        </div>
                                    </Form>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                </section>
            </Fragment >
        </MainLayout>
  );
};

export default Page6;
