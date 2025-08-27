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
import { clearSpecificFormData } from "@/lib/features/formSlice";
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
const Page1 = ({ questions, subheadinglist }: any) => {
  console.log(questions, "ytyt");
  console.log(questions, subheadinglist, "subheadinglist here to see");
  // const filtered_questions = questions?.data?.filter((item:any) => item.page_type === "business_update");
  const filtered_questions = questions?.data?.filter((item: any) => item.page_type === "business_update") // Step 1: Filter by page_type
    .sort(
      (a: any, b: any) =>
        parseInt(a.quesiton_position) - parseInt(b.quesiton_position)
    ) // Step 2: Sort by question_position
    .map((item: any, index: number) => {
      item.quesiton_position = index.toString(); // Step 3: Update quesiton_position to 0, 1, 2, ...
      return item;
    });
  console.log(filtered_questions, "filtered_questions");
  const filteredFinancialQuestions = filtered_questions.filter(
    (question: any) => question.subheading_title === "Financial Position"
  );

  console.log(filteredFinancialQuestions, "filteredFinancialQuestions");
  const getUserdata = useSelector((state: any) => state?.user?.userData);
  console.log(getUserdata, "getUserdata");
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [question, setQuestion] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [state, setState] = useState<any>("");
  const searchParams = useSearchParams();
  const entries = Array.from(searchParams.entries());
  console.log(state, "state");
  const [popup, setPopup] = useState<any>(false);
  const value = entries.length > 0 ? entries[0][0] : "";
  console.log(value, "value");

  const type = entries.length > 1 ? entries[1][0] : "";
  const pagetype = entries.length > 2 ? entries[2][0] : "";
  const [actionType, setActionType] = useState<"submit" | "save" | null>(null);
  const savedFormData = useSelector((state: any) => state.form);
  const [formValues, setFormValues] = useState(savedFormData);
  useAutoSaveForm(formValues, 300);
  console.log(formValues, "formValuessad");
  const groupedQuestions = filtered_questions?.reduce(
    (acc: any, question: any) => {
      const { subheading_title } = question;
      if (!acc[subheading_title]) {
        acc[subheading_title] = [];
      }
      acc[subheading_title].push(question);
      return acc;
    },
    {}
  );
  console.log(groupedQuestions, "groupedQuestions");

  const setCookie = (name: any, value: any, days: any) => {
    nookies.set(null, name, value, {
      maxAge: days * 24 * 60 * 60,
      path: "/",
    });
  };
  const onFinish = async (values: any) => {
    if (actionType === "submit") {
      let items = {
        business_update: {
          meeting_id: getUserdata.meetings.NextMeeting.id,
          user_id: getUserdata.user_id,
          business_update_questions: filtered_questions.map((q: any) => ({
            question_id: q.id,
            question: q.question,
            answer: values[`question_${q.id}`] || "",
            question_position: q.quesiton_position,
            subheading_id: q.subheading_id || "",
            subheading_title: q.subheading_title || "",
          })),
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
              meeting_id: getUserdata.meetings.NextMeeting.id,
              user_id: getUserdata.user_id,
              business_update_questions: filtered_questions.map((q: any) => ({
                question_id: q.id,
                question: q.question,
                answer: values[`question_${q.id}`] || "",
                question_position: q.quesiton_position,
                subheading_id: q.subheading_id || "",
                subheading_title: q.subheading_title || "",
              })),
            },
          } as any;
          setLoading(true);
          let res = await api.User.edit(items);
          if (!pagetype) {
            router.push(`/admin/member/add/page3?${value}&edit`);
          } else {
            //   router.back();
            router.push("/admin/questionnaire?page2");
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
          router.push(`/admin/member/add/page3?${value}`);
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
    } else if (actionType === "save") {
      let items = {
        business_update: {
          meeting_id: getUserdata.meetings.NextMeeting.id,
          user_id: getUserdata.user_id,
          business_update_questions: filtered_questions.map((q: any) => ({
            question_id: q.id,
            question: q.question,
            answer: values[`question_${q.id}`] || "",
            question_position: q.quesiton_position,
            subheading_id: q.subheading_id || "",
            subheading_title: q.subheading_title || "",
          })),
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
              meeting_id: getUserdata.meetings.NextMeeting.id,
              user_id: getUserdata.user_id,
              business_update_questions: filtered_questions.map((q: any) => ({
                question_id: q.id,
                question: q.question,
                answer: values[`question_${q.id}`] || "",
                question_position: q.quesiton_position,
                subheading_id: q.subheading_id || "",
                subheading_title: q.subheading_title || "",
              })),
            },
          } as any;
          setLoading1(true);
          let res = await api.User.edit(items);
          setPopup(true);
          toast.success(res?.message, {
            autoClose: 500, // 10 seconds
          });
          setTimeout(() => {
            setPopup(false);
          }, 3000);
          // toast.success(res?.message);
          setTimeout(() => {
            if (pagetype) {
              router.push("/admin/questionnaire?page2");
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

  console.log(formValues, "qwertyuiop");

  const getDataById = async () => {
    console.log(formValues, "1231231");
    const item = {
      user_id: value,
      meeting_id: getUserdata.meetings.NextMeeting.id,
    };
    try {
      const res = await api.User.getById(item as any);
      setState(res?.data || null);
      // if (res?.data?.status == 500) {
      //   localStorage.removeItem("hasReloaded");
      //   toast.error("Session Expired Login Again");
      //   router.replace("/auth/signin");
      // }
      console.log(res?.data, "to see api dara new");
      console.log(formValues, "popopo");


      // const finalData = {
      //   financial_position:
      //     formValues?.financial_position[0]?.answer ||
      //     dataFromApi?.businessUpdate[0]?.financial_position[0]?.answer ||
      //     "",
      //   sales_position:
      //     formValues?.sales_position || dataFromApi?.businessUpdate[0]?.sales_position[0]?.answer,
      //   accomplishments:
      //     formValues?.accomplishments || dataFromApi?.businessUpdate[0]?.accomplishments[0]?.answer,
      //   hr_position: formValues?.hr_position || dataFromApi?.businessUpdate[0]?.hr_position[0]?.answer,
      //   current_challenges:
      //     formValues?.current_challenges || dataFromApi?.businessUpdate[0]?.current_challenges[0]?.answer,
      //   craftsmen_support:
      //     formValues?.craftsmen_support || dataFromApi?.businessUpdate[0]?.craftsmen_support[0]?.answer,
      // };

      // form.setFieldsValue(finalData);

      console.log(res?.data?.businessUpdate, "getting some values bbb");
      const questionAnswers =
        res?.data?.businessUpdate[0]?.business_update_questions?.reduce(
          (acc: any, question: any) => {
            acc[`question_${question.question_id}`] = question.answer;
            return acc;
          },
          {}
        );

        console.log(questionAnswers,"questionAnswers to rdee")
        

    // Merge API data and form values
const resValues = {
  ...dataFromApi?.craftsmen_checkup_update_questions?.reduce(
    (acc: any, question: any) => {
      acc[`question_${question.question_id}`] = question.answer;
      return acc;
    },
    {}
  ),
  ...formValues, // formValues overwrite API data if exists
};

// Get all field keys
const fields = new Set([
  ...Object.keys(
    dataFromApi?.craftsmen_checkup_update_questions?.reduce(
      (acc: any, question: any) => {
        acc[`question_${question.question_id}`] = question.answer;
        return acc;
      },
      {}
    ) || {}
  ),
  ...Object.keys(formValues || {}),
]);

console.log(resValues, fields);

fields.forEach((key) => {
  const apiValue = questionAnswers?.[key];
  const formValue = formValues?.[key];

  if (apiValue !== undefined && apiValue !== null && apiValue !== "") {
    // Use API value if it exists
    resValues[key] = apiValue;
  } else {
    // Otherwise fallback to form value
    resValues[key] = formValue;
  }
});

form.setFieldsValue(resValues);

          console.log(resValues,"value check kr la ")
      form.setFieldsValue(resValues);
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
    if (state?.businessUpdate?.length || type == "edit") {
      getDataById();
    }
  }, [state?.businessUpdate?.length || type == "edit"]);
  // useEffect(() => {
  //   if (type == "edit") {
  //     getDataById();
  //   }
  // }, [type]);

  console.log(formValues, "asdas");
  const onPrevious = () => {
    router.replace(`/admin/member/add?${value}&edit`);
  };
  const hnandleBack = () => {
    router.back();
  };

  const onValuesChange = (changedValues: any) => {
    console.log(changedValues, "changedValues");

    setFormValues((prevValues: any) => ({
      ...prevValues,
      ...changedValues,
    }));
  };
  const handleSubmitClick = () => {
    setActionType("submit");
    form.submit(); // Trigger form submission
  };

  const handleSaveClick = () => {
    setActionType("save");
    form.submit(); // Trigger form submission
  };

  const getQuestion = async () => {
    try {
      let res = await api.Manage_Question.listing();
      setQuestion(res);
    } catch (error) {}
  };

  useEffect(() => {
    getQuestion();
  }, []);

  // console.log(question?.data[1]?.question,"question");
  const label = questions.length > 0 && `label=${questions?.data[1]?.question}`;

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
                      1/9
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
                    {Object.keys(groupedQuestions)?.map(
                      (subheadingTitle: any, index: any) => (
                        <div key={index} className="mt-5">
                          {/* Display the subheading title */}
                          <h5>{subheadingTitle}</h5>
                          {/* Display questions for the current subheading */}
                          {groupedQuestions[subheadingTitle]?.map(
                            (question: any, index: any) => (
                              <Form.Item
                                key={question?.id}
                                name={`question_${question.id}`}
                                label={question?.question}
                              >
                                <TextArea size="large" placeholder="Enter..." />
                              </Form.Item>
                            )
                          )}
                        </div>
                      )
                    )}

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
                              disabled={popup}
                              style={{ opacity: popup ? "0" : "1" }}
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
