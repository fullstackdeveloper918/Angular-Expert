"use client";
import { Input, Space, Form, Select } from "antd";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import api from "@/utils/api";
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

const CustomModal = (props: any) => {
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [addLoading, setAddLoading] = useState(false);

  const [addForm] = Form.useForm();


  const [formValues, setFormValues] = useState<any>({});

  const getDataById = useCallback(async (): Promise<void> => {
    const item = {
      question_id: props.id,
    };
    try {
      setLoading(true);
      const res = await api.Manage_Question.getById(item);

      addForm.setFieldsValue(res.data);
    } catch (error: any) {
      alert(error.message);
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
      question_id: props?.id,
      question: values.question,
      question_type: values.question_type,
    };

    try {
      if (props?.type === "Add") {
        let item = {
          question: values.question,
          question_type: values.question_type,
        };
        let res = await api.Manage_Question.create(item as any);
        props?.initialise();
        setAddModalOpen(false);
      } else {
        let res = await api.Manage_Question.edit(item as any);
        props?.initialise();
        setAddModalOpen(false);
      }
    } catch (error) {
    }
  };

  return (
    <>
      <div className="">
        {props?.type === "Add" ? (
          <Button
            type="primary"
            htmlType="button"
            size={"large"}
            onClick={() => setAddModalOpen(true)}
          >
            <PlusOutlined />
            Add New Questions
          </Button>
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
          title={`${props?.type} Questions for Meeting`}
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
              name="question"
              label={`${props?.type} Questions`}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: `Please Enter valid ${props?.type} Questions`,
                },
              ]}
            >
              <Input size={"large"} placeholder={`${props?.type} Questions`} />
            </Form.Item>
            <Form.Item
              name="question_type"
              label={`${props?.type} Questions Type`}
              rules={[
                {
                  required: true,
                  message: `Please select a valid ${props?.type} Questions Type`,
                },
              ]}
            >
              <Select size="large" placeholder={`${props?.type} Question Type`}>
                <Option value="short_text">Short Text</Option>
                <Option value="long_text">Long Text</Option>
                <Option value="dropdown">Dropdown</Option>
                <Option value="single_choice">Single Choice Checkbox</Option>
                <Option value="multi_choice">Multi Choice Checkbox</Option>
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
                {props?.type}
              </Button>
            </Space>
          </Form>
        </AntModal>
      </div>
    </>
  );
};

export default CustomModal;
