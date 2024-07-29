/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
import {
  Table,
  Input,
  Breadcrumb,
  Typography,
  Row,
  Col,
  Card,
  Pagination,
} from "antd";
import Link from "next/link";
import MainLayout from "../../components/Layout/layout";
import dayjs from "dayjs";
import api from "@/utils/api";
import validation from "@/utils/validation";
const { Search } = Input;

const ArchiveMeeting = () => {

  const [loading, setLoading] = React.useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [areas, setAreas] = useState<any>([]);



  const dataSource = areas?.map((res: any, index: number) => {
      return {
        key: index + 1,
        meeting: `${validation.capitalizeFirstLetter(res?.meeting_type)} ${dayjs(res?.start_meeting_date).format('YYYY')}`,
        start_date: dayjs(res?.start_meeting_date).format('DD-MM-YYYY'),
        start_time: dayjs(res?.start_time).format('hh:mm A'),
        end_date: dayjs(res?.end_meeting_date).format('DD-MM-YYYY'),
        end_time: dayjs(res?.end_time).format('hh:mm A'),
      }})
  const columns = [
    {
        title: 'Order No.',
        dataIndex: 'key',
        key: 'key',
    },
    {
        title: 'Meeting Name',
        dataIndex: 'meeting',
        key: 'meeting',
    },
    {
        title: 'Meeting Date',
        dataIndex: 'start_date',
        key: 'start_date',
    },
    {
        title: 'Meeting Time',
        dataIndex: 'start_time',
        key: 'start_time',
    },
    {
        title: 'Meeting End Date',
        dataIndex: 'end_date',
        key: 'end_date',
    },
    {
        title: 'Meeting End Time',
        dataIndex: 'end_time',
        key: 'end_time',
    },
   
  ];



  const initialise = async () => {
      try {
          let res = await api.Meeting.archive();
          setAreas(res?.data); 
      } catch (error) {
      }
  };
  useEffect(() => {

    initialise(); 

}, []);
  return (
    <MainLayout>

    <Fragment>
        <section>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <Card className='common-card'>
                        <div className='mb-4'>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item><Link className='text-decoration-none' href="/admin/dashboard">General</Link></Breadcrumb.Item>
                                <Breadcrumb.Item className='text-decoration-none'>Archive Meetings</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        {/* title  */}
                        <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3'>
                            <Typography.Title level={3} className='m-0 fw-bold'>Archive Meetings</Typography.Title>
                           
                        </div>
                        {/* Search  */}
                        <div className='my-4 d-flex gap-3'>
                            <Search size='large' placeholder="Search by Meeting Name or year" enterButton value={searchTerm}
                                />
                        </div>
                        {/* Tabs  */}
                        <div className='tabs-wrapper'>
                            <Table dataSource={dataSource} columns={columns} pagination={false} />
                        </div>
                        {/* Pagination  */}
                        <Row justify={'center'} className="mt-5 d-flex paginationCenter">
                            <Col span={24}>
                                <Pagination total={15} hideOnSinglePage={true} disabled={loading} />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>


        </section>
    </Fragment>
</MainLayout>
  );
};

export default ArchiveMeeting;
