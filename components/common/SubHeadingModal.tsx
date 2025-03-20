"use client";
import { Input, Space, Form, Select, InputNumber } from "antd";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import api from "@/utils/api";
import { useSelector } from "react-redux";
const { Row, Col, Card, Button, Pagination } = {
  Button: dynamic(() => import("antd").then((module) => module.Button), {
    ssr: false,
  }),
  Row: dynamic(() => import("antd").then((module) => module.Row), {
    ssr: false,
  }),
  Col: dynamic(() => import("antd").then((module) => module.Col), {
    ssr: false,
  }),
  Card: dynamic(() => import("antd").then((module) => module.Card), {
    ssr: false,
  }),
  Pagination: dynamic(
    () => import("antd").then((module) => module.Pagination),
    { ssr: false }
  ),
};
const { Option } = Select;
const AntModal = dynamic(() => import("antd").then((module) => module.Modal), {
  ssr: false,
});

const SubHeadingModal = (props: any) => {
  console.log(props,"yuiyuiyuiyui");
  
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalOpen1, setAddModalOpen1] = useState(false);
  const getUserdata = useSelector((state: any) => state?.user?.userData);
  const [loading, setLoading] = useState(false);

  const [addLoading, setAddLoading] = useState(false);

  const [addForm] = Form.useForm();
  const [addForm1] = Form.useForm();


  const [formValues, setFormValues] = useState<any>({});

  const getDataById = useCallback(async (): Promise<void> => {
    const item = {
      section_heading_id: props.id,
    };
    try {
      setLoading(true);
      const res = await api.Manage_Question.getByIdsubHeading(item);

      addForm.setFieldsValue(res.data);
    } catch (error: any) {
    //   alert(error.message);
    } finally {
      setLoading(false);
    }
  }, [addForm, props.id]);
  useEffect(() => {
    if (props.id) {
      getDataById();
    }
  }, [props.id, getDataById]);
  const addQuestion = async (values: any) => {
    let item = {
        section_heading_id: props?.id,
      page_type: values.page_type,
      subheading: values.subheading,
      meeting_id:getUserdata.meetings.NextMeeting.id,
    };

    try {
      if (props?.type === "Add") {
        let item = {
            page_type: values.page_type,
            subheading: values.subheading,
          meeting_id:getUserdata.meetings.NextMeeting.id,
        };
        let res = await api.Manage_Question.add_sub_heading(item as any);
        props?.initialise();
        setAddModalOpen(false);
        addForm.resetFields();
      } else {
        let res = await api.Manage_Question.edit_sub_heading(item as any);
        props?.initialise();
        setAddModalOpen(false);
        addForm.resetFields();
      }
    } catch (error) {
    }
  };
 

  return (
    <>
      <div className="">
        {props?.type === "Add" ? (
          <div className="d-flex gap-3">
          <Button
            type="primary"
            htmlType="button"
            size={"large"}
            onClick={() => setAddModalOpen(true)}
          >
            <PlusOutlined />
           Add Sub Heading
          </Button>
          </div>
        ) : (
          <Button
            type="text"
            className="px-0 border-0 bg-transparent shadow-none"
            onClick={() => setAddModalOpen(true)}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </Button>
        )}
        <AntModal
          centered
          title={`${props?.type} Sub Heading`}
          open={addModalOpen}
          footer={null}
          onCancel={() => setAddModalOpen(false)}
        >
          <Form
            name="idAdd"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            onFinish={addQuestion}
            form={addForm}
            autoComplete="off"
          >
            <Form.Item
              name="subheading"
              label={`${props?.type} Sub Heading`}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: `Please Enter valid ${props?.type} Sub Heading`,
                },
              ]}
            >
              <Input size={"large"} placeholder={`${props?.type} Sub Heading`} />
            </Form.Item>
          
            <Form.Item
              name="page_type"
              label={`${props?.type} Page Type`}
              rules={[
                {
                  required: true,
                  message: `Please select a valid ${props?.type} Page Type`,
                },
              ]}
            >
              {/* BUSINESS UPDATE,CRAFTSMEN TOOLBOX,CRAFTSMEN CHECK-UP,Fall 2024 MEETING REVIEW,Spring 2025 MEETING PREPARATION */}
              <Select size="large" placeholder={`${props?.type} Page Type`|| "Select Page Type"}>
              <Option value="business_update">Business Update</Option>
                <Option value="technology">Craftsmen Toolbox</Option>
                <Option value="craftsmen_checkup">Craftsmen check-Up</Option>
                <Option value="meeting_review">Fall 2024 Meeting Review</Option>
                <Option value="round_table_topic">Spring 2025 Meeting Preparation</Option>
                <Option value="answers">Additional Questionnaire</Option>
                 
              </Select>
            </Form.Item>
            <Space className="w-100 justify-content-end">
              <Button type="default" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={addLoading}
                disabled={addLoading}
              >
                {props?.type==="Edit"?"Update":props?.type}
              </Button>
            </Space>
          </Form>
        </AntModal>
      
      </div>
    </>
  );
};

export default SubHeadingModal;
