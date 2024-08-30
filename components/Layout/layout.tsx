"use client";

import { MenuOutlined, CloseOutlined, LogoutOutlined } from "@ant-design/icons";
import { Grid, Layout, MenuProps, Popconfirm } from "antd";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UsergroupAddOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { clearUserData } from "../../lib/features/userSlice";
import MenuBar from "../../components/common/MenuBar";
import { parseCookies, destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {  signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
// import { auth } from "@/utils/firebase";
import {
  onAuthStateChanged,
} from "firebase/auth";
import api from "@/utils/api";
const { Button, Dropdown, Tooltip } = {
  Dropdown: dynamic(() => import("antd").then((module) => module.Dropdown), {
    ssr: false,
  }),
  Tooltip: dynamic(() => import("antd").then((module) => module.Tooltip), {
    ssr: false,
  }),
  Button: dynamic(() => import("antd").then((module) => module.Button), {
    ssr: false,
  }),
};

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }: any) => {
  const [collapsed, setCollapsed] = useState(false);
  const screens = Grid.useBreakpoint();
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    const scroll=() => {
      const header: any = document.querySelector(".ant-layout-header");
      if (window.scrollY >= 64) {
        header?.classList.add("sticky-top", "z-3", "transition-smooth");
      } else {
        header?.classList.remove("sticky-top", "z-3", "transition-smooth");
      }
    }
    const resize=() => {
      if (window.innerWidth <= 991) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    }
    window.addEventListener("scroll", scroll);  
    window.addEventListener("resize", resize);
    return()=>{
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", resize);  
    }
  },[]);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link
          rel="noopener noreferrer"
          className="text-decoration-none fw-semibold"
          href="/profile"
        >
          Profile
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link
          rel="noopener noreferrer"
          className="text-decoration-none fw-semibold"
          href="/profile/password/change"
        >
          Change Password
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <button className="reset-all fw-semibold" type="button">
          Log Out
        </button>
      ),
    },
  ];
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const getUserdata = useSelector((state: any) => state?.user?.userData);
  useEffect(() => {
    const intervalId = setInterval(async () => {
      refreshTokenAndSchedule(auth);
    }, 60 * 1000); 
    return () => clearInterval(intervalId); 
  }, [getUserdata]);
  
  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies["COOKIES_USER_ACCESS_TOKEN"];
    setAccessToken(token);
  }, []);
  useEffect(() => {
    const checkPathname = () => {
      const pathname = window.location.pathname;
    
      localStorage.setItem("Pathname", pathname);
    };
    const intervalId = setInterval(checkPathname, 1000);
    return () => clearInterval(intervalId);
  }, []);
  
  const [loading, setLoading] = useState(false)
  const handleLogout = async () => {
    try {
      setLoading(true)
      await signOut(auth)
      localStorage.removeItem('redirectAfterLogin');
         destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
         localStorage.removeItem('hasReloaded');
         dispatch(clearUserData({}));
         toast.success("Logout Successful", {
         position: "top-center",
         autoClose: 300,
         onClose: () => {
         },
       });
       router.push("/auth/signin");
      
    } catch (error) {
      setLoading(false)
    }
  };
  const setCookie = (name: string, value: string, days?: number) => {
    const expires = new Date();
    if(days){
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    }
    document.cookie = `${name}=${value};${days?`expires=${expires.toUTCString()};`:''}path=/`;
  };

  const createSessionCookie = (idToken: string) => {
    try {
      setCookie("COOKIES_USER_ACCESS_TOKEN", idToken, 30); // 30 days
    } catch (error) {
    }
  };
  const refreshTokenAndSchedule = async (auth: any) => {
    try {
      const check = auth.currentUser;
      if (check) {
        const uid = check.uid;
  
        const expirationTime = parseInt(localStorage.getItem("loginExpiryTime") || "0");
        const currentTime = Date.now();
  
        if (expirationTime < currentTime) {
          const newIdToken = await check.getIdToken(true);
          const newExpirationTime = Date.now() + 1 * 60 * 1000;
          localStorage.setItem("loginExpiryTime", newExpirationTime.toString());
          createSessionCookie(newIdToken);
          setCookie("expirationTime", newExpirationTime.toString());
          api.setToken(newIdToken)
          // setTimeout(() => refreshTokenAndSchedule(auth), 1 * 60 * 1000); 
        }
      }
    } catch (error: any) {
    }
  };
  
  return (
    <>
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
      <Layout className="layout" hasSider>
       {!collapsed && <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          theme="light"
          width={"250px"}
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
          }}
          onCollapse={(collapsed, type) => {
          }}
          style={{
            overflow: "auto",
            height: screens.lg ? "100vh" : "100%",
            position: "fixed",
            background: "#ffffff",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: screens.lg ? 1 : 9,
          }}
        >
           <MenuBar collapsed={collapsed} setCollapsed={setCollapsed}/>
        </Sider>}
        <Layout
          className="site-layout"
          style={{
            marginLeft: screens.lg ? (collapsed ? "0px" : "250px") : "0",
            transition: "all 0.3s ease-in-out",
          }}
        >
          {/* Header  */}
          <Header className="site-layout-background d-flex justify-content-between align-items-center px-4 py-3">
            <div>
              {screens.md ? (
                <>
                  {" "}
                  {React.createElement(
                    collapsed ? CloseOutlined : MenuOutlined,
                    {
                      className: "trigger",
                      onClick: () => setCollapsed(!collapsed),
                    }
                  )}
                </>
              ) : (
                <>
                  {" "}
                  {React.createElement(MenuOutlined, {
                    className: "trigger",
                    onClick: () => setCollapsed(!collapsed),
                  })}
                </>
              )}
            </div>
            <div className="d-inline-flex gap-3 align-items-center">
              {getUserdata?.is_admin === true && !getUserdata?.permission ? (
                <Link
                  href="/admin/admin-staff"
                  className="text-decoration-none"
                >
                  <Tooltip title="Admin">
                    <Button
                      className="border-0 shadow-none bg-transparent py-0 mt-3"
                      size={"large"}
                    >
                      <UsergroupAddOutlined style={{ fontSize: "24px" }} />
                    </Button>
                  </Tooltip>
                </Link>
              ) : (
                ""
              )}

              <Popconfirm
                title="Logout"
                onConfirm={handleLogout}
                description="Are you sure to Logout ?"
                okText="Logout"
                cancelText="No"
                style={{margin:'0'}}
                okButtonProps={{ type: "primary", danger: true }}
              >
                <Button
                  size={"large"}
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  className="login-form-button "
                >
                  <LogoutOutlined style={{ fontSize: "18px" }} />
                  Logout
                </Button>
              </Popconfirm>
            </div>
          </Header>

          <Content className="m-4">{children}</Content>
        </Layout>
      </Layout>
    </>
  );
};

export default MainLayout;
