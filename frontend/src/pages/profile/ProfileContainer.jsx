import "./styles.scss"
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';



export default function Profile({currentUser}) {
  const fileRef=useRef(null)
  const [image, setImage]=useState(undefined)
  const [formData, setformData]=useState({})
  const [imagePercent, setImagePercent]=useState(0)
  const [imageError, setImageError]=useState(false)
  const [updateSuccess, setUpdateSuccess]=useState(false)
  const dispatch=useDispatch()
  const { currentUser,loading,error } = useSelector((state) => state.home);
  
 

  
  const handleChange = (e)=>{
    setformData({...formData,[e.target.id]:e.target.value})
    console.log(formData);
  }
  const handleSubmit = (e)=>{
    e.preventDefault()
    dispatch(updateUserStart())
    try {
      axios.post(`http://localhost:5000/api/vendors/update/${currentUser._id}`, {
        ...formData
      })
      .then(response=> {
     
       console.log(response.data.rest,response.status,response.statusText);
       dispatch(updateUserSuccess(response.data.rest))
       setUpdateSuccess(true)
       navigate('/')
       
       
      }).catch(error=>{
        console.log(error);
        dispatch(updateUserFailure(error))
        
        return
      });
    } catch (error) {
      console.log(error);
      dispatch(updateUserFailure(error))
    }
  }
  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      axios.delete(`http://localhost:5000/api/users/delete/${currentUser._id}`)
      .then(response=> {
     
       console.log(response.data.rest,response.status,response.statusText);
       dispatch(deleteUserSuccess())
      
       navigate('/signin')
       
       
      }).catch(error=>{
        console.log(error);
        dispatch(deleteUserFailure(error))
        
        return
      })
      
    
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };
  const handleSignOut = async () => {
    try {
      axios.get(`http://localhost:5000/api/users/signout`)
      dispatch(signOut())
    } catch (error) {
      console.log(error);
    }
  };
  return (
   

   
  
    <div className='updateMain'>
      <h1 className='h1 text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='form flex flex-col gap-4' onSubmit={handleSubmit}>
       
        {/* allow read;
      allow write: if
      request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('image/.*') */}
        <img
          src={currentUser.displayPicture}
          alt='profile'
          className='profileImage h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
         />
        
        <input
          defaultValue={currentUser.username}
          type='text'
          id='username'
          placeholder='Username'
          className='bg-slate-100 rounded-lg p-3 formInput' onChange={handleChange}
        />
        <input
          defaultValue={currentUser.email}
          type='email'
          id='email'
          placeholder='Email'
          className='bg-slate-100 rounded-lg p-3 formInput' onChange={handleChange}
        />
        <input
          type='password'
          id='password'
          placeholder='Password'
          className='bg-slate-100 rounded-lg p-3 formInput'  onChange={handleChange}
        />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 formButton'>update</button>
      </form>
      <div className="formOptions flex justify-between mt-5">
        <span className='text-red-700 cursor-pointer formOptionTitle' onClick={handleDeleteAccount}>Delete Account</span>
        <span className='text-red-700 cursor-pointer formOptionTitle' onClick={handleSignOut}>Sign out</span>
      </div>
      <p className='text-red-700 mt-5 formOptionText'>{error && 'something  went wrong'}</p>
      {/* <p className='text-green-700 mt-5'>{updateSuccess && 'user updated successfully'}</p> */}
    </div>
    
  );
}