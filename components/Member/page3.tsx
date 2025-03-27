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
  Space,
} from "antd";
import dynamic from "next/dynamic";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import validation from "@/utils/validation";
import MainLayout from "../../components/Layout/layout";
import {
  PlusOutlined,
  MinusCircleOutlined,
  StepBackwardOutlined,
} from "@ant-design/icons";
import EmployeeRoles from "@/utils/EmployeeRoles.json";
import api from "@/utils/api";
import TextArea from "antd/es/input/TextArea";
import { toast, ToastContainer } from "react-toastify";
import { destroyCookie } from "nookies";
import useAutoSaveForm from "../common/useAutoSaveForm";
import { useSelector } from "react-redux";
import { comment } from "postcss";

interface Goal {
  goal?: string;
  comment?: string;
  goal_next?: string;
}
const { Option } = Select;
const Page3 = ({questions}:any) => {
  const getUserdata = useSelector((state: any) => state?.user?.userData);
  console.log(getUserdata,"getUserdata");
  // console.log(getUserdata?.meetings?.lastMeeting?.id,"getUserdata");
  
  const router = useRouter();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [state, setState] = useState<any>("");
  const searchParams = useSearchParams();
  const entries = Array.from(searchParams.entries());
  const [popup, setPopup] = useState<any>(false);
  const [formValues, setFormValues] = useState<any>("");
  useAutoSaveForm(formValues, 300);
  const [actionType, setActionType] = useState<"submit" | "save" | null>(null);
  const value = entries.length > 0 ? entries[0][0] : "";
  const type = entries.length > 1 ? entries[1][0] : "";
  const questionnair = entries.length > 2 ? entries[2][1] : "";
  const pagetype = entries.length > 2 ? entries[2][0] : "";
  const submit = async (values: any) => {
    console.log(values,"ioiooiio");
    // const updatedLastGoals = values?.last_goals?.map((goal:any) => ({
    //   ...goal, // Spread the current goal object
    //   lastMeetingId: getUserdata?.meetings?.lastMeeting?.id // Add the lastMeetingId
    // }));
    // console.log(updatedLastGoals,"updatedLastGoalsljaljas");
    
    // return

    if (actionType === "submit") {
      let items = {
        goals: {
          user_id: value,
              meeting_id:getUserdata?.meetings?.NextMeeting?.id,
              lastMeetingId: getUserdata?.meetings?.lastMeeting?.id,
          goal_last_meeting: values?.last_goals,
          goal_next_meeting: values?.next_goals,
        },
      };
      // return
      try {
        setLoading(true);
        if (state?.futureMeetings?.length) {
        // if (type == "edit") {
          let items = {
            goals: {
              user_id: value,
              meeting_id:getUserdata.meetings.NextMeeting.id,
              lastMeetingId: getUserdata?.meetings?.lastMeeting?.id,
              goal_last_meeting: values?.last_goals,
              goal_next_meeting: values?.next_goals,
            },
          } as any;
          setLoading(true);
          let res = await api.User.edit(items);
          localStorage.removeItem("LastGoals");
          localStorage.removeItem("NextGoals");
          setTimeout(() => {
            if (!pagetype) {
              router.push(`/admin/member/add/page4?${value}&edit`);
            } else {
              router.push("/admin/questionnaire?page3");
            }
          }, 1000);
          // }
        } else {
          let res = await api.Auth.signUp(items);
          if (!pagetype) {
            router.push(`/admin/member/add/page4?${value}`);
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
    } else if (actionType === "save") {
      let items = {
        goals: {
          user_id: value,
              meeting_id:getUserdata.meetings.NextMeeting.id,
              lastMeetingId: getUserdata?.meetings?.lastMeeting?.id,
          goal_last_meeting: values?.last_goals,
          goal_next_meeting: values?.next_goals,
        },
      };
      try {
        setLoading1(true);
        // if (type == "edit") {
        if (state?.futureMeetings.length) {
          let items = {
            goals: {
              user_id: value,
              meeting_id:getUserdata.meetings.NextMeeting.id,
              lastMeetingId: getUserdata?.meetings?.lastMeeting?.id,
              goal_last_meeting: values?.last_goals,
              goal_next_meeting: values?.next_goals,
            },
          } as any;
          setLoading1(true);
          let res = await api.User.edit(items);
          // toast.success(res?.message);
          setPopup(true);
          toast.success(res?.message, {
            autoClose: 500, // 10 seconds
          });
          setTimeout(() => {
            setPopup(false);
          }, 3000);
          localStorage.removeItem("LastGoals");
          localStorage.removeItem("NextGoals");
          setTimeout(() => {
            if (pagetype) {
              router.push("/admin/questionnaire?page3")
            } 
          }, 1000);
        } else {
          let res = await api.Auth.signUp(items);
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
    setActionType("submit");
    form.submit();
  };

  const handleSaveClick = () => {
    setActionType("save");
    form.submit();
  };
  const localLastGoal = localStorage.getItem("LastGoals");

  const getDataById = async () => {
    const item = {
      user_id: value,
      meeting_id:getUserdata.meetings.NextMeeting.id
    };
    try {
      const res = await api.User.getById(item as any);
      setState(res?.data || null);

      // if (res?.data?.status == 500) {
      //   localStorage.setItem("redirectAfterLogin", window.location.pathname);
      //   localStorage.removeItem("hasReloaded");
      //   destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: "/" });
      //   toast.error("Session Expired. Login Again");
      //   router.replace("/auth/signin");
      // }
      const savedGoalsData = localStorage.getItem("LastGoals");

      let parsedGoals = savedGoalsData ? JSON.parse(savedGoalsData) : [];

      if (parsedGoals.length === 0) {
        parsedGoals = res?.data?.lastNextMeetings[0]?.goal_next_meeting || res?.data?.goal_last_meeting;
      }

      const fetchedGoals = parsedGoals
        ? parsedGoals
        : res?.data.lastNextMeetings[0].goal_next_meeting || [];
        form.setFieldsValue({ last_goals: fetchedGoals });
      const savedGoalsData1 = localStorage.getItem("NextGoals");
      let parsedGoals1 = savedGoalsData1 ? JSON.parse(savedGoalsData1) : [];
      if (parsedGoals1.length === 0) {
        parsedGoals1 = res?.data.futureMeetings[0].goal_next_meeting || [];
      }

      const fetchedGoals1 = parsedGoals1
        ? parsedGoals1
        : res?.data?.futureMeetings[0]?.goal_next_meeting || [];
      form.setFieldsValue({ next_goals: fetchedGoals1 });
    } catch (error: any) {
      // if (error.status == 500) {
      //   localStorage.setItem("redirectAfterLogin", window.location.pathname);
      //   destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: "/" });
      //   toast.error("Session Expired. Login Again");
      //   localStorage.removeItem("hasReloaded");
      //   router.replace("/auth/signin");
      // }
    }
  };

  useEffect(() => {
    // if (type=="edit") {
      getDataById();
    // }
  }, [ form]);
  // useEffect(() => {
  //   if (type == "edit") {
  //     getDataById();
  //   }
  // }, [type, form]);
  const[backLoading,setBackLoading]=useState<any>(false)
  const onPrevious = () => {
    
    try {
      setBackLoading(true)
      router.replace(`/admin/member/add/page2?${value}&edit`);
      
    } catch (error) {
      setBackLoading(false)
    }
  };
  const hnandleBack = () => {
    try {
      setBackLoading(true)
      router.back();
    } catch (error) {
      setBackLoading(false)
    }
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    localStorage.setItem("LastGoals", JSON.stringify(allValues?.last_goals));
    localStorage.setItem("NextGoals", JSON.stringify(allValues?.next_goals));
  };
  useEffect(() => {
    // Ensure there are at least 3 fields
    const last_goals = form.getFieldValue('last_goals') || [];
    if (last_goals.length < 3) {
      const additionalFields = Array(3 - last_goals.length).fill(null);
      additionalFields.forEach(() => form.getFieldValue('last_goals').push({ name: '', comment: '' }));
      form.setFieldsValue({ last_goals: form.getFieldValue('last_goals') });
    }
  }, [form]);
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
          <Row justify="center" gutter={[20, 20]}>
            <Col sm={22} md={24} lg={16} xl={16} xxl={12}>
              <Card className="common-card">
                <div className="mb-2 d-flex justify-content-between">
                  <Typography.Title level={3} className="m-0 fw-bold">
                    GOALS
                  </Typography.Title>
                  {!pagetype && (
                    <Button
                      size={"large"}
                      type="primary"
                      className="text-white"
                      disabled
                    >
                      2/9
                    </Button>
                  )}
                </div>

                {/* form  */}

                <div className="card-form-wrapper">
                  <div className="mt-3 mb-1">
                    <Typography.Title level={5} className="m-0 fw-bold">
                      GOALS FROM LAST MEETING
                    </Typography.Title>
                  </div>
                  {/* : ""} */}
                  <Form
                    form={form}
                    name="add_staff"
                    className="add-staff-form"
                    scrollToFirstError
                    layout="vertical"
                    
                    onValuesChange={onValuesChange}
                    onFinish={submit}
                    initialValues={{ last_goals: [{ name: '', comment: '' }, { name: '', comment: '' }, { name: '', comment: '' }] }}
                  >
                    <Form.List name="last_goals" >
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <>
                             <Form.Item  {...restField} name={[name, "status"]}>
                                <Select 
                                // disabled
                                defaultValue={"...Select"}
                                  className="responiveSelect"
                                  style={{
                                    position: "absolute",
                                    top: "35px",
                                    right: "0px",
                                    fontSize: "24px",
                                    cursor: "pointer",
                                    width: 120,
                                  }}
                                >
                                  <Option value="completed">Completed</Option>
                                  <Option value="progressing">
                                    Progressing
                                  </Option>
                                  <Option value="struggling">Struggling</Option>
                                  <Option value="not_started">
                                    Not Started
                                  </Option>
                                </Select>
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, "name"]}
                                label={`Goal #${key+1}`}
                              >
                                <TextArea
                                // disabled
                                  size={"large"}
                                  placeholder="Enter..."
                                  className="text-black"
                                />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, "comment"]}
                                label={`Comment #${key+1}`}
                              >
                                <TextArea
                                // disabled
                                  size={"large"}
                                  placeholder="Enter..."
                                  className="text-black"
                                />
                              </Form.Item>
                             
                              <div className="remove_row" >
                                <MinusCircleOutlined
                                  style={{
                                    top: "-11px",
                                    right: "0",
                                    fontSize: "24px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => remove(name)}
                                />
                              </div>
                            </>
                          ))}
                          {/* <Form.Item className="mt-2">
                            <Button
                            
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add field
                            </Button>
                          </Form.Item> */}
                        </>
                      )}
                    </Form.List>

                    {/* : ""}  */}
                    <div className="mt-3 mb-1">
                      <Typography.Title level={5} className="m-0 fw-bold">
                        GOALS FOR NEXT MEETING
                      </Typography.Title>
                    </div>
                    <Form.List name="next_goals">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.slice(0,3).map(({ key, name, ...restField }) => (
                            <>
                             <Form.Item {...restField} name={[name, "status"]} >
                                <Select
                                  className="responiveSelect"
                                  defaultValue={"...Select"}
                                  style={{
                                    position: "absolute",
                                    top: "35px",
                                    right: "0px",
                                    fontSize: "24px",
                                    cursor: "pointer",
                                    width: 120,
                                  }}
                                >
                                  <Option value="high">High</Option>
                                  <Option value="medium">Medium</Option>
                                  <Option value="low">Low</Option>
                                </Select>
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, "name"]}
                                label={`Business Goal #${key+1}`}
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
                                  className="text-black"
                                />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, "to_be_completed_by"]}
                                label={`To be Completed By:`}
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
                                  className="text-black"
                                />
                              </Form.Item>

                             
                              <div className="remove_row">
                                <MinusCircleOutlined
                                  style={{
                                    top: "-11px",
                                    right: "0",
                                    fontSize: "24px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => remove(name)}
                                />
                              </div>
                            </>
                          ))}
                          {fields?.length ===3?
                           <Form.Item className="mt-2">
                           <Button
                           disabled
                             type="dashed"
                             onClick={() => add()}
                             block
                             icon={<PlusOutlined />}
                           >
                             Add field
                           </Button>
                         </Form.Item>
                          :
                          <Form.Item className="mt-2">
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add field
                            </Button>
                          </Form.Item>}
                        </>
                      )}
                    </Form.List>

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
                              loading={backLoading}
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
                            loading={backLoading}
                            onClick={hnandleBack}
                          >
                            Back
                          </Button>

                          <Button
                            size={"large"}
                            type="primary"
                            disabled={popup}
                            style={{ opacity: popup ? "0" : "1" }}
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

export default Page3;
