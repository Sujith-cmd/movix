import React from 'react'
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth'
import { app } from '../firebase'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailure, signInSuccess } from '../redux/user/userSlice.js'
import { useNavigate } from 'react-router-dom'

function OAuth() {
    const dispatch=useDispatch();
    const navigate=useNavigate()
    const handleGoogleClick=async()=>{
try {
   const provider=new GoogleAuthProvider()
   const auth=getAuth(app)
   const result= await signInWithPopup(auth,provider)
   console.log(result);
   axios.post("http://localhost:5000/api/users/google", {
    username:result.user.displayName,
    email:result.user.email,
    displayPicture:result.user.photoURL
    
  })
  .then(response=> {
 
   console.log(response.data,response.status,response.statusText);
   dispatch(signInSuccess(response.data.viewer))
   navigate('/')
   
   
  }).catch(error=>{
    console.log(error);
    dispatch(signInFailure(error.message))
    
    return
  });
} catch (error) {
    console.log("cant login with google");
}
    }
  return (
    <button type='button' onClick={handleGoogleClick} className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>COntinue with Google</button>
  )
  }

export default OAuth 