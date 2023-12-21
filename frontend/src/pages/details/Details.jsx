import { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {format} from "timeago.js"
import useFetch, { useFetchGet } from "../../hooks/useFetch";
import DetailsBanner from "./detailsBanner/DetailsBanner";
import Similar from "./carousels/Similar";
import { useState } from "react";
import {loadStripe} from '@stripe/stripe-js';
import { useSelector, useDispatch } from "react-redux";
import { error, getApiConfiguration, getGenres,setCurrentData, setCurrentUser } from "../../store/homeSlice";

import { getChats, getPrevious, toChat} from "../../store/userSlice.js";

import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import DropIn from "braintree-web-drop-in-react";
// import { fetchDataFromBackPost } from "../../utils/api.js";
import axios from "axios";

import './style.scss';
import { chatCheck, createChat } from "../../utils/UserRequest.js";
import { userAxiosIntercepter } from "../../hooks/userAxios.jsx";
import { reviewAxiosIntercepter } from "../../hooks/reviewAxios.jsx";
const Details = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate()
    const { currentUser,currentData } = useSelector((state) => state.home);
    const userAxios=userAxiosIntercepter()
    const reviewAxios=reviewAxiosIntercepter()
    const [todayDate, setTodayDate] = useState(null)
   
    const [type, setType] = useState("Game")
    // const [clientToken, setClientToken] = useState("")
    const [time, setTime] = useState([])
    const [rate, setRate] = useState(null)
    const [reviewText, setReviewText] = useState("")
    const [startChat, setstartChat] = useState(false)
    const [availableTime, setAvailableTime] = useState([])
    // const [bookedTime, setBookedTime] = useState([25,26])
    // const [index, setIndex] = useState(null)
    // const [instance, setInstance] = useState("")
    // const [loading, setLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)
    const [seatsNeeded, setSeatsNeeded] = useState(1)
    const [bill, setBill] = useState(0)
    const [sendReview, setSendReview] = useState(false)
  const [reviews,setReviews] = useState([])
  const [arra,setArra] = useState([])
  
    const [booking, setBooking] = useState({})
    const [vendorData, setvendorData] = useState({})
    
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
       },[vendorDat])


      const reviewsFetch= async ()=>{
        const response = await reviewAxios.get(`/getReview/${id}`)
        // const session = await response.json()
        //  console.log("session");

          // console.log(response);
        setReviews(response.data)
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
        
        console.log("the useEffectData");
       reviewsFetch()
       
    }, [reviewText])


//     const getDetails=async(userId)=>{
//       const response = await fetch(`http://localhost:5000/api/users/${userId}`,{
//           method:"GET"
//         })
//         var session = await response.json()
//         return session
//     }
//     const getReviewDetails=async()=>{
//       var arr=[]
//       // reviews.forEach(async(review, index) => {
//       //   const det=await getDetails(review.userId)
//       //   // console.log("det");
//       //   // console.log(det);
//       //   arr.push(det)
       
     
//       // });
//       for (const [index, review] of reviews.entries()) {
//         const det = await getDetails(review.userId);
//         arr.push(det);
//       }
// console.log("arr");
//       console.log(arr);
    
//       // console.log("getReview");
//       // console.log("arra");
//       // console.log(arra);
//       // return session
//     }

    useEffect(() => {
      if(rate!==null){

        addReview()
      }
    }, [rate])
    useEffect(() => {
     
      const date = new Date();
      const month = date.getMonth(); // Month (0-11; 0 is January, 11 is December)
      const day = date.getDate()<10?`0${date.getDate()}`:date.getDate();
   
      const year = date.getFullYear(); 
      // console.log(`${year}-${month}-${day}`);
      const date1=`${year}-${month+1}-${day}`
  
      setTodayDate(date1)
      
    },[])

    const check=async(dateInput)=>{
      setAvailableTime([]);
      setTime([]);
      //  setSelectedDate(null)
       setSelectedDate(dateInput)
       const s1=vendorData?.bookedSlots?.[dateInput];
      //  console.log(s1);
       if(s1==undefined||s1.length==0){
        console.log("availtime");
        setAvailableTime([...vendorData?.timeSlots]);
        return 
        
      }
      const s2=vendorData?.timeSlots?.filter((t)=>{
        if(!s1?.includes(t)){
          return (t)
        }
      })
      
      console.log("s2availtime");
       setAvailableTime([...s2]);

       
       
      setBooking({...booking})
  }
  // useEffect(() => {
  //   console.log(availableTime);
  //  }, [availableTime])
 
   useEffect(() => {
   if(time.length>0){
  
    setBill(bill*time.length)
   }
   }, [time])
 

   const submitBooking=async(e)=>{
    e.preventDefault()
    

 
  }
//    

   const addTiming=async(dat)=>{
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

  //  const getToken = async () =>{
  //   try {
  //     const {data} = await axios.get(`http://localhost:5000/api/users/braintree/token`)
  //     console.log("tokendata");
  //     console.log(data);
  //     setClientToken(data?.clientToken)
  //   } catch (error) {
      
  //   }
  //  }

   useEffect(() => {
   if(currentUser.Role==0){
    setstartChat(true)
   }
   }, [currentUser])

  //  const handlePayment=async()=>{
  //   try {
  //     setLoading(true)
  //     const {nonce}= await instance.requestPaymentMethod()
  //     const {data} = await axios.post(`http://localhost:5000/api/users/braintree/token`,{
  //       bill,nonce
  //     })
  //     console.log("handlePayment");
  //     console.log(data);
  //     setLoading(false)
  //     navigate('/')
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false)
  //   }
  //  }
  //  setBill(`${vendorData?.price*seatsNeeded}`)
  // setAmount
  
  //  useEffect(() => {
    
  //    console.log("bill");
  //    console.log(bill);
  //   }, [bill])
   useEffect(() => {
    if(seatsNeeded<3){

      const amount=vendorData?.price*seatsNeeded*1.5 ||0
    //   console.log("amount");
    // console.log(amount);
      setBill(amount)
    }else{

      const amount=vendorData?.price*seatsNeeded ||0
    //   console.log("amount");
    // console.log(amount);
      setBill(amount)
    }
    
   
    
   
   }, [seatsNeeded])
  //  useEffect(() => {
  //  console.log("bill");
  //  console.log(bill);
  //  }, [bill])
 const handleChat=async()=>{
  
  const {data} =await getUser(userId)
  dispatch(getChats())
    navigate('/userProfile')
 }


 const walletPay= async()=>{
  const wallet=Math.random(10)*10*10*10*10*10*10*10*10*10*10*10*10*10*10*10*10*10*10
  const walletId="wallet"+wallet
  try {
    const res= await userAxios.post(`/booking/${id}/${currentUser._id}`,{
        date:selectedDate,slots:time,theatreName:vendorData.username,theatreId:vendorData._id,userId:currentUser._id,username:currentUser.username,costPerHour:vendorData.price,bookingId:walletId,bill,status:"booked",wallet:true
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
 }
  //  makePayment
  const makePayment = async () =>{
    const stripe = await loadStripe("pk_test_51OFALpSB9eYCrjcGKKeB3KGWjH3gP5Xs0lySh53YSxYjO3DFGqEGiaUSY5qSUDoq2Va9ld2D8mTkevKj99BfQ6cj00WPXqbZ9r");
    const body = {
      bill,theatrename:vendorData?.username,seatsNeeded,id
    }
    const headers = {
      "Content-Type":"application/json"
    }
    const response = await fetch("http://localhost:5000/api/users/checkout-session",{
      method:"POST",
      headers:headers,
      body:JSON.stringify(body)
    })
    const session = await response.json()
    const result = stripe.redirectToCheckout({
      sessionId:session.id
    })
    console.log(session);
    // dispatch(setCurrentData(session))
    if(result.error){
      console.log(result.error);
    }
    try {
      const res= await userAxios.post(`/booking/${id}/${currentUser._id}`,{
          date:selectedDate,slots:time,theatreName:vendorData.username,theatreId:vendorData._id,userId:currentUser._id,username:currentUser.username,costPerHour:vendorData.price,bookingId:session.id,bill:session.total/100,status:"booked"
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

  const addReview=async()=>{
  
    try {
      const res= await fetch(`http://localhost:5000/api/review/rating/${currentUser._id}/${vendorData._id}`,{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
          },
          
          body:JSON.stringify({rating:rate})
        })
        let data=await res.json();
        console.log("RateData");
        console.log(data);
        setvendorData(data)
        
      }catch(error){
       console.log(error);
      }
   }

  // handleReview
  const handleReview=async()=>{
    if(reviewText!==""){
      // console.log("here");
      try {
        const res= await fetch(`http://localhost:5000/api/review/createReview/${id}/${currentUser._id}`,{
            method: 'POST',
            headers:{
              'Content-Type': 'application/json',
            },
            
            body:JSON.stringify({text:reviewText})
          })
          let data=await res.json();
          // console.log(data);
        }catch(error){
         console.log(error);
        }
    }
   setReviewText("")
  }
 
  const launchChat=async()=>{
   console.log("launchChat working");
   if(currentUser._id){
     const body={senderId:`${currentUser._id}`,receiverId:`${vendorData._id}`  }
    
    try {
      const {data} = await chatCheck(currentUser._id,vendorData._id)
     
      
      if(data.length==0){
       
        try {
          
          const {data} = await createChat(body)
          console.log("createCheck is working");
          console.log(data);
         
          dispatch(toChat(data))
        } catch (error) {
          console.log("details.jsx error in launchChat");
        }
      }else{
      
        dispatch(toChat(data))
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
    return (
        <div className="detail">
            <DetailsBanner  id={id} vendorData={vendorData}/>
         
          {currentUser && 
          <ContentWrapper >

                <h3>Book Now</h3>
               <div className="bookingWindow">
           <form className="bookingForm" onSubmit={submitBooking}>
           <div className="requiredSeats">
           <label className="requiredSeatsInput" htmlFor="seats">Seats Required</label>
            <input min="0"  id="seats" type="text" onChange={(e)=>{setSeatsNeeded(e.target.value)} }/>
          
           </div>
            <div  className="dateField"
            >

            <label className="dateLabel" htmlFor="date">pick A date</label>
            <input min={todayDate} className="dateInput" id="date" type="date" onChange={(e)=>{check(e.target.value)}}/>
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
{bill>0 ?(

  <div className="paymentDiv">
             <div className="mainPayment">
             
                <label className="paymentLabel" htmlFor="">Payment</label>
                <span style={{display:"flex"}}>
                  <button type="button" style={{backgroundColor:"blue",width:"9rem",height:"2rem",marginRight:"1rem"}} onClick={walletPay}>Use Wallet</button>
                  <span style={{color:"white",width:"7rem"}}>Avail. Balance</span>
                  <span style={{color:"white"}}>{currentUser.account_Bal}</span>
                </span>
                <button style={{width:"9rem",height:"3rem",borderRadius:"80%",fontWeight:"600",color:"blue",backgroundColor:"chocolate",borderStyle:"NONE"}} type="button">{bill}{".00Rs"}</button>
                {/* <input  className="paymentInput" type="text" value={bill} /> */}
              
              <button type="button" style={{width:"9rem",height:"3rem",borderRadius:"1.5rem"}} onClick={makePayment}>Book Now</button>
          
            </div> 
           </div>
            ):("")
          }
           </form>
           <p className="para">{time}</p>
           
          </div>
            <div style={{display:"flex",justifyContent:"flex-end"}}>

            <button style={{fontWeight:"600",borderRadius:"15px",borderStyle:"none",justifySelf:"center",width:"150px",height:"30px"}} type="botton" onClick={launchChat}>Chat</button>
            </div>
          </ContentWrapper>
        
  }
         
     {currentUser && <ContentWrapper>
        
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
          <span style={{color:"white",fontSize:"20px",fontWeight:"600"}}>Comments</span>
       < div className="chat-body">
         {reviews.map((review,index)=>{
          // console.log(review.userId);
          // const session= getReviewDetails(review.userId)
          // console.log( getReviewDetails(review.userId));
          return (
          <div  key={index} className={review?.userId?._id==currentUser._id?"Omessage Oown":"Omessage"}>
            <span style={{fontSize:"18px"}}>{review.text}</span>
            <span>{format(review.createdAt)}</span>
            <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>

            <img style={{height:"30px",width:"30px",borderRadius:"15px"}} src={review?.userId?.displayPicture} alt="df" />
            <span style={{color:"chocolate",fontWeight:"500"}}>{review?.userId?.username}</span>
            </div>
            {/* <span>{session.username}</span> */}
          
          </div>
          )
})
  
         }
        </div>
     
      
        <div>
          <form style={{marginTop:"1rem",display:"flex",flexDirection:"column",gap:"1rem",alignItems:"center"}}>
            <input style={{width:"60%",height:"40px",paddingLeft:"26%",borderRadius:"20px"}} type="text" onChange={(e)=>setReviewText(e.target.value)} placeholder="Post a Review"/>
            <button style={{width:"10%",height:"30px",borderRadius:"15px"}} type="button" onClick={handleReview}>Post Chat</button>
          </form>
        </div>
        </div>
        </ContentWrapper> 
}
<Similar data={GameData} loading={GameLoading} /> 

        </div>
    );
};

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