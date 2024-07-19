"use client";
import dynamic from "next/dynamic";
import React, { Fragment, useEffect, useState } from "react";
import {
  Input,
  Breadcrumb,
  Collapse,
  Typography,
  Popconfirm,
  Table,
  Button,
  Row,
  Col,
  Card,
} from "antd";
import Link from "next/link";
import MainLayout from "../../components/Layout/layout";
import CustomModal from "@/components/common/Modal";
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

const { Panel } = Collapse;
const { Search } = Input;
let timer: any;
const Manage_Question = () => {
  const [deleteLoading, setDeleteLoading] = React.useState("")
  const [state, setState] = React.useState<any>([])
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(state);

  useEffect(() => {
      // Filter data when searchTerm or state changes
      const filtered = state?.filter((res:any) => {
          const question = res?.question || "";
          const questionType = res?.question_type || "";
          return question.toLowerCase().includes(searchTerm.toLowerCase()) || questionType.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredData(filtered);
  }, [searchTerm, state]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchTerm(value);
  };

  const initialise = async () => {
      try {
          // setLoading(true)
          let res=await api.Manage_Question.listing()
          
          setState(res.data)
      } catch (error) {
          // Toast.error(error)
          

      } finally {
          // setLoading(false)
      }
  }

  useEffect(() => {
      initialise()
  }, [])

  const handleDelete = async (_id: string) => {
      setDeleteLoading(_id)
      try {
          // let apiRes = await henceforthApi.Faq.delete(_id)
          // Toast.success("FAQ is deleted successfully")
          await initialise()
      } catch (error) {
      } finally {
          setDeleteLoading("")
      }

  }
  const dataSource2 = filteredData?.map((res: any, index: number) => {
      return {
          key: index+1,
          question:res?.question,
          question_type:res?.question_type,
          action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
          <li>
             <CustomModal type={"Edit"} {...res} initialise={initialise}/>
          </li>
          {/* <li>
              <Popconfirm
                  title="Delete"
                  description="Are you sure you want to delete ?"
                  onConfirm={(event) => { event?.stopPropagation(); handleDelete("res._id") }}
              // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
              >
                  <Button type="text" danger htmlType='button' className='px-0' ><i className="fa-solid fa-trash-can"></i></Button>
              </Popconfirm>
          </li> */}
      </ul>
          
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
      {
          title: 'Questions Type',
          dataIndex: 'question_type',
          key: 'question_type',
      },

      {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
      },
  ];
 

  return (
    <MainLayout>
      <Fragment>
        <section>
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Card className="common-card">
                <div className="mb-4">
                  <Breadcrumb separator=">">
                    <Breadcrumb.Item>
                      <Link className="text-decoration-none" href="/">
                        Home
                      </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item className="text-decoration-none">
                      Manage Questions for Meeting
                    </Breadcrumb.Item>
                  </Breadcrumb>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <Typography.Title level={3} className="m-0 fw-bold">
                    Manage Questions for Meeting
                  </Typography.Title>
                </div>

                <div className="my-4 d-flex justify-content-between align-items-center gap-3">
                  <Search
                    size="large"
                    placeholder="Search..."
                    // onSearch={onSearch}
                    // onChange={(e) => onSearch(e.target.value)}
                    enterButton
                  />
                  <CustomModal type={"Add"} initialise={initialise} />
                </div>

                <div className="accordion-wrapper">
                  <Table
                    dataSource={dataSource2}
                    columns={columns}
                    pagination={false}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </section>
      </Fragment>
    </MainLayout>
  );
};

export default Manage_Question;
