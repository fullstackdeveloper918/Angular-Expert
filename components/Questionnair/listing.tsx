"use client";
import React, { Fragment, useEffect, useState } from "react";
import { Input, Breadcrumb, Typography, Table, Card, Col, Row } from "antd";
import MainLayout from "../../components/Layout/layout";
import dynamic from "next/dynamic";
import Link from "next/link";
import QuestionFilter from "@/components/common/QuestionFilter";
import api from "@/utils/api";
// const { Row, Col, Card, Button } = {
//   Button: dynamic(() => import("antd").then((module) => module.Button), {
//     ssr: false,
//   }),
//   Row: dynamic(() => import("antd").then((module) => module.Row), {
//     ssr: false,
//   }),
//   Col: dynamic(() => import("antd").then((module) => module.Col), {
//     ssr: false,
//   }),
//   Card: dynamic(() => import("antd").then((module) => module.Card), {
//     ssr: false,
//   }),
// };
const { Search } = Input;
let timer: any;
const QuestionnairList = () => {
  const [questionType, setQuestionType] = useState<any>(null);


const [state,setState]=useState<any>([])
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
}, [questionType]);
const handleChange = (value:any) => {
    setQuestionType(value);
};
console.log(questionType,"tyrytryy");
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
                                <Breadcrumb.Item className='text-decoration-none'>Manage Questionnaire</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <div className='d-flex justify-content-between align-items-center'>
                            <Typography.Title level={3} className='m-0 fw-bold' >Manage Questionnaire</Typography.Title>
                        </div>
                        <div className='my-4 d-flex justify-content-between align-items-center gap-3'>
                            <Search size="large" placeholder="Search..."  enterButton />
                                <QuestionFilter questionType={questionType} handleChange={handleChange}/>
                            {/* <CustomModal type={"Add"}/> */}
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
  );
};

export default QuestionnairList;
