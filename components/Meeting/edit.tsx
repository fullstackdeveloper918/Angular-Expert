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
import moment from "moment-timezone";
import { toast } from "react-toastify";
import { destroyCookie } from "nookies";
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
const timezones = moment.tz.names();
const { Option } = Select;
dayjs.extend(utc);
const formatTimezone = (timezone: any) => {
  const offset = moment.tz(timezone).utcOffset();
  const sign = offset >= 0 ? '+' : '-';
  const hours = Math.floor(Math.abs(offset) / 60).toString().padStart(2, '0');
  const minutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
  return `UTC${sign}${hours}:${minutes} - ${timezone}`;
};
const MeetingEdit = () => {

  const router = useRouter()
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const [selectedTimezone, setSelectedTimezone] = useState(moment.tz.guess()); // Default to local timezone
  const [selectedDate, setSelectedDate] = useState<any>(null);
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
  const onChangeDate = (date: any) => {
    const dateWithTimezone: any = date ? moment.tz(date, selectedTimezone) : null;
    setSelectedDate(dateWithTimezone);
  };

  const onTimezoneChange = (value: any) => {
    setSelectedTimezone(value);
    if (selectedDate) {
      setSelectedDate(selectedDate.clone().tz(value));
    }
  };
  const handleChange = (value: any) => {
    setMeetingType(value);
  };
  const onChange1: TimePickerProps['onChange'] = (time, timeString) => {
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
      // if (data.year) {
      //   data.year = dayjs(data.year);
      // }

      setState(data);
      form.setFieldsValue(data);
    } catch (error: any) {
      // if (error) {
        if (error==400) {
          destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
          localStorage.removeItem('hasReloaded');
          // }
          toast.error("Session Expired Login Again")
          router.replace("/auth/signin")
        }
      }
    // }
  };
  const onFinish = async (values: any) => {
    let items = {
      meeting_name: "meeting_name",
      meeting_id: id,
      meeting_type: values?.meeting_type,
      meeting_time_zone: selectedTimezone,
      start_time: dayjs(values?.start_time).utc().valueOf(),
      start_meeting_date: dayjs(values?.start_meeting_date).utc().valueOf(),
      end_time: dayjs(values?.end_time).utc().valueOf(),
      end_meeting_date: dayjs(values?.end_meeting_date).utc().valueOf(),
      year: "",
      location: values?.location,
      hotel: values?.hotel,
      airport: values?.airport,
      host_company: values?.host_company,
      host: values?.host,
      cell: values?.cell,
      weather: values?.weather,
      comments: values?.comments,
      notes: values?.notes,
      phone: [values?.phone],
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

  const [shortCounrtyName, setShortCountryName] = useState("")

    const locationSearchRef = useRef(null);
    const hotelSearchRef = useRef(null);
    const airportRef = useRef(null);

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
                    if (!place.geometry) {
                        return;
                    }
                    const address = place?.address_components;
                    const coordinate = place?.geometry?.location;


                    let items: any = {};
                    if (Array.isArray(address) && address?.length > 0) {
                        let zipIndex = address.findIndex((res: any) =>
                            res.types.includes("postal_code")
                        );
                        let administrativeAreaIndex = address?.findIndex((res: any) =>
                            res?.types.includes("administrative_area_level_1", "political")
                        );
                        let localityIndex = address?.findIndex((res: any) =>
                            res?.types?.includes("locality", "political")
                        );
                        let countryIndex = address?.findIndex((res: any) =>
                            res?.types?.includes("country", "political")
                        );

                        if (zipIndex > -1) {
                            items.postal_code = address[zipIndex]?.long_name;
                        }
                        if (administrativeAreaIndex > -1) {
                            items.state = address[administrativeAreaIndex]?.long_name;
                        }
                        if (localityIndex > -1) {
                            items.city = address[localityIndex]?.long_name;
                        }
                        if (countryIndex > -1) {
                            items.country = address[countryIndex]?.long_name;
                        }
                        if (countryIndex > -1) {
                            items.country_short_name = address[countryIndex]?.short_name;
                        }
                        setShortCountryName(address[countryIndex]?.short_name)

                        const heheheh = {
                            address: place.formatted_address,
                            country: items?.country,
                            state: items?.state,
                            city: items?.city,
                            postal_code: items?.postal_code,
                            country_short_name: items?.country_short_name,
                        } as any;

                        const errors = form.getFieldsError();
                        if (errors.length) {
                            form?.setFields(
                                errors.flatMap((res: any) => {
                                    if (!(res.name[0] in heheheh)) return [];

                                    return {
                                        name: res.name,
                                        errors: !!heheheh[res.name[0]]
                                            ? []
                                            : [
                                                `Please enter ` +
                                                res.name[0].toString().replace("_", " "),
                                            ],
                                    };
                                })
                            );
                        }

                        form?.setFieldValue("location", place.formatted_address);
                        form?.setFieldValue("country", items?.country);
                        form?.setFieldValue("city", items?.city);
                    }
                });



            }

            if (hotelSearchRef.current) {
                var options = {
                    types: ['establishment'],
                    componentRestrictions: { country: "IN" }
                };
                let hotelAutocomplete = new window.google.maps.places.Autocomplete(
                    hotelSearchRef.current, options
                );
                hotelAutocomplete.addListener('place_changed', () => {
                    let place = hotelAutocomplete.getPlace();
                    setSelectedHotel(place.formatted_address || '');
                });
            }
        };
        loadGoogleMapScript();
        return () => {
        };
    }, []);
    const initPlaceHotel = async () => {
        if (hotelSearchRef.current) {
            var options = {
                types: ['establishment'],
                componentRestrictions: { country: shortCounrtyName }
            };
            let hotelAutocomplete = new window.google.maps.places.Autocomplete(
                hotelSearchRef.current, options
            );
            hotelAutocomplete.addListener('place_changed', () => {
                let place = hotelAutocomplete.getPlace();
                setSelectedHotel(place.formatted_address || '');
                form.setFieldValue("hotel", place?.formatted_address)
            });
        };
    }

    const initPlaceAirport = async () => {
        if (airportRef.current) {
            var options = {
                types: ['establishment'],
                componentRestrictions: { country: shortCounrtyName }
            };
            let hotelAutocomplete = new window.google.maps.places.Autocomplete(
                airportRef.current, options
            );
            hotelAutocomplete.addListener('place_changed', () => {
                let place = hotelAutocomplete.getPlace();
                setSelectedHotel(place.formatted_address || '');
                form.setFieldValue("airport", place?.formatted_address)
            });
        };
    }


    useEffect(() => {
        initPlaceHotel()
    }, [shortCounrtyName])
    useEffect(() => {
        initPlaceAirport()
    }, [shortCounrtyName])
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

                      <Form.Item
                        name="meeting_time_zone"
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
                          filterOption={(input: any, option: any) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          style={{ width: '100%' }}
                          value={selectedTimezone}
                        >
                          {timezones.map((timezone: any) => (
                            <Option key={timezone} value={timezone}>
                              {formatTimezone(timezone)}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
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
                      {/* <Form.Item name="year" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Year' }]} label="Meeting Year">
                        <DatePicker onChange={onChange} disabledDate={disabledYear} style={{ width: '100%' }} picker="year" />
                      </Form.Item> */}
                      <Form.Item name="location" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Location' }]} label="Location">
                      <input
                                                    value={form.getFieldValue("location")}
                                                    className="custom-input"
                                                    style={{ width: '100%' }}
                                                    ref={locationSearchRef}
                                                    placeholder="Enter your address"
                                                />
                        {/* <Input size={'large'} placeholder="Location"   /> */}
                      </Form.Item>
                      <Form.Item className='col-lg-6 col-sm-12' name="hotel" rules={[{ required: true, whitespace: true, message: 'Please Enter Hotel' }]} label="Hotel">
                      <input
                                                    className="custom-input"
                                                    style={{ width: '100%' }}
                                                    ref={hotelSearchRef}
                                                    placeholder="Enter your address"
                                                />
                      </Form.Item>
                      <Form.Item name="airport" className='col-lg-6 col-sm-12' rules={[{ required: true, whitespace: true, message: 'Please Enter Nearest Airport' }]} label="Nearest Airport">
                        <input
                                                    className="custom-input"
                                                    style={{ width: '100%' }}
                                                    ref={airportRef}
                                                    placeholder="Enter your address"
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
                      <Form.Item name="host_company" className='col-lg-6 col-sm-12' label="Host Company">
                        <Input size={'large'} placeholder="Host Company"

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
                      <Form.Item name="cell" className='col-lg-6 col-sm-12' rules={[

                        { pattern: /^[0-9\s,+]*$/, message: 'Only numbers and spaces are allowed' }
                      ]} label="Cell">
                        <Input
                          size={'large'} placeholder="Cell"
                          onKeyPress={(event) => {
                            if (!/[0-9\s,+]/.test(event.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                              event.preventDefault();
                            }
                          }}
                        />

                      </Form.Item>
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
