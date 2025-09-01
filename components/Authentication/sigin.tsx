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
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { auth } from "../../utils/firebase";
import { getuserData } from "../../lib/features/userSlice";
import api from "@/utils/api";
import { notification } from "antd";

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
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  const createSessionCookie = (idToken: string) => {
    try {
      setCookie("COOKIES_USER_ACCESS_TOKEN", idToken, 30); // 30 days
    } catch (error) {
    }
  };

  const handleSuperAdminClick = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

const refreshTokenAndSchedule = async (auth: any) => {
  try {
    const check = auth.currentUser;
    if (check) {
      const uid = check.uid;

      const currentTime = Date.now();
      const expirationTime = parseInt(localStorage.getItem("loginExpiryTime") || "0");

      if (expirationTime > currentTime) {
        const newIdToken = await check.getIdToken(true);

        const newExpirationTime = Date.now() + 1 * 60 * 1000;
        localStorage.setItem("loginExpiryTime", newExpirationTime.toString());
        setToken(newIdToken);
        createSessionCookie(newIdToken);
        setCookie("expirationTime", newExpirationTime.toString(), 30);
      }
    }
  } catch (error: any) {
  }
};

useEffect(() => {
  const xyz = onAuthStateChanged(auth, (user) => {
    if (user) {
      
      refreshTokenAndSchedule(auth);
    }
  });
  return () => xyz();
}, [auth]);


useEffect(() => {
  const intervalId = setInterval(async () => {
    refreshTokenAndSchedule(auth);
  }, 60 * 1000); 
  return () => clearInterval(intervalId); 
}, [auth]);

const scheduleTokenRefresh = (auth: any) => {
  refreshTokenAndSchedule(auth);
 
};
 
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
      // const checkUid:any = check.uid;
      const idToken = await userCredential.user.getIdToken(true);
      const res = await axios.get("https://frontend.goaideme.com/single-user", {
        headers: {
          Token: idToken,
          "Content-Type": "application/json",
        },
      });
      const responseData = res?.data?.data;

      dispatch(getuserData(responseData));
      // router?.push("/admin/dashboard");
      createSessionCookie(idToken);
      api.setToken(idToken)
      const loginTime = new Date().getTime(); 
      const expiryTime = loginTime + 1 * 60 * 1000; 
      localStorage.setItem("loginExpiryTime", expiryTime.toString());
      localStorage.setItem("AuthToken",idToken)
      setCookie("Auth", JSON.stringify(auth.currentUser), 30);
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/admin/dashboard';
      
      router.push('/admin/dashboard');
      // router.push(redirectPath);
      localStorage.removeItem('redirectAfterLogin');
      notification.open({
      message: <div style={{ color: '#dc2626', fontWeight: 600 }}>Reminder</div>,
      description: (
        <div>
          Please download your PDFs — for both completed and incomplete users, if the Round Table Topic is missing,
          kindly fill it in and save again; if it’s already shown, you may ignore.
        </div>
      ),
      duration: 0,
      placement: "top",
      className: "left-1/2 -translate-x-1/2 top-20 absolute m-0",
    });



        
    const pathname=redirectPath?redirectPath:"/admin/dashboard"
          scheduleTokenRefresh(auth);
        } catch (error) {
          toast.error("Invalid Credentials");
          setLoading(false);
        }
      };




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
                        <span className="">
                        Forgot your password?
                        </span>
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
                      <span className="mt-2">Login as User</span>
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