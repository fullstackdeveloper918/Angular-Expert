"use client";
import { Button, Card, Col, Form, Input, Row, Select, Typography } from "antd";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import MainLayout from "../../components/Layout/layout";
import api from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import { destroyCookie } from "nookies";
import { useSelector } from "react-redux";
import type { UploadChangeParam } from "antd/es/upload";
import { CloseOutlined } from "@ant-design/icons"; // Import the Ant Design Close icon

import {
  storage,
  firestore,
  ref,
  uploadBytes,
  getDownloadURL,
  collection,
  addDoc,
  serverTimestamp,
} from "../../utils/firebase";
const { Option } = Select;
// const { Row, Col, Card, Button } = {
//   Button: dynamic(() => import("antd").then((module) => module.Button), {
//     ssr: false,
//   }),
//   Row: dynamic(() => import("antd").then((module) => module.Row), {
//     ssr: false,
//   }),
//   Col: dynamic(() => import("antd").then((module) => module.Col), {
//     ssr: false,
//   }),
//   Card: dynamic(() => import("antd").then((module) => module.Card), {
//     ssr: false,
//   }),
// };
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const Add = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<any>("");
  console.log(state?.logo_url, "ljljl");

  const searchParams = useSearchParams();
  const entries = Array.from(searchParams.entries());
  const [companyType, setCompanyType] = useState<any>("");
  const value = entries.length > 0 ? entries[0][0] : "";
  const type = entries.length > 0 ? entries[1][0] : "";
  const getUserdata = useSelector((state: any) => state?.user?.userData);
  const [getImage, setGetImage] = useState<any>("");
  const [logoImage, setLogoImage] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<any>([]); // Always initialized as an array

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleRemove = (file: UploadFile) => {
    setLogoImage("");
    const newFileList = fileList.filter((item: any) => item.uid !== file.uid);

    setFileList(newFileList);
    message.success("Image removed successfully");
  };

  const handleChange1: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    // Always ensure newFileList is an array
    setFileList(newFileList || []);
    console.log(newFileList, "newFileList");
    if (newFileList.length === 1) {
      // If an image is uploaded, set it as the logo image
      const file = newFileList[0];
      setLogoImage(file.url || (file.preview as string)); // Set the logoImage state
    }
  };

  const uploadButton = (
    <Button style={{ border: 0, background: "none" }} icon={<PlusOutlined />}>
      Upload
    </Button>
  );

  const handleChange = (value: any) => {
    setCompanyType(value);
  };
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<any>(null);
  const handleFileUpload = async () => {
    // if (!file) return;
    console.log(fileList, "hskdfhkasd");

    // setIsUploading(true);
    // setUploadError(null);

    try {
      const fileRef = ref(storage, `${fileList[0]?.originFileObj.name}`);

      await uploadBytes(fileRef, fileList[0]?.originFileObj);

      const downloadURL = await getDownloadURL(fileRef);
      console.log(downloadURL, "downloadURL");
      setGetImage(downloadURL);
      // setPreviewImage(downloadURL)
      await addDoc(collection(firestore, "files"), {
        fileUrl: downloadURL,
        fileName: fileList[0]?.name,
        createdAt: serverTimestamp(),
      });
      // setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      // setUploadError("Error uploading file. Please try again.");
    } finally {
      // setIsUploading(false);
    }
  };
  useEffect(() => {
    handleFileUpload();
  }, [fileList]);

  const onFinish = async (values: any) => {
        console.log(logoImage, "here to see values");

    // country_code: values.country_code ?? "+93",
    let items = {
      first_step: {
        logo_url: "",
        firstname: String(values.firstname).trim(),
        lastname: String(values.lastname).trim(),
        email: String(values.email).trim(),
        password: String(values.password).trim(),
        mobile: values.phone_number,
        roles: values.roles,
        company_name: values?.company_name,
        position: values?.position,
        home_city: values?.home_city,
        meeting_id: getUserdata.meetings.NextMeeting.id,
      },
    } as any;

    try {
      setLoading(true);
      if (type == "edit") {
        let items = {
          first_step: {
            logo_url: logoImage,
            userId: value,
            firstname: String(values.firstname).trim(),
            lastname: String(values.lastname).trim(),
            email: String(values.email).trim(),
            // password: "Abhay@1234",
            mobile: values.phone_number,
            roles: "",
            company_name: values?.company_name,
            position: values?.position,
            home_city: values?.home_city,
            meeting_id: getUserdata.meetings.NextMeeting.id,
          },
        } as any;
        let res = await api.User.edit(items);
        toast.success(res?.message);
        // if(res)  {
        router.push(`/admin/member/additional_user?${value}&edit`);
        // }
        // router.push(`/admin/member/add/page2?${value}&edit`)
      } else {
        let res = await api.Auth.signUp(items);
        toast.success(res?.message);

        // if(res)  {
        //   router.push('/admin/member')
        // }
        router.push(`/admin/member/additional_user?${res?.user_id}`);
        if (res?.status == 500) {
          // toast.error("Session Expired Login Again")
          // router.replace("/auth/signin")
          localStorage.setItem("redirectAfterLogin", window.location.pathname);
          destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: "/" });
          // dispatch(clearUserData({}));
          toast.error("Session Expired. Login Again");
          router.replace("/auth/signin");
        }
      }
    } catch (error: any) {
      if (error) {
        if (error?.status === 409) {
          toast.error(
            "The email address is already in use by another account."
          );
        }
      }
    } finally {
      setLoading(false);
    }
  };
  //   const onPrevious = async (values: any) => {
  //     // country_code: values.country_code ?? "+93",
  //     let items = {
  //       first_step: {
  //         firstname: String(values.firstname).trim(),
  //         lastname: String(values.lastname).trim(),
  //         email: String(values.email).trim(),
  //         password: String(values.password).trim(),
  //         mobile: values.phone_number,
  //         roles: values.roles,
  //         company_name: values?.company_name,
  //         position: values?.position,
  //         home_city: values?.home_city,
  //       }
  //     } as any

  //     try {
  //       setLoading(true)
  //       if (type == "edit") {
  //         let items = {
  //           first_step: {
  //             userId: value,
  //             firstname: String(values.firstname).trim(),
  //             lastname: String(values.lastname).trim(),
  //             email: String(values.email).trim(),
  //             password: String(values.password).trim(),
  //             mobile: values.phone_number,
  //             roles: "",
  //             company_name: values?.company_name,
  //             position: values?.position,
  //             home_city: values?.home_city,
  //             meeting_id:getUserdata.meetings.NextMeeting.id,
  //           }
  //         } as any
  //         let res = await api.User.edit(items)
  //         // router.push(`/admin/member/add/page2?${value}&edit`)
  //         if (res?.status == 500) {
  //           destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
  //           localStorage.removeItem('hasReloaded');
  //           toast.error("Session Expired Login Again")
  //           router.replace("/auth/signin")
  //       }
  //       } else {

  //         let res = await api.Auth.signUp(items)
  //         // router.push(`/admin/member/add/page2?${res?.user_id}`)
  //         router.push(`/admin/member/additional_user`)
  //         toast.success("Added Successfully")
  // router.back()
  //         if (res?.status == 500) {
  //           toast.error("Session Expired Login Again")
  //           router.replace("/auth/signin")
  //         }
  //       }

  //     } catch (error: any) {

  //       if (error?.status==400) {
  //         destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
  //         localStorage.removeItem('hasReloaded');
  //         toast.error("Session Expired Login Again")
  //         router.replace("/auth/signin")
  //     }

  //     } finally {
  //       setLoading(false)
  //     }
  //   };

  useEffect(() => {
    if (type == "edit") {
      const getDataById = async () => {
        const item = {
          user_id: value,
          meeting_id: getUserdata.meetings.NextMeeting.id,
        };
        try {
          const res = await api.User.getById(item as any);
          setState(res?.data || null);
          setLogoImage(res?.data?.logo_url || null);
          if (res?.data?.status == 500) {
            toast.error("Session Expired Login Again");
            router.replace("/auth/signin");
          }
          form.setFieldsValue(res?.data);
        } catch (error: any) {
          alert(error.message);
        }
      };
      getDataById();
    }
  }, [type, form]);
  // form.setFieldsValue(res);
  const submit = () => {
    router.push("/admin/member/add/page2");
  };

  console.log(previewImage, "previewImage");
  console.log(logoImage, "logoImage");

  return (
    <>
      <Fragment>
        <section className="club_member">
          <Row justify="center" gutter={[20, 20]} className="heightCenter">
            <Col xs={24} sm={22} md={20} lg={16} xl={14} xxl={12}>
              <Card className="common-card">
                <div className="d-flex justify-content-center">
                  <Typography.Title level={2} className="m-0 fw-bold">
                    {type == "edit" ? "Edit" : "Add"} Club Member
                  </Typography.Title>
                  {/* <Button size={'large'} type="primary" className="text-white" disabled>1/8</Button> */}
                </div>

                {/* form  */}
                <div className="card-form-wrapper">
                  {/* <Form.Item label="Upload Image" name="image" valuePropName="fileList"> */}
                  {!logoImage ? (
                    <Upload
                      // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={handleChange1}
                      onRemove={handleRemove}
                      maxCount={1} // Only one image at a time
                    >
                      {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                  ) : (
                    ""
                  )}
                  {/* </Form.Item> */}

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
                  {/* <img src={logoImage} alt="" className="" /> */}
                  {logoImage && (
                    <div className="d-flex justify-content-center my-2 position-relative">
                      <div
                        className="d-flex justify-content-center my-4"
                        style={{
                          borderRadius: "100%",
                          width: "200px",
                          height: "200px",
                          overflow: "hidden", // This is important to maintain the circular shape on hover
                        }}
                      >
                        <Image
                          style={{
                            borderRadius: "50%", // Ensure the image is round initially
                            transition: "border-radius 0.3s ease", // Smooth transition for the hover effect
                          }}
                          width={200}
                          height={200}
                          src={logoImage}
                          alt="Logo"
                          preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) =>
                              setPreviewOpen(visible),
                            afterOpenChange: (visible) =>
                              !visible && setPreviewImage(""),
                          }}
                          onMouseEnter={(
                            e: React.MouseEvent<HTMLImageElement>
                          ) => {
                            // On hover, make the borderRadius 50% (round)
                            (e.target as HTMLImageElement).style.borderRadius =
                              "50%";
                          }}
                          onMouseLeave={(
                            e: React.MouseEvent<HTMLImageElement>
                          ) => {
                            // On mouse leave, revert the borderRadius back to 50% (round)
                            (e.target as HTMLImageElement).style.borderRadius =
                              "50%";
                          }}
                        />
                      </div>
                      <Button
                        style={{
                          position: "absolute",
                          right: "35%",
                          top: "20px",
                          padding: "0px",
                          border: "none",
                          background: "radial-gradient(#e1d9d9, transparent)",
                          fontSize: "24px",
                          color: "black",
                          cursor: "pointer",
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() => setLogoImage("")} // Clear the logo image
                        icon={<CloseOutlined />}
                      />
                    </div>
                  )}

                  <Form
                    form={form}
                    name="add_staff"
                    className="add-staff-form"
                    scrollToFirstError
                    layout="vertical"
                    onFinish={onFinish}
                  >
                    {/* First Name  */}
                    <div className="row mt-4">
                      {/* <Form.Item label="Upload Image" name="image" valuePropName="fileList">
        <Upload
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange1}
          onRemove={handleRemove}
          maxCount={1} // Only one image at a time
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
      </Form.Item>

      {previewImage && (
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
                      <Form.Item
                        name="firstname"
                        className="col-lg-6 col-sm-12"
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "Please Enter First Name",
                          },
                        ]}
                        label="First Name"
                      >
                        <Input
                          size={"large"}
                          placeholder="First Name"
                          // onKeyPress={(e: any) => {
                          //   if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                          //     e.preventDefault();
                          //   } else {
                          //     e.target.value = String(e.target.value).trim()
                          //   }
                          // }}
                        />
                      </Form.Item>
                      {/* Last Name  */}
                      <Form.Item
                        name="lastname"
                        className="col-lg-6 col-sm-12"
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "Please Enter Last Name",
                          },
                        ]}
                        label="Last Name"
                      >
                        <Input
                          size={"large"}
                          placeholder="Last Name"
                          // onKeyPress={(e: any) => {
                          //   if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                          //     e.preventDefault();
                          //   } else {
                          //     e.target.value = String(e.target.value).trim()
                          //   }
                          // }}
                        />
                      </Form.Item>
                      <Form.Item
                        name="company_name"
                        className="col-lg-6 col-sm-12"
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "Please Enter Company Name",
                          },
                        ]}
                        label="Company Name"
                      >
                        {/* <Input size={'large'} placeholder="Club Name"
                        onKeyPress={(e: any) => {
                          if (!/[a-zA-Z ]/.test(e.key) || (e.key === ' ' && !e.target.value)) {
                            e.preventDefault();
                          } else {
                            e.target.value = String(e.target.value).trim()
                          }
                        }}
                      /> */}
                        <Select
                          size={"large"}
                          placeholder="Select Company Name"
                          onChange={handleChange}
                        >
                          <Option value="augusta">Augusta Homes, Inc.</Option>
                          <Option value="buffington">
                            Buffington Homes, L.P.
                          </Option>
                          <Option value="cabin">Cabin John Builders</Option>
                          <Option value="cataldo">
                            Cataldo Custom Builders
                          </Option>
                          <Option value="david_campbell">The DCB</Option>
                          <Option value="dc_building">DC Building Inc.</Option>
                          <Option value="Ddenman_construction">
                            Denman Construction, Inc.
                          </Option>
                          <Option value="ellis">Ellis Custom Homes</Option>
                          <Option value="tm_grady_builders">
                            T.M. Grady Builders
                          </Option>
                          <Option value="hardwick">Hardwick G. C.</Option>
                          <Option value="homeSource">
                            HomeSource Construction
                          </Option>
                          <Option value="ed_nikles">
                            Ed Nikles Custom Builder, Inc.
                          </Option>
                          <Option value="olsen">Olsen Custom Homes</Option>
                          <Option value="raykon">Raykon Construction</Option>
                          <Option value="matt_sitra">
                            Matt Sitra Custom Homes
                          </Option>
                          <Option value="schneider">
                            Schneider Construction, LLC
                          </Option>
                          <Option value="shaeffer">
                            Shaeffer Hyde Construction
                          </Option>
                          <Option value="split">Split Rock Custom Homes</Option>
                          <Option value="tiara">Tiara Sun Development</Option>
                        </Select>
                      </Form.Item>

                      <Form.Item
                        name="phone_number"
                        className="col-lg-6 col-sm-12"
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "Please Enter Phone No",
                          },
                        ]}
                        label="Phone No"
                      >
                        <Input
                          size={"large"}
                          type="text"
                          minLength={6}
                          maxLength={20}
                          placeholder="Phone No"
                          onKeyPress={(event) => {
                            if (
                              !/[0-9\s\(\)\-\+]/.test(event.key) &&
                              ![
                                "Backspace",
                                "Tab",
                                "ArrowLeft",
                                "ArrowRight",
                              ].includes(event.key)
                            ) {
                              event.preventDefault();
                            }
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        name="position"
                        className="col-lg-6 col-sm-12"
                        rules={[
                          { required: true, message: "Please Enter Position" },
                        ]}
                        label="Position"
                      >
                        <Input
                          size={"large"}
                          type="position"
                          placeholder="Position"
                        />
                      </Form.Item>
                      <Form.Item
                        name="home_city"
                        className="col-lg-6 col-sm-12"
                        rules={[
                          { required: true, message: "Please Enter Home City" },
                        ]}
                        label="Home City"
                      >
                        <Input
                          size={"large"}
                          type="homecity"
                          placeholder="Home City"
                        />
                      </Form.Item>

                      {/* Email  */}
                      <Form.Item
                        name="email"
                        className="col-lg-6 col-sm-12"
                        rules={[
                          { required: true, message: "Please Enter Email" },
                        ]}
                        label="Email"
                      >
                        <Input
                          size={"large"}
                          type="email"
                          placeholder="Email"
                        />
                      </Form.Item>
                      {/* Password  */}
                      {type == "edit" ? (
                        ""
                      ) : (
                        <Form.Item
                          name="password"
                          className="col-lg-6 col-sm-12"
                          rules={[
                            {
                              required: true,
                              message: "Please Enter Password!",
                            },
                            {
                              pattern:
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                              message:
                                "Password must contain at least 8 characters, including uppercase, lowercase, number, and special characters.",
                            },
                          ]}
                          label="Password"
                        >
                          <Input.Password
                            size={"large"}
                            type="password"
                            placeholder="Password"
                          />
                        </Form.Item>
                      )}

                      {/* Phone No  */}

                      {/* Roles  */}
                      {/* <Form.Item name="roles" className=' col-sm-12' label="Roles" rules={[{ required: true, message: 'Please Select Roles' }]}>
                      <Select
                        mode="tags"
                        size={'large'}
                        placeholder="Please select"
                        style={{ width: '100%' }}
                        options={EmployeeRoles.map((res) => {
                          return {
                            value: res.rol,
                            label: res.name
                          }
                        })}
                      />
                    </Form.Item> */}
                    </div>
                    {/* Button  */}
                    <div className="d-flex gap-3 justify-content-end">
                      {/* <Button size={'large'} type="primary" onClick={onPrevious} className="" >
                        Save
                      </Button> */}
                      <Button
                        size={"large"}
                        type="primary"
                        htmlType="submit"
                        className="login-form-button "
                        loading={loading}
                      >
                        Next
                      </Button>
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

export default Add;
