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
    TimePicker,
    TimePickerProps,
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
import CalendlyWidget from "../common/calender"
import moment from 'moment-timezone';
import { toast } from "react-toastify";
const { Option } = Select;
const timezones = moment.tz.names();

dayjs.extend(utc);

const formatTimezone = (timezone: any) => {
    const offset = moment.tz(timezone).utcOffset();
    const sign = offset >= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(offset) / 60).toString().padStart(2, '0');
    const minutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
    return `UTC${sign}${hours}:${minutes} - ${timezone}`;
};
const MeetingAdd = () => {
    const router = useRouter()
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [selectedTimezone, setSelectedTimezone] = useState(moment.tz.guess()); // Default to local timezone
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [selectedLocation, setSelectedLocation] = useState<any>('');
    const [selectedHotel, setSelectedHotel] = useState<any>('');

    const onChangeDate = (date: any) => {
        const dateWithTimezone: any = date ? moment.tz(date, selectedTimezone) : null;
        setSelectedDate(dateWithTimezone);
        console.log(dateWithTimezone, "dateWithTimezone");
    };

    const onTimezoneChange = (value: any) => {
        setSelectedTimezone(value);
        if (selectedDate) {
            setSelectedDate(selectedDate.clone().tz(value));
        }
        console.log('Selected Timezone:', value);
    };
    // const [selectedTimezone, setSelectedTimezone] = useState<any>(null);

    // Handle timezone selection
    const handleTimezoneChange = (timezone: any) => {
        setSelectedTimezone(timezone);
    };

    const onChangeYear = (date: any) => {
        console.log(date);
    };


    const [meetingType, setMeetingType] = useState<any>('');
    const onChange: DatePickerProps['onChange'] = (_, dateStr) => {
    };
    const onChange1: TimePickerProps['onChange'] = (time, timeString) => {
        console.log(time, timeString);
    };

    const handleChange = (value: any) => {
        setMeetingType(value);
    };

    const onSubmit = async (values: any) => {
        let items = {
            meeting_name: "iertierti",
            meeting_time_zone: selectedTimezone,
            // "purpose": "Present new project proposal to client.",
            meeting_type: values?.meeting_type,
            start_time: dayjs(values?.start_time).utc().valueOf(),
            start_meeting_date:dayjs(values?.start_date).utc().valueOf(),
            end_time: dayjs(values?.end_time).utc().valueOf(),
            end_meeting_date:dayjs(values?.end_date).utc().valueOf(),
            year: dayjs(values?.year).format("YYYY"),
            location: selectedLocation,
            hotel: selectedHotel,
            airport: values?.airport,
            host_company: values?.host_company,
            host: values?.host,
            // host: values?.host,
            cell: values?.cell,
            weather: values?.weather,
            comments: values?.comments,
            notes: values?.notes,
            phone: ["+16576455654", "+1679648596"],
        }

        const timestamp = 1720782277333;

        // Convert timestamp to date
        const date = dayjs(timestamp);



        try {
            let res = await api.Meeting.create(items as any);
            toast.success(res?.message)
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
    const hotelSearchRef = useRef(null);
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
                let locationAutocomplete = new window.google.maps.places.Autocomplete(
                    locationSearchRef.current
                );
                locationAutocomplete.addListener('place_changed', () => {
                    let place = locationAutocomplete.getPlace();
                    setSelectedLocation(place.formatted_address || '');
                });
            }

            if (hotelSearchRef.current) {
                let hotelAutocomplete = new window.google.maps.places.Autocomplete(
                    hotelSearchRef.current
                );
                hotelAutocomplete.addListener('place_changed', () => {
                    let place = hotelAutocomplete.getPlace();
                    setSelectedHotel(place.formatted_address || '');
                });
            }
        };
        loadGoogleMapScript();
        // Cleanup function if needed
        return () => {
            // Cleanup code if any
        };
    }, []);
    const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const isAlphaOrSpace = /[a-zA-Z ]/.test(e.key);
        const isSpecialKey = ['Backspace', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key);

        if (!isAlphaOrSpace && !isSpecialKey) {
            e.preventDefault();
        }
    };
    return (
        <MainLayout>
            <Fragment>

                <section>
                    <Row justify="center" gutter={[20, 20]} className='heightCenter'>
                        <Col sm={22} md={20} lg={16} xl={14} xxl={12}>
                            <Card className='common-card'>
                                <div className='mb-4'>
                                    <Breadcrumb separator=">">
                                        <Breadcrumb.Item><Link href="/admin/dashboard" className='text-decoration-none'>Home</Link></Breadcrumb.Item>
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
                                            <Form.Item
                                                name="timezone"
                                                className="col-lg-6 col-sm-12"
                                                rules={[{ required: true, message: 'Please Select Timezone' }]}
                                                label="Timezone"
                                            >
                                                {/* <div className="Div_contact">
                                                   
                                                    <CalendlyWidget />
                                                </div> */}
                                                <Select
                                                    showSearch
                                                    placeholder="Select a timezone"
                                                    optionFilterProp="children"
                                                    onChange={onTimezoneChange}
                                                    filterOption={(input:any, option:any) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    style={{ width: '100%' }}
                                                    value={selectedTimezone}
                                                >
                                                    {timezones.map((timezone) => (
                                                        <Option key={timezone} value={timezone}>
                                                            {formatTimezone(timezone)}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>

                                           
                                            <Form.Item name="start_date" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Meeting Start Date' }]} label="Meeting Start Date">
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    // defaultValue={defaultValue}
                                                    // showTime
                                                    disabledDate={disabledDate}
                                                    disabledTime={disabledTime}
                                                    // locale={buddhistLocale}
                                                    onChange={onChangeDate}
                                                />
                                            </Form.Item>
                                            <Form.Item name="start_time" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Meeting Start Time' }]} label="Meeting Start Time">
                                            <TimePicker onChange={onChange1} 
                                                // disabledTime={disabledTime} 
                                                style={{ width: '100%' }} defaultOpenValue={dayjs('00:00', 'HH:mm')} />
                                            </Form.Item>
                                            <Form.Item name="end_date" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Meeting End Date' }]} label="Meeting End Date">
                                                {/* <TimePicker onChange={onChange1} 
                                                // disabledTime={disabledTime} 
                                                style={{ width: '100%' }} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} /> */}
                                                   <DatePicker
                                                    style={{ width: '100%' }}
                                                    // defaultValue={defaultValue}
                                                    // showTime
                                                    disabledDate={disabledDate}
                                                    disabledTime={disabledTime}
                                                    // locale={buddhistLocale}
                                                    onChange={onChangeDate}
                                                />
                                                
                                            </Form.Item>
                                            <Form.Item name="end_time" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Meeting End Time' }]} label="Meeting End Time">
                                            <TimePicker onChange={onChange1} 
                                                // disabledTime={disabledTime} 
                                                style={{ width: '100%' }} defaultOpenValue={dayjs('00:00', 'HH:mm')} />
                                            </Form.Item>
                                            <Form.Item name="year" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Meeting Year' }]} label="Meeting Year">
                                                <DatePicker onChange={onChange} disabledDate={disabledYear} style={{ width: '100%' }} picker="year" />
                                            </Form.Item>

                                            <Form.Item name="location" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Location' }]} label="Location">
                                                {/* <Input size={'large'} placeholder="Location"   /> */}
                                                <input
                                        className="custom-input"
                                        style={{ width: '100%' }}
                                        ref={locationSearchRef}
                                        placeholder="Enter your address"
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
                                            <input
                                        className="custom-input"
                                        style={{ width: '100%' }}
                                        ref={hotelSearchRef}
                                        placeholder="Enter your address"
                                    />
                                            </Form.Item>
                                            <Form.Item name="airport" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Nearest Airport' }]} label="Nearest Airport">
                                                <Input size={'large'} placeholder="Nearest Airport"
                                                    onKeyPress={onKeyPress}
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
                                                <Input size={'large'} placeholder="Weather"
                                                   
                                                />
                                                {/* <Select
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
                                                </Select> */}
                                            </Form.Item>
                                            <Form.Item name="mobile_no" className='col-lg-6 col-sm-12' rules={[
                                                { required: true, whitespace: true, message: 'Please Enter Cell' },
                                                { pattern: /^[0-9]*$/, message: 'Only numbers are allowed' }
                                            ]} label="Cell">
                                                <Input
                                                    size={'large'} placeholder="Cell"
                                                    // type="number"
                                                    onKeyPress={(event) => {
                                                        if (!/[0-9]/.test(event.key)) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                />

                                            </Form.Item>

                                        </div>
                                        {/* Button  */}
                                        <div className="text-center mt-3">

                                            <Button size={'large'} type="primary" htmlType="submit" className="login-form-button w-50" loading={loading}>
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

export default MeetingAdd;
