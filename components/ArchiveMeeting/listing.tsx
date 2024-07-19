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
const { Search } = Input;

const ArchiveMeeting = () => {

  const [loading, setLoading] = React.useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [areas, setAreas] = useState<any>([]);



  const dataSource = areas?.map((res: any, index: number) => {
      return {
          key: index+1,
          meeting:res?.meeting_name,
          start: dayjs(res?.start_time).format('h A DD-MM-YYYY'),
          end: dayjs(res?.end_time).format('h A DD-MM-YYYY'),
      }})
  const columns = [
      {
          title: 'Key',
          dataIndex: 'key',
          key: 'key',
      },
      {
          title: 'Meeting Name',
          dataIndex: 'meeting',
          key: 'meeting',
      },
      {
          title: 'Start Time',
          dataIndex: 'start',
          key: 'start',
      },
      {
          title: 'End Time',
          dataIndex: 'end',
          key: 'end',
      },
  ];



  const initialise = async () => {
      try {
          let res = await api.Meeting.archive();
          setAreas(res?.data); 
      } catch (error) {
          console.error('Error fetching meeting listing:', error);
      }
  };
  useEffect(() => {

    initialise(); 

}, []);
  return (
    <MainLayout>

    <Fragment>
        {/* <Head>
            <title>Meetings</title>
            <meta name="meetings" content="Meetings" />
        </Head> */}
        <section>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <Card className='common-card'>
                        <div className='mb-4'>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item><Link className='text-decoration-none' href="/">General</Link></Breadcrumb.Item>
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
                            {/* <Button type="primary" size='large' htmlType="button"  icon={<DownloadOutlined />} onClick={() => setExportModal(true)}>Export</Button> */}
                            {/* <Space wrap> */}
                            {/* <FilterSelect /> */}
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
