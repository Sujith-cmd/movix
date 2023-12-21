import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { errorHandler } from '../../../backend/utils/error'
function PrivateRouteUser() {
  const {vendor}=useSelector((state)=>state.home)
    // const {currentUser}=useSelector((state)=>state.home)
    return vendor? <Outlet/> : <Navigate to='/vendorSignIn' />
  
  // const {currentUser}=useSelector((state)=>state.home)
  // // const length= Object.keys(currentUser).length
  // const [len, setLen] = useState(null)
  // useEffect(() => {
  //   check()
  // }, []);

  // const check=()=>{
  //     try {
  //       const array=Object.keys(currentUser)
  //       console.log("privaterouteUser");
        
  //       setLen(array.length)
  //       if(len>0){
  //         console.log(len);
  //         return <Outlet/>
  //       }else{
  //         return <Navigate to='/vendorSignIn' />
  //       }
  //     } catch (error) {
  //      console.log("error from privateRouteUser")
  //      console.log(error)
  //     }

  // }

}
export default PrivateRouteUser