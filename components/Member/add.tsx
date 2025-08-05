"use client";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Typography,
} from "antd";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import MainLayout from "../../components/Layout/layout";
import api from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import { destroyCookie } from "nookies";
import { useSelector } from "react-redux";
import type { UploadChangeParam } from "antd/es/upload";
import { DeleteOutlined } from "@ant-design/icons";
import companyNames from "@/utils/companyNames.json";

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const allNames = Object.entries(companyNames); // [ [key, label], ... ]
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleRemove = (file: UploadFile) => {
    setLogoImage("");

    console.log(fileList, "fileList");
    const newFileList = fileList.filter((item: any) => item.uid !== file.uid);

    setFileList(newFileList);
    message.success("Image removed successfully");
  };

  const handleChange1: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    // Always ensure newFileList is an array
    console.log(newFileList.length, "newFileList");
    setFileList(newFileList || []);
    if (newFileList.length === 1) {
      // If an image is uploaded, set it as the logo image
      const file = newFileList[0];
      console.log(file, "newFileList file");

      setLogoImage(file.thumbUrl || (file.preview as string)); // Set the logoImage state
    }
  };

  const uploadButton = (
    <Button style={{ border: 0, background: "none" }} icon={<PlusOutlined />}>
      Upload
    </Button>
  );

  console.log(form.getFieldValue("company_name"), "form here to see blaue");

  const handleChange = (value: any) => {
    // Update the form value directly when the select changes
    form.setFieldsValue({ company_name: value });
    setCompanyType(value); // Optional, if you need local state as well
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
    // country_code: values.country_code ?? "+93",

    console.log(logoImage, "here to see values");
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
            logo_url: logoImage ? logoImage : getImage,
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
      console.log("running aaa");
      const getDataById = async () => {
        const item = {
          user_id: value,
          meeting_id: getUserdata.meetings.NextMeeting.id,
        };
        try {
          const res = await api.User.getById(item as any);

          console.log(res?.data, "check");
          setState(res?.data || null);
          setLogoImage(res?.data?.logo_url || null);
          setCompanyType(res?.data?.company_name)
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
  }, [type]);
  // form.setFieldsValue(res);
  const submit = () => {
    router.push("/admin/member/add/page2");
  };

  console.log(previewImage, "previewImage");
  console.log(logoImage, "logoImage");

  const handleAddCompany = async () => {
    const key = newCompanyName.trim().toLowerCase().replace(/\s+/g, "_");
    const value = newCompanyName.trim();

    try {
      const res = await fetch("/api/add-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Company added!");
        // setCompanyOptions((prev) => [...prev, value]);
        form.setFieldsValue({ company_name: value });
      } else {
        toast.error(data.message || "Error adding company");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsModalOpen(false);
      setNewCompanyName("");
    }
  };

  const handleDelete = async (companyName: string) => {
    try {
      const response = await fetch("/api/delete-company", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName }), // Send the company name to the API
      });

      const res = await response.json();

      if (res?.message) {
        toast.success("Company name deleted successfully");
        // setCompanyOptions((prev) => [...prev, value]);
        form.setFieldsValue({ company_name: value });
      }
      // window.location.reload()
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error deleting company:", error);
    }
  };

  console.log(
    form.getFieldValue("company_name"),
    "giving me values please check and update"
  );

  return (
    <>
      <Fragment>
        <section className="club_member">
          <Row justify="center" gutter={[20, 20]} className="heightCenter">
            <Col xs={24} sm={22} md={20} lg={16} xl={14} xxl={12}>
              <Card className="common-card">
                <div className="d-flex justify-content-between">
                  <Typography.Title level={3} className="m-0 mb-3 fw-bold">
                    {type == "edit" ? "Edit" : "Add"} Club Member
                  </Typography.Title>
                  {/* <Button size={'large'} type="primary" className="text-white" disabled>1/8</Button> */}
                </div>

                {/* form  */}
                <div className="card-form-wrapper ">
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
                    <div>
                      <Image
                        width={200}
                        src={logoImage}
                        alt="Logo"
                        preview={{
                          visible: previewOpen,
                          onVisibleChange: (visible) => setPreviewOpen(visible),
                          afterOpenChange: (visible) =>
                            !visible && setPreviewImage(""),
                        }}
                      />
                      {/* Add a button to delete the logo image */}
                    </div>
                  )}
                  {logoImage ? (
                    <Button className="mt-2" onClick={() => setLogoImage("")}>
                      Delete Image
                    </Button>
                  ) : (
                    ""
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
                        {/* <Select
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
                        </Select> */}

                        <div
                          style={{
                            display: "flex",
                            gap: "2px",
                            alignItems: "center",
                          }}
                        >
                          <Select
                            size="large"
                            placeholder="Select Company Name"
                            value={companyType}
                            onChange={(selectedParam) => {
                              handleChange(selectedParam);
                            }}
                            style={{ flex: 1 }}
                          >
                            {allNames.map(([param, label]) => (
                              <Option key={param} value={label}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <span>{label}</span>
                                  <Popconfirm
                                    title="Are you sure to delete?"
                                    onConfirm={() => handleDelete(param)}
                                    okText="Yes"
                                    cancelText="No"
                                  >
                                    <Button
                                      icon={<DeleteOutlined />}
                                      type="text"
                                      danger
                                      style={{ padding: 0 }}
                                    />
                                  </Popconfirm>
                                </div>
                              </Option>
                            ))}
                          </Select>

                          <Button
                            type="primary"
                            onClick={() => setIsModalOpen(true)}
                            style={{ marginLeft: "2px", padding: "8px" }} // Optional, to push button to the right
                          >
                            +
                          </Button>
                        </div>
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
      <Modal
        title="Add New Company"
        visible={isModalOpen}
        confirmLoading={isAdding}
        onOk={async () => {
          if (newCompanyName.trim()) {
            setIsAdding(true);
            await handleAddCompany();
            setIsAdding(false);
          } else {
            toast.error("Please enter a company name");
          }
        }}
        onCancel={() => {
          setIsModalOpen(false);
          setNewCompanyName("");
        }}
        okText={isAdding ? "Loading..." : "Add"}
        cancelText="Cancel"
      >
        <Input
          placeholder="Enter new company name"
          value={newCompanyName}
          onChange={(e) => setNewCompanyName(e.target.value)}
          disabled={isAdding} // optional: disable input while loading
        />
      </Modal>
    </>
  );
};

export default Add;
