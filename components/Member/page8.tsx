"use client";
import {
  Form,
  Upload,
  Typography,
  Divider,
  Button,
  Popconfirm,
  Spin,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
// import ReactImageCompressor from "react-image-compressor";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useRef, useState } from "react";
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
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  const [form] = Form.useForm();
  const [inputPairs, setInputPairs] = useState([
    {
      id: Date.now(),
      goalName: "goalcomment_0",
      goalLabel: "Project 0",
      commentName: "comment0",
      commentLabel: "comment_0",
    },
  ]);
  const [fileLists, setFileLists] = useState<any>({});
  const [uploadedUrls, setUploadedUrls] = useState<Record<string, string[]>>(
    {}
  );
  const [responseData, setResponseData] = useState<any>("");
  const [screenLoader, setScreenLoader] = useState(false);
  const [checkToast, setCheckToast] = useState(true);
  const [previewImage, setPreviewImage] = useState<any>("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadButton, setLoadButton] = useState("");
  const [actionType, setActionType] = useState<"submit" | "save" | null>(null);
  const [state, setState] = useState<any>("");
  const [errorShown, setErrorShown] = useState(false);
  const images = JSON.stringify(fileLists);
  const getUserdata = useSelector((state: any) => state?.user?.userData);
  const cookies = parseCookies();
  const accessToken = cookies.COOKIES_USER_ACCESS_TOKEN;

  const handlePreview = async (file: UploadFile<any>) => {
    file.preview = await getBase64(file.originFileObj as File);

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const [showToast, setShowToast] = useState<any>(true);

  const handleFileChange = async (info: any, id: any, pair: any) => {
    // Check the status of the file
    if (info.file.status === 'removed') {
      // Handle file removal
      await handleDelete(info.file, pair);
  
      // Update file list state
      const newFileLists = { ...fileLists, [id]: info.fileList };
      setFileLists(newFileLists);
      return;
    }
  
    if (info.file.status === 'done' && info.file.originFileObj?.size >= 10 * 1024 * 1024) {
      toast.error("Please upload image less than 10 MB size.", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }
  
    // Handle file addition
    if (info.file.status === 'done' || info.file.status === 'uploading') {
      const newFileLists = { ...fileLists, [id]: info.fileList };
      setFileLists(newFileLists);
    }
  };
  

  // const handleChange = async (info: any, id: any) => {
  //   if (info?.file?.originFileObj?.size < 10 * 1024 * 1024) {
  //     const newFileLists = { ...fileLists, [id]: info.fileList };
  //     setFileLists(newFileLists);
  //   } else {
  //     toast.error("Please upload image less than 10 MB size.", {
  //       position: "top-center",
  //       autoClose: 1500,
  //     });
  //   }
  // };

  const handleCancel = () => {
    setShowToast(false);
  };

  const addInputPair = () => {
    const newId = Date.now();
    setInputPairs([
      ...inputPairs,
      {
        id: newId,
        goalName: `goal${newId}`,
        goalLabel: `Project comment_${inputPairs.length}`,
        commentName: `comment${newId}`,
        commentLabel: `comment_${inputPairs.length}`,
      },
    ]);
  };

  const removeInputPair = async (id: number, comment_key: any) => {
    setScreenLoader(true);
    try {
      let formData = new FormData();
      formData.append("project_key", comment_key);
      formData.append("comment_id", state?.photo_section?.commentId || "");

      const response = await axios.post(
        "https://frontend.goaideme.com/remove-project",
        formData,
        {
          headers: {
            Token: `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const formattedGoals: any = Object.keys(response?.data?.fileUrls).map(
          (key, index) => {
            return {
              id: index,
              goalName: `goal${key}`,
              goalLabel: `Project ${key}`,
              commentName: key,
              commentLabel: key,
              // initialGoal: key,
              initialComment: response?.data?.fileUrls[key]?.comment,
              images: response?.data?.fileUrls[key]?.images,
              // commentId: commentKey,
            };
          }
        );
        setInputPairs(formattedGoals);
        setScreenLoader(false);
        toast.success("Project successfully deleted", {
          position: "top-center",
          autoClose: 400,
        });
      } else {
        setScreenLoader(false);
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err: any) {
      setScreenLoader(false);
      toast.error("Failed to delete project", {
        position: "top-center",
        autoClose: 400,
      });
    }
  };

  const searchParams = useSearchParams();
  const entries = Array.from(searchParams.entries());
  const value = entries.length > 0 ? entries[0][0] : "";
  const type = entries.length > 1 ? entries[1][0] : "";
  const pagetype = entries.length > 2 ? entries[2][0] : "";
  async function convertUrlToBlob(url: any) {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  }

  // const convertToPng = async (
  //   file: File,
  //   targetSizeMB: number = 1
  // ): Promise<Blob> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       const img = new Image();
  //       img.onload = () => {
  //         let scale = 1; // Start with no scaling
  //         let canvas = document.createElement("canvas");
  //         let ctx = canvas.getContext("2d");
  //         if (!ctx) {
  //           reject(new Error("Failed to get canvas context"));
  //           return;
  //         }

  //         const reduceScale = () => {
  //           canvas.width = img.width * scale;
  //           canvas.height = img.height * scale;
  //           ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  //           canvas.toBlob((blob) => {
  //             if (blob && blob.size / 1024 / 1024 <= targetSizeMB) {
  //               resolve(blob);
  //             } else if (scale > 0.1) {
  //               // Reduce scale if needed
  //               scale -= 0.1;
  //               reduceScale();
  //             } else {
  //               reject(new Error("Failed to achieve target size"));
  //             }
  //           }, "image/png");
  //         };

  //         reduceScale();
  //       };
  //       img.src = e.target.result;
  //     };
  //     reader.onerror = (error) => reject(error);
  //     reader.readAsDataURL(file);
  //   });
  // };
  const submit = async (values: any) => {
    let responseData = null; // Default value to handle the return

    if (actionType === "submit") {
      setLoadButton("Submit");
      setLoading(true);

      const photoComment = inputPairs.map((pair) => ({
        comment: values[pair.commentName],
        files: values[pair.goalName],
      }));

      try {
        const formData: any = new FormData();

        if (state?.photo_section?.fileUrls?.length) {
          formData.append("id", state?.photo_section?.commentId);
          formData.append("user_id", value);
          formData.append("is_save", "false");
          for (const item of inputPairs) {
            formData.append(`${item?.commentLabel}`, values[item?.commentName]);

            for (const file of values[item.goalName]?.fileList || []) {
              if (file?.originFileObj) {
                // const compressedJpegFile = await convertToPng(
                //   file.originFileObj,
                //   1
                // );
                formData.append(
                  `${item?.commentLabel}_file`,
                  file?.originFileObj,
                  `${item?.commentLabel}_file.png`
                );
              }
            }
          }

          const response = await api.photo_section.update_file(formData);

          const messages: any = {
            200: "Updated Successfully",
            201: "Added Successfully",
          };

          if (messages[response?.status]) {
            toast.success(messages[response?.status], {
              position: "top-center",
              autoClose: 300,
            });
          }
          setLoadButton("");

          setResponseData(response?.data?.pdfReponseData);
          await sharePdf(response?.pdfReponseData);
          if (!pagetype) {
            router.replace(`/admin/user?${getUserdata?.user_id}`);
          } else {
            router.push("/admin/questionnaire?page8");
          }

          responseData = response?.pdfReponseData;
        } else {
          formData.append("id", value);
          formData.append("is_save", "false");
          for (const [index, item] of photoComment.entries()) {
            formData.append(`comment_${index}`, item?.comment);

            for (const [fileIndex, file] of (
              item?.files?.fileList || []
            ).entries()) {
              if (file?.originFileObj) {
                // const compressedJpegFile = await convertToPng(
                //   file.originFileObj,
                //   1
                // );
                formData.append(
                  `comment_${index}_file${fileIndex}`,
                  file?.originFileObj,
                  `comment_${index}_file${fileIndex}.png`
                );
              }
            }
          }

          const response = await api.photo_section.upload_file(formData);
          setLoading(false);

          const messages: any = {
            200: "Updated Successfully",
            201: "Added Successfully",
          };

          if (messages[response?.status]) {
            toast.success(messages[response?.status], {
              position: "top-center",
              autoClose: 300,
            });
          }
          setLoadButton("");
          setResponseData(response?.data?.pdfReponseData);

          if (response) {
            router.replace(`/admin/user?${getUserdata?.user_id}`);
          }

          responseData = response?.pdfReponseData;
        }
      } catch (error: any) {
        setLoadButton("");
        if (error?.status === 500) {
          destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: "/" });
          localStorage.removeItem("hasReloaded");
          toast.error("Session Expired Login Again");
          router.replace("/auth/signin");
        } else {
          toast.error("Something went wrong Please try again", {
            position: "top-center",
            autoClose: 300,
          });
        }
      } finally {
        if (pagetype) {
          setLoading(false);
        }
      }
    } else if (actionType === "save") {
      setLoadButton("Save");

      const photoComment = inputPairs.map((pair) => ({
        comment: values[pair.commentName],
        files: values[pair.goalName],
      }));

      try {
        const formData: any = new FormData();

        if (state?.photo_section?.fileUrls?.length) {
          formData.append("id", state?.photo_section?.commentId);
          formData.append("user_id", value);
          formData.append("is_save", "true");
          for (const item of inputPairs) {
            formData.append(`${item?.commentLabel}`, values[item?.commentName]);

            for (const file of values[item.goalName]?.fileList || []) {
              if (file?.originFileObj) {
                // const compressedJpegFile = await convertToPng(
                //   file.originFileObj,
                //   1
                // );
                formData.append(
                  `${item?.commentLabel}_file`,
                  file?.originFileObj,
                  `${item?.commentLabel}_file.png`
                );
              }
            }
          }

          const response = await api.photo_section.update_file(formData);
          setLoading(false);

          const messages: any = {
            200: "Updated Successfully",
            201: "Added Successfully",
          };

          if (messages[response?.status]) {
            toast.success(messages[response?.status], {
              position: "top-center",
              autoClose: 300,
            });
          }
          setLoadButton("");
          setResponseData(response?.data?.pdfReponseData);

          if (!pagetype) {
            router.replace(`/admin/user?${getUserdata?.user_id}`);
          } else {
            router.push("/admin/questionnaire?page8");
          }

          responseData = response?.data?.pdfReponseData;
        } else {
          formData.append("id", value);
          formData.append("is_save", "true");
          for (const [index, item] of photoComment.entries()) {
            formData.append(`comment_${index}`, item?.comment);

            for (const [fileIndex, file] of (
              item?.files?.fileList || []
            ).entries()) {
              if (file?.originFileObj) {
                // const compressedJpegFile = await convertToPng(
                //   file.originFileObj,
                //   1
                // );
                formData.append(
                  `comment_${index}_file${fileIndex}`,
                  file?.originFileObj,
                  `comment_${index}_file${fileIndex}.png`
                );
              }
            }
          }

          const response = await api.photo_section.upload_file(formData);

          const messages: any = {
            200: "Updated Successfully",
            201: "Added Successfully",
          };

          if (messages[response?.status]) {
            toast.success(messages[response?.status], {
              position: "top-center",
              autoClose: 300,
            });
          }
          setLoadButton("");
          setResponseData(response?.data?.pdfReponseData);

          if (response) {
            router.replace(`/admin/user?${getUserdata?.user_id}`);
          }

          responseData = response?.data?.pdfReponseData;
        }
      } catch (error: any) {
        setLoadButton("");
        if (error?.status === 500) {
          destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: "/" });
          localStorage.removeItem("hasReloaded");
          toast.error("Session Expired Login Again");
          router.replace("/auth/signin");
        } else {
          toast.error("Something went wrong Please try again", {
            position: "top-center",
            autoClose: 300,
          });
        }
      } finally {
        if (pagetype) {
          setLoading(false);
        }
      }
    }

    return responseData; // Ensure return value
  };

  const handleSubmitClick = () => {
    setActionType("submit");
    form.submit();
  };

  const handleSaveClick = () => {
    setActionType("save");
    form.submit();
  };

  const getDataById = async () => {
    const item = {
      user_id: value,
    };
    try {
      const res = await api.User.getById(item as any);

      setState(res?.data || null);
      if (res?.data?.status == 500) {
        destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: "/" });
        localStorage.removeItem("hasReloaded");
        toast.error("Session Expired Login Again");
        router.replace("/auth/signin");
      }
      const fetchedGoals = res?.data?.photo_section?.fileUrls || [];
      const commentKey = fetchedGoals[0]?.commentId || "";

      const formattedGoals: any = Object.keys(fetchedGoals[0] || {}).map(
        (key, index) => {
          return {
            id: index,
            goalName: `goal${key}`,
            goalLabel: `Project ${key}`,
            commentName: key,
            commentLabel: key,
            // initialGoal: key,
            initialComment: fetchedGoals[0][key]?.comment,
            images: fetchedGoals[0][key]?.images,
            commentId: commentKey,
          };
        }
      );

      setInputPairs(formattedGoals);

      const formValues: any = {};
      formattedGoals.forEach((goal: any) => {
        formValues[goal.goalName] = goal.initialGoal;
        formValues[goal.commentName] = goal.initialComment;
      });

      form.setFieldsValue(formValues);

      const fileListsData: any = {};
      formattedGoals.forEach((goal: any) => {
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
    router.replace(`/admin/member/add/additional_questionnaire?${value}&edit`);
  };

  const handleDelete = async (file: any, pair: any) => {
    const data = {
      imageUrl: file.url,
      commentId: state?.photo_section?.commentId,
      comment: pair.commentLabel || "",
    };
  
    try {
      const res = await api.photo_section.remove_photo(data);
     
  
      if (res) {
        toast.success(res?.message, {
          position: "top-center",
          autoClose: 300,
        });
      }
      // getDataById(); 
    } catch (error: any) {
      if (error?.response?.data?.status === 500) {
        toast.error("Something went wrong", {
          position: "top-center",
          autoClose: 300,
        });
      }
    }
  };
  

  // const handleDelete = async (file: any, pair: any, index: number) => {
  //   const data = {
  //     imageUrl: file.url,
  //     commentId: state?.photo_section?.commentId,
  //     comment: pair.commentLabel || "",
  //   };

  //   try {
  //     const res = await api.photo_section.remove_photo(data);
  //     if (res) {
  //       toast.success(res?.message, {
  //         position: "top-center",
  //         autoClose: 300,
  //       });
  //     }
  //     getDataById();
  //   } catch (error: any) {
  //     if (error?.response?.data?.status === 500) {
  //       toast.error("Something went wrong", {
  //         position: "top-center",
  //         autoClose: 300,
  //       });
  //     }
  //   }
  // };

  const generatePdf = async (data?: any) => {
    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, "");
    const blob = await pdf(<Pdf state={data} />).toBlob();
    const pdfUrl = URL.createObjectURL(blob);
    return { blob, pdfUrl, timestamp };
  };

  const sharePdf = async (responseData: any) => {
    const { pdfUrl, timestamp } = await generatePdf(responseData);
    const response = await fetch(pdfUrl);
    const blob = await response.blob();

    const file = new File([blob], `check.pdf`, { type: "application/pdf" });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", getUserdata?.user_id);
    const res = await fetch(
      "https://frontend.goaideme.com/send-completeform-mail-to-superadmin",
      {
        method: "POST",
        body: formData,
        headers: {
          Token: `${accessToken}`,
        },
      }
    );
  };

  const handleFetchAndFetchData = async (values: any) => {
    if (actionType === "submit") {
      let item = await submit(values);
      await sharePdf(item);
    } else if (actionType === "save") {
      let item = await submit(values);
    }
  };
  const hnandleBack = () => {
    router.back();
  };
  return (
    <>
      <Fragment>
        {checkToast && (
          <div className="Custom_tost">
            <div>
              <span
                style={{ color: "green", fontSize: "16px", marginRight: "8px" }}
              >
                <CheckOutlined />
              </span>
              <p style={{ margin: 0 }}>
                Please save the project once you uploaded files and comments,
                otherwise data would be lost
              </p>
            </div>
            <div className="Btns">
              <a onClick={() => setCheckToast(false)}>Cancel</a>
            </div>
          </div>
        )}
        <section className="club_member">
          <DynamicRow
            justify="center"
            gutter={[20, 20]}
            className="heightCenter"
          >
            <DynamicCol xs={24} sm={22} md={20} lg={16} xl={14} xxl={12}>
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
                    8/8
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
                  {/* <div className="mt-3 mb-1">
                    <Title level={5} className="m-0 fw-bold">
                      Please paste a dropbox link for each project in the boxes
                      indicated below, and write a brief summary of each project
                      in the comment section
                    </Title>
                  </div> */}
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
                      {inputPairs
                        .sort((a: any, b: any) => {
                          const numA = parseInt(
                            a?.commentName.split("_")[1],
                            10
                          );
                          const numB = parseInt(
                            b?.commentName.split("_")[1],
                            10
                          );
                          return numA - numB;
                        })
                        .map((pair: any, index: number) => (
                          <>
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
                                    handleFileChange(
                                      info,
                                      pair.id.toString(),
                                      pair
                                    )
                                  }
                                >
                                  {(fileLists[pair.id] || []).length >=
                                  10 ? null : (
                                    <PlusOutlined />
                                  )}
                                </Upload>

                                {/* <Upload
                                  listType="picture-card"
                                  fileList={fileLists[pair.id] || []}
                                  onPreview={handlePreview}
                                  onChange={(info) =>
                                    handleChange(info, pair.id.toString())
                                  }
                                  onRemove={(file) =>
                                    handleDelete(file, pair, index)
                                  }
                                >
                                  {(fileLists[pair.id] || []).length >=
                                  10 ? null : (
                                    <PlusOutlined />
                                  )}
                                </Upload> */}
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
                                <Popconfirm
                                  title="Delete the task"
                                  onConfirm={() =>
                                    removeInputPair(pair.id, pair.commentLabel)
                                  }
                                  description="Are you sure to delete this task?"
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <MinusCircleOutlined
                                    style={{
                                      position: "absolute",
                                      top: "0",
                                      right: "0",
                                      fontSize: "24px",
                                      cursor: "pointer",
                                    }}
                                  />
                                </Popconfirm>
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
                      {!pagetype ? (
                        <div className="col-2">
                          <Button
                            size={"large"}
                            type="primary"
                            className=" "
                            onClick={handleSaveClick}
                          >
                            {loadButton === "Save" ? <Spin /> : "Save"}
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
                            className="login-form-button "
                            onClick={handleSubmitClick}
                          >
                            {loadButton === "Submit" ? <Spin /> : "Submit"}
                            {/* {!pagetype ? "Next" : "Save"} */}
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
                          >
                            {loadButton === "Save" ? <Spin /> : "Save"}
                          </Button>
                          <Button
                            size={"large"}
                            type="primary"
                            onClick={handleSubmitClick}
                            className="login-form-button "
                          >
                            {loadButton === "Submit" ? <Spin /> : "Submit"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </Form>
                </div>
              </DynamicCard>
            </DynamicCol>
          </DynamicRow>
        </section>
      </Fragment>
    </>
  );
};

export default Page8;
