"use client"
import type { GetServerSideProps, NextPage } from 'next'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'
import { Breadcrumb, Form, Select, Input, Upload, Modal, Spin, Typography, SelectProps } from 'antd';
import Link from 'next/link';
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import EmployeeRoles from '@/utils/EmployeeRoles.json'
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { UploadChangeParam } from 'antd/es/upload';
import MainLayout from '../Layout/layout';
import api from '@/utils/api';
import { permission } from 'process';
import { toast, ToastContainer } from 'react-toastify';
import TextArea from 'antd/es/input/TextArea';
import 'react-quill/dist/quill.snow.css';
const { Row, Col, Card, Button } = {
  Button: dynamic(() => import("antd").then(module => module.Button), { ssr: false }),
  Row: dynamic(() => import("antd").then(module => module.Row), { ssr: false }),
  Col: dynamic(() => import("antd").then(module => module.Col), { ssr: false }),
  Card: dynamic(() => import("antd").then(module => module.Card), { ssr: false }),
}
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const { Option } = Select;
type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode;
};

const EditQuestionnair: Page = () => {
  const router = useRouter()
  const [form] = Form.useForm();
  const [state, setState] = useState({} as any)
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  console.log(state, "statestatestate");
  const [value, setValue] = useState('');
  //   const prefixSelector = (
  //     <Form.Item name="country_code" noStyle>
  //       <Select style={{ width: 70 }}>
  //         {CountryCode.map((res) =>
  //           <Option key={res.dial_code} value={res.dial_code}>{res.dial_code}</Option>)}
  //       </Select>
  //     </Form.Item>
  //   );
  const searchParam = useParams();
  const id = searchParam.id;
  console.log(searchParam, "iiiii");

  const options: SelectProps['options'] = [];
  for (let i = 0; i < 10; i++) {
    options.push({
      value: i.toString(10) + i,
      label: i.toString(10) + i,
    });
  }

  const onFinish = async (values: any) => {


    let item = {
      admin_uuid: id,
      firstname: values?.firstname,
      lastname: values?.lastname,
      phone_number: values?.phone_number,
      permission: values?.permission,
    }

    try {
      //   setLoading(true)

      let apiRes = await api.Admin.edit(item as any)
      toast.success('Edit Successful', {
        position: 'top-center',
        autoClose: 300,
        onClose: () => {
          router.push('/admin/admin-staff');
        },
      });
      setState(apiRes)
      router.back()

    } catch (error: any) {
      console.error(error)
      //   Toast.error(error)
    } finally {
      //   setLoading(false)
    }
  };


  const handleCancel = () => setPreviewOpen(false);


  const initialise = async () => {
    const item = {
      question_id: id
    }
    try {
      const apiRes = await api.Questionnair.getById(item);
      setState(apiRes)
      console.log('apiRes edit data', apiRes?.data[0]);
      form.setFieldsValue(apiRes)
            form.setFieldValue('answer',apiRes?.data[0].answer)
            form.setFieldValue('question', apiRes?.data[0].question)
            form.setFieldValue('type', apiRes.type)

    } catch (error) {
      console.log(error)
    }
  }

  // React.useEffect(() => {
  //   if (state) {
  //     form.setFieldsValue(state)
  //   }
  // }, [state])

  useEffect(() => {
    initialise()
  }, [])

  const addQuestion = async (values: any) => {
    
    try {
      //   if (props?.type === "Add") {
      let item = {
        question_id: id,
        answer: values.answer,
      };
      let res = await api.Questionnair.add(item as any);
      initialise()
      toast.success("Answer added successfully")
      // props?.initialise();
      // setAddModalOpen(false);

    } catch (error) {
      console.log(error);
    }
  };
  return (
    <MainLayout>
      <Fragment>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <section>
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Card className='common-card'>
                <div className='mb-4'>
                  <Breadcrumb separator=">">
                    <Breadcrumb.Item>Management</Breadcrumb.Item>
                    <Breadcrumb.Item><Link href="/faq/page/1?limit=10" className='text-decoration-none'>Questionnair</Link></Breadcrumb.Item>
                    <Breadcrumb.Item className='text-decoration-none'>Edit Answer</Breadcrumb.Item>
                  </Breadcrumb>
                </div>
                {/* Title  */}
                <div className='d-flex justify-content-between align-items-center mb-4'>
                  <Typography.Title level={3} className='m-0 fw-bold'>Edit Answer</Typography.Title>
                </div>
                <div className='form-wrapper'>
                  <Form form={form} name="faq_edit-form" className="faq-form" initialValues={{ remember: false }} onFinish={addQuestion} scrollToFirstError layout='vertical'>
                    {/* Type  */}

                    {/* Question  */}
                    
                    <Form.Item name="question" rules={[{ required: true, whitespace: true, message: 'Please add Question' }]} label="Question">
                      <Input placeholder="Enter question here" />
                    </Form.Item>
                    {/* Answer  */}
                    <Form.Item name="answer" rules={[{ required: true, whitespace: true, message: 'Please add Answer here' }]} hasFeedback label="Answer">
                      <div style={{ height: '200px', overflowY: 'auto' }}>
                        <ReactQuill
                        value={value}
                          theme="snow"
                          placeholder="Write description here..."
                          style={{ height: '100%' }}
                        />
                      </div>
                    </Form.Item>
                    {/* Button  */}
                    <Form.Item>
                      <Button type="primary" htmlType="submit" size={'large'} >
                        Save
                      </Button>
                    </Form.Item>

                  </Form>
                </div>
              </Card>
            </Col>
          </Row>

        </section>
      </Fragment>
    </MainLayout>
  )
}


export default EditQuestionnair