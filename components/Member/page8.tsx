"use client";
import { Form, Input, Upload, Typography, Divider, Button } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useCallback, useState } from "react";
import MainLayout from "../../components/Layout/layout";
import api from "@/utils/api";
import type { UploadFile } from "antd";

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
    const [fileLists, setFileLists] = useState<Record<string, UploadFile<any>[]>>({});
    const [uploadedUrls, setUploadedUrls] = useState<Record<string, string[]>>({});
    const [previewImage, setPreviewImage] = useState<any>('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePreview = async (file: UploadFile<any>) => {
        // if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as File);
        // }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = async (info: any, id: string) => {
        const newFileLists = { ...fileLists, [id]: info.fileList };
        setFileLists(newFileLists);

        // if (info.file.status === 'done') {
        //     try {
        //         const formData = new FormData();
        //         formData.append('file', info.file.originFileObj);
        //         const response = await api.ImageUpload.add(formData);
        //         const newUploadedUrls = { ...uploadedUrls, [id]: [...(uploadedUrls[id] || []), response.data.url] };
        //         setUploadedUrls(newUploadedUrls);
        //     } catch (error) {
        //         console.error('Error uploading file:', error);
        //     }
        // }
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
// console.log(uploadedUrls,"chchhc");

    const submit = async (values: any) => {
        setLoading(true);
        try {
            console.log(inputPairs,"qwetyui");
            
            const photoComment = inputPairs.map(pair =>
                console.log(pair.goalName,"asdfasdfasdf")
            //      ({
            //     // goal: values[pair.goalName],
                
            //     comment: values[pair.commentName],
            //     files: values[pair.goalName],
            //     // files: uploadedUrls[pair.id.toString()] || [],
            // })
        );

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
                console.log(res,"yyyy");
                // router.push(`/admin/member`)
            }else{
                const check={
                    file: photoComment,
                }
                setLoading(true)
                let res2 = await api.ImageUpload.add(check as any)
                let res =await api.Auth.signUp(item)
                // console.log(res2,"qqqq");
                console.log(res,"wwww");
                
                // router.push(`/admin/member`)
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const [state, setState] = useState<any>("")
    const getDataById = async () => {
        // console.log(id);
        const item = {
          user_id: value
        }
        try {
          const res = await api.User.getById(item as any);
          console.log(res, "ressssss");
          setState(res?.data || null);
          form.setFieldsValue(res?.data)
        } catch (error: any) {
          alert(error.message);
        }
      };
      React.useEffect(() => {
        // if (id) {
        getDataById();
        // }
      }, []);
      const onPrevious=()=>{
        router.back()
      }
  return (
    <MainLayout>
    <Fragment>
        <section>
            <DynamicRow justify="center" gutter={[20, 20]}>
                <DynamicCol sm={22} md={24} lg={11} xl={10} xxl={9}>
                    <DynamicCard className='common-card'>
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
                                <Breadcrumb.Item ><Link href="/admin/member/add/page7" className='text-decoration-none'>2024 MEETING PREPARATION</Link></Breadcrumb.Item>
                            </Breadcrumb>
                        </div> */}
                        {/* Title  */}
                        <div className='mb-2 d-flex justify-content-between'>
                            <Title level={3} className='m-0 fw-bold'>PHOTO SECTION</Title>
                            <Button size={'large'} type="primary" className="text-white" disabled>8/8</Button>
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
                                                <Input
                                                    size="large"
                                                    placeholder="Enter..."
                                                    onKeyPress={(e: any) => {
                                                        if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                                                            e.preventDefault();
                                                        } else {
                                                            e.target.value = String(e.target.value).trim();
                                                        }
                                                    }}
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
                                <DynamicButton size={'large'} type="primary" className="login-form-button mt-4" loading={loading} onClick={onPrevious}>
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
