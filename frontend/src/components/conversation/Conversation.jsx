import React, { useEffect, useState } from 'react'
import { getUser,getTheatre } from '../../utils/UserRequest.js'

const Conversation = ({data,currentUserId,online}) => {
    const [userData, setUserData] = useState(null)
    useEffect(() => {
    const userId = data.members.find((id)=>id!==currentUserId)
    const getUserData = async ()=> {
        try
        {
            const {data} =await getUser(userId)
            console.log("userdatatatata");
            console.log(data);
            if(data!==null){
                setUserData(data)
            }else{
                const {data} =await getTheatre(userId)
                if(data!==null){
                    setUserData(data)
                }
            }
          
        }
        catch(error)
        { 
            console.log(error)
        }
      }
      getUserData();
    }, [])
  return (
      <>
    <div className='follower conversation'>
        <div>
        {online && <div className="online-dot"></div>}
            <img className='followerImage' src={userData?.displayPicture ? userData?.displayPicture:"https://devemyhg.lycee-darchicourt.net/wp-content/uploads/2018/01/No-picture.png"} alt=""/>
            <div className='name' style={{display:"flex",flexDirection:"column",gap:"7px",fontSize:"0.8rem",alignSelf:"center",padding:"10px"}}>
                <span style={{fontWeight:"Bold"}}>{userData?.username}</span>
                <span style={{color: online?"#51e200":""}}>{online? "Online" : "Offline"}</span>
            </div>
        </div>
    </div>
        <hr style={{ width: "85%", border: "0.1px solid #999797" }} />
        </>
  )
}

export default Conversation