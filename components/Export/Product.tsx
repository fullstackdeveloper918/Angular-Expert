"use client";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
import { Space, message } from "antd";
import {
  Table,
  Input,
  Breadcrumb,
  Tabs,
  Typography,
  Upload,
  Badge,
  Tag,
  Select,
  Popconfirm,
  Spin,
} from "antd";
import { jsPDF } from "jspdf";
import { parseCookies } from "nookies";
import validation, { replaceUnderScore } from "@/utils/validation";
import html2canvas from "html2canvas";
import dynamic from "next/dynamic";
import Link from "next/link";
import dayjs from "dayjs";

const { Row, Col, Card, Button, Pagination, Tooltip } = {
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
  Pagination: dynamic(
    () => import("antd").then((module) => module.Pagination),
    { ssr: false }
  ),
  Tooltip: dynamic(() => import("antd").then((module) => module.Tooltip), {
    ssr: false,
  }),
};
const { Search } = Input;
const { Option } = Select;
const Product = () => {
  const [loading, setLoading] = useState(false);
  const cookies = parseCookies();
  const accessToken = cookies.COOKIES_USER_ACCESS_TOKEN;
  const capFirst = (str: any) => {
    return str
      ?.toLowerCase()
      ?.replace(/_/g, " ")
      ?.replace(/\b\w/g, (char: any) => char.toUpperCase());
  };
  const [selectedValue, setSelectedValue] = useState<any>("product");
  console.log(selectedValue, "selectedValue");

  const handleSelectChange = (value: any) => {
    setSelectedValue(value as string);
  };
  const handleDownloadPdf = async () => {
    setLoading(true);

    try {
      // Fetch API data
      const response = await fetch(
        "https://frontend.goaideme.com/get-original-report",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Token: accessToken, // Replace with your token
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      console.log(data, "gdggdg");

      // Create HTML content dynamically
      const container = document.createElement("div");
      container.style.width = "800px";
      container.style.padding = "20px";
      container.style.backgroundColor = "#fff";
      {
        selectedValue === "product" &&
          data.data.productData.forEach((item: any) => {
            const companyDiv = document.createElement("div");
            companyDiv.style.marginBottom = "20px";
            companyDiv.style.borderBottom = "1px solid #ccc";
            companyDiv.style.paddingBottom = "10px";

            const companyName = document.createElement("h2");
            companyName.innerText = `Company Name: ${capFirst(
              item.company_name || "N/A"
            )}`;
            companyDiv.appendChild(companyName);

            const products = document.createElement("p");
            products.innerHTML = `<strong>Products:</strong> ${capFirst(
              item.products || "N/A"
            )}`;
            companyDiv.appendChild(products);

            container.appendChild(companyDiv);
          });
      }

      {
        selectedValue === "technology" &&
          data.data.technologyData.forEach((item: any) => {
            const companyDiv = document.createElement("div");
            companyDiv.style.marginBottom = "20px";
            companyDiv.style.borderBottom = "1px solid #ccc";
            companyDiv.style.paddingBottom = "10px";

            const companyName = document.createElement("h2");
            companyName.innerText = `Company Name: ${capFirst(
              item.company_name || "N/A"
            )}`;
            companyDiv.appendChild(companyName);

            const technology = document.createElement("p");
            technology.innerHTML = `<strong>Technology:</strong> ${capFirst(
              item.technology || "N/A"
            )}`;
            companyDiv.appendChild(technology);

            container.appendChild(companyDiv);
          });
      }
      if (selectedValue === "round") {
        const tittle = document.createElement("h2");
        tittle.innerText = "Round Table Topic";
        tittle.style.textAlign = "center";

        data.data.roundTableTopic.forEach((item: any) => {
          const companyDiv = document.createElement("div");
          companyDiv.style.marginBottom = "20px";
          companyDiv.style.borderBottom = "1px solid #ccc";
          companyDiv.style.paddingBottom = "10px";

          companyDiv.appendChild(tittle);

          const companyName = document.createElement("h2");
          companyName.innerText = `Company Name: ${capFirst(
            item.company_name || "N/A"
          )}`;
          companyDiv.appendChild(companyName);

          const firstName = document.createElement("h3");
          firstName.innerText = `Name: ${capFirst(
            item.firstname || "N/A"
          )}  ${capFirst(item.lastname || "N/A")}`;
          companyDiv.appendChild(firstName);

          const productivity = document.createElement("p");
          productivity.innerHTML = `<strong>Productivity:</strong> ${capFirst(
            item.productivity || "N/A"
          )}`;
          companyDiv.appendChild(productivity);

          const accountability = document.createElement("p");
          accountability.innerHTML = `<strong>Accountability:</strong> ${capFirst(
            item.accountability || "N/A"
          )}`;
          companyDiv.appendChild(accountability);

          const estimating = document.createElement("p");
          estimating.innerHTML = `<strong>Estimating:</strong> ${capFirst(
            item.estimating || "N/A"
          )}`;
          companyDiv.appendChild(estimating);

          // Append the created div to the container
          container.appendChild(companyDiv);
        });
      }

      document.body.appendChild(container);

      // Generate PDF using html2canvas
      const canvas = await html2canvas(container, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Handle multiple pages
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.height;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.height;
      }

      pdf.save(
        selectedValue === "product"
          ? "Product Report.pdf"
          : selectedValue === "round"
          ? "Round Table Report"
          : "Technology Report.pdf"
      );

      // Cleanup
      document.body.removeChild(container);
      message.success(
        selectedValue === "product"
          ? "Product PDF downloaded successfully"
          : selectedValue === "round"
          ? "Round Table PDF downloaded successfully"
          : "Technology PDF downloaded successfully"
      );
      // message.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to download the PDF");
    } finally {
      setLoading(false);
    }
  };

  const getDescriptionText = () => {
    switch (selectedValue) {
      case "product":
        return "Click the button below to download the product data report as a PDF.";
      case "round":
        return "Click the button below to download the round-table topic report as a PDF.";
      case "technology":
        return "Click the button below to download the technology data report as a PDF.";
      default:
        return "Click the button below to download the report as a PDF.";
    }
  };

  const [data, setData] = useState<any>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  console.log(data, "data");

  useEffect(() => {
    const fetchData = async () => {
      const type = "yourType";
      const url = `https://frontend.goaideme.com/technology-product-project-report`;
      // const url = `https://frontend.goaideme.com/round-table-report?type=${type}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Token: `${accessToken}`, // Add the Authorization header
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result: any = await response.json();
        setData(result);
        // setData(JSON.stringify(result, null, 2));
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty array ensures th

  const dataSource =
    data?.data?.length &&
    data?.data.map((res: any, index: number) => {
      // Helper function to truncate text to a max of 15 words
      const truncateText = (text: string, maxWords: number = 15) => {
        const words = text.split(" "); // Split the string into words
        if (words.length > maxWords) {
          return words.slice(0, maxWords).join(" ") + "..."; // Join the first 'maxWords' words and add '...'
        }
        return text;
      };

      return {
        key: index + 1,
        meeting:
          `${validation.capitalizeFirstLetter(
            res?.meeting?.meeting_type
          )} ${dayjs(res?.meeting?.start_meeting_date).format("YYYY")}` ||
          "N/A",
        host_name: capFirst(res?.username) || "N/A",
        products: (
          <Tooltip title={res?.products}>
            {truncateText(capFirst(res?.products) || "N/A", 15)}
          </Tooltip>
        ),
        // project: (
        //   <Tooltip title={res?.project}>
        //     {truncateText(capFirst(res?.project) || "N/A", 5)}
        //   </Tooltip>
        // ),
        // technology: (
        //   <Tooltip title={res?.technology}>
        //     {truncateText(capFirst(res?.technology) || "N/A", 5)}
        //   </Tooltip>
        // ),
        host_city: (
          <Tooltip title={res?.location}>
            {res?.location ? `${res?.location.slice(0, 20)}...` : "N/A"}
          </Tooltip>
        ),
      };
    });
  const baseColumns = [
    {
      title: "Order No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Meeting Name",
      dataIndex: "meeting",
      key: "meeting",
    },
    {
      title: "User Name",
      dataIndex: "host_name",
      key: "host_name",
    },
    // {
    //   title: "Project",
    //   dataIndex: "project",
    //   key: "project",
    // },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
    },
    // {
    //   title: "Technology",
    //   dataIndex: "technology",
    //   key: "technology",
    // },
    // {
    //     title: 'Meeting End Date',
    //     dataIndex: 'end_date',
    //     key: 'end_date',
    // },
    // {
    //     title: 'Meeting End Time',
    //     dataIndex: 'end_time',
    //     key: 'end_time',
    // },
    // {
    //     title: 'Action',
    //     dataIndex: 'action',
    //     key: 'action',
    // }
  ];

  return (
    <>
      <Fragment>
        <section>
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Card className="common-card">
                <div className="mb-4">
                  <Breadcrumb separator=">">
                    <Breadcrumb.Item>
                      <Link
                        className="text-decoration-none"
                        href="/admin/dashboard"
                      >
                        General
                      </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item className="text-decoration-none">
                    Products
                    </Breadcrumb.Item>
                  </Breadcrumb>
                </div>
                {/* title  */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                  <Typography.Title level={3} className="m-0 fw-bold">
                  Products
                  </Typography.Title>
                  <Button
                    type="primary"
                    className="mb-3"
                    onClick={handleDownloadPdf}
                    loading={loading}
                  >
                    Export PDF
                  </Button>
                </div>
                {/* Search  */}
                <div className="my-2 d-flex justify-content-end gap-3">
                  {/* <Search size='large' placeholder="Search by Meeting Name or year" enterButton 
                                    value={searchTerm}
                                        onChange={handleSearch}
                                    /> */}
                  {/* <Button
                    type="primary"
                    className="mb-3"
                    onClick={handleDownloadPdf}
                    loading={loading}
                  >
                    Export PDF
                  </Button> */}
                  {/* {getUserdata?.is_admin == false ? "" :
                                        <div className='d-flex gap-2'>
                                            <Button type="primary" style={{ width: 190 }} htmlType="button" size='large' icon={<PlusOutlined />} onClick={add}>Add Meeting</Button>
                                        </div>
                                    } */}
                </div>
                {/* Tabs  */}
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
                      dataSource={dataSource}
                      columns={baseColumns}
                      pagination={{
                        position: ["bottomCenter"],
                      }}
                    />
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </section>
      </Fragment>
    </>
    // <div style={containerStyle}>
    //   <Card style={cardStyle} bordered>
    //     <h2 style={titleStyle} className="mt-3">Download Company Reports</h2>
    //     <p style={descriptionStyle}>
    //       {/* Click the button below to download the report as a PDF. */}
    //       {getDescriptionText()}
    //     </p>
    //     <Space direction="vertical" size="middle" style={spaceStyle}>
    //       <div className="d-flex justify-content-center gap-2">
    //       <Select
    //         defaultValue="Product Data"
    //         style={{ width: 170 }}
    //         onChange={handleSelectChange}
    //       >
    //         <Option value="product">Product Data</Option>
    //         <Option value="round">Round Table Topic</Option>
    //         <Option value="technology">Technology Data</Option>
    //       </Select>
    //       <Select
    //         defaultValue="Fall 2024"
    //         style={{ width: 170 }}
    //         onChange={handleSelectChange}
    //       >
    //         <Option value="product">Product Data</Option>
    //         <Option value="round">Round Table Topic</Option>
    //         <Option value="technology">Technology Data</Option>
    //       </Select>
    //       </div>
    //       <Button type="primary" className="mb-3" onClick={handleDownloadPdf} loading={loading}>
    //         Download PDF
    //       </Button>
    //     </Space>
    //   </Card>
    // </div>
  );
};

// const containerStyle: React.CSSProperties = {
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   height: "90vh",
//   backgroundColor: "#f0f2f5",
// };

// const cardStyle: React.CSSProperties = {
//   width: 500,
//   textAlign: "center",
//   boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//   transition: "transform 0.3s",
//   borderRadius:"10px"
// };

// const titleStyle: React.CSSProperties = {
//   marginBottom: "16px",
//   fontSize: "20px",
//   fontWeight: "bold",
// };

// const descriptionStyle: React.CSSProperties = {
//   marginBottom: "16px",
//   fontSize: "14px",
//   color: "#595959",
// };

// const spaceStyle: React.CSSProperties = {
//   width: "100%",
// };

export default Product;
