"use client";
import loginImg from "../../assests/images/nbhaColor.8f7cf6ff.png";
import logo from "../../assests/images/image.png";
import React, { useEffect, useState } from "react";
import { Form, Input } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  getAuth,
} from "firebase/auth";
import { destroyCookie } from 'nookies';
// import { auth } from "@/utils/firebase";
import { parseCookies, setCookie } from "nookies";
import axios from "axios";
import { useDispatch } from "react-redux";
// import { getuserData } from "@/lib/features/userSlice";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { auth } from "../../utils/firebase";
import { getuserData } from "../../lib/features/userSlice";
// import firebase from "firebase/app";
// import "firebase/auth";
const { Row, Col, Button, Divider } = {
  Row: dynamic(() => import("antd").then((module) => module.Row), {
    ssr: false,
  }),
  Col: dynamic(() => import("antd").then((module) => module.Col), {
    ssr: false,
  }),
  Button: dynamic(() => import("antd").then((module) => module.Button), {
    ssr: false,
  }),
  Divider: dynamic(() => import("antd").then((module) => module.Divider), {
    ssr: false,
  }),
};

const Sigin = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = React.useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  const createSessionCookie = (idToken: string) => {
    try {
      setCookie("COOKIES_USER_ACCESS_TOKEN", idToken, 30); // 30 days
    } catch (error) {
      console.error("Failed to create session cookie", error);
    }
  };

  const handleSuperAdminClick = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };


  const refreshToken = async (auth:any) => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Force refresh the token
        const token = await user.getIdToken(true);
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  };
 
const createCustomToken = async (auth:any, checkUid:any) => {
  try {
      // Set expiration time to 1 minute (60 seconds)
      const token = await auth.createCustomToken(checkUid, { expiresIn: 60 });
      return token;
  } catch (error) {
      console.error('Error creating custom token:', error);
      return null;
  }
};
    useEffect(() => {
      
      const refreshInterval = 60 * 60 * 1000 - 5 * 60 * 1000; // Refresh 5 minutes before token expiry (55 minutes)
      const intervalId = setInterval(async () => {
        const token = await refreshToken(auth);
        if (token) {
          // Store the refreshed token
          localStorage.setItem('firebaseToken', token);
        }
      }, refreshInterval);
      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

 

 
  const onFinish = async (values: any) => {
    const auth:any = getAuth();


    try {
      setLoading(true);
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values?.password === "RamDodge2020"
          ? "nahbcraftsmen@gmail.com"
          : values?.email.trim().toLowerCase(),
        values?.password
      );
      
      const check= auth.currentUser
      const checkUid:any = check.uid;
      console.log(checkUid,"checkUid");
      
      // Get the ID token and set custom expiration time
      const idToken = await userCredential.user.getIdToken(true);
      const res = await axios.get("https://frontend.goaideme.com/single-user", {
        headers: {
          Token: idToken,
          "Content-Type": "application/json",
        },
      });
      const responseData = res?.data?.data;
      console.log(responseData, 'responsedata')
      dispatch(getuserData(responseData));
      // router?.push("/admin/dashboard");
      createSessionCookie(idToken);
      localStorage.setItem("AuthToken",idToken)
      // setCookie("Auth", JSON.stringify(auth.currentUser), 30);
      // if (responseData?.status === 200) {
        // Login successful
        const redirectPath = localStorage.getItem('redirectAfterLogin') || '/admin/dashboard';
        console.log(redirectPath,"redirectPath");
        
        router.push('/admin/dashboard');
        // router.push(redirectPath);
        // Clear the stored URL path from local storage
        localStorage.removeItem('redirectAfterLogin');
        
const pathname=redirectPath?redirectPath:"/admin/dashboard"
        // Redirect to the original path or default to admin/dashboard
    // } 
      const customToken = await createCustomToken(auth, checkUid);
      // Schedule token refresh
      refreshToken(auth);
    } catch (error) {
      toast.error("Invalid Credentials");
      setLoading(false);
    }
  };



  // const hasReloaded:any = localStorage.getItem('hasReloaded')/;
  // useEffect(() => {
  //   // Retrieve `hasReloaded` from localStorage
  //   const hasReloaded = localStorage.getItem('hasReloaded');
  //   console.log(hasReloaded, "hasReloaded");

  //   if (!hasReloaded) {
  //     //   // if (!hasReloaded && state1?.status === '400') {
  //       localStorage.setItem('hasReloaded', 'true');
  //       window.location.reload();
  //     } 
  // }, []); //


  // useEffect(() => {
  //   const hasReloaded = localStorage.getItem('hasReloaded');
  //   if (!hasReloaded) {
  //   //   // if (!hasReloaded && state1?.status === '400') {
  //     localStorage.setItem('hasReloaded', 'true');
  //     window.location.reload();
  //   } else {
  //     userlist();
  //   }
  // // }, []);
  // }, [state1?.status==500]);



  return (
    <section className="auth-pages d-flex align-items-center h-100 loginAuth">
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="container">
        <Row justify="center">
          <Col
            className="gutter-row d-none d-md-block"
            xs={0}
            sm={6}
            md={12}
            lg={10}
            xl={8}
          >
            <div className="image-wrapper ">
              <img src={loginImg.src} alt="login" style={{ width: "100%" }} />
            </div>
          </Col>

          <Col className="gutter-row" xs={22} sm={18} md={12} lg={10} xl={10}>
            <div className="form-wrapper d-flex justify-content-center align-items-center h-100 bg-white py-5 px-4 px-md-5">
              <div>
                <div className="logo mb-5">
                  <img src={`${logo.src}`} alt="logo" className="img-fluid" />
                </div>
                {!showPassword && (
                  <div className="logo text-center mb-3">
                    <h3 className="">Super Admin</h3>
                  </div>
                )}
                <Form
                  name="normal_login"
                  className="login-form"
                  initialValues={{ remember: false }}
                  onFinish={onFinish}
                  scrollToFirstError
                >
                  {showPassword && (
                    <Form.Item name="email">
                      <Input
                        size={"large"}
                        prefix={<i className="fa-regular fa-envelope"></i>}
                        placeholder="Email"
                      />
                    </Form.Item>
                  )}

                  {!showPassword && <label>Master Password</label>}
                  <Form.Item
                    name="password"
                    rules={[{ message: "Please enter password" }]}
                  >
                    <Input.Password
                      size={"large"}
                      prefix={<i className="fa-solid fa-lock"></i>}
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Item>
                  {showPassword && (
                    <div className="text-end">
                      <Link
                        href={"/auth/forgot-password"}
                        className="forgotPassword"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  )}
                  {/* Button  */}
                  <Button
                    size={"large"}
                    type="primary"
                    htmlType="submit"
                    className="login-form-button w-100"
                    loading={loading}
                  >
                    Log In
                  </Button>
                </Form>
                <Divider plain className="hrdivider"></Divider>
                <div className="d-flex justify-content-center align-items-baseline">
                  <Button onClick={handleSuperAdminClick} className="signBtn">
                    {showPassword ? (
                      <span className="mt-2">Login as Super Admin</span>
                    ) : (
                      <span className="mt-2">Login as Admin</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Sigin;