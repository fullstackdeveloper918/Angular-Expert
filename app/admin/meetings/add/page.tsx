"use client"
import { Breadcrumb, Form, Select, Input, Upload, Modal, message, Typography, SelectProps, DatePickerProps, DatePicker } from 'antd';
import { Head } from 'next/document';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { Fragment, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import validation from '@/utils/validation';
import MainLayout from '@/app/layouts/page';
import utc from 'dayjs/plugin/utc';
// import utc from "dayjs"
import EmployeeRoles from '@/utils/EmployeeRoles.json'
import dayjs from "dayjs"
import { addMeeting, searchAreasByName } from '@/utils/fakeApi';
const { Row, Col, Card, Button } = {
    Button: dynamic(() => import("antd").then(module => module.Button), { ssr: false }),
    Row: dynamic(() => import("antd").then(module => module.Row), { ssr: false }),
    Col: dynamic(() => import("antd").then(module => module.Col), { ssr: false }),
    Card: dynamic(() => import("antd").then(module => module.Card), { ssr: false }),
}
const { Option } = Select;
dayjs.extend(utc);
const page = ({ onAdd }: any) => {
    // const defaultValue = dayjs('2024-01-01');

    const router = useRouter()
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [meetingType, setMeetingType] = useState<any>('');
    const onChange: DatePickerProps['onChange'] = (_, dateStr) => {
        console.log('onChange:', dateStr);
    };

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
    const handleChange = (value: any) => {
        setMeetingType(value);
    };
    console.log(meetingType, "meetingType");

    const onSubmit = async (values: any) => {
        let items = {
            meeting_name: values?.meeting,
            // "purpose": "Present new project proposal to client.",
            meeting_type: values?.type,
            start_time: dayjs(values?.start_time).utc().valueOf(),
            end_time: dayjs(values?.end_time).utc().valueOf(),
            year: dayjs(values?.year).format("YYYY"),
            location: values?.location,
            hotel: values?.hotel,
            airport: values?.airport,
            host_company: values?.host_company,
            host: values?.host,
            cell: values?.cell,
            weather: values?.weather,
            comments: values?.comments,
            notes: values?.notes
        }
        console.log(items, "chhhchh");

        const timestamp = 1720782277333;

        // Convert timestamp to date
        const date = dayjs(timestamp);


        console.log(date.utc().format('YYYY-MM-DD HH:mm:ss [UTC]'), "asdfasdffasd");
        // console.log(dayjs.extend(values?.start_time),"gkghjkghjk");

        try {
            let res = await addMeeting(items as any);
            console.log(res, "gggggg");

            onAdd();
        } catch (error) {
            console.log(error);

        }
    }


    const [searchResults, setSearchResults] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = async (value: string) => {
        setSearchValue(value.trim()); // Trim input value
        if (value.trim() !== '') {
            try {
                const data: any = await searchAreasByName(value);
                setSearchResults(data);
            } catch (error) {
                console.error('Error fetching areas:', error);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]); // Clear results if search value is empty
        }
    };
    console.log(searchResults, "yyy");


    return (
        <MainLayout>
            <Fragment>

                <section>
                    <Row justify="center" gutter={[20, 20]} className='heightCenter'>
                        <Col sm={22} md={20} lg={16} xl={14} xxl={12}>
                            <Card className='common-card'>
                                <div className='mb-4'>
                                    <Breadcrumb separator=">">
                                        <Breadcrumb.Item><Link href="/" className='text-decoration-none'>Home</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item><Link href="/admin/meetings" className='text-decoration-none'>Meetings</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item className='text-decoration-none'>Add Meeting</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                                {/* Title  */}
                                <div className='mb-4'>
                                    <Typography.Title level={3} className='m-0 fw-bold'>Add Meeting</Typography.Title>
                                </div>

                                {/* form  */}
                                <div className='card-form-wrapper'>
                                    <Form form={form} name="add_staff" className="add-staff-form" scrollToFirstError layout='vertical' onFinish={onSubmit}>

                                        <div className='row mt-4 selectPaddingBox'>

                                            {/* First Name  */}
                                            <Form.Item name="meeting" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Meeting Agenda' }]} label="Meeting Agenda">
                                                <Input size={'large'} placeholder="Meeting Agenda"
                                                    onKeyPress={(e: any) => {
                                                        if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                            e.preventDefault();
                                                        } else {
                                                            e.target.value = String(e.target.value).trim()
                                                        }
                                                    }}
                                                />
                                            </Form.Item>
                                            <Form.Item name="type" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Meeting Type' }]} label="Meeting Type">
                                                <Select
                                                    size={'large'}
                                                    placeholder="Select Meeting Type"
                                                    onChange={handleChange}
                                                >
                                                    <Option value="fall">Fall</Option>
                                                    <Option value="spring">Spring</Option>
                                                </Select>
                                            </Form.Item>
                                            {/* Last Name  */}


                                            {/* Email  */}
                                            <Form.Item name="start" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Start Meeting' }]} label="Start Meeting">
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    // defaultValue={defaultValue}
                                                    showTime
                                                    // locale={buddhistLocale}
                                                    onChange={onChange}
                                                />
                                            </Form.Item>
                                            <Form.Item name="end" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter End Meeting' }]} label="End Meeting">
                                                <DatePicker
                                                    // defaultValue={defaultValue}
                                                    style={{ width: '100%' }}
                                                    showTime
                                                    // locale={buddhistLocale}
                                                    onChange={onChange}
                                                />
                                            </Form.Item>
                                            <Form.Item name="year" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Year' }]} label="End Year">
                                                <DatePicker onChange={onChange} style={{ width: '100%' }} picker="year" />
                                            </Form.Item>
                                            <Form.Item name="location" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Location' }]} label="Location">
                                                <Input size={'large'} placeholder="Location"
                                                    onKeyPress={(e: any) => {
                                                        if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                            e.preventDefault();
                                                        } else {
                                                            e.target.value = String(e.target.value).trim()
                                                        }
                                                    }}
                                                />
                                            </Form.Item>
                                            <Form.Item className='col-lg-6 col-sm-12' name="hotel" rules={[{ required: true, whitespace: true, message: 'Please Enter Hotel' }]} label="Hotel">
                                                <Input size={'large'} placeholder="Hotel"
                                                    onKeyPress={(e: any) => {
                                                        if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                            e.preventDefault();
                                                        } else {
                                                            e.target.value = String(e.target.value).trim()
                                                        }
                                                    }}
                                                />
                                            </Form.Item>
                                            <Form.Item name="airport " className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Nearest Airport' }]} label="Nearest Airport">
                                                <Input size={'large'} placeholder="Nearest Airport"
                                                    onKeyPress={(e: any) => {
                                                        if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                            e.preventDefault();
                                                        } else {
                                                            e.target.value = String(e.target.value).trim()
                                                        }
                                                    }}
                                                />
                                            </Form.Item>
                                            <Form.Item name="host_company" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Host Company' }]} label="Host Company">
                                                <Input size={'large'} placeholder="Host Company"
                                                    onKeyPress={(e: any) => {
                                                        if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                            e.preventDefault();
                                                        } else {
                                                            e.target.value = String(e.target.value).trim()
                                                        }
                                                    }}
                                                />
                                            </Form.Item>
                                            <Form.Item name="host" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Host' }]} label="Host">
                                                <Input size={'large'} placeholder="Host"
                                                    onKeyPress={(e: any) => {
                                                        if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                            e.preventDefault();
                                                        } else {
                                                            e.target.value = String(e.target.value).trim()
                                                        }
                                                    }}
                                                />
                                            </Form.Item>
                                            <Form.Item name="cell" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Cell' }]} label="Cell">
                                                <Input size={'large'} placeholder="Cell"
                                                    onKeyPress={(e: any) => {
                                                        if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                            e.preventDefault();
                                                        } else {
                                                            e.target.value = String(e.target.value).trim()
                                                        }
                                                    }}
                                                />
                                            </Form.Item>
                                            <Form.Item name="weather" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Weather' }]} label="Weather">
                                                <Input size={'large'} placeholder="Weather"
                                                    onKeyPress={(e: any) => {
                                                        if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                            e.preventDefault();
                                                        } else {
                                                            e.target.value = String(e.target.value).trim()
                                                        }
                                                    }}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                name="club_member"
                                                className="col-lg-6 col-sm-12"
                                                validateTrigger={['onChange', 'onBlur']}
                                                rules={[
                                                    { required: true, message: 'Please Select Club Member' },
                                                ]}
                                                label="Club Member"
                                            >
                                                <Select
                                                    mode="multiple"
                                                    size="large"
                                                    placeholder="Select Club Members"
                                                    onSearch={handleSearch}
                                                    optionLabelProp="label"
                                                    defaultActiveFirstOption  // Ensure first option is active on dropdown open
                                                    value={searchValue} // Control the value with searchValue state
                                                    key={searchResults.length}
                                                >
                                                    {searchResults.map((area: any) => (
                                                        <Option key={area.id} value={area.id} label={area.name}>
                                                            {area.name} - {area.company}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item name="mobile_no" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Mobile Number' }]} label="Mobile Number">
                                                <Input 
                                             
                                                    size={'large'} placeholder="Mobile Number"
                                                    onKeyPress={(e: any) => {
                                                        if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                            e.preventDefault();
                                                        } else {
                                                            e.target.value = String(e.target.value).trim()
                                                        }
                                                    }}
                                                />
                                             {/* <Select
                                                    mode="multiple"
                                                    size="large"
                                                    // placeholder="Select Club Members"
                                                    onSearch={handleSearch}
                                                    optionLabelProp="label"
                                                    defaultActiveFirstOption  // Ensure first option is active on dropdown open
                                                    value={searchValue} // Control the value with searchValue state
                                                    key={searchResults.length}
                                                >
                                                    {searchResults.map((area: any) => (
                                                        <Option key={area.id} value={area.id} label={area.name}>
                                                            {area.phone} 
                                                        </Option>
                                                    ))}
                                                </Select> */}
                                            </Form.Item>
                                            <Form.Item name="comments" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Comment' }]} label="Comment">
                                                <Input.TextArea size={'large'} placeholder="Comment"
                                                    onKeyPress={(e: any) => {
                                                        if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                            e.preventDefault();
                                                        } else {
                                                            e.target.value = String(e.target.value).trim()
                                                        }
                                                    }}
                                                />
                                            </Form.Item>
                                            <Form.Item name="notes" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Note' }]} label="Note">
                                                <Input.TextArea size={'large'} placeholder="Note"
                                                    onKeyPress={(e: any) => {
                                                        if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                            e.preventDefault();
                                                        } else {
                                                            e.target.value = String(e.target.value).trim()
                                                        }
                                                    }}
                                                />
                                            </Form.Item>
                                        </div>
                                        {/* Button  */}
                                        <Button size={'large'} type="primary" htmlType="submit" className="login-form-button w-100" loading={loading}>
                                            Add Meeting
                                        </Button>
                                    </Form>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                </section>
            </Fragment >
        </MainLayout>
    )
}

export default page