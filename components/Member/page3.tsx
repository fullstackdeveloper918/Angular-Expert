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
import { toast } from "react-toastify";
import { destroyCookie } from "nookies";
import useAutoSaveForm from "../common/useAutoSaveForm";
import { useSelector } from "react-redux";

interface Goal {
  goal?: string;
  comment?: string;
  goal_next?: string;
}
const { Option } = Select;
const Page3 = () => {
  const router = useRouter();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [state, setState] = useState<any>("");
  const searchParams = useSearchParams();
  const entries = Array.from(searchParams.entries());
  const savedFormData = useSelector((state: any) => state.form);
  const [formValues, setFormValues] = useState(savedFormData);
  useAutoSaveForm(formValues, 300);

  console.log(formValues, 'formVallues')

  const [actionType, setActionType] = useState<'submit' | 'save' | null>(null);
  const value = entries.length > 0 ? entries[0][0] : "";
  const type = entries.length > 1 ? entries[1][0] : "";
  const questionnair = entries.length > 2 ? entries[2][1] : "";
  const pagetype = entries.length > 2 ? entries[2][0] : "";
  //   const id: any = searchParam.id;

  const [inputFields, setInputFields] = useState([
    { name: "goal_next", label: "Goal 1:", status1: "Select..." },
  ]);

  const addInputField = () => {
    setInputFields([
      ...inputFields,
      {
        name: `goal_next${inputFields.length + 1}`,
        label: `Goal ${inputFields.length + 1}:`,
        status1: "Select...",
      },
    ]);
  };

  const removeInputField = (index: any) => {
    const newInputFields = inputFields.filter((_, i) => i !== index);
    setInputFields(
      newInputFields.map((field, i) => ({
        name: `goal_next${i + 1}`,
        label: `Goal ${i + 1}:`,
        status1: field.status1, // maintain the status
      }))
    );
  };

  const handleStatusChange1 = (index: any, value: any) => {
    setInputFields(
      inputFields.map((field, i) =>
        i === index ? { ...field, status1: value } : field
      )
    );
  };
  const [inputPairs, setInputPairs] = useState([
    {
      id: 1,
      goalName: "goal1",
      goalLabel: "GOAL #1",
      commentName: "comments1",
      commentLabel: "Comments:",
      status: "Select...",
    },
    {
      id: 2,
      goalName: "goal2",
      goalLabel: "GOAL #2",
      commentName: "comments2",
      commentLabel: "Comments:",
      status: "Select...",
    },
    {
      id: 3,
      goalName: "goal3",
      goalLabel: "GOAL #3",
      commentName: "comments3",
      commentLabel: "Comments:",
      status: "Select...",
    },
  ]);

  const addInputPair = () => {
    const nextIndex = inputPairs.length + 1;

    setInputPairs([
      ...inputPairs,
      {
        id: nextIndex,
        goalName: `goal${nextIndex}`,
        goalLabel: `GOAL #${nextIndex}`,
        commentName: `comments${nextIndex}`,
        commentLabel: "Comments:",
        status: "Select...",
      },
    ]);
  };

  const removeInputPair = (id: any) => {
    setInputPairs(inputPairs.filter((pair) => pair.id !== id));
  };

  const handleStatusChange = (id: any, value: any) => {
    console.log(id, value, 'id value')
    setInputPairs(
      inputPairs.map((pair) =>
        pair.id === id ? { ...pair, status: value } : pair
      )
    );
  };


  console.log(inputPairs, 'inputPairs')


  const submit = async(values: any) => {
    if (actionType === 'submit') {
      const goalsData = inputPairs.map((pair) => ({
        goal: values[pair.goalName],
        comment: values[pair.commentName],
        status: pair.status,
      }));
      const goalsData1 = inputFields.map((field) => ({
        goal: values[field.name],
        status: field.status1,
      }));
      let items = {
        goals: {
          userId: value,
          goal_last_meeting: goalsData,
          goal_next_meeting: goalsData1,
        },
      };
      try {
        setLoading(true);
        if (type == "edit") {
          let items = {
            goals: {
              userId: value,
              goal_last_meeting: goalsData,
              goal_next_meeting: goalsData1,
            },
          } as any;
          setLoading(true);
          let res = await api.User.edit(items);
  
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
            router.push(`/admin/member/add/page4?${res?.userId}`);
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
      const goalsData = inputPairs.map((pair) => ({
        goal: values[pair.goalName],
        comment: values[pair.commentName],
        status: pair.status,
      }));
      const goalsData1 = inputFields.map((field) => ({
        goal: values[field.name],
        status: field.status1,
      }));
      let items = {
        goals: {
          userId: value,
          goal_last_meeting: goalsData,
          goal_next_meeting: goalsData1,
        },
      };
      try {
        setLoading1(true);
        if (type == "edit") {
          let items = {
            goals: {
              userId: value,
              goal_last_meeting: goalsData,
              goal_next_meeting: goalsData1,
            },
          } as any;
          setLoading1(true);
          let res = await api.User.edit(items);
  
          // setTimeout(() => {
          //   if (!pagetype) {
          //     router.push(`/admin/member/add/page4?${value}&edit`);
          //   } else {
          //     router.push("/admin/questionnaire?page3");
          //   }
          // }, 1000);
          // }
        } else {
          let res = await api.Auth.signUp(items);
          // if (!pagetype) {
          //   router.push(`/admin/member/add/page4?${res?.userId}`);
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
    };
    try {
      const res = await api.User.getById(item as any);
      setState(res?.data || null);
      if (res?.data?.status == 500) {
        localStorage.setItem("redirectAfterLogin", window.location.pathname);
        localStorage.removeItem("hasReloaded");
        destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: "/" });
        toast.error("Session Expired. Login Again");
        router.replace("/auth/signin");
      }

      const fetchedGoals = res?.data.goal_last_meeting || [];
      const formattedGoals = fetchedGoals.map((goal: any, index: any) => ({
        id: index + 1,
        goalName: `goal${index + 1}`,
        goalLabel: `GOAL #${index + 1}`,
        commentName: `comments${index + 1}`,
        commentLabel: "Comments:",
        status: goal.status,
        initialGoal: goal.goal,
        initialComment: goal.comment,
      }));
   

      const transformDataToArray = (
        formValues: any,
        prefix: string
      ): Goal[] => {
        const goalsArray: Goal[] = [];

        Object.keys(formValues).forEach((key) => {
          const match = key.match(
            new RegExp(`^${prefix}(goal|comments|goal_next|status)(\\d+)$`)
          );
          if (match) {
            const [, type, index] = match;
            const idx = parseInt(index, 10) - 1;

            console.log(idx, 'check idx')

            if (!goalsArray[idx]) {
              goalsArray[idx] = {};
            }

            if (type === "goal") {
              goalsArray[idx].goal = formValues[key];
            } else if (type === "comments") {
              goalsArray[idx].comment = formValues[key];
            } else if (type == "goal_next") {
              goalsArray[idx].goal_next = formValues[key];
            } else if (type === "status") {
              inputPairs[idx].status = formValues[key];
            }
          }
        });

        return goalsArray;
      };

      const prepareFormValues = (data: Goal[], prefix: string): any => {
        const formValues = data.reduce(
          (acc: any, goal: Goal, index: number) => {
            if (goal.goal) {
              acc[`${prefix}goal${index + 1}`] = goal.goal;
            }
            if (goal.comment) {
              acc[`${prefix}comments${index + 1}`] = goal.comment;
            }
            if (goal.goal_next) {
              acc[`${prefix}goal_next${index + 1}`] = goal.goal_next;
            }
            return acc;
          },
          {}
        );

        return formValues;
      };

      const dataToUse =
        Object.keys(formValues).length > 0
          ? transformDataToArray(formValues, "")
          : fetchedGoals;

      form.setFieldsValue({
        ...prepareFormValues(dataToUse, ""),
      });
     
      
      setInputPairs(formattedGoals);
      const fetchedGoalsNext = res?.data.goal_next_meeting || [];

      const formattedGoalsNext = fetchedGoalsNext.map(
        (goal: any, index: number) => ({
          name: `goal_next${index + 1}`,
          label: `Goal ${index + 1}:`,
          status1: goal.status,
          initialGoal1: goal.goal,
        })
      );

      setInputFields(formattedGoalsNext);

      form.setFieldsValue({
        ...prepareFormValues(fetchedGoalsNext, "goal_next"),
      });
    } catch (error: any) {
      if (error.status == 500) {
        localStorage.setItem("redirectAfterLogin", window.location.pathname);
        destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: "/" });
        toast.error("Session Expired. Login Again");
        localStorage.removeItem("hasReloaded");
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
    router.replace(`/admin/member/add/page2?${value}&edit`);
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
                      2/8
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
                  >
                    <div className="">
                      {inputPairs.map((pair: any, index: any) => (
                        <div key={pair.id} style={{ position: "relative" }}>
                          <Form.Item
                            name={pair.goalName}
                            label={pair.goalLabel}
                          >
                            <TextArea
                              size={"large"}
                              placeholder="Enter..."
                              className="text-black"
                              // disabled={state?.goal_last_meeting?.length > 0}
                            />
                          </Form.Item>
                          <Form.Item
                            name={pair.commentName}
                            label={pair.commentLabel}
                          >
                            <TextArea
                              size={"large"}
                              placeholder="Enter..."
                              className="text-black"
                            />
                          </Form.Item>

                          <Select 
                            className="responiveSelect"
                            defaultValue={pair.status}
                            style={{
                              position: "absolute",
                              top: "-14px",
                              right: "0px",
                              fontSize: "24px",
                              cursor: "pointer",
                              width: 120,
                            }}
                            // onChange={(value) =>
                            //   handleStatusChange(pair.id, value)
                            // }
                          >
                            <Option value="completed">Completed</Option>
                            <Option value="progressing">Progressing</Option>
                            <Option value="struggling">Struggling</Option>
                            <Option value="not_started">Not Started</Option>
                          </Select>
                          {inputPairs.length > 1 && (
                            <div className="remove_row">
                              <p className="m-0">Removed Row</p>
                              <MinusCircleOutlined
                                onClick={() => removeInputPair(pair.id)}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                      <Button
                        type="dashed"
                        className="add_goal"
                        onClick={addInputPair}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Goal and Comment
                      </Button>
                    </div>
                    {/* : ""}  */}
                    <div className="mt-3 mb-1">
                      <Typography.Title level={5} className="m-0 fw-bold">
                        GOALS FOR NEXT MEETING
                      </Typography.Title>
                    </div>
                    <div className="">
                      {inputFields.map((field: any, index: number) => (
                        <>
                          <div style={{ position: "relative" }}>
                            <Form.Item
                              // key={field.name}
                              name={field.status1}
                              // initialValue={field.initialGoal1}
                            >
                              <Select
                                className="responiveSelect"
                                defaultValue={field.status1}
                                style={{
                                  position: "absolute",
                                  top: "45px",
                                  right: "0px",
                                  fontSize: "24px",
                                  cursor: "pointer",
                                  width: 120,
                                  zIndex: 9
                                }}
                                // onChange={(value) =>
                                //   handleStatusChange1(index, value)
                                // }
                              >
                                <Option value="high">High</Option>
                                <Option value="medium">Medium</Option>
                                <Option value="low">Low</Option>
                              </Select>
                            </Form.Item>
                            <Form.Item
                              // key={field.name}
                              name={field.name}
                              rules={[
                                {
                                  required: true,
                                  whitespace: true,
                                  message: "Please Fill Field",
                                },
                              ]}
                              label={field.label}
                              // initialValue={field.initialGoal1}
                            >
                              <TextArea size={"large"} placeholder="Enter..." />
                            </Form.Item>

                            {inputFields.length > 1 && (
                              <MinusCircleOutlined
                                style={{
                                  position: "absolute",
                                  bottom: "-30px",
                                  right: "0",
                                  fontSize: "24px",
                                  cursor: "pointer",
                                }}
                                onClick={() => removeInputField(index)}
                              />
                            )}
                          </div>
                        </>
                      ))}
                      <Button
                        type="dashed" className="mt-4"
                        onClick={addInputField}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Goal
                      </Button>
                    </div>
                    {/* Button  */}
                    <div className="d-flex justify-content-between mt-3">
                      {!pagetype ? (
                        <div className="">
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
                        <div className="d-flex gap-5 justify-content-center col-8 ">
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
                        <div className="d-flex gap-5 justify-content-center col-8">
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

export default Page3;
