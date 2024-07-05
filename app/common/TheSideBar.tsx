// import { Link, useLocation } from 'react-router-dom';
// import henceforthApi from '../../utils/henceforthApi';
import { useContext, useState } from 'react';
// import { GlobalContext } from '../../context/Provider';


import Link from 'next/link';

// import Swal from 'sweetalert2';
interface stryleCategory {
    _id: string
    name: string
}
const TheSideBar = (props: any) => {
    let clearway = 'clearway'
    let poll = 'poll'
    let Privacy = 'Privacy'
    let Terms = 'Terms'
    let donations = 'donations'
    // const { authState, logOutNow } = useContext(GlobalContext);
    // const roles = (Array.isArray(authState.access_role_name) ? authState.access_role_name : [])
    // const location = useLocation()
    // henceforthApi.setToken(authState.access_token);
    const [hover, setHover] = useState('')
    const onHover = (hover: string) => {
        if (hover === clearway) {
            setHover(clearway)
        }
        else if (hover === poll) {
            setHover(poll)
        }
        else if (hover === Privacy) {
            setHover(Privacy)
        }
        else if (hover === Terms) {
            setHover(Terms)
        }
        else if (hover === donations) {
            setHover(donations)
        }

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
        <>
            <div>
                {/* sidebar Header  */}
                <div className="sidebar-header">

                    <div className='desktop-screen pt-4 border-bottom'>
                        {/* user detail  */}
                        <div className="user-detail-box">
                            {/* <img src={authState.profile_pic ? `${henceforthApi.API_FILE_ROOT_SMALL}${authState.profile_pic}` : defaultUserImg} className='img-fluid rounded-circle' alt="img" /> */}
                        </div>
                        <h6 className='user-name mt-3'>John</h6>
                        <div className="dropdown-center">
                          <button className="btn shadow-none border-0 dropdown-toggle p-0 fw-bold mt-3" type="button" data-bs-toggle="dropdown" aria-expanded="false"/>
                                 <span className='text-muted'>{"John Doe "}</span>
                            <ul className="dropdown-menu pt-2 overflow-hidden">
                                <li><Link className="dropdown-item" href="/profile">Profile</Link></li>

                                <li><Link className="dropdown-item" href="/staffs/1">Staff Management</Link></li>

                                <li><Link className="dropdown-item" href="/change-password">Change Password</Link></li>

                                <li className='divider'><hr className='mb-0' /></li>
                                <li><Link className="dropdown-item" href="" onClick={logoutUser}>Logout</Link></li>
                            </ul>
                        </div>
                    </div>

                </div>
                {/* navigation bar  */}
                <div className='navigation-bar'>
                    <div className="accordion" id="Navigation-bar">
                        {/* Dashboard */}
                        {/* {(roles.includes('1') || authState.role_id === 1) ? */}
                            <div className={`accordion-item rounded-0 ${location.pathname === '/' ? 'link-active' : ''}`} onClick={() => setHover('')}>
                                <h6 className="accordion-header">
                                    <Link href="/" className={`accordion-button shadow-none active d-flex align-items-center collapsed text-decoration-none single-link`}>
                                        <i className='fa fa-th-large me-3 fs-5'></i> {props.handled && <span>Dashboard</span>}
                                    </Link>
                                </h6>
                            </div> 

                        {/* {(roles.includes('2') || authState.role_id === 1) && */}
                            <div className={`accordion-item rounded-0 ${location.pathname.startsWith('/user') ? 'link-active' : ''}`} onClick={() => setHover('')}>
                                <h6 className="accordion-header">
                                    <Link href="/users/1" className="accordion-button shadow-none d-flex align-items-center collapsed text-decoration-none single-link">
                                        <i className='fa fa-users me-3 fs-5'></i> {props.handled && <span>User</span>}
                                    </Link>
                                </h6>
                            </div>

                        {/* Products  */}
                        {/* {(roles.includes('3') || authState.role_id === 1) && */}
                            <div className={`accordion-item rounded-0 ${location.pathname.startsWith('/clearwayzone') ? 'link-active' : ''}`} onMouseOver={() => onHover(clearway)} onMouseOut={() => setHover('')}>
                                <h6 className="accordion-header">
                                    <Link href="/clearwayzone/1" className="accordion-button shadow-none d-flex align-items-center collapsed text-decoration-none single-link">
                                        <img src={location.pathname.startsWith('/clearwayzone') || hover === clearway ? "clearwayzonewhite" : "clearwayzoneblack"} className='me-3' alt='name' /> {props.handled && <span>Clearwayzone</span>}
                                    </Link>
                                </h6>
                            </div>
                        {/* Order  */}
                      
                    </div>
                </div>
            </div>
            {/* } */}
        </>
    )
}

export default TheSideBar;