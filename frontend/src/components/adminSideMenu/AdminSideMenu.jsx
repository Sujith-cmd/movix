import React from 'react'

const AdminSideMenu = ({setUsers,setDashboard,setPayments,setBookings,setTheatres}) => {
  return (
    <div className='sideMenu'>
        <div style={{alignSelf:'center',cursor:"pointer"}} onClick={()=>{
            setDashboard(true)
            setUsers(false)
            setTheatres(false)
            setPayments(false)
            setBookings(false)
        }}>Dashboard</div>
        {/* <div style={{alignSelf:'center'}} onClick={()=>{
            setDashboard(false)
            setUsers(false)
            setTheatres(false)
            setPayments(false)
            setBookings(true)
        }}>Cancelled Bookings</div> */}
        <div style={{alignSelf:'center',cursor:"pointer"}} onClick={()=>{
            setDashboard(false)
            setUsers(false)
            setTheatres(false)
            setPayments(true)
            setBookings(false)
        }}>Payments</div>
        <div style={{alignSelf:'center',cursor:"pointer"}} onClick={()=>{
            setDashboard(false)
            setUsers(false)
            setTheatres(true)
            setPayments(false)
            setBookings(false)
        }}>Theatres</div>
        <div style={{alignSelf:'center',cursor:"pointer"}} onClick={()=>{
            setDashboard(false)
            setUsers(true)
            setTheatres(false)
            setPayments(false)
            setBookings(false)
        }}>Users</div>
    </div>
  )
}

export default AdminSideMenu