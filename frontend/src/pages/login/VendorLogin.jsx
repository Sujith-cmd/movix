import React, { useRef, useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { setCurrentUser,loading,setToken,setVendorLogin } from '../../store/homeSlice.js'
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'
import "../SignUp/styles.scss"
import { fetchDataFromBackPost } from '../../utils/api.js'

const VendorSignin = () => {
  const usernameContent=useRef()
  const emailContent=useRef()
  const passwordContent=useRef()
  const isTheatreContent=useRef()
  const [formData, setFormData] = useState({})
  const { currentUser }=useSelector((state)=> state.home)
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const handleChange = (e) => {
    console.log(formData);
      setFormData({...formData,[e.target.name]:String(e.target.value)}) 
  }
  const handleSubmit = async (e) =>{
    e.preventDefault();
    // setFormData({
    //   username: usernameContent.current.value,
    //   email: emailContent.current.value,
    //   password: passwordContent.current.value,
    //   isTheatre:isTheatreContent.current.value
    // });
    //  console.log(formData);
    try {
   
      const res= await fetch('http://localhost:5000/api/vendors/signin',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        
        body:JSON.stringify(formData)
      })
          let data=await res.json();
          // let cook=await res.cookie('access_token');
       
          console.log("cook");
          console.log(data);
          if(res.status==200){
            dispatch(setCurrentUser(data.rest))
            dispatch(setVendorLogin())
            dispatch(setToken(data.token))
            // dispatch(setToken(data))
            // dispatch(loading())
            navigate('/profile')

          }

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
    console.log("Catch vendorlogin error");
    console.log(error);
      
    }
   
  };
    
  
  return (
     <div className="homePage">      
              <form className='form' onSubmit={handleSubmit} >
                 <h1 className='form-heading'>Vendor Sign In</h1>
                 <div className='form-content'>

                     <input ref={emailContent} className='form-input' type="email" placeholder='Enter email' name='email' onChange={handleChange}/>
                     <input ref={passwordContent} type="password" className='form-input' placeholder='Enter password' name='password'onChange={handleChange}/>
                     
                     <button className='form-button' >Sign In</button>
                  </div>
                
              </form>
              <div className='bottom-links'>
                  <p className='bottom-link-p'>Already have an account?</p>
                  <Link to="/vendorSignUp"> <span className='bottom-link-signup'>SignUp</span></Link>
              </div>
           
      </div>
  )
}
export default VendorSignin