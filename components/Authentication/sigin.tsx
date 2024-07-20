"use client";
// import loginImg from "../../../assests/images/nahb.png";
import loginImg from "../../assests/images/nbhaColor.8f7cf6ff.png"
import logo from "../../assests/images/image.png";
import React, { useEffect, useState } from "react";
import { Form, Input } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { setCookie } from "nookies";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getuserData } from "@/lib/features/userSlice";
import { toast, ToastContainer } from "react-toastify";
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
interface User {
  accessToken: string;
}
const Sigin = () => {
  const router = useRouter()
    const dispatch = useDispatch()
    // const { loading, setLoading, Toast, setUserInfo } = React.useContext(GlobalContext)
    const [rememberMe, setRememberMe] = React.useState<any>(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [state, setState] = useState<any>("")
    const [state1, setState1] = useState<any>("")
    const [loading, setLoading] = useState<any>(false)
    const [showPassword, setShowPassword] = useState(true);
    const handleSuperAdminClick = () => {
        setShowPassword(prevShowPassword => !prevShowPassword); // Toggle showPassword state
    };
    useEffect(() => {
        // Monitor auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const idToken = await user.getIdToken();
                    console.log('try block me hu me bawa')
                    setToken(idToken);
                    setState(user);
                    setCookie(null, "COOKIES_USER_ACCESS_TOKEN", idToken, {
                        path: "/",
                    });
                } catch (error: any) {
                    console.error("Error getting ID token: ", error);
                    if (error.response && error.response.status === 401) {
                        router.push('/auth/signin');
                    }
                    router.push('/auth/signin');
                }
            } else {
              
                router.push('/auth/signin');
            }
        });

       
        return () => unsubscribe();
    }, [rememberMe, router]);
    const onFinish = async (values: any) => {
        if (values?.email === "nahbcraftsmen@gmail.com")
            console.log(values?.email, "email");
        console.log(values?.password, "pass");

    

        try {
            setLoading(true)
          
            const userCredential = await signInWithEmailAndPassword(auth,values?.password ==="RamDodge2020" ? "nahbcraftsmen@gmail.com" : values?.email, values?.password );
            setState(userCredential)
            // const Token= await userCredential.user
            const idToken = await userCredential.user.getIdToken();
            setToken(idToken);
            console.log(idToken, "jkjkhkh");

            const res = await axios.get("https://frontend.goaideme.com/single-user", {
                headers: {
                    Token: `${idToken}`,
                    'Content-Type': 'application/json',
                }
            });
            const responseData: any = res?.data?.data;
            // localStorage.setItem('user_data', JSON.stringify(responseData));
            dispatch(getuserData(responseData))
            console.log('Response:', responseData);

            // const encodedResponseData = encodeURIComponent(JSON.stringify(responseData));
            console.log(res, "ereree");
            // Toast.success("Login successfully")
            if (rememberMe) {
                setCookie(this, "COOKIES_USER_ACCESS_TOKEN", idToken, {
                    maxAge: 60 * 60 * 24 * 30,
                    path: "/",
                });
                setCookie(this, "user_data", responseData, {
                    maxAge: 60 * 60 * 24 * 30,
                    path: "/",
                });
            } else {
                setCookie(this, "COOKIES_USER_ACCESS_TOKEN", idToken, {
                    path: "/",
                });
                setCookie(this, "user_data", responseData, {
                    maxAge: 60 * 60 * 24 * 30,
                    path: "/",
                });
            }
            router?.replace('/admin/dashboard')
            console.log(state1, "state1");

       
        } catch (error: any) {
            if(error?.errors?.length){
                toast.error('Invalid Login Credentials', {
                    position: 'top-center',
                    autoClose: 300,
                });
            }
            router.push('/auth/signin');
            // Toast.error(error)
            // setLoading(false)
        } finally {
            setLoading(false)
        }
    };

  return (
    <section className='auth-pages d-flex align-items-center h-100'>
             <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            <div className="container">
                {/* <div>
                    <h1>Login</h1>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <button onClick={handleLogin}>Login</button>
                    {error && <p>Error: {error}</p>}
                </div> */}
                <Row justify="center">
                    <Col className="gutter-row d-none d-md-block" xs={0} sm={6} md={12} lg={10} xl={8}>
                        <div className='image-wrapper '>
                            <img src={loginImg.src} alt="login" style={{ width: "100%" }} />

                        </div>
                    </Col>
                    <Col className="gutter-row" xs={22} sm={18} md={12} lg={10} xl={10}>
                        <div className='form-wrapper d-flex justify-content-center align-items-center h-100 bg-white py-5 px-4 px-md-5'>
                            <div>
                                {/* <div className='logo-wrapper text-center mb-5'>
                                </div> */}
                                {/* <img src={logo.src} alt="login" /> */}
                                {/* <h1 className="">DCB</h1> */}
                                <div className="logo mb-5">
                                    <img src={`${logo.src}`} alt="logo" className='img-fluid' />

                                </div>
                                {!showPassword &&
                                    <div className="logo text-center mb-3">
                                        <h3 className="">Super Admin</h3>

                                    </div>
                                }


                                <Form name="normal_login" className="login-form" initialValues={{ remember: false }} onFinish={onFinish} scrollToFirstError>
                                    {showPassword&&
                                    <Form.Item name="email"  >
                                        {/* <label className=" labelSignup">Email</label> */}
                                        <Input size={'large'} prefix={<i className="fa-regular fa-envelope"></i>} placeholder="Email" />
                                    </Form.Item>}
                                    
                                        
                                    {!showPassword&&
                                            <label>
                                            Master Password
                                            </label>}
                                            <Form.Item name="password" rules={[{ message: 'Please enter password' }]} >
                                                {/* <label className="labelSignup">Password</label> */}
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
                                    {/* <Link href={"/auth/signup"}> */}

                                    {/* <Button  htmlType="submit" className="signBtn" >
                                            Sign Up
                                        </Button> */}
                                    {/* </Link> */}
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
