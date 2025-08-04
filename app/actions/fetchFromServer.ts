"use server";  // This directive indicates this function is meant for server-side use

import { parseCookies } from 'nookies';

export async function fetchFromServer(api: any, ctx: any): Promise<any> {
  // Destructure API params
  const { url, method, body = null } = api;

  // Parse cookies from the context (assuming this is a server-side function)
  const cookies = parseCookies(ctx);

  // Retrieve the auth token from cookies
  const authToken = cookies.COOKIES_USER_ACCESS_TOKEN;

  // Log for debugging
  // console.log(authToken, "authToken");

  // Prepare the headers for the request
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // If the auth token exists, add it to the headers
  // if (authToken) {
  //   headers['token'] = `${authToken}`;
  // } else {
  //   console.warn("No authToken found in cookies.");
  // }

  // Set up the request options
  const options: RequestInit = {
    method,
    headers,
    cache: 'no-store', // Disable caching for sensitive requests
  };

  // If the body is provided, add it to the request
  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    // Make the fetch request
    const res = await fetch(url, options);

    // Check if the response is not OK (status is not in 200-299 range)
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }

    // Parse and return the response JSON data
    const data = await res.json();
    return data;
  } catch (error) {
    // Log and throw error for further handling
    console.error("Fetch Error:", error);
    throw error;
  }
}
