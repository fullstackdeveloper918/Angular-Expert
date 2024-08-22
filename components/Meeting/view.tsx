"use client";
import dynamic from "next/dynamic";
import Link from "next/link";

import { Breadcrumb, Spin, Tooltip, Typography } from "antd";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "../../components/Layout/layout";
// import api from "@/utils/api";
import axios from "axios";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
// import Pdf from "@/app/common/Pdf";
import { toast, ToastContainer } from "react-toastify";
import Pdf from "../common/Pdf";
import { DownloadOutlined, ShareAltOutlined } from "@ant-design/icons";
import { destroyCookie, parseCookies } from "nookies";
import { useSelector } from "react-redux";
// import validation from "@/utils/validation";
import dayjs from "dayjs";
// import { clearUserData } from "@/lib/features/userSlice";
import airportData from "../../jsonFiles/airports.json"
import { clearUserData } from "../../lib/features/userSlice";
import api from "../../utils/api";
import validation from "../../utils/validation";
const { Row, Col, Card, Button, Space, Popconfirm } = {
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
  Space: dynamic(() => import("antd").then((module) => module.Space), {
    ssr: false,
  }),
  Popconfirm: dynamic(
    () => import("antd").then((module) => module.Popconfirm),
    { ssr: false }
  ),
};
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
interface StaffDetailInterface {
  is_blocked: boolean;
  email?: string;
  firstname?: string;
  lastname?: string;
  profile_pic?: any;
  roles?: Array<any>;
  country_code?: number;
  mobile?: number;
  _id: string;
}
const MeetingViewPage = () => {
  const [loading, setLoading] = useState(false)
  const getUserdata = useSelector((state: any) => state?.user?.userData)

  const [state, setState] = React.useState<any>({
    id: "",
    name: "",
    hotel:"",
    company: "",
    email: "",
    phone: "",
    position: "",
    home: "",
    is_activate: "",
    is_archive: ""
  })

  const router = useRouter()
  const [isActive, setIsActive] = useState(false);
  const searchParam = useParams();
  const cookies = parseCookies();
  const accessToken = cookies.COOKIES_USER_ACCESS_TOKEN;
  const id: any = searchParam.id;
const data={
  hotel:"Asheville, NC 28801"
}
  const hotelAddress=state?.hotel
  const [address, setAddress] = useState(data?.hotel || "");
  const [latitude, setLatitude] = useState<any>(null);
  const [longitude, setLongitude] = useState<any>(null);
  const geocodeAddress = async (address: string) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address,
            key: 'AIzaSyDVyNgUZlibBRYwSzi7Fd1M_zULyKAPLWQ'
          }
        }
      );

      const { results } = response.data;
      // if (results && results.length > 0) {
      const location = results[0].geometry.location;
      setLatitude(location.lat);
      setLongitude(location.lng);
      // } else {
      // }

    } catch (error) {
    }
  };
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
       

        setNext7DaysWeather(formattedWeather);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setNext7DaysWeather([]);
      }
    };

    fetchAndFilterWeather(latitude, longitude, currentDate, endDate);
  }, [latitude, longitude, currentDate, endDate]);

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
      setAddress(data)
      //   form.setFieldsValue(data);
    } catch (error: any) {
      if (error?.status == 400) {
        destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
        dispatch(clearUserData({}));
        localStorage.removeItem('hasReloaded');
        // }
        toast.error("Session Expired Login Again")
        router.replace("/auth/signin")
      }
    }
  };

  useEffect(() => {
    // if (id) {
    getDataById();
    geocodeAddress(address);
    // }
  }, []);
  const generatePdf = async () => {
    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
    const blob = await pdf(<Pdf state={state} />).toBlob();
    const pdfUrl = URL.createObjectURL(blob);
    return { blob, pdfUrl, timestamp };
  };

  // Function to handle PDF download
  const downLoadPdf = async () => {
    const { blob, timestamp } = await generatePdf();
    saveAs(blob, `Order_${timestamp}.pdf`);
  };

  // Function to handle PDF sharing
  const sharePdf = async () => {

    const { pdfUrl, timestamp } = await generatePdf();
    const response = await fetch(pdfUrl);
    const blob = await response.blob();

    // Convert the blob to a file
    const file = new File([blob], `Order_${timestamp}.pdf`, { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', file);


    const res = await fetch('https://frontend.goaideme.com/save-pdf', {
      // const res = await fetch('https://app-uilsndszlq-uc.a.run.app/save-pdf', {

      method: 'POST',
      body: formData,
      headers: {
        Token: `${accessToken}`,
        // 'Content-Type': 'application/json',
      }
    },);

    const apiRes: any = await res.json()
    navigator.clipboard.writeText(apiRes?.fileUrl)
      .then(() => {
        toast.success('Link copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy link to clipboard');
      });

    //   })
    //   toast.success('Link Share Successfully', {
    //     position: 'top-center',
    //     autoClose: 300,

    //   });

    // Optionally, open the PDF in a new tab
    // window.open(pdfUrl, '_blank');
  };

  const formatWithOrdinal = (date: any) => {
    const day = dayjs(date).date();

    const getOrdinalSuffix = (day: any) => {
      const j = day % 10,
        k = day % 100;
      if (j === 1 && k !== 11) {
        return day + "st";
      }
      if (j === 2 && k !== 12) {
        return day + "nd";
      }
      if (j === 3 && k !== 13) {
        return day + "rd";
      }
      return day + "th";
    };

    const monthYear = dayjs(date).format('MMMM YYYY');
    const formattedDate = `${dayjs(date).format('MMMM')} ${getOrdinalSuffix(day)}, ${dayjs(date).format('YYYY')}`;
    return formattedDate;
  };
  const [hotelName, hotelAddress1] = state?.hotel.split(/,(.+)/);
  const findAirportCode = (airportName: string) => {
    const airport = airportData.find((a:any) => a.name === airportName);
    return airport ? airport.iata : "N/A";
  };
  const airportCode = state?.airport ? findAirportCode(state.airport) : "N/A";
  return (
    <MainLayout>
      <Fragment>
        <section className="antShadow">
          <Spin spinning={loading}>
            <Row gutter={[20, 20]}>
              <Col xs={24} sm={24} md={12} lg={11} xl={10} xxl={9} className='mx-auto'>
                <Card className='common-card'>
                  <div className='mb-4'>
                    <Breadcrumb separator=">">
                      <Breadcrumb.Item><Link href="/admin/dashboard" className='text-decoration-none'>Home</Link></Breadcrumb.Item>
                      {getUserdata?.is_admin == true &&
                        <Breadcrumb.Item><Link href="/admin/meetings" className='text-decoration-none'>Meeting</Link></Breadcrumb.Item>}
                      {/* {getUserdata?.is_admin==false &&
                    <Breadcrumb.Item><Link href="/admin/meetings/past_meeting" className='text-decoration-none'>Past Meeting</Link></Breadcrumb.Item>} */}
                      {/* <Breadcrumb.Item className='text-decoration-none'>{getUserdata?.is_admin==false?"Past":""} Meeting Details</Breadcrumb.Item> */}
                      <Breadcrumb.Item className='text-decoration-none'> Meeting Details</Breadcrumb.Item>
                    </Breadcrumb>
                  </div>
                  {/* Title  */}
                  <div className='d-flex justify-content-between'>
                    <div className="">

                      {/* <Typography.Title level={3} className='m-0 fw-bold'>{getUserdata?.is_admin==false?"Past":""} Meeting Details</Typography.Title> */}
                      <Typography.Title level={3} className='m-0 fw-bold'>Meeting Details</Typography.Title>
                    </div>
                    <div className=" ">
                      {/* <Tooltip title="Download Pdf">
                      <Button className='ViewMore ' onClick={downLoadPdf}><DownloadOutlined /></Button>
                    </Tooltip> */}

                      {/* <Tooltip title="Share Pdf link">
                      <Button className='ViewMore ' onClick={sharePdf}><ShareAltOutlined /></Button>
                    </Tooltip> */}

                    </div>
                  </div>
                  {/* Car Listing  */}
                  <div className='card-listing'>

                    <ul className='list-unstyled my-4 mb-4'>
                      <li className='mb-3'><Typography.Text >Meeting Type:</Typography.Text > <Typography.Text className='ms-1 text-capitalize'>{`${validation.capitalizeFirstLetter(state?.meeting_type)}` || 'N/A'} {dayjs(state?.start_meeting_date).format("YYYY") || "N/A"}</Typography.Text ></li>
                      <li className='mb-3'><Typography.Text >Location:</Typography.Text > <Typography.Text className='ms-1'>{validation.capitalizeFirstLetter(state?.location) || "N/A"}</Typography.Text ></li>
                      <li className='mb-3'><Typography.Text >Meeting Dates:</Typography.Text > <Typography.Text className='ms-1'>{formatWithOrdinal(state?.start_meeting_date) || "N/A"} to {formatWithOrdinal(state?.end_meeting_date) || "N/A"} </Typography.Text ></li>
                      <li className='mb-3'><Typography.Text >Hotel:</Typography.Text > <Typography.Text className='ms-1'>{hotelName || "N/A"}</Typography.Text ></li>
                      <li className='mb-3'><Typography.Text >Hotel Address:</Typography.Text > <Typography.Text className='ms-1'>{hotelAddress1 || "N/A"}</Typography.Text ></li>
                      <li className='mb-3'><Typography.Text >Nearest Airport:</Typography.Text > <Typography.Text className='ms-1'>{state?.airport?`${state?.airport}, (${airportCode})` : "N/A"}</Typography.Text ></li>
                      <li className='mb-3'><Typography.Text >Host Company:</Typography.Text > <Typography.Text className='ms-1'>{state?.host_company || "N/A"}</Typography.Text ></li>
                      <li className='mb-3'><Typography.Text >Host:</Typography.Text > <Typography.Text className='ms-1'>{state?.host || "N/A"}</Typography.Text ></li>
                      <li className='mb-3'><Typography.Text >Cell:</Typography.Text > <Typography.Text className='ms-1'>{state?.cell || "N/A"}</Typography.Text ></li>
                      <li className='mb-3'>
                        <Typography.Text>Weather:</Typography.Text>
                        <Typography.Text
                          className='weather-container ms-1'
                          style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', overflowX: 'auto' }}
                        >
                          {next7DaysWeather.map(({ day, icon, temp }:any) => (
                            <div
                              key={day}
                              className="weather-day"
                              style={{ display: 'flex', flexDirection: 'column', color: "#000000", alignItems: 'center', margin: '0 10px' }}
                            >
                              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{day}</span>
                              <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                                <span style={{ fontSize: '24px', marginRight: '10px' }}>{icon}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                                <span style={{ fontSize: '12px' }}> {((temp * 9) / 5 + 32).toFixed(1)}°F</span>
                              </div>
                            </div>
                          ))}
                        </Typography.Text>
                      </li>


                      {state?.meeting_type == "spring" &&
                        <li className='mb-3'><Typography.Text >Note:</Typography.Text > <Typography.Text className='ms-1'>{state?.notes || "N/A"}</Typography.Text ></li>}
                    </ul>
                    {/* Button  */}
                    {getUserdata?.is_admin == true &&
                      <div className='card-listing-button d-inline-flex flex-wrap gap-3 w-100'>
                        <Link href={`/admin/meetings/${state?.id}/edit`} className='text-decoration-none text-white flex-grow-1'>
                          <Button size='large' type="primary" htmlType='button' className='w-100 primaryBtn'>
                            Edit
                          </Button>
                        </Link>
                      </div>}
                  </div>
                </Card>
              </Col>
            </Row>
          </Spin>
        </section>
      </Fragment>
    </MainLayout>
  );
};
export default MeetingViewPage;
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}

