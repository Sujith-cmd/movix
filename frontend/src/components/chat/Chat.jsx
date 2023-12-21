import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import './Chat.scss'
import { userChats } from '../../utils/ChatRequests';
import Conversation from '../conversation/Conversation.jsx';
import ChatBox from '../chatBox/ChatBox.jsx';
import {io} from 'socket.io-client';
import { toChat } from '../../store/userSlice.js';
toChat
const Chat = () => {
    const [chats, setChats]=useState([])
    const [onlineUsers, setOnlineUsers]=useState([])
    const [sendMessage,setSendMessage]=useState(null)
    const [currentChat, setCurrentChat]=useState(null)
    const [receivedMessage, setReceivedMessage]=useState(null)
    const { currentUser } = useSelector((state) => state.home);
    const { directToChat } = useSelector((state) => state.user);
    const { chat } = useSelector((state) => state.user);
    const dispatch=useDispatch()
    const socket=useRef()
   
    // useEffect(() => {
    //  console.log("chat is");
    //  console.log(currentChat);
    // }, [currentChat])

   useEffect(() => {
     if(directToChat!==null){
        setCurrentChat(directToChat)
        dispatch(toChat(null))
     }
   }, [])
    useEffect(() => {  
        if(sendMessage!==null){
            socket.current.emit('send-message',sendMessage)
        }
        }, [sendMessage])

    useEffect(() => {
      

            socket.current= io('http://localhost:8800');
            
             socket.current.emit("new-user-add",currentUser._id)
             socket.current.on('get-users',(users)=>{
                setOnlineUsers(users)
                
            })
        
    }, [currentUser])

    useEffect(() => {
        
        socket.current.on("receive-message",(data)=>{
            setReceivedMessage(data)
        })
    
    }, []) 


   
    useEffect(()=>{
        const getChats = async()=>{
            try {
                const {data} = await userChats(currentUser._id)
                setChats(data)
                // console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
        getChats();
    },[currentUser._id])

    // useEffect(() => {
    //     console.log("ONLINEUSERS");
    //     console.log(onlineUsers);
    // }, [onlineUsers])

    
   const checkOnlineStatus = (chat)=>{
    const chatMember= chat.members.find((member)=> member!==currentUser._id)
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
     }
   
  return (
    <div className='Chat'>
        <div className="Left-side-chat">
            <div className="Chat-container">

            <h2>Chats</h2>
            <div className="Chat-list">
                {chats.map((chat,index)=>(
                    <div key={index} onClick={()=>setCurrentChat(chat)}>
                        <Conversation data={chat} currentUserId={currentUser._id} online={checkOnlineStatus(chat)}/>
                    </div>
                ))}
            </div>
            </div>
        </div>
        <div className="right-side-chat">
        <div style={{width:"100",alignSelf:'flex-end'}}>
            <ChatBox chat={currentChat} currentUser={currentUser._id} setSendMessage={setSendMessage} receivedMessage={receivedMessage}/>
        </div>
        </div>
    </div>
  )
}

export default Chat