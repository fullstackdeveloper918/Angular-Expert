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
const QuestionnairList = () => {
    const getUserdata=useSelector((state:any)=>state?.user?.userData)
    console.log(getUserdata,"getUserdata");
    
  const [questionType, setQuestionType] = useState<any>(null);
  const { token } = theme.useToken();
//   getUserdata?.user_id
const [state,setState]=useState<any>([])
const [state1,setState1]=useState<any>("")

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
            key: index+1,
            question:
            <p >
            <span>{res?.question}:</span>
        </p>, 
         
            
        }})
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
       
        const params:any = questionType ? { searchFilter: questionType } : {};
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
const handleChange = (value:any) => {
    setQuestionType(value);
};
console.log(questionType,"tyrytryy");
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
  return (
    <MainLayout>
    <Fragment>
        <section>
            {getUserdata?.is_admin==false?
        <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Card className='common-card'>
                            <div className='mb-4'>
                                <Breadcrumb separator=">">
                                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                                    <Breadcrumb.Item className='text-decoration-none'>Questionnaire</Breadcrumb.Item>
                                </Breadcrumb>
                            </div>
                            {/* Title  */}
                            <div className='d-flex justify-content-between align-items-center'>
                                <Typography.Title level={3} className='m-0 fw-bold'>Questionnaire</Typography.Title>
                            </div>
                            {/* Search  */}
                            <div className='my-4 d-flex justify-content-between align-items-center gap-3'>
                                <Search size="large" placeholder="Search..."     enterButton />
                                <Tooltip title="Download Pdf">
                      <Button type="primary"><DownloadOutlined /> Download Pdf</Button>
                    </Tooltip>
                                {/* <Link href="/faq/add"><Button type="primary" htmlType="button" icon={<PlusOutlined />} size={'large'}>Add FAQ</Button></Link> */}
                            </div>
                            {/* Accordion  */}
                            <div className='accordion-wrapper'>
                                <Collapse
                                    bordered={false}
                                    accordion
                                    defaultActiveKey={['1']}
                                >
                                    {
                                        state?.map((res: any, index: number) => {
                                            return < Panel header={res.question} key={res._id} style={panelStyle} extra={genExtra(res)} >
                                                {/* <span dangerouslySetInnerHTML={{ __html: res?.answer }}></span> */}
                                                {/* <Typography.Paragraph className="m-0">{res.ans}</Typography.Paragraph> */}
                                            </Panel>
                                        })
                                    }

                                </Collapse>
                            </div>
                            {/* <Pagination current={Number(router.query.pagination) || 1} pageSize={Number(router.query.limit) || 10} total={state.count} hideOnSinglePage={true} disabled={loading} onChange={handlePagination} /> */}
                        </Card>
                    </Col>
                </Row>:
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
                            <Search size="large" placeholder="Search..."  enterButton />
                                <Tooltip title="Download Pdf">
                      <Button type="primary" onClick={downLoadPdf}><DownloadOutlined /> Download Pdf</Button>
                    </Tooltip>
                        </div>
                        <div className='accordion-wrapper'>
                            <Table dataSource={dataSource} columns={columns} pagination={false} />
                        </div>
                    </Card>
                </Col>
            </Row>}
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
