import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { setCurrentUser, signout } from "../../store/homeSlice.js";
import { getPrevious,getBasic,getChats } from "../../store/userSlice.js";
import { useNavigate } from "react-router-dom";


import ContentWrapper from '../../components/contentWrapper/ContentWrapper.jsx';
import './style.scss'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import  {app}  from '../../firebase.js';
import { useLocation } from 'react-router-dom';

import { useFetchGet } from '../../hooks/useFetch.jsx';
import Chat from '../../components/chat/Chat.jsx';
import axios from 'axios'

export default function UserProfile() {
    const location=useLocation()
    
    const [query, setQuery] = useState(null)
    const { currentUser } = useSelector((state) => state.home);
    const [formData, setFormData] = useState({})
    const [error,setError]=useState(false)
    const [username,setUsername ]=useState(currentUser.username)
    const [displayPicture, setDisplayPicture]=useState(currentUser.displayPicture)
    const [thumbPercentage,setThumbPercentage]=useState(0)
    const [locality,setLocality ]=useState(currentUser.address.locality)
    const [district,setDistrict ]=useState(currentUser.address.district)
    const [state,setState ]=useState(currentUser.address.state)
    const [remark,setRemark ]=useState(currentUser.address.remark)

    const [price,setPrice ]=useState(currentUser.price)
    const [thumb,setThumb ]=useState(null)
    const [thumbImageError,setThumbImageError ]=useState(false)
    const [thumbnailPic,setThumbnailPic ]=useState("")
    const [image,setImage]=useState(undefined)
    const dpRef=useRef(null)

    const dispatch=useDispatch()
    const { previousBookings,basic,chats } = useSelector((state) => state.user);

    const navigate=useNavigate()
    
    useEffect(() => {
        if (image) {
          handleFileUploadThumb(image)
        }
    }, [image])
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
        // // })
        // console.log("formData");
        // console.log(formData);
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
            url: `http://localhost:5000/api/users/update/${currentUser._id}`,
            headers: {
            //   'Authorization':token
            }, 
            credentials: 'include',
            data: {
              username:username,
            
              thumbnailPic,
            
             
             locality,
              district:district,
              state:state
            }
          })
        .then((response) => {
          console.log(response);
          setError(false)
        }).catch((err)=>{
          console.log(err);
        });
         
      
          
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
      const callUserData=async()=>{
        try {
          const res= await fetch(`http://localhost:5000/api/users/${currentUser._id}`,{
            method: 'GET',
            headers:{
              'Content-Type': 'application/json',
            },
         
           
          })
              let allData=await res.json();
              // dispatch(setCurrentData(data))
              console.log("allDarta");
              console.log(allData);
          } catch (error) {
          
          console.log("Catch vendorlogin error");
          console.log(error);
            
          }
      }
      
     

      // useEffect(() => {
      //   callUserData()
      // }, [previousBookings])
      return (   
        <div className='updateMain'>
        <h1 className='h1'>Profile</h1>
          <div className='topSection'>
            <div className='topButtons' onClick={()=>dispatch(getBasic())}>Basic Details</div>
            <div className='topButtons' onClick={()=>dispatch(getPrevious())}>Previous Bookings</div>
            <div className='topButtons' onClick={()=>dispatch(getChats())}>Chats</div>
            
          </div>
        
        {basic && <div className='mainSection'>
          <div className='left'>
            <input type='file' ref={dpRef} hidden accept='image/*' onChange={(e)=>setImage(e.target.files[0])}/>
          <img className='displayPicture' src={!thumbnailPic?currentUser.displayPicture:thumbnailPic==currentUser.displayPicture?currentUser.displayPicture:thumbnailPic} alt="Dp" onClick={()=> dpRef.current.click()}/>
          <p className='left-text'>Tap to change the display picture</p>
        
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
        <label htmlFor='balance' className='labelInput'>Account Balance</label>
        <input
          defaultValue={currentUser.account_Bal}
          type='text'
          id='balance'
          
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
        <label htmlFor='locality' className='labelInput'>Locality</label>
        <input
          defaultValue={currentUser.address.locality}
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
        
       
        
        <button className='formButton'>UPDATE</button>
        {error && <p>"something went wrong</p>}
      </form>
          </div>
  
  
  
        </div>
        
       }
      
      {previousBookings && <div className='mainSection'>
          <ContentWrapper>
          <div className='prevContainer'>
            <div className='prevHeadings'>
                <div className='prevHead'>Date</div>
                <div className='prevHead'>Theatre name</div>
                <div className='prevHead'>Booking Slots</div>
                <div className='prevHead'>Bill</div>
                <div className='prevHead'>Booking Id</div>
                <div className='prevHead'>Cancel</div>
                {/* <div className='prevHead'>hjj</div> */}
                
            </div>
            
                {
                    currentUser?.bookings.map((book,index)=>{
                      const times=book.slots.map((t)=>t+" AM ,")
                      const day=new Date()
                      const date=new Date(book.date)
                      var canc=false
                      if(day-date<0){
                          canc=true
                      }
                     
                      const cancelShow=async(can,id,bill,theatreId,bookingDate,slots)=>{
                        // console.log("id");
                        // console.log(id);
                        if(can){
                         await axios({
                            method: 'post',
                            url: `http://localhost:5000/api/users/cancel/${currentUser._id}`,
                            headers: {}, 
                            data: {
                              id,bill,theatreId,bookingDate,slots
                            }
                          })
                        .then((response) => {
                          dispatch(setCurrentUser(response.data))
                          console.log(response);
                        }).catch((err)=>{
                          console.log(err);
                        });
                        }
                       }
                     const id= book.bookingId
                     const bill=book.bill
                     const theatreId=book.theatreId
                     const slots=book.slots
                     const bookingDate=book.date
                    //  console.log("viewerdata");
                    //  console.log(id);
                    //  console.log(bill);
                        return(
                            <div className='prevBody' key={index}>
                            <div className='prevValue'>{book.date}</div>
                            <div className='prevValue'>{book.theatreName}</div>
                            <div className='prevValue'>{times}</div>
                            <div className='prevValue'>{book.bill}</div>
                            <div className='prevValue'>{book.bookingId}</div>
                            {/* <div className='prevValue' >status</div> */}
                            {/* <div className='prevValue' >cg v</div> */}
                            {/* <div className='prevValue' >{canc?"Cancel":"No refund"}</div> */}
                            <div style={{cursor:"pointer"}} className='prevValue' onClick={()=>{cancelShow(canc,id,bill,theatreId,bookingDate,slots)}}>{canc?"Cancel":"No refund"}</div>
                            {/* <div className='prevValue'>hjj</div> */}
                            </div>
                        )
                    })
                }
               

        

          </div>

          {/* <div className="currentBooking">
            <h3>Previous Bookings</h3>
            {currentUser?.bookings?.map((book,index)=>{
              return(
                <div className="books" key={index}>
                      <p className="bookName">Theatre Name  :{book?.theatreName}</p>
                      <p className="bookSlot">Time Slots  :{book?.slots}</p>
                    </div>
                        )
                      })}
          </div> */}
          </ContentWrapper>
          </div>
       }
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
    
  )
}  