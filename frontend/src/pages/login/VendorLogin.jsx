import React, { useRef, useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { setCurrentUser,loading,setToken,setVendorLogin } from '../../store/homeSlice.js'
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'
import "../SignUp/styles.scss"
import { axiosIn, fetchDataFromBackPost } from '../../utils/api.js'
import validator from 'validator'
import { otpHelp } from '../../store/userSlice.js'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const VendorSignin = () => {
  const usernameContent=useRef()
  const emailContent=useRef()
  const passwordContent=useRef()
  const isTheatreContent=useRef()
  const [formData, setFormData] = useState({})
  const { currentUser }=useSelector((state)=> state.home)
  const dispatch=useDispatch()
  const navigate=useNavigate()

  const [signIn, setSignIn] = useState(true)
  const [forgetPass, setForgetPass] = useState(false)
  const [mailSend, setMailSend] = useState(false)
  const [resetPass, setResetPass] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [userOTP, setUserOTP] = useState("")
  const [newPass, setNewPass] = useState("")
  const [newConPass, setNewConPass] = useState("")
  const [userOTPFail, setUserOTPFail] = useState(false)

  const { otp }=useSelector((state)=> state.user)
  const handleChange = (e) => {
    console.log(formData);
      setFormData({...formData,[e.target.name]:String(e.target.value)}) 
  }
  const forPass = (e) => {
    setSignIn(false)
    setForgetPass(true)
    setMailSend(false)
  }
  const signIN = (e) => {
    setSignIn(true)
    setForgetPass(false)
    setMailSend(false)
    setResetPass(false)
  }
  const receiveOTP = (e) => {
    if(otp==Number(userOTP)){
      
      // setForgetPass(false)
      setMailSend(false)
      setResetPass(true)
    }else{
      //  setUserOTPFail(true)
      toast("OTP not matching")
    }
  }
  const changePass = (e) => {
    if(newPass==undefined||newPass==null||newPass?.trim()==""){
      toast("enter a valid password")
    }
    else if(newPass==newConPass){

      axiosIn.post("/vendors/forgetPass",{newPass,userEmail}).then((response) => {
      
        console.log(response);
        navigate('/vendorSignIn')
        setSignIn(true)
        setForgetPass(false)
    setMailSend(false)
    setResetPass(false)
     }).catch((err)=>{
       console.log("utility errorrr");
       console.log(err);
      //  toast(err.response.data.msg)
     })
    }else{
      toast("password dont match")
    }
  }
  const mailCheck = (e) => {
    setSignIn(false)
    setForgetPass(true)
    setMailSend(true)
    axiosIn.post("/vendors/sendOTP",{userEmail}).then((response) => {
      console.log("utility route");
      console.log(response);
      toast("Please check your mail")
      dispatch(otpHelp(Number(response.data)))
     
   }).catch((err)=>{
     console.log("utility errorrr");
     console.log(err);
     toast(err.response.data.message)
     setSignIn(false)
     setForgetPass(true)
     setMailSend(false)
   })
  //  console.log(otp);
  }
  
  const handleSubmit = async (e) =>{
    e.preventDefault();
    if(formData.password==undefined||formData.email==undefined){
      toast("enter valid credentials")
    }else{
    // if(validator.isEmail(formData?.email?formData.email:"")){
    if(validator.isEmail(formData?.email?.trim())){
      const passMatch=formData.password?.trim()
      if(passMatch!==""&&passMatch!==undefined){
    try {
      axiosIn.post("/vendors/signin",formData).then((response) => {
        // console.log("vendor login route");
        // console.log(response);
        
        dispatch(setCurrentUser(response.data.rest))
            dispatch(setVendorLogin())
            dispatch(setToken(response.data.token))
         
            navigate('/profile')
      
     }).catch((err)=>{
       console.log("logggin errorrr");
       console.log(err);
       toast("wrong credentials")
     })
      // const res= await fetch('http://localhost:5000/api/vendors/signin',{
      //   method: 'POST',
      //   headers:{
      //     'Content-Type': 'application/json',
      //   },
        
      //   body:JSON.stringify(formData)
      // })
      //     let data=await res.json();
      //     // let cook=await res.cookie('access_token');
       
      //     console.log("cook");
      //     console.log(data);


          // if(res.status==200){
          //   dispatch(setCurrentUser(data.rest))
          //   dispatch(setVendorLogin())
          //   dispatch(setToken(data.token))
          //   // dispatch(setToken(data))
          //   // dispatch(loading())
          //   navigate('/profile')

          // }

      
      
    } catch (error) {
    //   dispatch(signInFailure(error))
    console.log("Catch vendorlogin error");
    console.log(error);
      
    }
  }else{
    toast("enter a valid password")
  }
  }else{
    toast("enter a valid email")
  }
}
  };
    
  
  return (
     <div className="homePage">      
              <ToastContainer />
           {signIn &&  <form className='form' onSubmit={handleSubmit} >
                 <h1 className='form-heading'>Vendor Sign In</h1>
                 <div className='form-content'>

                     <input ref={emailContent} className='form-input' type="email" placeholder='Enter email' name='email' onChange={handleChange}/>
                     <input ref={passwordContent} type="password" className='form-input' placeholder='Enter password' name='password'onChange={handleChange}/>
                     
                     <button className='form-button'  style={{color:"white",cursor:"pointer"}}>Sign In</button>
                  </div>
                
              </form>}
              {forgetPass&& <form className='form' >
                 <h1 className='form-heading'>Forget Password</h1>
                 <div className='form-content'>

                     <input  className='form-input' type="email" placeholder='Enter email' value={userEmail} name='email' onChange={(e)=>setUserEmail(e.target.value)} />
                  
                     <button type='button' className='form-button' onClick={mailCheck}>Enter</button>
                     <span style={{color:'white',marginRight:"2rem"}} onClick={signIN}>Login with your account</span>
                  </div>
       

              </form>}
              {mailSend&& 
              <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
                <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>

                 <input type="text" style={{height:"3rem",borderRadius:"2rem",paddingLeft:"2rem"}} onChange={(e)=>setUserOTP(e.target.value)}  placeholder='Enter OTP'/>
                 <button style={{height:"3rem",marginLeft:"2rem",width:"10rem",borderRadius:"2rem"}} onClick={receiveOTP} >enter otp</button>
                 <ToastContainer />
                </div>
                 
                <span style={{color:"white",marginBottom:"2rem",backgroundColor:"black",padding:"1rem",marginTop:"2rem"}}>An otp has send to your mail. Please check your mail</span>
              
              </div>
                }
              {resetPass&& <div style={{marginBottom:"2rem"}}>
                  <input type="text" style={{height:"3rem",borderRadius:"2rem",paddingLeft:"2rem"}} placeholder='Enter new password' onChange={(e)=>setNewPass(e.target.value)}/>
                  <input type="text" style={{height:"3rem",borderRadius:"2rem",paddingLeft:"2rem"}} placeholder='Confirm password' onChange={(e)=>setNewConPass(e.target.value)}/>
                 <button style={{height:"3rem",marginLeft:"2rem",width:"10rem",borderRadius:"2rem"}} onClick={changePass} >Reset Password</button>
                 </div> }
              <div className='bottom-links'>
              <span style={{color:'white',marginRight:"2rem"}} onClick={forPass}>Forget Password</span>

                  <p className='bottom-link-p'>Already have an account?</p>
                  <Link to="/vendorSignUp"> <span className='bottom-link-signup'>SignUp</span></Link>
              </div>
           
      </div>
  )
}
export default VendorSignin