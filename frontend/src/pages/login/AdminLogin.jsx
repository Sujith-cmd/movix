import React, { useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import "./styles.scss"
import axios from 'axios'

import { useDispatch, useSelector } from 'react-redux'
import { setCurrentUser } from '../../store/homeSlice.js'


const AdminLogin = () => {
   
  const [formData, setFormData] = useState({})
  const { currentUser }=useSelector((state)=> state.home)
const dispatch=useDispatch()
  const navigate=useNavigate()
  const handleChange = (e) => {
    setFormData({...formData,[e.target.id]:e.target.value})
    
  }
  const handleSubmit = async (e) =>{
    e.preventDefault();
     console.log("helllooo");
    try {
    //   
      const res= await fetch('http://localhost:5000/api/admin/login',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(formData)
      })
          let data=await res.json();
            dispatch(setCurrentUser(data))
          console.log(data);
      navigate("/adminHome")
      
    } catch (error) {
    console.log("whats error");
      console.log(error);
    }
   
  };
    
  
  return (
    <div className="homePage">
      
      <div >
        
        <span>

      <form className='form' onSubmit={handleSubmit} >
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