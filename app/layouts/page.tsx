import Pdf from "@/components/common/Pdf";
import MainLayout from "@/components/Layout/layout";
import React from "react";

const page = () => {
  return (
    <div>
      <MainLayout />
      <Pdf/>
    </div>
  );
};

export default page;
