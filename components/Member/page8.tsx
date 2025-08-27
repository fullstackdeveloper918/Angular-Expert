"use client";
import {
  Form,
  Upload,
  Typography,
  Divider,
  Button,
  Popconfirm,
  Spin,
  Input,
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
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import { destroyCookie, parseCookies } from "nookies";
import { pdf } from "@react-pdf/renderer";
import Pdf from "../common/Pdf";
import Compressor from "compressorjs";
import { capFirst } from "@/utils/validation";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const { Title } = Typography;

type InputPair = {
  id: string | number;
  goalName: string;
  goalLabel: string;
  projectName: string;
  projectLabel: string;
  commentName: string;
  commentLabel: string;
  initialComment?: string;
  initialProject?: string;
  images?: string[];
  commentId?: string;
};

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
  const [inputPairs, setInputPairs] = useState<InputPair[]>([
    {
      id: Date.now(),
      goalName: "goalcomment_0",
      goalLabel: "Project 0",
      projectName: "project0",
      projectLabel: "project_0",
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
  const [companyNameData, setCompanyNameData] = useState<any>("");

  const fetchCompanyData = async () => {
    try {
      const res = await fetch("https://cybersify.tech/sellmacdev/company.php");
      const data = await res.json();

      const objectContent = Object.entries(data);

      console.log(objectContent, "here to se companies");
      setCompanyNameData(objectContent);

      // setFilteredData(allNames);
    } catch (err) {
      console.log("Failed to fetch companies", err);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  function getDisplayNameByKey(key: string | undefined): string {
    if (!key) return "N/A";

    const keyLower = key.toLowerCase();

    const found = companyNameData.find(
      ([k, _]: [string, string]) => k.toLowerCase() === keyLower
    );

    return found ? found[1] : "N/A";
  }

  const handlePreview = async (file: UploadFile<any>) => {
    file.preview = await getBase64(file.originFileObj as File);

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const [showToast, setShowToast] = useState<any>(true);
  const convertAndCompressToPNG = (file: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      // Convert image to PNG format
      convertToPNG(file)
        .then((pngFile) => {
          new Compressor(pngFile, {
            quality: 0.6, // Adjust quality as needed
            success(result) {
              resolve(result);
            },
            error(err) {
              reject(err);
            },
          });
        })
        .catch(reject);
    });
  };
  const convertToPNG = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(
                new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".png", {
                  type: "image/png",
                })
              );
            } else {
              reject(new Error("Blob conversion failed"));
            }
          }, "image/png");
        };
        img.onerror = reject;
        img.src = event.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };


  const handleFileChange = async (info: any, id: any, pair: any) => {
  let newFileList = [...info.fileList];

  // Remove files that are too large or errored
  newFileList = newFileList.filter(file => {
    if (file.size >= 10 * 1024 * 1024) {
      toast.error("Please upload an image smaller than 10 MB.", {
        position: "top-center",
        autoClose: 1500,
      });
      return false; // remove from list
    }
    if (file.status === "error") {
      return false; // remove failed files
    }
    return true;
  });

  // Handle removed file
  if (info.file.status === "removed") {
    await handleDelete(info.file, pair);
  }

  // Convert & compress PNG for successfully uploaded files
  for (let i = 0; i < newFileList.length; i++) {
    const file = newFileList[i];
    if (file.status === "done" && file.originFileObj) {
      try {
        const compressedPngFile = await convertAndCompressToPNG(file.originFileObj);
        newFileList[i] = {
          ...file,
          originFileObj: compressedPngFile,
          url: URL.createObjectURL(compressedPngFile),
        };
      } catch (error) {
        toast.error("Error converting and compressing the file to PNG.", {
          position: "top-center",
          autoClose: 1500,
        });
        // remove file if conversion fails
        newFileList.splice(i, 1);
        i--;
      }
    }
  }

  // Update state
  setFileLists({ ...fileLists, [id]: newFileList });
};

  // Function to convert image file to PNG format
  // const convertToPNG = (file: File): Promise<File> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       const img = new Image();
  //       img.onload = () => {
  //         const canvas = document.createElement('canvas');
  //         canvas.width = img.width;
  //         canvas.height = img.height;
  //         const ctx = canvas.getContext('2d');
  //         ctx?.drawImage(img, 0, 0);

  //         canvas.toBlob((blob) => {
  //           if (blob) {
  //             resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + '.png', { type: 'image/png' }));
  //           } else {
  //             reject(new Error('Blob conversion failed'));
  //           }
  //         }, 'image/png');
  //       };
  //       img.onerror = reject;
  //       img.src = event.target?.result as string;
  //     };
  //     reader.onerror = reject;
  //     reader.readAsDataURL(file);
  //   });
  // };

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
  // Get the last item in the inputPairs array
  const lastPair = inputPairs[inputPairs.length - 1];
  // Determine the next number for labels
  let nextNumber = 0;
  if (lastPair) {
    // Extract number from last commentLabel (assuming format 'comment_X')
    const matchComment = lastPair.commentLabel.match(/_(\d+)$/);
    const matchProject = lastPair.projectLabel.match(/_(\d+)$/);
    const lastNumberComment = matchComment ? parseInt(matchComment[1]) : 0;
    const lastNumberProject = matchProject ? parseInt(matchProject[1]) : 0;
    nextNumber = Math.max(lastNumberComment, lastNumberProject) + 1;
  }

  setInputPairs([
    ...inputPairs,
    {
      id: newId,
      goalName: `goal${newId}`,
      goalLabel: `Project comment_${nextNumber}`,
      commentName: `comment${newId}`,
      commentLabel: `comment_${nextNumber}`,
      projectName: `project${newId}`,
      projectLabel: `project_${nextNumber}`,
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
        console.log(response, "getting response check");
        setInputPairs(formattedGoals);
        setScreenLoader(false);
        getDataById()
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

  console.log(inputPairs,"inputPairs see")
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
        projectName: values[pair.projectName],
      }));

      try {
        const formData: any = new FormData();

        if (state?.photo_section?.fileUrls?.length) {
          formData.append("id", state?.photo_section?.commentId);
          formData.append("user_id", value);
          formData.append("meeting_id", getUserdata.meetings.NextMeeting.id);
          formData.append("is_save", "false");
          for (const item of inputPairs) {
            console.log(item?.commentLabel, values[item?.commentName])
            formData.append(`${item?.commentLabel}`, values[item?.commentName]);
            formData.append(`${item?.projectLabel}`, values[item?.projectName]);

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
          console.log(response, "sjdkahdgasd");

          const messages: any = {
            200: "Member update completed on the dasboard",
            // 200: "Updated Successfully",
            201: "Added Successfully",
          };

          if (messages[response?.status]) {
            toast.success(messages[response?.status], {
              position: "top-center",
              autoClose: 300,
            });
          }
          setLoadButton("");
          console.log(response?.pdfReponseData, "qwertyuiop");

          setResponseData(response?.pdfReponseData);
          await sharePdf(response?.pdfReponseData);
          if (!pagetype) {
            router.replace(`/admin/user?${getUserdata?.user_id}`);
          } else {
            router.push("/admin/dashboard");
            // router.push("/admin/questionnaire?page8");
          }

          responseData = response?.pdfReponseData;
        } else {
          formData.append("id", value);
          formData.append("is_save", "false");
          formData.append("user_id", value);
          formData.append("meeting_id", getUserdata.meetings.NextMeeting.id);
          for (const [index, item] of photoComment.entries()) {
            formData.append(`comment_${index}`, item?.comment);
            formData.append(`project_${index}`, item?.projectName);
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
            200: "Member update completed on the dasboard",
            // 200: "Updated Successfully",
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
            router.push("/admin/dashboard");
            // router.replace(`/admin/user?${getUserdata?.user_id}`);
          }

          responseData = response?.pdfReponseData;
        }
      } catch (error: any) {
        setLoadButton("");
        // if (error?.status === 500) {
        //   destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: "/" });
        //   localStorage.removeItem("hasReloaded");
        //   toast.error("Session Expired Login Again");
        //   router.replace("/auth/signin");
        // } else {
        //   toast.error("Something went wrong Please try again", {
        //     position: "top-center",
        //     autoClose: 300,
        //   });
        // }
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
        projectName: values[pair.projectName],
      }));

      try {
        const formData: any = new FormData();
        console.log(
          state?.photo_section?.fileUrls?.length,
          "length kitni hais"
        );

        if (state?.photo_section?.fileUrls?.length) {
          formData.append("id", state?.photo_section?.commentId);
          formData.append("user_id", value);
          formData.append("meeting_id", getUserdata.meetings.NextMeeting.id);
          formData.append("is_save", "true");
          for (const item of inputPairs) {
            console.log(item, "item ki hai");
            formData.append(`${item?.commentLabel}`, values[item?.commentName]);
            formData.append(`${item?.projectLabel}`, values[item?.projectName]);
            //  formData.append(`project_${item}`, values[item?.goalName]);

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
          console.log(response, "oerutouer");

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

          // if (!pagetype) {
          //   router.replace(`/admin/user?${getUserdata?.user_id}`);
          // } else {
          //   router.push("/admin/questionnaire?page8");
          // }

          responseData = response?.data?.pdfReponseData;
        } else {
          formData.append("id", value);
          formData.append("is_save", "true");
          formData.append("user_id", value);
          formData.append("meeting_id", getUserdata.meetings.NextMeeting.id);
          for (const [index, item] of photoComment.entries()) {
            formData.append(`comment_${index}`, item?.comment);
            console.log(item, "asdasdasdasd");
            formData.append(`project_${index}`, item?.projectName);

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
            // router.replace(`/admin/user?${getUserdata?.user_id}`);
          }

          responseData = response?.data?.pdfReponseData;
        }
      } catch (error: any) {
        setLoadButton("");
        toast.error("Something went wrong Please try again", {
          position: "top-center",
          autoClose: 300,
        });
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
      meeting_id: getUserdata.meetings.NextMeeting.id,
    };
    try {
      const res = await api.User.getById(item as any);

      setState(res?.data || null);
      // if (res?.data?.status == 500) {
      //   destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: "/" });
      //   localStorage.removeItem("hasReloaded");
      //   toast.error("Session Expired Login Again");
      //   router.replace("/auth/signin");
      // }
      const fetchedGoals = res?.data?.photo_section?.fileUrls || [];
      const commentKey = fetchedGoals[0]?.commentId || "";
      console.log(fetchedGoals, "fetchedGoals");

      const formattedGoals = (fetchedGoals as any[]).flatMap(
        (goalObj: any, goalIndex: number) =>
          Object.keys(goalObj || {}).map((key, index) => {
            return {
              id: `${goalIndex}-${index}`,
              goalName: `goal${key}`,
              goalLabel: `Project ${key}`,
              commentName: `${key}`,
              commentLabel: `${key}`,
              projectName: `project_${key}`,
              projectLabel: `project_${key}`,
              initialComment: goalObj[key]?.comment,
              initialProject: goalObj[key]?.project,
              images: goalObj[key]?.images,
              commentId: goalObj.commentId || "",
            };
          })
      );

      setInputPairs(formattedGoals);
      console.log(formattedGoals, "formattedGoals");

      const formValues: any = {};
      formattedGoals.forEach((goal: any) => {
        console.log(goal, "goal");

        formValues[goal.goalName] = goal.initialGoal;
        formValues[goal.commentName] = goal.initialComment;
        formValues[goal.projectName] = goal.initialProject;
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
      // if (error?.status == 400) {
      //   destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: "/" });
      //   localStorage.removeItem("hasReloaded");
      //   toast.error("Session Expired Login Again");
      //   router.replace("/auth/signin");
      // }
    }
  };

  React.useEffect(() => {
    // if (type == "edit") {
    getDataById();
    // }
  }, [type, value]);
  const onPrevious = () => {
    router.replace(`/admin/member/add/page7?${value}&edit`);
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

  const generatePdf = async (
    data?: any
  ): Promise<{ blob: Blob; pdfUrl: string; timestamp: string } | undefined> => {
    console.log(data, "asdasdas");
    const companyName = getDisplayNameByKey(data?.company_name);

    // If data is missing or invalid, return undefined
    if (!data) {
      console.error("Data is missing or invalid");
      return undefined;
    }

    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, "");

    try {
      // Generate the PDF
      const blob = await pdf(
        <Pdf state={data} companyName={companyName} />
      ).toBlob();
      const pdfUrl = URL.createObjectURL(blob);

      // Return the blob, pdfUrl, and timestamp
      return { blob, pdfUrl, timestamp };
    } catch (error) {
      console.error("Error generating PDF:", error);
      return undefined;
    }
  };

  const sharePdf = async (responseData: any) => {
    console.log(responseData, "responseData");

    const companyName = getDisplayNameByKey(responseData?.company_name);

    // Destructure the result from generatePdf, handle the undefined case
    const result = await generatePdf(responseData);

    if (!result) {
      console.error("PDF generation failed");
      return;
    }

    const { pdfUrl, timestamp } = result; // Safely destructure only if result is valid

    const response = await fetch(pdfUrl);
    const blob = await response.blob();

    const file = new File(
      [blob],
      `${capFirst(responseData?.company_name)}.pdf`,
      { type: "application/pdf" }
    );

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", getUserdata?.user_id);
    formData.append("meeting_id", getUserdata.meetings.NextMeeting.id);
    formData.append("company_name", companyName);

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
  console.log(inputPairs, "inputPairsinputPairs");

  const storage = getStorage();
  const fileRef = ref(storage, "eb35ef73-790e-4686-b457-1b0c8efa53d4.png");

  getDownloadURL(fileRef)
    .then((url) => {
      console.log("Download URL:", url);
    }).catch((err) => {
      console.error("Download URL: error", err);
    });

  return (
    <>
      <Fragment>
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
                    9/9
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
                            {console.log(pair, "pairpairpair")}
                            <div key={pair.id} style={{ position: "relative" }}>
                              <Form.Item
                                name={pair.projectName}
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message: "Please Fill Field",
                                  },
                                ]}
                                label={`Project Name`}

                                // label={`Comment ${index+1}`}
                                // label={pair.commentLabel}
                              >
                                <Input size="large" placeholder="Enter..." />
                              </Form.Item>
                              <Form.Item
                                name={pair.goalName}
                                label={`Images`}
                                // label={`Project ${index+1}`}
                                // label={pair.goalLabel}
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
                                label={`Comment`}
                                // label={`Comment ${index+1}`}
                                // label={pair.commentLabel}
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
