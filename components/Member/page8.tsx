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
import FileUpload from "../common/FileUpload";
import { storage, firestore, ref, uploadBytes, getDownloadURL, collection, addDoc, serverTimestamp } from '../../utils/firebase'; 
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
         projectName:"project0",
      projectLabel:"project_0",
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
  const [imageUrl, setImageUrl] = useState<any>("");
  const [errorShown, setErrorShown] = useState(false);
  const images = JSON.stringify(fileLists);
  const getUserdata = useSelector((state: any) => state?.user?.userData);
  const cookies = parseCookies();
  const accessToken = cookies.COOKIES_USER_ACCESS_TOKEN;

  const [uploadedImageUrls, setUploadedImageUrls] = useState<{ [key: string]: string[] }>({});
console.log(uploadedImageUrls,"uploadedImageUrls"); 

const [file, setFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<any>(null);
console.log(file,"file");

  const handleFileChange1 = (event:any) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async (file: File, index: number) => {
    if (!file) return;
    console.log(file,"jkjkljkljkljkl")
  console.log(index,"indexsdfasdf");
  
    setIsUploading(true);
    setUploadError(null);
  
    try {
      const fileRef = ref(storage, `${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
  console.log(downloadURL,"downloadURL");
  
      // await addDoc(collection(firestore, 'files'), {
      //   fileUrl: downloadURL,
      //   fileName: file.name,
      //   createdAt: serverTimestamp(),
      // });
  
      const stringIndex = index; // convert to string for consistency
console.log(stringIndex,"stringIndex");

setUploadedImageUrls((prev) => {
  const currentList = prev[stringIndex] || [];
  const updatedList = currentList.includes(downloadURL)
    ? currentList
    : [...currentList, downloadURL];

  return {
    ...prev,
    [stringIndex]: updatedList,
  };
});

    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  const handleFileChange = (info: any, index: number, pair: any) => {
    const newFileList = info.fileList;
  
    setFileLists((prev:any) => ({
      ...prev,
      [index]: newFileList,
    }));
  
    // Upload only new files (you can customize this check)
    if (info.file.originFileObj) {
      handleFileUpload(info.file.originFileObj, index);
    }
  };
  
// useEffect(()=>{
//   handleFileUpload()
// },[file])


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
  // const handleFileChange = async (info: any, id: any, pair: any) => {
  //   if (info.file.status === "removed") {
  //     await handleDelete(info.file, pair);
  //     const newFileLists = { ...fileLists, [id]: info.fileList };
  //     setFileLists(newFileLists);
  //     console.log(newFileLists,"newFileLists");
      
  //     setFile(newFileLists);
  //     return;
  //   } else if (
  //     info.file.status === "done" &&
  //     info.file.originFileObj?.size >= 10 * 1024 * 1024
  //   ) {
  //     toast.error("Please upload an image smaller than 10 MB.", {
  //       position: "top-center",
  //       autoClose: 1500,
  //     });
  //     return;
  //   } else {
  //     if (info.file.status === "done") {
  //       try {
  //         const compressedPngFile = await convertAndCompressToPNG(
  //           info.file.originFileObj
  //         );
  //         console.log(info.file.originFileObj,"pipipi");
          
  //         setFile(info.file.originFileObj)
  //         const newFileList = [...info.fileList];
  //         const index = newFileList.findIndex(
  //           (file: any) => file.uid === info.file.uid
  //         );
  //         if (index !== -1) {
  //           newFileList[index] = {
  //             ...info.fileList[index],
  //             originFileObj: compressedPngFile,
  //             url: URL.createObjectURL(compressedPngFile),
  //           };
  //         }

  //         const newFileLists = { ...fileLists, [id]: newFileList };
  //         setFileLists(newFileLists);
  //         console.log(newFileLists,"ljdlfjldf");
  //         // setFile(newFileLists);
  //       } catch (error) {
  //         toast.error("Error converting and compressing the file to PNG.", {
  //           position: "top-center",
  //           autoClose: 1500,
  //         });
  //       }
  //       return;
  //     }

  //     if (info.file.status === "done" || info.file.status === "uploading") {
  //       const newFileLists = { ...fileLists, [id]: info.fileList };
  //       setFileLists(newFileLists);
  //       // setFile(newFileLists);
  //     }
  //   }
  // };

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
    setInputPairs([
      ...inputPairs,
      {
        id: newId,
        goalName: `goal${newId}`,
        goalLabel: `Project comment_${inputPairs.length}`,
        commentName: `comment${newId}`,
        commentLabel: `comment_${inputPairs.length}`,
        projectName: `project${newId}`,
        projectLabel: `project_${inputPairs.length}`,
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
        "https://nahb.goaideme.com/remove-project",
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

  
  const submit = async (values: any) => {
    let responseData = null; // Default value to handle the return

    if (actionType === "submit") {
      setLoadButton("Submit");
      setLoading(true);

      const photoComment = inputPairs.map((pair:any) => ({
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
          console.log(response?.pdfReponseData, "qwertyuiop");

          setResponseData(response?.pdfReponseData);
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
    } 

    return responseData; // Ensure return value
  };

  const handleSubmitClick = () => {
    setActionType("submit");
    form.submit();
  };
  const handleSubmitClick1 = async () => {
    try {
      const values = await form.validateFields();
      const formData: any = new FormData();
      for (const [key, value] of formData.entries()) {
        console.log("check this",key, value);
      }
      const formattedData:any = {};
      console.log(inputPairs,"qwertyuiasfsd");
      
      inputPairs.forEach((pair:any) => {
        const commentKey = pair.commentName; // e.g., comment_0
        console.log(commentKey,"commentKey");
        
        const projectKey = pair.goalName; // e.g., goal_0
        const index = pair.id.toString();
        formattedData[commentKey] = {
          comment: values[pair.commentName],
          project: values[pair.projectName],
          images: uploadedImageUrls[index] || [],
        };
      });
      
      const finalPayload = [formattedData];
  console.log(finalPayload,"finalPayload");

  // formData.append("id", state?.photo_section?.commentId);
  formData.append("id", value);
          formData.append("is_save", "false");
          formData.append("user_id", value);
          formData.append("meeting_id", getUserdata.meetings.NextMeeting.id)
  formData.append("fileUrls", finalPayload);
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }
  let item={
    fileUrls:finalPayload,
    is_save:false,
    user_id:value,
    id:value,
    meeting_id:getUserdata.meetings.NextMeeting.id
  }
  localStorage.setItem("myItem", JSON.stringify(item));
  // return
      // Now send `finalPayload` to your API
      const response = await api.photo_section.update_file(item);
      setLoading(false);
      console.log(response, "qwesdafsdfgewrtertt");
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };
  const handleSaveClick = () => {
    setActionType("save");
    form.submit();
  };
  const [storedItem, setStoredItem] = useState(null);
console.log(storedItem,"storedItem");

useEffect(() => {
  const itemFromStorage = localStorage.getItem("myItem");
  if (itemFromStorage) {
    try {
      const parsed = JSON.parse(itemFromStorage);
      setStoredItem(parsed); // optional, only if you're using elsewhere

      const fileUrlData = parsed?.fileUrls?.[0];

      if (fileUrlData && typeof fileUrlData === "object") {
        const newInputPairs = Object.entries(fileUrlData).map(([key, value]: any, index: number) => {
          return {
            id: Number(key.replace(/[^\d]/g, "")) || Date.now() + index,
            goalName: `goalcomment_${index}`,
            goalLabel: `Project ${index}`,
            projectName: `project${index}`,
            projectLabel: `project_${index}`,
            commentName: key, // must match Form.Item `name`
            commentLabel: key,
            projectValue: value.project,
            commentValue: value.comment,
            images: value.images || []
          };
        });

        // Update state
        setInputPairs(newInputPairs);

        // Set form field values
        const initialValues: any = {};
        newInputPairs.forEach((pair: any) => {
          initialValues[pair.projectName] = pair.projectValue;
          initialValues[pair.commentName] = pair.commentValue;
        });
        form.setFieldsValue(initialValues);

        // Set Upload image previews
        const newFileLists: any = {};
        newInputPairs.forEach(pair => {
          newFileLists[pair.id] = pair.images.map((url: string, i: number) => ({
            uid: `${pair.id}-${i}`,
            name: `Image ${i + 1}`,
            status: 'done',
            url: url,
          }));
        });

        setFileLists(newFileLists);
      }
    } catch (error) {
      console.error("Failed to parse item from localStorage", error);
    }
  }
}, []);






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

      const formattedGoals: any = Object.keys(fetchedGoals[0] || {}).map(
        (key, index) => {
          return {
            id: index,
            goalName: `goal${key}`,
            goalLabel: `Project ${key}`,
            commentName: key,
            commentLabel: key,
            projectName: `project_${key}`,
            projectLabel: `project_${key}`,
            // initialGoal: key,
            initialComment: fetchedGoals[0][key]?.comment,
            initialProject: fetchedGoals[0][key]?.project,
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
// const items = JSON.parse(localStorage.getItem("myItem") ?? '{}');
// console.log(item,"item");
// const fetchProjects= items?.fileUrls[0]?.map

//       form.setFieldsValue(formValues);

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
     
    }
  };
useEffect(() => {
  const stored = localStorage.getItem("myItem");
  if (stored) {
    const parsed = JSON.parse(stored);

    const fileUrlData = parsed?.fileUrls?.[0];

    if (fileUrlData && typeof fileUrlData === "object") {
      const newInputPairs = Object.entries(fileUrlData).map(([key, value]:any, index:any) => {
        return {
          id: Number(key.replace(/[^\d]/g, "")) || Date.now() + index,
          goalName: `goalcomment_${index}`,
          goalLabel: `Project ${index}`,
          projectName: `project${index}`,
          projectLabel: `project_${index}`,
          commentName: key,
          commentLabel: key,
          projectValue: value.project,
          commentValue: value.comment,
          images: value.images || []
        };
      });

      setInputPairs(newInputPairs);

      // Set initial form values
      const initialValues:any = {};
      newInputPairs.forEach((pair:any) => {
        initialValues[pair.projectName] = pair.projectValue;
        initialValues[pair.commentName] = pair.commentValue;
      });

      form.setFieldsValue(initialValues);

      // Set fileLists if you're using Upload
      const newFileLists:any = {};
      newInputPairs.forEach(pair => {
        newFileLists[pair.id] = (pair.images || []).map((url: string, i: number) => ({
          uid: `${pair.id}-${i}`,
          name: `Image ${i + 1}`,
          status: "done",
          url,
        }));
      });

      setFileLists(newFileLists);
    }
  }
}, []);

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
    console.log(data, "sdafasdfasd");

    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, "");
    const blob = await pdf(<Pdf state={data} />).toBlob();
    const pdfUrl = URL.createObjectURL(blob);
    return { blob, pdfUrl, timestamp };
  };
  const companyNameMap: any = {
    augusta: "Augusta Homes, Inc.",
    buffington: "Buffington Homes, L.P.",
    cabin: "Cabin John Builders",
    cataldo: "Cataldo Custom Builders",
    david_campbell: "The DCB",
    dc_building: "DC Building Inc.",
    Ddenman_construction: "Denman Construction, Inc.",
    ellis: "Ellis Custom Homes",
    tm_grady_builders: "T.M. Grady Builders",
    hardwick: "Hardwick G. C.",
    homeSource: "HomeSource Construction",
    ed_nikles: "Ed Nikles Custom Builder, Inc.",
    olsen: "Olsen Custom Homes",
    raykon: "Raykon Construction",
    matt_sitra: "Matt Sitra Custom Homes",
    schneider: "Schneider Construction, LLC",
    shaeffer: "Shaeffer Hyde Construction",
    split: "Split Rock Custom Homes",
    tiara: "Tiara Sun Development",
  };

  const sharePdf = async (responseData: any) => {
    console.log(responseData, "responseData");
    const companyName =
      companyNameMap[responseData?.company_name || ""] || "N/A";
    const { pdfUrl, timestamp } = await generatePdf(responseData);
    const response = await fetch(pdfUrl);
    const blob = await response.blob();

    const file = new File([blob], `check.pdf`, { type: "application/pdf" });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", getUserdata?.user_id);
    formData.append("meeting_id", getUserdata.meetings.NextMeeting.id);
    formData.append("company_name", companyName);
    // formData.append("company_name", responseData?.company_name);
    const res = await fetch(
      "https://nahb.goaideme.com/send-completeform-mail-to-superadmin",
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
        {/* <FileUpload /> */}
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
                              >
                                <Upload
                                  listType="picture-card"
                                  fileList={fileLists[pair.id] || []}
                                  onPreview={handlePreview}
                                  onChange={(info) =>{
                                    handleFileChange(
                                      info,
                                      pair.id.toString(),
                                      pair
                                    )}
                                  }
                                  // onChange={handleFileChange}
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
                            onClick={handleSubmitClick1}
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
                            onClick={handleSubmitClick1}
                            className="login-form-button "
                          >
                            {loadButton === "Submit" ? <Spin /> : "Submit"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </Form>


                  {/* <button onClick={handleFileUpload} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </button> */}
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
