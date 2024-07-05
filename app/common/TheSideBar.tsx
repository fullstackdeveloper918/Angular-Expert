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
        </>
    )
}

                export default TheSideBar;