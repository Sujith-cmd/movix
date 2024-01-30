import React, { useState, useEffect } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { FaRegMessage } from "react-icons/fa6";
import { CiBellOn } from "react-icons/ci";
import { PiTelevisionSimpleFill } from "react-icons/pi";

import { Chart } from 'chart.js/auto';
import { FaUser } from "react-icons/fa";

import "./styles.scss";

import { Doughnut, Bar } from 'react-chartjs-2';

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper.jsx";

import Spinner from "../../../components/spinner/Spinner.jsx";

import { fetchDataFromApi } from "../../../utils/api.js";
// import axios from "axios";
import { signout } from "../../../store/homeSlice.js";
import { useDispatch, useSelector } from "react-redux";
import AdminHeader from "../../../components/adminHeader/AdminHeader.jsx";
import AdminSideMenu from "../../../components/adminSideMenu/AdminSideMenu.jsx";
import AdminPageContent from "../../../components/adminPageContent/AdminPageContent.jsx";
import AdminFooter from "../../../components/adminFooter/AdminFooter.jsx";
import DashboardCard from "../../../components/dashboardCard/DashboardCard.jsx";
import axios from "axios";
import { adminAxiosIntercepter } from "../../../hooks/adminAxios.jsx";
import { vendorAxiosIntercepter } from "../../../hooks/vendorAxios.jsx";
import { userAxiosIntercepter } from "../../../hooks/userAxios.jsx";


const AdminHome = () => {
    const labels=["Kochi","Chennai","Bombay","Delhi","Jammu"]
    const nums=[18,16,4,19,9]
    const[data,setData] = useState([])
    const[data2,setData2] = useState([])
    const[allowed,setAllowed] = useState([])
    const[disAllowed,setDisAllowed] = useState([])
    const[error,setError] = useState(false)
    const[loading,setLoading] = useState(false)
    const[disAll,setDisAll] = useState(null)
    const[theatreNo,setTheatreNo] = useState(0)
    const[gameNo,setGameNo] = useState(0)
    const [userNumb,setUserNumb]=useState(0)
    const [bookNumb,setBookNumb]=useState(0)
    const [disLength,setDisLength]=useState(0)
    const [disSlice,setDisSlice]=useState(0)
    const [disSliceTotal,setDisSliceTotal]=useState(0)
    const [modalDiv,setModalDiv]=useState(false)
    const [userModalDiv,setUserModalDiv]=useState(false)
    
   const adminAxios= adminAxiosIntercepter()
   const vendorAxios= vendorAxiosIntercepter()
   const userAxios= userAxiosIntercepter()

    const[pageDis,setPageDis] = useState([])
    const[usersList,setUsersList]=useState([])
    const[userShow,setuserShow]=useState(0)
    const[usersTotal,setUsersTotal]=useState(0)
    const[vendorsList,setVendorsList]=useState([])
    const[vendorShow,setVendorShow]=useState(0)
    const[vendorsTotal,setVendorsTotal]=useState(0)
    const[vendorDetails,setVendorDetails]=useState({})
    const[userDetails,setUserDetails]=useState({})

    const [userName,setUserName ]=useState(userDetails?.username)
    
    const [locality,setLocality ]=useState(userDetails?.address?.locality)
    const [userDistrict,setUserDistrict ]=useState(userDetails?.address?.district)
    const [userState,setUserState ]=useState(userDetails?.address?.state)
    const [userRemark,setUserRemark ]=useState(userDetails?.address?.remark)
    const [userStatus,setUserStatus ]=useState(userDetails?.isAccess||null)


    const [username,setUsername ]=useState(vendorDetails?.username||"")
    const [houseNo,setHouseNo ]=useState(vendorDetails?.address?.houseNo||"")
    const [addresslineOne,setAddresslineOne ]=useState(vendorDetails?.address?.addresslineOne||"")
    const [addresslineTwo,setAddresslineTwo ]=useState(vendorDetails?.address?.addresslineTwo||"")
    const [post,setPost ]=useState(vendorDetails?.address?.postOffice||"")
    const [district,setDistrict ]=useState(vendorDetails?.address?.district||"")
    const [state,setState ]=useState(vendorDetails?.address?.state||"")
    const [remark,setRemark ]=useState(vendorDetails?.address?.remark||"")
    const [seating,setSeating ]=useState(vendorDetails?.seatingCapacity||null)
    const [price,setPrice ]=useState(vendorDetails?.price||null)

   useEffect(() => {
    if(modalDiv==false||userModalDiv==false){
      setUserDetails({})
      setVendorDetails({})
    }
   }, [modalDiv,userModalDiv])

    const noCalling=async()=>{
      try {
    
        // const res= await fetch('http://localhost:5000/api/admin/noCalling')
        // let dat=await res.json();
      const {data}=await adminAxios.get("/noCalling")
      // const dat=data
       console.log("noCaloomn");
       console.log(data);
       setTheatreNo(data.tNo)
       setGameNo(data.gNo)
       setUserNumb(data.userNo)
       setBookNumb(data.bookNo)
        
     } catch (error) {
         console.log(error.message);
        
    }
    }
    useEffect(() => {
      noCalling()
    }, [])
     useEffect(() => {
      setUsersChartData({
        labels: ['Theatres', 'Game Stations'],
        datasets: [{
          data: [theatreNo,gameNo],
          // backgroundColor: ['#e25d23', '#5b44be'],
          backgroundColor: ['#b15f1b', '#5b44be'],
        }],
    })
     }, [theatreNo])
    const[usersChartData,setUsersChartData] = useState({
        labels: ['Theatres', 'Game Stations'],
        datasets: [{
          data: [7,9],
          backgroundColor: ['#b15f1b', '#5b44be'],
        }],
    })
    useEffect(() => {
      setUsersChartData2({
        labels: ['Users', 'Bookings'],
        datasets: [{
          data: [userNumb,bookNumb],
          // backgroundColor: ['#e25d23', '#5b44be'],
          backgroundColor: ['#b15f1b', '#5b44be'],
        }],
    })
     }, [userNumb])
    const[usersChartData2,setUsersChartData2] = useState({
        labels: ['Theatres', 'Game Stations'],
        datasets: [{
          data: [7,9],
          backgroundColor: ['#b15f1b', '#5b44be'],
        }],
      })
      // backgroundColor: ['#00F0FF', '#7aeb34'],
    const [commercesChartData,setCommercesChartData]=useState({
        labels: labels,
        datasets: [{
          label: 'Count of Courses',
          data:nums,
          datalabels: {
            display: true,
            align: 'end',
            anchor: 'end',
          },
        }],
      })
    const [dashboard,setDashboard]=useState(true)
    const [users,setUsers]=useState(false)
    const [theatres,setTheatres]=useState(false)
    const [payments,setPayments]=useState(false)
    const [bookings,setBookings]=useState(false)
    const [canBookings,setCanBookings]=useState([])
    const [pageNo,setPageNo]=useState(0)
    const [totalPages,setTotalPages]=useState(0)

    
    const dispatch=useDispatch()
    const navigate=useNavigate()
  const { currentUser } = useSelector((state) => state.home);
    
  const bookingsCalling = async (status) => {
    if(status=="useEffect"){

    
    try {
    
        //  const res= await fetch(`http://localhost:5000/api/admin/bookings/${pageNo}`)
        // let dat=await res.json();
        const {data}=await adminAxios.get(`/bookings/${pageNo}`) 
        setCanBookings(data.books)
        const pgLen=data.booksLength;
        setTotalPages(pgLen)
      
         
      } catch (error) {
          console.log(error.message);
         
     }
    }
    else if(status=="first"){
      const pN=pageNo
       
        setPageNo(0)
      
    }else if(status=="prev"){
      if(pageNo-3>0){

      const pN=pageNo-3
        
        setPageNo(pN)
      }else{
        setPageNo(0)
      }
    }else if(status=="next"){
      if(pageNo+3<totalPages){

        const pN=pageNo+3
        setPageNo(pN)
      }
        
    }else {
      const rem=totalPages%3
      if(rem==0){
        const pN=totalPages-3
        // const pN=numb*3
        setPageNo(pN)
        
      }else{
        const numb=Math.floor(totalPages/3)
        const pN=numb*3
        setPageNo(pN)
      }
        
    }
    
    
  }

  
  
  useEffect(() => {
    bookingsCalling("useEffect")
  }, [])
  useEffect(() => {
   fetchBooks()
  }, [pageNo])
  const fetchBooks = async () => {
    try {
    
      // const res= await fetch(`http://localhost:5000/api/admin/bookings/${pageNo}`)
      // let dat=await res.json();
      const {data}=await adminAxios.get(`/bookings/${pageNo}`) 

     setCanBookings(data.books)
    //  const pgLen=dat.booksLength;
    //  setTotalPages(pgLen)
   
      
   } catch (error) {
       console.log(error.message);
      
  }
  }
    const handleSignOut = async () => {
        try {
            const res= await fetch('http://localhost:5000/api/admin/signout')
                  let data=await res.json();
                  console.log(data);
          dispatch(signout())
          navigate("/")
        } catch (error) {
          console.log(error);
        }
      };
    const listCalling = async () => {
        setLoading(true)
        try {
        
          //  const res= await fetch('http://localhost:5000/api/admin/list')
          //  let dat=await res.json();
          const {data}=await adminAxios.get(`/list`) 

          //  console.log(dat);
           setData(data.viewers)
           setData2(data.vendors)
         
           setLoading(false)
           
        } catch (error) {
            console.log(error.message);
            setLoading(false)
            setError(true)
       }
    }
    useEffect(() => {
        if (Chart.helpers) {
            Chart.helpers.each(Chart.instances, (instance) => {
              instance.destroy();
            });
          }
        listCalling()
    }, [])
   
    const setList = async () => {
      const allowedStations = data2?.filter((station) => {
        if (station.isAccess=="Allowed") {
          return true;
        } else {
          return false; 
        }
      });
      const disAllowedStations = data2?.filter((station) => {
       const today=new Date().getTime()
       const thatDay=new Date(station.subscription).getTime()
       const diff=today-thatDay
    
        if (diff>0) {
          return true;
        } else {
          return false; 
        }
      });
      const disAllTotal=disAllowedStations?.length
      setAllowed(allowedStations)
      setDisAllowed(disAllowedStations)
      setDisSliceTotal(disAllTotal)
    }

    useEffect(() => {
      
      setList()
      const userList=data2?.slice(vendorShow,vendorShow+15)
      setVendorsList(userList)
      setVendorsTotal(data2?.length)
  }, [data2])
  useEffect(() => {
    const next=disSlice+10
    const disAllowArray=disAllowed?.slice(disSlice,next)
    setPageDis(disAllowArray)
  }, [disAllowed])
  const paymentCalling =  (status) => {
  

    

  
      if(status=="first"){
       setDisSlice(0)
        
      }else if(status=="prev"){
        if(disSlice-10>0){
  
        const N=pageDis-10
          
          setDisSlice(N)
        }else{
          setDisSlice(0)
        }
      }else if(status=="next"){
        if(disSlice+10<disSliceTotal){
  
          const N=disSlice+10
          setDisSlice(N)
        }
          
      }else {
        const rem=disSliceTotal%10
        if(rem==0){
          const pN=disSliceTotal-10
          // const pN=numb*3
          setDisSlice(pN)
          
        }else{
          const numb=Math.floor(disSliceTotal/10)
          const pN=numb*10
          setDisSlice(pN)
        }
          
      }
  }
  useEffect(() => {
    const next=disSlice+10
    const disArray=disAllowed?.slice(disSlice,next)
    setPageDis(disArray)
  }, [disSlice])

  useEffect(() => {
    const userList=data?.slice(userShow,userShow+15)
  setUsersList(userList)
  setUsersTotal(data?.length)
  }, [data])

  useEffect(() => {
    const userList=data?.slice(userShow,userShow+15)
    setUsersList(userList)
  }, [userShow])
  const vendorEditing =  (status) => {
    
  }
  const usersCalling =  (status) => {
  

    

  
    if(status=="first"){
     setuserShow(0)
      
    }else if(status=="prev"){
      if(userShow-20>0){

      const N=userShow-20
        
        setuserShow(N)
      }else{
        setuserShow(0)
      }
    }else if(status=="next"){
      if(userShow+20<usersTotal){

        const N=userShow+20
        setuserShow(N)
      }
        
    }else {
      const rem=usersTotal%20
      if(rem==0){
        const pN=userShow-20
        // const pN=numb*3
        setuserShow(pN)
        
      }else{
        const numb=Math.floor(usersTotal/20)
        const pN=numb*20
        setuserShow(pN)
      }
        
    }
}

useEffect(() => {
  const vendorList=data2?.slice(vendorShow,vendorShow+15)
  setVendorsList(vendorList)
}, [vendorShow])
const vendorsCalling =  (status) => {


  


  if(status=="first"){
   setVendorShow(0)
    
  }else if(status=="prev"){
    if(vendorShow-15>0){

    const N=vendorShow-15
      
      setVendorShow(N)
    }else{
      setVendorShow(0)
    }
  }else if(status=="next"){
    if(vendorShow+15<vendorsTotal){

      const N=vendorShow+15
      setVendorShow(N)
    }
      
  }else {
    const rem=vendorsTotal%15
    if(rem==0){
      const pN=vendorShow-15
      // const pN=numb*3
      setVendorShow(pN)
      
    }else{
      const numb=Math.floor(vendorsTotal/15)
      const pN=numb*15
      setVendorShow(pN)
    }
      
  }
}

  const changeUserStatus = async (id,status) => {
    console.log("statusNow");
    console.log(status);
     try {
      const res= await userAxios.post(`/updateStatus/${id}`,{
       isAccess:status?false:true
        }).then((response) => {
          console.log(response);
          // dispatch(setCurrentUser(response.data))
          // toast("user updated")
          // setError(false)
        }).catch((err)=>{
          console.log(err);
        });
        // setModalDiv(false)
        setUserModalDiv(false)
        setUserDetails({})
        listCalling()
    } catch (error) {
      
    }
  }
  const editUser = async (e) => {
    e.preventDefault()
    try {
      const res= await userAxios.post(`/update/${userDetails._id}`,{
        username:userName,
        
         
        
         
         locality,
          district:userDistrict,
          state:userState
        }).then((response) => {
          console.log(response);
          // dispatch(setCurrentUser(response.data))
          // toast("user updated")
          // setError(false)
        }).catch((err)=>{
          console.log(err);
        });
        // setModalDiv(false)
        setUserModalDiv(false)
        setUserDetails({})
        listCalling()
    } catch (error) {
      
    }
  }
  const editVendor = async (e) => {
    e.preventDefault()
    // console.log("id");
    // console.log(vendorDetails?._id);
    // const id

    try {
     
      const res= await vendorAxios.post(`/update/${vendorDetails?._id}`,{
        username:username,
           
            houseNo:houseNo,
            addresslineOne:addresslineOne,
            addresslineTwo:addresslineTwo,
            postOffice:post,
            district:district,
            state:state,
            remark:remark,
          seatingCapacity:Number(seating),
            
          pricePerHour:Number(price)
        })
    .then((response) => {
      console.log(response);
      // dispatch(setCurrentUser(response.data))
      // dispatch(getFacilities())
      // toast("Details updated")
    }).catch((err)=>{
      console.log(err);
      // toast("Something went wrong")
    });
    setModalDiv(false)
    setVendorDetails({})
    listCalling()
     
      
    } catch (error) {
      console.log(error);
      // setError(true)
      return
    }
  }
  const editUserModal = async (id) => {
    setUserModalDiv(true)
    try {
          const res= await fetch(`http://localhost:5000/api/users/${id}`,{
            method: 'GET',
            headers:{
              'Content-Type': 'application/json',
            },
         
           
          })
              let allData=await res.json();
              // dispatch(setCurrentData(data))
              // console.log("allDarta");
              // console.log(allData);
              setUserDetails({...allData})
          } catch (error) {
          
          console.log("Catch vendorlogin error");
          console.log(error);
            
          }
  }
  const editModal = async (id) => {
  
    setModalDiv(true)
    try {
      const res= await vendorAxios.get(`/getDetails/${id}`)
      .then((response) => {
             
           
    // console.log("checkUser test");
    setVendorDetails({...response?.data})
    // console.log(response);
       
      
    }).catch((error)=>{
     
     console.log("error in vendorFetch");
    //  const err=error.response.data.msg;
    //  toast(err)
    })
    } catch (error) {
      
    }

  }
  const blockVendor = async (status,id) => {
    console.log("vendorStatus");
    // console.log(status);
    setDisAll(id)
    // console.log(id);
  }
  const blockTheatre = async () => {
    axios({
      method: 'POST',
      url: `http://localhost:5000/api/vendors/putAllow`,
      headers: {}, 
      data: {
       id:disAll
      }
    })
  .then((response) => {
    setData2(response.data)
  }).catch((err)=>{
    console.log(err);
  });
  }
  useEffect(() => {
  
  if(disAll!==null){
   blockTheatre()
   setDisAll(null)
   listCalling()
  }
  }, [disAll])
 
  useEffect(() => {
  const length=disAllowed?.length
  setDisLength(length)

  }, [disAllowed])

    return (
        <div className="explorePage">
            <div className="signout">
                <button style={{padding:".5rem",borderRadius:".85rem",marginBottom:"2px",cursor:"pointer"}} onClick={handleSignOut}>signout</button>
            </div>
            <ContentWrapper>

            <div className="app" >

              {userModalDiv?(<div className="modal" >
              <div style={{display:"flex",justifyContent:"end"}}>
                  <span style={{padding:"1rem",backgroundColor:"white",borderRadius:".75REM"}} onClick={()=>setUserModalDiv(false)}>close</span>
                </div>
                <form className='form'>
       
       <div className='layer'>
       <label htmlFor='email' className='labelInput'>Email</label>
       <input style={{backgroundColor:'transparent',color:"white",border:"none"}}
         defaultValue={userDetails?.email}
         type='text'
         id='email'
         disabled
         className='formInput'
       />
       </div>
       
       <div className='layer'>
       <label htmlFor='balance' className='labelInput'>Account Balance</label>
       <input style={{backgroundColor:'transparent',color:"white",border:"none"}}
         defaultValue={userDetails?.account_Bal} 
         type='text'
         id='balance'
         disabled
         className='formInput' 
       />
       </div>
       <div className='layer'>
       <label htmlFor='isAccess' className='labelInput'>isAccess</label>
       <input style={{backgroundColor:'transparent',color:"white",border:"none"}}
         defaultValue={userDetails?.isAccess}
         type='text'
         id='isAccess'
         disabled
         className='formInput' 
       />
       </div>
       <div className='layer'>
       <label htmlFor='username' className='labelInput'>Username</label>
       <input
         defaultValue={userDetails?.username}
         type='text'
         id='username'
         onChange={(e)=>{
           setUserName(e.target.value)
         }}      
         className='formInput' 
       />
       </div>
       <div className='layer'>
       <label htmlFor='locality' className='labelInput'>Locality</label>
       <input
         defaultValue={userDetails?.address?.locality}
         onChange={(e)=>{setLocality(e.target.value)}}  
         type='text'
         id='locality'
         placeholder='locality'
         className='formInput' 
       />
       </div>
       <div className='layer'>
       <label htmlFor='district' className='labelInput'>District</label>
       <input
         defaultValue={userDetails?.address?.district}
         onChange={(e)=>{setUserDistrict(e.target.value)}}      
         type='text'
         id='district'
         placeholder='Username'
         className='formInput' 
       />
       </div>
       <div className='layer'>
       <label htmlFor='state' className='labelInput'>State</label>
       <input
         defaultValue={userDetails?.address?.state}
         onChange={(e)=>{setUserState(e.target.value)}}      
         type='text'
         id='state'
         placeholder='Username'
         className='formInput' 
       />
       </div>
       
      
       
       <button type="button" onClick={editUser} className='formButton'>UPDATE</button>
       {/* {error && <p>"something went wrong</p>} */}
       {/* <ToastContainer/> */}
     </form>
              </div>):("")}
              {modalDiv?(<div className="modal" >
                <div style={{display:"flex",justifyContent:"end"}}>
                  <span style={{padding:"1rem",backgroundColor:"white",borderRadius:".75REM"}} onClick={()=>setModalDiv(false)}>close</span>
                </div>
                <form className="form" >
                 {/* ======================================================================================================================================== */}
                 
                 <div className='layer'>
      <label htmlFor='email' className='labelInput'>Email</label>
      <input style={{backgroundColor:'transparent',color:"white",border:"none"}}
        defaultValue={vendorDetails?.email}
        type='text'
        id='email'
        disabled
        className='formInput'
      />
      </div>
      
      <div className='layer'>
      <label htmlFor='subscription' className='labelInput'>Subscription Upto</label>
      <input  style={{backgroundColor:'transparent',color:"white",border:"none"}}
        defaultValue={vendorDetails?.subscription}
        type='text'
        id='subscription'
        disabled
        className='formInput' 
      />
      </div>
     
      <div className='layer'>
      <label htmlFor='isAccess' className='labelInput'>isAccess</label>
      <input  style={{backgroundColor:'transparent',color:"white",border:"none"}}
        defaultValue={vendorDetails?.isAccess}
        type='text'
        id='isAccess'
        disabled
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='username' className='labelInput'>Username</label>
      <input 
        defaultValue={vendorDetails?.username}
        type='text'
        id='username'
        onChange={(e)=>{
          setUsername(e.target.value)
        }}      
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='houseNo' className='labelInput'>House Number</label>
      <input
        onChange={(e)=>{setHouseNo(e.target.value)}}      
        defaultValue={vendorDetails?.address?.houseNo}
        type='text'
        id='houseNo'
        placeholder='Username'
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='addresslineOne' className='labelInput'>AddressLine 1</label>
      <input onChange={(e)=>{setAddresslineOne(e.target.value)}}      
        defaultValue={vendorDetails?.address?.addresslineOne}
        type='text'
        id='addresslineOne'
        placeholder='Username'
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='addresslineTwo' className='labelInput'>AddressLine 2</label>
      <input
        onChange={(e)=>{setAddresslineTwo(e.target.value)}}      
        defaultValue={vendorDetails?.address?.addresslineTwo}
        type='text'
        id='addresslineTwo'
        placeholder='Username'
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='postOffice' className='labelInput'>Post Office</label>
      <input
        defaultValue={vendorDetails?.address?.postOffice}
        onChange={(e)=>{setPost(e.target.value)}}  
        type='text'
        id='postOffice'
        placeholder='Username'
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='district' className='labelInput'>District</label>
      <input
        defaultValue={vendorDetails?.address?.district}
        onChange={(e)=>{setDistrict(e.target.value)}}      
        type='text'
        id='district'
        placeholder='Username'
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='state' className='labelInput'>State</label>
      <input
        defaultValue={vendorDetails?.address?.state}
        onChange={(e)=>{setState(e.target.value)}}      
        type='text'
        id='state'
        placeholder='Username'
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='seatingCapacity' className='labelInput'>Seating Capacity</label>
      <input
        defaultValue={vendorDetails?.seatingCapacity}
        onChange={(e)=>{setSeating(e.target.value)}}      
        type='text'
        id='seatingCapacity'
        placeholder='Username'
        className='formInput' 
      />
      </div>
     
      <div className='layer'>
      <label htmlFor='price' className='labelInput'>Price</label>
      <input
        defaultValue={vendorDetails?.price}
        onChange={(e)=>{setPrice(e.target.value)}}      
        type='text'
        id='price'
        placeholder='Username'
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='price' className='labelInput'>Overview</label>
      <input
        defaultValue={vendorDetails?.address?.remark}
        onChange={(e)=>{setRemark(e.target.value)}}      
        type='text'
        id='remark'
        placeholder='Username'
        className='formInput' 
      />
      </div>
      <button type="button" onClick={editVendor} className='formButton'>UPDATE</button>
                 {/* ======================================================================================================================================== */}
                </form>
              </div>):("")}
                <AdminHeader/>
                <div className="sideMenuAndPageContent">
                    <AdminSideMenu setUsers={setUsers} setBookings={setBookings} setPayments={setPayments} setDashboard={setDashboard} setTheatres={setTheatres} />
                    <AdminPageContent >
                    {loading && <Spinner initial={true} />}
                   
                   
                            
                            {!loading && users &&(
                                <div style={{overflowY: 'scroll',overflowX: 'scroll'}}>
                                         <div className="pageHeader">
                                            <div className="pageTitle">
                                               User List
                                            </div>
                         <div style={{display:"flex",justifyContent:"center"}}>
                        <span style={{height:"30px",backgroundColor:"orange",margin:"5px",borderRadius:"4px",padding:"6px",fontWeight:"600",alignSelf:"center",cursor:"pointer"}} onClick={()=>usersCalling("first")}>first</span>
                        <span style={{height:"30px",backgroundColor:"orange",margin:"5px",borderRadius:"4px",padding:"6px",fontWeight:"600",alignSelf:"center",cursor:"pointer"}} onClick={()=>usersCalling("prev")}>prev</span>
                        <span style={{height:"30px",backgroundColor:"orange",margin:"5px",borderRadius:"4px",padding:"6px",fontWeight:"600",alignSelf:"center",cursor:"pointer"}} onClick={()=>usersCalling("next")}>next</span>
                        <span style={{height:"30px",backgroundColor:"orange",margin:"5px",borderRadius:"4px",padding:"6px",fontWeight:"600",alignSelf:"center",cursor:"pointer"}} onClick={()=>usersCalling("last")}>last</span>
                      </div>
                                         </div>
                                    {data?.length > 0 ? (
                                                     <>
                                            { usersList?.map((item, index) => {
                                                
                                                return (
                                                       
                                                        <div key={index}  >
                                                    <div className="bar" ></div>
                                                        <div className="map">
                                                        <div className="slno"><FaUser /></div>
                                                        <div className="username">{item.username}</div>
                                                        <div className="email">{item.email}</div>
                                                        <div className="edit"><button style={{height:"25px",paddingLeft:".3rem",fontWeight:"600",paddingRight:".3rem",cursor:"pointer"}} onClick={()=>{editUserModal(item._id)}}>Edit</button></div>
                                                        <div className="edit" style={{marginRight:"4rem",width:"7rem"}}><button style={{height:"25px",paddingLeft:".3rem",fontWeight:"600",paddingRight:".3rem",cursor:"pointer"}} onClick={()=>{changeUserStatus(item._id,item.isAccess)}}>Change status</button></div>
                                            <div className="edit" style={{width:"12rem",display:"flex",justifyContent:"space-between"}}><span style={{marginRight:"1rem",fontSize:"15px"}}>Status</span><span style={{fontWeight:"600"}}>{item.isAccess?"Allowed":"Not Allowed"}</span></div>
                                            {/* <div className="edit" style={{width:"12rem",display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:"600"}}>{item.isAccess}</span></div> */}
                                            
                                                        
                                                    </div>
                                                    
                                                    </div>
                                                );
                                            }) }
                                            </>
                                        
                                    ) : (
                                        <span className="resultNotFound">
                                            Sorry, Error Occured!
                                        </span>
                                     )}
                                </div>
                                
                            )}
                        
                        {!loading && theatres&& (
                    <>
                        {vendorsList?.length > 0 ? (
                                         <>
                                          <div className="pageHeader">
                    <div className="pageTitle">
                        Vendor List
                    </div>
                    <div style={{display:"flex",justifyContent:"center"}}>
                        <span style={{height:"30px",backgroundColor:"orange",margin:"5px",borderRadius:"4px",padding:"6px",fontWeight:"600",alignSelf:"center",cursor:"pointer"}} onClick={()=>vendorsCalling("first")}>first</span>
                        <span  style={{height:"30px",backgroundColor:"orange",margin:"5px",borderRadius:"4px",padding:"6px",fontWeight:"600",alignSelf:"center",cursor:"pointer"}} onClick={()=>vendorsCalling("prev")}>prev</span>
                        <span  style={{height:"30px",backgroundColor:"orange",margin:"5px",borderRadius:"4px",padding:"6px",fontWeight:"600",alignSelf:"center",cursor:"pointer"}} onClick={()=>vendorsCalling("next")}>next</span>
                        <span  style={{height:"30px",backgroundColor:"orange",margin:"5px",borderRadius:"4px",padding:"6px",fontWeight:"600",alignSelf:"center",cursor:"pointer"}} onClick={()=>vendorsCalling("last")}>last</span>
                      </div>
                </div>
                                { vendorsList?.map((item, index) => {
                                    
                                    return (
                                            <ContentWrapper key={index}>
                                        <div className="bar"></div>
                                            <div className="map">
                                            <div className="slno"><PiTelevisionSimpleFill /></div>
                                            <div className="username">{item.username}</div>
                                            <div className="email">{item.email}</div>
                                            <div className="edit"><button  style={{height:"25px",paddingLeft:".3rem",fontWeight:"600",paddingRight:".3rem",cursor:"pointer"}}   onClick={()=>{editModal(item._id)}} >Edit</button></div>
                                            <div className="edit" style={{marginRight:"4rem",width:"7rem"}}><button  style={{height:"25px",paddingLeft:".3rem",fontWeight:"600",paddingRight:".3rem",cursor:"pointer"}}  onClick={()=>{blockVendor(item.isAccess,item._id)}}>Change status</button></div>
                                            <div className="edit" style={{width:"12rem",display:"flex",justifyContent:"space-between"}}><span style={{marginRight:"1rem",fontSize:"15px"}}>Status</span><span style={{fontWeight:"600"}}>{item.isAccess}</span></div>
                                            {/* <div className="edit"><button >{item.isAccess}</button></div> */}
                                            
                                        </div>
                                        
                                        </ContentWrapper>
                                    );
                                }) 
                                }
                                </>
                            
                        ) : (
                            <span className="resultNotFound">
                                Sorry, Error Occured!
                            </span>
                         )}
                    </>
                    
                )}


{!loading && dashboard&& (
                    <>
                       
                       <div className="dashboardWrapper">
                           <DashboardCard name={"Bookings"} numb={bookNumb}/>
                           <DashboardCard name={"Profit"} numb={currentUser.account_Bal}/>
                           <DashboardCard name={"Users"} numb={userNumb}/>
                           <DashboardCard name={"Theatres/Games"} numb={`${theatreNo}/${gameNo}`}/>
                        </div> 
                        <div style={{height:"400px",width:"400px",display:"flex",justifyContent:"space-between"}}>
                        <Doughnut  data={usersChartData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: {
                                position: 'bottom',
                            },
                        }} 
                        />
                        <Doughnut  data={usersChartData2} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: {
                                position: 'bottom',
                            },
                        }} 
                        />
                        {/* <div>
                        
                        <Bar
                data={commercesChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  scales: {
                    x: {
                      grid: {
                        display: true,
                      },
                      title: {
                        display: true,
                        text: 'Countries',
                      },
                    },
                    y: {
                      grid: {
                        display: true,
                      },
                      title: {
                        display: true,
                        text: 'Courses Count',
                      },
                    },
                  },
                }}
              />
                        </div> */}
                        </div>  

                                         
                    </>
                    
                )}

{!loading && bookings&& (
                      
                   


                 

                      <div className='mainSection' style={{display:"flex",flexDirection:"column"}}>
                         <div style={{display:"flex",justifyContent:"center"}}>
                        <span style={{height:"30px",backgroundColor:"yellow",margin:"5px",padding:"3px"}} onClick={()=>bookingsCalling("first")}>first</span>
                        <span style={{height:"30px",backgroundColor:"yellow",margin:"5px",padding:"3px"}} onClick={()=>bookingsCalling("prev")}>prev</span>
                        <span style={{height:"30px",backgroundColor:"yellow",margin:"5px",padding:"3px"}} onClick={()=>bookingsCalling("next")}>next</span>
                        <span style={{height:"30px",backgroundColor:"yellow",margin:"5px",padding:"3px"}} onClick={()=>bookingsCalling("last")}>last</span>
                      </div>
                      <ContentWrapper>
                      <div className='prevContainer'>
                        <div className='prevHeadings'>
                            <div className='prevHead'>Date</div>
                            <div className='prevHead'>Theatre name</div>
                            <div className='prevHead'>Username</div>
                            <div className='prevHead'>Amount</div>
                            {/* <div className='prevHead'>Booking Id</div> */}
                            {/* <div className='prevHead'>hjj</div> */}
                            
                        </div>
                        
                            {canBookings?.length>0 ? (  canBookings?.map((boos,index)=>{
                                 
                                 return(
                                     <div className='prevBody' key={index}>
                                     <div className='prevValue'>{boos.bookings.date}</div>
                                     <div className='prevValue'>{boos.bookings.theatreName}</div>
                                     <div className='prevValue'>{boos.bookings.username}</div>
                                     <div className='prevValue' >{boos.bookings.bill}</div>
                                     {/* <div className='prevValue'>Block/Unblock</div> */}
                                     {/* <div className='prevValue'>hjj</div> */}
                                     </div>
                                 )
                             })):("")
                              
                            }
                      
                      </div>
      
                      </ContentWrapper>
                     
                      </div>
                      
                  )}   

                     {!loading && payments&& (
          
                    <div className='mainSection' style={{display:"flex",flexDirection:"column"}}>
                       <div style={{display:"flex",justifyContent:"center"}}>
                        <span style={{height:"30px",margin:"5px",padding:"4px",backgroundColor:"orange",borderRadius:"5px"}} onClick={()=>paymentCalling("first")}>first</span>
                        <span style={{height:"30px",margin:"5px",padding:"4px",backgroundColor:"orange",borderRadius:"5px"}} onClick={()=>paymentCalling("prev")}>prev</span>
                        <span style={{height:"30px",margin:"5px",padding:"4px",backgroundColor:"orange",borderRadius:"5px"}} onClick={()=>paymentCalling("next")}>next</span>
                        <span style={{height:"30px",margin:"5px",padding:"4px",backgroundColor:"orange",borderRadius:"5px"}} onClick={()=>paymentCalling("last")}>last</span>
                      </div>
                    <ContentWrapper>
                    <div className='prevContainer'>
                      <div className='prevHeadings' style={{paddingBottom:".8rem",paddingTop:".8rem"}}>
                          <div className='prevHead'>Date</div>
                          <div className='prevHead'>Theatre name</div>
                          <div className='prevHead'>Current Status</div>
                          <div className='prevHead'>Change Status</div>
                          {/* <div className='prevHead'>Booking Id</div> */}
                          {/* <div className='prevHead'>hjj</div> */}
                          
                      </div>
                      
                          {
                              pageDis?.map((station,index)=>{
                                const d=new Date(station.subscription).getDate()
                                const m=new Date(station.subscription).getMonth()+1
                                const y=new Date(station.subscription).getFullYear()
                                  return(
                                      <div className='prevBody' key={index}>
                                      <div className='prevValue'>{`${y}/${m}/${d}`}</div>
                                      <div className='prevValue'>{station.username}</div>
                                      <div className='prevValue'>{station.isAccess}</div>
                                      <div className='prevValue' style={{cursor:"pointer",backgroundColor:"darkgrey",color:"black",borderStyle:"hidden"}} onClick={()=>setDisAll(station._id)}>Change Status</div>
                                      {/* <div className='prevValue'>Block/Unblock</div> */}
                                      {/* <div className='prevValue'>hjj</div> */}
                                      </div>
                                  )
                              })
                          }
              
                    </div>
    
                    </ContentWrapper>
                    </div>
                    
                )}   
                
                    </AdminPageContent>
                </div>
                <AdminFooter/>
            </div>
            </ContentWrapper>
           
            
        </div>
    );
};

export default AdminHome


