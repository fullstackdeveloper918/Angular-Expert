import React, { Fragment, ReactNode, useEffect } from "react";
import MainLayout from "../../components/Layout/layout";
import { parseCookies } from "nookies";
import NextTopLoader from "nextjs-toploader";

const AdminLayout = ({children}:{children:ReactNode}) => {
  
  return (
    <Fragment>
     
      <MainLayout>
      {children}
      </MainLayout>
    </Fragment>
  );
};

export default AdminLayout;
