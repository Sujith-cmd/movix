import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

import { useDispatch, useSelector } from 'react-redux'
import "./styles.scss"
import { axiosIn, fetchDataFromBackPost } from '../../utils/api.js'
import { setCurrentUser } from '../../store/homeSlice'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validator from 'validator'
const UserSignup = () => {
  const usernameContent=useRef()
  const emailContent=useRef()
  const passwordContent=useRef()
  const isTheatreContent=useRef()
  const [formData, setFormData] = useState({})
  const [password, setPassword] = useState("")
  const [confirmPassword, setconfirmPassword] = useState("")
  const [failedPass, setFailedPass] = useState(false)
  // const [incorrectPass, setIncorrectPass] = useState(false)

  const { currentUser }=useSelector((state)=> state.home)
  const dispatch=useDispatch()
  const navigate=useNavigate()
  // const notify = () => toast("Wow so easy!");
  const confirm= (e) => {

  }
  useEffect(() => {
  console.log("password");
  console.log(confirmPassword);
  }, [confirmPassword])
  useEffect(() => {
  console.log("formDDD");
  console.log(formData);
  }, [formData])
  const handleChange = (e) => {
    // console.log(formData);
    // if(e.target.name=="isTheatre"){
    //   if(e.target.value=="true"){

    //     setFormData({...formData,[e.target.name]:true})
    //   }else{
    //     setFormData({...formData,[e.target.name]:false})

    //   }
    // }else{

    //   setFormData({...formData,[e.target.name]:String(e.target.value)})
    // }
    if(e.target.name=="password"){

      setFormData({...formData,[e.target.name]:String(e.target.value)}) 
    }else{
      setFormData({...formData,[e.target.name]:String(e.target.value.trim())}) 
    }
  }
  const handleSubmit = async (e) =>{
    e.preventDefault();
    // setIncorrectPass(false)
    if(formData.username==undefined&&formData.email==undefined&&formData.password==undefined){
      toast("Enter Credentials Correctly")
    }else{
    if(formData?.username==undefined||formData?.username==null||formData?.username.trim()==""){
      toast("enter a valid username")
    }else{
      if(formData?.email==undefined||formData?.email==null||FormData?.email?.trim()==""){
        toast("enter a valid email")
      }else{
        if(validator?.isEmail(formData?.email?.trim())){

            const pppaaass=confirmPassword
            const passMatch=formData?.password
           const mail=formData?.email?.trim()
   
     if(passMatch===pppaaass && passMatch!==""){
        if(passMatch.length<6){
           return toast("password should contain atleast 6 letters")
        }else{
       try {
       
        axiosIn.post("/users/signup",formData).then((response) => {
          
        
 
            navigate('/userSignin') 
          
       }).catch((error)=>{
       
         console.log("error in signup");
         const err=error.response.data.msg;
         toast(err)
       })
          
          
          
        } catch (error) {
     
        console.log("Catch error");
        console.log(error);
        toast("something went wrong.Try again")
          
        }

     }
     }else{
      toast("enter valid password and confirm correctly")
     }

        
         }else{
          toast("Invalid Email")
         }
      }
        }
   
      }
  };
    
  
  return (
     <div className="homePage">      
              <form className='form' onSubmit={handleSubmit} >
                 <h1 className='form-heading'>User Sign Up</h1>
                 <div className='form-content'>
                     <ToastContainer />
                     <input ref={usernameContent} className='form-input' type="text" placeholder='Enter username' name='username' onChange={handleChange}/>
                     <input ref={emailContent} className='form-input' type="email" placeholder='Enter email' name='email' onChange={handleChange}/>
                     <input ref={passwordContent} type="password" className='form-input' placeholder='Enter password' name='password'onChange={handleChange}/>
                     <input type="password" className='form-input' placeholder='Enter password' name='password2' onChange={(e)=>setconfirmPassword(e.target.value)}/>
                    
                     <button className='form-butto' style={{color:"white",cursor:"pointer"}}>SignUp</button>
                    {/* {incorrectPass&& <span style={{color:'white'}}> Password not matching</span>} */}
                  </div>
                
              </form>
              <div className='bottom-links'>
                  <p className='bottom-link-p'>Already have an account?</p>
                  <Link to="/userSignin"> <span className='bottom-link-signup'>SignIn</span></Link>
              </div>
           
      </div>
  )
}
export default UserSignup