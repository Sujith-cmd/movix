import React, { useEffect, useRef, useState } from 'react'
import { getTheatre, getUser } from '../../utils/UserRequest.js'
import { addMessage, getMessages } from '../../utils/MessageRequests.js';
import './ChatBox.scss'
import {format} from "timeago.js"
import InputEmoji from 'react-input-emoji'
import { messageAxiosIntercepter } from '../../hooks/messageAxios.jsx';
import { vendorAxiosIntercepter } from '../../hooks/vendorAxios.jsx';
const ChatBox = ({chat,currentUser,setSendMessage,receivedMessage}) => {
    // console.log("boxChat");
    // console.log(chat);
    const [userData, setUserData] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const scroll=useRef()
    const messageAxios=messageAxiosIntercepter()
    const vendorAxios=vendorAxiosIntercepter()
    useEffect(() => {
    if(receivedMessage!==null && receivedMessage.chatId==chat?._id){
      setMessages([...messages,receivedMessage])
      // console.log("recieMssg");
      // console.log(receivedMessage);
    }
    }, [receivedMessage])

    useEffect(() => {
    const userId = chat?.members?.find((id)=> id!==currentUser)
    // console.log("boxUserId");
    // console.log(userId);
    const getUserData = async ()=> {
        try
        {
            const {data} =await getUser(userId)
            // console.log("get");
            // console.log(data);
           if(data){
            setUserData(data)
           }else{
            const {data} =await getTheatre(userId)
            // export const getTheatre=(id)=> API.get(`/vendors/getDetails/${id}`)
            setUserData(data)
           }
       
          
        }
        catch(error)
        { 
            console.log(error)
        }
      }
      if(chat!==null) getUserData()
    },[chat,currentUser])

    useEffect(() => {
        const fetchMessages = async () => {
          try {
            // const { data } = await getMessages(chat._id);
            const res= await messageAxios.get(`/${chat._id}`)
            .then((resp)=>{
              console.log("remove facility resp");
              console.log(resp);
              setMessages(resp.data);
             
            }).catch((err)=>{
              console.log("message loading error");
             
              console.log(err);
            })
            // console.log("messageData");
            // console.log(data);
          } catch (error) {
            console.log(error);
          }
        };
    
        if (chat !== null) fetchMessages();
      }, [chat]);

      const handleChange = (newMessage) =>{
         setNewMessage(newMessage)
      }


      const handleSend=async(e)=>{
     
          e.preventDefault()
          if(newMessage!==null&&newMessage!==""){
        const message={
            senderId:currentUser,
            text: newMessage,
            chatId:chat._id
        }
        try {
            // const {data} = await addMessage(message)
            const res= await messageAxios.post("/",{
              senderId:currentUser,
              text: newMessage,
              chatId:chat._id
            })
            .then((resp)=>{
              console.log("remove facility resp");
              console.log(resp);
           
              setMessages([...messages,resp.data])
              setNewMessage("")
             
            }).catch((err)=>{
              console.log("message loading error");
             
              console.log(err);
            })


        } catch (error) {
            console.log(error);
        }
        const receiverId= chat.members.find((id)=>id!==currentUser)
        setSendMessage({...message,receiverId})    
      } 
        }

     useEffect(() => {
     scroll.current?.scrollIntoView({behavior:"smooth"})
     },[messages])

  return (
   <>
   <div className="ChatBox-container" >
    {chat?(
        <>
        <div className="chat-header" >
          <div className="follower">
          <div style={{display:"flex"}}>
             
              <img style={{width:"50px",height:"50px",borderRadius:"25px"}} className='followerImage' src={userData?.displayPicture ? userData?.displayPicture:"https://devemyhg.lycee-darchicourt.net/wp-content/uploads/2018/01/No-picture.png"} alt=""/>
              <div className='name' style={{gap:"7px",fontSize:"1rem",padding:"10px"}}>
                  <span style={{fontWeight:"Bold",color:"white"}}>{userData?.username}</span>
                  
              </div>
          </div>
          </div>
  
     <hr style={{ marginTop:"10px",width: "85%", border: "0.1px solid #999797" }} />
        </div>
        <div className="chat-body">
         {messages.map((message,index)=>(
          
          <div ref={scroll} key={index} className={message.senderId===currentUser?"message own":"message"}>
            <span>{message.text}</span>
            <span>{format(message.createdAt)}</span>
          </div>
          
         ))
  
         }
        </div>
        <div className='chat-sender'>
          <div>+</div>
          <InputEmoji 
          value={newMessage}
          onChange={handleChange}
          />
          <div style={{paddingTop:"1%",fontWeight:"600"}} className="send-button button" onClick={handleSend}>
              Send
          </div>
        </div>
        </>
    ):(
       <span className='chatbox-empty-message' style={{color:"white",padding:"2rem",width:"100%",textAlign:"center"}}>
        Tap on a chat to start a conversation
       </span> 
    )}
     
   </div>
   </>
  )
}

export default ChatBox