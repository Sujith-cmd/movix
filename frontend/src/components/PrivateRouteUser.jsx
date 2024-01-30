import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { errorHandler } from '../../../backend/utils/error'
function PrivateRouteUser() {
  const {vendor}=useSelector((state)=>state.home)
    // const {currentUser}=useSelector((state)=>state.home)
    return vendor? <Outlet/> : <Navigate to='/vendorSignIn' />
  
  

}
export default PrivateRouteUser