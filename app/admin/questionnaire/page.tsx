"use client"
import React, { Fragment, ReactNode, useEffect, useState } from 'react'
import { Input, Breadcrumb, Collapse, theme, Typography, Pagination, Popconfirm, Form, Table } from 'antd';
import MainLayout from '@/app/layouts/page';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import QuestionFilter from '@/app/common/QuestionFilter';
const { Row, Col, Card, Button } = {
    Button: dynamic(() => import("antd").then(module => module.Button), { ssr: false }),
    Row: dynamic(() => import("antd").then(module => module.Row), { ssr: false }),
    Col: dynamic(() => import("antd").then(module => module.Col), { ssr: false }),
    Card: dynamic(() => import("antd").then(module => module.Card), { ssr: false }),
}
const { Search } = Input;
let timer: any
const page = () => {

    const dataSource = [
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
                                {/* Title  */}
                                <div className='d-flex justify-content-between align-items-center'>
                                    <Typography.Title level={3} className='m-0 fw-bold' >Manage Questionnaire</Typography.Title>
                                </div>
                                {/* Search  */}
                                <div className='my-4 d-flex justify-content-between align-items-center gap-3'>
                                    <Search size="large" placeholder="Search..." onSearch={onSearch} onChange={(e) => onSearch(e.target.value)} enterButton />
                                        <QuestionFilter/>
                                    {/* <CustomModal type={"Add"}/> */}
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