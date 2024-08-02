"use client";
import loginImg from "../../assests/images/nbhaColor.8f7cf6ff.png"
import logo from "../../assests/images/image.png";
import React, { useEffect, useState } from "react";
import { Form, Input } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { parseCookies, setCookie } from "nookies";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getuserData } from "@/lib/features/userSlice";
import { toast } from "react-toastify";
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
  // const handleSuperAdminClick = () => {
  //   setShowPassword((prevShowPassword) => !prevShowPassword); // Toggle showPassword state
  // };

  useEffect(() => {
    const cookies = parseCookies();
    const storedToken = cookies.COOKIES_USER_ACCESS_TOKEN;

    if (storedToken) {
      setToken(storedToken);
      router.push("/admin/dashboard");
    } else {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const idToken = await user.getIdToken();
            setToken(idToken);
            setState(user);
            createSessionCookie(idToken);
          } catch (error: any) {
            if (error.response && error.response.status === 401) {
              router.push("/auth/signin");
            }
            router.push("/auth/signin");
          }
        } else {
          router.push("/auth/signin");
        }
      });

      return () => unsubscribe();
    }
  }, [router]);
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
    setShowPassword((prevShowPassword) => !prevShowPassword); // Toggle showPassword state
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values?.password === "RamDodge2020" ? "nahbcraftsmen@gmail.com" : values?.email,
        values?.password
      );
      setState(userCredential);
      const idTokenResult = await userCredential.user.getIdTokenResult(true);
      const refreshToken = idTokenResult.token;
      const idToken = await userCredential.user.getIdToken();
      setToken(refreshToken);
      console.log(refreshToken, "refreshToken");

      const res = await axios.get("https://frontend.goaideme.com/single-user", {
        headers: {
          Token: `${refreshToken}`,
          "Content-Type": "application/json",
        },
      });
      const responseData: any = res?.data?.data;
      dispatch(getuserData(responseData));

      toast.success("Login successfully");

      createSessionCookie(refreshToken);
      //       setCookie("COOKIES_USER_ACCESS_TOKEN", idToken, {maxAge: 60 * 60 * 24 * 30, // 30 days
      // path: "/",
      //        });
      // setCookie(null, "user_data", responseData, {
      //   maxAge: 60 * 60 * 24 * 30, // 30 days
      //   path: "/",
      // });
      setCookie("COOKIES_USER_ACCESS_TOKEN", refreshToken, 30); // 30 days
      setCookie("user_data", JSON.stringify(responseData), 30); // 30 days
      router?.push("/admin/dashboard");
    } catch (error: any) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className='auth-pages d-flex align-items-center h-100'>

      <div className="container">

        <Row justify="center">
          <Col className="gutter-row d-none d-md-block" xs={0} sm={6} md={12} lg={10} xl={8}>
            <div className='image-wrapper '>
              <img src={loginImg.src} alt="login" style={{ width: "100%" }} />

            </div>
          </Col>

          <Col className="gutter-row" xs={22} sm={18} md={12} lg={10} xl={10}>
            <div className='form-wrapper d-flex justify-content-center align-items-center h-100 bg-white py-5 px-4 px-md-5'>
              <div>
                <div className="logo mb-5">
                  <img src={`${logo.src}`} alt="logo" className='img-fluid' />

                </div>
                {!showPassword &&
                  <div className="logo text-center mb-3">
                    <h3 className="">Super Admin</h3>

                  </div>
                }
                <Form name="normal_login" className="login-form" initialValues={{ remember: false }} onFinish={onFinish} scrollToFirstError>
                  {showPassword &&
                    <Form.Item name="email"  >
                      <Input size={'large'} prefix={<i className="fa-regular fa-envelope"></i>} placeholder="Email" />
                    </Form.Item>}


                  {!showPassword &&
                    <label>
                      Master Password
                    </label>}
                  <Form.Item name="password" rules={[{ message: 'Please enter password' }]} >
                    <Input.Password size={'large'} prefix={<i className="fa-solid fa-lock"></i>} type="password" placeholder="Password" />
                  </Form.Item>
                  {showPassword &&
                    <div className="text-end">
                      <Link href={"/auth/forgot-password"} className="forgotPassword">
                        Forgot your password?
                      </Link>
                    </div>
                  }
                  {/* Button  */}
                  <Button size={'large'} type="primary" htmlType="submit" className="login-form-button w-100" loading={loading} >
                    Log In
                  </Button>
                </Form>
                <Divider plain className="hrdivider"></Divider>
                <div className="d-flex justify-content-center align-items-baseline">

                  <Button onClick={handleSuperAdminClick} className="signBtn">
                    {showPassword ?
                      <span className="mt-2">
                        Login as Super Admin
                      </span> :
                      <span className="mt-2">
                        Login as Admin
                      </span>}
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
