



import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import './Chat.scss'
import { userChats } from '../../utils/ChatRequests';
import Conversation from '../conversation/Conversation.jsx';
import ChatBox from '../chatBox/ChatBox.jsx';
import {io} from 'socket.io-client';
import { toChat } from '../../store/userSlice.js';
import { changestatus } from '../../utils/UserRequest.js';
import { getMessages } from '../../utils/MessageRequests.js';

const Chat = () => {
    const [chats, setChats]=useState([])
    const [onlineUsers, setOnlineUsers]=useState([])
    const [sendMessage,setSendMessage]=useState(null)
    const [newMsg,setNewMsg]=useState(null)
    const [currentChat, setCurrentChat]=useState(null)
    const [receivedMessage, setReceivedMessage]=useState(null)
    const { currentUser } = useSelector((state) => state.home);
    const { directToChat } = useSelector((state) => state.user);
    const { chat } = useSelector((state) => state.user);
    // const [chatComponents, setChatComponents] = useState([]);
    const dispatch=useDispatch()
    const socket=useRef()


    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const components = await renderChatComponents(); 
    //             setChatComponents(components);
    //         } catch (error) {
    //             console.error("Error rendering chat components:", error);
    //         }
    //     };

    //     fetchData();
    // }, []);
   
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
      if(currentChat!==null){

          const {_id}=currentChat
        //   console.log("currentchat Id");
        //   console.log(currentChat);
          change(_id)
      }
    }, [currentChat])

    useEffect(() => {
        
        socket.current.on("receive-message",(data)=>{
            setReceivedMessage(data)
            const{chatId,text}=data
            console.log("chatid data text");
            console.log(chatId);
            console.log(text);
            if(chatId!==undefined&&chatId!==null){

                change(chatId)
            }

            // console.log("rMssgDta");
            // console.log(data);
            // setNewMsg(data.se)
            
            
        })
    }, []) 


   
    useEffect(()=>{
        const getChats = async()=>{
            try {
                const {data} = await userChats(currentUser._id)
                setChats(data)
                console.log(" userGet");
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
        getChats();
    },[currentUser,sendMessage,receivedMessage])

    
        const change=async(chatId)=>{
            // console.log("chaaatId");
            // console.log(chatId);
            try {
              const {data} = await changestatus(chatId)
            //   console.log("changedMssgs");
            //   console.log(data);
            } catch (error) {
              console.log("error in changeStatusChat");
              console.log(error);
              console.log("chaaatIderror");
              console.log(chatId);
            }
            
              }

  

    
   const checkOnlineStatus = (chat)=>{
    const chatMember= chat.members.find((member)=> member!==currentUser._id)
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
     }
//    useEffect(() => {
//      console.log("currentChat");
//      console.log(currentChat);
//    }, [currentChat])




  return (
    <div className='Chat'>
        <div className="Left-side-chat">
            <div className="Chat-container">

            <h2>Chats</h2>
            <div className="Chat-list">
            
{chats.map((chat,index)=>{
    const unreadCheck=async()=>{
const { data } = await getMessages(chat._id);
// console.log("mssgs");
// console.log(data);
 const len=data.length
 const checkMsg=data[len-1]
 console.log("last message");
 console.log(checkMsg);
 if(checkMsg?.readStatus==undefined){
    console.log("checkmsg UNDEFINED here");
    // console.log(checkMsg);
 }
 if(checkMsg.readStatus=="read"){
    console.log("CHECKMSG read");
    return true
 
 }else if(checkMsg.readStatus=="not read"){
    console.log("CHECKMSG  not  read");
    return false
 }else{
    console.log("CHECKMSG undefined");
    // console.log(checkMsg);
    return true
 }
 return checkMsg?.readStatus=="unread"?true:false
    }
//    const checked= unreadCheck()
//    console.log("checked");
//    console.log(checked);
//    if(checked==true){
    return(

        <div key={index} onClick={()=>setCurrentChat(chat)}>
            <Conversation data={chat} currentUserId={currentUser._id} online={checkOnlineStatus(chat)} check={true}/>
        </div>
    )
//    }else{
//     return(

//         <div key={index} onClick={()=>setCurrentChat(chat)}>
//             <Conversation data={chat} currentUserId={currentUser._id} online={checkOnlineStatus(chat)} check={false}/>
//         </div>
//     )
//    }



// Assuming chats is an array of chat objects



// Use renderChatComponents in your component or wherever needed

}
)}

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
