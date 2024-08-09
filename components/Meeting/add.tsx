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
    Menu,
    Dropdown,
} from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
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
import TextArea from "antd/es/input/TextArea";
const { Option } = Select;
const timezones = moment.tz.names();
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { destroyCookie } from "nookies";
import axios from "axios";
dayjs.extend(utc);
interface WeatherData {
    dt: number; // timestamp
    main: {
        temp: number;
        // other main properties
    };
    weather: {
        description: string;
        // other weather properties
    }[];
    // other fields from the response
}
interface WeatherMap {
    icon: string;
    temp: number;
}
const formatTimezone = (timezone: any) => {
    const offset = moment.tz(timezone).utcOffset();
    const sign = offset >= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(offset) / 60).toString().padStart(2, '0');
    const minutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
    return `UTC${sign}${hours}:${minutes} - ${timezone}`;
};
const MeetingAdd = () => {
    const apiKey = '74e3f4ac1ed2a986212bc7fa3ee09e22';
    const router = useRouter()
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [selectedTimezone, setSelectedTimezone] = useState(moment.tz.guess()); // Default to local timezone
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [selectedDate1, setSelectedDate1] = useState<any>(null);
    const [selectedLocation, setSelectedLocation] = useState<any>('');
    const [selectedHotel, setSelectedHotel] = useState<any>('');
    const [location, setLocation] = useState('');
    const [weather, setWeather] = useState<any>(null);
    const [error, setError] = useState('');
    const [nearestAirport, setNearestAirport] = useState<any>(null);
    const [lat, setLat] = useState<any>(null);
    const [long, setLong] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const [weatherData1, setWeatherData1] = useState<any>([]);
    const [meetingendDate, setMeetingendDate] = useState<any>(null);
    const [meetingestartDate, setMeetingstartDate] = useState<any>(null);
    console.log(selectedHotel, "selectedHotel");
    console.log(meetingestartDate, "meetingestartDate");
    console.log(weatherData1, "weatherData1");
    console.log(nearestAirport, "nearestAirport");


    const handleSearch = async () => {
        try {
            setError('');
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
            );
            setWeather(response.data);
        } catch (err) {
            setError('Failed to fetch weather data. Please check the location name.');
        }
    };
    const onChangeDate = (date: any) => {
        const selectedTimezone1 = 'Australia/Sydney'; // Example timezone
        console.log(date, "original date");
    
        // Parse the selected date without time
        const localDate = moment(date).format("YYYY-MM-DD");
        console.log(localDate, "localDate");
    
        // Create a moment object using the selected timezone
        const dateInSelectedTimezone = moment.tz(localDate, selectedTimezone1);
        console.log(dateInSelectedTimezone.format(), "dateInSelectedTimezone");
    
        // Format the date according to the selected timezone
        const formattedDate = dateInSelectedTimezone.format("YYYY-MM-DD");
        console.log(formattedDate, "formattedDate");
    
        // Set the date in the state
        setMeetingstartDate(formattedDate);
    };
    console.log(meetingestartDate,"meetingestartDate");
    
    const onChangeDate1 = (date: any) => {
        const dateWithTimezone: any = date ? moment.tz(date, selectedTimezone) : null;
        setSelectedDate1(dateWithTimezone);
        setMeetingendDate(dayjs(date).format("YYYY-MM-DD"))
    };

    const onTimezoneChange = (value: any) => {
        setSelectedTimezone(value);
        if (selectedDate) {
            setSelectedDate(selectedDate.clone().tz(value));
        }
    };
    // const [selectedTimezone, setSelectedTimezone] = useState<any>(null);

    // Handle timezone selection
    const handleTimezoneChange = (timezone: any) => {
        setSelectedTimezone(timezone);
    };

    const onChangeYear = (date: any) => {
    };


    const [meetingType, setMeetingType] = useState<any>('');
    const onChange: DatePickerProps['onChange'] = (_, dateStr) => {
    };
    const disabledHours = () => {
        // Enable only 0 (12 AM) and 15 (3 PM)
        const hours = Array.from({ length: 24 }, (_, i) => i);
        return hours.filter(hour => hour !== 0 && hour !== 15);
    };

    const disabledMinutes = (selectedHour: number) => {
        // Allow only 0 minutes for the enabled hours (12 AM and 3 PM)
        return selectedHour === 0 || selectedHour === 15 ? [] : Array.from({ length: 60 }, (_, i) => i);
    };
    const onChange1: TimePickerProps['onChange'] = (time, timeString) => {
    };

    const handleChange = (value: any) => {
        setMeetingType(value);
    };
    console.log(selectedHotel, "selectedHotel");
    const [meetingStart, setMeetingStart] = useState<any>("")
    const [meetingEnd, setMeetingEnd] = useState<any>("")
    const onSubmit = async (values: any) => {
console.log(values,"hkhskdhfksdfh");

        let start_date = dayjs(values?.start_date).format("YYYY-MM-DD")
        let end_date = dayjs(values?.end_date).format("YYYY-MM-DD")
        setMeetingStart(start_date)
        setMeetingEnd(end_date)
        let items = {
            meeting_name: "Meetings",
            meeting_time_zone: selectedTimezone,
            // "purpose": "Present new project proposal to client.",
            meeting_type: values?.meeting_type,
            start_time: dayjs(values?.start_time).utc().valueOf(),
            // start_time: dayjs(values?.start_time).valueOf(),
            start_meeting_date: dayjs(values?.start_date).utc().valueOf(),
            // start_meeting_date: dayjs(values?.start_date).valueOf(),
            // end_time: dayjs(values?.end_time).valueOf(),
            end_time: dayjs(values?.end_time).utc().valueOf(),
            // end_meeting_date: dayjs(values?.end_date).valueOf(),
            end_meeting_date: dayjs(values?.end_date).utc().valueOf(),
            // year: dayjs(values?.end_date).valueOf(),
            year: dayjs(values?.end_date).utc().valueOf(),
            location: selectedLocation,
            hotel: selectedHotel?.name,
            airport: nearestAirport?.name,
            host_company: values?.host_company,
            host: values?.host,
            // host: values?.host,
            cell: values?.cell,
            weather: values?.weather,
            comments: values?.comments,
            notes: values?.notes,
            phone: [values?.mobile_no],
        }
return
        const timestamp = 1720782277333;

        // Convert timestamp to date
        const date = dayjs(timestamp);



        try {
            let res = await api.Meeting.create(items as any);
            toast.success(res?.message)
            router.back()

            // onAdd();
        } catch (error: any) {
            if (error.status == 400) {
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                localStorage.removeItem('hasReloaded');
                toast.error("Session Expired Login Again")
                router.replace("/auth/signin")
            }
        }
    }


    const [searchResults, setSearchResults] = useState([]);
    const [searchValue, setSearchValue] = useState('');


    const disabledDate = (current: any): boolean => {
        if (!current) {
            return false;
        }
        const month = current.month();
        const now = moment().startOf('day');
        if (meetingType === 'spring') {
            //  Jan to June
            return current.isBefore(now) || month < 0 || month > 5;
        } else if (meetingType === 'fall') {
            // July to Dec
            return current.isBefore(now) || month < 6 || month > 11;
        }
        return true;
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
    console.log(hotelSearchRef, "hotelSearchRef");

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
            const options = {
                types: ['establishment'],
                componentRestrictions: { country: shortCounrtyName }
            };
            let hotelAutocomplete = new window.google.maps.places.Autocomplete(
                hotelSearchRef.current, options
            );
            hotelAutocomplete.addListener('place_changed', () => {
                let place = hotelAutocomplete.getPlace();
                if (!place.geometry) {
                    return;
                }
                setSelectedHotel(place || '');
                const coordinate: any = place.geometry.location;
                const latitude = coordinate.lat();
                const longitude = coordinate.lng();
                setLat(latitude);
                setLong(longitude);
                // fetchWeatherData(latitude, longitude, meetingStart, meetingEnd);
                findNearestAirport(latitude, longitude);
                form.setFieldValue("hotel", place.name || '');
            });
        }
    };

    useEffect(() => {
        initPlaceHotel();
    }, [shortCounrtyName]);
    const API_WEATHER_KEY = 'd0071f1a5d256028b91f0fdd1aedd36c';
    const API_WEATHER_PREFIX = 'https://api.openweathermap.org/data/2.5/forecast';
    const [next7DaysWeather, setNext7DaysWeather] = useState<{ day: string; icon: string; temp: string }[]>([]);
    const weatherIcons: { [key: string]: string } = {
        // Add more mappings if needed
        'clear sky': '☀️',
        'few clouds': '🌤️',
        'scattered clouds': '☁️',
        'broken clouds': '🌥️',
        'shower rain': '🌧️',
        'rain': '🌧️',
        'thunderstorm': '⛈️',
        'snow': '❄️',
        'mist': '🌫️',
    };

    const lat1 = 40.7128; // Example latitude
    const lon = -74.0060; // Example longitude

    // Example start and end dates
    // const meetingStartDate = meetingestartDate;
    // const meetingEndDate = meetingendDate;

    // const startDate = useMemo(() => new Date(meetingStartDate), [meetingStartDate]);
    // const endDate = useMemo(() => new Date(meetingEndDate), [meetingEndDate]);
    const currentDate = useMemo(() => new Date(), []);
    const endDate = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date;
    }, []);

    useEffect(() => {
        const fetchAndFilterWeather = async (lat: number, lon: number, startDate: Date, endDate: Date) => {
            try {
                const response = await axios.get(API_WEATHER_PREFIX, {
                    params: {
                        lat,
                        lon,
                        appid: API_WEATHER_KEY,
                        units: 'metric', // or 'imperial' for Fahrenheit
                    },
                });

                const weatherList: WeatherData[] = response.data.list;

                // Convert to timestamp in seconds
                const startTimestamp = startDate.getTime() / 1000;
                const endTimestamp = endDate.getTime() / 1000;

                // Filter data for the next 7 days
                const filteredWeather = weatherList.filter(weather => {
                    return weather.dt >= startTimestamp && weather.dt < endTimestamp;
                });

                const weatherMap: { [key: string]: { icon: string; tempSum: number; count: number } } = {};

                filteredWeather.forEach(weather => {
                    const date = new Date(weather.dt * 1000);
                    const day = date.toISOString().split('T')[0];
                    const temp = weather.main.temp;
                    const description = weather.weather[0].description;
                    const icon = weatherIcons[description] || '🌡';

                    if (weatherMap[day]) {
                        weatherMap[day].tempSum += temp;
                        weatherMap[day].count += 1;
                    } else {
                        weatherMap[day] = { icon, tempSum: temp, count: 1 };
                    }
                });

                const formattedWeather = Object.entries(weatherMap).map(([day, { icon, tempSum, count }]) => {
                    const averageTemp = tempSum / count;
                    const date = new Date(day);
                    const formattedDay = date.toLocaleDateString('en-US', { weekday: 'short' });

                    return { day: formattedDay, icon, temp: averageTemp.toFixed(1) };
                });
                formattedWeather.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
                console.log(filteredWeather,"formattedWeatherformattedWeather");
                
                setNext7DaysWeather(formattedWeather);
            } catch (error) {
                console.error('Error fetching weather data:', error);
                setNext7DaysWeather([]);
            }
        };

        fetchAndFilterWeather(lat, long, currentDate, endDate);
    }, [lat, long, currentDate, endDate]);

    const findNearestAirport = (lat: any, lng: any) => {
        const service = new window.google.maps.places.PlacesService(document.createElement('div'));
        const request = {
            location: new window.google.maps.LatLng(lat, lng),
            radius: 50000, // 50 kilometers
            type: ['airport']
        } as any;
        service.nearbySearch(request, (results: any, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                if (results.length > 0) {
                    setNearestAirport(results[0]);
                    console.log('Nearest airport:', results[0]);
                } else {
                    console.log('No airports found.');
                }
            } else {
                console.error('Error finding airports:', status);
            }
        });
    };

    console.log(nearestAirport, "nearestAirport");
    // useEffect(() => {
    //     initPlaceAirport()
    // }, [shortCounrtyName])
    const weatherData = [
        { day: 'Mon', temperature: 34, condition: 'sunny' },
        { day: 'Tue', temperature: 33, condition: 'rain' },
        // { day: 'Wed', temperature: 31, condition: 'storm' },
        // { day: 'Thu', temperature: 33, condition: 'cloud' },
        // { day: 'Fri', temperature: 34, condition: 'storm' },
        // { day: 'Sat', temperature: 32, condition: 'storm' },
        // { day: 'Sun', temperature: 31, condition: 'storm' },
        // { day: 'Mon', temperature: 31, condition: 'storm' }
    ];

    const getWeatherIcon = (condition: string) => {
        switch (condition) {
            case 'sunny':
                return '🌤';
            case 'rain':
                return '🌧';
            case 'storm':
                return '⛈';
            case 'cloud':
                return '☁️';
            default:
                return '🌤';
        }
    };
    const menu = (
        <Menu>
            {next7DaysWeather.map(({ day, icon, temp }) => (
                <Menu.Item key={day} disabled>
                    <div style={{ display: 'flex', flexDirection: 'column', color: "#000000", alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>{day}</span>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: '24px', marginRight: '10px' }}>{icon}</span>
                            <span style={{ fontSize: '16px' }}>{temp}°C</span>
                        </div>
                    </div>
                </Menu.Item>
            ))}
        </Menu>
    );
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

                                            <Form.Item
                                                name="timezone"
                                                className="col-lg-6 col-sm-12"
                                                rules={[{ required: true, message: 'Please Select Timezone' }]}
                                                label="Timezone"
                                            >

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
                                                    disabledDate={disabledDate}
                                                    onChange={onChangeDate}
                                                />
                                            </Form.Item>
                                            <Form.Item name="start_time" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Meeting Start Time' }]} label="Meeting Start Time">
                                                <TimePicker onChange={onChange1}
                                                    // disabledTime={disabledTime} 
                                                    use12Hours
                                                    style={{ width: '100%' }} defaultOpenValue={dayjs('00:00', 'HH:mm')} />
                                            </Form.Item>
                                            <Form.Item name="end_date" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Meeting End Date' }]} label="Meeting End Date">
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    disabledDate={disabledDate}
                                                    onChange={onChangeDate1}
                                                />

                                            </Form.Item>
                                            <Form.Item name="end_time" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Meeting End Time' }]} label="Meeting End Time">
                                                <TimePicker onChange={onChange1}
                                                    use12Hours
                                                    // disabledTime={disabledTime} 
                                                    style={{ width: '100%' }} defaultOpenValue={dayjs('00:00', 'HH:mm')} />
                                            </Form.Item>
                                            {/* <Form.Item name="year" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Meeting Year' }]} label="Meeting Year">
                                                <DatePicker onChange={onChange} disabledDate={disabledYear} style={{ width: '100%' }} picker="year" />
                                            </Form.Item> */}

                                            <Form.Item name="location" className='col-lg-6 col-sm-12' rules={[{ required: true, message: 'Please Enter Location' }]} label="Location">
                                                {/* <Input size={'large'} placeholder="Location"   /> */}
                                                <input
                                                    value={form.getFieldValue("location")}
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
                        </Form.Item> RamDodge2020 */}
                                            <Form.Item className='col-lg-6 col-sm-12' name="hotel" rules={[{ required: true, whitespace: true, message: 'Please Enter Hotel' }]} label="Hotel">
                                                <input
                                                    className="custom-input"
                                                    style={{ width: '100%' }}
                                                    ref={hotelSearchRef}
                                                    placeholder="Enter your address"
                                                />

                                            </Form.Item>
                                            <Form.Item name="airport" className='col-lg-6 col-sm-12' label="Nearest Airport">
                                                {/* <Input size={'large'} placeholder="Nearest Airport"
                                                    onKeyPress={onKeyPress}
                                                /> */}
                                                <p className="custom-input" style={{ width: '100%' }}>{nearestAirport?.name}</p>
                                                {/* <Input
                                                    className="custom-input"
                                                    style={{ width: '100%' }}
                                                    // ref={airportRef}
                                                    placeholder="Enter your address"
                                                /> */}
                                            </Form.Item>
                                           
                                            {/* <Form.Item
                                                name="weather"
                                                label="Weather"
                                                style={{ width: '100%' }}
                                                className="weather-container"
                                            >
                                                <div className="custom-input" >
                                                    {weatherData1.map((dayData: any, index: any) => (
                                                        <span key={index} style={{ margin: '0 10px' }}>
                                                            {console.log(dayData, "dayData")
                                                            }
                                                            {dayData}
                                                        </span>
                                                    ))}
                                                </div>
                                            </Form.Item> */}
                                            <Form.Item name="host_company" className='col-lg-6 col-sm-12' label="Host Company">
                                                <Input size={'large'} placeholder="Host Company"

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
                                                <Input size={'large'} placeholder="Host"

                                                />

                                            </Form.Item>
                                            <Form.Item name="cell" className='col-lg-6 col-sm-12' rules={[

                                                { pattern: /^[0-9\s\(\)\-\+\,]*$/, message: 'Only numbers and spaces are allowed' }
                                            ]} label="Cell">
                                                <Input
                                                    size={'large'} placeholder="Cell"
                                                    // type="number"
                                                    onKeyPress={(event) => {
                                                        // Allow digits, space, parentheses, hyphen, plus, comma, and special keys
                                                        if (!/[0-9\s\(\)\-\+\,]/.test(event.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                />

                                            </Form.Item>
                                            <Form.Item name="weather" className='col-lg-6 col-sm-12' label="Weather">
                                                {/* <Input
                                                    className="custom-input"
                                                    style={{ width: '100%' }}
                                                    // ref={airportRef}
                                                    placeholder="Weather"
                                                />  */}
                                                <p className="custom-input" style={{ width: '100%' }}>
                                                    {/* <Dropdown overlay={menu} trigger={['click']}> */}
                                                    {next7DaysWeather.map(({ day, icon, temp },index:number) => (
                                                            <div className="gap-2" key={index} style={{ display: 'flex', flexDirection: 'column', color: "#000000", alignItems: 'flex-start', width: '100%'  }}>
                                                                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{day}</span>
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <span style={{ fontSize: '24px', marginRight: '10px' }}>{icon}</span>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <span style={{ fontSize: '12px' }}>{temp}°C</span>
                                                                </div>
                                                            </div>
                                                    ))}
                                                    {/* </Dropdown> */}
                                                </p>
                                                {/* <Input
                                                    type="text"
                                                    // value={location}
                                                    // onChange={(e) => setLocation(e.target.value)}
                                                    placeholder="Enter Weather"
                                                /> */}
                                                {/* <button onClick={handleSearch}>Search</button>
                                                {error && <p>{error}</p>}
                                                {weather && (
                                                    <div>
                                                        <h2>{weather.name}</h2>
                                                        <p>Temperature: {weather.main.temp}°C</p>
                                                        <p>Weather: {weather.weather[0].description}</p>
                                                    </div>
                                                )} */}
                                            </Form.Item>
                                            {meetingType == 'spring' && (
                                                <Form.Item
                                                    name="notes"
                                                    className="col-lg-6 col-sm-12"
                                                    label="Note"
                                                >
                                                    <TextArea
                                                        size={'large'}
                                                        placeholder="Note.."
                                                    />
                                                </Form.Item>)}
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
