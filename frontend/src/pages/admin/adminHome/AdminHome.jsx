import React, { useState, useEffect } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { FaRegMessage } from "react-icons/fa6";
import { CiBellOn } from "react-icons/ci";
import { Chart } from 'chart.js/auto';
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
  
    const[usersChartData,setUsersChartData] = useState({
        labels: ['Theatres', 'Game Stations'],
        datasets: [{
          data: [5, 9],
          backgroundColor: ['#00F0FF', '#7aeb34'],
        }],
    })
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
    const [users,setUsers]=useState(true)
    const [theatres,setTheatres]=useState(false)
    const [payments,setPayments]=useState(false)
    const [bookings,setBookings]=useState(false)
    const dispatch=useDispatch()
    const navigate=useNavigate()
  const { currentUser } = useSelector((state) => state.home);


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
        //    const { data} = fetchDataFromApi(`http://localhost:5000/api/admin/list`);
           const res= await fetch('http://localhost:5000/api/admin/list')
           let dat=await res.json();
          //  console.log(dat);
           setData(dat.viewers)
           setData2(dat.vendors)
         
           setLoading(false)
           
        } catch (error) {
            console.log(error.message);
            setLoading(false)
            setError(true)
       }
    };
    useEffect(() => {
        if (Chart.helpers) {
            Chart.helpers.each(Chart.instances, (instance) => {
              instance.destroy();
            });
          }
        listCalling()
    }, [])
   
    const setList = async () => {
      const allowedStations = data2.filter((station) => {
        if (station.isAccess=="Allowed") {
          return true;
        } else {
          return false; 
        }
      });
      const disAllowedStations = data2.filter((station) => {
       const today=new Date().getTime()
       const thatDay=new Date(station.subscription).getTime()
       const diff=today-thatDay
      //  if(station.username=="aswin theatre"){
      //   console.log("ash");
      //   console.log(diff);
      //  }
        if (diff>0) {
          return true;
        } else {
          return false; 
        }
      });
      
      setAllowed(allowedStations)
      setDisAllowed(disAllowedStations)
    }

    useEffect(() => {
      
      setList()
  }, [data2])

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
  }
  }, [disAll])
    return (
        <div className="explorePage">
            <div className="signout">
                <button onClick={handleSignOut}>signout</button>
            </div>
            <ContentWrapper>

            <div className="app" >
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
                    
                                         </div>
                                    {data?.length > 0 ? (
                                                     <>
                                            { data.map((item, index) => {
                                                
                                                return (
                                                        <div key={index}>
                                                    <div className="bar" ></div>
                                                        <div className="map">
                                                        <div className="slno">{index+1}</div>
                                                        <div className="username">{item.username}</div>
                                                        <div className="email">{item.email}</div>
                                                        <div className="edit"><button>Edit</button></div>
                                                        <div className="edit"><button>Block</button></div>
                                                        <div className="edit"><button>Unblock</button></div>
                                                        
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
                        {data2?.length > 0 ? (
                                         <>
                                          <div className="pageHeader">
                    <div className="pageTitle">
                        Vendor List
                    </div>
                    
                </div>
                                { data2.map((item, index) => {
                                    
                                    return (
                                            <ContentWrapper key={index}>
                                        <div className="bar"></div>
                                            <div className="map">
                                            <div className="slno">{index+1}</div>
                                            <div className="username">{item.username}</div>
                                            <div className="email">{item.email}</div>
                                            <div className="edit"><button>Edit</button></div>
                                            <div className="edit"><button>Block</button></div>
                                            <div className="edit"><button>Unblock</button></div>
                                            
                                        </div>
                                        
                                        </ContentWrapper>
                                    );
                                }) }
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
                           <DashboardCard name={"Bookings"} numb={56}/>
                           <DashboardCard name={"Payments"} numb={113}/>
                           <DashboardCard name={"Users"} numb={3500}/>
                           <DashboardCard name={"Theatres"} numb={115}/>
                        </div> 
                        <div style={{backgroundColor:"white",height:"400px",width:"400px"}}>
                        <Doughnut  data={usersChartData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: {
                                position: 'bottom',
                            },
                        }} 
                        />
                        <div>
            
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
                        </div>
                        </div>  

                                         
                    </>
                    
                )}



                     {!loading && payments&& (
                      
                   


                 

                    <div className='mainSection'>
                    <ContentWrapper>
                    <div className='prevContainer'>
                      <div className='prevHeadings'>
                          <div className='prevHead'>Date</div>
                          <div className='prevHead'>Theatre name</div>
                          <div className='prevHead'>Current Status</div>
                          <div className='prevHead'>Change Status</div>
                          {/* <div className='prevHead'>Booking Id</div> */}
                          {/* <div className='prevHead'>hjj</div> */}
                          
                      </div>
                      
                          {
                              disAllowed?.map((station,index)=>{
                                const d=new Date(station.subscription).getDate()
                                const m=new Date(station.subscription).getMonth()
                                const y=new Date(station.subscription).getFullYear()
                                  return(
                                      <div className='prevBody' key={index}>
                                      <div className='prevValue'>{`${y}/${m}/${d}`}</div>
                                      <div className='prevValue'>{station.username}</div>
                                      <div className='prevValue'>{station.isAccess}</div>
                                      <div className='prevValue' onClick={()=>setDisAll(station._id)}>Change Status</div>
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

export default AdminHome;


