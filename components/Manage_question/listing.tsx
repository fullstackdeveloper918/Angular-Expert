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
} from "antd";
import Link from "next/link";
import MainLayout from "../../components/Layout/layout";
// import CustomModal from "@/components/common/Modal";
// import api from "@/utils/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";
import api from "../../utils/api";
import CustomModal from "../common/Modal";
const { Panel } = Collapse;
const { Search } = Input;
const Manage_Question = () => {
  const [deleteLoading, setDeleteLoading] = React.useState("")
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
      if (res?.data?.status == 400) {
        destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
        localStorage.removeItem('hasReloaded');
        toast.error("Session Expired Login Again")
        router.replace("/auth/signin")
    }
    } catch (error:any) {
      if (error.status==400) {
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


  const dataSource2 = filteredData?.map((res: any, index: number) => {
    return {
      key: index + 1,
      question: res?.question || "N/A",
      // question_type:res?.question_type,
      action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
        <li>
          <CustomModal type={"Edit"} {...res} initialise={initialise} />
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
    // {
    //     title: 'Questions Type',
    //     dataIndex: 'question_type',
    //     key: 'question_type',
    // },

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
    </MainLayout>
  );
};

export default Manage_Question;
