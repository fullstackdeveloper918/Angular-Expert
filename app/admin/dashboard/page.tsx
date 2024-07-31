import AdminDashboard from "@/components/AdminDashboard/listing";
import api from "@/utils/api";
import axios from "axios";
import React from "react";

const page = async() => {
  return (
    <div>
      <AdminDashboard />
    </div>
  );
};

export default page;
