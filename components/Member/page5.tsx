"use client";
import { Button, Card, Col, Form, Row, Typography } from "antd";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import MainLayout from "../../components/Layout/layout";
import TextArea from "antd/es/input/TextArea";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { destroyCookie } from "nookies";
import { StepBackwardOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import useAutoSaveForm from "../common/useAutoSaveForm";
import { clearFormData, clearSpecificFormData } from "@/lib/features/formSlice";

const Page5 = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [actionType, setActionType] = useState<'submit' | 'save' | null>(null);
  const searchParams = useSearchParams();
  const entries = Array.from(searchParams.entries());
  const value = entries.length > 0 ? entries[0][0] : "";
  const type = entries.length > 1 ? entries[1][0] : "";
  const pagetype = entries.length > 2 ? entries[2][0] : "";

  const savedFormData = useSelector((state: any) => state.form);
  const [formValues, setFormValues] = useState(savedFormData);
  useAutoSaveForm(formValues, 300);
  const submit = async(values: any) => {
    if (actionType === 'submit') {
      let items = {
        craftsmen_checkup: {
          userId: value,
          commitment: values?.commitment,
          contribute: values?.contribute,
          wellbeing: values?.wellbeing,
          contact_info: values?.contact_info,
        },
      };
      try {
        const fieldsToClear = [
          "commitment",
          "contribute",
          "wellbeing",
          "contact_info",
        ];
  
        if (type == "edit") {
          let items = {
            craftsmen_checkup: {
              userId: value,
              commitment: values?.commitment,
              contribute: values?.contribute,
              wellbeing: values?.wellbeing,
              contact_info: values?.contact_info,
            },
          } as any;
          setLoading(true);
          let res = await api.User.edit(items);
          dispatch(clearSpecificFormData(fieldsToClear));
  
          toast.success(res?.message);
          // if (!pagetype) {
          //     router.push(`/admin/member/add/page6?${value}&edit`)
          // }else{
          //     router?.back()
          // }
          setTimeout(() => {
            if (!pagetype) {
              router.push(`/admin/member/add/page6?${value}&edit`);
            } else {
                router.push("/admin/questionnaire?page5")
            }
          }, 1000);
        } else {
          setLoading(true);
          let res = await api.Auth.signUp(items);
          dispatch(clearSpecificFormData(fieldsToClear));
  
          if (res?.status == 500) {
              localStorage.setItem('redirectAfterLogin', window.location.pathname);
              localStorage.removeItem("hasReloaded")
              destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
              toast.error("Session Expired. Login Again");
              router.replace("/auth/signin");;
          }
          router.push(`/admin/member/add/page6?${res?.userId}`);
        }
      } catch (error) {
        if (!pagetype) {
          setLoading(false);
        }
      } finally {
        if (pagetype) {
          setLoading(false);
        }
      }
    } else if (actionType === 'save') {
      let items = {
        craftsmen_checkup: {
          userId: value,
          commitment: values?.commitment,
          contribute: values?.contribute,
          wellbeing: values?.wellbeing,
          contact_info: values?.contact_info,
        },
      };
      try {
        const fieldsToClear = [
          "commitment",
          "contribute",
          "wellbeing",
          "contact_info",
        ];
  
        if (type == "edit") {
          let items = {
            craftsmen_checkup: {
              userId: value,
              commitment: values?.commitment,
              contribute: values?.contribute,
              wellbeing: values?.wellbeing,
              contact_info: values?.contact_info,
            },
          } as any;
          setLoading1(true);
          let res = await api.User.edit(items);
          dispatch(clearSpecificFormData(fieldsToClear));
  
          toast.success(res?.message);
          setTimeout(() => {
            if (pagetype) {
              router.push("/admin/questionnaire?page5")
            } 
          }, 1000);
        } else {
          setLoading1(true);
          let res = await api.Auth.signUp(items);
          dispatch(clearSpecificFormData(fieldsToClear));
  
          if (res?.status == 500) {
              localStorage.setItem('redirectAfterLogin', window.location.pathname);
              localStorage.removeItem("hasReloaded")
              destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
              toast.error("Session Expired. Login Again");
              router.replace("/auth/signin");;
          }
          router.push(`/admin/member/add/page6?${res?.userId}`);
        }
      } catch (error) {
        if (!pagetype) {
          setLoading1(false);
        }
      } finally {
        if (pagetype) {
          setLoading1(false);
        }
      }
    }
    setLoading1(false);
  };
 
  const handleSubmitClick = () => {
    setActionType('submit');
    form.submit(); // Trigger form submission
  };

  const handleSaveClick = () => {
    setActionType('save');
    form.submit(); // Trigger form submission
  };
  

  const [state, setState] = useState<any>("");
  const getDataById = async () => {
    const item = {
      user_id: value,
    };
    try {
      const res = await api.User.getById(item as any);
      setState(res?.data || null);
      if (res?.data?.status == 500) {
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        localStorage.removeItem("hasReloaded")
        destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
        toast.error("Session Expired. Login Again");
        router.replace("/auth/signin");
      }
      const dataFromApi = res?.data || {};

      const finalData = {
        commitment: formValues?.commitment || dataFromApi?.commitment,
        contribute: formValues?.contribute || dataFromApi?.contribute,
        wellbeing: formValues?.wellbeing || dataFromApi?.wellbeing,
        contact_info: formValues?.contact_info || dataFromApi?.contact_info,
      };

      form.setFieldsValue(finalData);
    } catch (error: any) {
      if (error?.status == 500) {
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        localStorage.removeItem("hasReloaded")
        destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
        toast.error("Session Expired. Login Again");
        router.replace("/auth/signin");
      }
    }
  };
  useEffect(() => {
    if (type == "edit") {
      getDataById();
    }
  }, [type, form]);
  const onPrevious = () => {
    router.replace(`/admin/member/add/page4?${value}&edit`);
  };
  const hnandleBack = () => {
    router.back();
  };

  const onValuesChange = (changedValues: any) => {
    setFormValues((prevValues: any) => ({
      ...prevValues,
      ...changedValues,
    }));
  };

  return (
    <>
      <Fragment>
        <section className="club_member">
          <Row justify="center" gutter={[20, 20]} className="heightCenter">
            <Col xs={24} sm={22} md={20} lg={16} xl={14} xxl={12}>
              <Card className="common-card">
                <div className="mb-2 d-flex justify-content-between">
                  <Typography.Title level={3} className="m-0 fw-bold">
                    CRAFTSMEN CHECK-UP
                  </Typography.Title>
                  {/* <Button size={'large'} type="primary" className="text-white" disabled>4/8</Button> */}
                  {!pagetype && (
                    <Button
                      size={"large"}
                      type="primary"
                      className="text-white"
                      disabled
                    >
                      4/8
                    </Button>
                  )}
                </div>

                {/* form  */}
                <div className="card-form-wrapper">
                  <Form
                    form={form}
                    name="add_staff"
                    className="add-staff-form"
                    scrollToFirstError
                    layout="vertical"
                    onFinish={submit}
                    onValuesChange={onValuesChange}
                  >
                    {/* First Name  */}
                    <Form.Item
                      name="commitment"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please Fill Field",
                        },
                      ]}
                      label="What is your level of commitment to our club?"
                    >
                      <TextArea size={"large"} placeholder="Enter..." />
                    </Form.Item>
                    <Form.Item
                      name="contribute"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please Fill Field",
                        },
                      ]}
                      label="List Something(s) you can do to contribute to our club."
                    >
                      <TextArea size={"large"} placeholder="Enter..." />
                    </Form.Item>
                    <Form.Item
                      name="wellbeing"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please Fill Field",
                        },
                      ]}
                      label="How is your present health, wellbeing, family life?"
                    >
                      <TextArea size={"large"} placeholder="Enter..." />
                    </Form.Item>
                    <Form.Item
                      name="contact_info"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please Fill Field",
                        },
                      ]}
                      label="Have any items on your contact info changed?"
                    >
                      <TextArea size={"large"} placeholder="Enter..." />
                    </Form.Item>

                    {/* Button  */}
                    <div className="d-flex mt-3">
                      {!pagetype ? (
                        <div className="col-2">
                          <Button
                            size={"large"}
                            type="primary"
                            className=" "
                            loading={loading1}
                            onClick={handleSaveClick}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        ""
                      )}
                      {!pagetype ? (
                        <div className=" col-8 d-flex gap-5 justify-content-center">
                          {!pagetype ? (
                            <Button
                              size={"large"}
                              type="primary"
                              className=" "
                              onClick={onPrevious}
                            >
                              Previous
                            </Button>
                          ) : (
                            ""
                          )}
                          <Button
                            size={"large"}
                            type="primary"
                            // htmlType="submit"
                            className="login-form-button "
                            loading={loading}
                            onClick={handleSubmitClick}
                          >
                            Next
                          </Button>
                        </div>
                      ) : (
                        <div className=" col-8 d-flex gap-5 justify-content-center">
                          <Button
                            size={"large"}
                            type="primary"
                            className=" "
                            onClick={hnandleBack}
                          >
                            Back
                          </Button>

                          <Button
                            size={"large"}
                            type="primary"
                            className="login-form-button "
                            loading={loading1}
                            onClick={handleSaveClick}
                          >
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                  </Form>
                </div>
              </Card>
            </Col>
          </Row>
        </section>
      </Fragment>
    </>
  );
};

export default Page5;
