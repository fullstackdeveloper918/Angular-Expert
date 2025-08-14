"use client";

import React, { useEffect, useState, Fragment } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Form, Typography, Divider, Button, Card, Col, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { toast, ToastContainer } from "react-toastify";
import { clearSpecificFormData } from "@/lib/features/formSlice";
import useAutoSaveForm from "../common/useAutoSaveForm";
import api from "@/utils/api";

const Page7 = ({ questions }: any) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const searchParams = useSearchParams();

  const entries = Array.from(searchParams.entries());
  const value = entries.length > 0 ? entries[0][0] : "";
  const type = searchParams.get("type") || "";
  const pagetype = searchParams.get("pageType") || "";

  const getUserdata = useSelector((state: any) => state?.user?.userData);
  const savedFormData = useSelector((state: any) => state.form);

  const [formValues, setFormValues] = useState(savedFormData);
  const [state, setState] = useState<any>(null);
  const [popup, setPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<'submit' | 'save' | null>(null);

  // Auto-save form every 300ms
  useAutoSaveForm(formValues, 300);

  // Filter and sort questions
  const filteredQuestions = questions?.data
    ?.filter((item: any) => item.page_type === "roundtable")
    .sort((a: any, b: any) => parseInt(a.question_position) - parseInt(b.question_position))
    .map((item: any, index: number) => ({ ...item, question_position: index.toString() }));

  // Merge API data with form and Redux data
const getDataById = async () => {
  console.log(value, "check hew ejheeh");
  if (!value) return;

  const item = {
    user_id: value,
    meeting_id: getUserdata.meetings.NextMeeting.id,
  };

  try {
    const res = await api.User.getById(item as any);
    setState(res?.data || null);

    const dataFromApi = res?.data?.roundTableTopics?.[0] || {};
    const resValues: Record<string, any> = {};

    // Merge round_table answers
    dataFromApi?.round_table?.forEach((question: any) => {
      const key = `question_${question.question_id}`;
      if (question.answer) resValues[key] = question.answer;
    });

    // Merge individual fields
    resValues['estimating'] = dataFromApi?.estimating ?? formValues?.estimating ?? "";
    resValues['accountability'] = dataFromApi?.accountability ?? formValues?.accountability ?? "";
    
    // Check if `dataFromApi.productivity` has a valid value before using `formValues.productivity`
    resValues['productivity'] = dataFromApi?.productivity && dataFromApi?.productivity.trim() !== "" 
      ? dataFromApi?.productivity 
      : formValues?.productivity ?? "";  // Use API value if valid, else fall back to formValues

    // Merge remaining Redux form values
    Object.keys(formValues).forEach((key) => {
      if (!(key in resValues)) resValues[key] = formValues[key];
    });

    form.setFieldsValue(resValues);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

  console.log(formValues,"formValues nanana")

  useEffect(() => {
    getDataById();
  }, [form]);

  // Update Redux + local form values on change
  const onValuesChange = (changedValues: any) => {
    setFormValues((prev: any) => ({ ...prev, ...changedValues }));
  };

  // Unified API call
  const sendData = async (items: any, isEdit: boolean) => {
    setLoading(true);
    console.log(isEdit,pagetype,"see edit")
    try {
      const res = !pagetype ? await api.User.edit(items) : await api.Auth.signUp(items);
      return res;
    } catch (error) {
      console.error("Error sending data:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

 const submit = async (values: any) => {
  const fieldsToClear = ["estimating", "accountability", "productivity"];
  const roundTableData = filteredQuestions.map((q: any) => {
    // Ensure the answer exists before sending
    const answer = values[`question_${q.id}`] || "";  // Default to empty if not filled
    return {
      question_id: q.id,
      question: q.question,
      answer: answer,  // Use the correct answer from the form
      question_position: q.question_position,
      subheading_id: q.subheading_id || "",
      subheading_title: q.subheading_title || "",
    };
  });

  const items = {
    spring_meeting: {
      user_id: value,
      meeting_id: getUserdata.meetings.NextMeeting.id,
      estimating: values?.estimating,
      accountability: values?.accountability,
      productivity: values?.productivity,
      round_table: roundTableData,
    },
  };


  const isEdit =!pagetype;

  if (actionType === "submit") {
    const res = await sendData(items, isEdit);
    dispatch(clearSpecificFormData(fieldsToClear));
    if (!pagetype) {
      router.push(`/admin/member/add/page8?${res?.userId || value}`);
    } else {
      router.back();
    }
  } else if (actionType === "save") {
    const res = await sendData(items, isEdit);
    setPopup(true);
    dispatch(clearSpecificFormData(fieldsToClear));
    toast.success(res?.message || "Saved successfully", { autoClose: 1500 });
    setTimeout(() => setPopup(false), 2000);
  }
};


  const handleSubmitClick = () => { setActionType('submit'); form.submit(); };
  const handleSaveClick = () => { setActionType('save'); form.submit(); };

  const onPrevious = () => router.replace(`/admin/member/add/page6?${value}&edit`);
  const handleBack = () => router.back();

  return (
    <Fragment>
      <section className="club_member">
        <ToastContainer position="top-right" />
        <Row justify="center" gutter={[20, 20]} className="heightCenter">
          <Col xs={24} sm={22} md={20} lg={16} xl={14} xxl={12}>
            <Card className="common-card">
              <div className="mb-2 d-flex justify-content-between">
                <Typography.Title level={3} className="m-0 fw-bold">
                  ROUNDTABLE TOPICS
                </Typography.Title>
                {!pagetype && <Button size="large"                      className="text-white"
 type="primary" disabled>8/9</Button>}
              </div>

              <div className="card-form-wrapper">
                <Form
                  form={form}
                  name="roundtable_form"
                  layout="vertical"
                  scrollToFirstError
                  onFinish={submit}
                  onValuesChange={onValuesChange}
                >
                  <Typography.Title level={5}>
                    LIST THREE ROUNDTABLE TOPICS THAT YOU WANT TO COVER IN OUR SPRING MEETING (IN ORDER OF IMPORTANCE)
                  </Typography.Title>
                  <Divider plain />

                  <Form.Item name="estimating" label="First roundtable topic:">
                    <TextArea placeholder="Enter..." size="large" />
                  </Form.Item>

                  <Form.Item name="accountability" label="Second roundtable topic:">
                    <TextArea placeholder="Enter..." size="large" />
                  </Form.Item>

                  <Form.Item name="productivity" label="Third roundtable topic:">
                    <TextArea placeholder="Enter..." size="large" />
                  </Form.Item>

                  {filteredQuestions.map((question: any) => (
                    <Form.Item key={question.id} name={`question_${question.id}`} label={question.question}>
                      <TextArea size="large" placeholder="Enter..." />
                    </Form.Item>
                  ))}

                  <div className="d-flex mt-3 gap-3">
                    {!pagetype && (
                      <Button size="large" type="primary" onClick={handleSaveClick} loading={loading} disabled={popup}>
                        Save
                      </Button>
                    )}

                    {!pagetype ? (
                      <>
                        <Button size="large" type="default" onClick={onPrevious}>Previous</Button>
                        <Button size="large" type="primary" onClick={handleSubmitClick} loading={loading}>
                          Next
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="large" type="default" onClick={handleBack}>Back</Button>
                        <Button size="large" type="primary" onClick={handleSaveClick} loading={loading} disabled={popup}>
                          Save
                        </Button>
                      </>
                    )}
                  </div>
                </Form>
              </div>
            </Card>
          </Col>
        </Row>
      </section>
    </Fragment>
  );
};

export default Page7;
