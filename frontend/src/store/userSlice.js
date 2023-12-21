import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    basic: true,
    previousBookings:false,
    chats:false,
    directToChat:null,
    counter:0
   
}
 const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        getPrevious: (state) => {
            state.basic = false;
            state.previousBookings = true;
            state.chats=false
        },
        getBasic: (state) => {
            state.basic = true;
            state.previousBookings = false;
            state.chats=false
        },
        getChats: (state) => {
            state.basic = false;
            state.previousBookings = false;
            state.chats=true
        },
        toChat: (state,action) => {
            state.directToChat=action.payload
        },
        inc:(state)=>{
            state.counter=state+1
        },
        dec:(state)=>{
            state.counter=state-1

        }
       
      
    }
    }
);   


export const {getPrevious,getBasic,getChats,toChat,inc,dec} = userSlice.actions;

export default userSlice.reducer;
