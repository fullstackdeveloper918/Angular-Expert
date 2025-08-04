import React from "react";
import UserList from "../../../components/Meeting/userlist";
import { cookies } from "next/headers";

const page = async() => {

const cookiesList = cookies();
  // const userInfoCookie = cookiesList.get('userInfo');
  const gettoken:any = cookiesList.get('COOKIES_USER_ACCESS_TOKEN');
console.log(gettoken,"gettoken");

  let getsubheading = await fetch('https://frontend.goaideme.com/list-section-sub-heading', {
    method: 'GET', // Method set to GET
    headers: {
      'Cache-Control': 'no-cache',
      'Token': `${gettoken.value}`, // Send the token in the Authorization header
       cache: 'reload'
    }
  });
  // console.log(gettoken,"ggg");
  // Parse the response JSON
  let getsubheadingdata = await getsubheading.json();

console.log(getsubheadingdata,"getsubheadingdata");
  return (
    <div>
      <UserList subheadinglist={getsubheadingdata}/>
    </div>
  );
};

export default page;
