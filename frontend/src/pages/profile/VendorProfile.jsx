import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { setCurrentUser, signout } from "../../store/homeSlice.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ContentWrapper from '../../components/contentWrapper/ContentWrapper.jsx';
import './style.scss'
import { fetchDataFromApi, fetchDataFromBackGet } from '../../utils/api.js';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import  {app}  from '../../firebase.js';
import { getBasic, getFacilities, getSlots, getChats } from '../../store/vendorSlice.js';
import noImg from "../../assets/no-facility.png"
import Select from 'react-select';
import Chat from '../../components/chat/Chat.jsx';
import {loadStripe} from '@stripe/stripe-js';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.home);
  
  const [formData, setFormData] = useState({})
  const [error,setError]=useState(false)
  const [username,setUsername ]=useState(currentUser.username)
  const [thumbnailPic, setThumbnailPic]=useState(currentUser.thumbnailPic)
  const [displayPicture, setDisplayPicture]=useState(currentUser.displayPicture)
  const [houseNo,setHouseNo ]=useState(currentUser.address.houseNo)
  const [addresslineOne,setAddresslineOne ]=useState(currentUser.address.addresslineOne)
  const [addresslineTwo,setAddresslineTwo ]=useState(currentUser.address.addresslineTwo)
  const [post,setPost ]=useState(currentUser.address.postOffice)
  const [district,setDistrict ]=useState(currentUser.address.district)
  const [state,setState ]=useState(currentUser.address.state)
  const [remark,setRemark ]=useState(currentUser.address.remark)
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

  const dispatch=useDispatch()
  const { basic,facility,slots,chats } = useSelector((state) => state.vendor);
  const { token } = useSelector((state) => state.home);
  const navigate=useNavigate()


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


  useEffect(() => {
      if (image) {
        handleFileUpload(image)
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
    if (thumb) {
      handleFileUploadThumb(thumb)
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
  if (facilityImage) {
    handleFileUploadFacility(facilityImage)
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
  if (eatableImage) {
    handleFileUploadEatable(eatableImage)
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
  const handleSubmit = async(e)=>{
    e.preventDefault()
    // console.log(usernameRef.current.value);
    // console.log(houseNoRef.current.value);
    // console.log(addressOneRef.current.value);
    // console.log(addressTwoRef.current.value);
    // console.log(districtRef.current.value);
      // setError(true)

    // setFormData({
      // username:username,
      
      //   houseNo:houseNo,
      //   addresslineOne:addresslineOne,
      //   addresslineTwo:addresslineTwo,
      //   postOffice:post,
      //   district:district,
      //   state:state,
      // seatingCapacity:Number(seating),
      
      // price:Number(price)
    // })
    console.log("formData");
    console.log(formData);
    try {
      // const res= await fetch(`http://localhost:5000/api/vendors/update/${currentUser._id}`,{
      //   method: 'PATCH',
      //   headers:{
      //     'Content-Type': 'application/json',
          
      //   },
      //   body:JSON.stringify(formData)
      // })
      //     let data=await res.json();
      // fetchDataFromApi(`http://localhost:5000/api/vendors/update/${currentUser._id}`)
      console.log("axios");
      axios({
        method: 'post',
        url: `http://localhost:5000/api/vendors/update/${currentUser._id}`,
        headers: {
          'Authorization':token
        }, 
        credentials: 'include',
        data: {
          username:username,
          displayPicture,
          thumbnailPic,
          houseNo:houseNo,
          addresslineOne:addresslineOne,
          addresslineTwo:addresslineTwo,
          postOffice:post,
          district:district,
          state:state,
          remark:remark,
        seatingCapacity:Number(seating),
          
        pricePerHour:Number(price)
        }
      })
    .then((response) => {
      console.log(response);
    }).catch((err)=>{
      console.log(err);
    });
     
    dispatch(getFacilities())
      
    } catch (error) {
      console.log(error);
      setError(true)
      return
    }
  }
  
  const handleSignOut = async () => {
    try {
      const res= await fetch('http://localhost:5000/api/vendors/signout')
            let data=await res.json();
            console.log(data);
       dispatch(signout())
       navigate('/')
  } catch (error) {
    console.log(error);
  }
  }
  
  const addFacility = async () => {
    // e.preventDefault()
    axios({
      method: 'patch',
      url: `http://localhost:5000/api/vendors/facilities/${currentUser._id}`,
      headers: {
        'Authorization':token
      }, 
      data: {
        featureName,
        featureDescription,
        featurePic
      }
    })
  .then((response) => {
    // dispatch(setCurrentUser(response))
    // setConsole(response)
    console.log(response);
  }).catch((err)=>{
    console.log(err);
  });
   
  }
  const addEatables = async () => {
    axios({
      method: 'patch',
      url: `http://localhost:5000/api/vendors/eatables/${currentUser._id}`,
      headers: {
        'Authorization':token
      }, 
      data: {
        eatableItem,
        eatableDescription,
        eatablePrice,
        eatableQuantity,
        eatablePic
      }
    })
  .then((response) => {
    // dispatch(setCurrentUser(res.data))
    // console.log(response.data);
  }).catch((err)=>{
    console.log(err);
  });
  //  dispatch(getSlots())
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
const slotSubmit = async () => {
 
  // console.log(slots);
  axios({
    method: 'post',
    url: `http://localhost:5000/api/vendors/testing/${currentUser._id}`,
    headers: {}, 
    data: {
      selectedOption
    }
  })
.then((response) => {
  // dispatch(setCurrentUser(res.data))
  console.log(response);
}).catch((err)=>{
  console.log(err);
});
dispatch(getBasic())
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
useEffect(() => {
if(currentUser?.isAccess=="Not allowed"){
  setAccess(false)
}else{
  setAccess(true)
}
}, [currentUser])

const makePayment = async () =>{
  const stripe = await loadStripe("pk_test_51OFALpSB9eYCrjcGKKeB3KGWjH3gP5Xs0lySh53YSxYjO3DFGqEGiaUSY5qSUDoq2Va9ld2D8mTkevKj99BfQ6cj00WPXqbZ9r");
  const body = {
    subAmt,currentUser
  }
  console.log("body");
  console.log(body);
  const headers = {
    "Content-Type":"application/json"
  }
  const response = await fetch("http://localhost:5000/api/vendors/subscribe",{
    method:"POST",
    headers:headers,
    body:JSON.stringify(body)
  })
  const session = await response.json()
  const result = stripe.redirectToCheckout({
    sessionId:session.id
  })
  console.log(session);
  dispatch(setCurrentUser(session.updatedUser))
  // dispatch(setCurrentData(session))
  if(result.error){
    console.log(result.error);
  }
  
}

const checkUser = async () =>{
  axios({
    method: 'GET',
    url: `http://localhost:5000/api/vendors/getDetails/${currentUser._id}`,
    headers: {}, 
    data: {
     
    }
  })
.then((response) => {
  dispatch(setCurrentUser(response.data))
  // console.log(response);
}).catch((err)=>{
  console.log(err);
});
}


useEffect(() => {
  checkUser()
})
  return (   
      <div className='updateMain'>
      <h1 className='h1'>Profile</h1>
        <div className='topSection'>
          <div className='topButtons' onClick={()=>dispatch(getBasic())}>Basic Details</div>
          <div className='topButtons' onClick={()=>dispatch(getFacilities())}>Facilities</div>
          <div className='topButtons' onClick={()=>dispatch(getSlots())}>Timings</div>
          <div className='topButtons' onClick={()=>dispatch(getChats())}>Chats</div>
        </div>
        {!access && <div style={{width:"100%", height:"25vh",backgroundColor:"blue",display:"flex",gap:"2rem",justifyContent:"center",alignItems:"center"}}>
       <span >Get Subscription for Listing your Theatre</span>
       <div>
        <form >
          
          <input type="number" min={1} style={{height:"2rem"}} id='monthInput' placeholder='No of Months' onChange={(e)=>setSubAmt(e.target.value*50)}/>

          <button type='button' style={{width:"7rem",margin:".75rem",height:"2rem"}}>{subAmt} </button>
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
        <form className='form' onSubmit={handleSubmit}>
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
      />
      </div>
      <div className='layer'>
      <label htmlFor='email' className='labelInput'>Email</label>
      <input
        defaultValue={currentUser.email}
        type='text'
        id='email'
        
        className='formInput'
      />
      </div>
      
      <div className='layer'>
      <label htmlFor='subscription' className='labelInput'>Subscription Date</label>
      <input
        defaultValue={currentUser.subscription}
        type='text'
        id='subscription'
        
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='isAccess' className='labelInput'>isAccess</label>
      <input
        defaultValue={currentUser.isAccess}
        type='text'
        id='isAccess'
        
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='houseNo' className='labelInput'>House Number</label>
      <input
        onChange={(e)=>{setHouseNo(e.target.value)}}      
        defaultValue={currentUser.address.houseNo}
        type='text'
        id='houseNo'
        placeholder='Username'
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='addresslineOne' className='labelInput'>AddressLine 1</label>
      <input onChange={(e)=>{setAddresslineOne(e.target.value)}}      
        defaultValue={currentUser.address.addresslineOne}
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
        defaultValue={currentUser.address.addresslineTwo}
        type='text'
        id='addresslineTwo'
        placeholder='Username'
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
        placeholder='Username'
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
        placeholder='Username'
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
        placeholder='Username'
        className='formInput' 
      />
      </div>
      <div className='layer'>
      <label htmlFor='seatingCapacity' className='labelInput'>Seating Capacity</label>
      <input
        defaultValue={currentUser.seatingCapacity}
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
        defaultValue={currentUser.price}
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
        defaultValue={currentUser.address.remark}
        onChange={(e)=>{setRemark(e.target.value)}}      
        type='text'
        id='remark'
        placeholder='Username'
        className='formInput' 
      />
      </div>
      <button className='formButton'>UPDATE</button>
      {error && <p>"something went wrong</p>}
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
           {currentUser.features.map((e,index)=>{
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

       </div>
     )})}
        </div>
          <form onSubmit={addFacility} className='facilityForm'>
            <div className='facility-upload-section'>
            <label htmlFor='facilityTitle' className='input-label'>Facility</label>
            <input type="text" id='facilityTitle' className='facilityInputTitle' onChange={(e)=>setFeatureName(e.target.value)}/>
            <label htmlFor='facilityTitle' className='input-label'>Description</label>
            <input type="text" id='facilityDescription' className='facilityInputDescription' onChange={(e)=>setFeatureDescription(e.target.value)}/>
            <input type='file' ref={facilityRef} hidden accept='image/*' onChange={(e)=>setFacilityImage(e.target.files[0])}/>
            
          <button type='button' className='facilityButton' onClick={()=> facilityRef.current.click()}>Add Photo</button>
            </div>
          {featurePic && <img className="addFacilityImage" src={featurePic?featurePic:""} alt="Dp"/>}
          <button type='submit' className='facilityButton'>Add facility</button>
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
           {currentUser.eatables.map((e,index)=>{
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

       </div>
     )})}
        </div>
          <form onSubmit={addEatables} className='facilityForm'>
            <div className='facility-upload-section'>
            <label htmlFor='facilityTitle' className='input-label'>Item</label>
            <input type="text" id='facilityTitle' className='facilityInputTitle' onChange={(e)=>setEatableItem(e.target.value)}/>
            <label htmlFor='facilityTitle' className='input-label'>Description</label>
            <input type="text" id='facilityDescription' className='facilityInputDescription' onChange={(e)=>setEatableDescription(e.target.value)}/>
            <label htmlFor='facilityTitle' className='input-label'>Quantity</label>
            <input type="text" id='facilityDescription' className='facilityInputDescription' onChange={(e)=>setEatableQuantity(e.target.value)}/>
            <label htmlFor='facilityTitle' className='input-label'>Price</label>
            <input type="text" id='facilityDescription' className='facilityInputDescription' onChange={(e)=>setEatablePrrice(e.target.value)}/>
            <input type='file' ref={EatableRef} hidden accept='image/*' onChange={(e)=>setEatableImage(e.target.files[0])}/>
            
          <button type='button' className='facilityButton' onClick={()=> EatableRef.current.click()}>Add Photo</button>
            </div>
          {eatablePic && <img className="addFacilityImage" src={eatablePic?eatablePic:""} alt="Dp"/>}
          <button type='submit' className='facilityButton'>Add facility</button>
          </form>
      </div>
        
     </div>
     }
     {slots && <div className='mainThird'>
      
        <h3 className='subHeader'>Time Slots</h3>
        <div className='slots'>
         <form onSubmit={slotSubmit}>
         <Select
         className='Select'
         isMulti
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        
        options={options}
      />
          <button>add</button>
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
      <div className="formOptions flex justify-between mt-5">
        <span className='text-red-700 cursor-pointer formOptionTitle'>Delete Account</span>
        <span className='text-red-700 cursor-pointer formOptionTitle' onClick={handleSignOut}>Sign out</span>
      </div>
     
    </div>
    
  );
}