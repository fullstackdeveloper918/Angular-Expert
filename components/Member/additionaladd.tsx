"use client";
import { Button, Card, Col, Divider, Form, Input, Row, Select, Typography } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import MainLayout from "../../components/Layout/layout";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { destroyCookie } from "nookies";
import { MinusCircleOutlined } from "@ant-design/icons";
import AdditionalRoles from "../../utils/AdditionalRoles.json"
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
 
    
    let type = (entries?.length > 1 && entries[1]?.length > 0) ? entries[1][0] : '';
   
    const [fieldList, setFieldList] = useState([{ id: Date.now() }]);
    const [isAddMoreDisabled, setIsAddMoreDisabled] = useState(true);
    const [selectedRoles, setSelectedRoles] = useState<any>([]); // Track selected roles
    const [allFieldsFilled, setAllFieldsFilled] = useState<any>(false);
    const handleChange = (value: any) => {
        setCompanyType(value);
    };

    const addFieldSet = () => {
        form.validateFields().then(() => {
            const newFieldId = Date.now();
            setFieldList([...fieldList, { id: newFieldId }]);
            const currentFields = form.getFieldsValue();
            const newSelectedRoles = Object.values(currentFields)
                .filter((_, index) => index % 5 === 4)
                .flat();
            setSelectedRoles([...selectedRoles, ...newSelectedRoles]);
            saveDataToLocalStorage(newFieldId, currentFields);
        });
    };

    const removeFieldSet = (id: any) => {
        setFieldList(fieldList.filter((field) => field.id !== id));
    };

    const saveDataToLocalStorage = (id: any, currentFields: any) => {
        const dataToStore = fieldList.map((field) => ({
            id: field.id,
            firstname: currentFields[`firstname_${field.id}`],
            lastname: currentFields[`lastname_${field.id}`],
            email: currentFields[`email_${field.id}`],
            password: currentFields[`password_${field.id}`],
            template_access: currentFields[`roles_${field.id}`] || [],
        }));

        localStorage.setItem("formData", JSON.stringify(dataToStore));
    };
    const onFieldsChange = () => {
        const currentFields = form.getFieldsValue();
        const areAllFieldsFilled = fieldList.every((field) => {
            return (
                currentFields[`firstname_${field.id}`] &&
                currentFields[`lastname_${field.id}`] &&
                currentFields[`email_${field.id}`] &&
                currentFields[`password_${field.id}`] &&
                currentFields[`roles_${field.id}`]?.length > 0
            );
        });
        setAllFieldsFilled(areAllFieldsFilled);
    };



    const onFinish = async (values: any) => {
        // country_code: values.country_code ?? "+93",
        const formattedData = fieldList.map((field, index) => ({
            firstname: values[`firstname_${field.id}`],
            lastname: values[`lastname_${field.id}`],
            email: values[`email_${field.id}`],
            password: values[`password_${field.id}`],
            template_access: values[`roles_${field.id}`] || [],
        })) as any;
      

        localStorage.setItem('formData', JSON.stringify(formattedData));
      

        let item = {
            parent_user_id: value,
            additionalUsers: formattedData
        }
       

        try {

            setLoading(true)
            if(type){

                let res = await api.User.edit_additional_user(item)
                toast.success(res?.data?.message)
                if (res?.data?.status == 500) {
                    // destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
    
                    // // }
                    // // dispatch(clearUserData({}));
                    // toast.error("Session Expired Login Again")
                    // router.replace("/auth/signin")
                    localStorage.setItem('redirectAfterLogin', window.location.pathname);
                    destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                    // dispatch(clearUserData({}));
                    toast.error("Session Expired. Login Again");
                    router.replace("/auth/signin");
                }
                if(res) {
                    router.back()
                }
            }else{
                let res = await api.User.add_additional_user(item)
                toast.success(res?.data?.message)
                if (res?.data?.status == 500) {
                    localStorage.setItem('redirectAfterLogin', window.location.pathname);
                    destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                    // dispatch(clearUserData({}));
                    toast.error("Session Expired. Login Again");
                    router.replace("/auth/signin");
                }
                if(res) {
                    router.back()
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

    // form.setFieldsValue(res);
    const submit = () => {
        router.push("/admin/member/add/page2")
    }
    return (
        <MainLayout>
            <Fragment>

                <section className="club_member">

                    <Row justify="center" gutter={[20, 20]} className='heightCenter'>
                        <Col xs={24} sm={22} md={20} lg={16} xl={14} xxl={12}>
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
                                    <Form form={form} name="add_staff" className="add-staff-form" onFieldsChange={onFieldsChange} scrollToFirstError layout='vertical' onFinish={onFinish}>

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
                                                <Form.Item name={`roles_${field.id}`} label="Permissions" rules={[{ required: true, message: 'Please Select Permissions' }]}>
                                                    <Select
                                                        mode="tags"
                                                        size={'large'}

                                                        placeholder="Please select"
                                                        style={{ width: '100%' }}
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
                                                <div   style={{ position: 'absolute', top: '-20px', right: '0', fontSize: '24px', cursor: 'pointer', textAlign: 'end', }}
                                                    onClick={() => removeFieldSet(field.id)}>
                                                <MinusCircleOutlined/>
                                                </div>
                                            </div>
                                        ))}
                                        <Button type="dashed" onClick={addFieldSet} className='col-lg-12 mt-4 mb-3' disabled={!allFieldsFilled}>
                                            Add More Fields
                                        </Button>
                                        {/* <Divider /> */}
                                        {/* Button  */}
                                        <div className="d-flex gap-3 justify-content-end">
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
