import React from 'react'
import Img from '../lazyLoadImage/Img.jsx'
import { FaRegMessage } from "react-icons/fa6";
import { CiBellOn } from "react-icons/ci";


const AdminHeader = () => {
  return (
    <div className='appHeader'>
        <img style={{height:"60px",width:"60px"}} src="https://www.logolynx.com/images/logolynx/23/23938578fb8d88c02bc59906d12230f3.png" alt="" />
        <h3>Admin Dashboard</h3>
        <div style={{display:"flex",gap:"10px",marginRight:"50px"}}>

        <FaRegMessage />
        <CiBellOn />
        </div>

    </div>
  )
}

export default AdminHeader