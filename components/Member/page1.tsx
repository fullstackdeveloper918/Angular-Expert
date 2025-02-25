"use client";
import {
  Breadcrumb,
  Form,
  Select,
  Input,
  Upload,
  Modal,
  message,
  Typography,
  SelectProps,
  Button,
  Card,
  Col,
  Row,
} from "antd";
import dynamic from "next/dynamic";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { PlusOutlined, StepBackwardOutlined } from "@ant-design/icons";
import Link from "next/link";
import validation from "@/utils/validation";
import MainLayout from "../../components/Layout/layout";
import "react-toastify/dist/ReactToastify.css";
import EmployeeRoles from "@/utils/EmployeeRoles.json";
import TextArea from "antd/es/input/TextArea";
import api from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { destroyCookie, setCookie } from "nookies";
import henceforthApi from "@/utils/api";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";
import nookies from "nookies";
import useAutoSaveForm from "../common/useAutoSaveForm";
import {  clearSpecificFormData } from "@/lib/features/formSlice";
// const { Row, Col, Card, Button } = {
//   Button: dynamic(() => import("antd").then((module) => module.Button), {
//     ssr: false,
//   }),
//   Row: dynamic(() => import("antd").then((module) => module.Row), {
//     ssr: false,
//   }),
//   Col: dynamic(() => import("antd").then((module) => module.Col), {
//     ssr: false,
//   }),
//   Card: dynamic(() => import("antd").then((module) => module.Card), {
//     ssr: false,
//   }),
// };
const Page1 = () => {
  const getUserdata = useSelector((state: any) => state?.user?.userData);
  console.log(getUserdata,"getUserdata");
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [state, setState] = useState<any>("");
  const searchParams = useSearchParams();
  const entries = Array.from(searchParams.entries());

  const value = entries.length > 0 ? entries[0][0] : "";
  console.log(value,"value");
  
  const type = entries.length > 1 ? entries[1][0] : "";
  const pagetype = entries.length > 2 ? entries[2][0] : "";
  const [actionType, setActionType] = useState<'submit' | 'save' | null>(null);
  const savedFormData = useSelector((state: any) => state.form);
  const [formValues, setFormValues] = useState(savedFormData);
  useAutoSaveForm(formValues, 300);

  const setCookie = (name: any, value: any, days: any) => {
    nookies.set(null, name, value, {
      maxAge: days * 24 * 60 * 60,
      path: "/",
    });
  };
  const onFinish = async(values: any) => {
    if (actionType === 'submit') {
      let items = {
        business_update: {
          // userId: value,
          financial_position: values?.financial_position,
          sales_position: values?.sales_position,
          accomplishments: values?.accomplishments,
          hr_position: values?.hr_position,
          current_challenges: values?.current_challenges,
          craftsmen_support: values?.craftsmen_support,
          // is_completed:""
          meeting_id:getUserdata.meetings.NextMeeting.id,
          user_id:getUserdata.user_id
        },
      } as any;
   
      try {
        const fieldsToClear = [
          "financial_position",
          "sales_position",
          "accomplishments",
          "hr_position",
          "current_challenges",
          "craftsmen_support",
        ];
        // if (type == "edit") {
        if (state?.businessUpdate?.length) {
          let items = {
            business_update: {
              // userId: value,
              financial_position: values?.financial_position,
              sales_position: values?.sales_position,
              accomplishments: values?.accomplishments,
              hr_position: values?.hr_position,
              current_challenges: values?.current_challenges,
              craftsmen_support: values?.craftsmen_support,
              //  is_completed:values?.craftsmen_support,
              meeting_id:getUserdata.meetings.NextMeeting.id,
              user_id:getUserdata.user_id
            },
          } as any;
          setLoading(true);
          let res = await api.User.edit(items);
          if (!pagetype) {
            router.push(`/admin/member/add/page3?${value}&edit`);
          } else {
            //   router.back();
            router.push("/admin/questionnaire?page2")
          }
          toast.success(res?.message);
  
          dispatch(clearSpecificFormData(fieldsToClear));
        } else {
          setLoading(true);
          let res = await api.Auth.signUp(items);
          dispatch(clearSpecificFormData(fieldsToClear));
          // if (res?.status == 500) {
          //   localStorage.setItem('redirectAfterLogin', window.location.pathname);
          //   localStorage.removeItem("hasReloaded")
          // destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
          // toast.error("Session Expired. Login Again");
          // router.replace("/auth/signin");
          // }
          router.push(`/admin/member/add/page3?${value}`)
        }
      } catch (error: any) {
        setLoading(false);
        // if (error?.status == 500) {
        //   localStorage.setItem('redirectAfterLogin', window.location.pathname);
        //   destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
        //   localStorage.removeItem("hasReloaded")
        //   toast.error("Session Expired. Login Again");
        //   router.replace("/auth/signin");
        // }
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
        bussiness_update: {
          // userId: value,
          //  is_completed:"",
          financial_position: values?.financial_position,
          sales_position: values?.sales_position,
          accomplishments: values?.accomplishments,
          hr_position: values?.hr_position,
          current_challenges: values?.current_challenges,
          craftsmen_support: values?.craftsmen_support,
          meeting_id:getUserdata.meetings.NextMeeting.id,
          user_id:getUserdata.user_id
        },
      } as any;
  
      try {
        const fieldsToClear = [
          "financial_position",
          "sales_position",
          "accomplishments",
          "hr_position",
          "current_challenges",
          "craftsmen_support",
        ];
        if (state?.businessUpdate?.length) {
        // if (type == "edit") {
          let items = {
            business_update: {
              // userId: value,
              financial_position: values?.financial_position,
              sales_position: values?.sales_position,
              accomplishments: values?.accomplishments,
              hr_position: values?.hr_position,
              current_challenges: values?.current_challenges,
              craftsmen_support: values?.craftsmen_support,
              //  is_completed:values?.craftsmen_support,
              meeting_id:getUserdata.meetings.NextMeeting.id,
              user_id:getUserdata.user_id
            },
          } as any;
          setLoading1(true);
          let res = await api.User.edit(items);
          toast.success(res?.message);
          setTimeout(() => {
            if (pagetype) {
              router.push("/admin/questionnaire?page2")
            } 
          }, 1000);
  
          dispatch(clearSpecificFormData(fieldsToClear));
        } else {
          setLoading1(true);
          let res = await api.Auth.signUp(items);
          dispatch(clearSpecificFormData(fieldsToClear));
          // if (res?.status == 500) {
          //   localStorage.setItem('redirectAfterLogin', window.location.pathname);
          //   localStorage.removeItem("hasReloaded")
          // destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
          // toast.error("Session Expired. Login Again");
          // router.replace("/auth/signin");
          // }
          // router.push(`/admin/member/add/page3?${res?.user_id}`)
        }
      } catch (error: any) {
        setLoading1(false);
        // if (error?.status == 500) {
        //   localStorage.setItem('redirectAfterLogin', window.location.pathname);
        //   destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
        //   localStorage.removeItem("hasReloaded")
        //   toast.error("Session Expired. Login Again");
        //   router.replace("/auth/signin");
        // }
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
 

  const getDataById = async () => {
    const item = {
      user_id: value,
      meeting_id:getUserdata.meetings.NextMeeting.id
    };
    try {
      const res = await api.User.getById(item as any);
      setState(res?.data || null);
      // if (res?.data?.status == 500) {
      //   localStorage.removeItem("hasReloaded");
      //   toast.error("Session Expired Login Again");
      //   router.replace("/auth/signin");
      // }

      const dataFromApi = res?.data || {};

      const finalData = {
        financial_position:
          formValues?.financial_position ||
          dataFromApi?.businessUpdate[0]?.financial_position ||
          "",
        sales_position:
          formValues?.sales_position || dataFromApi?.businessUpdate[0]?.sales_position,
        accomplishments:
          formValues?.accomplishments || dataFromApi?.businessUpdate[0]?.accomplishments,
        hr_position: formValues?.hr_position || dataFromApi?.businessUpdate[0]?.hr_position,
        current_challenges:
          formValues?.current_challenges || dataFromApi?.businessUpdate[0]?.current_challenges,
        craftsmen_support:
          formValues?.craftsmen_support || dataFromApi?.businessUpdate[0]?.craftsmen_support,
      };

      form.setFieldsValue(finalData);
    } catch (error: any) {
      // if (error?.status == 500) {
      //   destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: "/" });
      //   localStorage.removeItem("hasReloaded");
      //   toast.error("Session Expired Login Again");
      //   router.replace("/auth/signin");
      // // }
    }
  };

  useEffect(() => {
    if (state?.businessUpdate?.length||type == "edit") {
      getDataById();
    }
  }, [state?.businessUpdate?.length||type == "edit"]);
  // useEffect(() => {
  //   if (type == "edit") {
  //     getDataById();
  //   }
  // }, [type]);


  
  const onPrevious = () => {
    router.replace(`/admin/member/add?${value}&edit`);
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
  const handleSubmitClick = () => {
    setActionType('submit');
    form.submit(); // Trigger form submission
  };

  const handleSaveClick = () => {
    setActionType('save');
    form.submit(); // Trigger form submission
  };
  return (
    <>
      <Fragment>
        <section>
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
          <Row justify="center" gutter={[20, 20]}>
            <Col sm={22} md={24} lg={16} xl={16} xxl={12}>
              <Card className="common-card">
                <div className="mb-2 d-flex justify-content-between">
                  <Typography.Title level={3} className="m-0 fw-bold">
                    BUSINESS UPDATE
                  </Typography.Title>
                  {/* <Button size={'large'} type="primary" className="text-white" disabled>1/8</Button> */}
                  {!pagetype && (
                    <Button
                      size={"large"}
                      type="primary"
                      className="text-white"
                      disabled
                    >
                      1/8
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
                    onFinish={onFinish}
                    onValuesChange={onValuesChange}
                  >
                    {/* First Name  */}
                    <Form.Item
                      name="financial_position"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please Fill Field",
                        },
                      ]}
                      label="Describe your current financial position:"
                    >
                      <TextArea
                        size={"large"}
                        placeholder="Enter..."
                      // onKeyPress={(e: any) => {
                      //     if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                      //         e.preventDefault();
                      //     } else {
                      //         e.target.value = String(e.target.value).trim()
                      //     }
                      // }}
                      />
                    </Form.Item>
                    {/* Last Name  */}
                    <Form.Item
                      name="sales_position"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please Fill Field",
                        },
                      ]}
                      label="Describe your current sales positions, hot prospects, recently contracted work:"
                    >
                      <TextArea
                        size={"large"}
                        placeholder="Enter..."
                      // onKeyPress={(e: any) => {
                      //     if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                      //         e.preventDefault();
                      //     } else {
                      //         e.target.value = String(e.target.value).trim()
                      //     }
                      // }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="accomplishments"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please Fill Field",
                        },
                      ]}
                      label="Describe your accomplishments in the last 6 months:"
                    >
                      <TextArea
                        size={"large"}
                        placeholder="Enter..."
                      // onKeyPress={(e: any) => {
                      //     if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                      //         e.preventDefault();
                      //     } else {
                      //         e.target.value = String(e.target.value).trim()
                      //     }
                      // }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="hr_position"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please Fill Field",
                        },
                      ]}
                      label="Describe your HR position &/or needs:"
                    >
                      <TextArea
                        size={"large"}
                        placeholder="Enter..."
                      // onKeyPress={(e: any) => {
                      //     if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                      //         e.preventDefault();
                      //     } else {
                      //         e.target.value = String(e.target.value).trim()
                      //     }
                      // }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="current_challenges"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please Fill Field",
                        },
                      ]}
                      label="Describe any current challenges your business is facing (i.e. problem client, personnel
issue(s), trade availability, rising costs, supply chain, etc.):"
                    >
                      <TextArea
                        size={"large"}
                        placeholder="Enter..."
                      // onKeyPress={(e: any) => {
                      //     if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                      //         e.preventDefault();
                      //     } else {
                      //         e.target.value = String(e.target.value).trim()
                      //     }
                      // }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="craftsmen_support"
                      rules={[{ required: true, message: "Please Fill Field" }]}
                      label="How can the Craftsmen aid or support you with these challenges?"
                    >
                      <TextArea
                        size={"large"}
                        placeholder="Enter..."
                      // onKeyPress={(e: any) => {
                      //     if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                      //         e.preventDefault();
                      //     } else {
                      //         e.target.value = String(e.target.value).trim()
                      //     }
                      // }}
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
                            loading={loading1}
                            onClick={handleSaveClick}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        ""
                      )}
                      {
                        !pagetype ? (
                          <div className=" col-8 d-flex  justify-content-center">
                            {/* {!pagetype ?
                                                        <Button size={'large'} type="primary" className=" " onClick={onPrevious}>
                                                            Previous
                                                        </Button> : ""} */}
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
                              // htmlType="submit"
                              className="login-form-button "
                              onClick={handleSaveClick}
                              loading={loading1}
                            >
                              Save
                            </Button>
                          </div>
                        )
                        // <div className=" col-12 d-flex gap-5 justify-content-center">
                        //     <Button size={'large'} type="primary" htmlType="submit" className="login-form-button " loading={loading}>
                        //         Save
                        //     </Button>
                        // </div>
                      }
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

export default Page1;
