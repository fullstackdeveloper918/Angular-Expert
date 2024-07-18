"use client"

import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { Avatar, Badge, Grid, Layout, MenuProps } from 'antd';
import React, { useState, useEffect } from 'react';
// import MenuBar from "@/components/common/MenuBar";
// import Footer from '@/components/common/Footer';
import Link from 'next/link';
import { UsergroupAddOutlined, BellOutlined,} from '@ant-design/icons'
// import { GlobalContext } from '@/context/Provider';
import dynamic from 'next/dynamic';
import MenuBar from '../common/MenuBar';
// import henceforthApi from '@/utils/henceforthApi';
// import s3bucket from '@/utils/s3bucket';

const { Button, Dropdown, Tooltip } = {
    Dropdown: dynamic(() => import("antd").then(module => module.Dropdown), { ssr: false }),
    Tooltip: dynamic(() => import("antd").then(module => module.Tooltip), { ssr: false }),
    Button: dynamic(() => import("antd").then(module => module.Button), { ssr: false }),
}

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }: any) => {
    // const { userInfo, setUserInfo, count, setCount, logout } = React.useContext(GlobalContext)
    const [collapsed, setCollapsed] = useState(false);
    const screens = Grid.useBreakpoint();

    useEffect(() => {
        window.addEventListener("scroll", () => {
            const header: any = document.querySelector('.ant-layout-header');
            if (window.scrollY >= 64) {
                header?.classList.add('sticky-top', 'z-3', 'transition-smooth')
            } else {
                header?.classList.remove('sticky-top', 'z-3', 'transition-smooth')
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth <= 991) {
                setCollapsed(true);
            }
            else {
                setCollapsed(false);
            }
        })

    });

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <Link rel="noopener noreferrer" className="text-decoration-none fw-semibold" href="/profile">
                    Profile
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <Link rel="noopener noreferrer" className="text-decoration-none fw-semibold" href="/profile/password/change">
                    Change Password
                </Link>
            ),
        },
        {
            key: '3',
            label: (
                <button className="reset-all fw-semibold" type='button' >
                    Log Out
                </button>
            ),
        },
    ];

    return (
        <Layout className="layout" hasSider>
            <Sider trigger={null} collapsible collapsed={collapsed} theme="light" width={'250px'} breakpoint="lg" collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }} onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
                style={{
                    overflow: 'auto',
                    height: screens.lg ? '100vh' : '100%',
                    position: 'fixed',
                    background: '#ffffff',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: screens.lg ? 1 : 9
                }}
            >

                <MenuBar />
            </Sider>
            <Layout className="site-layout" style={{ marginLeft: screens.lg ? collapsed ? '0px' : '250px' : '0', transition: "all 0.3s ease-in-out" }}>
                {/* Header  */}
                <Header className="site-layout-background d-flex justify-content-between align-items-center px-4 py-3" >
                    <div>
                        {screens.md ?
                            <> {React.createElement(collapsed ? CloseOutlined : MenuOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            })}</>
                            :
                            <> {React.createElement(MenuOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            })}
                            </>
                        }
                    </div>
                    <div className='d-inline-flex align-items-center'>
                        {/* <Link href="/notification/page/1" className="text-decoration-none">
                            <Button type="default" size={'large'} className="border-0 shadow-none bg-transparent py-0" htmlType='button'>
                                <Tooltip title="Notification">
                                    <Badge count={"3"} size='default'>
                                        <BellOutlined style={{ fontSize: "24px" }} />
                                    </Badge>
                                </Tooltip>
                            </Button>
                        </Link> */}
                        <Link href="/staff/page/1?limit=10" className="text-decoration-none">
                            <Tooltip title="Admin">
                                <Button className='border-0 shadow-none bg-transparent py-0' size={'large'}>
                                    <UsergroupAddOutlined style={{ fontSize: "24px" }} />
                                </Button>
                            </Tooltip>
                        </Link>
                        <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight" arrow>
                            <Button className='shadow-none py-0 border-0 bg-transparent' style={{ height: 'unset' }} htmlType='button'>
                                {/* {userInfo?.profile_pic ? <img src={s3bucket.getUrl(userInfo?.profile_pic)} alt="img" className='profile-img ' /> : <Avatar size={40}>A</Avatar>} */}
                            </Button>
                        </Dropdown>
                    </div>
                </Header>
                {/* Content  */}
                <Content className="m-4">
                    {children}
                </Content>
                {/* Footer  */}
                {/* <Footer /> */}
            </Layout>
        </Layout >
    )
}

export default MainLayout;