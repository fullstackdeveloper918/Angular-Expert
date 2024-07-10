"use client";
import { Table, Input, Breadcrumb, Typography, Space, Form, Popover, Popconfirm, Select } from 'antd';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import Icons from './Icons';
import { PlusOutlined } from '@ant-design/icons'
const { Row, Col, Card, Button, Pagination } = {
    Button: dynamic(() => import("antd").then(module => module.Button), { ssr: false }),
    Row: dynamic(() => import("antd").then(module => module.Row), { ssr: false }),
    Col: dynamic(() => import("antd").then(module => module.Col), { ssr: false }),
    Card: dynamic(() => import("antd").then(module => module.Card), { ssr: false }),
    Pagination: dynamic(() => import("antd").then(module => module.Pagination), { ssr: false }),
};
const { Option } = Select;
const AntModal = dynamic(() => import("antd").then(module => module.Modal), { ssr: false });

const CustomModal = (props: any) => {
    console.log(props, "props");

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(null as any);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();

    const addGenre = async (values: any) => {
        console.log("addGenre values", values);
        setAddLoading(true);
        try {
            let items = {
                name: String(values.addGenre).trim()
            };
            // let apiRes = await henceforthApi.ID_Proof.create(items)
            // Toast.success("ID Proof Added Successfully")
            // addForm.resetFields()
            // await initialise()
        } catch (error) {
            // Toast.error(error)
            console.log("error", error);
        } finally {
            setAddLoading(false);
            setAddModalOpen(false);
        }
    };
    const [formValues, setFormValues] = useState<any>({});

    const handleValuesChange = (changedValues: any, allValues: any) => {
        setFormValues(allValues);
        if (changedValues.questions) {
            console.log("Questions field value:", changedValues.questions);
        }
    };

    return (
        <>
            <div className="">
                {props?.type === "Add" ?
                    <Button type="primary" htmlType="button" size={'large'} onClick={() => setAddModalOpen(true)}><PlusOutlined/>Add New Questions</Button> :
                    <Button type="text" className='px-0 border-0 bg-transparent shadow-none' onClick={() => setAddModalOpen(true)}><i className="fa-solid fa-pen-to-square"></i></Button>}
                <AntModal
                    centered
                    title={`${props?.type} Questions for Meeting`}
                    open={addModalOpen}
                    footer={null}
                    onCancel={() => setAddModalOpen(false)}
                >
                    <Form
                        name="idAdd"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={{ remember: true }}
                        onFinish={addGenre}
                        form={addForm}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="questions"
                            label={`${props?.type} Questions`}
                            rules={[{ required: true, whitespace: true, message: `Please Enter valid ${props?.type} Questions` }]}
                        >
                            <Input size={'large'} placeholder={`${props?.type} Questions`} />
                        </Form.Item>
                        <Form.Item
                    name="type"
                    label={`${props?.type} Questions Type`}
                    rules={[{ required: true, message: `Please select a valid ${props?.type} Questions Type` }]}
                >
                    <Select size="large" placeholder={`${props?.type} Question Type`}>
                        <Option value="short_text">Short Text</Option>
                        <Option value="long_text">Long Text</Option>
                        <Option value="dropdown">Dropdown</Option>
                        <Option value="single_choice">Single Choice Checkbox</Option>
                        <Option value="multi_choice">Multi Choice Checkbox</Option>
                    </Select>
                </Form.Item>
                        <Space className='w-100 justify-content-end'>
                            <Button type='default' onClick={() => setAddModalOpen(false)}>Cancel</Button>
                            <Button type='primary' htmlType='submit' block loading={addLoading} disabled={addLoading}>{props?.type}</Button>
                        </Space>
                    </Form>
                </AntModal>        
            </div>
        </>
    );
};

export default CustomModal;
