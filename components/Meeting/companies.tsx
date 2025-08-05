"use client";
import type { NextPage } from "next";
import React, { Fragment, useEffect, useState } from "react";
import {
  Table,
  Input,
  Breadcrumb,
  Typography,
  Spin,
  Card,
  Row,
  Col,
  Modal,
  Button,
  Popconfirm,
} from "antd";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import companyNames from "@/utils/companyNames.json";

const { Search } = Input;
type CompanyData = Record<string, string>; // or `Record<string, any>` if values can vary

const Companies: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newCompanyName, setNewCompanyName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);


 const fetchCompanyData = async () => {
  try {
    const res = await fetch("https://cybersify.tech/sellmacdev/company.php");
    const data = await res.json();

    console.log(data, "data here to s");

    const reversed = Object.entries(data).reverse(); // 👈 First reverse the data

    const allNames = reversed.map(([key, company], index) => ({
      key: index + 1, // 👈 Now index is correct (1 to 20)
      name: key.replace(/_/g, " "),
      company,  
      rawKey: key,
    }));

    setFilteredData(allNames);
  } catch (err) {
    toast.error("Failed to fetch companies");
  }
};


console.log(filteredData,"filteredData")

  useEffect(() => {
    fetchCompanyData();
    setTimeout(() => {
      setLoading(false);
    }, 1000); // simulate loading
  }, []);

useEffect(() => {
  const filtered = filteredData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.company.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredData(filtered);
}, [searchTerm]);


  const handleAddCompany = async () => {
    const key = newCompanyName.trim().toLowerCase().replace(/\s+/g, "_");
    const value = newCompanyName.trim();

    try {
      const res = await fetch("https://cybersify.tech/sellmacdev/company.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({key, value }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Company added!");
    fetchCompanyData();
      } else {
        toast.error(data.message || "Error adding company");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsModalOpen(false);
      setNewCompanyName("");
      setIsAdding(false);
    }
  };

    const handleDelete = async (companyName: string) => {
      try {
        const response = await fetch("https://cybersify.tech/sellmacdev/company.php", {
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
          fetchCompanyData()
         }
        // window.location.reload()
      } catch (error) {
        toast.error("Something went wrong");
        console.error("Error deleting company:", error);
      }
    };

  const columns = [
    {
      title: "No.",
      dataIndex: "key",
      key: "key",
    },

    {
      title: "Company Name",
      dataIndex: "company",
      key: "company",
    },
   {
  title: "Action",
  dataIndex: "company",
  key: "action",
  render: (_: any, record: any) => (
    <Popconfirm
      title="Are you sure to delete this company?"
      onConfirm={() => handleDelete(record.company)} // ✅ Send actual company name
      okText="Yes"
      cancelText="No"
    >
      <Button icon={<DeleteOutlined />} type="text" danger />
    </Popconfirm>
  ),
}

  ];

  return (
    <Fragment>
      <ToastContainer position="top-center" autoClose={1000} hideProgressBar />
      <section>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Card className="common-card">
              <div className="mb-4 d-flex justify-content-between align-items-center">
                <Breadcrumb separator=">">
                  <Breadcrumb.Item>
                    <Link href="/admin/dashboard">General</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>Companies</Breadcrumb.Item>
                </Breadcrumb>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsModalOpen(true)}
                >
                  Add Company
                </Button>
              </div>

              <Typography.Title level={3} className="m-0 fw-bold">
                Companies
              </Typography.Title>

              <div className="my-4">
                <Search
                  size="large"
                  placeholder="Search by Name or Company"
                  enterButton
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="tabs-wrapper">
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "20vh",
                    }}
                  >
                    <Spin size="large" />
                  </div>
                ) : (
                  <Table
                    className="tableBox"
                    dataSource={filteredData}
                    columns={columns}
                    pagination={{ position: ["bottomCenter"] }}
                  />
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </section>

      <Modal
        title="Add New Company"
        open={isModalOpen}
        confirmLoading={isAdding}
        onOk={async () => {
          if (newCompanyName.trim()) {
            setIsAdding(true);
            await handleAddCompany();
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
          disabled={isAdding}
        />
      </Modal>
    </Fragment>
  );
};

export default Companies;
