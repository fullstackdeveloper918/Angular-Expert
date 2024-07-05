import { useState } from 'react'
// import { Link } from 'react-router-dom'
import { useContext } from "react";
// import { GlobalContext } from '../../context/Provider';
// import Swal from 'sweetalert2';
import defaultUserImg from '../../assets/image/defaultUserImg.jpg';
import Link from 'next/link';
// import henceforthApi from '../../utils/henceforthApi';
const TheHeader = (props: any) => {

    // const { logOutNow, authState } = useContext(GlobalContext);
    // const roles = (Array.isArray(authState.access_role_name) ? authState.access_role_name : [])
    const [hideShow, setHideShow] = useState(true)

    const toggleHandler = () => {
        setHideShow(!hideShow)
        props.changeDiv(!hideShow)
    }

    const logoutUser = async () => {
        // Swal.fire({
        //     title: "Are you sure you want to logout?",
        //     showCancelButton: true,
        //     confirmButtonColor: "#FE0002",
        //     cancelButtonColor: "transparent",
        //     confirmButtonText: "Yes, Confirm",
        // }).then(async (result: any) => {
        //     if (result.isConfirmed) return logOutNow()
        // })
    }
    return (

        <div className="container-fluid">
            <div className="row">
                <nav className="navbar d-flex justify-content-between align-items-center py-3 px-4" role="navigation" style={{ marginBottom: "0" }}>
                    {/* left side  */}
                    <div className="navbar-header">
                        <button className="btn btn-primary shadow-none rounded-1" onClick={toggleHandler}><i className="fa fa-bars"></i></button>
                        {/* serach  */}

                    </div>

                    {/* right side  */}
                    <ul className="nav gap-3 main-nav align-items-center">
                        {!hideShow ? <li>
                            <div className="desktop-screen">
                                <div className="dropdown">
                                    <button className="btn shadow-none border-0 dropdown-toggle p-0 fw-bold mt-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {/* <img src={authState.profile_pic ? `${henceforthApi.API_FILE_ROOT_ORIGINAL}${authState.profile_pic}` : defaultUserImg} className='img-fluid rounded-circle pb-1' alt="img" width={45} height={45} /> */}
                                        {/* {authState.name ? `${authState.name}` : "John Doe "} */}
                                    </button>
                                    <ul className="dropdown-menu py-0 overflow-hidden">
                                        <li className='px-2 pt-2'><Link className="dropdown-item" href="/profile">Profile</Link></li>
                                        {/* {(authState.role_id === 1) && */}
                                            <li className='px-2 pt-2'><Link className="dropdown-item" href="/staffs/1">Staff Management</Link></li>
                                        <li className='px-2 pt-2'><Link className="dropdown-item" href="/change-password">Change Password</Link></li>
                                        <li className='divider'></li>
                                        <li className='px-2 py-2'><button className="dropdown-item" onClick={logoutUser}>Logout</button></li>
                                    </ul>
                                </div>
                            </div>
                        </li> : ''}
                        <li>
                            <button type="button" className="btn btn-primary py-2 px-4 shadow-none logout-btn border-0 fw-fw-semibold" onClick={logoutUser}  >
                                <i className="fa fa-sign-out"></i> Log out
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

    )
}

export default TheHeader;