"use client"
import { Breadcrumb, Form, Select, Input, Upload, Modal, message, Typography, SelectProps } from 'antd';
import dynamic from 'next/dynamic';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { Fragment, useEffect, useState } from 'react'
import Link from 'next/link';
import validation from '@/utils/validation';
import MainLayout from '@/app/layouts/page';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import EmployeeRoles from '@/utils/EmployeeRoles.json'
import api from '@/utils/api';
const { Row, Col, Card, Button } = {
    Button: dynamic(() => import("antd").then(module => module.Button), { ssr: false }),
    Row: dynamic(() => import("antd").then(module => module.Row), { ssr: false }),
    Col: dynamic(() => import("antd").then(module => module.Col), { ssr: false }),
    Card: dynamic(() => import("antd").then(module => module.Card), { ssr: false }),
}
const { Option } = Select;
const Page = () => {

    const router = useRouter()
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [state, setState] = useState<any>("")
    const searchParam = useParams()
    const searchParams = useSearchParams();
    const entries = Array.from(searchParams.entries());
    const value = entries.length > 0 ? entries[0][0] : '';
    const id: any = searchParam.id;



    const [inputFields, setInputFields] = useState([
        { name: 'goal_next', label: 'Goal 1:', status1: 'Select...' }
    ]);

    const addInputField = () => {
        setInputFields([
            ...inputFields,
            { name: `goal_next${inputFields.length + 1}`, label: `Goal ${inputFields.length + 1}:`, status1: 'Select...' }
        ]);
    };

    const removeInputField = (index: any) => {
        const newInputFields = inputFields.filter((_, i) => i !== index);
        setInputFields(newInputFields.map((field, i) => ({
            name: `goal_next${i + 1}`,
            label: `Goal ${i + 1}:`,
            status1: field.status1 // maintain the status
        })));
    };

    const handleStatusChange1 = (index: any, value: any) => {
        setInputFields(inputFields.map((field, i) => i === index ? { ...field, status1: value } : field));
    };
    const [inputPairs, setInputPairs] = useState([
        { id: 1, goalName: 'goal1', goalLabel: 'GOAL #1', commentName: 'comments1', commentLabel: 'Comments:', status: 'Select...' }
    ]);

    const addInputPair = () => {
        const nextIndex = inputPairs.length + 1;
        setInputPairs([
            ...inputPairs,
            { id: nextIndex, goalName: `goal${nextIndex}`, goalLabel: `GOAL #${nextIndex}`, commentName: `comments${nextIndex}`, commentLabel: 'Comments:', status: 'Select...' }
        ]);
    };

    const removeInputPair = (id: any) => {
        setInputPairs(inputPairs.filter(pair => pair.id !== id));
    };

    const handleStatusChange = (id: any, value: any) => {
        setInputPairs(inputPairs.map(pair => pair.id === id ? { ...pair, status: value } : pair));
    };
    const submit = async (values: any) => {
        const goalsData = inputPairs.map(pair => ({
            goal: values[pair.goalName],
            comment: values[pair.commentName],
            status: pair.status
        }));
        const goalsData1 = inputFields.map(field => ({
            goal: values[field.name],
            status: field.status1
        }));
        let items = {
            goals: {
                userId: value,
                goal_last_meeting: goalsData,
                goal_next_meeting: goalsData1
            }
        }
        try {
            setLoading(true)
            let res = await api.Auth.signUp(items)

            router.push(`/admin/member/add/page4?${res?.userId}`)
        } catch (error) {

        } finally {
            setLoading(false)
        }


    }


    const getDataById = async () => {
        const item = {
            user_id: value
        }
        try {
            const res = await api.User.getById(item as any);
            setState(res?.data || null);
            const fetchedGoals = res?.data.goal_last_meeting || [];
            const formattedGoals = fetchedGoals.map((goal: any, index: any) => ({
                id: index + 1,
                goalName: `goal${index + 1}`,
                goalLabel: `GOAL #${index + 1}`,
                commentName: `comments${index + 1}`,
                commentLabel: 'Comments:',
                status: goal.status,
                initialGoal: goal.goal,
                initialComment: goal.comment
            }));
            setInputPairs(formattedGoals);
            form.setFieldsValue({
                ...fetchedGoals.reduce((acc: any, goal: any, index: any) => {
                    acc[`goal${index + 1}`] = goal.goal;
                    acc[`comments${index + 1}`] = goal.comment;
                    return acc;
                }, {})
            });
            const fetchedGoalsNext = res?.data.goal_next_meeting || [];
            const formattedGoalsNext = fetchedGoalsNext.map((goal: any, index: any) => ({
               
                
              name: `goal_next${index + 1}`,
              label: `Goal ${index + 1}:`,
              status1: goal.status,
              initialGoal1: goal.goal
            }));
      
            setInputFields(formattedGoalsNext);
      
            form.setFieldsValue({
            //   ...fetchedGoals.reduce((acc: any, goal: any, index: any) => {
            //     acc[`goal_next${index + 1}`] = goal.goal;
            //     acc[`comments${index + 1}`] = goal.comment;
            //     return acc;
            //   }, {}),
              ...fetchedGoalsNext.reduce((acc: any, goal: any, index: any) => {
                acc[`goal_next${index + 1}`] = goal.goal;
                return acc;
              }, {})
            });
        } catch (error: any) {
            alert(error.message);
        }
    };
    useEffect(() => {
        // if (id) {
        getDataById();
        // }
    }, []);
    const onPrevious = () => {
        router.back()
    }
    return (
        <MainLayout>
            <Fragment>

                <section>
                    <Row justify="center" gutter={[20, 20]}>
                        <Col sm={22} md={24} lg={11} xl={10} xxl={9}>
                            <Card className='common-card'>
                                {/* <div className='mb-4'>
                                    <Breadcrumb separator=">">
                                        <Breadcrumb.Item><Link href="/" className='text-decoration-none'>Home</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item><Link href="/admin/member" className='text-decoration-none'>User</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/member/add" className='text-decoration-none'>Add User</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item ><Link href="/admin/member/add/page2" className='text-decoration-none'>BUSINESS UPDATE</Link></Breadcrumb.Item>
                                    </Breadcrumb>
                                </div> */}
                                {/* Title  */}
                                <div className='mb-2 d-flex justify-content-between'>
                                    <Typography.Title level={3} className='m-0 fw-bold'>GOALS</Typography.Title>
                                    <Button size={'large'} type="primary" className="text-white" disabled>3/8</Button>
                                </div>

                                {/* form  */}
                                <div className='card-form-wrapper'>
                                    <div className='mt-3 mb-1'>
                                        <Typography.Title level={5} className='m-0 fw-bold'>GOALS FROM LAST MEETING</Typography.Title>
                                    </div>
                                    <Form form={form} name="add_staff" className="add-staff-form" scrollToFirstError layout='vertical' onFinish={submit}>
                                        {/* First Name  */}

                                        <div className="">
                                            {inputPairs.map((pair: any, index: any) => (
                                                <div key={pair.id} style={{ position: 'relative' }}>


                                                    <Form.Item
                                                        name={pair.goalName}
                                                        rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]}
                                                        label={pair.goalLabel}
                                                    >

                                                        <Input
                                                            size={'large'}
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
                                                    <Form.Item
                                                        name={pair.commentName}
                                                        rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]}
                                                        label={pair.commentLabel}
                                                    >
                                                        <Input
                                                            size={'large'}
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
                                                    {/* <div className="d-flex"> */}
                                                    {/* <Form.Item
                                                        name={pair.commentName}
                                                        rules={[{ required: true, whitespace: true, message: 'Please Select Field' }]}
                                                        style={{ position: 'absolute', top: '-7px', right: '88px', fontSize: '24px', cursor: 'pointer' }}
                                                        label="STATUS OF GOAL"
                                                    > */}
                                                    <Select
                                                        defaultValue={pair.status}
                                                        style={{ position: 'absolute', top: '-14px', right: '0px', fontSize: '24px', cursor: 'pointer', width: 120 }}
                                                        onChange={(value) => handleStatusChange(pair.id, value)}>
                                                        <Option value="completed">Completed</Option>
                                                        <Option value="progressing">Progressing</Option>
                                                        <Option value="struggling">Struggling</Option>
                                                        <Option value="not_started">Not Started</Option>
                                                    </Select>
                                                    {/* </Form.Item> */}
                                                    {/* </div> */}
                                                    {inputPairs.length > 1 && (
                                                        <MinusCircleOutlined
                                                            style={{ position: 'absolute', top: '0', right: '0', fontSize: '24px', cursor: 'pointer' }}
                                                            onClick={() => removeInputPair(pair.id)}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                            <Button type="dashed" onClick={addInputPair} block icon={<PlusOutlined />}>
                                                Add Goal and Comment
                                            </Button>
                                        </div>
                                        <div className='mt-3 mb-1'>
                                            <Typography.Title level={5} className='m-0 fw-bold'>GOALS FOR NEXT MEETING</Typography.Title>
                                        </div>
                                        <div className="">
                                            {inputFields.map((field, index) => (
                                                
                                                <Form.Item
                                                    key={field.name}
                                                    name={field.name}
                                                    rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]}
                                                    label={field.label}
                                                    // initialValue={field.initialGoal}
                                                >
                                                    <div style={{ position: 'relative' }}>
                                                        <Input
                                                            size={'large'}
                                                            placeholder="Enter..."
                                                            onKeyPress={(e: any) => {
                                                                if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                                    e.preventDefault();
                                                                } else {
                                                                    e.target.value = String(e.target.value).trim();
                                                                }
                                                            }}
                                                        />
                                                        <Select
                                                            defaultValue={field.status1}
                                                            style={{ position: 'absolute', top: '-42px', right: '0px', fontSize: '24px', cursor: 'pointer', width: 120 }}
                                                            onChange={(value) => handleStatusChange1(index, value)}
                                                            options={[
                                                                { value: 'high', label: 'High' },
                                                                { value: 'medium', label: 'Medium' },
                                                                { value: 'low', label: 'Low' },
                                                            ]}
                                                        />
                                                        {inputFields.length > 1 && (
                                                            <MinusCircleOutlined
                                                                style={{ position: 'absolute', top: '-30px', right: '0', fontSize: '24px', cursor: 'pointer' }}
                                                                onClick={() => removeInputField(index)}
                                                            />
                                                        )}
                                                    </div>
                                                </Form.Item>
                                            ))}
                                            <Button type="dashed" onClick={addInputField} block icon={<PlusOutlined />}>
                                                Add Goal
                                            </Button>
                                        </div>
                                        {/* Button  */}
                                        <div className="d-flex gap-3 justify-content-center">
                                            <Button size={'large'} type="primary" className="login-form-button " loading={loading} onClick={onPrevious}>
                                                Previous
                                            </Button>
                                            <Button size={'large'} type="primary" htmlType="submit" className="login-form-button " loading={loading}>
                                                Next
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
    )
}

export default Page