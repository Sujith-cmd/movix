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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetchGet } from '../../hooks/useFetch.jsx';
import Chat from '../../components/chat/Chat.jsx';
import axios from 'axios'
import { userAxiosIntercepter } from '../../hooks/userAxios.jsx';

export default function UserProfile() {
    const location=useLocation()
    
    const [query, setQuery] = useState(null)
    const { currentUser } = useSelector((state) => state.home);
    const [formData, setFormData] = useState({})
    const [error,setError]=useState(false)
    const [username,setUsername ]=useState(currentUser.username||"")
    const [displayPicture, setDisplayPicture]=useState(currentUser.displayPicture)
    const [thumbPercentage,setThumbPercentage]=useState(0)
    const [locality,setLocality ]=useState(currentUser.address.locality||"")
    const [district,setDistrict ]=useState(currentUser.address.district||"")
    const [state,setState ]=useState(currentUser.address.state||"")
    const [remark,setRemark ]=useState(currentUser.address.remark||"")
    const userAxios=userAxiosIntercepter()

    const [price,setPrice ]=useState(currentUser.price)
    const [thumb,setThumb ]=useState(null)
    const [thumbImageError,setThumbImageError ]=useState(false)
    const [thumbnailPic,setThumbnailPic ]=useState("")
    const [image,setImage]=useState(undefined)
    const [pgN,setPgN]=useState(0)
    const [pageData,setPageData]=useState(1)
    const [sortAmount,setSortAmount]=useState(false)
    const [sortDate,setSortDate]=useState(false)
    const [sortDefault,setSortDefault]=useState(true)
    const [bookingData,setBookingData]=useState([])
   
    const [currentPageData,setCurrentPageData]=useState([])
    const dpRef=useRef(null)
    
    const dispatch=useDispatch()
    const { previousBookings,basic,chats } = useSelector((state) => state.user);

    const navigate=useNavigate()
    
    useEffect(() => {
        if (image) {
          console.log("image");
          console.log(image);
          if(image?.name?.endsWith(".jpg")||image?.name?.endsWith(".jpeg")||image?.name?.endsWith(".png")){

            handleFileUploadThumb(image)
          }else{
            toast("invalid image format")
          }
        }
    }, [image])
   
    const changeSortDefault = async () => {
      setSortDate(false)
      setSortAmount(false)
      setSortDefault(true)
      const deepCopy = JSON.parse(JSON.stringify(currentUser?.bookings));
      // const sortByDate=deepCopy.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
      // console.log("dateSort");
      // console.log(sortByDate);
      setCurrentPageData(deepCopy)
      // setBookingData(sortByDate)
    }
    const changeSortDate = async () => {
      setSortDate(true)
      setSortAmount(false)
      setSortDefault(false)
      const deepCopy = JSON.parse(JSON.stringify(currentUser?.bookings));
      const sortByDate=deepCopy.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
      // console.log("dateSort");
      // console.log(sortByDate);
      setCurrentPageData(sortByDate)
      // setBookingData(sortByDate)
    }
    const changeSortAmount = async () => {
      setSortAmount(true)
      setSortDate(false)
      setSortDefault(false)
      const deepCopy = JSON.parse(JSON.stringify(currentUser?.bookings));

      const sortByAmount=deepCopy.sort((a, b) => a.bill - b.bill)
      // console.log("AmountSort");
      // console.log(sortByAmount);
      // setBookingData(sortByAmount)
      setCurrentPageData(sortByAmount)
    }
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
        if(username.length>0&&username.trim()==""){
         toast("Enter valid credentials")
        }else if(locality.length>0&&locality.trim()==0){
          toast("Enter valid locality")
        }else if(district.length>0&&district.trim()==0){
          toast("Enter valid district")
        }else if(state.length>0&&state.trim()==0){
          toast("Enter valid state")
        }
        else{
           
        try {
            const userN=username.trim()
            const userLocality=locality?.trim()
            const userDistrict=district?.trim()
            const userState=state?.trim()
            if(currentUser?.username==userN&&thumbnailPic==""&&currentUser?.address?.locality==userLocality&&currentUser?.address?.district==userDistrict&&currentUser?.address?.state==userState){
              return toast("Nothing to update")
            }
          const res= await userAxios.post(`/update/${currentUser._id}`,{
            username:userN,
            
              thumbnailPic,
            
             
             locality:userLocality,
              district:userDistrict,
              state:userState
            }).then((response) => {
              console.log(response);
              dispatch(setCurrentUser(response.data))
              toast("user updated")
              setThumbnailPic("")
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
      }
      
      const handleSignOut = async () => {
        try {
        
            const result = confirm('Do you want to signout?');
            if (result) {
          const res= await fetch('http://localhost:5000/api/vendors/signout')
                let data=await res.json();
                console.log(data);
           dispatch(signout())
           navigate('/')
            }else{

            }
      } catch (error) {
        console.log(error);
      }
      }
      // const callUserData=async()=>{
      //   try {
      //     const res= await fetch(`http://localhost:5000/api/users/${currentUser._id}`,{
      //       method: 'GET',
      //       headers:{
      //         'Content-Type': 'application/json',
      //       },
         
           
      //     })
      //         let allData=await res.json();
      //         // dispatch(setCurrentData(data))
      //         console.log("allDarta");
      //         console.log(allData);
      //     } catch (error) {
          
      //     console.log("Catch vendorlogin error");
      //     console.log(error);
            
      //     }
      // }
      useEffect(() => {
      const length=currentUser?.bookings?.length
      console.log("booking length");
      const pgLen=Math.ceil(length/10);
      setPgN(pgLen)
      // if(currentUser?.bookings!==null||currentUser?.bookings!==undefined){
       
      // }
       
      }, [currentUser])
       const [pageNationArray, setPageNationArray] = useState([])
      const pageNationArrayMaking=async()=>{
        let arr=[]
        for (let index = 1; index <= pgN; index++) {
          arr.push(index)
          
        }
        setPageNationArray(arr)
      }
      useEffect(() => {
        pageNationArrayMaking()
      }, [pgN])
      useEffect(() => {
         console.log("pageNarray");
         console.log(pageNationArray);
      }, [pageNationArray])

      const setCurrInfo=async()=>{
        let currPageData=[]
        const next=pageData+1
        const first=pageData*10-10
        const second=pageData*10
        const status=pageNationArray.includes(next)
      //  console.log("first and second");
      //  console.log(first);
      //  console.log(second);
        if(status){
        if(currentUser?.bookings!==null||currentUser?.bookings!==undefined){
          setBookingData(currentUser?.bookings)
          // currPageData=bookingData.slice(first,second)
          currPageData=currentUser?.bookings.slice(first,second)
          setCurrentPageData(currPageData)
        }
        }else{
          if(currentUser?.bookings!==null||currentUser?.bookings!==undefined){
            setBookingData(currentUser?.bookings)
            // currPageData=bookingData.slice(first)
            currPageData=currentUser?.bookings.slice(first)
            setCurrentPageData(currPageData)
          }
        }
      }
      useEffect(() => {
        setCurrInfo()
       
      }, [pageData,currentUser])
      // useEffect(() => {
      //   // console.log("currrPageDatttttaa");
      //   // console.log(currentPageData);
      //   // if(currentUser?.bookings){
      //   //   setCurrentPageData(currentUser.bookings)
      //   //   console.log("pagrdatatatta");
      //   //   console.log(currentPageData);
      //   // }
      // }, [currentPageData])
      useEffect(() => {
        
        if(sortDate){
          const deepCopy = JSON.parse(JSON.stringify(currentUser?.bookings));
          const sortByDate=deepCopy.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
          // console.log("dateSort");
          // console.log(sortByDate);
          // setBookingData(sortByDate)
          setCurrentPageData(sortByDate)
        }
      }, [sortDate])
      return (   
        <div className='updateMain'>
        <h1 className='h1'>Profile</h1>
          <div className='topSection'>
            <div className={basic?'topButtonsNew':'topButtons'} onClick={()=>dispatch(getBasic())}>Basic Details</div>
            <div className={previousBookings?'topButtonsNew':'topButtons'} onClick={()=>dispatch(getPrevious())}>Previous Bookings</div>
            <div className={chats?'topButtonsNew':'topButtons'} onClick={()=>dispatch(getChats())}>Chats</div>
            
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
        <label htmlFor='balance' className='labelInput'>Account Balance</label>
        <input style={{backgroundColor:'transparent',color:"white",border:"none"}}
          defaultValue={currentUser.account_Bal} 
          type='text'
          id='balance'
          disabled
          className='formInput' 
        />
        </div>
        <div className='layer'>
        <label htmlFor='isAccess' className='labelInput'>isAccess</label>
        <input style={{backgroundColor:'transparent',color:"white",border:"none"}}
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
        <ToastContainer/>
      </form>
          </div>
  
  
  
        </div>
        
       }
      
      {previousBookings && <div className='mainSection'>
          <ContentWrapper>
            <div style={{width:"100%",height:"30px",marginBottom:"10px",display:"flex",justifyContent:"end",marginRight:"2rem"}}>
              <div style={{color:"white",alignSelf:"center"}}>sort by</div>
              <div style={{borderRadius:".5REM",backgroundColor:sortDefault?"orange":"white",marginLeft:"1rem",marginRight:"1rem",paddingLeft:".5rem",paddingRight:".5rem",display:"flex",alignItems:"center",fontWeight:"600"}} onClick={changeSortDefault}>Default</div>
              <div style={{borderRadius:".5REM",backgroundColor:sortDate?"orange":"white",marginLeft:"1rem",marginRight:"1rem",paddingLeft:".5rem",paddingRight:".5rem",display:"flex",alignItems:"center",fontWeight:"600"}} onClick={changeSortDate}>date</div>
              <div style={{borderRadius:".5REM",backgroundColor:sortAmount?"orange":"white",marginLeft:"1rem",marginRight:"1rem",paddingLeft:".5rem",paddingRight:".5rem",display:"flex",alignItems:"center",fontWeight:"600"}} onClick={changeSortAmount}>amount</div>
              
            </div>
          <div className='prevContainer'>
            <div className='prevHeadings' style={{paddingBottom:".75rem",paddingTop:".75rem",justifyContent:"CENTER"}}>
                <div className='prevHead'>Date</div>
                <div className='prevHead'>Theatre name</div>
                <div className='prevHead'>Booking Slots</div>
                <div className='prevHead'>Bill</div>
                <div className='prevHead'>Booking Id</div>
                <div className='prevHead'>Cancel</div>
                {/* <div className='prevHead'>hjj</div> */}
                
            </div>
            {currentUser?.bookings?.length==0?(<div style={{color:"white",height:"800px",fontWeight:"600",display:"flex",alignItems:"center",justifyContent:"center"}}>No bookings to display</div>):("")}

                {
                    // currentUser?.bookings.map((book,index)=>{
                    currentPageData.map((book,index)=>{
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
                        //  await axios({
                        //     method: 'post',
                        //     url: `http://localhost:5000/api/users/cancel/${currentUser._id}`,
                        //     headers: {}, 
                        //     data: {
                        //       id,bill,theatreId,bookingDate,slots
                        //     }
                        //   })
                        await userAxios.post(`/cancel/${currentUser._id}`,{
                          id,bill,theatreId,bookingDate,slots
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
                        return(<div>

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

        

          <div style={{marginTop:"20px",display:"flex",justifyContent:"center",gap:"10px",overflow:"scroll"}}>

{pageNationArray.map((book,index)=>{
  console.log("bookkk");
  console.log(book);
  return(
    <div style={{height:"30px",width:"30px",backgroundColor:"orange",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"600",cursor:"pointer"}} key={index} onClick={()=>setPageData(book)}>
     {/* <div style={{height:"20px",width:"20px",backgroundColor:"yellow",textAlign:"center"}} key={index}>   */}
         {book}
        </div>
            )
          })}

     </div>
          </ContentWrapper>
          </div>
       }
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
    
  )
}  