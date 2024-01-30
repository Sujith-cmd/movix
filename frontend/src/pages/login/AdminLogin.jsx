import React, { useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import "./styles.scss"
import validator from 'validator'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

import { useDispatch, useSelector } from 'react-redux'
import { setAdminLogin, setCurrentUser, setToken } from '../../store/homeSlice.js'
import { axiosIn } from '../../utils/api.js';


const AdminLogin = () => {
   
  const [formData, setFormData] = useState({})
  const { currentUser }=useSelector((state)=> state.home)
const dispatch=useDispatch()
  const navigate=useNavigate()
  const handleChange = (e) => {
    setFormData({...formData,[e.target.id]:e.target.value})
    console.log(formData);
    
  }
  const handleSubmit = async (e) =>{
    e.preventDefault();
    if(formData?.adminEmail!==undefined && validator.isEmail(formData?.adminEmail) &&formData?.adminEmail!==null){
     console.log("helllooo");
     if(formData?.adminPassword!==undefined && formData?.adminPassword?.trim()!==null){
    try {
    //   
      // const res= await fetch('http://localhost:5000/api/admin/login',{
      //   method: 'POST',
      //   headers:{
      //     'Content-Type': 'application/json',
      //   },
      //   body:JSON.stringify(formData)
      // })
      //     let data=await res.json();
      //       dispatch(setCurrentUser(data.admin))
      //       dispatch(setToken(data.token))
      //     console.log(data);
      axiosIn.post("/admin/login",formData).then((response) => {
        console.log("login route");
        console.log(response);
        if(response.status==200){
         dispatch(setCurrentUser(response.data.admin))
         dispatch(setAdminLogin())
         dispatch(setToken(response.data.token))
         navigate("/adminHome")
       
   

       }
      
     }).catch((err)=>{
       console.log("logggin errorrr");
       console.log(err);
       toast(err.response.data.msg)
     })
      
    } catch (error) {
    console.log("whats error");
      console.log(error);
    }
  }else{

    toast("enter a valid password")
  }
  }else{
     toast("enter a valid email")
  }
  };
    
  
  return (
    <div className="homePage">
      
      <div >
        
        <span>

      <form className='form' onSubmit={handleSubmit} >
      <ToastContainer />

      <h1 className='form-heading'>Admin Sign In</h1>
      <div className='form-content'>

        <input className='form-input' type="email" placeholder='Enter email' id='adminEmail' onChange={handleChange}/>
        <input type="password" className='form-input' placeholder='Enter adminPassword' id='adminPassword' onChange={handleChange}/>
        <button type='submit' className='form-button' >SignIn</button>
      </div>
      
      </form>
        </span>
      </div>
      <div className='bottom-links'>
        <p className='bottom-link-p'>Dont have an account?</p>
        <Link to="/vendorSignUp">
          <span className='bottom-link-signup'>SignUp</span>
        </Link>
      </div>
      {/* <p >hello</p> */}
    </div>
  )
}
export default AdminLogin