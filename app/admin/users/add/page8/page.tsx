"use client"
import { Breadcrumb, Form, Select, Input, Upload, Modal, message, Typography, SelectProps, Divider } from 'antd';
import { Head } from 'next/document';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Fragment, useState } from 'react'
import Link from 'next/link';
import validation from '@/utils/validation';
import MainLayout from '@/app/layouts/page';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import EmployeeRoles from '@/utils/EmployeeRoles.json'
import { Image } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import api from '@/utils/api';
const { Row, Col, Card, Button } = {
    Button: dynamic(() => import("antd").then(module => module.Button), { ssr: false }),
    Row: dynamic(() => import("antd").then(module => module.Row), { ssr: false }),
    Col: dynamic(() => import("antd").then(module => module.Col), { ssr: false }),
    Card: dynamic(() => import("antd").then(module => module.Card), { ssr: false }),
}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
const page = () => {

    const router = useRouter()
    const [form] = Form.useForm();
    const [inputPairs, setInputPairs] = useState([{ id: Date.now(), goalName: 'goal1', goalLabel: 'Project 1', commentName: 'comment1', commentLabel: 'Comment 1' }]);
    const [fileLists, setFileLists] = useState<Record<string, UploadFile<any>[]>>({});
    const [previewImage, setPreviewImage] = useState<any>('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePreview = async (file: UploadFile<any>) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = (info: any, id: string) => {
        const newFileLists = { ...fileLists, [id]: info.fileList };
        setFileLists(newFileLists);
    };
    const addInputPair = () => {
        const newId = Date.now();
        setInputPairs([
            ...inputPairs,
            { id: newId, goalName: `goal${newId}`, goalLabel: `Project ${inputPairs.length + 1}`, commentName: `comment${newId}`, commentLabel: `Comment ${inputPairs.length + 1}` }
        ]);
    };


    const removeInputPair = (id: number) => {
        setInputPairs(inputPairs.filter(pair => pair.id !== id));
        const newFileLists = { ...fileLists };
        delete newFileLists[id];
        setFileLists(newFileLists);
    };

    const searchParams = useSearchParams();
    const entries = Array.from(searchParams.entries());
    const value = entries.length > 0 ? entries[0][0] : '';
    const uploadFiles = async (files: UploadFile<any>[]) => {
        // const urls = [];
        for (const file of files) {
            if (file.originFileObj) {
                // Implement the actual upload to your API and get the URL
                const formData = new FormData();
                formData.append('file', file.originFileObj);
                // const res = await api.upload(formData);
                // urls.push(res.url);
            }
        }
        // return urls;
    };

    const submit = async (values: any) => {

        // let item = {
        //     photo_section: {
        //         userId:value,
        //         photo_comment: inputPairs
        //     }
        // }
        // console.log(item,"chchhchc");

        try {
            const photoComment = [];
            for (const pair of inputPairs) {
                const fileUrls = await uploadFiles(fileLists[pair.id] || []);
                photoComment.push({
                    goal: values[pair.goalName],
                    comment: values[pair.commentName],
                    files: fileUrls,
                });
            }
            const item = {
                photo_section: {
                    userId: value,
                    photo_comment: photoComment,
                }
            };
            setLoading(true)
            let res = await api.Auth.signUp(item)
            console.log(res, "ggsadsdssdfhgh");
        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false)
        }
    };

    return (
        <MainLayout>
            <Fragment>

                <section>
                    <Row justify="center" gutter={[20, 20]}>
                        <Col sm={22} md={24} lg={11} xl={10} xxl={9}>
                            <Card className='common-card'>
                                <div className='mb-4'>
                                    <Breadcrumb separator=">">
                                        <Breadcrumb.Item><Link href="/" className='text-decoration-none'>Home</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item><Link href="/admin/users" className='text-decoration-none'>User</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/users/add" className='text-decoration-none'>Add User</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/users/add/page2" className='text-decoration-none'>BUSINESS UPDATE</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/users/add/page3" className='text-decoration-none'>GOALS</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/users/add/page4" className='text-decoration-none'>CRAFTSMEN TOOLBOX</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/users/add/page5" className='text-decoration-none'>CRAFTSMEN CHECK-UP</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/users/add/page6" className='text-decoration-none'>2023 MEETING REVIEW</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/users/add/page7" className='text-decoration-none'>2024 MEETING PREPARATION</Link></Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                                {/* Title  */}
                                <div className='mb-2'>
                                    <Typography.Title level={3} className='m-0 fw-bold'>PHOTO SECTION</Typography.Title>
                                </div>

                                {/* form  */}
                                <div className='card-form-wrapper'>
                                    <div className='mt-3 mb-1'>
                                        <Typography.Title level={5} className='m-0 fw-bold'>Share photos of current projects or additional information regarding comments in your
                                            update.
                                        </Typography.Title>
                                    </div>
                                    <div className='mt-3 mb-1'>
                                        <Typography.Title level={5} className='m-0 fw-bold'>Please paste a dropbox link for each project in the boxes indicated below, and write a brief
                                            summary of each project in the comment section
                                        </Typography.Title>
                                    </div>
                                    <Divider plain></Divider>
                                    <Form form={form} name="add_staff" className="add-staff-form" scrollToFirstError layout='vertical' onFinish={submit}>
                                        <div>
                                            {inputPairs.map((pair) => (
                                                <div key={pair.id} style={{ position: 'relative' }}>
                                                    <Form.Item
                                                        name={pair.goalName}
                                                        // rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]}
                                                        label={pair.goalLabel}
                                                    >
                                                        <Upload
                                                            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                                            listType="picture-card"
                                                            fileList={fileLists[pair.id] || []}
                                                            onPreview={handlePreview}
                                                            onChange={(info) => handleChange(info, pair.id.toString())}
                                                        >
                                                            {(fileLists[pair.id] || []).length >= 8 ? null : <PlusOutlined />}
                                                        </Upload>
                                                        {previewImage && (
                                                            <Image
                                                                wrapperStyle={{ display: 'none' }}
                                                                preview={{
                                                                    visible: previewOpen,
                                                                    onVisibleChange: (visible) => setPreviewOpen(visible),
                                                                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                                                }}
                                                                src={previewImage}
                                                            />
                                                        )}
                                                    </Form.Item>
                                                    <Form.Item
                                                        name={pair.commentName}
                                                        rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]}
                                                        label={pair.commentLabel}
                                                    >
                                                        <Input
                                                            size="large"
                                                            placeholder="Enter..."
                                                            onKeyPress={(e: any) => {
                                                                if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                                    e.preventDefault();
                                                                } else {
                                                                    e.target.value = String(e.target.value).trim();
                                                                }
                                                            }}
                                                        />
                                                    </Form.Item>
                                                    {inputPairs.length > 1 && (
                                                        <MinusCircleOutlined
                                                            style={{ position: 'absolute', top: '0', right: '0', fontSize: '24px', cursor: 'pointer' }}
                                                            onClick={() => removeInputPair(pair.id)}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                            <Button type="dashed" onClick={addInputPair} block icon={<PlusOutlined />}>
                                                Add Project and Comment
                                            </Button>
                                        </div>
                                        <Button size="large" type="primary" htmlType="submit" className="login-form-button w-100 mt-2" loading={loading}>
                                            Submit
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