"use client";
import React, { Fragment, useEffect, useState } from "react";
import {
  Table,
  Input,
  Breadcrumb,
  Typography,
  Row,
  Col,
  Card,
  
  Tooltip,
  Button,
  Popconfirm,
  Spin,
} from "antd";
import Link from "next/link";
import dayjs from "dayjs";
import Unarchive from "../../assests/images/3669187_unarchive_ic_icon (2).png";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";
import validation, { capFirst } from "../../utils/validation";
import api from "../../utils/api";

const { Search } = Input;

const ArchiveMeeting = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [areas, setAreas] = useState<any>([]);

  const [filteredData, setFilteredData] = useState<any>([]);
  const formatWithOrdinal = (date: any) => {
    const day = dayjs(date).date();

    const getOrdinalSuffix = (day: any) => {
      const j = day % 10,
        k = day % 100;
      if (j === 1 && k !== 11) {
        return day + "st";
      }
      if (j === 2 && k !== 12) {
        return day + "nd";
      }
      if (j === 3 && k !== 13) {
        return day + "rd";
      }
      return day + "th";
    };

    const formattedDate = `${dayjs(date).format("MMMM")} ${getOrdinalSuffix(
      day
    )}, ${dayjs(date).format("YYYY")}`;
    return formattedDate;
  };
  const archive = async (id: any) => {
    const item = {
        meeting_id: id,
    }
    try {
        let res = await api.Meeting.unarchive_meeting_delete(item as any)
        console.log(res,"sfsadf");
        
        initialise(id)
        toast.success(res?.message)
        //   setAreas
    } catch (error) {

    }
}
  useEffect(() => {
    const filtered = areas?.filter((res: any) => {
      const name = res?.host ? `${res?.host}` : "";
      const meeting_type = res?.meeting_type || "";
      const city = res?.location || "";
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredData(filtered);
  }, [searchTerm, areas]);
  const dataSource = filteredData?.map((res: any, index: number) => {
    return {
      key: index + 1,
      meeting:
        `${validation.capitalizeFirstLetter(res?.meeting_type)} ${dayjs(
          res?.start_meeting_date
        ).format("YYYY")}` || "N/A",
      host_name: capFirst(res?.host) || "N/A",
      host_city: (
        <Tooltip title={res?.location}>
          {res?.location ? `${res?.location.slice(0, 20)}...` : "N/A"}
        </Tooltip>
      ),
      start_date: formatWithOrdinal(res?.start_meeting_date) || "N/A",
      start_time: dayjs(res?.start_time).format("hh:mm A") || "N/A",
      end_date: formatWithOrdinal(res?.end_meeting_date) || "N/A",
      end_time: dayjs(res?.end_time).format("hh:mm A") || "N/A",
      action: (
        <ul className="list-unstyled mb-0 gap-3 d-flex">
          <>
            <li>
              <Popconfirm
                title="Unarchive"
                description="Are you sure you want to Unarchive ?"
                onConfirm={(event: any) => {
                  unarchive(res?.id);
                }}
              >
                <Button type="text" danger htmlType="button" className="px-0">
                  <img src={Unarchive.src} alt="" />
                </Button>
              </Popconfirm>
            </li>
            <li>
                                <Popconfirm
                                    title="Delete"
                                    description="Are you sure you want to delete ?"
                                    onConfirm={(event: any) => { archive(res?.id) }}
                                // okButtonProps={{ loading: deleteLoading == res._id, danger: true }}
                                >
                                    <Button type="text" danger htmlType='button' className='px-0' ><i className="fa-solid fa-trash-can"></i></Button>
                                </Popconfirm>
                            </li>
          </>
        </ul>
      ),
    };
  });
  const columns = [
    {
      title: "Order No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Meeting Name",
      dataIndex: "meeting",
      key: "meeting",
    },
    {
      title: "Host Name",
      dataIndex: "host_name",
      key: "host_name",
    },
    {
      title: "Host City",
      dataIndex: "host_city",
      key: "host_city",
    },
    {
      title: "Meeting Date",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "Meeting Time",
      dataIndex: "start_time",
      key: "start_time",
    },
    {
      title: "Meeting End Date",
      dataIndex: "end_date",
      key: "end_date",
    },
    {
      title: "Meeting End Time",
      dataIndex: "end_time",
      key: "end_time",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const initialise = async (query: string) => {
    try {
      const query: any = searchTerm ? `searchTerm=${searchTerm}` : "";
      let res = await api.Meeting.archive(query);
      setAreas(res?.data);
      if (
        res?.data?.status == 400 ||
        res?.data?.message ==
          "Firebase ID token has expired. Get a fresh ID token from your client app and try again (auth/id-token-expired). See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token."
      ) {
        destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: "/" });
        localStorage.removeItem("hasReloaded");
        toast.error("Session Expired Login Again");
        router.replace("/auth/signin");
      }
    } catch (error: any) {
      if (error == 400) {
        destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: "/" });
        localStorage.removeItem("hasReloaded");
        // }
        toast.error("Session Expired Login Again");
        router.replace("/auth/signin");
      }
    }
  };


  
  const getData = async () => {
    setLoading(true)
    try {
        let query = searchTerm ? `searchTerm=${searchTerm}` : '';
        let res = await api.Meeting.archive(query);
        setFilteredData(res?.data);
        setLoading(false)
        
    } catch (error:any) {
        setLoading(false)
        
    }
};

  useEffect(() => {
    const query: any = searchTerm ? `searchTerm=${searchTerm}` : "";
    initialise(query);
  }, [searchTerm]);

  const unarchive = async (id: any) => {
    setLoading(true);
    const item = {
      meeting_id: id,
    };
    try {
      let res = await api.Meeting.unarchive_meeting(item as any);
      if (res) {
        toast.success(res?.message);
      }
      getData()
    } catch (error: unknown) {
      setLoading(false);
    }
  };



  return (
    <>
      <Fragment>
        <section>
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Card className="common-card">
                <div className="mb-4">
                  <Breadcrumb separator=">">
                    <Breadcrumb.Item>
                      <Link
                        className="text-decoration-none"
                        href="/admin/dashboard"
                      >
                        General
                      </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item className="text-decoration-none">
                      Archive Meetings
                    </Breadcrumb.Item>
                  </Breadcrumb>
                </div>
                {/* title  */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                  <Typography.Title level={3} className="m-0 fw-bold">
                    Archive Meetings
                  </Typography.Title>
                </div>
                {/* Search  */}
                <div className="my-4 d-flex gap-3">
                  <Search
                    size="large"
                    placeholder="Search by Meeting Name or year"
                    enterButton
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                {/* Tabs  */}
                <div className="tabs-wrapper">
                  {loading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "20vh",
                      }}
                    >
                      <Spin size="large" />
                    </div>
                  ) : (
                    <>
                      <Table
                        className="tableBox"
                        dataSource={dataSource}
                        columns={columns}
                        pagination={{
                          position: ["bottomCenter"],
                        }}
                      />
                    </>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </section>
      </Fragment>
    </>
  );
};

export default ArchiveMeeting;
