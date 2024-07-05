"use client"
import { setViewItem } from '@/lib/features/userSlice'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
const page = () => {
    const dispatch = useDispatch()
    const userName = useSelector((state: any) => state.user.viewItem)
    const handleClick = () => {
        dispatch(setViewItem("Abhay Singh"))

    }
    return (
        <div className="container">
            <div className="row mt-3">
                <h1 className="text-center">Meetings Listing</h1>
                {/* <h3 className="">{userName}</h3> */}
                <button className="" onClick={handleClick}>change view item</button>
            </div>
        </div>
    )
}

export default page