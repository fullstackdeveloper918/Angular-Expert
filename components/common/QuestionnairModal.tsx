"use client";
import {Space, Form, Select } from "antd";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import api from "@/utils/api";
import TextArea from "antd/es/input/TextArea";
const {  Button, Pagination } = {
  Button: dynamic(() => import("antd").then((module) => module.Button), {
    ssr: false,
  }),
  Pagination: dynamic(
    () => import("antd").then((module) => module.Pagination),
    { ssr: false }
  ),
};
const AntModal = dynamic(() => import("antd").then((module) => module.Modal), {
  ssr: false,
});

const QuestionanirModal = (props: any) => {
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [addLoading, setAddLoading] = useState(false);

  const [addForm] = Form.useForm();

  const [editForm] = Form.useForm();
  const [state, setState] = useState<any>("");
  const addGenre = async (values: any) => {
    setAddLoading(true);
    try {
      let items = {
        name: String(values.addGenre).trim(),
      };
    } catch (error) {
    } finally {
      setAddLoading(false);
      setAddModalOpen(false);
    }
  };
  const [formValues, setFormValues] = useState<any>({});

  const handleValuesChange = (changedValues: any, allValues: any) => {
    setFormValues(allValues);
    if (changedValues.questions) {
    }
  };


  const addQuestion = async (values: any) => {
    let item = {
        question_id: props?.id,
      question: values.question,
      question_type: values.question_type,
    };

    try {
    //   if (props?.type === "Add") {
        let item = {
            question_id: props.id,
            answer: values.answer,
        };
        let res = await api.Questionnair.add(item as any);
        // props?.initialise();
        setAddModalOpen(false);
     
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
          title={`Questions for Meeting`}
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
              name="answer"
              label={`Answer`}
              rules={[
                {
                  required: true,
                  message: `Please Enter Answer`,
                },
              ]}
            >
              <TextArea size={"large"} placeholder={`Write a answer`} />
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
                Save
              </Button>
            </Space>
          </Form>
        </AntModal>
      </div>
    </>
  );
};

export default QuestionanirModal;
