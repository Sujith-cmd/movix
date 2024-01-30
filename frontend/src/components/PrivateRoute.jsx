import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
function PrivateRoute() {
  const {currentUser}=useSelector((state)=>state.home)
  // alert("you")
  return Object.keys(currentUser).length>0? <Outlet/> : <Navigate to='/adminSignIn' />
}
export default PrivateRoute