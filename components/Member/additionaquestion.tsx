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
const AdditionalQuestion = () => {

    const router = useRouter()
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<any>(false)
    const [state, setState] = useState<any>("")
    const [question, setQuestion] = useState<any>([])


    const searchParams = useSearchParams();
    const entries = Array.from(searchParams.entries());
    const value = entries.length > 0 ? entries[0][0] : '';
    const type = entries.length > 1 ? entries[1][0] : '';
    const questionnaire = entries.length > 2 ? entries[2][0] : '';
    const pagetype = entries.length > 2 ? entries[2][0] : '';
  
    const submit = async (values: any) => {
       

        let items = {
            additional_question: {
                userId: value,
                questions: question.map((q: any) => ({
                    question_id: q.id,
                    question: q.question,
                    answer: values[`question_${q.id}`] || ""
                }))
            }

        }
        try {
            if (type == "edit") {
                let items = {
                    additional_question: {
                        userId: value,
                        questions: question.map((q: any) => ({
                            question_id: q.id,
                            question: q.question,
                            answer: values[`question_${q.id}`] || ""
                        }))
                    }
                } as any
                setLoading(true)

                let res = await api.User.edit(items)
                toast.success(res?.message)
                // if (!pagetype) {
                //     router.push(`/admin/member/add/page8?${res?.userId}&edit&questionnair`)
                // }else{
                //     router?.back()
                // }
                 // }
                 setTimeout(() => {
                    if (!pagetype) {
                        router.push(`/admin/member/add/page8?${res?.userId}&edit`)
                    } else {
                        router.push("/admin/questionnaire?additionalPage")
                    }
                  }, 1000);
            } else {

                setLoading(true)
            let res = await api.Auth.signUp(items)
            if (res?.status == 500) {
                toast.error("Session Expired Login Again")
                router.replace("/auth/signin")
            }
            if (!pagetype) {
                router.push(`/admin/member/add/page8?${res?.userId}&edit`)
            }else{
                router?.back()
            }
            }
        } catch (error: any) {
            if(!pagetype){
                setLoading(false)
            }
            if (error?.status == 400) {
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                localStorage.removeItem('hasReloaded');
                toast.error("Session Expired Login Again")
                router.replace("/auth/signin")
            }

        } finally {
            if(pagetype){
                setLoading(false)
            }
        }
    }
    const getQuestion = async () => {
        try {
            const res = await api.User.getQuestion()
            setQuestion(res)
         
            if (res?.data?.status == 400 || res?.data?.message == "Firebase ID token has expired. Get a fresh ID token from your client app and try again (auth/id-token-expired). See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token.") {
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                localStorage.removeItem('hasReloaded');
                toast.error("Session Expired Login Again")
                router.replace("/auth/signin")
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        getQuestion()
    }, [])
    const getDataById = async () => {
        const item = {
            user_id: value
        }
        try {
            const res = await api.User.getById(item as any);
            setState(res?.data || null);
            if (res?.data?.status == 400) {
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                localStorage.removeItem('hasReloaded');
                toast.error("Session Expired Login Again")
                router.replace("/auth/signin")
            }
        
            const questionsAnswers = res?.data || [];
         

            // Prepare an object to set form values
            const formValues = res?.data?.questions.reduce((acc: any, question: any) => {
                acc[`question_${question.question_id}`] = question.answer;
                return acc;
               

            }, {});

            form.setFieldsValue(formValues);
         
            // form.setFieldsValue(res?.data)
        } catch (error: any) {
            if (error == 400) {
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                localStorage.removeItem('hasReloaded');
                // }
                toast.error("Session Expired Login Again")
                router.replace("/auth/signin")
            }
        }
    };
    useEffect(() => {
        if (type == "edit") {
            getDataById();
        }
    }, [type, form]);
    const onPrevious = () => {
        router.replace(`/admin/member/add/page7?${value}&edit`)
    }
    const hnandleBack= ()=>{
        router.back()
      }
    return (
        <MainLayout>
            <Fragment>
                <section className="club_member">
                    <Row justify="center" gutter={[20, 20]} className='heightCenter'>
                        <Col xs={24} sm={22} md={20} lg={16} xl={14} xxl={12}>
                            <Card className='common-card'>
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
                                <div className='mb-2 d-flex justify-content-between'>
                                    <Typography.Title level={3} className='m-0 fw-bold'>Additional Questionnaire</Typography.Title>
                                    {/* <Button size={'large'} type="primary" className="text-white" disabled>7/8</Button> */}
                                    {!pagetype &&
                                        <Button
                                            size={"large"}
                                            type="primary"
                                            className="text-white"
                                            disabled
                                        >
                                            7/8
                                        </Button>
                                    }
                                </div>
                                {/* form  */}
                                <div className='card-form-wrapper'>
                                    <Form form={form} name="add_staff" className="add-staff-form" scrollToFirstError layout='vertical' onFinish={submit}>



                                        {/* First Name  */}

                                        {question.map((question: any) => (
                                            <Form.Item
                                                key={question.id}
                                                name={`question_${question.id}`}
                                                rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]}
                                                label={question.question}
                                            >
                                                <TextArea size="large" placeholder="Enter..." />
                                            </Form.Item>
                                        ))}





                                        {/* Button  */}
                                        {!pagetype ?
                                                <div className="col-2">

                                                    <Button size={'large'} type="primary" className=" " htmlType="submit">
                                                        Save
                                                    </Button>
                                                </div> : ""}
                                                {!pagetype?
                                            <div className=" col-8 d-flex gap-5 justify-content-center">
                                                {!pagetype ?
                                                    <Button size={'large'} type="primary" className=" " onClick={onPrevious}>
                                                        Previous
                                                    </Button> : ""}
                                                <Button size={'large'} type="primary" htmlType="submit" className="login-form-button " loading={loading}>
                                                    {!pagetype ? "Next" : "Save"}
                                                </Button>
                                            </div>
                                            :
                                            <div className=" col-8 d-flex gap-5 justify-content-center">
                                                    <Button size={'large'} type="primary" className=" " onClick={hnandleBack}>
                                                        Back
                                                    </Button>

                                                    <Button size={'large'} type="primary" htmlType="submit" className="login-form-button " loading={loading}>
                                                        Save
                                                    </Button>
                                                </div>}
                                    </Form>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                </section>
            </Fragment >
        </MainLayout>
    );
};

export default AdditionalQuestion;
