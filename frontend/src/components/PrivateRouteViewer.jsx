import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
const PrivateRouteViewer = () => {
    const {viewer}=useSelector((state)=>state.home)
    // console.log("check viewer");
    // console.log(viewer);
    return viewer? <Outlet/> : <Navigate to='/userSignin' />
}

export default PrivateRouteViewer