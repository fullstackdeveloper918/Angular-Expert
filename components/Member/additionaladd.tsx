"use client";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import MainLayout from "../../components/Layout/layout";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { destroyCookie } from "nookies";
import { MinusCircleOutlined } from "@ant-design/icons";
import AdditionalRoles from "../../utils/AdditionalRoles.json";
import { useSelector } from "react-redux";
const { Option } = Select;
const Additionaladd = () => {
  const getUserdata = useSelector((state: any) => state?.user?.userData);
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<any>(null);
  const searchParams = useSearchParams();
  const entries = Array.from(searchParams.entries());
  const [companyType, setCompanyType] = useState<any>(null);
  const [fieldList, setFieldList] = useState<any>([{ id: Date.now() }]);
  const [selectedRoles, setSelectedRoles] = useState<any>([]); 
  const [allFieldsFilled, setAllFieldsFilled] = useState<boolean>(false);

  const value = entries.length > 0 ? entries[0][0] : '';
  const type = entries.length > 1 && entries[1]?.length > 0 ? entries[1][0] : '';

  // Fetch data when in edit mode
  useEffect(() => {
    if (type === 'edit') {
      const getDataById = async () => {
        const item = { parent_user_id: value };
        try {
          const res = await api.User.getById1(item);
          setState(res?.data || null);
          // Only set form values once data is fetched and avoid overwriting dynamic fields
          if (res?.data) {
            form.setFieldsValue({
              ...res?.data,
              // Make sure you merge field values correctly without overwriting ones that may already be set
            });
          }
        } catch (error: any) {
          alert(error.message);
        }
      };
      getDataById();
    }
  }, [type, form]);

  // Add a new field set
  const addFieldSet = () => {
    form.validateFields().then(() => {
      const newFieldId = Date.now();
      setFieldList([...fieldList, { id: newFieldId }]);
      const currentFields = form.getFieldsValue();
      const newSelectedRoles = Object.values(currentFields)
        .filter((_, index) => index % 5 === 4)
        .flat();
      setSelectedRoles([...selectedRoles, ...newSelectedRoles]);
      saveDataToLocalStorage(newFieldId, currentFields);
    });
  };

  // Remove a field set
  const removeFieldSet = (id: any) => {
    setFieldList((prevList:any) => prevList.filter((field:any) => field.id !== id));
  };

  // Save data to localStorage
  const saveDataToLocalStorage = (id: any, currentFields: any) => {
    const dataToStore = fieldList.map((field:any) => ({
      id: field.id,
      firstname: currentFields[`firstname_${field.id}`],
      lastname: currentFields[`lastname_${field.id}`],
      email: currentFields[`email_${field.id}`],
      password: currentFields[`password_${field.id}`],
      template_access: currentFields[`roles_${field.id}`] || [],
    }));

    localStorage.setItem('formData', JSON.stringify(dataToStore));
  };

  // Check if all fields are filled
  const onFieldsChange = () => {
    const currentFields = form.getFieldsValue();
    const areAllFieldsFilled = fieldList.every((field:any) => {
      return (
        currentFields[`firstname_${field.id}`] &&
        currentFields[`lastname_${field.id}`] &&
        currentFields[`email_${field.id}`] &&
        currentFields[`password_${field.id}`] &&
        currentFields[`roles_${field.id}`]?.length > 0
      );
    });
    setAllFieldsFilled(areAllFieldsFilled);
  };

  // Handle form submission
  const onFinish = async (values: any) => {
    const formattedData = fieldList.map((field:any) => ({
      firstname: values[`firstname_${field.id}`],
      lastname: values[`lastname_${field.id}`],
      email: values[`email_${field.id}`],
      password: values[`password_${field.id}`],
      template_access: values[`roles_${field.id}`] || [],
    }));

    localStorage.setItem('formData', JSON.stringify(formattedData));

    let item = {
      parent_user_id: value,
      additionalUsers: formattedData,
    };

    try {
      setLoading(true);
      let res;
      if (type) {
        res = await api.User.edit_additional_user(item);
      } else {
        res = await api.User.add_additional_user(item);
      }

      toast.success(res?.data?.message);

      if (res) {
        router.back();
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle back navigation
  const onBack = () => {
    router.push('/admin/member');
  };

  return (
    <>
      <Fragment>
        <section className="club_member">
          <Row justify="center" gutter={[20, 20]} className="heightCenter">
            <Col xs={24} sm={22} md={20} lg={16} xl={14} xxl={12}>
              <Card className="common-card">
                {/* <div className='mb-4'>
                <Breadcrumb separator=">">
                  <Breadcrumb.Item><Link href="/" className='text-decoration-none'>Home</Link></Breadcrumb.Item>
                  <Breadcrumb.Item><Link href="/admin/member" className='text-decoration-none'>Club Members</Link></Breadcrumb.Item>
                  <Breadcrumb.Item className='text-decoration-none'>Add Club Member</Breadcrumb.Item>
                </Breadcrumb>
              </div> */}
                {/* Title  */}
                <div className="d-flex justify-content-between">
                  <Typography.Title level={3} className="m-0 fw-bold">
                    {" "}
                    Additional Member
                  </Typography.Title>
                  {/* <Button size={'large'} type="primary" className="text-white" disabled>1/8</Button> */}
                </div>

                {/* form  */}
                <div className="card-form-wrapper">
                <Form
      form={form}
      name="add_staff"
      className="add-staff-form"
      onValuesChange={onFieldsChange}
      scrollToFirstError
      layout="vertical"
      onFinish={onFinish}
    >
      {/* Dynamic Field List Rendering */}
      {fieldList.map((field:any) => (
        <div key={field.id} className="row mt-4" style={{ position: 'relative' }}>
          <Form.Item
            name={`firstname_${field.id}`}
            className="col-lg-6 col-sm-12"
            label="First Name"
          >
            <Input size="large" placeholder="First Name" />
          </Form.Item>
          <Form.Item
            name={`lastname_${field.id}`}
            className="col-lg-6 col-sm-12"
            label="Last Name"
          >
            <Input size="large" placeholder="Last Name" />
          </Form.Item>
          <Form.Item
            name={`email_${field.id}`}
            className="col-lg-6 col-sm-12"
            label="Email"
          >
            <Input size="large" type="email" placeholder="Email" />
          </Form.Item>
          <Form.Item
            name={`password_${field.id}`}
            className="col-lg-6 col-sm-12"
            label="Password"
          >
            <Input.Password size="large" placeholder="Password" />
          </Form.Item>
          <Form.Item name={`roles_${field.id}`} label="Permissions">
            <Select
              mode="tags"
              size="large"
              placeholder="Please select"
              style={{ width: '100%' }}
              options={AdditionalRoles.filter(
                (role) => !selectedRoles.includes(role.rol)
              ).map((res) => ({
                value: res.rol,
                label: res.name,
              }))}
            />
          </Form.Item>
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              right: '0',
              fontSize: '24px',
              cursor: 'pointer',
              textAlign: 'end',
            }}
            onClick={() => removeFieldSet(field.id)}
          >
            <MinusCircleOutlined />
          </div>
        </div>
      ))}

      <Button
        type="dashed"
        onClick={addFieldSet}
        className="col-lg-12 mt-4 mb-3"
        disabled={!allFieldsFilled}
      >
        Add More Fields
      </Button>

      <div className="d-flex gap-3 justify-content-end">
        <Button size="large" type="primary" onClick={onBack}>
          Back
        </Button>
        <Button size="large" type="primary" htmlType="submit" className="login-form-button" loading={loading}>
          Save
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

export default Additionaladd;
