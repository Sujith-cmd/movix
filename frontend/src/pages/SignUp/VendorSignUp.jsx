import React, { useRef, useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

import { useDispatch, useSelector } from 'react-redux'
import "../SignUp/styles.scss"
import { axiosIn, fetchDataFromBackPost } from '../../utils/api.js'
import validator from 'validator'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const VendorSignup = () => {
  const usernameContent=useRef()
  const emailContent=useRef()
  const passwordContent=useRef()
  const isTheatreContent=useRef()
  const [formData, setFormData] = useState({})
  const [confirmPass, setConfirmPass] = useState("")
  const { url }=useSelector((state)=> state.home)
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const handleChange = (e) => {
    console.log(formData);
    console.log("");
    console.log(isTheatreContent.value);
    if(e.target.name=="isTheatre"){
      if(e.target.value=="true"){

        setFormData({...formData,[e.target.name]:true})
      }else{
        setFormData({...formData,[e.target.name]:false})

      }
    }else{

      setFormData({...formData,[e.target.name]:String(e.target.value)})
    }
    
  }
  const handleSubmit = async (e) =>{
    e.preventDefault();
    console.log("formdataa");
    console.log(formData);

    if((formData.email==undefined&&formData.password==undefined&&formData.username==undefined)||(formData.email==null&&formData.password==null&&formData.username==null)){
      console.log("total error");
       toast("please fill the form correctly")
    }else{
      if(formData.username!==undefined&&formData.username.trim()!==""){
    if(formData.email!==undefined&&validator.isEmail(formData?.email?.trim())){
    // setFormData({
    //   username: usernameContent.current.value,
    //   email: emailContent.current.value,
    //   password: passwordContent.current.value,
    //   isTheatre:isTheatreContent.current.value
    // });
    //  console.log(formData);
    if(formData?.password==confirmPass && confirmPass!==""){
      if(formData?.password?.length<6){
        return toast("password should contain atleast 6 letters")
      }
      if(formData?.isTheatre!==undefined){
    try {
    //   dispatch(signInStart())
    axiosIn.post("/vendors/signup",formData).then((response) => {
     
      console.log("vendor response");
      console.log(response);
        navigate('/vendorSignIn') 
      
   }).catch((error)=>{
  
     console.log("error in signup");
     const err=error.response.data.msg;
     toast(err)
   })
      // const res= await fetch('http://localhost:5000/api/vendors/signup',{
      //   method: 'POST',
      //   headers:{
      //     'Content-Type': 'application/json',
      //   },
      //   body:JSON.stringify(formData)
      // })
      //     let data=await res.json();
      //     console.log(data);
      //     navigate('/vendorSignIn')

      // fetchDataFromBackPost('http://localhost:5000/api/vendors/signup', 
      //   formData
      // )
      // .then(response=> {
      //  console.log("response");
      //  console.log(response);
      //  //    dispatch(signInSuccess(response.data.rest))
       
       
      // }).catch(error=>{
      //   console.log("error");
      //   console.log(error);
      //   // dispatch(signInFailure(error))
        
      //   return
      // });
      
      
      
    } catch (error) {
    //   dispatch(signInFailure(error))
    console.log("Catch error");
    console.log(error);
      
    }
  }else{
    toast("select your station type")
  }
  }else{
    toast("passwords not matching or invalid")
  }
  }else{
   toast("Email is invalid")
  }
}else{
   toast("Enter valid username")
}
}
  };
    
  
  return (
     <div className="homePage">      
              <form className='form' onSubmit={handleSubmit} >
                 <h1 className='form-heading'>Vendor Sign Up</h1>
                 <div className='form-content'>
                 <ToastContainer />
                     <input ref={usernameContent} className='form-input' type="text" placeholder='Enter username' name='username' onChange={handleChange}/>
                     <input ref={emailContent} className='form-input' type="email" placeholder='Enter email' name='email' onChange={handleChange}/>
                     <input ref={passwordContent} type="password" className='form-input' placeholder='Enter password' name='password'onChange={handleChange}/>
                     <input type="password" className='form-input' placeholder='Enter password' name='password2' onChange={(e)=>setConfirmPass(e.target.value)}/>

                     <span className='radio'>
                      <span>
                     <label className='label' htmlFor='theatre'>Theatre</label>
                     <input ref={isTheatreContent} className="radio-input" type="radio" name='isTheatre' id='theatre' value={true} onChange={handleChange}/>

                      </span>
                      <span>
                     <label className='label' htmlFor='game'>Game Station</label>
                     <input className="radio-input" type="radio" name='isTheatre' id='game' value={false} onChange={handleChange}/>

                      </span>
                     </span>
                     <button className='form-button' style={{color:"white",cursor:"pointer"}}>SignUp</button>
                  </div>
                
              </form>
              <div className='bottom-links'>
                  <p className='bottom-link-p'>Already have an account?</p>
                  <Link to="/vendorSignIn"> <span className='bottom-link-signup'>SignIn</span></Link>
              </div>
           
      </div>
  )
}
export default VendorSignup