"use client";
import { Button, Card, Col, Form, Input, Row, Select, Typography } from "antd";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import MainLayout from "../../components/Layout/layout";
import api from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import { destroyCookie } from "nookies";
import { MinusCircleOutlined } from "@ant-design/icons";
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
const Additionaladd = () => {

    const router = useRouter()
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [state, setState] = useState<any>("")
    const searchParams = useSearchParams();
    const entries = Array.from(searchParams.entries());
    const [companyType, setCompanyType] = useState<any>('');
    const value = entries.length > 0 ? entries[0][0] : '';
    const type = entries.length > 0 ? entries[1][0] : '';
    const handleChange = (value: any) => {
        setCompanyType(value);
    };

    const [fieldList, setFieldList] = useState([{ id: Date.now() }]);

    const addFieldSet = () => {
        setFieldList([...fieldList, { id: Date.now() }]);
    };

    const removeFieldSet = (id: any) => {
        setFieldList(fieldList.filter(field => field.id !== id));
    };

    const onFinish = async (values: any) => {
        // country_code: values.country_code ?? "+93",
        const formattedData = fieldList.map((field, index) => ({
            firstname: values[`firstname_${field.id}`],
            lastname: values[`lastname_${field.id}`],
            email: values[`email_${field.id}`],
            password: values[`password_${field.id}`]
          })) as any;
console.log(formattedData,"formattedData");

        try {
            setLoading(true)
           

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
                                {/* <div className='mb-4'>
                <Breadcrumb separator=">">
                  <Breadcrumb.Item><Link href="/" className='text-decoration-none'>Home</Link></Breadcrumb.Item>
                  <Breadcrumb.Item><Link href="/admin/member" className='text-decoration-none'>Club Members</Link></Breadcrumb.Item>
                  <Breadcrumb.Item className='text-decoration-none'>Add Club Member</Breadcrumb.Item>
                </Breadcrumb>
              </div> */}
                                {/* Title  */}
                                <div className='d-flex justify-content-between'>

                                    <Typography.Title level={3} className='m-0 fw-bold'> Additional Member</Typography.Title>
                                    {/* <Button size={'large'} type="primary" className="text-white" disabled>1/8</Button> */}
                                </div>

                                {/* form  */}
                                <div className='card-form-wrapper'>
                                    <Form form={form} name="add_staff" className="add-staff-form" scrollToFirstError layout='vertical' onFinish={onFinish}>

                                        {/* First Name  */}
                                        {fieldList.map((field, index) => (

                                            <div key={field.id} className='row mt-4' style={{ position: 'relative' }}>
                                              
                                                <Form.Item
                                                    name={`firstname_${field.id}`}
                                                    className='col-lg-6 col-sm-12'
                                                    // rules={[{ required: true, whitespace: true, message: 'Please Enter First Name' }]}
                                                    label={`First Name`}
                                                    // label={`First Name ${index + 1}`}
                                                >
                                                    <Input size='large' placeholder="First Name" />
                                                </Form.Item>
                                                <Form.Item
                                                    name={`lastname_${field.id}`}
                                                    className='col-lg-6 col-sm-12'
                                                    // rules={[{ required: true, whitespace: true, message: 'Please Enter Last Name' }]}
                                                    label={`Last Name`}
                                                    // label={`Last Name ${index + 1}`}
                                                >
                                                    <Input size='large' placeholder="Last Name" />
                                                </Form.Item>
                                                <Form.Item
                                                    name={`email_${field.id}`}
                                                    className='col-lg-6 col-sm-12'
                                                    // rules={[{ required: true, message: 'Please Enter Email' }]}
                                                    label={`Email`}
                                                    // label={`Email ${index + 1}`}
                                                >
                                                    <Input size='large' type='email' placeholder="Email" />
                                                </Form.Item>
                                                <Form.Item
                                                    name={`password_${field.id}`}
                                                    className='col-lg-6 col-sm-12'
                                                    // rules={[{ required: true, message: 'Please Enter Password!' }]}
                                                    label={`Password`}
                                                    // label={`Password ${index + 1}`}
                                                >
                                                    <Input.Password size='large' type="password" placeholder="Password" />
                                                </Form.Item>
                                                {/* <Button  onClick={() => removeFieldSet(field.id)} className='col-lg-12'>
                                                    Remove
                                                </Button> */}
                                                  <MinusCircleOutlined
                                                                style={{ position: 'absolute', top: '1px', left: '700px', fontSize: '24px', cursor: 'pointer' }}
                                                                onClick={() => removeFieldSet(field.id)}

                                                            />
                                            </div>
                                        ))}
                                        <Button type="dashed" onClick={addFieldSet} className='col-lg-12 mt-4 mb-3'>
                                            Add More Fields
                                        </Button>
                                        {/* Button  */}
                                        <div className="d-flex gap-3 justify-content-center">
                                            {/* <Button size={'large'} type="primary" onClick={onPrevious} className="" >
                        Save
                      </Button> */}
                                            <Button size={'large'} type="primary" htmlType="submit" className="login-form-button " loading={loading}>
                                                Save
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

export default Additionaladd;