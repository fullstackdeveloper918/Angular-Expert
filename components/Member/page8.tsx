"use client";
import { Form, Upload, Typography, Divider, Button } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useState } from "react";
import MainLayout from "../../components/Layout/layout";
import api from "@/utils/api";
import type { UploadFile } from "antd";
import TextArea from "antd/es/input/TextArea";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import { destroyCookie, parseCookies } from "nookies";
import { pdf } from "@react-pdf/renderer";
import Pdf from "../common/Pdf";

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
  const [inputPairs, setInputPairs] = useState([
    {
      id: Date.now(),
      goalName: "goal1",
      goalLabel: "Project 1",
      commentName: "comment1",
      commentLabel: "Comment 1",
    },
  ]);
  const [fileLists, setFileLists] = useState<any>({});
  const [uploadedUrls, setUploadedUrls] = useState<Record<string, string[]>>(
    {}
  );
  const [responseData, setResponseData] = useState<any>("");
  const [previewImage, setPreviewImage] = useState<any>("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<any>("");
  const [errorShown, setErrorShown] = useState(false);
  const images = JSON.stringify(fileLists);
  const getUserdata = useSelector((state: any) => state?.user?.userData);
console.log(getUserdata,"getUserdata");

  const cookies = parseCookies();
  const accessToken = cookies.COOKIES_USER_ACCESS_TOKEN;

  const handlePreview = async (file: UploadFile<any>) => {
    file.preview = await getBase64(file.originFileObj as File);

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = async (info: any, id: any) => {
    const newFileLists = { ...fileLists, [id]: info.fileList };
    setFileLists(newFileLists);
  };

  const addInputPair = () => {
    const newId = Date.now();
    setInputPairs([
      ...inputPairs,
      {
        id: newId,
        goalName: `goal${newId}`,
        goalLabel: `Project ${inputPairs.length + 1}`,
        commentName: `comment${newId}`,
        commentLabel: `Comment ${inputPairs.length + 1}`,
      },
    ]);
  };

  const removeInputPair = (id: number) => {
    setInputPairs(inputPairs.filter((pair) => pair.id !== id));
    const newFileLists = { ...fileLists };
    delete newFileLists[id];
    setFileLists(newFileLists);
    const newUploadedUrls = { ...uploadedUrls };
    delete newUploadedUrls[id];
    setUploadedUrls(newUploadedUrls);
  };

  const searchParams = useSearchParams();
  const entries = Array.from(searchParams.entries());
  const value = entries.length > 0 ? entries[0][0] : "";
  const type = entries.length > 1 ? entries[1][0] : "";
  async function convertUrlToBlob(url: any) {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  }

  const submit = async (values: any) => {
    setLoading(true);
    
    try {
      setLoading(true);
      const formData: any = new FormData();

      try {
        let response;
        if (state?.photo_section?.fileUrls?.length) {
          formData.append("id", state?.photo_section?.commentId);
          formData.append("user_id", value);
          inputPairs.forEach((item: any, index) => {
            formData.append(`${item?.initialGoal}`, values[item?.commentName]);
            values[item.goalName]?.fileList?.forEach(
              (file: any, index: number) => {
                if (file?.originFileObj) {
                  formData.append(
                    `${item?.initialGoal}_file${index}`,
                    file.originFileObj
                  );
                }
              }
            );
          });
          response = await axios.post(
            "https://frontend.goaideme.com/update-photo-section",
            formData,
            {
              headers: {
                Token: `${accessToken}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
        } else {
          formData.append("id", value);
          inputPairs.forEach((item: any, index) => {
            formData.append(`comment_${index}`, item?.commentLabel);
            values[item.goalName]?.fileList?.forEach(
              (file: any, fileIndex: number) => {
                if (file?.originFileObj) {
                  formData.append(
                    `comment_${index}_file${fileIndex}`,
                    file.originFileObj
                  );
                }
              }
            );
          });
          response = await axios.post(
            "https://frontend.goaideme.com/uploadFile",
            formData,
            {
              headers: {
                Token: `${accessToken}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }

        const messages: any = {
          200: "Updated Successfully",
          201: "Added Successfully",
        };

        if (messages[response?.data?.status]) {
          toast.success(messages[response?.data?.status], {
            position: "top-center",
            autoClose: 300,
          });
        }

        setResponseData(response?.data?.pdfReponseData);
        console.log(response?.data?.pdfReponseData,"swws");
        
        // if (getUserdata?.is_admin == true) {
        //   router.replace("/admin/member");
        // } else {
          router.replace(`/admin/user?${getUserdata?.user_id}`);

        // }
        return response?.data?.pdfReponseData;
      } catch (error) {
        if (error) {
          toast.error("Something went wrong Please try again", {
            position: "top-center",
            autoClose: 300,
          });
        }
      }
    } catch (error: any) {
      if (error?.status == 400) {
        destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: "/" });
        localStorage.removeItem("hasReloaded");
        toast.error("Session Expired Login Again");
        router.replace("/auth/signin");
      }
    } finally {
      setLoading(false);
    }
  };

  const getDataById = async () => {
    const item = {
      user_id: value,
    };
    try {
      const res = await api.User.getById(item as any);

      setState(res?.data || null);
      if (res?.data?.status == 400) {
        destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: "/" });
        localStorage.removeItem("hasReloaded");
        toast.error("Session Expired Login Again");
        router.replace("/auth/signin");
      }
      const fetchedGoals = res?.data?.photo_section?.fileUrls || [];
      const commentKey = fetchedGoals[0]?.commentId || "";

      const hash = Object.keys(fetchedGoals[0] || {}).map((key, index) =>
        console.log(key, "check indx")
      );

      const formattedGoals = Object.keys(fetchedGoals[0] || {}).map(
        (key, index) => ({
          id: index,
          goalName: `goal${index}`,
          goalLabel: `Project #${index+1}`,
          commentName: `comments${index}`,
          commentLabel: "Comments:",
          initialGoal: key,
          initialComment: fetchedGoals[0][key]?.comment,
          images: fetchedGoals[0][key]?.images,
          commentId: commentKey,
        })
      );

      setInputPairs(formattedGoals);

      const formValues: any = {};
      formattedGoals.forEach((goal) => {
        formValues[goal.goalName] = goal.initialGoal;
        formValues[goal.commentName] = goal.initialComment;
      });

      form.setFieldsValue(formValues);

      const fileListsData: any = {};
      formattedGoals.forEach((goal) => {
        fileListsData[goal.id] = (goal.images || []).map(
          (url: any, index: number) => ({
            uid: index,
            name: `image${index + 1}`,
            status: "done",
            url,
          })
        );
      });

      setFileLists(fileListsData);
    } catch (error: any) {
      if (error?.status == 400) {
        destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: "/" });
        localStorage.removeItem("hasReloaded");
        toast.error("Session Expired Login Again");
        router.replace("/auth/signin");
      }
    }
  };
  React.useEffect(() => {
    if (type == "edit") {
      getDataById();
    }
  }, [type, value]);
  const onPrevious = () => {
    router.replace(`/admin/member/add/page7?${value}&edit`);
  };

  const handleDelete = async (file: any, pair: any, index: number) => {
    const data = {
      imageUrl: file.url,
      commentId: state?.photo_section?.commentId,
      comment: pair.initialGoal || "",
    };

    try {
      const res = await axios.post(
        // "https://app-uilsndszlq-uc.a.run.app/remove-photo-section",
        "https://frontend.goaideme.com/remove-photo-section",
        data,
        {
          headers: {
            Token: `${accessToken}`,
          },
        }
        // Handle response as needed
      );

      console.log("Response:", res?.data?.message);
      if (res) {
        toast.success(res?.data?.message, {
          position: "top-center",
          autoClose: 300,
        });
      }
    } catch (error: any) {
      console.log("Error removing photo:", error);
      if (error?.response?.data?.status === 500) {
        toast.error("Something went wrong", {
          position: "top-center",
          autoClose: 300,
        });
      }
    }
  };


  const generatePdf = async (data?: any) => {
    //

    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, "");
    const blob = await pdf(<Pdf state={data} />).toBlob();
    const pdfUrl = URL.createObjectURL(blob);
    return { blob, pdfUrl, timestamp };
  };

  // Function to handle PDF download
  // const downLoadPdf = async (res: any) => {

  //     const { blob, timestamp } = await generatePdf(res);
  //     saveAs(blob, `${capFirst(res?.company_name)}.pdf`);
  // };

  // Function to handle PDF sharing
  console.log(responseData, "PDFsharing");
  const sharePdf = async (responseData: any) => {
    //
    console.log(responseData, "item12345");

    const { pdfUrl, timestamp } = await generatePdf(responseData);
    const response = await fetch(pdfUrl);
    const blob = await response.blob();
    console.log(pdfUrl, "pdfUrl");
    console.log(response, "11111");
    console.log(blob, "blob");

    // Convert the blob to a file
    const file = new File([blob], `check.pdf`, { type: "application/pdf" });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", getUserdata?.user_id);

    const res = await fetch(
      "https://frontend.goaideme.com/send-completeform-mail-to-superadmin",
      {
        // const res = await fetch('https://app-uilsndszlq-uc.a.run.app/send-completeform-mail-to-superadmin', {

        method: "POST",
        body: formData,
        headers: {
          Token: `${accessToken}`,
          // 'Content-Type': 'application/json',
        },
      }
    );

    // const apiRes: any = await res.json()
    // navigator.clipboard.writeText(apiRes?.fileUrl)
    //     .then(() => {
    //         toast.success('Link copied to clipboard');
    //     })
    //     .catch(() => {
    //         toast.error('Failed to copy link to clipboard');
    //     });
  };
  const handleFetchAndFetchData = async (values: any) => {
    let item = await submit(values);
    console.log(item, "item check");

    if (item) {
      await sharePdf(item);
    }
  };
  return (
    <MainLayout>
      <Fragment>
        <section className="club_member">
          <DynamicRow
            justify="center"
            gutter={[20, 20]}
            className="heightCenter"
          >
            <DynamicCol sm={22} md={20} lg={16} xl={14} xxl={12}>
              <DynamicCard className="common-card">
                {/* Title  */}
                <div className="mb-2 d-flex justify-content-between">
                  <Title level={3} className="m-0 fw-bold">
                    PHOTO SECTION
                  </Title>
                  <Button
                    size={"large"}
                    type="primary"
                    className="text-white"
                    disabled
                  >
                    7/7
                  </Button>
                </div>

                {/* form  */}
                <div className="card-form-wrapper">
                  <div className="mt-3 mb-1">
                    <Title level={5} className="m-0 fw-bold">
                      Share photos of current projects or additional information
                      regarding comments in your update.
                    </Title>
                  </div>
                  <div className="mt-3 mb-1">
                    <Title level={5} className="m-0 fw-bold">
                      Please paste a dropbox link for each project in the boxes
                      indicated below, and write a brief summary of each project
                      in the comment section
                    </Title>
                  </div>
                  <Divider plain></Divider>
                  <Form
                    form={form}
                    name="add_staff"
                    className="add-staff-form"
                    scrollToFirstError
                    layout="vertical"
                    onFinish={handleFetchAndFetchData}
                  >
                    <div>
                      {inputPairs.map((pair: any, index: number) => (
                        <>
                          {console.log(pair, "pair check")}
                          {console.log(pair.commentName, "comment check")}

                          <div key={pair.id} style={{ position: "relative" }}>
                            <Form.Item
                              name={pair.goalName}
                              label={pair.goalLabel}
                            >
                              <Upload
                                listType="picture-card"
                                fileList={fileLists[pair.id] || []}
                                onPreview={handlePreview}
                                onChange={(info) =>
                                  handleChange(info, pair.id.toString())
                                }
                                multiple
                                onRemove={(file) =>
                                  handleDelete(file, pair, index)
                                }
                              >
                                {/* {(fileLists[pair.id] || []).length >= 8 ? null : (
                                <PlusOutlined />
                              )} */}
                                {(fileLists[pair.id] || []).length >=
                                  10 ? null : (
                                  <PlusOutlined />
                                )}
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
                              rules={[
                                {
                                  required: true,
                                  whitespace: true,
                                  message: "Please Fill Field",
                                },
                              ]}
                              label={pair.commentLabel}
                            >
                              <TextArea size="large" placeholder="Enter..." />
                            </Form.Item>
                            {inputPairs.length > 1 && (
                              <MinusCircleOutlined
                                style={{
                                  position: "absolute",
                                  top: "0",
                                  right: "0",
                                  fontSize: "24px",
                                  cursor: "pointer",
                                }}
                                onClick={() => removeInputPair(pair.id)}
                              />
                            )}
                          </div>
                        </>
                      ))}
                      <DynamicButton
                        type="dashed"
                        onClick={addInputPair}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Project and Comment
                      </DynamicButton>
                    </div>
                    <div className="d-flex mt-5">
                      <div className="col-2">
                        <Button
                          size={"large"}
                          type="primary"
                          className=" "
                          htmlType="submit"
                        >
                          Save
                        </Button>
                      </div>
                      <div className=" col-8 d-flex gap-5 justify-content-center">
                        <Button
                          size={"large"}
                          type="primary"
                          className=" "
                          onClick={onPrevious}
                        >
                          Previous
                        </Button>
                        <Button
                          size={"large"}
                          type="primary"
                          htmlType="submit"
                          className="login-form-button "
                          loading={loading}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                    {/* <div className="d-flex gap-3 justify-content-center">
                                <DynamicButton size={'large'} type="primary" className="login-form-button mt-4" onClick={onPrevious}>
                                    Previous
                                </DynamicButton>
                                <DynamicButton size="large" type="primary" htmlType="submit" className="login-form-button  mt-4" loading={loading}>
                                    Submit
                                </DynamicButton>
                                </div> */}
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
