"use client";
import React, { useState } from "react";
import { Button, Card, Select, Space, message } from "antd";
import { jsPDF } from "jspdf";
import { parseCookies } from "nookies";
import { replaceUnderScore } from "@/utils/validation";
import html2canvas from "html2canvas";
const { Option } = Select;
const Export = () => {
  const [loading, setLoading] = useState(false);
  const cookies = parseCookies();
  const accessToken = cookies.COOKIES_USER_ACCESS_TOKEN;
  const capFirst = (str: string) => {
    return str
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
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
      {
        selectedValue === "round" &&
          data.data.roundTableTopic.forEach((item: any) => {
            const companyDiv = document.createElement("div");
            companyDiv.style.marginBottom = "20px";
            companyDiv.style.borderBottom = "1px solid #ccc";
            companyDiv.style.paddingBottom = "10px";

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
  return (
    <div style={containerStyle}>
      <Card style={cardStyle} bordered>
        <h2 style={titleStyle} className="mt-3">Download Company Reports</h2>
        <p style={descriptionStyle}>
          {/* Click the button below to download the report as a PDF. */}
          {getDescriptionText()}
        </p>
        <Space direction="vertical" size="middle" style={spaceStyle}>
          <Select
            defaultValue="Product Data"
            style={{ width: 200 }}
            onChange={handleSelectChange}
          >
            <Option value="product">Product Data</Option>
            <Option value="round">Round-Table-Topic</Option>
            <Option value="technology">Technology Data</Option>
          </Select>
          <Button type="primary" className="mb-3" onClick={handleDownloadPdf} loading={loading}>
            Download PDF
          </Button>
        </Space>
      </Card>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "90vh",
  backgroundColor: "#f0f2f5",
};

const cardStyle: React.CSSProperties = {
  width: 500,
  textAlign: "center",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  transition: "transform 0.3s",
  borderRadius:"10px"
};

const titleStyle: React.CSSProperties = {
  marginBottom: "16px",
  fontSize: "20px",
  fontWeight: "bold",
};

const descriptionStyle: React.CSSProperties = {
  marginBottom: "16px",
  fontSize: "14px",
  color: "#595959",
};

const spaceStyle: React.CSSProperties = {
  width: "100%",
};

export default Export;
