"use client";
import { Form, Input, Upload, Typography, Divider, Button } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useCallback, useState } from "react";
import MainLayout from "../../components/Layout/layout";
import api from "@/utils/api";
import type { UploadFile } from "antd";
import TextArea from "antd/es/input/TextArea";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import { parseCookies } from "nookies";

const { Title } = Typography;

const {
  Row: DynamicRow,
  Col: DynamicCol,
  Card: DynamicCard,
  Button: DynamicButton,
} = {
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
};

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Page8 = () => {
  const router = useRouter();
    const [form] = Form.useForm();
    const [inputPairs, setInputPairs] = useState([{ id: Date.now(), goalName: 'goal1', goalLabel: 'Project 1', commentName: 'comment1', commentLabel: 'Comment 1' }]);
    const [fileLists, setFileLists] = useState<any>({});
    const [uploadedUrls, setUploadedUrls] = useState<Record<string, string[]>>({});
    const [previewImage, setPreviewImage] = useState<any>('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [loading, setLoading] = useState(false);

const images=JSON.stringify(fileLists)
const getUserdata = useSelector((state: any) => state?.user?.userData);
const cookies = parseCookies();
const accessToken = cookies.COOKIES_USER_ACCESS_TOKEN;
    const handlePreview = async (file: UploadFile<any>) => {
        // if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as File);
            
            
        // }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = async (info:any, id:any) => {
      const newFileLists = { ...fileLists, [id]: info.fileList };
      console.log(newFileLists, "newFileLists");
      setFileLists(newFileLists);
    };

    const addInputPair = () => {
        const newId = Date.now();
        setInputPairs([
            ...inputPairs,
            { id: newId, goalName: `goal${newId}`, goalLabel: `Project ${inputPairs.length + 1}`, commentName: `comment${newId}`, commentLabel: `Comment ${inputPairs.length + 1}` }
        ]);
    };

    const removeInputPair = (id: number) => {
        setInputPairs(inputPairs.filter(pair => pair.id !== id));
        const newFileLists = { ...fileLists };
        delete newFileLists[id];
        setFileLists(newFileLists);
        const newUploadedUrls = { ...uploadedUrls };
        delete newUploadedUrls[id];
        setUploadedUrls(newUploadedUrls);
    };

    const searchParams = useSearchParams();
    const entries = Array.from(searchParams.entries());
    const value = entries.length > 0 ? entries[0][0] : '';
    const type = entries.length > 1 ? entries[1][0] : '';
    // const id = "commonID";
    const submit = async (values: any) => {
        setLoading(true);
        
        try {     
          const photoComment = inputPairs.map((pair) => ({
            comment: values[pair.commentName],
            files: values[pair.goalName],
          }));

        // return
            const item = {
                photo_section: {
                    userId: value,
                    photo_comment: photoComment,
                    is_draft: "completed"
                }
            };

            if (type == "edit") {
                let items = {
                    photo_section: {
                        userId: value,
                        photo_comment: photoComment,
                        is_draft: "completed"
                    }
            } as any
          
            setLoading(true)
            let res = await api.User.edit(items)
            
                // router.push(`/admin/member`)
            }
            else {
              setLoading(true);
              const payload =
                photoComment &&
                photoComment.map((item, index) => ({
                  comment: item?.comment,
                  files: item?.files?.fileList.map(
                    (file: any) => file?.originFileObj
                  ),
                }));
              const formData = new FormData();
              formData.append("id", value);
              payload.forEach((entry: any, entryIndex: number) => {
                // Append other data if needed
                formData.append(`comment_${entryIndex}`, entry?.comment);
                // Append files
                entry?.files?.forEach((file: any, fileIndex: number) => {
                  formData.append(`comment_${entryIndex}_file${fileIndex}`, file);
                });
              });
              try {
                const response = await axios.post(
                  "https://frontend.goaideme.com/uploadFile",
                  formData,
                  {
                    headers: {
                      Token: `${accessToken}`,
                      "Content-Type": "multipart/form-data",
                    },
                  }
                );
                if (response) {
                  toast.success("Added Successsfully", {
                    position: "top-center",
                    autoClose: 300,
                  });
                }
              } catch (error) {
                if (error) {
                  toast.error("Something went wrong please try again", {
                    position: "top-center",
                    autoClose: 300,
                  });
                }
              }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const [state, setState] = useState<any>("")
    const getDataById = async () => {
        
        const item = {
          user_id: value
        }
        try {
          const res = await api.User.getById(item as any);
         
          setState(res?.data || null);
          if (res?.data?.status == 400) {
            toast.error("Session Expired Login Again")
            router.replace("/auth/signin")
          }
          form.setFieldsValue(res?.data)
        } catch (error: any) {
          alert(error.message);
        }
      };
      React.useEffect(() => {
        if (type =="edit") {
        getDataById();
        }
      }, [type, value]);
      const onPrevious=()=>{
        router.replace(`/admin/member/add/page7?${value}&edit`)
      }
  return (
    <MainLayout>
    <Fragment>
   
    <section className="club_member">     
            <DynamicRow justify="center" gutter={[20, 20]} className='heightCenter'>
                <DynamicCol sm={22} md={20} lg={16} xl={14} xxl={12}>
                    <DynamicCard className='common-card'>
                        {/* Title  */}
                        <div className='mb-2 d-flex justify-content-between'>
                            <Title level={3} className='m-0 fw-bold'>PHOTO SECTION</Title>
                            <Button size={'large'} type="primary" className="text-white" disabled>7/7</Button>
                        </div>

                        {/* form  */}
                        <div className='card-form-wrapper'>
                            <div className='mt-3 mb-1'>
                                <Title level={5} className='m-0 fw-bold'>Share photos of current projects or additional information regarding comments in your update.</Title>
                            </div>
                            <div className='mt-3 mb-1'>
                                <Title level={5} className='m-0 fw-bold'>Please paste a dropbox link for each project in the boxes indicated below, and write a brief summary of each project in the comment section</Title>
                            </div>
                            <Divider plain></Divider>
                            <Form form={form} name="add_staff" className="add-staff-form" scrollToFirstError layout='vertical' onFinish={submit}>
                                <div>
                                    {inputPairs.map((pair) => (
                                        <div key={pair.id} style={{ position: 'relative' }}>
                                            <Form.Item
                                                name={pair.goalName}
                                                label={pair.goalLabel}
                                            >
                                                <Upload
                                                    listType="picture-card"
                                                    fileList={fileLists[pair.id] || []}
                                                    onPreview={handlePreview}
                                                    onChange={(info) => handleChange(info, pair.id.toString())}
                                                >
                                                    {(fileLists[pair.id] || []).length >= 8 ? null : <PlusOutlined />}
                                                </Upload>
                                                {/* {previewImage && (
                      <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                          visible: previewOpen,
                          onVisibleChange: (visible) => setPreviewOpen(visible),
                          afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                      />
                    )} */}
                                            </Form.Item>
                                            <Form.Item
                                                name={pair.commentName}
                                                rules={[{ required: true, whitespace: true, message: 'Please Fill Field' }]}
                                                label={pair.commentLabel}
                                            >
                                                <TextArea
                                                    size="large"
                                                    placeholder="Enter..."
                                                   
                                                />
                                            </Form.Item>
                                            {inputPairs.length > 1 && (
                                                <MinusCircleOutlined
                                                    style={{ position: 'absolute', top: '0', right: '0', fontSize: '24px', cursor: 'pointer' }}
                                                    onClick={() => removeInputPair(pair.id)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                    <DynamicButton type="dashed" onClick={addInputPair} block icon={<PlusOutlined />}>
                                        Add Project and Comment
                                    </DynamicButton>
                                </div>
                               
                                <div className="d-flex gap-3 justify-content-center">
                                    {/* <Link href={router.back}> */}
                                <DynamicButton size={'large'} type="primary" className="login-form-button mt-4" onClick={onPrevious}>
                                    Previous
                                </DynamicButton>
                                    {/* </Link> */}
                                <DynamicButton size="large" type="primary" htmlType="submit" className="login-form-button  mt-4" loading={loading}>
                                    Submit
                                </DynamicButton>
                                </div>
                            </Form>
                        </div>
                    </DynamicCard>
                </DynamicCol>
            </DynamicRow>
        </section>
    </Fragment>
</MainLayout>
  );
};

export default Page8;
