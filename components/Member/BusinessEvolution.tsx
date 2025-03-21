"use client";
import { Button, Card, Col, Form, Row, Typography } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import MainLayout from "../../components/Layout/layout";
import TextArea from "antd/es/input/TextArea";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { destroyCookie } from "nookies";
import { StepBackwardOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import useAutoSaveForm from "../common/useAutoSaveForm";
const BusinessEvolution = ({questions}:any) => {

  console.log(questions,"ytaaayt");
  const filtered_questions = questions?.data?.filter((item: any) => item.page_type === "business_evolution") // Step 1: Filter by page_type
  .sort((a: any, b: any) => parseInt(a.quesiton_position) - parseInt(b.quesiton_position)) // Step 2: Sort by question_position
  .map((item: any, index: number) => {
    item.quesiton_position = index.toString(); // Step 3: Update quesiton_position to 0, 1, 2, ...
    return item;
  });
  console.log(filtered_questions,"filtered_questions");

  const getUserdata = useSelector((state: any) => state?.user?.userData);
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<any>(false);
  const [loading1, setLoading1] = useState<any>(false);
  const [actionType, setActionType] = useState<"submit" | "save" | null>(null);
  const [state, setState] = useState<any>("");
  // const [question, setQuestion] = useState<any>([]);
  console.log(questions,"questions");
  
  // const filtered_questions = question?.filter((item: any) => item.page_type === "answers") // Step 1: Filter by page_type
  // .sort((a: any, b: any) => parseInt(a.quesiton_position) - parseInt(b.quesiton_position)) // Step 2: Sort by question_position
  // .map((item: any, index: number) => {
  //   item.quesiton_position = index.toString(); // Step 3: Update quesiton_position to 0, 1, 2, ...
  //   return item;
  // });
  console.log(filtered_questions,"filtered_questions");
  
  const searchParams = useSearchParams();
  const entries = Array.from(searchParams.entries());
  const value = entries.length > 0 ? entries[0][0] : "";
  const type = entries.length > 1 ? entries[1][0] : "";
  const questionnaire = entries.length > 2 ? entries[2][0] : "";
  const pagetype = entries.length > 2 ? entries[2][0] : "";

  const savedFormData = useSelector((state: any) => state.form);

  const [formValues, setFormValues] = useState(savedFormData);
  useAutoSaveForm(formValues, 300);

  const submit = async (values: any) => {
    if (actionType === "submit") {
      let items = {
        business_evolution_industry_trends: {
          user_id: value,
          meeting_id: getUserdata.meetings.NextMeeting.id,
          business_evolution_update_industry_trends: filtered_questions.map((q: any) => ({
            question_id: q.id,
            question: q.question,
            answer: values[`question_${q.id}`] || "",
            question_position:q.quesiton_position,
            subheading_id:q.subheading_id||"",
            subheading_title:q.subheading_title||"",
          })),
        },
      };
      try {
        // if (type == "edit") {
        if (state?.businessEvolutionIndustryTrendsUpdates?.length) {
          let items = {
            business_evolution_industry_trends: {
              user_id: value,
              meeting_id: getUserdata.meetings.NextMeeting.id,
              business_evolution_update_industry_trends: filtered_questions.map((q: any) => ({
                question_id: q.id,
                question: q.question,
                answer: values[`question_${q.id}`] || "",
                question_position:q.quesiton_position,
                subheading_id:q.subheading_id||"",
                subheading_title:q.subheading_title||"",
              })),
            },
          } as any;
          setLoading(true);

          let res = await api.User.edit(items);
          toast.success(res?.message);
          // if (!pagetype) {
          //     router.push(`/admin/member/add/page8?${res?.userId}&edit&questionnair`)
          // }else{
          //     router?.back()
          // }
          // }
          setTimeout(() => {
            if (!pagetype) {
              router.push(`/admin/member/add/page6?${value}&edit`);
            } else {
              router.push("/admin/questionnaire?additionalPage");
            }
          }, 1000);
        } else {
          setLoading(true);
          let res = await api.Auth.signUp(items);
          // if (res?.status == 500) {
          //   toast.error("Session Expired Login Again");
          //   router.replace("/auth/signin");
          // }
          if (!pagetype) {
            router.push(
              `/admin/member/add/page8?${value}&edit&questionnair`
            );
          } else {
            router?.back();
          }
        }
      } catch (error: any) {
        if (!pagetype) {
          setLoading(false);
        }
        // if (error?.status == 500) {
        //   localStorage.setItem('redirectAfterLogin', window.location.pathname);
        //   localStorage.removeItem("hasReloaded")
        //   destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
        //   toast.error("Session Expired. Login Again");
        //   router.replace("/auth/signin");
        // }
      } finally {
        if (pagetype) {
          setLoading(false);
        }
      }
    } else if (actionType === "save") {
      let items = {
        business_evolution_industry_trends: {
          user_id: value,
          meeting_id: getUserdata.meetings.NextMeeting.id,
          business_evolution_update_industry_trends:filtered_questions.map((q: any) => ({
            question_id: q.id,
            question: q.question,
            answer: values[`question_${q.id}`] || "",
            question_position:q.quesiton_position,
            subheading_id:q.subheading_id||"",
            subheading_title:q.subheading_title||"",
          })),
        },
      };
      try {
        if (state?.businessEvolutionIndustryTrendsUpdates?.length) {
          // if (type == "edit") {
          let items = {
            business_evolution_industry_trends: {
              user_id: value,
              meeting_id: getUserdata.meetings.NextMeeting.id,
              business_evolution_update_industry_trends:filtered_questions.map((q: any) => ({
                question_id: q.id,
                question: q.question,
                answer: values[`question_${q.id}`] || "",
                question_position:q.quesiton_position,
                subheading_id:q.subheading_id||"",
                subheading_title:q.subheading_title||"",
              })),
            },
          } as any;
          setLoading1(true);

          let res = await api.User.edit(items);
          toast.success(res?.message);
          // if (!pagetype) {
          //     router.push(`/admin/member/add/page8?${res?.userId}&edit&questionnair`)
          // }else{
          //     router?.back()
          // }
          // }
        } else {
          setLoading1(true);
          let res = await api.Auth.signUp(items);
          // if (res?.status == 500) {
          //   toast.error("Session Expired Login Again");
          //   router.replace("/auth/signin");
          // }
        }
      } catch (error: any) {
        if (!pagetype) {
          setLoading1(false);
        }
        // if (error?.status == 500) {
        //   localStorage.setItem('redirectAfterLogin', window.location.pathname);
        //   localStorage.removeItem("hasReloaded")
        //   destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
        //   toast.error("Session Expired. Login Again");
        //   router.replace("/auth/signin");
        // }
      } finally {
        if (pagetype) {
          setLoading1(false);
        }
      }
    }
    setLoading1(false);
  };
  const handleSubmitClick = () => {
    setActionType("submit");
    form.submit(); // Trigger form submission
  };

  const handleSaveClick = () => {
    setActionType("save");
    form.submit(); // Trigger form submission
  };
  // const getQuestion = async () => {
  //   try {
  //     const res = await api.User.getQuestion();
  //     setQuestion(res);

  //     // if (
  //     //   res?.data?.status == 500 ||
  //     //   res?.data?.message ==
  //     //     "Firebase ID token has expired. Get a fresh ID token from your client app and try again (auth/id-token-expired). See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token."
  //     // ) {
  //     //   localStorage.setItem('redirectAfterLogin', window.location.pathname);
  //     //   localStorage.removeItem("hasReloaded")
  //     //   destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
  //     //   toast.error("Session Expired. Login Again");
  //     //   router.replace("/auth/signin");
  //     // }
  //   } catch (error) {}
  // };

  // useEffect(() => {
  //   getQuestion();
  // }, []);


  
  const getDataById = async () => {
    const item = {
      user_id: value,
      meeting_id: getUserdata.meetings.NextMeeting.id,
    };
    try {
      const res = await api.User.getById(item as any);
      setState(res?.data || null);
      console.log(res?.data,"qwert");
      
      // if (res?.data?.status == 500) {
      //   localStorage.setItem('redirectAfterLogin', window.location.pathname);
      //   localStorage.removeItem("hasReloaded")
      //   destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
      //   toast.error("Session Expired. Login Again");
      //   router.replace("/auth/signin");
      // }

      // Prepare an object to set form values
      // const resValues = res?.data?.questions.reduce(
      //   (acc: any, question: any) => {
      //     acc[`question_${question.question_id}`] = question.answer;
      //     return acc;
      //   },
      //   {}
      // );
      const dataFromApi = res?.data?.businessEvolutionIndustryTrendsUpdates[0] || {};
      const resValues = dataFromApi?.business_evolution_update_industry_trends.reduce((acc: any, question: any) => {
              acc[`question_${question.question_id}`] = question.answer;
              return acc;
            }, {});

      form.setFieldsValue(resValues);
    } catch (error: any) {
      // if (error == 500) {
      //   // destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: "/" });
      //   // localStorage.removeItem("hasReloaded");
      //   // // }
      //   // toast.error("Session Expired Login Again");
      //   // router.replace("/auth/signin");
      //   localStorage.setItem('redirectAfterLogin', window.location.pathname);
      //   localStorage.removeItem("hasReloaded")
      //   destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
      //   toast.error("Session Expired. Login Again");
      //   router.replace("/auth/signin");
      // }
    }
  };
  useEffect(() => {
    if (type == "edit") {
      getDataById();
    }
  }, [type, form]);
  const onPrevious = () => {
    router.replace(`/admin/member/add/well_being_check_in?${value}&edit`);
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
                  BUSINESS EVOLUTION & INDUSTRY TRENDS  
                  </Typography.Title>
                  {/* <Button size={'large'} type="primary" className="text-white" disabled>7/8</Button> */}
                  {!pagetype && (
                    <Button
                      size={"large"}
                      type="primary"
                      className="text-white"
                      disabled
                    >
                      6/9
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

                    {filtered_questions.map((question: any) => (
                      <Form.Item
                        key={question.id}
                        name={`question_${question.id}`}
                        // rules={[
                        //   {
                        //     required: true,
                        //     whitespace: true,
                        //     message: "Please Fill Field",
                        //   },
                        // ]}
                        label={question.question}
                      >
                        <TextArea size="large" placeholder="Enter..." />
                      </Form.Item>
                    ))}

                    {/* Button  */}
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

export default BusinessEvolution;
