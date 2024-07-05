"use client"
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'

const page = () => {

const userName=useSelector((state:any) => state.user.viewItem)

    return (
        <div className='container'>
            <div className="row mt-3">
                <h3 className="text-center">User Listing</h3>
            </div>
            <div className="row gap-3">
                <div className="justify-content-center mt-2 d-flex gap-3">
                    {/* <h1 className="">{userName}</h1> */}
                    <Link href={'/admin/users/1'}>
                    <button type="button" className="btn btn-primary ">Go to detail page</button>
                    </Link>
                    <button type="button" className="btn btn-secondary">Go to Edit page</button>
                </div >
            </div>
        </div>
    )
}
export default page