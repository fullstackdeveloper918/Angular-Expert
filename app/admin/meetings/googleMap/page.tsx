"use client"
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef } from 'react';
import { Col, Row, Card, Typography, Form, Button, Select, Input } from 'antd';
import MainLayout from '@/app/layouts/page';
import dynamic from 'next/dynamic';
const { Option } = Select;
const { TextArea } = Input;
const Page = () => {
    const [form] = Form.useForm();
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
                    // Handle place data if needed
                });
            }
        };
        loadGoogleMapScript();
        // Cleanup function if needed
        return () => {
            // Cleanup code if any
        };
    }, []);
    const onFinish = (values:any) => {
        // Handle form submission
    };
    return (
        <MainLayout>
            <Row justify="center" gutter={[20, 20]} className='heightCenter'>
                <Col sm={22} md={20} lg={16} xl={14} xxl={12}>
                    <Card className='common-card'>
                        <div className='mb-4'>
                            <Typography.Title level={3} className='m-0 fw-bold'>Add Meeting</Typography.Title>
                        </div>
                        <div className='card-form-wrapper'>
                            <Form
                                form={form}
                                name="add_meeting"
                                onFinish={onFinish}
                                className="add-meeting-form"
                                scrollToFirstError
                                layout='vertical'
                            >
                                <Form.Item
                                    name="address"
                                    label="Location"
                                    rules={[{ required: true, whitespace: true, message: 'Please enter a location' }]}
                                >
                                    <input
                                        className="custom-input"
                                        ref={(ref:any) => (locationSearchRef.current = ref)}
                                        placeholder="Enter your address"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Add Meeting
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Card>
                </Col>
            </Row>
        </MainLayout>
    );
};
export default Page;