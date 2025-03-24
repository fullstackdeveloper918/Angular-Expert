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

const CustomModal = (props: any) => {
  const [subheadingId, setSubheadingId] = useState(null);
  const [subheadingId1, setSubheadingId1] = useState(null);
  console.log(subheadingId1,"subheadingId1");
  
  const [state, setState] = React.useState<any>([])
  const [addModalOpen, setAddModalOpen] = useState(false);
  const getUserdata = useSelector((state: any) => state?.user?.userData);
  const [loading, setLoading] = useState(false);

  const [addLoading, setAddLoading] = useState(false);

  const [addForm] = Form.useForm();

console.log(state,"asjdla");


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
    console.log(values,"ieytieyr");
    console.log(subheadingId,"subheadingId");
    // return
    
    let item = {
      question_id: props?.id,
      question: values.question,
      question_type: values.question_type,
      page_type: values.page_type,
      quesiton_position:values.quesiton_position,
      meeting_id:getUserdata.meetings.NextMeeting.id,
      subheading_id:subheadingId||"",
      subheading_title:values?.subheading_title||""
    };

    try {
      if (props?.type === "Add") {
        let item = {
          question: values.question,
          question_type: values.question_type,
          page_type: values.page_type,
          quesiton_position:values.quesiton_position,
          meeting_id:getUserdata.meetings.NextMeeting.id,
           subheading_id:subheadingId||"",
      subheading_title:values?.subheading_title||""
        };
        let res = await api.Manage_Question.create(item as any);
        props?.initialise();
        setAddModalOpen(false);
        addForm.resetFields();
      } else {
        let res = await api.Manage_Question.edit(item as any);
        props?.initialise();
        setAddModalOpen(false);
        addForm.resetFields();
      }
    } catch (error) {
    }
  };
  const initialise = async () => {
    try {
      let res = await api.Manage_Question.list()
      setState(res.data)
    //   if (res?.data?.status == 500) {
    //     destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
    //     localStorage.removeItem('hasReloaded');
    //     toast.error("Session Expired Login Again")
    //     router.replace("/auth/signin")
    // }
    } catch (error:any) {
    //   if (error.status==500) {
    //     destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
    //     localStorage.removeItem('hasReloaded');
    //     // }
    //     toast.error("Session Expired Login Again")
    //     router.replace("/auth/signin")
    // }
    } finally {
    }
  }

  useEffect(() => {
    initialise()
  }, [])

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
            Add New Questions
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
              {/* BUSINESS UPDATE,CRAFTSMEN TOOLBOX,CRAFTSMEN CHECK-UP,Fall 2024 MEETING REVIEW,Spring 2025 MEETING PREPARATION */}
              <Select size="large" placeholder={`${props?.type} Question Type`}>
                <Option value="short_text">Short Text</Option>
                <Option value="long_text">Long Text</Option>
                <Option value="dropdown">Dropdown</Option>
                <Option value="single_choice">Single Choice Checkbox</Option>
                <Option value="multi_choice">Multi Choice Checkbox</Option>
                 
              </Select>
            </Form.Item>
            <Form.Item
              name="page_type"
              label={`${props?.type} Page Section`}
              rules={[
                {
                  required: true,
                  message: `Please select a valid ${props?.type} Page Section`,
                },
              ]}
            >
              {/* BUSINESS UPDATE,CRAFTSMEN TOOLBOX,CRAFTSMEN CHECK-UP,Fall 2024 MEETING REVIEW,Spring 2025 MEETING PREPARATION */}
              <Select size="large" placeholder={`${props?.type} Page Section`|| "Select Page Section"} 
               onChange={(value:any, option:any) => {setSubheadingId1(value); 
    }}>
              <Option value="business_update">Business Update</Option>
                <Option value="technology">Craftsmen Toolbox</Option>
                <Option value="craftsmen_checkup">Craftsmen check-Up</Option>
                <Option value="well_being">Personal Well-Being Check-In</Option>
                <Option value="business_evolution">Business Evolution & Industry trends</Option>
                <Option value="meeting_review">Fall 2024 Meeting Review</Option>
                <Option value="roundtable">Round-Table Topics</Option>
                {/* <Option value="round_table_topic">Spring 2025 Meeting Preparation</Option> */}
                {/* <Option value="answers">Additional Questionnaire</Option> */}
                 
              </Select>
            </Form.Item>
            {subheadingId1==="business_update"&&
            <Form.Item
              name="subheading_title"
              label={`${props?.type} Sub Heading`}
              rules={[
                {
                  required: true,
                  message: `Please select a valid ${props?.type} Sub Heading`,
                },
              ]}
            >
              {/* BUSINESS UPDATE,CRAFTSMEN TOOLBOX,CRAFTSMEN CHECK-UP,Fall 2024 MEETING REVIEW,Spring 2025 MEETING PREPARATION */}
              <Select
    size="large"
    placeholder={`${props?.type} Sub Heading` || "Select Sub Heading"}
    onChange={(value:any, option:any) => {
      // Capturing both the subheading and its corresponding id
      const selectedSubheading = value;
      const selectedId = option.key; // option.key will give us the id
      setSubheadingId(selectedId); // Store the selected id in the state
    }}
  >
    {state?.map((res: any, index: number) => (
      <Option value={res?.subheading} key={res?.id}>
        {res?.subheading}
      </Option>
    ))}
  </Select>
            </Form.Item>
  }
            <Form.Item
              name="quesiton_position"
              label={`${props?.type} Question Position`}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: `Please Enter valid ${props?.type} Question Position`,
                },
              ]}
            >
              <Input size={"large"} placeholder={`${props?.type} Question Position`} 
              onKeyPress={(e: any) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();  // Prevent input if it's not a number
                } else {
                  e.target.value = String(e.target.value).trim();  // Trim spaces (if any)
                }
              }}/>
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

export default CustomModal;
