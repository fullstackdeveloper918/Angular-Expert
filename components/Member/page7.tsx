"use client";
import { Form, Typography, Divider, Button, Card, Col, Row } from "antd";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useCallback, useState } from "react";
import MainLayout from "../../components/Layout/layout";
import TextArea from "antd/es/input/TextArea";
import api from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import { destroyCookie } from "nookies";
import { StepBackwardOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import useAutoSaveForm from "../common/useAutoSaveForm";
import { clearSpecificFormData } from "@/lib/features/formSlice";

const Page7 = () => {
  const getUserdata = useSelector((state: any) => state?.user?.userData);
  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [state, setState] = useState<any>("");
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
        spring_meeting: {
          user_id: value,
          meeting_id: getUserdata.meetings.NextMeeting.id,
          estimating: values?.estimating,
          accountability: values?.accountability,
          productivity: values?.productivity,
        },
      };
      try {
        const fieldsToClear = ["estimating", "accountability", "productivity"];
  
        // if (type == "edit") {
        if (state?.roundTableTopics?.length) {
          let items = {
            spring_meeting: {
              user_id: value,
          meeting_id: getUserdata.meetings.NextMeeting.id,
              estimating: values?.estimating,
              accountability: values?.accountability,
              productivity: values?.productivity,
            },
          } as any;
          setLoading(true);
          let res = await api.User.edit(items);
          dispatch(clearSpecificFormData(fieldsToClear));
          if (!pagetype) {
            router.push(`/admin/member/add/additional_questionnaire?${value}&edit`)
        } else {
            // router?.back()
            router.push("/admin/questionnaire?page7")
        }
        } else {
          setLoading(true);
          let res = await api.Auth.signUp(items);
          dispatch(clearSpecificFormData(fieldsToClear));
  
          if (res?.status == 500) {
              localStorage.setItem('redirectAfterLogin', window.location.pathname);
              localStorage.removeItem("hasReloaded")
              destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
              toast.error("Session Expired. Login Again");
              router.replace("/auth/signin");
          }
          if (!pagetype) {
            router.push(`/admin/member/add/page8?${res?.userId}`);
          } else {
            router?.back();
          }
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
        spring_meeting: {
          user_id: value,
          meeting_id: getUserdata.meetings.NextMeeting.id,
          estimating: values?.estimating,
          accountability: values?.accountability,
          productivity: values?.productivity,
        },
      };
      try {
        const fieldsToClear = ["estimating", "accountability", "productivity"];
  
        if (state?.roundTableTopics?.length) {
          let items = {
            spring_meeting: {
              user_id: value,
          meeting_id: getUserdata.meetings.NextMeeting.id,
              estimating: values?.estimating,
              accountability: values?.accountability,
              productivity: values?.productivity,
            },
          } as any;
          setLoading1(true);
          let res = await api.User.edit(items);
          dispatch(clearSpecificFormData(fieldsToClear));
          toast.success(res?.message);
          setTimeout(() => {
            if (pagetype) {
              router.push("/admin/questionnaire?page7")
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
              router.replace("/auth/signin");
          }
          // if (!pagetype) {
          //   router.push(`/admin/member/add/page8?${res?.userId}`);
          // } else {
          //   router?.back();
          // }
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

  const getDataById = async () => {
    const item = {
      user_id: value,
      meeting_id: getUserdata.meetings.NextMeeting.id,
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

      const dataFromApi = res?.data?.roundTableTopics[0] || {};

      const finalData = {
        estimating: formValues?.estimating || dataFromApi?.estimating,
        accountability:
          formValues?.accountability || dataFromApi?.accountability,
        productivity: formValues?.productivity || dataFromApi?.productivity,
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
  React.useEffect(() => {
    if (type == "edit") {
      getDataById();
    }
  }, [type, form]);
  const onPrevious = () => {
    router.replace(`/admin/member/add/page6?${value}&edit`);
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
          <ToastContainer
                                className="toast-container-center"
                                position="top-right"
                                autoClose={false} // Disable auto-close
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                              />
          <Row justify="center" gutter={[20, 20]} className="heightCenter">
            <Col xs={24} sm={22} md={20} lg={16} xl={14} xxl={12}>
              <Card className="common-card">
                {/* <div className='mb-4'>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item><Link href="/" className='text-decoration-none'>Home</Link></Breadcrumb.Item>
                                <Breadcrumb.Item><Link href="/admin/member" className='text-decoration-none'>User</Link></Breadcrumb.Item>
                                <Breadcrumb.Item ><Link href="/admin/member/add" className='text-decoration-none'>Add User</Link></Breadcrumb.Item>
                                <Breadcrumb.Item ><Link href="/admin/member/add/page2" className='text-decoration-none'>BUSINESS UPDATE</Link></Breadcrumb.Item>
                                <Breadcrumb.Item ><Link href="/admin/member/add/page3" className='text-decoration-none'>GOALS</Link></Breadcrumb.Item>
                                <Breadcrumb.Item ><Link href="/admin/member/add/page4" className='text-decoration-none'>CRAFTSMEN TOOLBOX</Link></Breadcrumb.Item>
                                <Breadcrumb.Item ><Link href="/admin/member/add/page5" className='text-decoration-none'>CRAFTSMEN CHECK-UP</Link></Breadcrumb.Item>
                                <Breadcrumb.Item ><Link href="/admin/member/add/page6" className='text-decoration-none'>2023 MEETING REVIEW</Link></Breadcrumb.Item>
                            </Breadcrumb>
                        </div> */}
                {/* Title  */}
                {/* {pagetype ?
                                    <div className="mb-3">
                                        <Button
                                            size={"small"}
                                            className="text-black"
                                            onClick={hnandleBack}
                                        >
                                            <StepBackwardOutlined />
                                        </Button>
                                    </div> : ""} */}
                <div className="mb-2 d-flex justify-content-between">
                  <Typography.Title level={3} className="m-0 fw-bold">
                    SPRING 2024 MEETING PREPARATION
                  </Typography.Title>
                  {/* <Button size={'large'} type="primary" className="text-white" disabled>6/8</Button> */}
                  {!pagetype && (
                    <Button
                      size={"large"}
                      type="primary"
                      className="text-white"
                      disabled
                    >
                      6/8
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
                    <div className="mt-3 mb-1">
                      <Typography.Title level={5} className="m-0 fw-bold">
                        LIST THREE ROUNDTABLE TOPICS THAT YOU WANT TO COVER IN
                        OUR FALL MEETING (IN ORDER OF IMPORTANCE)
                      </Typography.Title>
                    </div>
                    <Divider plain></Divider>
                    {/* First Name  */}
                    <Form.Item
                      name="estimating"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please Fill Field",
                        },
                      ]}
                    >
                      <TextArea
                        size={"large"}
                        placeholder="Enter..."
                        // placeholder="Estimating should always be No.1"
                      />
                    </Form.Item>
                    <Form.Item
                      name="accountability"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please Fill Field",
                        },
                      ]}
                    >
                      <TextArea
                        size={"large"}
                        placeholder="Enter..."
                        //  placeholder="Accountability should always be No. 2"
                      />
                    </Form.Item>
                    <Form.Item
                      name="productivity"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please Fill Field",
                        },
                      ]}
                    >
                      <TextArea
                        size={"large"}
                        //  placeholder="Productivity should always be No. 3
                        // Daily routine for everybody.
                        // What CRM systems do you use?"
                      />
                    </Form.Item>

                    {/* Button  */}
                    <div className="d-flex mt-3">
                      {!pagetype ? (
                        <div className="col-2">
                          <Button
                            size={"large"}
                            type="primary"
                            className=" "
                            onClick={handleSaveClick}
                            loading={loading1}
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
                            onClick={handleSubmitClick}
                            className="login-form-button "
                            loading={loading}
                          >
                            {!pagetype ? "Next" : "Save"}
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
                            onClick={handleSaveClick}
                            className="login-form-button "
                            loading={loading1}
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

export default Page7;
