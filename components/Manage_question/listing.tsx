"use client";
import React, { Fragment, useEffect, useState } from "react";
import {
  Input,
  Breadcrumb,
  Collapse,
  Typography,
  Table,
  Row,
  Col,
  Card,
  Popconfirm,
  Button,
} from "antd";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";
import api from "../../utils/api";
import CustomModal from "../common/Modal";
import { useSelector } from "react-redux";
const { Search } = Input;
const Manage_Question = () => {
  const getUserdata = useSelector((state: any) => state?.user?.userData)
  const [state, setState] = React.useState<any>([])
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(state);
  const router = useRouter()
  useEffect(() => {
    const filtered = state?.filter((res: any) => {
      const question = res?.question || "";
      const questionType = res?.question_type || "";
      return question.toLowerCase().includes(searchTerm.toLowerCase()) || questionType.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredData(filtered);
  }, [searchTerm, state]);

  const initialise = async () => {
    try {
      let res = await api.Manage_Question.listing()
      setState(res.data)
      if (res?.data?.status == 500) {
        destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
        localStorage.removeItem('hasReloaded');
        toast.error("Session Expired Login Again")
        router.replace("/auth/signin")
    }
    } catch (error:any) {
      if (error.status==500) {
        destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
        localStorage.removeItem('hasReloaded');
        // }
        toast.error("Session Expired Login Again")
        router.replace("/auth/signin")
    }
    } finally {
    }
  }

  useEffect(() => {
    initialise()
  }, [])
  const archive = async (id: any) => {
    const item = {
        question_id: id,
        meeting_id:getUserdata.meetings.NextMeeting.id,
    }
    try {
        let res = await api.Manage_Question.delete(item as any)
        initialise()
        toast.success(res?.message)
        //   setAreas
    } catch (error) {

    }
}

  const dataSource2 = filteredData?.map((res: any, index: number) => {
    return {
      key: index + 1,
      question: res?.question || "N/A",
      action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
        <li>
          <CustomModal type={"Edit"} {...res} initialise={initialise} />
        </li>
        <li>
                            <Popconfirm
                                title="Delete"
                                description="Are you sure you want to delete ?"
                                onConfirm={(event: any) => { archive(res?.id) }}
                            >
                                <Button type="text" danger htmlType='button' className='px-0' ><i className="fa-solid fa-trash-can"></i></Button>
                            </Popconfirm>
                        </li>
      </ul>

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

    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
  ];


  return (
    <>
      <Fragment>
        <section>
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Card className="common-card">
                <div className="mb-4">
                  <Breadcrumb separator=">">
                    <Breadcrumb.Item>
                      <Link className="text-decoration-none" href="/admin/dashboard">
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
                    enterButton
                  />
                  <CustomModal type={"Add"} initialise={initialise} />
                </div>

                <div className="accordion-wrapper">
                  <Table
                    dataSource={dataSource2}
                    columns={columns}
                    pagination={{
                      position: ['bottomCenter'],
                    }}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </section>
      </Fragment>
    </>
  );
};

export default Manage_Question;
