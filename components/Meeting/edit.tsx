"use client";
import { Breadcrumb, Form, Select, Input, Typography, DatePicker, TimePickerProps, TimePicker } from "antd";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import React, { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import MainLayout from "../../components/Layout/layout";
import dayjs from "dayjs";
import api from "@/utils/api";
import utc from "dayjs/plugin/utc";
const { Row, Col, Card, Button } = {
  Button: dynamic(() => import("antd").then((module) => module.Button), {
    ssr: false,
  }),
  Row: dynamic(() => import("antd").then((module) => module.Row), {
    ssr: false,
  }),
  Col: dynamic(() => import("antd").then((module) => module.Col), {
    ssr: false,
  }),
  Card: dynamic(() => import("antd").then((module) => module.Card), {
    ssr: false,
  }),
};
const { Option } = Select;
dayjs.extend(utc);
const MeetingEdit = () => {

  const router = useRouter()
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)

  const [state, setState] = React.useState<any>({
    meeting_name: "",
    meeting_type: "",
    start_time: "",
    end_time: "",
    year: "",
    location: "",
    hotel: "",
    airport: "",
    host_company: "",
    host: [],
    cell: "",
    weather: "",
    comments: "",
    notes: "",
    phone: [],
  })
  const [selectedLocation, setSelectedLocation] = useState<any>('');
  const [selectedHotel, setSelectedHotel] = useState<any>('');
  const [meetingType, setMeetingType] = useState<any>(state?.meeting_type);
  const handleChange = (value: any) => {
    setMeetingType(value);
  };
  const onChange1: TimePickerProps['onChange'] = (time, timeString) => {
    console.log(time, timeString);
  };
  const onChange = (date: any, dateString: any) => {
    setState((prevState: any) => ({
      ...prevState,
      start_time: date
    }));
  };
  const searchParam = useParams();

  const id = searchParam.id;
  const getDataById = async () => {
    const item = {
      meeting_id: id
    }
    try {
      const res = await api.Meeting.getById(item as any);
      const data = res?.data || {};
      if (data.start_meeting_date) {
        data.start_meeting_date = dayjs(data.start_meeting_date);
      }
      if (data.start_time) {
        data.start_time = dayjs(data.start_time);
      }
      if (data.end_meeting_date) {
        data.end_meeting_date = dayjs(data.end_meeting_date);
      }
      if (data.end_time) {
        data.end_time = dayjs(data.end_time);
      }
      if (data.year) {
        data.year = dayjs(data.year);
      }

      setState(data);
      form.setFieldsValue(data);
    } catch (error: any) {
      alert(error.message);
    }
  };
  const onFinish = async (values: any) => {
    let items = {
      meeting_name: "meeting_name",
      meeting_id: id,
      meeting_type: values?.meeting_type,
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
      notes: values?.notes,
      phone: ["7878787878", "9898989898"],
    }
    try {
      setLoading(true)
      let res = await api.Meeting.edit(items as any);
      router.push("/admin/meetings")
    } catch (error: any) {
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    getDataById();
  }, []);


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
                    <Breadcrumb.Item className='text-decoration-none'>Edit Meeting</Breadcrumb.Item>
                  </Breadcrumb>
                </div>
                {/* Title  */}
                <div className='mb-4'>
                  <Typography.Title level={3} className='m-0 fw-bold'>Edit Meeting</Typography.Title>
                </div>

                {/* form  */}
                <div className='card-form-wrapper'>
                  <Form form={form} name="add_staff" className="add-staff-form" scrollToFirstError layout='vertical' onFinish={onFinish}>

                    <div className='row mt-4 selectPaddingBox'>

                      {/* First Name  */}
                      {/* <Form.Item name="meeting_name" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Meeting Agenda' }]} label="Meeting Agenda">
                        <Input size={'large'} placeholder="Meeting Agenda"
                          onKeyPress={(e: any) => {
                            if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                              e.preventDefault();
                            } else {
                              e.target.value = String(e.target.value).trim()
                            }
                          }}
                        />
                      </Form.Item> */}
                      <Form.Item name="meeting_type" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Meeting Type' }]} label="Meeting Type">
                        <Select
                          size={'large'}
                          placeholder="Select Meeting Type"
                          onChange={handleChange}
                          value={meetingType}
                        >
                          <Option value="fall">Fall</Option>
                          <Option value="spring">Spring</Option>
                        </Select>
                      </Form.Item>
                      {/* Last Name  */}


                      {/* Email  */}
                      <Form.Item name="start_meeting_date" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Meeting Start date' }]} label="Meeting Start date">
                        <DatePicker
                          style={{ width: '100%' }}
                          // defaultValue={defaultValue}
                          // showTime
                          disabledDate={disabledDate}
                          // disabledTime={disabledTime}
                          // locale={buddhistLocale}
                          onChange={onChange}
                        />
                      </Form.Item>
                      <Form.Item name="start_time" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Meeting Start Time' }]} label="Meeting Start Time">
                        <TimePicker onChange={onChange1}
                          disabledTime={disabledTime}
                          use12Hours
                          style={{ width: '100%' }} defaultOpenValue={dayjs('00:00', 'HH:mm')} />
                      </Form.Item>
                      <Form.Item name="end_meeting_date" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Meeting End Date' }]} label="Meeting End Date">
                        {/* <TimePicker onChange={onChange1} disabledTime={disabledTime} style={{ width: '100%' }} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} /> */}
                        <DatePicker
                          style={{ width: '100%' }}
                          // defaultValue={defaultValue}
                          // showTime

                          disabledDate={disabledDate}
                          // disabledTime={disabledTime}
                          // locale={buddhistLocale}
                          onChange={onChange}
                        />
                      </Form.Item>
                      <Form.Item name="end_time" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Meeting End Time' }]} label="Meeting End Time">
                        <TimePicker onChange={onChange1}
                          use12Hours
                          // disabledTime={disabledTime}
                          style={{ width: '100%' }} defaultOpenValue={dayjs('00:00', 'HH:mm')} />
                      </Form.Item>
                      <Form.Item name="year" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Year' }]} label="Meeting Year">
                        <DatePicker onChange={onChange} disabledDate={disabledYear} style={{ width: '100%' }} picker="year" />
                      </Form.Item>
                      <Form.Item name="location" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Location' }]} label="Location">
                        <input
                          className="custom-input"
                          style={{ width: '100%' }}
                          ref={locationSearchRef}
                          placeholder="Enter your address"
                        />
                        {/* <Input size={'large'} placeholder="Location"   /> */}
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
                         
                        />
                      </Form.Item>
                      {/* <Form.Item name="host" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Host' }]} label="Host">
                                      <Input size={'large'} placeholder="Host"
                                          onKeyPress={(e: any) => {
                                              if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                  e.preventDefault();
                                              } else {
                                                  e.target.value = String(e.target.value).trim()
                                              }
                                          }}
                                      />
                                  </Form.Item> */}
                      <Form.Item name="phone" className='col-lg-6 col-sm-12' rules={[

                        { pattern: /^[0-9\s,]*$/, message: 'Only numbers and spaces are allowed' }
                      ]} label="Cell">
                        <Input
                          size={'large'} placeholder="Cell"
                          // type="number"
                          onKeyPress={(event) => {
                            if (!/[0-9\s,]/.test(event.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                              event.preventDefault();
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
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          { required: true, message: 'Please Select Host' },
                        ]}
                        label="Host"
                      >

                        <Input size={'large'} placeholder="Host" />
                      </Form.Item>
                      {/* <Form.Item name="phone" className='col-lg-6 col-sm-12' label="Mobile Number">
                        <Input size={'large'} placeholder="Mobile Number" />
                      </Form.Item> */}

                    </div>
                    {/* Button  */}
                    <div className="text-center mt-3">

                      <Button size={'large'} type="primary" htmlType="submit" className="login-form-button w-50" loading={loading}>
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

export default MeetingEdit;
