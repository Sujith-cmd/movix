import { useEffect, useRef } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {format} from "timeago.js"
import useFetch, { useFetchGet } from "../../hooks/useFetch";
import DetailsBanner from "./detailsBanner/DetailsBanner";
import Similar from "./carousels/Similar";
import { useState } from "react";
import {loadStripe} from '@stripe/stripe-js';
import { useSelector, useDispatch } from "react-redux";
import { error, getApiConfiguration, getGenres,setCurrentData, setCurrentUser } from "../../store/homeSlice";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { FaArrowAltCircleRight } from "react-icons/fa";

import { getChats, getPrevious, toChat} from "../../store/userSlice.js";

import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import DropIn from "braintree-web-drop-in-react";
// import { fetchDataFromBackPost } from "../../utils/api.js";
import axios from "axios";

import './style.scss';
import { changestatus, chatCheck, createChat, update } from "../../utils/UserRequest.js";
import { userAxiosIntercepter } from "../../hooks/userAxios.jsx";
import { reviewAxiosIntercepter } from "../../hooks/reviewAxios.jsx";
import Img from "../../components/lazyLoadImage/Img.jsx";
import {ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const Details = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate()
    const { currentUser,currentData } = useSelector((state) => state.home);
    const userAxios=userAxiosIntercepter()
    const reviewAxios=reviewAxiosIntercepter()
    const [todayDate, setTodayDate] = useState(null)
    const scroll=useRef()
    const scroll2=useRef()
    const [eatBillAmt, setEatBillAmt] = useState(0)
    const [totalAmt, setTotalAmt] = useState(0)
    const [type, setType] = useState("Game")
    // const [clientToken, setClientToken] = useState("")
    const [time, setTime] = useState([])
    const [chatVisible, setChatVisible] = useState(false)
    const [rate, setRate] = useState(null)
    const [reviewText, setReviewText] = useState("")
    const [startChat, setstartChat] = useState(false)
    const [availableTime, setAvailableTime] = useState([])
    // const [bookedTime, setBookedTime] = useState([25,26])
    // const [index, setIndex] = useState(null)
    // const [instance, setInstance] = useState("")
    // const [loading, setLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)
    const [seatsNeeded, setSeatsNeeded] = useState(0)
    const [bill, setBill] = useState(0)
    const [extra, setExtra] = useState(false)
    const [sendReview, setSendReview] = useState(false)
  const [reviews,setReviews] = useState([])
  const [arra,setArra] = useState([])
  const [bookedEatings,setBookedEatings] = useState([])
  
    const [booking, setBooking] = useState({})
    const [vendorData, setvendorData] = useState({})
    const [facilityLength, setFacilityLength] = useState(0)
    const [a, setA] = useState(0)
    const [b, setB] = useState(1)
    const [c, setC] = useState(2)
    const [canReview,setCanReview] = useState(false)
    
    const { id } = useParams();
    const { data:vendorDat, loading:vendorLoading } = useFetchGet(`/vendors/getDetails/${id}`);
    // console.log(vendorData);
    const { data:GameData, loading:GameLoading } = useFetchGet(`/vendors/trending/${type}`);
    // const { data:reviewData, loading:reviewLoading } =useFetchGet(`/review//getReview/${id}`)
    // console.log("reviewDataDate");
    // console.log(reviewData);
    // const { data:previousData, loading:previousLoading } = useFetchGet(`http://localhost:5000/api/vendors/previous/${}`);
    useEffect(() => {
        setvendorData(vendorDat)
        setFacilityLength(vendorDat?.features?.length)
        if(vendorDat?.timeSlots?.length==0){
          alert("Current theatre doesn't have any available time.Please choose any other")
        }
       },[vendorDat])
     
       const nextFacility=async()=>{
        if(a+3<facilityLength){
          const aa=a
          const bb=b
          const cc=c
          setA(aa+3)
          setB(bb+3)
          setC(cc+3)
        }
       }
       const preFacility=async()=>{
        if(a>=3){
          const aa=a
          const bb=b
          const cc=c
          setA(aa-3)
          setB(bb-3)
          setC(cc-3)
        }
       }
     useEffect(() => {
    //  console.log("VENDORdTA");
    //  console.log(vendorData);
    if(vendorData!==null&&currentUser._id!==undefined){
      const viewersList=vendorData.viewers||[]
      const viewers = viewersList.some(function(view) {
        return view == String(currentUser._id);
      });
      if(viewers==true){
        setCanReview(true)
      }
    }
   
   
     }, [vendorData])
      const reviewsFetch= async ()=>{
        try {
          
          const response = await reviewAxios.get(`/getReview/${id}`).then((response) => {
         
            // setvendorData(response.data)
             // toast("user updated")
             setReviews(response.data)
             
           }).catch((err)=>{
             console.log(err);
           });
        } catch (error) {
          
        }
        // const session = await response.json()
        //  console.log("session");

          // console.log(response);
      }
      // const reviewsFetch= async ()=>{
      //   const response = await fetch(`http://localhost:5000/api/review//getReview/${id}`,{
      //     method:"GET"
      //   })
      //   const session = await response.json()
      //    console.log("session");

      //     console.log(session);
      //   setReviews(session)
      // }
      
      useEffect(() => {
        
    
       reviewsFetch()
       
    }, [reviewText])



    useEffect(() => {
      if(rate!==null){

        addReview()
      }
    }, [rate])
    // useEffect(() => {
     
    //   const date = new Date();
    //   const month = date.getMonth(); // Month (0-11; 0 is January, 11 is December)
    //   const day = date.getDate()<10?`0${date.getDate()}`:date.getDate();
   
    //   const year = date.getFullYear(); 
    //   // console.log(`${year}-${month}-${day}`);
    //   const date1=`${year}-${month+1}-${day}`
    //   const dateNow=new Date(date1)
  
    //   setTodayDate(dateNow)
      
    // },[])

    useEffect(() => {
      const date = new Date();
      const month = (date.getMonth() + 1)<10 ?`0${date.getMonth()+1}` : date.getMonth(); // Month (1-12)
      const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
      const year = date.getFullYear();
    
      const date1 = `${year}-${month}-${day}`;
      const dateNow = new Date(date1);
    //  console.log("dateInfo");
    //   console.log(date1);
      // console.log(day);
      setTodayDate(date1);
  },[]);
  

    const check=async(dateInput)=>{
      setAvailableTime([]);
      setTime([]);
      //  setSelectedDate(null)
       setSelectedDate(dateInput)
       const s1=vendorData?.bookedSlots?.[dateInput];
      //  console.log("s1");
      //  console.log(s1);
       if(s1==undefined||s1.length==0){
        // console.log("availtime");
        setAvailableTime([...vendorData?.timeSlots]);
        return 
        
      }
      const s2=vendorData?.timeSlots?.filter((t)=>{
        if(!s1?.includes(t)){
          return (t)
        }
      })
      
      // console.log("s2availtime");
       setAvailableTime([...s2]);

       
       
      setBooking({...booking})
  }
  useEffect(() => {
    console.log("abc");
  console.log(a);
  console.log(b);
  console.log(c);
  console.log(vendorData.features);
   }, [a])
 
   useEffect(() => {
   if(time.length>0){
     if(seatsNeeded<3){

       setBill(seatsNeeded*1.5*vendorDat?.price*time.length)
     }else{

       setBill(seatsNeeded*vendorDat?.price*time.length)
     }
    // setBill(bill*time.length)
   }
   }, [time])
 

   const submitBooking=async(e)=>{
    e.preventDefault()
    

 
  }
  //  useEffect(() => {
   
  //  }, [])

   const addTiming=async(dat)=>{
    // console.log("tie dat");
    // console.log(dat);
    var present=false
    for(let i=0;i<time.length;i++){
        if(time[i]==Number(dat)){
            present=true
        }
    }
     if(present){
       
      setTime(time.filter((emp) => emp !== Number(dat)))
     }else{
        setTime([...time,Number(dat)])
     }
     
   
   }

  

   useEffect(() => {
   if(currentUser.Role==0){
    setstartChat(true)
   }
   
   }, [currentUser])

  
   useEffect(() => {
    // if(seatsNeeded<1){
    //   toast("atleast 1 seat is mandatory")
    // }
    if(seatsNeeded>0&&seatsNeeded>vendorData?.seatingCapacity){
      toast(`maximum available seats is ${vendorData?.seatingCapacity}`)
    }
    if(seatsNeeded<3){
      
      const amount=vendorData?.price*seatsNeeded*1.5 ||0
    //   console.log("amount");
    // console.log(amount);
      setBill(amount)
      setExtra(true)
    }else{
     
      const amount=vendorData?.price*seatsNeeded ||0
    //   console.log("amount");
    // console.log(amount);
      setBill(amount)
      setExtra(false)
    }
    
   
    
   
   }, [seatsNeeded])

   useEffect(() => {
    scroll.current?.scrollIntoView({behavior:"auto"})
  
    },[reviews,chatVisible])
   useEffect(() => {
    scroll2.current?.scrollIntoView({behavior:"auto"})
    },[chatVisible])
   useEffect(() => {
  //  console.log("bookkkeeeddeeeaatings");
  //  console.log(bookedEatings);
   var amount=0
   bookedEatings.forEach(ob=>{
    if(ob.booked==true){

      amount+=ob.quantity*ob.price
    }
   })
  //  console.log("amt");
  //  console.log(amount);
  //  const amt=bill+amount
   setEatBillAmt(amount)

   }, [bookedEatings])
   useEffect(() => {
   setTotalAmt(bill+eatBillAmt)
   }, [bill,eatBillAmt])
 const handleChat=async()=>{
  
  const {data} =await getUser(userId)
  dispatch(getChats())
    navigate('/userProfile')
 }


 const eatBill = async (item, value, type, price) => {
  // ... existing code
  
  if (type === "numb") {
    const body = { item: item, quantity: Number(value), price: price, booked: false };
    const checkin = bookedEatings.find((eat) => eat.item === item);
    if (checkin === undefined) {
      setBookedEatings([...bookedEatings, body]);
    } else {
      const updatedEatings = bookedEatings.map((eat) =>
        eat.item !== item ? eat : { ...eat, quantity: Number(value) }
      );
      setBookedEatings(updatedEatings);
    }
  } else {
    var checking = bookedEatings.find((eat) => eat.item === item);
    if (checking === undefined) {
      const body = { item: item, quantity: 1, price: price, booked: true };
      setBookedEatings([...bookedEatings, body]);
    } else {
      const updatedEatings = bookedEatings.map((eat) =>
        eat.item !== item ? eat : { ...eat, booked: !eat.booked }
      );
      setBookedEatings(updatedEatings);
    }
  }
};



//  const eatBill= async(item,value,type,price)=>{
//     console.log("eeeeeeatt");
//     console.log(item);
//     console.log(value);
//     console.log(type);
//     if(type=="numb"){

//       const body={item:item,quantity:value,price:price,booked:false}
//       var checkin=bookedEatings.find((eat)=>{
//        eat.item==item
//       })
//       if(checkin==undefined){
//         setBookedEatings(...bookedEatings,body)
//       }else{
//         const check=bookedEatings.filter((eat)=>{
//         return  eat.item!==item
//         })
//         setBookedEatings(...check,{...checkin,quantity:value})
//       }
//     }else{
//       var checking=bookedEatings.find((eat)=>{
//         return eat.item==item
//        })
//        if(checking==undefined){
//         const body={item:item,quantity:1,price:price,booked:true}
//          setBookedEatings(...bookedEatings,body)
       
//        }else{
//         const body={...checking,booked:false}

//          const check=bookedEatings.filter((eat)=>{
//          return  eat.item!==item
//          })
//          setBookedEatings(...check,body)
//        }
//     }
//  }
// useEffect(() => {
// console.log("BOOKED EATINGS");
// console.log(bookedEatings);
// }, [bookedEatings])
 const walletPay= async()=>{
  if(seatsNeeded<1){
    return alert(`atleast 1 seat is mandatory`)

  }
  if(seatsNeeded>currentUser?.seatingCapacity){
    return alert(`maximum available seats is ${currentUser?.seatingCapacity}`)
  }
  if(currentUser.Role!==0){
    return alert("only users can book theatres/game stations")
  }
  const wallet=Math.random(10)*10*10*10*10*10*10*10*10*10*10*10*10*10*10*10*10*10*10
  const walletId="wallet"+wallet
  console.log("wallet");
  const amountTotal=bill+eatBillAmt
  if(bill>0){
  if(time.length!==0){
  if(amountTotal<=currentUser?.account_Bal){
  try {
    const res= await userAxios.post(`/booking/${id}/${currentUser._id}`,{
      pay:"wallet", bookedEatings, date:selectedDate,slots:time,theatreName:vendorData.username,theatreId:vendorData._id,userId:currentUser._id,username:currentUser.username,costPerHour:vendorData.price,bookingId:walletId,bill:amountTotal,status:"booked",wallet:true
      })
      let data= res.data
   
       dispatch(setCurrentUser(data.updatedUser))
      console.log("data");
      console.log(data);
   dispatch(getPrevious())
   navigate("/userProfile")
    } catch (error) {
    
    console.log("Catch vendorlogin error");
    console.log(error);
      
    }
  }else{
    toast("not enough Balance")
  }
}else{
  alert("select a time properly")
}
  }else{
    alert("fill the details correctly")
  }
 }
  //  makePayment
  const makePayment = async () =>{
    if(seatsNeeded<1){
      return alert(`atleast 1 seat is mandatory`)
  
    }
    if(seatsNeeded>currentUser?.seatingCapacity){
      return alert(`maximum available seats is ${currentUser?.seatingCapacity}`)
    }
    if(currentUser.Role!==0){
      return alert("only users can book theatres/game stations")
    }
    console.log(seatsNeeded);
    console.log(bill);
    console.log(time);
    if(bill>0){
      if(time.length!==0){
        
        
        
        try {
      const stripe = await loadStripe("pk_test_51OFALpSB9eYCrjcGKKeB3KGWjH3gP5Xs0lySh53YSxYjO3DFGqEGiaUSY5qSUDoq2Va9ld2D8mTkevKj99BfQ6cj00WPXqbZ9r");
      const headers = {
        "Content-Type":"application/json"
      }
      const amountTotal=bill+eatBillAmt
      // const body = {
      //   bill:amountTotal,theatrename:vendorData?.username,seatsNeeded,id
      // }
      const rest= await userAxios.post(`/checkout-session`,{bill:amountTotal,theatrename:vendorData?.username,seatsNeeded,id})
        let session= rest.data
        const result = stripe.redirectToCheckout({
          sessionId:session.id
        })
        console.log("result");
        console.log(result);
        alert(result);
    //    const response = await fetch("http://localhost:5000/api/users/checkout-session",{
    //   method:"POST",
    //   headers:headers,
    //   body:JSON.stringify(body)
    // })
    // const session = await response.json()
    // const result = stripe.redirectToCheckout({
    //   sessionId:session.id
    // })
    // console.log(session);
     
      if(result.error){
        console.log(result.error);
        toast("payment rejected.Try again")
      }else{
        dispatch(setCurrentData(result))
      try {
        const res= await userAxios.post(`/booking/${id}/${currentUser._id}`,{
          pay:"pay", bookedEatings, date:selectedDate,slots:time,theatreName:vendorData.username,theatreId:vendorData._id,userId:currentUser._id,username:currentUser.username,costPerHour:vendorData.price,bookingId:session.id,bill:session.total/100,status:"booked"
          })
          let data= res.data
       
           dispatch(setCurrentUser(data.updatedUser))
          console.log("data");
          console.log(data);
        
        } catch (error) {
        
        console.log("Catch vendorlogin error");
        console.log(error);
          
        }
      }
    } catch (error) {
      toast("something went wrong.Try again")
      console.log(error);
    }
    
  }else{
    alert("enter a valid time")
  }
}else{
  alert("fill the details correctly")
}
  }

  const addReview=async()=>{
  
    try {
      const res= await reviewAxios.post(`/rating/${currentUser._id}/${vendorData._id}`,{
        rating:rate
        }).then((response) => {
         
         setvendorData(response.data)
          // toast("user updated")
          
        }).catch((err)=>{
          console.log(err);
        });

      // const res= await fetch(`http://localhost:5000/api/review/rating/${currentUser._id}/${vendorData._id}`,{
      //     method: 'POST',
      //     headers:{
      //       'Content-Type': 'application/json',
      //     },
          
      //     body:JSON.stringify({rating:rate})
      //   })
      //   let data=await res.json();
      //   console.log("RateData");
      //   console.log(data);
      //   setvendorData(data)
        
      }catch(error){
        toast("something went wrong.Please try again")
       console.log(error);
      }
   }

  // handleReview
  const handleReview=async()=>{
    if(reviewText.trim()!==""){
      // console.log("here");
      // try {
        // const res= await fetch(`http://localhost:5000/api/review/createReview/${id}/${currentUser._id}`,{
        //     method: 'POST',
        //     headers:{
        //       'Content-Type': 'application/json',
        //     },
            
        //     body:JSON.stringify({text:reviewText})
        //   })
        //   let data=await res.json();
        //   // console.log(data);

        // }catch(error){
        //  console.log(error);
        // }
        const res= await reviewAxios.post(`/createReview/${id}/${currentUser._id}`,{
          text:reviewText
          }).then((response) => {
           
           setvendorData(response.data)
            // toast("user updated")
            
          }).catch((err)=>{
            console.log(err);
          });
    }else{
      toast("enter valid comment")
    }
   setReviewText("")
  }
 
  const launchChat=async()=>{
  //  console.log("launchChat working");
   if(currentUser._id){
     const body={senderId:`${currentUser._id}`,receiverId:`${vendorData._id}`  }
    
    try {
      const {data} = await chatCheck(currentUser._id,vendorData._id)
      // const data = await chatCheck(currentUser._id,vendorData._id)
     
      // console.log("chatCheck");
      // console.log(data);
      if(data.length==0){
       
        try {
          
          const {data} = await createChat(body)
          // console.log("createCheck is working");
          // console.log(data);
         
          dispatch(toChat(data))
        } catch (error) {
          console.log("details.jsx error in launchChat");
        }
      }else{
      
        dispatch(toChat(data[0]))
      }
    } catch (error) {
      console.log("details.jsx error in launchChat");
      console.log(error);
    }
    dispatch(getChats())
    navigate('/userProfile')
   
  }else{
    navigate('/userSignin')
   }
  }
//   const change=async()=>{
// try {
//   const {data} = await update("65584e6284a3c258aa5390df","6582dd3c1a55b19d88c57a6d")
//   console.log("changedChatss");
//   console.log(data);
// } catch (error) {
//   console.log("error in changeStatusChat");
//   console.log(error);
// }

  
    return (
        <div className="detail">
            <DetailsBanner  id={id} vendorData={vendorData}/>
          {/* <button onClick={change}>change</button> */}
          {vendorDat?.features?.length>0? (<ContentWrapper >
            <span style={{color:"white",fontSize:"80"}}>Features</span>
            {/* <Img src={vendorData?.features[1]?.featureFile||null}></Img> */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:"1rem"}}>
            <FaArrowAltCircleLeft onClick={preFacility} style={{color:"white",fontSize:"35"}}/>
            {vendorDat?( facilityLength>a?(<div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:"1rem",marginTop:"1rem"}}>
            <Img src={vendorDat?.features[a]?.featureFile} className="featureImage"></Img>
              <span style={{color:"white"}}>{vendorDat?.features[a]?.featureName}</span>
              <span style={{color:"white"}}>{vendorDat?.features[a]?.featureDescription}</span>
            </div>):("")):("")}
            {vendorDat?( facilityLength>b?(<div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:"1rem",marginTop:"1rem"}}>
            <Img src={vendorDat?.features[b]?.featureFile} className="featureImage"></Img>
              <span style={{color:"white"}}>{vendorDat?.features[b]?.featureName}</span>
              <span style={{color:"white"}}>{vendorDat?.features[b]?.featureDescription}</span>
            </div>):("")):("")}
            {vendorDat?( facilityLength>c?(<div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:"1rem",marginTop:"1rem"}}>
            <Img src={vendorDat?.features[c]?.featureFile} className="featureImage"></Img>
              <span style={{color:"white"}}>{vendorDat?.features[c]?.featureName}</span>
              <span style={{color:"white"}}>{vendorDat?.features[c]?.featureDescription}</span>
            </div>):("")):("")}
            {/* <Img src={"https://firebasestorage.googleapis.com/v0/b/screenshare-1c657.appspot.com/o/1700303747159d0e2ae7278c9d38fb20cbebe35a4a8cf.jpg?alt=media&token=cbbfc1ee-1ea2-492b-9fc4-98a208069ea7"||null} className="featureImage"></Img>
            <Img src={"https://firebasestorage.googleapis.com/v0/b/screenshare-1c657.appspot.com/o/1700303747159d0e2ae7278c9d38fb20cbebe35a4a8cf.jpg?alt=media&token=cbbfc1ee-1ea2-492b-9fc4-98a208069ea7"||null} className="featureImage"></Img> */}
            <FaArrowAltCircleRight onClick={nextFacility} style={{color:"white",fontSize:"35"}}/>
            </div>
            
          </ContentWrapper>):("") }
          {currentUser && 
          <ContentWrapper >

                <h3>Book Now</h3>
               {currentUser?(<div className="bookingWindow">
           <form className="bookingForm" onSubmit={submitBooking}>
           {extra && <div style={{fontSize:"12px",color:"white"}}>* booking less than 3 seats will charge you extra</div>}
           <div className="requiredSeats">
           <label className="requiredSeatsInput" htmlFor="seats">Seats Required</label>
            <input min={0}  id="seats" type="number" onChange={(e)=>{setSeatsNeeded(e.target.value)} }/>
          
           </div>
            <div  className="dateField"
            >

            <label className="dateLabel" htmlFor="date">pick A date</label>
            <input min="2024-01-27" className="dateInput" id="date" type="date" onChange={(e)=>{check(e.target.value)}}/>
            {/* <input min={todayDate} className="dateInput" id="date" type="date" onChange={(e)=>{check(e.target.value)}}/> */}
            </div>
            {selectedDate && (
  <div className="bookingStarted">
    {/* <div className="timeBooking"></div>
    <div></div> */}
    {availableTime?.map((timer, index) => {
      const isChecked = time.includes(timer) // Check if the timer is already in time state
      return (
        <div className="mapInput" key={index}>
          <label className="labelInput" htmlFor={timer}>{timer}.00 - {timer+1}.00</label>
          <input
            className="timeInput"
            id={timer}
            type="checkbox"
            checked={isChecked}
            onChange={(e) => { addTiming(e.target.id) }}
          />
        </div>
      );
    })
    
    
    }
    {/* <button className="bookingButton" type="submit">Book Now</button> */}
  </div>
)}

{/* {bill>0 ?():("")} */}
{bill>0 ?(
  
  <div className="paymentDiv">
    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
{vendorData?.eatables?.length>0?(<span style={{color:"white",margin:"1rem"}}>Eatables</span>):("")}
{vendorData?.eatables?.length>0?(<span style={{color:"white",margin:"1rem"}}>Eatable Price : {eatBillAmt}</span>):("")}
{vendorData?.eatables?.map((eat, index) => {
    return (
      <div key={index} style={{display:"flex",width:"100%",justifyContent:"space-around",borderRadius:"1rem",marginTop:".5rem",marginBottom:".5rem", gap:"4rem",alignItems:"center",backgroundColor:"grey",paddingLeft:"3rem",paddingRight:"3rem",paddingTop:".5rem"}}>
        {/* <span>{eat.image}</span> */}
        <Img src={eat.image} className="featureEat"></Img>
        <span>Item :{eat.item}</span>
        <span>Desc :{eat.description}</span>
        <span>Qnty :{eat.quantity}</span>
        <span>{eat.price}Rs</span>
        <div style={{display:"flex",flexDirection:"column"}}>
        <label htmlFor="eatItem" style={{color:"black",fontSize:"15px" }}>Order Quantity</label>
        <input id="eatItem" min={1} type="number" onChange={(e)=>eatBill(eat.item,e.target.value,"numb",eat.price)}/>
        </div>
        <div style={{display:"flex",flexDirection:"column"}}>
        <label htmlFor="eatItem" style={{color:"black"}}>select</label>
        <input id="eatItem"  type="checkbox" onChange={(e)=>eatBill(eat.item,e.target.checked,"book",eat.price)}/>
        </div>
      </div>
      );
    })
    
    
    }
    </div>
             <div className="mainPayment">
             
                <label className="paymentLabel" htmlFor="">Payment</label>
                <span style={{display:"flex",alignItems:"center"}}>
                  <button type="button" style={{color:"black",borderRadius:".99rem",width:"9rem",height:"2rem",marginRight:"1rem",fontWeight:"600",backgroundColor:"orange"}} onClick={walletPay}>Use Wallet</button>
                  <span style={{color:"white",width:"7rem",fontWeight:"600",marginRight:"1rem"}}>Avail. Balance</span>
                  <span style={{color:"white",gap:"1rem"}}>{currentUser.account_Bal}Rs</span>
                </span>
                <button style={{width:"100%",height:"3rem",fontWeight:"600",color:"black",borderRadius:"1rem"}} type="button">{bill+eatBillAmt}{".00Rs"}</button>
                {/* <input  className="paymentInput" type="text" value={bill} /> */}
              
              <button type="button" style={{width:"9rem",height:"3rem",borderRadius:"1.5rem",fontWeight:"600",backgroundColor:"orange"}} onClick={makePayment}>Book Now</button>
          
            </div> 
           </div>
            ):("")
          }
           </form>
           {/* <p className="para">{time}</p> */}
           
          </div>):("")}
            <div style={{display:"flex",justifyContent:"flex-end"}}>

            <button style={{fontWeight:"600",borderRadius:"15px",borderStyle:"none",justifySelf:"center",width:"150px",height:"30px"}} type="botton" onClick={launchChat}>Chat</button>
            </div>
          </ContentWrapper>
        
  }
         
     {canReview && <ContentWrapper>
        
        {/* <div style={{padding:"10px"}}> */}
        <div >
         <div style={{height:"100px",display:"flex",gap:"1rem"}}>
          <span style={{fontWeight:"600",color:"white"}}>Rate it</span>
          <span  style={{height:"25px",width:"50px",textAlign:"center",borderRadius:"60%",paddingTop:"5px",fontWeight:"600"}} className={rate==1?'rated':'notRated'} onClick={()=>{setRate(1)}}>1</span>
          <span  className={rate==2?'rated':'notRated'} style={{height:"25px",width:"50px",textAlign:"center",borderRadius:"60%",paddingTop:"5px",fontWeight:"600"}} onClick={()=>{setRate(2)}}>2</span>
          <span  className={rate==3?'rated':'notRated'} style={{height:"25px",width:"50px",textAlign:"center",borderRadius:"60%",paddingTop:"5px",fontWeight:"600"}} onClick={()=>{setRate(3)}}>3</span>
          <span  className={rate==4?'rated':'notRated'} style={{height:"25px",width:"50px",textAlign:"center",borderRadius:"60%",paddingTop:"5px",fontWeight:"600"}} onClick={()=>{setRate(4)}}>4</span>
          <span  className={rate==5?'rated':'notRated'} style={{height:"25px",width:"50px",textAlign:"center",borderRadius:"60%",paddingTop:"5px",fontWeight:"600"}} onClick={()=>{setRate(5)}}>5</span>
          {/* <span style={{height:"25px",width:"50px",textAlign:"center",backgroundColor:"blue"}} onClick={()=>{addReview(1)}}>1</span>
          <span  style={{height:"25px",width:"50px",textAlign:"center",backgroundColor:"blue"}} onClick={addReview(2)}>2</span>
          <span  style={{height:"25px",width:"50px",textAlign:"center",backgroundColor:"blue"}} onClick={addReview(3)}>3</span>
          <span  style={{height:"25px",width:"50px",textAlign:"center",backgroundColor:"blue"}} onClick={addReview(4)}>4</span>
          <span  style={{height:"25px",width:"50px",textAlign:"center",backgroundColor:"blue"}} onClick={addReview(5)}>5</span> */}
         </div>
          <span ref={chatVisible?scroll2:null} style={{color:"white",fontSize:"20px",fontWeight:"600"}} onClick={()=>setChatVisible(!chatVisible)}>Comments</span>
      {chatVisible && < div className="chat-body">
         {reviews.map((review,index)=>{
          // console.log(review.userId);
          // const session= getReviewDetails(review.userId)
          // console.log( getReviewDetails(review.userId));
          return (
          <div   key={index} >
            <div className={review?.userId?._id==currentUser._id?"Omessage":"Omessage"}  >

          
          {/* <div ref={scroll}  key={index} className={review?.userId?._id==currentUser._id?"Omessage Oown":"Omessage"}> */}
            <span  ref={scroll} style={{fontSize:"18px"}}>{review.text}</span>
            
            <span>Posted On: {format(review.createdAt)}</span>
            <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>

            <img style={{height:"30px",width:"30px",borderRadius:"15px"}} src={review?.userId?.displayPicture} alt="df" />
            <span style={{color:"chocolate",fontWeight:"500"}}>{review?.userId?.username}</span>
            </div>
            {/* <span>{session.username}</span> */}
            </div>
          </div>
          )
})
  
         }
        </div>}
       <ToastContainer/>
      
        <div>
          <form style={{marginTop:"1rem",display:"flex",flexDirection:"column",gap:"1rem",alignItems:"center"}}>
            <input style={{width:"60%",height:"40px",paddingLeft:"26%",borderRadius:"20px"}} type="text" value={reviewText} onChange={(e)=>setReviewText(e.target.value)} onClick={()=>chatVisible?"":setChatVisible(!chatVisible)} placeholder="Post a Review"/>
            <button style={{width:"10%",height:"30px",borderRadius:"15px"}} type="button" onClick={handleReview}>Post Chat</button>
          </form>
        </div>
        </div>
        </ContentWrapper> 
}
<ToastContainer/>
<Similar data={GameData} loading={GameLoading} /> 

        </div>
    
    )
}
export default Details;



// {
//   !clientToken? (""):(
//     <>
//      <DropIn options={{ authorization: clientToken,
//   paypal:{
//        flow:'vault'   
//       }
//     }}
//     onInstance={(instance) => setInstance(instance)}
//     />
 
//     {/* </div> */} 
//     </>
//   )
// }