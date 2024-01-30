import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { setCurrentUser, signout } from "../../store/homeSlice.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ContentWrapper from '../../components/contentWrapper/ContentWrapper.jsx';
import './style.scss'
import { axiosIn, axiosInTok, fetchDataFromApi, fetchDataFromBackGet } from '../../utils/api.js';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import  {app}  from '../../firebase.js';
import { getBasic, getFacilities, getSlots, getChats } from '../../store/vendorSlice.js';
import {  } from '../../store/vendorSlice.js';
import noImg from "../../assets/no-facility.png"
import Select from 'react-select';
import Chat from '../../components/chat/Chat.jsx';
import {loadStripe} from '@stripe/stripe-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { vendorAxiosIntercepter } from '../../hooks/vendorAxios.jsx';
import { IoIosCloseCircleOutline } from "react-icons/io";
import ReactPaginate from "react-paginate";


export default function Profile() {
  const { currentUser } = useSelector((state) => state.home);
  const [formData, setFormData] = useState({})
  const [error,setError]=useState(false)
  const [username,setUsername ]=useState(currentUser.username)
  const [thumbnailPic, setThumbnailPic]=useState(currentUser.thumbnailPic)
  const [displayPicture, setDisplayPicture]=useState(currentUser.displayPicture)
  const [houseNo,setHouseNo ]=useState(currentUser?.address?.houseNo||"")
  const [addresslineOne,setAddresslineOne ]=useState(currentUser?.address?.addresslineOne||"")
  const [addresslineTwo,setAddresslineTwo ]=useState(currentUser?.address?.addresslineTwo||"")
  const [post,setPost ]=useState(currentUser?.address?.postOffice||"")
  const [district,setDistrict ]=useState(currentUser?.address?.district||"")
  const [state,setState ]=useState(currentUser?.address?.state||"")
  const [remark,setRemark ]=useState(currentUser?.address?.remark||"")
  const [seating,setSeating ]=useState(currentUser.seatingCapacity)
  const [price,setPrice ]=useState(currentUser.price)
  const [featureName,setFeatureName ]=useState(null)
  const [featurePic,setFeaturePic ]=useState(null)
  const [featureDescription,setFeatureDescription ]=useState(null)
  const [eatableItem,setEatableItem ]=useState(null)
  const [eatableQuantity,setEatableQuantity ]=useState(null)
  const [eatableDescription,setEatableDescription ]=useState(null)
  const [eatablePrice,setEatablePrrice ]=useState(null)
  const [eatablePic,setEatablePic ]=useState(null)
  
  
  const dpRef=useRef(null)
  const thumbRef=useRef(null)
  const facilityRef=useRef(null)
  const EatableRef=useRef(null)
  const [image,setImage]=useState(undefined)
  const [facilityImage,setFacilityImage]=useState(undefined)
  const [eatableImage,setEatableImage]=useState(undefined)
  const [thumb,setThumb]=useState(undefined)
  const [dpPercentage,setDpPercentage]=useState(0)
  const [thumbPercentage,setThumbPercentage]=useState(0)
  const [facilityPercentage,setFacilityPercentage]=useState(0)
  const [eatablePercentage,setEatablePercentage]=useState(0)
  const [imageError, setImageError] = useState(false)
  const [thumbImageError, setThumbImageError] = useState(false)
  const [facilityError, setFacilityError] = useState(false)
  const [eatableError, setEatableError] = useState(false)
  const [access, setAccess] = useState(false)
  const [subAmt, setSubAmt] = useState(0)
  const [changed, setChanged] = useState(null)
  const [prevBooking, setPrevBooking] = useState(false)
  
  const dispatch=useDispatch()
  const { basic,facility,slots,chats } = useSelector((state) => state.vendor);
  const { token } = useSelector((state) => state.home);
  const navigate=useNavigate()
  const vendorAxios=vendorAxiosIntercepter()

useEffect(() => {
  dispatch(getBasic())
}, [])
  // const [userPresent, setUserPresent] = useState(false)
  // const [console,setConsole]=useState(currentUser.fea)

  // fetchDataFromBackGet("")
 
//   const fetchFacility=axios({
//     method: 'post',
//     url: `http://localhost:5000/api/vendors/facility/${currentUser._id}`,
//     headers: {}, 
//     data: {
//       username:username,
//       displayPicture,
//       thumbnailPic,
//       houseNo:houseNo,
//       addresslineOne:addresslineOne,
//       addresslineTwo:addresslineTwo,
//       postOffice:post,
//       district:district,
//       state:state,
//     seatingCapacity:Number(seating),
      
//     pricePerHour:Number(price)
//     }
//   })
// .then((response) => {
//   console.log(response);
// }).catch((err)=>{
//   console.log(err);
// });
const [selectedOption, setSelectedOption] = useState(null);

//  useEffect(() => {
//  console.log(selectedOption);
//  }, [selectedOption])
  useEffect(() => {
   
      if(image!==undefined&&image!==""){
        if (image?.name?.endsWith(".jpg")||image?.name?.endsWith(".jpeg")||image?.name?.endsWith(".png")) {
          handleFileUpload(image)
        }
       
          else{
            toast("invalid image format")
          }
        }
  }, [image])
  
  const handleFileUpload = async (image) => {
    const storage = getStorage(app)
    const filename= new Date().getTime() + image.name;
    const storageRef=ref(storage, filename);
    const uploadTask= uploadBytesResumable(storageRef,image);
    uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred /
      snapshot.totalBytes) * 100;
      setDpPercentage(Math.round(progress))
    },
    
    (error) => {
     setImageError(true)
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
        setDisplayPicture(downloadURL)
        
      })
    }
    ) 
   
  }

  useEffect(() => {
   
    if(thumb!==undefined&&thumb!==""){
      if (thumb?.name?.endsWith(".jpg")||thumb?.name?.endsWith(".jpeg")||thumb?.name?.endsWith(".png")) {
        handleFileUploadThumb(thumb)
      }
     
        else{
          toast("invalid image format")
        }
      }
}, [thumb])
const handleFileUploadThumb = async (image) => {
  const storage = getStorage(app)
  const filename= new Date().getTime() + image.name;
  const storageRef=ref(storage, filename);
  const uploadTask= uploadBytesResumable(storageRef,image);
  uploadTask.on('state_changed',
  (snapshot) => {
    const progress = (snapshot.bytesTransferred /
    snapshot.totalBytes) * 100;
    setThumbPercentage(Math.round(progress))
  },
  
  (error) => {
    setThumbImageError(true)
  },
  ()=>{
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
      setThumbnailPic(downloadURL)
      
    })
  }
  ) 
 
}

useEffect(() => {
  
  if(facilityImage!==undefined&&facilityImage!==""){
    if (facilityImage?.name?.endsWith(".jpg")||facilityImage?.name?.endsWith(".jpeg")||facilityImage?.name?.endsWith(".png")) {
      handleFileUploadFacility(facilityImage)
    }
   
      else{
        toast("invalid image format")
      }
    }
}, [facilityImage])
const handleFileUploadFacility = async (image) => {
  
const storage = getStorage(app)
const filename= new Date().getTime() + image.name;
const storageRef=ref(storage, filename);
const uploadTask= uploadBytesResumable(storageRef,image);
uploadTask.on('state_changed',
(snapshot) => {
  const progress = (snapshot.bytesTransferred /
  snapshot.totalBytes) * 100;
  setFacilityPercentage(Math.round(progress))
},

(error) => {
  setFacilityError(true)
},
()=>{
  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
    setFeaturePic(downloadURL)
    
  })
}
) 

}

useEffect(() => {
  console.log("eatableImage");
  console.log(eatableImage);
  if(eatableImage!==undefined&&eatableImage!==""){
  if (eatableImage?.name?.endsWith(".jpg")||eatableImage?.name?.endsWith(".jpeg")||eatableImage?.name?.endsWith(".png")) {
    handleFileUploadEatable(eatableImage)
  }
 
    else{
      toast("invalid image format")
    }
  }
}, [eatableImage])
const handleFileUploadEatable = async (image) => {
const storage = getStorage(app)
const filename= new Date().getTime() + image.name;
const storageRef=ref(storage, filename);
const uploadTask= uploadBytesResumable(storageRef,image);
uploadTask.on('state_changed',
(snapshot) => {
  const progress = (snapshot.bytesTransferred /
  snapshot.totalBytes) * 100;
  setEatablePercentage(Math.round(progress))
},

(error) => {
  setEatableError(true)
},
()=>{
  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
    setEatablePic(downloadURL)
    
  })
}
) 

}
  // const handleChange = (e)=>{
  //   setformData({...formData,[e.target.id]:e.target.value})
  //   console.log(formData);
  // }
  const handleSubmitData = async(e)=>{
    console.log("typeof");
    console.log(seating);
    console.log(price);
    console.log(Number(seating));
    console.log(Number(price));
    e.preventDefault()
    if(username.length>0&&username.trim()==""){
      toast("Enter valid credentials")
     }else if(houseNo.length>0&&houseNo.trim()==""){
       toast("Enter valid housename")
     }else if(addresslineOne.length>0&&addresslineOne.trim()==""){
       toast("Enter valid address")
     }else if(addresslineTwo.length>0&&addresslineTwo.trim()==""){
       toast("Enter valid address")
     }else if(postOffice.length>0&&postOffice.trim()==""){
      toast("Enter valid postname")
    }else if(district.length>0&&district.trim()==""){
      toast("Enter valid district")
    }else if(state.length>0&&state.trim()==""){
      toast("Enter valid state")
    }else if(isNaN(Number(seating))){
     toast("enter a valid seat number")
    }else if(isNaN(Number(price))){
      toast("enter a valid price")
     }
     else{
  //  console.log("vendorUpdation")
  console.log("vendorrr");
    try {
        if(
            currentUser?.username==username.trim()
         && currentUser?.address?.houseNo==houseNo.trim() 
         && currentUser?.address?.addresslineOne==addresslineOne.trim()
         && currentUser?.address?.addresslineTwo==addresslineTwo.trim()
         && currentUser?.address?.postOffice==post.trim()
         && currentUser?.address?.district==district.trim()
         && currentUser?.address?.state==state.trim()
         && currentUser?.address?.remark==remark.trim()
         && currentUser?.seatingCapacity==seating
         && currentUser?.pricePerHour==price
         && currentUser?.displayPicture==displayPicture 
         && currentUser?.thumbnailPic==thumbnailPic
        ){
          return toast("Nothing to update")
        }
      const res= await vendorAxios.post(`/update/${currentUser._id}`,{
        username:username,
            displayPicture,
            thumbnailPic,
            houseNo:houseNo.trim(),
            addresslineOne:addresslineOne.trim(),
            addresslineTwo:addresslineTwo.trim(),
            postOffice:post.trim(),
            district:district.trim(),
            state:state.trim(),
            remark:remark.trim(),
          seatingCapacity:Number(seating),
            
          pricePerHour:Number(price)
        })
    .then((response) => {
      console.log(response);
      dispatch(setCurrentUser(response.data))
      // dispatch(getFacilities())
      toast("Details updated")
      setThumbnailPic("")
      setDisplayPicture("")
    }).catch((err)=>{
      console.log(err);
      toast("Something went wrong")
    });
     
      
    } catch (error) {
      console.log(error);
      setError(true)
      return
    }
  }
  }
  
  const handleSignOut = async () => {
    try {
      const result = confirm('Do you want to signout?');
      if (result) {
  const res= await fetch('http://localhost:5000/api/vendors/signout')
        let data=await res.json();
        dispatch(signout())
        console.log(data);
  // User clicked "OK"
  // alert('You clicked OK.');
  navigate('/')
} else {
  // User clicked "Cancel"
  // alert('You clicked Cancel.');
}
        
  } catch (error) {
    console.log(error);
  }
  }
  
  const addFacility = async (e) => {
    e.preventDefault()
    if(featureName==undefined||featureName==null||featureName.trim()==""){
      toast("Please fill the feature name")
    }else if(featureDescription==null||featureDescription==undefined||featureDescription.trim()==""){
      toast("Please fill the feature description")
    }else if(featurePic==undefined||featurePic==null||featurePic.trim()==""){
      toast("Please upload a feature picture")

    }else{
    setChanged("changed")
    
    //  const dat={ featureName,
    //   featureDescription,
    //   featurePic}
    // const res=await vendorAxios.patch(`/vendors/facilities/${currentUser._id}`,dat)
    // let data= res.data
    // console.log("added facility");
    // console.log(data);

  //   axiosIn.patch(`/vendors/facilities/${currentUser._id}`,{featureName,
  //           featureDescription,
  //           featurePic}).then((response) => {
         
  //     dispatch(setCurrentUser(response.data))   
  //     toast("facility updated")
  // console.log("FACILITY TEST");
  // console.log(response);
     
    
  // }).catch((error)=>{
   
  //  console.log("error in signup");
  //  const err=error.response.data.msg;
  //  toast(err)
  // })
  // axios({
    //   method: 'patch',
    //   url: `http://localhost:5000/api/vendors/facilities/${currentUser._id}`,
    //   headers: {
      //     'Authorization':token
      //   }, 
      //   data: {
        //     featureName,
        //     featureDescription,
        //     featurePic
        //   }
        // })
        const res= await vendorAxios.patch(`/facilities/${currentUser._id}`,{
          featureName,
              featureDescription,
              featurePic
          })
  .then((response) => {
  
    dispatch(setCurrentUser(response.data))
    // setConsole(response)
    setChanged(null)
  
  }).catch((err)=>{
    console.log(err);
  });
   setFeatureName("")
   setFeaturePic("")
   setFeatureDescription("")
   setFacilityImage("")
  }
}
  const addEatables = async (e) => {
    e.preventDefault()
   
    // axios({
    //   method: 'patch',
    //   url: `http://localhost:5000/api/vendors/eatables/${currentUser._id}`,
    //   headers: {
    //     'Authorization':token
    //   }, 
    //   data: {
    //     eatableItem,
    //     eatableDescription,
    //     eatablePrice,
    //     eatableQuantity,
    //     eatablePic
    //   }
    // })
    if(eatableItem==undefined||eatableItem==null||eatableItem.trim()==""){
      toast("Invalid Item name")
    }else if(eatableDescription==undefined||eatableDescription==null||eatableDescription.trim()==""){
      toast("Invalid Item description")
    }else if(eatableQuantity==undefined||eatableQuantity==null||eatableQuantity.trim()==""){
      toast("Invalid Item Quantity") 
    }else if(eatablePrice==undefined||eatablePrice==null||isNaN(eatablePrice)||eatablePrice.trim()==""){
      toast("Invalid Item Price")
    }else if(eatablePic==undefined||eatablePic==null||eatablePic.trim()==""){
      toast("Invalid Item pic") 
    }else{
    const res= await vendorAxios.patch(`/eatables/${currentUser._id}`,{
      eatableItem,
          eatableDescription,
          eatablePrice,
          eatableQuantity,
          eatablePic
      })
    .then((response) => {
    dispatch(setCurrentUser(response.data))
   toast("item updated")
    // console.log(response.data);
  }).catch((err)=>{
    console.log(err);
  });
  setEatableItem("")
  setEatableDescription("")
  setEatableQuantity("")
  setEatablePrrice("")
  setEatableImage("")
  setEatablePic("")
  //  dispatch(getSlots())
}
  }
//
const options = [
  { value: 0, label: '00' },
  { value: 1, label: '01' },
  { value: 2, label: '02' },
  { value: 3, label: '03' },
  { value: 4, label: '04' },
  { value: 5, label: '05' },
  { value: 6, label: '06' },
  { value: 7, label: '07' },
  { value: 8, label: '08' },
  { value: 9, label: '09' },
  { value: 10, label: '10' },
  { value: 11, label: '11' },
  { value: 12, label: '12' },
  { value: 13, label: '13' },
  { value: 14, label: '14' },
  { value: 15, label: '15' },
  { value: 16, label: '16' },
  { value: 17, label: '17' },
  { value: 18, label: '18' },
  { value: 19, label: '19' },
  { value: 20, label: '20' },
  { value: 21, label: '21' },
  { value: 22, label: '22' },
  { value: 23, label: '23' },
  
];
const slotSubmit = async (e) => {
 e.preventDefault()
  // console.log(slots);
  // axios({
  //   method: 'post',
  //   url: `http://localhost:5000/api/vendors/testing/${currentUser._id}`,
  //   headers: {}, 
  //   data: {
  //     selectedOption
  //   }
  // })
  const res= await vendorAxios.post(`/testing/${currentUser._id}`,{
    selectedOption
    })
.then((response) => {
  // dispatch(setCurrentUser(res.data))
  console.log(response);
}).catch((err)=>{
  console.log(err);
});
dispatch(getBasic())
alert("timeslots updated")
 console.log(selectedOption);
}


// useEffect(() => {
//   let len=Object.keys(currentUser).length
//   console.log("userPresent");
//   console.log(len);
//   if (len>0) {
//     setUserPresent(true)
//   }
// })
const removeEatings = async (facId,vendId) =>{
  console.log("removeFacility");
  console.log(facId);
  console.log(vendId);
  const body={facId,vendId}
  // axiosIn.delete("/vendors/deleteEatings",{data:body})
  const res= await vendorAxios.delete(`/deleteEatings`,{
    data:body
    })
  .then((resp)=>{
    console.log("remove facility resp");
    console.log(resp);
    dispatch(setCurrentUser(resp.data))
    toast("Item removed")
  }).catch((err)=>{
    console.log("remove facility error");
    toast("Something went wrong")
    console.log(err);
  })
}
const removeFacility = async (facId,vendId) =>{
  console.log("removeFacility");
  console.log(facId);
  console.log(vendId);
  const body={facId,vendId}
  // axiosIn.delete("/vendors/deleteFacility",{data:body})
  const res= await vendorAxios.delete(`/deleteFacility`,{
    data:body
    })
  .then((resp)=>{
    console.log("remove facility resp");
    console.log(resp);
    dispatch(setCurrentUser(resp.data))
    toast("Item Removed")
  }).catch((err)=>{
    console.log("remove facility error");
    toast("Something went wrong")
    console.log(err);
  })
}
const [validTimes, setValidTimes] = useState([])
useEffect(() => {

const currDate=new Date()
const targDate=new Date(currentUser.subscription)
// console.log("date clash");
// console.log(currDate-targDate);
if(currDate-targDate>0){
  setAccess(false)
}else{
  setAccess(true)
}
const tS = (currentUser.timeSlots || []).map((i) => String(i)).join(" ");
setValidTimes([...tS])

}, [currentUser])
useEffect(() => {
  if(currentUser?.isAccess=="Allowed"){
    // setAccess(false)
  }else{
    // setAccess(true)
    toast("Get Subscription for Listing your Theatre")
  }
}, [])

const makePayment = async () =>{
  if(subAmt>0){
  const stripe = await loadStripe("pk_test_51OFALpSB9eYCrjcGKKeB3KGWjH3gP5Xs0lySh53YSxYjO3DFGqEGiaUSY5qSUDoq2Va9ld2D8mTkevKj99BfQ6cj00WPXqbZ9r");
  const body = {
    subAmt,currentUser
  }
  console.log("body");
  console.log(body);
  const headers = {
    "Content-Type":"application/json"
  }
  // const response = await fetch("http://localhost:5000/api/vendors/subscribe",{
  //   method:"POST",
  //   headers:headers,
  //   body:JSON.stringify(body)
  // })
  // const session = await response.json()
  const res= await vendorAxios.post(`/subscribe`,{
    data:body
    })
  .then((resp)=>{
    const session=resp.data
    const result = stripe.redirectToCheckout({
      sessionId:session.id
    })
    console.log(session);
    dispatch(setCurrentUser(session.updatedUser))
    // dispatch(setCurrentData(session))
    if(result.error){
      console.log(result.error);
    }
  }).catch((err)=>{
 
    toast("Something went wrong")
    console.log(err);
  })
 
}else{
  toast("Atleast one month is mandatory")
}
}

const checkUser = async () =>{
  // console.log("cuuurrr");
  // console.log(currentUser?._id);
  // axiosIn.get(`/vendors/getDetails/${currentUser?._id}`)
  const res= await vendorAxios.get(`/getDetails/${currentUser?._id}`)
  .then((response) => {
         
    dispatch(setCurrentUser(response.data))   
// console.log("checkUser test");
// console.log(response);
   
  
}).catch((error)=>{
 
 console.log("error in signup");
 const err=error.response.data.msg;
 toast(err)
})

}


useEffect(() => {
  checkUser()
},[changed])
  return (   
      <div className='updateMain'>
         <ToastContainer />
         <div style={{marginTop:"-50px",display:"flex",justifyContent:"end",paddingRight:"10%"}}>
           <span style={{color:"white",backgroundColor:"grey",padding:"1rem",borderRadius:".5rem",cursor:"pointer"}} onClick={()=>setPrevBooking(true)}>Bookings</span>
         </div>
         {prevBooking?(<div style={{height:"75vh",marginBottom:"1rem"}} >
         <ContentWrapper>
         <div style={{display:"flex",justifyContent:"end"}}>
                  <span style={{padding:"1rem",backgroundColor:"white",borderRadius:".75REM",cursor:"pointer"}} onClick={()=>setPrevBooking(false)}>close</span>
                </div>
          <div className='prevContainer'>
            <div className='prevHeadings' style={{paddingBottom:".75rem",paddingTop:".75rem",justifyContent:"CENTER"}}>
                <div className='prevHead'>Date</div>
                <div className='prevHead'>Username</div>
                <div className='prevHead'>Booking Slots</div>
                <div className='prevHead'>Bill</div>
                <div className='prevHead'>Booking Id</div>
                <div className='prevHead'>Status</div>
                {/* <div className='prevHead'>hjj</div> */}
                
            </div>
            {currentUser?.bookings?.length==0?(<div style={{color:"white",height:"800px",fontWeight:"600",display:"flex",alignItems:"center",justifyContent:"center"}}>No bookings to display</div>):("")}
            {
                    // currentUser?.bookings.map((book,index)=>{
                    currentUser?.bookings?.map((book,index)=>{
                      const times=book.slots.map((t)=>t+" AM ,")
                      // const day=new Date()
                      // const date=new Date(book.date)
                      // var canc=false
                      // if(day-date<0){
                      //     canc=true
                      // }
                     
                     const id= book.bookingId
                     const bill=book.bill
                     const theatreId=book.theatreId
                     const slots=book.slots
                     const bookingDate=book.date
                    //  console.log("viewerdata");
                    //  console.log(id);
                    //  console.log(bill);
                        return(<div>

                            <div className='prevBody' key={index}>
                            <div className='prevValue'>{book.date}</div>
                            <div className='prevValue'>{book.username}</div>
                            <div className='prevValue'>{times}</div>
                            <div className='prevValue'>{book.bill}</div>
                            <div className='prevValue'>{book.bookingId}</div>
                            <div className='prevValue'>{book.status}</div>
                            {/* <div className='prevValue' >status</div> */}
                            {/* <div className='prevValue' >cg v</div> */}
                            {/* <div className='prevValue' >{canc?"Cancel":"No refund"}</div> */}
                           
                            {/* <div className='prevValue'>hjj</div> */}
                            </div>
                            <div style={{display:"flex"}}>{book?.bookedEatings?.map((eat,index)=>{
                              return(
                                <div style={{display:"flex",gap:"1rem"}} key={index}>

                                  <div style={{color:"white"}}>Item :{eat.item}</div>
                                  <div style={{color:"white"}}>Qnty :{eat.quantity}</div>
                                  <div style={{color:"white"}}>Price :{eat.price}</div>
                                </div>
                              )
                            })}</div>
                        </div>
                        )
                    })
                }
               
               

        

          </div>

        

        
          </ContentWrapper>
         </div>):("")}
      <h1 className='h1'>Profile</h1>
        <div className='topSection'>
          <div className={basic?'topButtonsNew':'topButtons'} onClick={()=>dispatch(getBasic())}>Basic Details</div>
          <div className={facility?'topButtonsNew':'topButtons'} onClick={()=>dispatch(getFacilities())}>Facilities</div>
          <div className={slots?'topButtonsNew':'topButtons'} onClick={()=>dispatch(getSlots())}>Timings</div>
          <div className={chats?'topButtonsNew':'topButtons'} onClick={()=>dispatch(getChats())}>Chats</div>
        </div>
        {!access && <div style={{width:"100%", height:"25vh",backgroundColor:"darkgoldenrod",display:"flex",gap:"2rem",justifyContent:"center",alignItems:"center"}}>
       <span >.Your subscription is over. Get Subscription for Listing your Theatre</span>
       <div>
        <form >
          
          <input type="number" min={1}  style={{height:"2rem"}} id='monthInput' placeholder='No of Months' onChange={(e)=>setSubAmt(e.target.value*50)}/>

          <button type='button' style={{width:"7rem",margin:".75rem",height:"2rem"}}>{subAmt}.00Rs </button>
          <button type='button' style={{width:"7rem",margin:".75rem",height:"2rem"}} onClick={makePayment}>Pay </button>
        </form>
       </div>
        </div>

        }
      
      {basic && <div className='mainSection'>
        <div className='left'>
          <input type='file' ref={dpRef} hidden accept='image/*' onChange={(e)=>setImage(e.target.files[0])}/>
          <input type='file' ref={thumbRef} hidden accept='image/*' onChange={(e)=>setThumb(e.target.files[0])}/>
        <img className='displayPicture' src={displayPicture==currentUser.displayPicture?currentUser.displayPicture:displayPicture} alt="Dp" onClick={()=> dpRef.current.click()}/>
        <p className='left-text'>Tap to change the display picture</p>
        <img className='thumbnail' src={thumbnailPic||currentUser.thumbnailPic} alt="thumbnail" onClick={()=> thumbRef.current.click()}/>
        <p className='left-text'>Tap to change the thumbnail picture</p>
        </div>
        <div className='right'>
        <form className='form' onSubmit={handleSubmitData} >
     
      <div className='layer'>
      <label htmlFor='email' className='labelInput'>Email</label>
      <input style={{backgroundColor:'transparent',color:"white",border:"none"}}
        defaultValue={currentUser.email}
        type='text'
        id='email'
        disabled
        className='formInput'
      />
      </div>
      
      <div className='layer'>
      <label htmlFor='subscription' className='labelInput'>Subscription Upto</label>
      <input  style={{backgroundColor:'transparent',color:"white",border:"none"}}
        defaultValue={currentUser.subscription}
        type='text'
        id='subscription'
        disabled
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='isAccess' className='labelInput'>isAccess</label>
      <input  style={{backgroundColor:'transparent',color:"white",border:"none"}}
        defaultValue={currentUser.isAccess}
        type='text'
        id='isAccess'
        disabled
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='username' className='labelInput'>Username</label>
      <input 
        defaultValue={currentUser.username}
        type='text'
        id='username'
        onChange={(e)=>{
          setUsername(e.target.value)
        }}      
        className='formInput' 
        required
      />
      </div>
      <div className='layer'>
      <label htmlFor='houseNo' className='labelInput'>House Number</label>
      <input
        onChange={(e)=>{setHouseNo(e.target.value)}}      
        defaultValue={currentUser.address.houseNo}
        type='text'
        id='houseNo'
        placeholder='House Number'
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='addresslineOne' className='labelInput'>AddressLine 1</label>
      <input onChange={(e)=>{setAddresslineOne(e.target.value)}}      
        defaultValue={currentUser.address.addresslineOne}
        type='text'
        id='addresslineOne'
        placeholder='AddressLine 1'
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='addresslineTwo' className='labelInput'>AddressLine 2</label>
      <input
        onChange={(e)=>{setAddresslineTwo(e.target.value)}}      
        defaultValue={currentUser.address.addresslineTwo}
        type='text'
        id='addresslineTwo'
        placeholder='AddressLine 2'
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='postOffice' className='labelInput'>Post Office</label>
      <input
        defaultValue={currentUser.address.postOffice}
        onChange={(e)=>{setPost(e.target.value)}}  
        type='text'
        id='postOffice'
        placeholder='Post Office'
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='district' className='labelInput'>District</label>
      <input
        defaultValue={currentUser.address.district}
        onChange={(e)=>{setDistrict(e.target.value)}}      
        type='text'
        id='district'
        placeholder='District'
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='state' className='labelInput'>State</label>
      <input
        defaultValue={currentUser.address.state}
        onChange={(e)=>{setState(e.target.value)}}      
        type='text'
        id='state'
        placeholder='State'
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='seatingCapacity' className='labelInput'>Seating Capacity</label>
      <input
        defaultValue={currentUser.seatingCapacity}
        onChange={(e)=>{setSeating(e.target.value)}}      
        type='number'
        min={1}
        id='seatingCapacity'
        placeholder='Seating Capacity'
        className='formInput' 
        required
      />
      </div>
     
      <div className='layer'>
      <label htmlFor='price' className='labelInput'>Price</label>
      <input
        defaultValue={currentUser.price}
        onChange={(e)=>{setPrice(e.target.value)}}     
        min={1} 
        type='number'
        id='price'
        placeholder='Price'
        className='formInput' 
        required
      />
      </div>
      <div className='layer'>
      <label htmlFor='price' className='labelInput'>Overview</label>
      <input
        defaultValue={currentUser.address.remark}
        onChange={(e)=>{setRemark(e.target.value)}}      
        type='text'
        id='remark'
        placeholder='Overview'
        className='formInput' 
      />
      </div>
      <button type='submit' className='formButton' style={{cursor:"pointer",zIndex:"10"}} > Update</button>
      {/* {error && <p>"something went wrong</p>} */}
    </form>
        </div>



      </div>
      
     }

     {facility && <div className='mainSecond'>
      <div className='facility'>
        <h3 className='subHeader'>Facilities</h3>
        {/* <div className='facilityHeader'> */}
       
        {/* <div className='facilityHeading'>
        <p className='header'>Feature Image</p>
         </div>
        // <div className='facilityHeading'>
        //   <p className='header'>Feature Title</p>
        // </div>
        <div className='facilityHeading'>
        <p className='header'>Feature Description</p>
        </div> */}

       {/* </div> */}
        {/* <p className='header'>Feature Image</p> */}
        <div className='facilities'>
           {currentUser?.features?.map((e,index)=>{
           
       return (
       <div className='facilityList' key={index}>
        {/* <img src="" alt="" /> */}
        <div className='facilityTabs'>
          <img className='facilityImage' src={e.featureFile?e.featureFile:noImg} alt="img" />
        </div>
        <div className='facilityTabs'>
          <p>{e.featureName}</p>
        </div>
        <div className='facilityTabs'>
        <p>{e.featureDescription}</p>
        </div>
         <IoIosCloseCircleOutline style={{color:"white",fontSize:"40"}} onClick={()=>removeFacility(e._id,currentUser?._id)}/>
         {/* <IoIosCloseCircleOutline style={{color:"white",fontSize:"40"}} onClick={()=>removeEatings(e._id,currentUser?._id)}/> */}
       </div>
     )})}
        </div>
          <form className='facilityForm'>
            <div className='facility-upload-section'>
            <label htmlFor='facilityTitle' className='input-label'>Facility</label>
            <input type="text" id='facilityTitle' className='facilityInputTitle' value={featureName} onChange={(e)=>setFeatureName(e.target.value)}/>
            <label htmlFor='facilityTitle' className='input-label'>Description</label>
            <input type="text" id='facilityDescription' className='facilityInputDescription' value={featureDescription} onChange={(e)=>setFeatureDescription(e.target.value)}/>
            <input type='file' ref={facilityRef} hidden accept='image/*' onChange={(e)=>setFacilityImage(e.target.files[0])}/>
            
          <button type='button' className='facilityButton' onClick={()=> facilityRef.current.click()}>Add Photo</button>
            </div>
          {featurePic && <img className="addFacilityImage" src={featurePic?featurePic:""} alt="Dp"/>}
          <button type='button' onClick={addFacility} className='facilityButton' style={{backgroundColor:"orange",color:"black",height:"30px",width:"100px"}}>Add facility</button>
          </form>
      </div>
            
      <div className='facility'>
        <h3 className='subHeader'>Eatables</h3>
        {/* <div className='facilityHeader'> */}
       
        {/* <div className='facilityHeading'>
        <p className='header'>Feature Image</p>
         </div>
        // <div className='facilityHeading'>
        //   <p className='header'>Feature Title</p>
        // </div>
        <div className='facilityHeading'>
        <p className='header'>Feature Description</p>
        </div> */}

       {/* </div> */}
        {/* <p className='header'>Feature Image</p> */}
        <div className='facilities'>
           {currentUser?.eatables?.map((e,index)=>{
       return (
       <div className='facilityList' key={index}>
        {/* <img src="" alt="" /> */}
        <div className='facilityTabs'>
          <img className='facilityImage' src={e.image?e.image:noImg} alt="img" />
        </div>
        <div className='facilityTabs'>
          <p>{e.item}</p>
        </div>
        <div className='facilityTabs'>
        <p>{e.description}</p>
        </div>
        <div className='facilityTabs'>
        <p>{e.quantity}</p>
        </div>
        <div className='facilityTabs'>
        <p>{e.price}</p>
        </div>
        <IoIosCloseCircleOutline style={{color:"white",fontSize:"80"}} onClick={()=>removeEatings(e._id,currentUser?._id)}/>
       </div>
     )})}
        </div>
          <form  className='facilityForm'>
            <div className='facility-upload-section'>
            <label htmlFor='facilityTitle' className='input-label'>Item</label>
            <input type="text" id='facilityTitle' className='facilityInputTitle' value={eatableItem} onChange={(e)=>setEatableItem(e.target.value)}/>
            <label htmlFor='facilityTitle' className='input-label'>Description</label>
            <input type="text" id='facilityDescription' className='facilityInputDescription'  value={eatableDescription} onChange={(e)=>setEatableDescription(e.target.value)}/>
            <label htmlFor='facilityTitle' className='input-label'>Quantity</label>
            <input type="text" id='facilityDescription' className='facilityInputDescription'  value={eatableQuantity} onChange={(e)=>setEatableQuantity(e.target.value)}/>
            <label htmlFor='facilityTitle' className='input-label' >Price</label>
            <input type="text" id='facilityDescription' className='facilityInputDescription'  value={eatablePrice} onChange={(e)=>setEatablePrrice(e.target.value)}/>
            <input type='file' ref={EatableRef} hidden accept='image/*' onChange={(e)=>setEatableImage(e.target.files[0])}/>
            
          <button type='button' className='facilityButton' onClick={()=> EatableRef.current.click()}>Add Photo</button>
            </div>
          {eatablePic && <img className="addFacilityImage" src={eatablePic?eatablePic:""} alt="Dp"/>}
          <button type='button' onClick={addEatables} className='facilityButton' style={{backgroundColor:"orange",color:"black",height:"30px",width:"100px"}}>Add Eatables</button>
          </form>
      </div>
        
     </div>
     }
     {slots && <div className='mainThird'>
      <div style={{display:"flex",gap:"1rem",marginBottom:"2rem",padding:"1rem",borderRadius:"1rem"}}>

        <h2 style={{color:"white",marginRight:"1rem"}}>Current Slots   :</h2>
        <h2 style={{color:"white"}}>{validTimes}</h2>
      </div>
        <h3 className='subHeader'>Change Time Slots</h3>
        <div className='slots'>
         <form onSubmit={slotSubmit}>
         <Select
         className='Select'
         isMulti
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        
        options={options}
      />
          <button>Change</button>
         </form>
        </div>
      
      
     </div>
     }
     {/* {userPresent && 
     <div>
       
     </div>

     } */}

{chats && 
 <ContentWrapper>

  <Chat/>
 </ContentWrapper>


       }
       <div className="formOptions flex mt-5" style={{width:"100%",justifyContent:"end"}}>
        {/* <span className='text-red-700 cursor-pointer formOptionTitle'>Delete Account</span> */}
        <span className='text-red-700 cursor-pointer formOptionTitle' style={{cursor:"pointer"}} onClick={handleSignOut}>Sign out</span>
      </div>
     
    </div>
    
  );
}