// import Page1 from "@/components/Member/page1";
import React from "react";
import Page1 from "../../../../../components/Member/page1";
import { cookies } from 'next/headers';
const page = async() => {
  const cookiesList = cookies();
  // const userInfoCookie = cookiesList.get('userInfo');
  console.log(cookiesList,"cookiesList");
  const gettoken:any = cookiesList.get('COOKIES_USER_ACCESS_TOKEN');
// console.log(gettoken,"gettoken");

  let data = await fetch('https://frontend.goaideme.com/question-list', {
    method: 'GET', // Method set to GET
    headers: {
      'Cache-Control': 'no-cache',
      'Token': `${gettoken.value}`, // Send the token in the Authorization header
       cache: 'reload'
    }
  });
  // console.log(gettoken,"ggg");
  // Parse the response JSON
  let posts = await data.json();

console.log(posts,"posts");
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
      <Page1 questions={posts} subheadinglist={getsubheadingdata}/>
    </div>
  );
};

export default page;
