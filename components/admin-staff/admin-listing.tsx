"use client"
import type { NextPage } from 'next'
import React, { Fragment, ReactNode } from 'react'
import { Table, Input, Breadcrumb, Space, Tag, Typography, Popconfirm } from 'antd';
import Link from 'next/link';
import { PlusOutlined } from '@ant-design/icons'
import dynamic from 'next/dynamic';
import EmployeeRoles from '@/utils/EmployeeRoles.json'
import MainLayout from '../Layout/layout';
import api from '@/utils/api';

const { Row, Col, Card, Button, Pagination, Tooltip } = {
    Button: dynamic(() => import("antd").then(module => module.Button), { ssr: false }),
    Row: dynamic(() => import("antd").then(module => module.Row), { ssr: false }),
    Col: dynamic(() => import("antd").then(module => module.Col), { ssr: false }),
    Card: dynamic(() => import("antd").then(module => module.Card), { ssr: false }),
    Pagination: dynamic(() => import("antd").then(module => module.Pagination), { ssr: false }),
    Tooltip: dynamic(() => import("antd").then(module => module.Tooltip), { ssr: false }),
}
let timer: any
const { Search } = Input;

type Page<P = {}> = NextPage<P> & {
    getLayout?: (page: ReactNode) => ReactNode;
};

const Admin: Page = () => {
    const [loading, setLoading] = React.useState(false)
    const [state, setState] = React.useState<any>([])
    const onSearch = (value: string) => {
  
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
        }, 1000);
    }

 
    const initialise = async () => {
        try {
            setLoading(true)
          
            let res = await api.Admin.listing()
            setState(res)
        } catch (error) {
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        initialise()
    }, [])
    const archive = async (id:any) => {
        const item = {
          admin_uuid: id,
        }
        try {
          let res = await api.Admin.delete(item as any)
          initialise()
        //   setAreas
        } catch (error) {
    
        }
      }
    const columns = [
        {
            title: 'Sr. No',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Admin Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Permissions',
            dataIndex: 'permission',
            key: 'Permission',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
    ];
    const dataSource = state?.map((res: any, index: number) => {
        return {
              key: index + 1,
            name: <div className='user-detail d-inline-flex gap-2 align-items-center' key={res._id}>
                <Typography.Text className='text-capitalize'>{res.firstname ? `${res.firstname} ${res.lastname}` : 'N/A'}</Typography.Text></div>,
            email: res.email ? res.email?.length >= 20 ? `${res.email.slice(0, 20)}...` : res.email : 'N/A',
            permission: <Space size={[0, 'small']} wrap>
                {
                    Array.isArray(res.permission) && res.permission.length > 0 &&
                    res.permission?.map((resRole: any, index: number) =>
                        <Tag key={index + 1} >
                            {(EmployeeRoles.find((resJson) => resJson.rol === resRole))?.name}
                        </Tag>
                        )
                }
            </Space>,
            action: <ul className='list-unstyled mb-0 gap-3 d-flex'>
            <li>
                <Link href={`/admin/admin-staff/${res?.id}/edit`} >
                    <Button type="text" className='px-0 border-0 bg-transparent shadow-none'><i className="fa-solid fa-pen-to-square"></i></Button>
                </Link>
            </li>
            <li>
                <Popconfirm
                    title="Delete"
                    description="Are you sure you want to delete ?"
                    onConfirm={(event:any) => {archive(res?.id)}}
                >
                    <Button type="text" danger htmlType='button' className='px-0' ><i className="fa-solid fa-trash-can"></i></Button>
                </Popconfirm>
            </li>
        </ul>
        }
    }
    );

   

    return (
        <MainLayout>
            <Fragment>

                <section>
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <Card className='common-card'>
                                <div className='mb-4'>
                                    <Breadcrumb separator=">">
                                        <Breadcrumb.Item><Link href="/admin/dashboard" className='text-decoration-none'>Home</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item className='text-decoration-none'>Admin</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                                {/* title  */}
                                <div className='d-lg-flex justify-content-between align-items-center'>
                                    <Typography.Title level={3} className='m-0 mb-3 mb-md-0 fw-bold'>Admin</Typography.Title>
                                    <div className='d-flex align-items-lg-stretch gap-3 overflow-auto flex-nowrap'>
                                        <Link href='/admin/admin-staff/add'><Button type="primary" size='large' icon={<PlusOutlined />} >Add Admin</Button></Link>
                                    </div>
                                </div>
                                {/* Search  */}
                                <div className='my-4 d-flex gap-4 align-items-center'>
                                    <Search size="large" placeholder="Search..." onSearch={onSearch} onChange={(e) => onSearch(e.target.value)} enterButton />
                                

                                </div>
                                {/* Table  */}
                                <div className='tabs-wrapper'>
                                    <Table dataSource={dataSource} columns={columns} pagination={false} scroll={{ x: '100%' }} className="w-100" />
                                </div>
                                {/* Pagination  */}
                                <Row justify={'center'} className="mt-4">
                                    <Col span={24}>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    
                </section>
            </Fragment>
        </MainLayout>
    )
}

export default Admin
