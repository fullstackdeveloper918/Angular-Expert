"use client"
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { Fragment, ReactNode, useEffect, useState } from 'react'
import { Input, Breadcrumb, Collapse, theme, Typography, Pagination, Popconfirm, Form, Table } from 'antd';
import Link from 'next/link';
import Icons from '@/app/common/Icons';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MainLayout from '@/app/layouts/page';
import CustomModal from '@/app/common/Modal';
import { EyeOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import api from '@/utils/api';
const { Row, Col, Card, Button } = {
    Button: dynamic(() => import("antd").then(module => module.Button), { ssr: false }),
    Row: dynamic(() => import("antd").then(module => module.Row), { ssr: false }),
    Col: dynamic(() => import("antd").then(module => module.Col), { ssr: false }),
    Card: dynamic(() => import("antd").then(module => module.Card), { ssr: false }),
}

const { Panel } = Collapse;
const { Search } = Input;
let timer: any
const page = () => {
    const { token } = theme.useToken();
    const router = useRouter();

    // const { Toast, loading, setLoading } = React.useContext(GlobalContext)
    const [deleteLoading, setDeleteLoading] = React.useState("")
    const [state, setState] = React.useState({
        data: [] as any,
        count: 0
    })



    const panelStyle = {
        marginBottom: 24,
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: '1px solid #e6e6e6',
    };
    const dataSource = [
        {
            key: '1',
            question: <p >
                <span>Describe your current financial position:</span>
            </p>,
            action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
                <li>
                    <CustomModal type={"Edit"} />
                </li>
                <li>
                    <Popconfirm
                        title="Delete"
                        description="Are you sure you want to delete ?"
                        onConfirm={(event) => { event?.stopPropagation(); handleDelete("res._id") }}
                    // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
                    >
                        <Button type="text" danger htmlType='button' className='px-0' ><i className="fa-solid fa-trash-can"></i></Button>
                    </Popconfirm>
                </li>
            </ul>
        },
        {
            key: '2',
            question:
                <p >
                    <span>Describe your current sales positions, hot prospects, recently contracted work:</span>
                </p>,
            action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
                <li>
                    <CustomModal type={"Edit"} />
                </li>
                <li>
                    <Popconfirm
                        title="Delete"
                        description="Are you sure you want to delete ?"
                        onConfirm={(event) => { event?.stopPropagation(); handleDelete("res._id") }}
                    // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
                    >
                        <Button type="text" danger htmlType='button' className='px-0' ><i className="fa-solid fa-trash-can"></i></Button>
                    </Popconfirm>
                </li>
            </ul>
        },
        {
            key: '3',
            question: <p >
                <span>Describe your accomplishments in the last 6 months:</span>
            </p>,
            action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
                <li>
                    <CustomModal type={"Edit"} />
                </li>
                <li>
                    <Popconfirm
                        title="Delete"
                        description="Are you sure you want to delete ?"
                        onConfirm={(event) => { event?.stopPropagation(); handleDelete("res._id") }}
                    // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
                    >
                        <Button type="text" danger htmlType='button' className='px-0' ><i className="fa-solid fa-trash-can"></i></Button>
                    </Popconfirm>
                </li>
            </ul>
        },
        {
            key: '4',
            question: <p >
                <span>Describe your HR position &/or needs:</span>
            </p>,
            action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
                <li>
                    <CustomModal type={"Edit"} />
                </li>
                <li>
                    <Popconfirm
                        title="Delete"
                        description="Are you sure you want to delete ?"
                        onConfirm={(event) => { event?.stopPropagation(); handleDelete("res._id") }}
                    // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
                    >
                        <Button type="text" danger htmlType='button' className='px-0' ><i className="fa-solid fa-trash-can"></i></Button>
                    </Popconfirm>
                </li>
            </ul>
        },
        {
            key: '5',
            question: <p >
                <span>Describe any current challenges your business is facing (i.e. problem client, personnel issue(s), trade availability, rising costs, supply chain, etc.):</span>
            </p>,
            action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
                <li>
                    <CustomModal type={"Edit"} />
                </li>
                <li>
                    <Popconfirm
                        title="Delete"
                        description="Are you sure you want to delete ?"
                        onConfirm={(event) => { event?.stopPropagation(); handleDelete("res._id") }}
                    // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
                    >
                        <Button type="text" danger htmlType='button' className='px-0' ><i className="fa-solid fa-trash-can"></i></Button>
                    </Popconfirm>
                </li>
            </ul>
        },
    ];
    const columns = [
        {
            title: 'Key',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Questions',
            dataIndex: 'question',
            key: 'question',
        },

        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
    ];
    const onChangeRouter = (key: string, value: string) => {
        // router.replace({
        //     query: { ...router.query, [key]: value }
        // })
        console.log("router query");
    }

    const onSearch = (value: string) => {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            onChangeRouter("search", String(value).trim())
        }, 2000);
    }

    const handlePagination = (page: number, pageSize: number) => {
        // router.replace({
        //     query: { ...router.query, pagination: page, limit: pageSize }
        // })
    }

    const initialise = async () => {
        try {
            // setLoading(true)
            let res=api.Manage_Question.listing()
            setState(res)
        } catch (error) {
            // Toast.error(error)
            console.log(error);
            

        } finally {
            // setLoading(false)
        }
    }

    // useEffect(() => {
    //     initialise()
    // }, [])

    const handleDelete = async (_id: string) => {
        setDeleteLoading(_id)
        try {
            // let apiRes = await henceforthApi.Faq.delete(_id)
            // Toast.success("FAQ is deleted successfully")
            await initialise()
        } catch (error) {
            console.log(error)
        } finally {
            setDeleteLoading("")
        }

    }

    // console.log('props', props);
    // const [addModalOpen, setAddModalOpen] = useState<any>(false);
    const genExtra = (res: any) => (<ul className='list-unstyled mb-0 gap-3 d-flex'>
        <li>
            <Link href={`/faq/${res._id}/edit`} >
                <Button type="text" className='px-0 border-0 bg-transparent shadow-none'><Icons.Edit /></Button>
            </Link>
        </li>
        <li>
            <Popconfirm
                title="Delete"
                description="Are you sure you want to delete ?"
                onConfirm={(event) => { event?.stopPropagation(); handleDelete(res._id) }}
                okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
            >
                <Button type="text" danger htmlType='button' className='px-0' ><i className="fa-solid fa-trash-can"></i></Button>
            </Popconfirm>
        </li>
    </ul>)


    const addQuestion = (values: any) => {
        let item = {
            question: values.questions,
            question_type: values.questions_type
        }
        try {
            let res = api.Manage_Question.create(item as any)
            console.log(res, "resCheck");

        } catch (error) {
            console.log(error);

        }
    }
    return (
        <MainLayout>
            <Fragment>
                {/* <Head>
        <title>FAQs</title>
        <meta name="description" content="FAQs" />
    </Head> */}
                <section>

                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <Card className='common-card'>
                                <div className='mb-4'>
                                    <Breadcrumb separator=">">
                                        <Breadcrumb.Item><Link className='text-decoration-none' href="/">Home</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item className='text-decoration-none'>Manage Questions for Meeting</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                                {/* Title  */}
                                <div className='d-flex justify-content-between align-items-center'>
                                    <Typography.Title level={3} className='m-0 fw-bold' >Manage Questions for Meeting</Typography.Title>
                                </div>
                                {/* Search  */}
                                <div className='my-4 d-flex justify-content-between align-items-center gap-3'>
                                    <Search size="large" placeholder="Search..." onSearch={onSearch} onChange={(e) => onSearch(e.target.value)} enterButton />
                                    <CustomModal type={"Add"} addQuestion={addQuestion}/>
                                    {/* <Button size='large' type="primary" icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)}>Add Id Proof</Button> */}
                                </div>

                                {/* Accordion  */}

                                <div className='accordion-wrapper'>
                                    <Table dataSource={dataSource} columns={columns} pagination={false} />
                                </div>
                                {/* <Pagination current={Number(router.query.pagination) || 1} pageSize={Number(router.query.limit) || 10} total={state.count} hideOnSinglePage={true} disabled={loading} onChange={handlePagination} /> */}
                            </Card>
                        </Col>
                    </Row>


                </section>
            </Fragment >
        </MainLayout>
    )
}

export default page