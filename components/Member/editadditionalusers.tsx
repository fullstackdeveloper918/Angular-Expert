"use client";
import { Breadcrumb, Button, Card, Col, Divider, Form, Input, Row, Select, Typography } from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import MainLayout from "../../components/Layout/layout";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { destroyCookie } from "nookies";
import { MinusCircleOutlined } from "@ant-design/icons";
import AdditionalRoles from "../../utils/AdditionalRoles.json"
import { capFirst } from "@/utils/validation";
import Link from "next/link";
const { Option } = Select;
const Edititionaladd = () => {

    const router = useRouter()
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [state, setState] = useState<any>("")
    const searchParams = useSearchParams();
    const entries = Array.from(searchParams.entries());
    const [companyType, setCompanyType] = useState<any>('');
    const searchParam = useParams();
    const id: any = searchParam.id;
    const value = entries.length > 0 ? entries[0][0] : '';
   
    
    let type = (entries?.length > 1 && entries[1]?.length > 0) ? entries[1][0] : '';
   
    const [selectedRoles, setSelectedRoles] = useState<any>([]); // Track selected roles




    const onFinish = async (values: any) => {
    
        let item = {
            additional_user_id: id,
            firstname: values?.firstname,
            lastname: values?.lastname,
            template_access : values?.template_access,
        }
        try {
            setLoading(true)
                let res = await api.User.edit_additional_user(item)
                toast.success(res?.message)
                router?.back()
                if (res?.status == 400) {
                    destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                    localStorage.removeItem('hasReloaded');
                    toast.error("Session Expired Login Again")
                    router.replace("/auth/signin")
                }
        } catch (error: any) {
            setLoading(false)
            if (error) {
                if (error?.status === 409) {
                    toast.error("The email address is already in use by another account.");
                }
            }
          

        } finally {
          
        }
    };
    const getDataById = async () => {
        const item = {
            additional_user_id: id
        }
        try {
            const res = await api.User.getAdditionalId(item as any);
        
            
            setState(res || null);
            form.setFieldsValue(res?.data)
            if (res?.data?.status == 400) {
                toast.error("Session Expired Login Again")
                router.replace("/auth/signin")
            }
        } catch (error: any) {
            alert(error.message);
        }}
    useEffect(() => {
            getDataById();
    }, []);
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
                                <div className='mb-4'>
                <Breadcrumb separator=">">
                  <Breadcrumb.Item><Link href="/admin/dashboard" className='text-decoration-none'>Home</Link></Breadcrumb.Item>
                  <Breadcrumb.Item><Link href="/admin/additional_users" className='text-decoration-none'>Additonal Members</Link></Breadcrumb.Item>
                  <Breadcrumb.Item className='text-decoration-none'>Update {capFirst(state?.data?.firstname)} {capFirst(state?.data?.lastname)} User</Breadcrumb.Item>
                </Breadcrumb>
              </div>
                                {/* Title  */}
                                <div className='d-flex justify-content-between'>

                                    <Typography.Title level={3} className='m-0 fw-bold'> Update {capFirst(state?.data?.firstname)} {capFirst(state?.data?.lastname)} User</Typography.Title>
                                    {/* <Button size={'large'} type="primary" className="text-white" disabled>1/8</Button> */}
                                </div>

                                {/* form  */}
                                <div className='card-form-wrapper'>
                                    <Form form={form} name="add_staff" className="add-staff-form" scrollToFirstError layout='vertical' onFinish={onFinish}>

                                    

                                            <div  className='row mt-4' style={{ position: 'relative' }}>

                                                <Form.Item
                                                    name={`firstname`}
                                                    className='col-lg-6 col-sm-12'
                                                    // rules={[{ required: true, whitespace: true, message: 'Please Enter First Name' }]}
                                                    label={`First Name`}
                                                // label={`First Name ${index + 1}`}
                                                >
                                                    <Input size='large' placeholder="First Name" />
                                                </Form.Item>
                                                <Form.Item
                                                    name={`lastname`}
                                                    className='col-lg-6 col-sm-12'
                                                    // rules={[{ required: true, whitespace: true, message: 'Please Enter Last Name' }]}
                                                    label={`Last Name`}
                                                // label={`Last Name ${index + 1}`}
                                                >
                                                    <Input size='large' placeholder="Last Name" />
                                                </Form.Item>
                                                <Form.Item
                                                    name={`email`}
                                                    className='col-lg-6 col-sm-12'
                                                    // rules={[{ required: true, message: 'Please Enter Email' }]}
                                                    label={`Email`}
                                                // label={`Email ${index + 1}`}
                                                >
                                                    <Input size='large' type='email' placeholder="Email" disabled/>
                                                </Form.Item>
                                                {/* <Form.Item
                                                    name={`password`}
                                                    className='col-lg-6 col-sm-12'
                                                    // rules={[{ required: true, message: 'Please Enter Password!' }]}
                                                    label={`Password`}
                                                // label={`Password ${index + 1}`}
                                                >
                                                    <Input.Password size='large' type="password" placeholder="Password" />
                                                </Form.Item> */}
                                                <Form.Item name={`template_access`} label="Permissions"   className='col-lg-6 col-sm-12'
                                                 rules={[{ required: true, message: 'Please Select Permissions' }]}>
                                                    <Select
                                                        mode="tags"
                                                        size={'large'}

                                                        placeholder="Please select"
                                                        // style={{ width: '100%' }}
                                                        // onChange={(value) => validateFirstFieldSet(value, field.id)}
                                                        options={AdditionalRoles.filter(
                                                            (role) => !selectedRoles.includes(role.rol)
                                                        ).map((res) => ({
                                                            value: res.rol,
                                                            label: res.name,
                                                        }))}
                                                    />
                                                </Form.Item>
                                                {/* <Button  onClick={() => removeFieldSet(field.id)} className='col-lg-12'>
                                                    Remove
                                                </Button> */}
                                            </div>
                                                    
                                        {/* <Divider /> */}
                                        {/* Button  */}
                                        <div className="d-flex gap-3 justify-content-center">
                                            {/* <Button size={'large'} type="primary" onClick={onPrevious} className="" >
                        Save
                      </Button> */}
                                            <Button size={'large'} type="primary" htmlType="submit" className="login-form-button " loading={loading}>
                                                Update
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

export default Edititionaladd;
