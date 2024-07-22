"use client";
import {
    Breadcrumb,
    Form,
    Select,
    Input,
    Typography,
    DatePickerProps,
    DatePicker,
    Row,
    Button,
    Card,
    Col,
} from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import MainLayout from "../../components/Layout/layout";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import api from "@/utils/api";
import TimezoneSelect from "react-timezone-select";
import { InlineWidget } from 'react-calendly';
const { Option } = Select;
dayjs.extend(utc);
const MeetingAdd = () => {
    const router = useRouter()
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [selectedTimezone, setSelectedTimezone] = useState<any>(null);

    // Handle timezone selection
    const handleTimezoneChange = (timezone: any) => {
        setSelectedTimezone(timezone);
    };

    const [meetingType, setMeetingType] = useState<any>('');
    const onChange: DatePickerProps['onChange'] = (_, dateStr) => {
    };


    const handleChange = (value: any) => {
        setMeetingType(value);
    };

    const onSubmit = async (values: any) => {
        let items = {
            meeting_name: values?.meeting,
            // "purpose": "Present new project proposal to client.",
            meeting_type: values?.meeting_type,
            start_time: dayjs(values?.start_time).utc().valueOf(),
            end_time: dayjs(values?.end_time).utc().valueOf(),
            year: dayjs(values?.year).format("YYYY"),
            location: values?.location,
            hotel: values?.hotel,
            airport: values?.airport,
            host_company: values?.host_company,
            host: ["o7YFpiVNFSVOUbTScNZYo6X9jtB2"],
            // host: values?.host,
            cell: values?.cell,
            weather: values?.weather,
            comments: values?.comments,
            notes: values?.notes,
            phone: ["8521458798", "8796548596"],
        }

        const timestamp = 1720782277333;

        // Convert timestamp to date
        const date = dayjs(timestamp);



        try {
            let res = await api.Meeting.create(items as any);
            router.back()
            // onAdd();
        } catch (error) {

        }
    }


    const [searchResults, setSearchResults] = useState([]);
    const [searchValue, setSearchValue] = useState('');


    const disabledDate = (current: any) => {
        return current && current < dayjs().startOf('day');
    };

    const disabledTime = (current: any) => {
        const now = dayjs();
        if (current && current.isSame(now, 'day')) {
            const hours = Array.from({ length: now.hour() }, (_, i) => i);
            const minutes = Array.from({ length: now.minute() }, (_, i) => i);
            const seconds = Array.from({ length: now.second() }, (_, i) => i);
            return {
                disabledHours: () => hours,
                disabledMinutes: () => minutes,
                disabledSeconds: () => seconds,
            };
        }
        return {};
    };
    const disabledYear = (current: any) => {
        // Can not select years before this year
        return current && current.year() < dayjs().year();
    };

    const locationSearchRef = useRef(null);
    useEffect(() => {
        const loadGoogleMapScript = () => {
            if (!window.google) {
                const googleMapScript = document.createElement('script');
                googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDVyNgUZlibBRYwSzi7Fd1M_zULyKAPLWQ&libraries=places`;
                googleMapScript.onload = initPlaceAPI;
                document.body.appendChild(googleMapScript);
            } else {
                initPlaceAPI();
            }
        };
        const initPlaceAPI = () => {
            if (locationSearchRef.current) {
                let autocomplete = new window.google.maps.places.Autocomplete(
                    locationSearchRef.current
                );
                autocomplete.addListener('place_changed', () => {
                    let place = autocomplete.getPlace();

                });
            }
        };
        loadGoogleMapScript();
        return () => {
        };
    }, []);
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
                                            <Form.Item name="meeting_type" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Meeting Type' }]} label="Meeting Type">
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
                                            {/* <Form.Item name="start_time" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Start Meeting' }]} label="Start Meeting">
                                          <InlineWidget url="https://calendly.com/your_scheduling_page" />
                                            </Form.Item> */}
                                            <Form.Item name="start_time" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Start Meeting' }]} label="Start Meeting">
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    // defaultValue={defaultValue}
                                                    showTime
                                                    disabledDate={disabledDate}
                                                    disabledTime={disabledTime}
                                                    // locale={buddhistLocale}
                                                    onChange={onChange}
                                                />
                                            </Form.Item>
                                            <Form.Item name="end_time" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter End Meeting' }]} label="End Meeting">
                                                <DatePicker
                                                    // defaultValue={defaultValue}
                                                    style={{ width: '100%' }}
                                                    showTime
                                                    disabledDate={disabledDate}
                                                    disabledTime={disabledTime}
                                                    // locale={buddhistLocale}
                                                    onChange={onChange}
                                                />
                                            </Form.Item>
                                            <Form.Item name="year" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Meeting Year' }]} label="Meeting End Year">
                                                <DatePicker onChange={onChange} disabledDate={disabledYear} style={{ width: '100%' }} picker="year" />
                                            </Form.Item>
                                            <Form.Item name="location" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Location' }]} label="Location">
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
                                            {/* <Form.Item
                            name="location"
                            label="Location"
                            rules={[{ required: true, message: 'Please enter a location' }]}
                        >
                         <GoogleMap locationSearchRef={locationSearchRef.current}/>
                        </Form.Item> */}
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
                                            <Form.Item name="airport" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Nearest Airport' }]} label="Nearest Airport">
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
                                            <Form.Item name="host_company" className='col-lg-6 col-sm-12' label="Host Company">
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
                                                name="host"
                                                className="col-lg-6 col-sm-12"
                                                // validateTrigger={['onChange', 'onBlur']}
                                                // rules={[
                                                //     { required: true, message: 'Please Select Host' },
                                                // ]}
                                                label="Host"
                                            >
                                                <Select
                                                    mode="multiple"
                                                    size="large"
                                                    placeholder="Select Host"
                                                    // onSearch={handleSearch}
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
                                            <Form.Item name="mobile_no" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Cell' }]} label="Cell">
                                                <Input

                                                    size={'large'} placeholder="Cell"
                                                // onKeyPress={(e: any) => {
                                                //     if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                //         e.preventDefault();
                                                //     } else {
                                                //         e.target.value = String(e.target.value).trim()
                                                //     }
                                                // }}
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
    );
};

export default MeetingAdd;
