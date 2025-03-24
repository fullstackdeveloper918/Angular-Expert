"use client";
import React, { Fragment, useEffect, useState } from "react";
import { Input, Breadcrumb, Typography, Table, Card, Col, Row, Tooltip, Button, Collapse, theme, Popconfirm } from "antd";
import MainLayout from "../../components/Layout/layout";
// import Link from "next/link";
import api from "@/utils/api";
import { CheckOutlined, DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { pdf } from "@react-pdf/renderer";
import saveAs from "file-saver";
import { useSelector } from "react-redux";
import Pdf from "../common/Pdf";
import BussinessPdf from "../common/Bussinesspdf"
import GoalsPdf from "../common/Goalspdf"
import Toolboxpdf from "../common/Toolboxpdf"
import Craftsmenpdf from "../common/Craftsmenpdf"
import MeetingReviewpdf from "../common/Meetingreviewpdf"
import Meetingpreparationpdf from "../common/Meetingpreparationpdf"
import Additionalquestion from "../common/Additionalquestion"
import Photopdf from "../common/Photosectionpdf"
import 'react-toastify/dist/ReactToastify.css';

import { toast, ToastContainer } from "react-toastify";
import { parseCookies } from "nookies";
import { destroyCookie } from "nookies";
import { useDispatch } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { clearUserData } from "@/lib/features/userSlice";
import QuestionanirModal from "../common/QuestionnairModal";
import PhotoSectionPdf from "../common/Photosectionpdf";
import Link from "next/link";
import dayjs from "dayjs";
import PersonalWellBeing from "../common/PersonalWellBeing";
import BusinessEvolutionPdf1 from "../common/BusinessEvolutionPdf1";


const { Search } = Input;
const { Title } = Typography;
const QuestionnairList = () => {
    const getUserdata = useSelector((state: any) => state?.user?.userData)
    console.log(getUserdata,"getUserdata");
    
    const searchParams = useSearchParams();
    const entries = Array.from(searchParams.entries());
    const value = entries.length > 0 ? entries[0][0] : '';

    const cookies = parseCookies();
    const accessToken = cookies.COOKIES_USER_ACCESS_TOKEN;
    const pendingTime = cookies.expirationTime
  

    const [questionType, setQuestionType] = useState<any>(null);
    const { token } = theme.useToken();
    const [state, setState] = useState<any>([])
    const [state1, setState1] = useState<any>("")
    const [areas, setAreas] = useState<any>([]);
    const [filteredData, setFilteredData] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()
    console.log(state1,"state1");
    
    const dispatch = useDispatch();
    useEffect(() => {
        // Filter data when searchTerm or state1 changes
        const filtered = state?.filter((res: any) => {
            const name = res?.question ? `${res?.question}` : "";
            const meeting_type = res?.index || "";
            const city = res?.location || "";
            return name.toLowerCase().includes(searchTerm.toLowerCase()) || meeting_type.toLowerCase().includes(searchTerm.toLowerCase()) || city.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setFilteredData(filtered);
    }, [searchTerm, state]);
    const dataSource = filteredData?.map((res: any, index: number) => {
        return {
            key: index + 1,
            question:
                <p >
                    <span>{res?.question}</span>
                </p>,


        }
    })
    const columns = [
        {
            title: 'Order No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Questions',
            dataIndex: 'question',
            key: 'question',
        },


    ];
    const initialise1 = async () => {
        try {
            let res = await api.Meeting.listing();
            setAreas(res);
            if (res?.status == 500) {
                // destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                // localStorage.removeItem('hasReloaded');
                // // }
                // dispatch(clearUserData({}));
                // toast.error("Session Expired Login Again")
                // router.replace("/auth/signin")
            }
        } catch (error:any) {
            if (error.status == 500) {
                localStorage.setItem('redirectAfterLogin', window.location.pathname);
                localStorage.removeItem("hasReloaded")
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                // dispatch(clearUserData({}));
                toast.error("Session Expired. Login Again");
                router.replace("/auth/signin");
            }
        }
    };
    useEffect(() => {

        initialise1();

    }, []);
    const getDataById = async () => {
        const item = {
            user_id: getUserdata?.user_id,
            meeting_id:getUserdata.meetings.NextMeeting.id
        }
        try {
            const res = await api.User.getById(item as any);
            console.log(res,"uiouiouiouio");
            
            setState1(res?.data || null);
        } catch (error: any) {
            if (error?.status == 500) {
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                localStorage.removeItem('hasReloaded');
                // }
                toast.error("Session Expired Login Again")
                router.replace("/auth/signin")
            }
        }
    };
    useEffect(() => {
        getDataById()
    }, [])

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
    };
    const initialise = async (query: any) => {
        try {
            const query: any = searchTerm ? `searchTerm=${searchTerm}` : '';
            const params: any = questionType ? { searchFilter: questionType } : {};
            let res = await api.Questionnaire.listing(query,getUserdata.meetings.NextMeeting.id);

            setState(res.data);
            if (res?.data?.status == 500) {
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                
                localStorage.removeItem('hasReloaded');
                toast.error("Session Expired Login Again")
                router.replace("/auth/signin")
            }
        } catch (error: any) {
            if (error?.status == 500) {
                destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
                localStorage.removeItem('hasReloaded');
                toast.error("Session Expired Login Again")
                router.replace("/auth/signin")
            }
        } finally {
        }
    };

    useEffect(() => {
        const query: any = searchTerm ? `searchTerm=${searchTerm}` : '';
        initialise(query);
    }, [searchTerm]);

    const generatePdf = async () => {
        const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
        const blob = await pdf(<BussinessPdf state={state1} />).toBlob();
        const pdfUrl = URL.createObjectURL(blob);
        return { blob, pdfUrl, timestamp };
    };

    // Function to handle PDF download
    const downLoadPdf = async () => {
        const { blob, timestamp } = await generatePdf();
        saveAs(blob, `Order_${timestamp}.pdf`);
    };
    const generatePdf2 = async () => {
        const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
        const blob = await pdf(<GoalsPdf state={state1} />).toBlob();
        const pdfUrl = URL.createObjectURL(blob);
        return { blob, pdfUrl, timestamp };
    };

    // Function to handle PDF download
    const downLoadPdf2 = async () => {
        const { blob, timestamp } = await generatePdf2();
        saveAs(blob, `Order_${timestamp}.pdf`);
    };
    const generatePdf3 = async () => {
        const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
        const blob = await pdf(<Toolboxpdf state={state1} />).toBlob();
        const pdfUrl = URL.createObjectURL(blob);
        return { blob, pdfUrl, timestamp };
    };

    // Function to handle PDF download
    const downLoadPdf3 = async () => {
        const { blob, timestamp } = await generatePdf3();
        saveAs(blob, `Order_${timestamp}.pdf`);
    };
    const generatePdf4 = async () => {
        const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
        const blob = await pdf(<Craftsmenpdf state={state1} />).toBlob();
        const pdfUrl = URL.createObjectURL(blob);
        return { blob, pdfUrl, timestamp };
    };

    // Function to handle PDF download
    const downLoadPdf4 = async () => {
        const { blob, timestamp } = await generatePdf4();
        saveAs(blob, `Order_${timestamp}.pdf`);
    };
    const generatePdfWellBeing = async () => {
        const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
        const blob = await pdf(<PersonalWellBeing state={state1} />).toBlob();
        const pdfUrl = URL.createObjectURL(blob);
        return { blob, pdfUrl, timestamp };
    };

    // Function to handle PDF download
    const downLoadPdfWellBeing= async () => {
        const { blob, timestamp } = await generatePdfWellBeing();
        saveAs(blob, `Order_${timestamp}.pdf`);
    };
    const generatePdfBusinessEvolution = async () => {
        const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
        const blob = await pdf(<BusinessEvolutionPdf1 state={state1} />).toBlob();
        const pdfUrl = URL.createObjectURL(blob);
        return { blob, pdfUrl, timestamp };
    };

    // Function to handle PDF download
    const downLoadPdfBusinessEvolution= async () => {
        const { blob, timestamp } = await generatePdfBusinessEvolution();
        saveAs(blob, `Order_${timestamp}.pdf`);
    };
    const generatePdf5 = async () => {
        const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
        const blob = await pdf(<MeetingReviewpdf state={state1} />).toBlob();
        const pdfUrl = URL.createObjectURL(blob);
        return { blob, pdfUrl, timestamp };
    };

    // Function to handle PDF download
    const downLoadPdf5 = async () => {
        const { blob, timestamp } = await generatePdf5();
        saveAs(blob, `Order_${timestamp}.pdf`);
    };
    const generatePdf6 = async () => {
        const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
        const blob = await pdf(<Meetingpreparationpdf state={state1} />).toBlob();
        const pdfUrl = URL.createObjectURL(blob);
        return { blob, pdfUrl, timestamp };
    };

    // Function to handle PDF download
    const downLoadPdf6 = async () => {
        const { blob, timestamp } = await generatePdf6();
        saveAs(blob, `Order_${timestamp}.pdf`);
    };
    const generatePdf7 = async () => {
        const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
        const blob = await pdf(<PhotoSectionPdf state={state1} />).toBlob();
        const pdfUrl = URL.createObjectURL(blob);
        return { blob, pdfUrl, timestamp };
    };

    // Function to handle PDF download
    const downLoadPdf7 = async () => {
        const { blob, timestamp } = await generatePdf7();
        saveAs(blob, `Order_${timestamp}.pdf`);
    };
    const generatePdf8 = async () => {
        const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
        const blob = await pdf(<Additionalquestion state={state1} />).toBlob();
        const pdfUrl = URL.createObjectURL(blob);
        return { blob, pdfUrl, timestamp };
    };

    // Function to handle PDF download
    const downLoadPdf8 = async () => {
        const { blob, timestamp } = await generatePdf8();
        saveAs(blob, `Order_${timestamp}.pdf`);
    };

    // Function to handle PDF sharing
    const sharePdf = async () => {

        const { pdfUrl, timestamp } = await generatePdf();
        const response = await fetch(pdfUrl);
        const blob = await response.blob();

        // Convert the blob to a file
        const file = new File([blob], `Order_${timestamp}.pdf`, { type: 'application/pdf' });
        const formData = new FormData();
        formData.append('file', file);


        const res = await fetch('https://frontend.goaideme.com/save-pdf', {
            // const res = await fetch('https://app-uilsndszlq-uc.a.run.app/save-pdf', {

            method: 'POST',
            body: formData,
            headers: {
                Token: `${accessToken}`,
                // 'Content-Type': 'application/json',
            }
        },);

        const apiRes: any = await res.json()
        navigator.clipboard.writeText(apiRes?.fileUrl)
            .then(() => {
                toast.success('Link copied to clipboard');
            })
            .catch(() => {
                toast.error('Failed to copy link to clipboard');
            });

        //   })
        //   toast.success('Link Share Successfully', {
        //     position: 'top-center',
        //     autoClose: 300,

        //   });

        // Optionally, open the PDF in a new tab
        // window.open(pdfUrl, '_blank');
    };

    const handleDownloadAndFetchData = (id: any) => {
        // getDataById(id);
        downLoadPdf();
    };
    const handleFetchAndFetchData = (id: any) => {
        // getDataById(id);
        // sharePdf();
    };
    const panelStyle = {
        marginBottom: 24,
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: '1px solid #e6e6e6',
    };

    const data = [
        { title: 'Card 1', description: 'BUSINESS UPDATE', state: 0 },
        { title: 'Card 2', description: 'GOALS', state: 1 },
        { title: 'Card 3', description: 'CRAFTSMEN TOOLBOX', state: 2 },
        { title: 'Card 4', description: 'CRAFTSMEN CHECK-UP', state: 3 },
        { title: 'Card 5', description: 'FALL 2024 MEETING REVIEW', state: 4 },
        { title: 'Card 6', description: 'SPRING 2025 MEETING PREPARATION', state: 5 },
        { title: 'Card 7', description: 'PHOTO SECTION', state: 6 },
        // Add more card data as needed
    ];
    const baseURL = '/admin/member/add';
    const getLinkForState = (state: any) => {
        switch (state) {

            case 0: return `${baseURL}/page2?${getUserdata?.user_id}&edit&questionnair`;
            case 1: return `${baseURL}/page3?${getUserdata?.user_id}&edit&questionnair`;
            case 2: return `${baseURL}/page4?${getUserdata?.user_id}&edit&questionnair`;
            case 3: return `${baseURL}/page5?${getUserdata?.user_id}&edit&questionnair`;
            case 4: return `${baseURL}/page6?${getUserdata?.user_id}&edit&questionnair`;
            case 5: return `${baseURL}/page7?${getUserdata?.user_id}&edit&questionnair`;
            case 6: return `${baseURL}/additional_questionnaire?${getUserdata?.user_id}&edit&questionnair`;
            case 7: return `${baseURL}/page8?${getUserdata?.user_id}&edit&questionnair`;
            // Add more cases as needed
            default: return `${baseURL}/page-default?${getUserdata}&edit`;
        }
    };
    const xyz = getUserdata?.is_additional_user == true ? getUserdata?.parent_user_id : getUserdata?.user_id

    const userData = getUserdata?.is_additional_user == true
    const handleClick = () => {
        router.push(`admin/member/add/page2?mqPJZGktGjd7NoNAGCsj92fnYYj1&edit`)
    }
   
    const [showToast, setShowToast] = useState<any>(true);

    // Update localStorage whenever showToast changes
    // useEffect(() => {
    //     localStorage.setItem('showToast', JSON.stringify(showToast));
    // }, [showToast]);

    const handleCancel = () => {
        setShowToast(false);
    };
    useEffect(() => {
        if (value == "page2") {
            <CustomToastpage2 />
            //   toast(<CustomToastpage2 />, {
            //     position: 'top-center',
            //     autoClose: false, 
            //   });
        } else if (value == "page3") {
            <CustomToastpage3 />;
        } else if (value == "page4") {
            <CustomToastpage4 />;
        } else if (value == "page5") {
            <CustomToastpage5 />;
        } else if (value == "page6") {
            <CustomToastpage6 />;
        } else if (value == "page7") {
            <CustomToastpage7 />;
        } else if (value == "additionalPage") {
            <CustomToastAdditonalPage />;
        } else if (value == "page8") {
            <CustomToastPgae8 />;
        }
    }, [value]);
    const CustomToastpage2 = () => (
        <div className="Custom_tost">
            <div>
                <span style={{ color: 'green', fontSize: '16px', marginRight: '8px' }}><CheckOutlined /></span>
                <p style={{ margin: 0 }}>You have successfully updated the form</p>
            </div>
            <div className="Btns"><a
                href={`/admin/member/add/page2?${getUserdata?.user_id}&edit`} rel="noopener noreferrer"
                style={{ marginTop: '8px', textDecoration: 'none' }}
            >
              To check your update, Click here
            </a>
                <a
                   onClick={handleCancel}
                >
                    Cancel
                </a>
            </div>
        </div>
    );

    const CustomToastpage3 = () => (
        // <div>
        //   <p>Goals Update Successfully</p>
        //   <a href="/admin/member/add/page3?mqPJZGktGjd7NoNAGCsj92fnYYj1&edit"  rel="noopener noreferrer">Click here for more info</a>
        // </div>
        // <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        // <div className="Custom_tost">
        //     <div style={{ display: 'flex', alignItems: 'center' }}>
        //         <span style={{ color: 'green', fontSize: '16px', marginRight: '8px' }}>✔</span>
        //         <p style={{ margin: 0 }}>Goals Update Successfully</p>
        //     </div>
        //     <a
        //         href={`/admin/member/add/page3?${getUserdata?.user_id}&edit`}
        //         rel="noopener noreferrer"
        //         style={{ marginTop: '8px', color: '#007bff', textDecoration: 'none' }}
        //     >
        //       To check your update, Click here
        //     </a>
        // </div>
        <div className="Custom_tost">
            <div>
                <span style={{ color: 'green', fontSize: '16px', marginRight: '8px' }}><CheckOutlined /></span>
                <p style={{ margin: 0 }}>You have successfully updated the form</p>
            </div>
            <div className="Btns"> <a
                href={`/admin/member/add/page3?${getUserdata?.user_id}&edit`}
                rel="noopener noreferrer"
                style={{ marginTop: '8px', color: '#007bff', textDecoration: 'none' }}
            >
              To check your update, Click here
            </a>
                <a
                   onClick={handleCancel}
                >
                    Cancel
                </a>
            </div>
        </div>
    );
    const CustomToastpage4 = () => (
        // <div>
        //   <p>Update Crfatsmen Toolbox</p>
        //   <a href="/admin/member/add/page4?mqPJZGktGjd7NoNAGCsj92fnYYj1&edit"  rel="noopener noreferrer">Click here for more info</a>
        // </div>
        // <div className="Custom_tost">
        //     <div style={{ display: 'flex', alignItems: 'center' }}>
        //         <span style={{ color: 'green', fontSize: '16px', marginRight: '8px' }}>✔</span>
        //         <p style={{ margin: 0 }}>Update Crfatsmen Toolbox</p>
        //     </div>
        //     <a
        //         href={`/admin/member/add/page4?${getUserdata?.user_id}&edit`}
        //         rel="noopener noreferrer"
        //         style={{ marginTop: '8px', color: '#007bff', textDecoration: 'none' }}
        //     >
        //       To check your update, Click here
        //     </a>
        // </div>
         <div className="Custom_tost">
         <div>
             <span style={{ color: 'green', fontSize: '16px', marginRight: '8px' }}><CheckOutlined /></span>
             <p style={{ margin: 0 }}>You have successfully updated the form</p>
         </div>
         <div className="Btns"> <a
              href={`/admin/member/add/page4?${getUserdata?.user_id}&edit`}
             rel="noopener noreferrer"
             style={{ marginTop: '8px', color: '#007bff', textDecoration: 'none' }}
         >
           To check your update, Click here
         </a>
             <a
                onClick={handleCancel}
             >
                 Cancel
             </a>
         </div>
     </div>
    );
    const CustomToastpage5 = () => (
        // <div>
        //   <p>Update Crfatsmen Checkup</p>
        //   <a href="/admin/member/add/page5?mqPJZGktGjd7NoNAGCsj92fnYYj1&edit"  rel="noopener noreferrer">Click here for more info</a>
        // </div>
        // <div className="Custom_tost">
        //     <div style={{ display: 'flex', alignItems: 'center' }}>
        //         <span style={{ color: 'green', fontSize: '16px', marginRight: '8px' }}>✔</span>
        //         <p style={{ margin: 0 }}>Update Crfatsmen Checkup</p>
        //     </div>
        //     <a
        //         href={`/admin/member/add/page5?${getUserdata?.user_id}&edit`}
        //         rel="noopener noreferrer"
        //         style={{ marginTop: '8px', color: '#007bff', textDecoration: 'none' }}
        //     >
        //       To check your update, Click here
        //     </a>
        // </div>
        <div className="Custom_tost">
        <div>
            <span style={{ color: 'green', fontSize: '16px', marginRight: '8px' }}><CheckOutlined /></span>
            <p style={{ margin: 0 }}>You have successfully updated the form</p>
        </div>
        <div className="Btns"> <a
            href={`/admin/member/add/page5?${getUserdata?.user_id}&edit`}
            rel="noopener noreferrer"
            style={{ marginTop: '8px', color: '#007bff', textDecoration: 'none' }}
        >
          To check your update, Click here
        </a>
            <a
               onClick={handleCancel}
            >
                Cancel
            </a>
        </div>
    </div>
    );
    const CustomToastpage6 = () => (
        // <div>
        //   <p>Update Spring Meeting Review</p>
        //   <a href="/admin/member/add/page6?mqPJZGktGjd7NoNAGCsj92fnYYj1&edit"  rel="noopener noreferrer">Click here for more info</a>
        // </div>
        // <div className="Custom_tost">
        //     <div style={{ display: 'flex', alignItems: 'center' }}>
        //         <span style={{ color: 'green', fontSize: '16px', marginRight: '8px' }}>✔</span>
        //         <p style={{ margin: 0 }}>Update Spring Meeting Review</p>
        //     </div>
        //     <a
        //         href={`/admin/member/add/page6?${getUserdata?.user_id}&edit`}
        //         rel="noopener noreferrer"
        //         style={{ marginTop: '8px', color: '#007bff', textDecoration: 'none' }}
        //     >
        //       To check your update, Click here
        //     </a>
        // </div>
        <div className="Custom_tost">
        <div>
            <span style={{ color: 'green', fontSize: '16px', marginRight: '8px' }}><CheckOutlined /></span>
            <p style={{ margin: 0 }}>You have successfully updated the form</p>
        </div>
        <div className="Btns"> <a
           href={`/admin/member/add/page6?${getUserdata?.user_id}&edit`}
            rel="noopener noreferrer"
            style={{ marginTop: '8px', color: '#007bff', textDecoration: 'none' }}
        >
          To check your update, Click here
        </a>
            <a
               onClick={handleCancel}
            >
                Cancel
            </a>
        </div>
    </div>
    );
    const CustomToastpage7 = () => (
        // <div>
        //   <p>Update Fall Meeting Preparation</p>
        //   <a href="/admin/member/add/page7?mqPJZGktGjd7NoNAGCsj92fnYYj1&edit"  rel="noopener noreferrer">Click here for more info</a>
        // </div>
        // <div className="Custom_tost">
        //     <div style={{ display: 'flex', alignItems: 'center' }}>
        //         <span style={{ color: 'green', fontSize: '16px', marginRight: '8px' }}>✔</span>
        //         <p style={{ margin: 0 }}>Update Fall Meeting Preparation</p>
        //     </div>
        //     <a
        //         href={`/admin/member/add/page7?${getUserdata?.user_id}&edit`}
        //         rel="noopener noreferrer"
        //         style={{ marginTop: '8px', color: '#007bff', textDecoration: 'none' }}
        //     >
        //       To check your update, Click here
        //     </a>
        // </div>
        <div className="Custom_tost">
        <div>
            <span style={{ color: 'green', fontSize: '16px', marginRight: '8px' }}><CheckOutlined /></span>
            <p style={{ margin: 0 }}>You have successfully updated the form</p>
        </div>
        <div className="Btns"> <a
            href={`/admin/member/add/page7?${getUserdata?.user_id}&edit`}
            rel="noopener noreferrer"
            style={{ marginTop: '8px', color: '#007bff', textDecoration: 'none' }}
        >
          To check your update, Click here
        </a>
            <a
               onClick={handleCancel}
            >
                Cancel
            </a>
        </div>
    </div>
    );
    const CustomToastAdditonalPage = () => (
        // <div>
        //   <p>Update Additional Questions</p>
        //   <a href="/admin/member/add/additional_questionnaire?mqPJZGktGjd7NoNAGCsj92fnYYj1&edit"  rel="noopener noreferrer">Click here for more info</a>
        // </div>
        // <div className="Custom_tost">
        //     <div style={{ display: 'flex', alignItems: 'center' }}>
        //         <span style={{ color: 'green', fontSize: '16px', marginRight: '8px' }}>✔</span>
        //         <p style={{ margin: 0 }}>Update Additional Questions</p>
        //     </div>
        //     <a
        //         href={`/admin/member/add/additional_questionnaire?${getUserdata?.user_id}&edit`}
        //         rel="noopener noreferrer"
        //         style={{ marginTop: '8px', color: '#007bff', textDecoration: 'none' }}
        //     >
        //       To check your update, Click here
        //     </a>
        // </div>
        <div className="Custom_tost">
        <div>
            <span style={{ color: 'green', fontSize: '16px', marginRight: '8px' }}><CheckOutlined /></span>
            <p style={{ margin: 0 }}>You have successfully updated the form</p>
        </div>
        <div className="Btns"> <a
            href={`/admin/member/add/additional_questionnaire?${getUserdata?.user_id}&edit`}
            rel="noopener noreferrer"
            style={{ marginTop: '8px', color: '#007bff', textDecoration: 'none' }}
        >
          To check your update, Click here
        </a>
            <a
               onClick={handleCancel}
            >
                Cancel
            </a>
        </div>
    </div>
    );
    const CustomToastPgae8 = () => (
        // <div>
        //   <p>Update Photo Section</p>
        //   <a href="/admin/member/add/page8?mqPJZGktGjd7NoNAGCsj92fnYYj1&edit"  rel="noopener noreferrer">Click here for more info</a>
        // </div>
        // <div className="Custom_tost">
        //     <div style={{ display: 'flex', alignItems: 'center' }}>
        //         <span style={{ color: 'green', fontSize: '16px', marginRight: '8px' }}>✔</span>
        //         <p style={{ margin: 0 }}>Update Photo Section</p>
        //     </div>
        //     <a
        //         href={`/admin/member/add/page8?${getUserdata?.user_id}&edit`}
        //         rel="noopener noreferrer"
        //         style={{ marginTop: '8px', color: '#007bff', textDecoration: 'none' }}
        //     >
        //       To check your update, Click here
        //     </a>
        // </div>
        <div className="Custom_tost">
        <div>
            <span style={{ color: 'green', fontSize: '16px', marginRight: '8px' }}><CheckOutlined /></span>
            <p style={{ margin: 0 }}>You have successfully updated the form</p>
        </div>
        <div className="Btns"> <a
           href={`/admin/member/add/page8?${getUserdata?.user_id}&edit`}
            rel="noopener noreferrer"
            style={{ marginTop: '8px', color: '#007bff', textDecoration: 'none' }}
        >
          To check your update, Click here
        </a>
            <a
               onClick={handleCancel}
            >
                Cancel
            </a>
        </div>
    </div>
    );


const getSeasonByReviewMonth = (month: number): string =>
    month >= 1 && month <= 6 ? 'Spring' : month >= 7 && month <= 12 ? 'Fall' : 'Invalid Month';


const meeting_review_month:any= dayjs(getUserdata?.meetings?.lastMeeting?.start_meeting_date).format("MM")
const season_review_month = getSeasonByReviewMonth(meeting_review_month);
console.log(season_review_month,"season");

const meeting_review_year= dayjs(getUserdata?.meetings?.lastMeeting?.start_meeting_date).format("YYYY")
console.log(meeting_review_year,"meeting_review_year");


const meeting_prepration_month:any= dayjs(getUserdata?.meetings?.NextMeeting?.start_meeting_date).format("MM")
const season_prepration_month = getSeasonByReviewMonth(meeting_prepration_month);
console.log(season_prepration_month,"season_prepration_month");



const meeting_prepration_year= dayjs(getUserdata?.meetings?.NextMeeting?.start_meeting_date).format("YYYY")
console.log(meeting_prepration_year,"meeting_prepration_year");

    return (
        <>
            <Fragment>
                <section>
                    {/* <ToastContainer /> */}
                    {getUserdata?.is_admin == false ?
                        <Row gutter={[20, 20]}>
                            <Col span={24}>
                                <Card className='common-card'>
                                    <div>
                                        <div className='mb-4'>
                                            <Breadcrumb separator=">">
                                                <Breadcrumb.Item>Home</Breadcrumb.Item>
                                                <Breadcrumb.Item className='text-decoration-none'>Questionnaire</Breadcrumb.Item>
                                            </Breadcrumb>
                                        </div>
                                        <div className='d-flex justify-content-between align-items-center mb-5'>
                                            <Title level={3} className='m-0 fw-bold'>Questionnaire</Title>
                                        </div>
                                        { value == "page2" ?
                                        (showToast) && <CustomToastpage2 />:""}
                                        { value == "page3" ?
                                        (showToast) && <CustomToastpage3 />:""}
                                        { value == "page4" ?
                                        (showToast) && <CustomToastpage4 />:""}
                                        { value == "page5" ?
                                        (showToast) && <CustomToastpage5 />:""}
                                        { value == "page6" ?
                                        (showToast) && <CustomToastpage6 />:""}
                                        { value == "page7" ?
                                        (showToast) && <CustomToastpage7 />:""}
                                        { value == "additionalPage" ?
                                        (showToast) && <CustomToastAdditonalPage />:""}
                                        { value == "page8" ?
                                        (showToast) && <CustomToastPgae8/>:""}
                                        <Row gutter={[20, 20]}>
                                            {/* {data.map((item, index) => ( */}
                                            {getUserdata?.template_access?.includes("bussiness_update") &&
                                                // <Col  span={8}>
                                                //     <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                //         <div className="card-body pb-2 d-flex flex-column">
                                                //             <div className="justify-content-between align-items-center d-flex">
                                                //                 <h5 className="fw-bold text-start mb-4">BUSINESS UPDATE</h5>
                                                //                 <Tooltip title="Download Pdf">
                                                //                     <Button onClick={downLoadPdf}><DownloadOutlined /></Button>
                                                //                 </Tooltip>
                                                //             </div>
                                                //             <Link
                                                //                 href={`${baseURL}/page2?${xyz}&edit&questionnair`}
                                                //                 className='text-decoration-none text-white flex-grow-1'
                                                //             >
                                                //                 <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                //                     <div className="mt-2">
                                                //                         <Button  >
                                                //                             Update
                                                //                         </Button>
                                                //                     </div>
                                                //                 </div>
                                                //             </Link>
                                                //         </div>
                                                //     </Card>
                                                // </Col>
                                                <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                                                <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                    <div className="card-body pb-2 d-flex flex-column">
                                                        <div className="justify-content-between align-items-center d-flex">
                                                            <h5 className="fw-bold text-start mb-4">BUSINESS UPDATE</h5>
                                                            {state1?.businessUpdate?.length?
                                                            <Tooltip title="Download Pdf">
                                                                <Button className="borderBtn" onClick={downLoadPdf}><DownloadOutlined /></Button>
                                                            </Tooltip>:""}
                                                        </div>
                                                        <Link
                                                            href={`${baseURL}/page2?${xyz}&edit&questionnair`}
                                                            className='text-decoration-none text-white flex-grow-1'
                                                        >
                                                            <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                                <div className="mt-2">
                                                                    <Button  className="borderBtn">
                                                                        Update
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            
                                                            </Link>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            }
                                            {getUserdata?.template_access?.includes("goals") &&
                                                // <Col  span={8}>
                                                //     <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                //         <div className="card-body pb-2 d-flex flex-column">
                                                //             <div className="justify-content-between align-items-center d-flex">
                                                //                 <h5 className="fw-bold text-start mb-4">GOALS</h5>
                                                //                 <Tooltip title="Download Pdf">
                                                //                     <Button onClick={downLoadPdf2}><DownloadOutlined /></Button>
                                                //                 </Tooltip>
                                                //             </div>
                                                //             <Link
                                                //                 href={`${baseURL}/page3?${xyz}&edit&questionnair`}
                                                //                 className='text-decoration-none text-white flex-grow-1'
                                                //             >
                                                //                 <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                //                     <div className="mt-2">
                                                //                         <Button  >
                                                //                             Update
                                                //                         </Button>
                                                //                     </div>
                                                //                 </div>
                                                //             </Link>
                                                //         </div>
                                                //     </Card>
                                                // </Col>
                                                <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                                                <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                    <div className="card-body pb-2 d-flex flex-column">
                                                        <div className="justify-content-between align-items-center d-flex">
                                                            <h5 className="fw-bold text-start mb-4">GOALS</h5>
                                                            {state1?.lastNextMeetings?.length ?
                                                            <Tooltip title="Download Pdf">
                                                                <Button className="borderBtn" onClick={downLoadPdf2}><DownloadOutlined /></Button>
                                                            </Tooltip>
                                                            :
                                                            <Tooltip title="No Data Available">
                                                                <Button className="borderBtn" onClick={downLoadPdf2} disabled><DownloadOutlined /></Button>
                                                            </Tooltip>}
                                                        </div>
                                                        <Link
                                                            href={`${baseURL}/page3?${xyz}&edit&questionnair`}
                                                            className='text-decoration-none text-white flex-grow-1'
                                                        >
                                                            <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                                <div className="mt-2">
                                                                    <Button className="borderBtn" >
                                                                        Update
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                           
                                                            </Link>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            }
                                            {getUserdata?.template_access?.includes("craftsmen_toolbox") &&
                                                // <Col  span={8}>
                                                //     <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                //         <div className="card-body pb-2 d-flex flex-column">
                                                //             <div className="justify-content-between align-items-center d-flex">
                                                //                 <h5 className="fw-bold text-start mb-4">CRAFTSMEN TOOLBOX</h5>
                                                //                 <Tooltip title="Download Pdf">
                                                //                     <Button onClick={downLoadPdf3}><DownloadOutlined /></Button>
                                                //                 </Tooltip>
                                                //             </div>
                                                //             <Link
                                                //                 href={`${baseURL}/page4?${xyz}&edit&questionnair`}
                                                //                 className='text-decoration-none text-white flex-grow-1'
                                                //             >
                                                //                 <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                //                     <div className="mt-2">
                                                //                         <Button  >
                                                //                             Update
                                                //                         </Button>
                                                //                     </div>
                                                //                 </div>
                                                //             </Link>
                                                //         </div>
                                                //     </Card>
                                                // </Col>
                                                <Col  xs={24} sm={12} md={12} lg={12} xl={8}>
                                                <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                    <div className="card-body pb-2 d-flex flex-column">
                                                        <div className="justify-content-between align-items-center d-flex">
                                                            <h5 className="fw-bold text-start mb-4">CRAFTSMEN TOOLBOX</h5>
                                                            {state1?.technologyData?.length ?
                                                            <Tooltip title="Download Pdf">
                                                                <Button className="borderBtn" onClick={downLoadPdf3}><DownloadOutlined /></Button>
                                                            </Tooltip>:<Tooltip title="No Data Available">
                                                                <Button className="borderBtn" onClick={downLoadPdf3} disabled><DownloadOutlined /></Button>
                                                            </Tooltip>}
                                                            {/* <Tooltip title="Download Pdf">
                                                                <Button onClick={downLoadPdf3}><DownloadOutlined /></Button>
                                                            </Tooltip> */}
                                                        </div>
                                                        <Link
                                                            href={`${baseURL}/page4?${xyz}&edit&questionnair`}
                                                            className='text-decoration-none text-white flex-grow-1'
                                                        >
                                                            <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                                <div className="mt-2">
                                                                    <Button  className="borderBtn">
                                                                        Update
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                           
                                                            </Link>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            }
                                           
                                            {getUserdata?.template_access?.includes("craftsmen_checkup") &&
                                                // <Col  span={8}>
                                                //     <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                //         <div className="card-body pb-2 d-flex flex-column">
                                                //             <div className="justify-content-between align-items-center d-flex">
                                                //                 <h5 className="fw-bold text-start mb-4">CRAFTSMEN CHECK-UP</h5>
                                                //                 <Tooltip title="Download Pdf">
                                                //                     <Button onClick={downLoadPdf4}><DownloadOutlined /></Button>
                                                //                 </Tooltip>
                                                //             </div>
                                                //             <Link
                                                //                 href={`${baseURL}/page5?${xyz}&edit&questionnair`}
                                                //                 className='text-decoration-none text-white flex-grow-1'
                                                //             >
                                                //                 <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                //                     <div className="mt-2">
                                                //                         <Button  >
                                                //                             Update
                                                //                         </Button>
                                                //                     </div>
                                                //                 </div>
                                                //             </Link>
                                                //         </div>
                                                //     </Card>
                                                // </Col>
                                                <Col  xs={24} sm={12} md={12} lg={12} xl={8}>
                                                <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                    <div className="card-body pb-2 d-flex flex-column">
                                                        <div className="justify-content-between align-items-center d-flex">
                                                            <h5 className="fw-bold text-start mb-4">CRAFTSMEN CHECK-UP</h5>
                                                            {state1?.craftsMenUpdates?.length ?
                                                            <Tooltip title="Download Pdf">
                                                                <Button className="borderBtn" onClick={downLoadPdf4}><DownloadOutlined /></Button>
                                                            </Tooltip>:<Tooltip title="No Data Available">
                                                                <Button className="borderBtn" onClick={downLoadPdf4} disabled><DownloadOutlined /></Button>
                                                            </Tooltip>}
                                                            {/* <Tooltip title="Download Pdf">
                                                                <Button onClick={downLoadPdf4}><DownloadOutlined /></Button>
                                                            </Tooltip> */}
                                                        </div>
                                                        <Link
                                                            href={`${baseURL}/page5?${xyz}&edit&questionnair`}
                                                            className='text-decoration-none text-white flex-grow-1'
                                                        >
                                                            <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                                <div className="mt-2">
                                                                    <Button  className="borderBtn">
                                                                        Update
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                           
                                                            </Link>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            }



{getUserdata?.template_access?.includes("personalWellBeingUpdates") &&
                                              
                                              <Col  xs={24} sm={12} md={12} lg={12} xl={8}>
                                              <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                  <div className="card-body pb-2 d-flex flex-column">
                                                      <div className="justify-content-between align-items-center d-flex">
                                                          <h5 className="fw-bold text-start mb-4">PERSONAL WELL-BEING CHECK-IN</h5>
                                                          {state1?.craftsMenUpdates?.length ?
                                                          <Tooltip title="Download Pdf">
                                                              <Button className="borderBtn" onClick={downLoadPdf4}><DownloadOutlined /></Button>
                                                          </Tooltip>:<Tooltip title="No Data Available">
                                                              <Button className="borderBtn" onClick={downLoadPdf4} disabled><DownloadOutlined /></Button>
                                                          </Tooltip>}
                                                          {/* <Tooltip title="Download Pdf">
                                                              <Button onClick={downLoadPdf4}><DownloadOutlined /></Button>
                                                          </Tooltip> */}
                                                      </div>
                                                      <Link
                                                          href={`${baseURL}/well_being_check_in?${xyz}&edit&questionnair`}
                                                          className='text-decoration-none text-white flex-grow-1'
                                                      >
                                                          <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                              <div className="mt-2">
                                                                  <Button  className="borderBtn">
                                                                      Update
                                                                  </Button>
                                                              </div>
                                                          </div>
                                                         
                                                          </Link>
                                                      </div>
                                                  </Card>
                                              </Col>
                                          }
{getUserdata?.template_access?.includes("businessEvolutionIndustryTrendsUpdates") &&
                                              
                                              <Col  xs={24} sm={12} md={12} lg={12} xl={8}>
                                              <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                  <div className="card-body pb-2 d-flex flex-column">
                                                      <div className="justify-content-between align-items-center d-flex">
                                                          <h5 className="fw-bold text-start mb-4">BUSINESS EVOLUTION & INDUSTRY TRENDS</h5>
                                                          {state1?.craftsMenUpdates?.length ?
                                                          <Tooltip title="Download Pdf">
                                                              <Button className="borderBtn" onClick={downLoadPdf4}><DownloadOutlined /></Button>
                                                          </Tooltip>:<Tooltip title="No Data Available">
                                                              <Button className="borderBtn" onClick={downLoadPdf4} disabled><DownloadOutlined /></Button>
                                                          </Tooltip>}
                                                          {/* <Tooltip title="Download Pdf">
                                                              <Button onClick={downLoadPdf4}><DownloadOutlined /></Button>
                                                          </Tooltip> */}
                                                      </div>
                                                      <Link
                                                          href={`${baseURL}/business_evolution?${xyz}&edit&questionnair`}
                                                          className='text-decoration-none text-white flex-grow-1'
                                                      >
                                                          <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                              <div className="mt-2">
                                                                  <Button  className="borderBtn">
                                                                      Update
                                                                  </Button>
                                                              </div>
                                                          </div>
                                                         
                                                          </Link>
                                                      </div>
                                                  </Card>
                                              </Col>
                                          }

                                            {getUserdata?.template_access?.includes("fall_meeting_review") &&
                                                // <Col  span={8}>
                                                //     <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                //         <div className="card-body pb-2 d-flex flex-column">
                                                //             <div className="justify-content-between align-items-center d-flex">
                                                //                 <h5 className="fw-bold text-start mb-4">SPRING 2024 MEETING REVIEW</h5>
                                                //                 <Tooltip title="Download Pdf">
                                                //                     <Button onClick={downLoadPdf5}><DownloadOutlined /></Button>
                                                //                 </Tooltip>
                                                //             </div>
                                                //             <Link
                                                //                 href={`${baseURL}/page6?${xyz}&edit&questionnair`}
                                                //                 className='text-decoration-none text-white flex-grow-1'
                                                //             >
                                                //                 <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                //                     <div className="mt-2">
                                                //                         <Button  >
                                                //                             Update
                                                //                         </Button>
                                                //                     </div>
                                                //                 </div>
                                                //             </Link>
                                                //         </div>
                                                //     </Card>
                                                // </Col>
                                                <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                                                    <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                        <div className="card-body pb-2 d-flex flex-column">
                                                            <div className="justify-content-between align-items-center d-flex">
                                                                <h5 className="fw-bold text-start mb-4">{season_review_month} {meeting_review_year} MEETING REVIEW</h5>
                                                                {state1?.meetingReviews?.length ?
                                                                <Tooltip title="Download Pdf">
                                                                    <Button className="borderBtn" onClick={downLoadPdf5}><DownloadOutlined /></Button>
                                                                </Tooltip>:<Tooltip title="No Data Available">
                                                                    <Button className="borderBtn" onClick={downLoadPdf5} disabled><DownloadOutlined /></Button>
                                                                </Tooltip>}
                                                                {/* <Tooltip title="Download Pdf">
                                                                    <Button onClick={downLoadPdf5}><DownloadOutlined /></Button>
                                                                </Tooltip> */}
                                                            </div>
                                                            <Link
                                                                href={`${baseURL}/page6?${xyz}&edit&questionnair`}
                                                                className='text-decoration-none text-white flex-grow-1'
                                                            >
                                                                <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                                    <div className="mt-2">
                                                                        <Button  className="borderBtn">
                                                                            Update
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            }
                                            {getUserdata?.template_access?.includes("spring_meeting") &&
                                                // <Col  span={8}>
                                                //     <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                //         <div className="card-body pb-2 d-flex flex-column">
                                                //             <div className="justify-content-between align-items-center d-flex">
                                                //                 <h5 className="fw-bold text-start mb-4">FALL 2024 MEETING PREPARATION</h5>
                                                //                 <Tooltip title="Download Pdf">
                                                //                     <Button onClick={downLoadPdf6}><DownloadOutlined /></Button>
                                                //                 </Tooltip>
                                                //             </div>
                                                //             <Link
                                                //                 href={`${baseURL}/page7?${xyz}&edit&questionnair`}
                                                //                 className='text-decoration-none text-white flex-grow-1'
                                                //             >
                                                //                 <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                //                     <div className="mt-2">
                                                //                         <Button  >
                                                //                             Update
                                                //                         </Button>
                                                //                     </div>
                                                //                 </div>
                                                //             </Link>
                                                //         </div>
                                                //     </Card>
                                                // </Col>
                                                <Col  xs={24} sm={12} md={12} lg={12} xl={8}>
                                                <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                    <div className="card-body pb-2 d-flex flex-column">
                                                        <div className="justify-content-between align-items-center d-flex">
                                                            <h5 className="fw-bold text-start mb-4">{season_prepration_month} {meeting_prepration_year} MEETING PREPARATION</h5>
                                                            {state1?.roundTableTopics?.length?
                                                            <Tooltip title="Download Pdf">
                                                                <Button className="borderBtn" onClick={downLoadPdf6}><DownloadOutlined /></Button>
                                                            </Tooltip>:<Tooltip title="No Data Available">
                                                                <Button className="borderBtn" onClick={downLoadPdf6} disabled><DownloadOutlined /></Button>
                                                            </Tooltip>}
                                                            {/* <Tooltip title="Download Pdf">
                                                                <Button onClick={downLoadPdf6}><DownloadOutlined /></Button>
                                                            </Tooltip> */}
                                                        </div>
                                                        <Link
                                                            href={`${baseURL}/page7?${xyz}&edit&questionnair`}
                                                            className='text-decoration-none text-white flex-grow-1'
                                                        >
                                                            <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                                <div className="mt-2">
                                                                    <Button  className="borderBtn">
                                                                        Update
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            
                                                            </Link>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            }
                                            {getUserdata?.template_access?.includes("additional_question") &&
                                                <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                                                    <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                        <div className="card-body pb-2 d-flex flex-column">
                                                            <div className="justify-content-between align-items-center d-flex">
                                                                <h5 className="fw-bold text-start mb-4">ADDITIONAL QUESTIONS</h5>
                                                                {state1?.answer?.length ?
                                                                <Tooltip title="Download Pdf">
                                                                    <Button  onClick={downLoadPdf8} className="borderBtn"><DownloadOutlined /></Button>
                                                                </Tooltip>
                                                                :
                                                                <Tooltip title="Download Pdf">
                                                                <Button  onClick={downLoadPdf8} disabled className="borderBtn"><DownloadOutlined /></Button>
                                                            </Tooltip>}
                                                            </div>
                                                            <Link
                                                                href={`${baseURL}/additional_questionnaire?${xyz}&edit&questionnair`}
                                                                className='text-decoration-none text-white flex-grow-1'
                                                            >
                                                                <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                                    <div className="mt-2">
                                                                        <Button className="borderBtn" >
                                                                            Update
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            }
                                            {getUserdata?.template_access?.includes("photo_section") &&
                                                // <Col  span={8}>
                                                //     <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                //         <div className="card-body pb-2 d-flex flex-column">
                                                //             <div className="justify-content-between align-items-center d-flex">
                                                //                 <h5 className="fw-bold text-start mb-4">PHOTO SECTION</h5>
                                                //                 <Tooltip title="Download Pdf">
                                                //                     <Button onClick={downLoadPdf7}><DownloadOutlined /></Button>
                                                //                 </Tooltip>
                                                //             </div>
                                                //             <Link
                                                //                 href={`${baseURL}/page8?${xyz}&edit&questionnair`}
                                                //                 className='text-decoration-none text-white flex-grow-1'
                                                //             >
                                                //                 <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                //                     <div className="mt-2">
                                                //                         <Button  >
                                                //                             Update
                                                //                         </Button>
                                                //                     </div>
                                                //                 </div>
                                                //             </Link>
                                                //         </div>
                                                //     </Card>
                                                // </Col>
                                                <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                                                    <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                        <div className="card-body pb-2 d-flex flex-column">
                                                            <div className="justify-content-between align-items-center d-flex">
                                                                <h5 className="fw-bold text-start mb-4">PHOTO SECTION</h5>

                                                                {/* <Tooltip title="Download Pdf">
                                                                    <Button onClick={downLoadPdf7}><DownloadOutlined /></Button>
                                                                </Tooltip> */}
                                                                {state1?.photo_section ?
                                                                <Tooltip title="Download Pdf">
                                                                    <Button className="borderBtn"  onClick={downLoadPdf7}><DownloadOutlined /></Button>
                                                                </Tooltip>:<Tooltip title="No Data Available">
                                                                    <Button className="borderBtn" onClick={downLoadPdf7} disabled><DownloadOutlined /></Button>
                                                                </Tooltip>}
                                                            </div>
                                                            <Link
                                                                href={`${baseURL}/page8?${xyz}&edit&questionnair`}
                                                                className='text-decoration-none text-white flex-grow-1'
                                                            >
                                                                <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                                    <div className="mt-2">
                                                                        <Button className="borderBtn" >
                                                                            Update
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            }
                                            {/* ))} */}
                                        </Row>
                                        {getUserdata?.is_additional_user == false &&
                                            <Row gutter={[20, 20]} className="flex-wrap">
                                                {/* {data.map((item, index) => ( */}
                                                <Col xs={24} sm={12} md={12} lg={12} xl={8} >
                                                    <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                        <div className="card-body pb-2 d-flex flex-column">
                                                            <div className="justify-content-between align-items-center d-flex">
                                                                <h5 className="fw-bold text-start mb-4">BUSINESS UPDATE</h5>
                                                                {state1?.businessUpdate?.length ?
                                                                <Tooltip title="Download Pdf">
                                                                    <Button className="borderBtn" onClick={downLoadPdf}><DownloadOutlined /></Button>
                                                                </Tooltip>:""}
                                                            </div>
                                                            <Link
                                                                href={`${baseURL}/page2?${xyz}&edit&questionnair`}
                                                                className='text-decoration-none text-white flex-grow-1'
                                                            >
                                                                <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                                    <div className="mt-2">
                                                                        <Button  className="borderBtn">
                                                                            Update
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </Card>
                                                </Col>
                                                <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                                                    <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                        <div className="card-body pb-2 d-flex flex-column">
                                                            <div className="justify-content-between align-items-center d-flex">
                                                                <h5 className="fw-bold text-start mb-4">GOALS</h5>
                                                                {state1?.lastNextMeetings?.length ?
                                                                <Tooltip title="Download Pdf">
                                                                    <Button className="borderBtn" onClick={downLoadPdf2}><DownloadOutlined /></Button>
                                                                </Tooltip>:<Tooltip title="No Data Available">
                                                                    <Button className="borderBtn" onClick={downLoadPdf2} disabled><DownloadOutlined /></Button>
                                                                </Tooltip>}
                                                            </div>
                                                            <Link
                                                                href={`${baseURL}/page3?${xyz}&edit&questionnair`}
                                                                className='text-decoration-none text-white flex-grow-1'
                                                            >
                                                                <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                                    <div className="mt-2">
                                                                        <Button  className="borderBtn">
                                                                            Update
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </Card>
                                                </Col>
                                                <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                                                    <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                        <div className="card-body pb-2 d-flex flex-column">
                                                            <div className="justify-content-between align-items-center d-flex">
                                                                <h5 className="fw-bold text-start mb-4">CRAFTSMEN TOOLBOX</h5>
                                                                {state1?.technologyData?.length ?
                                                                <Tooltip title="Download Pdf">
                                                                    <Button className="borderBtn" onClick={downLoadPdf3}><DownloadOutlined /></Button>
                                                                </Tooltip>:<Tooltip title="No Data Available">
                                                                    <Button className="borderBtn" onClick={downLoadPdf3} disabled><DownloadOutlined /></Button>
                                                                </Tooltip>}
                                                                {/* <Tooltip title="Download Pdf">
                                                                    <Button onClick={downLoadPdf3}><DownloadOutlined /></Button>
                                                                </Tooltip> */}
                                                            </div>
                                                            <Link
                                                                href={`${baseURL}/page4?${xyz}&edit&questionnair`}
                                                                className='text-decoration-none text-white flex-grow-1'
                                                            >
                                                                <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                                    <div className="mt-2">
                                                                        <Button className="borderBtn" >
                                                                            Update
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </Card>
                                                </Col>
                                                <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                                                    <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                        <div className="card-body pb-2 d-flex flex-column">
                                                            <div className="justify-content-between align-items-center d-flex">
                                                                <h5 className="fw-bold text-start mb-4">CRAFTSMEN CHECK-UP</h5>
                                                                {state1?.craftsMenUpdates?.length ?
                                                                <Tooltip title="Download Pdf">
                                                                    <Button className="borderBtn" onClick={downLoadPdf4}><DownloadOutlined /></Button>
                                                                </Tooltip>:<Tooltip title="No Data Available">
                                                                    <Button className="borderBtn" onClick={downLoadPdf4} disabled><DownloadOutlined /></Button>
                                                                </Tooltip>}
                                                                {/* <Tooltip title="Download Pdf">
                                                                    <Button onClick={downLoadPdf4}><DownloadOutlined /></Button>
                                                                </Tooltip> */}
                                                            </div>
                                                            <Link
                                                                href={`${baseURL}/page5?${xyz}&edit&questionnair`}
                                                                className='text-decoration-none text-white flex-grow-1'
                                                            >
                                                                <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                                    <div className="mt-2">
                                                                        <Button  className="borderBtn">
                                                                            Update
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </Card>
                                                </Col>



                                                
                                              
                                              <Col  xs={24} sm={12} md={12} lg={12} xl={8}>
                                              <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                  <div className="card-body pb-2 d-flex flex-column">
                                                      <div className="justify-content-between align-items-center d-flex">
                                                          <h5 className="fw-bold text-start mb-4">PERSONAL WELL-BEING CHECK-IN</h5>
                                                          {state1?.craftsMenUpdates?.length ?
                                                          <Tooltip title="Download Pdf">
                                                              <Button className="borderBtn" onClick={downLoadPdfWellBeing}><DownloadOutlined /></Button>
                                                          </Tooltip>:<Tooltip title="No Data Available">
                                                              <Button className="borderBtn" onClick={downLoadPdfWellBeing} disabled><DownloadOutlined /></Button>
                                                          </Tooltip>}
                                                          {/* <Tooltip title="Download Pdf">
                                                              <Button onClick={downLoadPdf4}><DownloadOutlined /></Button>
                                                          </Tooltip> */}
                                                      </div>
                                                      <Link
                                                          href={`${baseURL}/well_being_check_in?${xyz}&edit&questionnair`}
                                                          className='text-decoration-none text-white flex-grow-1'
                                                      >
                                                          <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                              <div className="mt-2">
                                                                  <Button  className="borderBtn">
                                                                      Update
                                                                  </Button>
                                                              </div>
                                                          </div>
                                                         
                                                          </Link>
                                                      </div>
                                                  </Card>
                                              </Col>
                                              <Col  xs={24} sm={12} md={12} lg={12} xl={8}>
                                              <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                  <div className="card-body pb-2 d-flex flex-column">
                                                      <div className="justify-content-between align-items-center d-flex">
                                                          <h5 className="fw-bold text-start mb-4">BUSINESS EVOLUTION & INDUSTRY TRENDS</h5>
                                                          {state1?.craftsMenUpdates?.length ?
                                                          <Tooltip title="Download Pdf">
                                                              <Button className="borderBtn" onClick={downLoadPdfBusinessEvolution}><DownloadOutlined /></Button>
                                                          </Tooltip>:<Tooltip title="No Data Available">
                                                              <Button className="borderBtn" onClick={downLoadPdfBusinessEvolution} disabled><DownloadOutlined /></Button>
                                                          </Tooltip>}
                                                          {/* <Tooltip title="Download Pdf">
                                                              <Button onClick={downLoadPdf4}><DownloadOutlined /></Button>
                                                          </Tooltip> */}
                                                      </div>
                                                      <Link
                                                          href={`${baseURL}/business_evolution?${xyz}&edit&questionnair`}
                                                          className='text-decoration-none text-white flex-grow-1'
                                                      >
                                                          <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                              <div className="mt-2">
                                                                  <Button  className="borderBtn">
                                                                      Update
                                                                  </Button>
                                                              </div>
                                                          </div>
                                                         
                                                          </Link>
                                                      </div>
                                                  </Card>
                                              </Col>
                                          
                                                <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                                                    <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                        <div className="card-body pb-2 d-flex flex-column">
                                                            <div className="justify-content-between align-items-center d-flex">
                                                                <h5 className="fw-bold text-start mb-4">{season_review_month} {meeting_review_year} MEETING REVIEW</h5>
                                                                {state1?.meetingReviews?.length ?
                                                                <Tooltip title="Download Pdf">
                                                                    <Button className="borderBtn" onClick={downLoadPdf5}><DownloadOutlined /></Button>
                                                                </Tooltip>:<Tooltip title="No Data Available">
                                                                    <Button className="borderBtn" onClick={downLoadPdf5} disabled><DownloadOutlined /></Button>
                                                                </Tooltip>}
                                                                {/* <Tooltip title="Download Pdf">
                                                                    <Button onClick={downLoadPdf5}><DownloadOutlined /></Button>
                                                                </Tooltip> */}
                                                            </div>
                                                            <Link
                                                                href={`${baseURL}/page6?${xyz}&edit&questionnair`}
                                                                className='text-decoration-none text-white flex-grow-1'
                                                            >
                                                                <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                                    <div className="mt-2">
                                                                        <Button  className="borderBtn">
                                                                            Update
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </Card>
                                                </Col>
                                                <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                                                    <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                        <div className="card-body pb-2 d-flex flex-column">
                                                            <div className="justify-content-between align-items-center d-flex">
                                                                <h5 className="fw-bold text-start mb-4">ROUNDTABLE TOPICS</h5>
                                                                {/* <h5 className="fw-bold text-start mb-4">{season_prepration_month} {meeting_prepration_year} MEETING PREPARATION</h5> */}
                                                                {state1?.roundTableTopics?.length ?
                                                                <Tooltip title="Download Pdf">
                                                                    <Button className="borderBtn" onClick={downLoadPdf6}><DownloadOutlined /></Button>
                                                                </Tooltip>:<Tooltip title="No Data Available">
                                                                    <Button className="borderBtn" onClick={downLoadPdf6} disabled><DownloadOutlined /></Button>
                                                                </Tooltip>}
                                                                {/* <Tooltip title="Download Pdf">
                                                                    <Button onClick={downLoadPdf6}><DownloadOutlined /></Button>
                                                                </Tooltip> */}
                                                            </div>
                                                            <Link
                                                                href={`${baseURL}/page7?${xyz}&edit&questionnair`}
                                                                className='text-decoration-none text-white flex-grow-1'
                                                            >
                                                                <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                                    <div className="mt-2">
                                                                        <Button className="borderBtn" >
                                                                            Update
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </Card>
                                                </Col>

                                                {/* Additional Questionannair */}
                                                
                                                {/* <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                                                    <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                        <div className="card-body pb-2 d-flex flex-column">
                                                            <div className="justify-content-between align-items-center d-flex">
                                                                <h5 className="fw-bold text-start mb-4">ADDITIONAL QUESTIONS</h5>
                                                                {state1?.answer?.length ?
                                                                <Tooltip title="Download Pdf">
                                                                    <Button className="borderBtn" onClick={downLoadPdf8}><DownloadOutlined /></Button>
                                                                </Tooltip>:
                                                                <Tooltip title="Download Pdf">
                                                                    <Button className="borderBtn" disabled onClick={downLoadPdf8}><DownloadOutlined /></Button>
                                                                </Tooltip>}
                                                            </div>
                                                            <Link
                                                                href={`${baseURL}/additional_questionnaire?${xyz}&edit&questionnair`}
                                                                className='text-decoration-none text-white flex-grow-1'
                                                            >
                                                                <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                                    <div className="mt-2">
                                                                        <Button  className="borderBtn">
                                                                            Update
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </Card>
                                                </Col> */}
                                                <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                                                    <Card className='common-card' style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                                                        <div className="card-body pb-2 d-flex flex-column">
                                                            <div className="justify-content-between align-items-center d-flex">
                                                                <h5 className="fw-bold text-start mb-4">PHOTO SECTION</h5>

                                                                {/* <Tooltip title="Download Pdf">
                                                                    <Button onClick={downLoadPdf7}><DownloadOutlined /></Button>
                                                                </Tooltip> */}
                                                                {state1?.photo_section ?
                                                                <Tooltip title="Download Pdf">
                                                                    <Button className="borderBtn" onClick={downLoadPdf7}><DownloadOutlined /></Button>
                                                                </Tooltip>:<Tooltip title="No Data Available">
                                                                    <Button className="borderBtn" onClick={downLoadPdf7} disabled><DownloadOutlined /></Button>
                                                                </Tooltip>}
                                                            </div>
                                                            <Link
                                                                href={`${baseURL}/page8?${xyz}&edit&questionnair`}
                                                                className='text-decoration-none text-white flex-grow-1'
                                                            >
                                                                <div className="d-flex align-items-center flex-nowrap gap-2 mt-4">
                                                                    <div className="mt-2">
                                                                        <Button  className="borderBtn">
                                                                            Update
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </Card>
                                                </Col>
                                                {/* ))} */}
                                            </Row>}

                                        <style jsx>{`
                           .common-card {
                               border-radius: 10px;
                               overflow: hidden;
                           }
           
                           .mb-4 {
                               margin-bottom: 16px;
                           }
           
                           .d-flex {
                               display: flex;
                           }
           
                           .justify-content-between {
                               justify-content: space-between;
                           }
           
                           .align-items-center {
                               align-items: center;
                           }
           
                           .card-title {
                               font-size: 1rem;
                               text-align: start;
                               margin-bottom: 16px;
                           }
           
                           .card-body {
                               display: flex;
                               flex-direction: column;
                            
                           }
           
                           .btn {
                                display: inline-block;
                    font-weight: 400;
                    color: #ffffff !important; /* Ensure text is white */
                    text-align: center;
                    vertical-align: middle;
                    cursor: pointer;
                    user-select: none;
                    background-color: #1890ff;
                    border: 1px solid transparent;
                    padding: 0.375rem 0.75rem;
                    font-size: 1rem;
                    line-height: 1.5;
                    border-radius: 0.25rem;
                    width: 100%;
                           }
           
                           .shadow-sm {
                              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                           }
           
                           .gap-2 {
                               gap: 8px;
                           }
           
                           .mt-auto {
                               margin-top: auto;
                           }
                       `}</style>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        :
                        <Row gutter={[20, 20]}>
                            <Col span={24}>
                                <Card className='common-card'>
                                    <div className='mb-4'>
                                        <Breadcrumb separator=">">
                                            <Breadcrumb.Item><Link className='text-decoration-none' href="/admin/dashboard">Home</Link></Breadcrumb.Item>
                                            <Breadcrumb.Item className='text-decoration-none'>Manage Questionnaire</Breadcrumb.Item>
                                        </Breadcrumb>
                                    </div>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <Typography.Title level={3} className='m-0 fw-bold' >Manage Questionnaire</Typography.Title>
                                    </div>
                                    <div className='my-4 d-flex justify-content-between align-items-center gap-3'>
                                        <Search size="large" placeholder="Search..." enterButton value={searchTerm} onChange={handleSearch} />
                                        {/* <Tooltip title="Download Pdf">
                                            <Button type="primary" onClick={downLoadPdf}><DownloadOutlined /> Download Pdf</Button>
                                        </Tooltip> */}
                                    </div>
                                    <div className='accordion-wrapper'>
                                        <Table dataSource={dataSource} columns={columns} pagination={{
                                            position: ['bottomCenter'],
                                        }} />
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                    }
                    {/* <CustomModal type={"Add"}/> */}
                    {/* Accordion  */}

                    {/* <QuestionFilter questionType={questionType} handleChange={handleChange}/> */}
                    {/* <Pagination current={Number(router.query.pagination) || 1} pageSize={Number(router.query.limit) || 10} total={state.count} hideOnSinglePage={true} disabled={loading} onChange={handlePagination} /> */}


                </section>
            </Fragment >
        </>
    );
};

export default QuestionnairList;
