"use client";
import React, { Fragment, useEffect, useState } from "react";
import { Input, Breadcrumb, Typography, Table, Card, Col, Row, Tooltip, Button, Collapse, theme, Popconfirm } from "antd";
import MainLayout from "../../components/Layout/layout";
import dynamic from "next/dynamic";
import Link from "next/link";
import QuestionFilter from "@/components/common/QuestionFilter";
import api from "@/utils/api";
import QuestionanirModal from "../common/QuestionnairModal";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { pdf } from "@react-pdf/renderer";
import saveAs from "file-saver";
import QuestionnairPdf from "../common/QuestionnairPdf"
import { useSelector } from "react-redux";
const { Panel } = Collapse;
const { Search } = Input;
let timer: any;
const { Title } = Typography;
const QuestionnairList = () => {
    const getUserdata = useSelector((state: any) => state?.user?.userData)
    console.log(getUserdata, "getUserdata");

    const [questionType, setQuestionType] = useState<any>(null);
    const { token } = theme.useToken();
    //   getUserdata?.user_id
    const [state, setState] = useState<any>([])
    const [state1, setState1] = useState<any>("")

    const dataSource2 = [
        {
            key: '1',
            question: <p >
                <span>Describe your current financial position:</span>
            </p>,

        },
        {
            key: '2',
            question:
                <p >
                    <span>Describe your current sales positions, hot prospects, recently contracted work:</span>
                </p>,

        },
        {
            key: '3',
            question: <p >
                <span>Describe your accomplishments in the last 6 months:</span>
            </p>,

        },
        {
            key: '4',
            question: <p >
                <span>Describe your HR position &/or needs:</span>
            </p>,

        },
        {
            key: '5',
            question: <p >
                <span>Describe any current challenges your business is facing (i.e. problem client, personnel issue(s), trade availability, rising costs, supply chain, etc.):</span>
            </p>,

        },
    ];
    const dataSource = state?.map((res: any, index: number) => {
        return {
            key: index + 1,
            question:
                <p >
                    <span>{res?.question}:</span>
                </p>,


        }
    })
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


    ];
    const getDataById = async () => {
        const item = {
            user_id: getUserdata?.user_id
        }
        try {
            const res = await api.Questionnair.downloadPdf(item as any);
            setState(res?.data || null);
        } catch (error: any) {
            alert(error.message);
        }
    };
    const initialise = async (questionType: any) => {
        try {

            const params: any = questionType ? { searchFilter: questionType } : {};
            let res = await api.Questionnaire.listing(params);
            console.log(res, "qwqwqwqw");

            setState(res.data);
        } catch (error) {
            // Toast.error(error)
            console.log(error);
        } finally {
            // setLoading(false)
        }
    };

    useEffect(() => {
        initialise(questionType);
        // getDataById()
    }, [questionType]);
    const handleChange = (value: any) => {
        setQuestionType(value);
    };
    console.log(questionType, "tyrytryy");
    const generatePdf = async () => {
        const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
        const blob = await pdf(<QuestionnairPdf state={state} />).toBlob();
        const pdfUrl = URL.createObjectURL(blob);
        return { blob, pdfUrl, timestamp };
    };

    // Function to handle PDF download
    const downLoadPdf = async () => {
        const { blob, timestamp } = await generatePdf();
        saveAs(blob, `Order_${timestamp}.pdf`);
    };

    const handleDownloadAndFetchData = (id: any) => {
        // getDataById(id);
        downLoadPdf();
    };
    const handleFetchAndFetchData = (id: any) => {
        // getDataById(id);
        // sharePdf();
    };
    const panelStyle = {
        marginBottom: 24,
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: '1px solid #e6e6e6',
    };
    const genExtra = (res: any) => (<ul className='list-unstyled mb-0 gap-3 d-flex'>
        <li>
            <Link href={`/admin/questionnaire/${res?.id}`} >
                <Button type="text" className='px-0 border-0 bg-transparent shadow-none'><i className="fa-solid fa-pen-to-square"></i></Button>
            </Link>
        </li>


    </ul>)
    const data = [
        { title: 'Card 1', description: 'BUSINESS UPDATE', state: 0 },
        { title: 'Card 2', description: 'GOALS', state: 1},
        { title: 'Card 3', description: 'CRAFTSMEN TOOLBOX', state: 2 },
        { title: 'Card 4', description: 'CRAFTSMEN CHECK-UP', state: 3 },
        { title: 'Card 5', description: 'SPRING 2024 MEETING REVIEW', state: 4 },
        { title: 'Card 6', description: 'FALL 2024 MEETING PREPARATION', state: 5 },
        { title: 'Card 7', description: 'PHOTO SECTION', state: 6 },
        // Add more card data as needed
    ];
    const getLinkForState = (state: any) => {
        const baseURL = '/admin/member/add';
        switch (state) {
            case 0: return `${baseURL}/page2?${getUserdata?.user_id}&edit`;
            case 1: return `${baseURL}/page3?${getUserdata?.user_id}&edit`;
            case 2: return `${baseURL}/page4?${getUserdata?.user_id}&edit`;
            case 3: return `${baseURL}/page5?${getUserdata?.user_id}&edit`;
            case 4: return `${baseURL}/page6?${getUserdata?.user_id}&edit`;
            case 5: return `${baseURL}/page7?${getUserdata?.user_id}&edit`;
            case 6: return `${baseURL}/page8?${getUserdata?.user_id}&edit`;
            // Add more cases as needed
            default: return `${baseURL}/page-default?${getUserdata}&edit`;
        }
    };
    return (
        <MainLayout>
            <Fragment>
                <section>
                    {getUserdata?.is_admin == false ?
                        <Row gutter={[20, 20]}>
                            <Col span={24}>
                                <Card className='common-card'>
                                    <div>
                                        <div className='mb-4'>
                                            <Breadcrumb separator=">">
                                                <Breadcrumb.Item>Home</Breadcrumb.Item>
                                                <Breadcrumb.Item className='text-decoration-none'>Questionnaire</Breadcrumb.Item>
                                            </Breadcrumb>
                                        </div>
                                        <div className='d-flex justify-content-between align-items-center mb-5'>
                                            <Title level={3} className='m-0 fw-bold'>Questionnaire</Title>
                                        </div>

                                        <Row gutter={[20, 20]}>
                                            {data.map((item, index) => (
                                                <Col key={index} span={8}>
                                                    <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                        <div className="card-body pb-2 d-flex flex-column">
                                                            <div className="justify-content-between align-items-center d-flex">
                                                                <h5 className="fw-bold text-start mb-4">{item.description}</h5>
                                                                <Tooltip title="Download Pdf">
                                                                    <Button onClick={downLoadPdf}><DownloadOutlined /></Button>
                                                                </Tooltip>
                                                            </div>
                                                            <Link
                                                                href={getLinkForState(item.state)}
                                                                className='text-decoration-none text-white flex-grow-1'
                                                            >
                                                                <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                                    <div className="mt-2">
                                                                        <Button  >
                                                                            Update
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>

                                        <style jsx>{`
                           .common-card {
                               border-radius: 10px;
                               overflow: hidden;
                           }
           
                           .mb-4 {
                               margin-bottom: 16px;
                           }
           
                           .d-flex {
                               display: flex;
                           }
           
                           .justify-content-between {
                               justify-content: space-between;
                           }
           
                           .align-items-center {
                               align-items: center;
                           }
           
                           .card-title {
                               font-size: 1rem;
                               text-align: start;
                               margin-bottom: 16px;
                           }
           
                           .card-body {
                               display: flex;
                               flex-direction: column;
                            
                           }
           
                           .btn {
                                display: inline-block;
                    font-weight: 400;
                    color: #ffffff !important; /* Ensure text is white */
                    text-align: center;
                    vertical-align: middle;
                    cursor: pointer;
                    user-select: none;
                    background-color: #1890ff;
                    border: 1px solid transparent;
                    padding: 0.375rem 0.75rem;
                    font-size: 1rem;
                    line-height: 1.5;
                    border-radius: 0.25rem;
                    width: 100%;
                           }
           
                           .shadow-sm {
                              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                           }
           
                           .gap-2 {
                               gap: 8px;
                           }
           
                           .mt-auto {
                               margin-top: auto;
                           }
                       `}</style>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        :
                        <Row gutter={[20, 20]}>
                            <Col span={24}>
                                <Card className='common-card'>
                                    <div className='mb-4'>
                                        <Breadcrumb separator=">">
                                            <Breadcrumb.Item><Link className='text-decoration-none' href="/admin/dashboard">Home</Link></Breadcrumb.Item>
                                            <Breadcrumb.Item className='text-decoration-none'>Manage Questionnaire</Breadcrumb.Item>
                                        </Breadcrumb>
                                    </div>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <Typography.Title level={3} className='m-0 fw-bold' >Manage Questionnaire</Typography.Title>
                                    </div>
                                    <div className='my-4 d-flex justify-content-between align-items-center gap-3'>
                                        <Search size="large" placeholder="Search..." enterButton />
                                        <Tooltip title="Download Pdf">
                                            <Button type="primary" onClick={downLoadPdf}><DownloadOutlined /> Download Pdf</Button>
                                        </Tooltip>
                                    </div>
                                    <div className='accordion-wrapper'>
                                        <Table dataSource={dataSource} columns={columns} pagination={false} />
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                    }
                    {/* <CustomModal type={"Add"}/> */}
                    {/* Accordion  */}

                    {/* <QuestionFilter questionType={questionType} handleChange={handleChange}/> */}
                    {/* <Pagination current={Number(router.query.pagination) || 1} pageSize={Number(router.query.limit) || 10} total={state.count} hideOnSinglePage={true} disabled={loading} onChange={handlePagination} /> */}


                </section>
            </Fragment >
        </MainLayout>
    );
};

export default QuestionnairList;
