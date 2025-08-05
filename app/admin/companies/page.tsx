import React from "react";
import UserList from "../../../components/Meeting/userlist";
import { cookies } from "next/headers";
import Companies from "@/components/Meeting/companies";

const page = async() => {


  return (
    <div>
      <Companies/>
    </div>
  );
};

export default page;
