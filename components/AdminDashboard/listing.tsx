"use client";
import type { NextPage } from "next";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { DownloadOutlined, EyeOutlined, FieldTimeOutlined, FormOutlined, LoginOutlined } from "@ant-design/icons";
import "../../styles/globals.scss";
import { Button, Card, Col, Popconfirm, Row, Table, Tooltip, Typography } from "antd";
import api from "@/utils/api";
import { useSelector } from "react-redux";
import Icons from "@/components/common/Icons";
import MainLayout from "../../components/Layout/layout";
import dayjs from "dayjs";
import Timmer from "../common/Timmer";
import validation, { capFirst } from "@/utils/validation";
import { pdf } from "@react-pdf/renderer";
import Pdf from "../common/Pdf";
import saveAs from "file-saver";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";
type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode;
};

const AdminDashboard: Page = (props: any) => {
 
  return (
    <MainLayout>

      <Fragment>
        <h1 className="">check main layout</h1>
        {/* <section>
          <Row gutter={[20, 20]} className="mb-4 ">

            {getUserdata?.is_admin == true ?
              <>
                {DashboardData && DashboardData?.map((data: any, index: number) => {
                  return (
                    <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} className="gutter-row" key={index}>
                      <Link className='text-decoration-none' href={data.link}>
                        <Card className='dashboard-widget-card text-center h-100 border-0' style={{ background: data.cardBackground }} >
                          
                          <div className='dashboard-widget-card-content mt-3 mb-3'>
                            <Typography.Title level={3} className='m-0 mb-2 fw-bold' style={{ color: data.textColor }}>{data.title}</Typography.Title>
                            <Typography.Paragraph className="m-0" style={{ color: data.textColor }}>{data.count}</Typography.Paragraph>
                          </div>
                        </Card>
                      </Link>
                    </Col>
                  )
                })}
              </> : <>
                {DashboardData2 && DashboardData2?.map((data: any, index: number) => {
                  return (
                    <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} className="gutter-row" key={index}>
                      <Link className='text-decoration-none' href={data.link}>
                        <Card className='dashboard-widget-card text-center h-80 border-0' style={{ background: data.cardBackground }} >
                       
                          <div className='dashboard-widget-card-content'>
                            <Typography.Title level={3} className='m-0 mb-1 fw-bold' style={{ color: data.textColor }}>{data.title}</Typography.Title>
                            <Typography.Paragraph className="m-0" style={{ color: data.textColor }}>{data.count}</Typography.Paragraph>
                          </div>
                        </Card>
                      </Link>
                    </Col>
                  )
                })}
              </>}
          </Row>
          <Row gutter={[20, 20]} className='dashboradTable'>

            {getUserdata?.is_admin == false ?
              <Col sm={24} md={24} lg={24} xxl={12}>
                <Card className='common-card'>
                  <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-3'>
                    <Typography.Title level={4} className='m-0 fw-bold'>Complete Updates</Typography.Title>

                  </div>
                  <div className='tabs-wrapper'>
                    <Table className="tableBox" dataSource={dataSource1} columns={columns1} pagination={{
                                            position: ['bottomCenter'],
                                            pageSize: 5,
                                          }}/>
                  </div>
                </Card>
              </Col> : ""}
            {getUserdata?.is_admin == false ?
              <Col sm={24} md={24} lg={24} xxl={12}>
                <Card className='common-card'>

                  <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-3'>
                    <Typography.Title level={4} className='m-0 fw-bold'>Non-Complete Updates</Typography.Title>
                  </div>
                  <div className='tabs-wrapper'>
                    <Table dataSource={dataSource2} columns={columns}  pagination={{
                                            position: ['bottomCenter'],
                                            pageSize: 5,
                                          }}/>
                  </div>

                </Card>
              </Col> : ""}
            {getUserdata?.is_admin == true ?
              <Col span={24} >
                <Card className='common-card'>
                  <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-3'>
                    <Typography.Title level={4} className='m-0 fw-bold'>Club Members</Typography.Title>
                    {hasClubMemberPermission ?
                      state1?.length &&
                      <Link href={'/admin/member'}>
                        <Button className='text-center blackViewBtn'> View All</Button>
                      </Link> : ""}
                  </div>
                  <div className='tabs-wrapper'>

                    <Table dataSource={dataSource} columns={columns2} pagination={false} />
                  </div>

                </Card>
              </Col> : ""}

            {getUserdata?.is_admin == false ?
              <Col span={24} >
                <Card className='common-card'>
                  <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-3'>
                    <Typography.Title level={4} className='m-0 fw-bold'>Upcoming Meetings</Typography.Title>
                  </div>
                  <div className='tabs-wrapper'>

                    <Table dataSource={dataSource3} columns={columns3} pagination={{
                                            position: ['bottomCenter'],
                                            pageSize: 5,
                                          }} />
                  </div>

                </Card>
              </Col>
              : ""}
          </Row>
        </section> */}
      </Fragment>
    </MainLayout>
  );
};

export default AdminDashboard;