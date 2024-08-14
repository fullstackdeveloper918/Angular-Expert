"use client";
import { Button, Card, Col, Form, Input, Row, Select, Typography } from "antd";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import MainLayout from "../../components/Layout/layout";
import api from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import { destroyCookie } from "nookies";
import { useSelector } from "react-redux";
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
const { Option } = Select;
const Add = () => {

  const router = useRouter()
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState<any>("")
  const searchParams = useSearchParams();
  const entries = Array.from(searchParams.entries());
  const [companyType, setCompanyType] = useState<any>('');
  const value = entries.length > 0 ? entries[0][0] : '';
  const type = entries.length > 0 ? entries[1][0] : '';
  const getUserdata = useSelector((state: any) => state?.user?.userData)
  const handleChange = (value: any) => {
    setCompanyType(value);
  };
  const onFinish = async (values: any) => {
    // country_code: values.country_code ?? "+93",
    let items = {
      first_step: {
        firstname: String(values.firstname).trim(),
        lastname: String(values.lastname).trim(),
        email: String(values.email).trim(),
        password: String(values.password).trim(),
        mobile: values.phone_number,
        roles: values.roles,
        company_name: values?.company_name,
        position: values?.position,
        home_city: values?.home_city,
      }
    } as any

    try {
      setLoading(true)
      if (type == "edit") {
        let items = {
          first_step: {
            userId: value,
            firstname: String(values.firstname).trim(),
            lastname: String(values.lastname).trim(),
            email: String(values.email).trim(),
            password: String(values.password).trim(),
            mobile: values.phone_number,
            roles: "",
            company_name: values?.company_name,
            position: values?.position,
            home_city: values?.home_city,
          }
        } as any
        let res = await api.User.edit(items)
        toast.success(res?.message)
        // if(res)  {
          router.push(`/admin/member/additional_user?${value}&edit`)
        // }
        // router.push(`/admin/member/add/page2?${value}&edit`)
      } else {
        let res = await api.Auth.signUp(items)
        toast.success(res?.message)
        // console.log('hello kane')
        // if(res)  {
        //   router.push('/admin/member')
        // }
        router.push(`/admin/member/additional_user?${res?.user_id}`)
        if (res?.status == 400) {
          toast.error("Session Expired Login Again")
          router.replace("/auth/signin")
        }
      }

    } catch (error: any) {

      if (error) {
        if (error?.status === 409) {
          toast.error("The email address is already in use by another account.");
        }
      }


    } finally {
      setLoading(false)
    }
  };
  const onPrevious = async (values: any) => {
    // country_code: values.country_code ?? "+93",
    let items = {
      first_step: {
        firstname: String(values.firstname).trim(),
        lastname: String(values.lastname).trim(),
        email: String(values.email).trim(),
        password: String(values.password).trim(),
        mobile: values.phone_number,
        roles: values.roles,
        company_name: values?.company_name,
        position: values?.position,
        home_city: values?.home_city,
      }
    } as any

    try {
      setLoading(true)
      if (type == "edit") {
        let items = {
          first_step: {
            userId: value,
            firstname: String(values.firstname).trim(),
            lastname: String(values.lastname).trim(),
            email: String(values.email).trim(),
            password: String(values.password).trim(),
            mobile: values.phone_number,
            roles: "",
            company_name: values?.company_name,
            position: values?.position,
            home_city: values?.home_city,
          }
        } as any
        let res = await api.User.edit(items)
        // router.push(`/admin/member/add/page2?${value}&edit`)
        if (res?.status == 400) {
          destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
          localStorage.removeItem('hasReloaded');
          toast.error("Session Expired Login Again")
          router.replace("/auth/signin")
      }
      } else {

        let res = await api.Auth.signUp(items)
        // router.push(`/admin/member/add/page2?${res?.user_id}`)
        router.push(`/admin/member/additional_user`)
        toast.success("Added Successfully")
router.back()
        if (res?.status == 400) {
          toast.error("Session Expired Login Again")
          router.replace("/auth/signin")
        }
      }

    } catch (error: any) {

      if (error?.status==400) {
        destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
        localStorage.removeItem('hasReloaded');
        toast.error("Session Expired Login Again")
        router.replace("/auth/signin")
    }


    } finally {
      setLoading(false)
    }
  };


  useEffect(() => {
    if (type == "edit") {
      const getDataById = async () => {
        const item = {
          user_id: value
        }
        try {
          const res = await api.User.getById(item as any);
          setState(res?.data || null);
          if (res?.data?.status == 400) {
            toast.error("Session Expired Login Again")
            router.replace("/auth/signin")
          }
          form.setFieldsValue(res?.data)
        } catch (error: any) {
          alert(error.message);
        }
      };
      getDataById();
    }
  }, [type, form]);
  // form.setFieldsValue(res);
  const submit = () => {
    router.push("/admin/member/add/page2")
  }
  return (
    <MainLayout>
      <Fragment>

        <section className="club_member">

          <Row justify="center" gutter={[20, 20]} className='heightCenter'>
            <Col sm={22} md={20} lg={16} xl={14} xxl={12}>
              <Card className='common-card'>
                
                <div className='d-flex justify-content-between'>

                  <Typography.Title level={3} className='m-0 fw-bold'>{type=="edit"?"Edit":"Add"} Club Member</Typography.Title>
                  {/* <Button size={'large'} type="primary" className="text-white" disabled>1/8</Button> */}
                </div>

                {/* form  */}
                <div className='card-form-wrapper'>
                  <Form form={form} name="add_staff" className="add-staff-form" scrollToFirstError layout='vertical' onFinish={onFinish}>

                    {/* First Name  */}
                    <div className='row mt-4'>
                      <Form.Item name="firstname" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter First Name' }]} label="First Name">
                        <Input size={'large'} placeholder="First Name"
                        // onKeyPress={(e: any) => {
                        //   if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                        //     e.preventDefault();
                        //   } else {
                        //     e.target.value = String(e.target.value).trim()
                        //   }
                        // }}
                        />
                      </Form.Item>
                      {/* Last Name  */}
                      <Form.Item name="lastname" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Last Name' }]} label="Last Name">
                        <Input size={'large'} placeholder="Last Name"
                        // onKeyPress={(e: any) => {
                        //   if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                        //     e.preventDefault();
                        //   } else {
                        //     e.target.value = String(e.target.value).trim()
                        //   }
                        // }}
                        />
                      </Form.Item>
                      <Form.Item name="company_name" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Company Name' }]} label="Company Name">
                        {/* <Input size={'large'} placeholder="Club Name"
                        onKeyPress={(e: any) => {
                          if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                            e.preventDefault();
                          } else {
                            e.target.value = String(e.target.value).trim()
                          }
                        }}
                      /> */}
                        <Select
                          size={'large'}
                          placeholder="Select Company Name"
                          onChange={handleChange}
                        >
                          <Option value="augusta">Augusta Homes, Inc.</Option>
                          <Option value="buffington">Buffington Homes, L.P.</Option>
                          <Option value="cabin">Cabin John Builders</Option>
                          <Option value="cataldo">Cataldo Custom Builders</Option>
                          <Option value="david_campbell">The DCB</Option>
                          <Option value="dc_building">DC Building Inc.</Option>
                          <Option value="Ddenman_construction">Denman Construction, Inc.</Option>
                          <Option value="ellis">Ellis Custom Homes</Option>
                          <Option value="tm_grady_builders">T.M. Grady Builders</Option>
                          <Option value="hardwick">Hardwick G. C.</Option>
                          <Option value="homeSource">HomeSource Construction</Option>
                          <Option value="ed_nikles">Ed Nikles Custom Builder, Inc.</Option>
                          <Option value="olsen">Olsen Custom Homes</Option>
                          <Option value="raykon">Raykon Construction</Option>
                          <Option value="matt_sitra">Matt Sitra Custom Homes</Option>
                          <Option value="schneider">Schneider Construction, LLC</Option>
                          <Option value="shaeffer">Shaeffer Hyde Construction</Option>
                          <Option value="split">Split Rock Custom Homes</Option>
                          <Option value="tiara">Tiara Sun Development</Option>
                        </Select>
                      </Form.Item>

                      <Form.Item name="phone_number" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Phone No' }]} label="Phone No">
                        <Input size={'large'} type="text" minLength={6} maxLength={20} placeholder="Phone No" onKeyPress={(event) => {
                          if (!/[0-9\s\(\)\-\+]/.test(event.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                            event.preventDefault();
                          }
                        }} />
                      </Form.Item>
                      <Form.Item name="position" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Position' }]} label="Position">
                        <Input size={'large'} type='position' placeholder="Position" />
                      </Form.Item>
                      <Form.Item name="home_city" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Home City' }]} label="Home City">
                        <Input size={'large'} type='homecity' placeholder="Home City" />
                      </Form.Item>

                      {/* Email  */}
                      <Form.Item name="email" className='col-lg-6 col-sm-12'
                      
                      rules={[{ required: true, message: 'Please Enter Email' }]}
                      
                      label="Email">
                        <Input size={'large'} type='email' placeholder="Email" />
                      </Form.Item>
                      {/* Password  */}
                      {type=="edit"?"":
                      <Form.Item name="password" className='col-lg-6 col-sm-12'
                      rules={[
                        { required: true, message: 'Please Enter Password!' },
                        {
                          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                          message: 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special characters.',
                        },
                      ]}
                       
                       label="Password">
                        <Input.Password size={'large'} type="password" placeholder="Password" />
                      </Form.Item>}




                      {/* Phone No  */}

                      {/* Roles  */}
                      {/* <Form.Item name="roles" className=' col-sm-12' label="Roles" rules={[{ required: true, message: 'Please Select Roles' }]}>
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
                    </Form.Item> */}
                    </div>
                    {/* Button  */}
                    <div className="d-flex gap-3 justify-content-center">
                      {/* <Button size={'large'} type="primary" onClick={onPrevious} className="" >
                        Save
                      </Button> */}
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

export default Add;
