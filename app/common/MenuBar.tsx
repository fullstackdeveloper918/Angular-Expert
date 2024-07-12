"use client"
import React, { useState } from 'react'
import logo from "../../assests/images/image.png"
import { Typography, type MenuProps } from 'antd';
import { CloseOutlined } from '@ant-design/icons'
import User from "../../assests/images/placeholder.png"
import favicon from "../../assests/images/favicon.png";
import {
  DashboardOutlined,
  MessageOutlined,
  LaptopOutlined,
  UserOutlined,
  ContactsOutlined,
  UnorderedListOutlined,
  AuditOutlined,
  MailOutlined,
  DollarOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  OrderedListOutlined,
  DatabaseOutlined,
  AppstoreAddOutlined,
  FolderOpenOutlined,
  ShoppingCartOutlined,
  UsergroupAddOutlined,
  CustomerServiceOutlined,
  GoldOutlined,
  SafetyCertificateOutlined,
  GiftOutlined,
  CreditCardOutlined,
  FileProtectOutlined,
  UserAddOutlined

} from '@ant-design/icons';
import Link from 'next/link';
// import { GlobalContext } from '@/context/Provider';
// import henceforthApi from '@/utils/henceforthApi';
import dynamic from 'next/dynamic';
// import henceofrthEnums from '@/utils/henceofrthEnums';
// import { useRouter } from 'next/router';
// import s3bucket from '@/utils/s3bucket';
import henceofrthEnums from '@/utils/henceofrthEnums';
import { useRouter } from 'next/navigation';

const iconSize = { fontSize: '18px' };
const { Row, Col, Avatar, Card, Menu, Pagination, Tooltip, Button } = {
  Row: dynamic(() => import("antd").then(module => module.Row), { ssr: false }),
  Col: dynamic(() => import("antd").then(module => module.Col), { ssr: false }),
  Card: dynamic(() => import("antd").then(module => module.Card), { ssr: false }),
  Pagination: dynamic(() => import("antd").then(module => module.Pagination), { ssr: false }),
  Tooltip: dynamic(() => import("antd").then(module => module.Tooltip), { ssr: false }),
  Avatar: dynamic(() => import("antd").then(module => module.Avatar), { ssr: false }),
  Button: dynamic(() => import("antd").then(module => module.Button), { ssr: false }),
  Menu: dynamic(() => import("antd").then(module => module.Menu), { ssr: false }),
}
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const MenuBar = ({ collapsed, setCollapsed }: any) => {
//   const { userInfo, contentPages, setContentPages } = React.useContext(GlobalContext)
  const [openKeys, setOpenKeys] = useState(['sub1']);

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
      
    } else {
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
};
console.log(openKeys,"latestOpenKey");


  const mainMenu = [
    {
        key: henceofrthEnums.Roles.DASHBOARD, view: getItem(<Link href='/' className='text-decoration-none'>Dashboard</Link>, 'dashboard', <DashboardOutlined style={iconSize} />),
      },
      {
        key: henceofrthEnums.Roles.USERS, view: getItem(<Link href='/admin/users' className='text-decoration-none'>Club Members</Link>, 'users', <UserOutlined style={iconSize} />),
      },
    {
        key: henceofrthEnums.Roles.PAGES, view: getItem('Meetings', 'sub1',  <UsergroupAddOutlined style={iconSize}/>,
          [
            getItem(<Link href="/admin/meetings" className='text-decoration-none'>Meetings</Link>, 'meetings', <OrderedListOutlined style={iconSize} />),
            getItem(<Link href="/admin/manage_questions" className='text-decoration-none'>Manage Questions for Meeting</Link>, 'manage/-questions', <AppstoreAddOutlined style={iconSize} />),
            getItem(<Link href="/admin/archive_meeting" className='text-decoration-none'>Archive Meetings</Link>, 'archive_meeting', <FolderOpenOutlined style={iconSize} />),
          ]
        )
      },
    {
      key: henceofrthEnums.Roles.ORDER, view: getItem(<Link href='/admin/questionnaire' className='text-decoration-none'>Questionnaire</Link>, 'questionnaire', <span><BookOutlined style={iconSize} /></span>),
    },
    // {
    //   key: henceofrthEnums.Roles.PAYOUT, view: getItem(<Link href='/payout/page/1?limit=10' className='text-decoration-none'>Payout</Link>, 'payout', <span><DollarOutlined style={iconSize} /></span>),
    // },
    // {
    //   key: henceofrthEnums.Roles.GENRES, view: getItem(<Link href='/genre/page/1?limit=10' className='text-decoration-none'>Genres</Link>, 'genre', <span><CustomerServiceOutlined style={iconSize} /></span>),
    // },
    // {
    //   key: henceofrthEnums.Roles.VP_POINTS, view: getItem(<Link href='/points/page/1?limit=10' className='text-decoration-none'>VP Points</Link>, 'points', <span><GoldOutlined style={iconSize} /></span>),
    // },
    // {
    //   key: henceofrthEnums.Roles.BADGES, view: getItem(<Link href='/badge-info/page/1?limit=10' className='text-decoration-none'>Badge Info</Link>, 'badge', <span><SafetyCertificateOutlined style={iconSize} /></span>),
    // },
    // {
    //   key: henceofrthEnums.Roles.REWARDS, view: getItem(<Link href='/rewards/page/1?limit=10' className='text-decoration-none'>Rewards Info</Link>, 'rewards', <span><GiftOutlined style={iconSize} /></span>),
    // },
    // {
    //   key: henceofrthEnums.Roles.GENRES, view: getItem(<Link href='/id-proof/page/1?limit=10' className='text-decoration-none'>Id Proof</Link>, 'in_proof', <span><FileProtectOutlined style={iconSize} /></span>),
    // },
  ]

  const general = [
    {
      key: henceofrthEnums.Roles.TRANSACTION, view: getItem('Transaction', 'sub2', <DollarOutlined style={iconSize} />,
        [
          getItem(<Link href="/transaction/artist/page/1?limit=10&type=audio" className='text-decoration-none'>Artists</Link>, 'transaction-artist', <UserAddOutlined style={iconSize} />),
          getItem(<Link href="/transaction/user/page/1?limit=10&type=audio" className='text-decoration-none'>Users</Link>, 'transaction-user', <UserAddOutlined style={iconSize} />),
        ]
      )
    },
    {
      key: henceofrthEnums.Roles.COMMISSION, view: getItem(<Link href='/commission' className='text-decoration-none'>Commission</Link>, 'commission', <span><CreditCardOutlined style={iconSize} /></span>),
    },
    {
      key: henceofrthEnums.Roles.PAGES, view: getItem('Content Page', 'sub3', <BookOutlined style={iconSize} />,
        [
          getItem(<Link href="/content/page/1?limit=10" className='text-decoration-none'>List</Link>, 'content-page', <OrderedListOutlined style={iconSize} />),
          getItem(<Link href="/content/add" className='text-decoration-none'>Add new</Link>, 'content-add', <AppstoreAddOutlined style={iconSize} />),
        ]
      )
    }
  ]


  const management = [
    {
      key: henceofrthEnums.Roles.FAQ, view: getItem(<Link href='/faq/page/1?limit=10' className='text-decoration-none'>FAQs</Link>, 'faq', <QuestionCircleOutlined style={iconSize} />),
    },
    {
      key: henceofrthEnums.Roles.CONTACT_US, view: getItem(<Link href='/contact-us/page/1?limit=10' className='text-decoration-none'>Contact us</Link>, 'contact-us', <ContactsOutlined style={iconSize} />),
    },
    {
      key: henceofrthEnums.Roles.CLOUD_MESSAGING, view: getItem(<Link href='/cloud-messaging' className='text-decoration-none'>Cloud Messaging</Link>, 'cloud-messaging', <MessageOutlined style={iconSize} />),
    },
    {
      key: henceofrthEnums.Roles.DB_BACKUP, view: getItem(<Link href='/database' className='text-decoration-none'>DB Backup</Link>, 'database', <DatabaseOutlined style={iconSize} />),
    },
  ]
let userInfo={
    roles:["FAQS",
        "STAFFS",
        "USERS",
        "PAGES",
        "CONTACT_US",
        "CLOUD_MESSAGING",
        "DASHBOARD",
        "ORDERS",   
        "TRANSACTIONS",
        "COMMISSION",
        "GENRES",
        "VP_POINTS",
        "BADGES",
        "ARTISTS",  
        "REWARDS",
        "DB_BACKUP"],
        super_admin:true
}
  function options(array: any) {
    return array.filter((res: any) => userInfo?.roles?.includes(res?.key.toUpperCase())).map((res: any) => { return res.view })
  }
//   console.log("Roless", userInfo?.roles, "super_admin", userInfo?.super_admin)

  const router = useRouter();
  const showCheck = (type: string) => userInfo?.roles?.includes(type.toUpperCase())
  let men = options(mainMenu.filter(res => showCheck(res.key)))
  let gen = options(general.filter(res => showCheck(res.key)))
  console.log(gen, "gen");
  let mana = options(management.filter(res => showCheck(res.key)))
  console.log(mana, "mna");

//   const [, root, sub, subroot] = router.pathname?.split('/');
  const subRoot = 'dashboard'
//   console.log(subRoot, 'subRoot');

  const rootSubmenuKeys = ['sub1', 'sub2', 'sub3'];
  const items: MenuItem[] = [
    getItem(!collapsed && <Typography.Title level={5} className='m-0 fw-bold' type='secondary'>MAIN MENU</Typography.Title>, 'mainmenu', null, men, 'group'),
    // getItem(!collapsed && <Typography.Title level={5} className='m-0 fw-bold' type='secondary'>GENERAL</Typography.Title>, 'general', null, gen, `group`),
    // getItem(!collapsed && <Typography.Title level={5} className='m-0 pt-3 fw-bold' type='secondary'>MANAGEMENT</Typography.Title>, 'management', null, mana, `group`),
  ];
  if (!men.length) [
    items.splice(0, 1)
  ]
//   if (!gen.length) {
//     items.splice(!men.length ? 0 : 1, 1)
//   }
  if (!mana.length) {
    items.pop()
  }

  return (
    <div className='menu-wrapper position-relative'>
      <div className="logo">
        <Link href="/"><img src={`${ logo.src}`} alt="logo" className='img-fluid' /></Link>
       {/* <h1 className="">DCB</h1> */}
        <div className='position-absolute end-0' style={{ top: '-10px' }}>
          <Button className='d-lg-none p-0' shape='circle' size='small' type='primary' icon={<CloseOutlined style={{ width: '10px' }} />} onClick={() => setCollapsed(true)}></Button>
        </div>
      </div>

      <div className={`menu-profile-wrapper my-4 d-flex align-items-center gap-2 ${!collapsed ? "bg-light" : "p-0 bg-tranaprent"}`}>
        <Avatar 
        // src={User.src}
         size={40}>J</Avatar>
        {!collapsed && <div>
          <Typography.Title level={5} className='m-0 fw-bold text-capitalize'>{'Super Admin'}</Typography.Title> 
          <Typography.Paragraph className='m-0'>{"John"}</Typography.Paragraph>
        </div>}
      </div>

      <div className={`border-0 ${!collapsed ? "ps-3" : "ps-0"}`}>
        <Menu
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          defaultSelectedKeys={["dashboard"]}
          mode="inline"
          items={items}
        />
      </div>
    </div>
  )
}

export default MenuBar