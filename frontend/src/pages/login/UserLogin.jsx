
import React, { useRef, useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { setCurrentUser,loading,setToken,setAdminLogin,setVendorLogin,setViewerLogin } from '../../store/homeSlice.js'
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'
import "../SignUp/styles.scss"

import { axiosIn, fetchDataFromBackPost } from '../../utils/api.js'
import validator from 'validator'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { otpHelp } from '../../store/userSlice.js'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
// import jwt_decode from 'jwt-decode'
import { decodeJwt } from "jose";
const  UserSignin = () => {
  
  const [formData, setFormData] = useState({})
  const [signIn, setSignIn] = useState(true)
  const [forgetPass, setForgetPass] = useState(false)
  const [mailSend, setMailSend] = useState(false)
  const [resetPass, setResetPass] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [userOTP, setUserOTP] = useState("")
  const [newPass, setNewPass] = useState("")
  const [newConPass, setNewConPass] = useState("")
  const [userOTPFail, setUserOTPFail] = useState(false)
  const { currentUser,admin,vendor,viewer }=useSelector((state)=> state.home)
  const { otp }=useSelector((state)=> state.user)
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const handleChange = (e) => {
    if(e.target.name=="password"){

      setFormData({...formData,[e.target.name]:String(e.target.value)}) 
    }else{
      setFormData({...formData,[e.target.name]:String(e.target.value.trim())}) 
    }
      // console.log(formData);
  }
  
  const changePassword = (e) => {
    axiosIn.post("/admin/utility").then((response) => {
      console.log("utility route");
      console.log(response);
    
     
   }).catch((err)=>{
     console.log("utility errorrr");
     console.log(err);
     toast(err.response.data.msg)
   })
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

      axiosIn.post("/users/forgetPass",{newPass,userEmail}).then((response) => {
      
        console.log(response);
        navigate('/userSignin')
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
    if(userEmail==undefined||userEmail==null||userEmail.trim()==""){
     toast("enter a valid email")
    }else{

    
    if(validator?.isEmail(userEmail.trim())){
      axiosIn.post("/users/sendOTP",{userEmail}).then((response) => {
        console.log("utility route");
        console.log(response);
        toast("Please check your mail")
        dispatch(otpHelp(Number(response.data)))
        setSignIn(false)
        setForgetPass(true)
        setMailSend(true)
     
   }).catch((err)=>{
     console.log("utility errorrr");
     console.log(err);
     toast(err.response.data.message)
     setSignIn(false)
     setForgetPass(true)
     setMailSend(false)
   })
  //  console.log(otp);
    }else{
      toast("invalid email")
    }
  }
  }
  const handleSubmit=async (e) =>{
    e.preventDefault();
      if((formData?.email==undefined&&formData?.password==undefined)||(formData?.email==null&&formData?.password==null)){
        toast("enter valid credentials")
      }else{
      if(formData?.email==undefined||formData?.email==null||FormData?.email?.trim()==""){
        toast("enter a valid email")
      }else{
        if(validator?.isEmail(formData?.email?.trim())){

       
            // const passMatch=formData?.password
         
   
     if(formData?.password!==undefined&&formData?.password!==null&&formData?.password!==""){
        
       try {
       
        axiosIn.post("/users/login",formData).then((response) => {
          console.log("login route");
          console.log(response);
          if(response.status==200){
           dispatch(setCurrentUser(response.data.rest))
           dispatch(setViewerLogin())
           dispatch(setToken(response.data.token))
         
           navigate('/')
 
         }
         // if(response.status==400){}
       }).catch((err)=>{
         console.log("logggin errorrr");
         console.log(err);
         toast(err.response.data.msg)
       })
          
          
        } catch (error) {
     
        console.log("Catch error");
        console.log(error);
        toast("something went wrong.Try again")
          
        }
     }else{
      toast("enter valid password")
     }

        
         }else{
          toast("Invalid Email")
         }
      }
        
    }
    
  }
  const ghj = async (e) =>{
    e.preventDefault();
    if(formData.password==undefined||formData.email==undefined){
      toast("enter valid credentials")
    }else{
    const passMatch=formData.password.trim()
    if(passMatch!==""){
     
    
    if(validator.isEmail(formData.email)){
     
    try {
      axiosIn.post("/users/login",formData).then((response) => {
         console.log("login route");
         console.log(response);
         if(response.status==200){
          dispatch(setCurrentUser(response.data.rest))
          dispatch(setViewerLogin())
          dispatch(setToken(response.data.token))
        
          navigate('/')

        }
        // if(response.status==400){}
      }).catch((err)=>{
        console.log("logggin errorrr");
        console.log(err);
        toast(err.response.data.msg)
      })
      // const res= await fetch('http://localhost:5000/api/users/login',{
      //   method: 'POST',
      //   headers:{
      //     'Content-Type': 'application/json',
      //   },
      //   credentials: 'include',
      //   body:JSON.stringify(formData)
      // })
      //     let data=await res.json();
       
       
          
        

      
    } catch (error) {
    //   dispatch(signInFailure(error))
    console.log("Catch vendorlogin error");
    console.log(error);
      
    }
  }else{
    toast("Enter a valid email")
  }
}else{
  toast("Enter a valid email and password")
   }
  }
  };
    
  
  return (
     <div className="homePage">      
             {signIn&& <form className='form' onSubmit={handleSubmit} >
                 <h1 className='form-heading'>User Sign In</h1>
                 <div className='form-content'>

                     <input  className='form-input' type="email" placeholder='Enter email' name='email' onChange={handleChange}/>
                     <input type="password" className='form-input' placeholder='Enter password' name='password'onChange={handleChange}/>
                     <ToastContainer />
                     <button className='form-button' style={{color:"white",cursor:"pointer"}} >Sign In</button>
             {/* <GoogleOAuthProvider clientId="513075122529-5aga6qijikn2u3skt7644noamjsl8sms.apps.googleusercontent.com">

  <GoogleLogin
  onSuccess={credentialResponse => {
    // const details=jwt_decode(credentialResponse.credential)
    const details=decodeJwt(credentialResponse.credential)
    console.log(details);
    console.log("details");
    console.log(credentialResponse);
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>
             </GoogleOAuthProvider>; */}
                  </div>
                
              </form>}
              {forgetPass&& <form className='form' >
                 <h1 className='form-heading'>Forget Password</h1>
                 <div className='form-content'>

                     <input  className='form-input' type="email" placeholder='Enter email' value={userEmail} name='email' onChange={(e)=>setUserEmail(e.target.value)} />
                   
                     <button type='button' className='form-button' onClick={mailCheck}>Enter</button>
                     <span style={{color:'white',marginRight:"2rem"}} onClick={signIN}>Login with your account</span>
                     <ToastContainer />
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
                  <Link to="/userSignup"> <span className='bottom-link-signup'>SignUp</span></Link>
              </div>
           
      </div>
  )
}
export default UserSignin