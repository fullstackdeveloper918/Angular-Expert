"use client"
import type { GetServerSideProps, NextPage } from 'next'
import React, { Fragment, ReactNode } from 'react'
import { Table, Input, Breadcrumb, Space, Tag, Typography, Avatar, Dropdown, Select, Popconfirm } from 'antd';
import Link from 'next/link';
import { PlusOutlined, EyeFilled, DownloadOutlined, DownOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import EmployeeRoles from '@/utils/EmployeeRoles.json'
import type { MenuProps } from 'antd';
import MainLayout from '@/app/layouts/page';
import { ApiError } from 'next/dist/server/api-utils';
import api from '@/utils/api';
import { permission } from 'process';

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
interface DataType {
    key: React.Key;
}


type Page<P = {}> = NextPage<P> & {
    getLayout?: (page: ReactNode) => ReactNode;
};

const Admin: Page = () => {
    const router = useRouter()
    const [exportModal, setExportModal] = React.useState(false);
    const [loading, setLoading] = React.useState(false)
    //   const [state, setState] = React.useState({
    //     data: [],
    //     count: 0
    //   })
    const [state, setState] = React.useState<any>([])

    //   const onChangeRouter = (key: string, value: string) => {
    //     router.replace({
    //       query: { ...router.query, [key]: value }
    //     })
    //   }
    console.log(state, "state");

    const onSearch = (value: string) => {
        console.log("onserach value", value);
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            //   onChangeRouter("search", String(value).trim())
        }, 1000);
    }

    const handleFilter = (value: any) => {
        console.log("handleFilter called", value);
        // onChangeRouter("filter", value)
    }

    const handlePagination = (page: number, pageSize: number) => {
        console.log('page: number, pageSize', page, pageSize);
        // router.replace({
        //   query: { ...router.query, pagination: page, limit: pageSize }
        // })
    }
    const initialise = async () => {
        try {
            setLoading(true)
            //   let query = router.query
            let urlSearchParam = new URLSearchParams()
          
            let res = await api.Admin.listing()
            setState(res)
        } catch (error) {
            console.log(error)
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
          console.log(res, "hhhh");
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
                // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
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
                                        <Breadcrumb.Item><Link href="/" className='text-decoration-none'>Home</Link></Breadcrumb.Item>
                                        <Breadcrumb.Item className='text-decoration-none'>Admin</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                                {/* title  */}
                                <div className='d-lg-flex justify-content-between align-items-center'>
                                    <Typography.Title level={3} className='m-0 mb-3 mb-md-0 fw-bold'>Admin</Typography.Title>
                                    <div className='d-flex align-items-lg-stretch gap-3 overflow-auto flex-nowrap'>
                                        <Link href='/admin/admin-staff/add'><Button type="primary" size='large' icon={<PlusOutlined />} >Add Admin</Button></Link>
                                        {/* <Button type="primary" htmlType="button" size='large' onClick={() => setExportModal(true)} icon={<DownloadOutlined />}>Export</Button> */}
                                    </div>
                                </div>
                                {/* Search  */}
                                <div className='my-4 d-flex gap-4 align-items-center'>
                                    <Search size="large" placeholder="Search..." onSearch={onSearch} onChange={(e) => onSearch(e.target.value)} enterButton />
                                    {/* <Space>
                  < Select
                    size="large"
                    defaultValue="Filter"
                    style={{ width: 120 }}
                    onChange={handleFilter}
                    options={[
                      { value: 'Filter', label: 'Filter' },
                      { value: 'dashboard', label: 'DASHBOARD' },
                      { value: 'users', label: 'USERS' },
                      { value: 'product', label: 'PRODUCT' },
                      { value: 'notification', label: 'NOTIFICATION' },
                      { value: 'contact', label: 'CONTACT' },
                      { value: 'faq', label: 'FAQ' },
                      { value: 'db_backup', label: 'DB_BACKUP' },
                      { value: 'setting', label: 'SETTING' },
                      { value: 'content', label: 'CONTENT' },
                      { value: 'staff', label: 'STAFF' }

                    ]}
                  />
                </Space> */}

                                </div>
                                {/* Table  */}
                                <div className='tabs-wrapper'>
                                    <Table dataSource={dataSource} columns={columns} pagination={false} scroll={{ x: '100%' }} className="w-100" />
                                </div>
                                {/* Pagination  */}
                                <Row justify={'center'} className="mt-4">
                                    <Col span={24}>
                                        {/* <Pagination current={Number(router.query.pagination) || 1} pageSize={Number(router.query.limit) || 10} total={state?.count} hideOnSinglePage={true} disabled={loading} onChange={handlePagination} /> */}
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    {/* <ExportFile open={exportModal} setOpen={setExportModal} title="Staff Export" export={async (start_date?: number, end_date?: number) => {
          try {
            setLoading(true)
            let apiRes = await henceforthApi.Staff.export(start_date, end_date)
            if (Array.isArray(apiRes?.data) && apiRes?.data.length > 0) {
              downloadCSV("Staff", apiRes?.data)
            }
            if (Array.isArray(apiRes?.data) && apiRes?.data?.length == 0) {
              Toast.success("No Data Found")
            }
          } catch (error) {
            console.log(error);
            Toast.error(error)
          } finally {
            setLoading(false)
          }
        }} /> */}
                </section>
            </Fragment>
        </MainLayout>
    )
}

export default Admin
