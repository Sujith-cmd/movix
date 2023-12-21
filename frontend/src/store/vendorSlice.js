import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    basic: true,
    facility: false,
    slots:false,
    chats:false,
    currentData:[],
    allTheatres:[],
    allGames:[]
   
}
 const vendorSlice = createSlice({
    name: "vendor",
    initialState,
    reducers: {
        getFacilities: (state) => {
            state.basic = false;
            state.facility = true;
            state.slots = false;
            state.chats=false
        },
        getSlots: (state) => {
            state.basic = false;
            state.facility = false;
            state.slots = true;
            state.chats=false
        },
        getBasic: (state) => {
            state.basic = true;
            state.facility = false;
            state.slots = false;
            state.chats=false
        },
        getChats: (state) => {
            state.basic = false;
            state.facility = false;
            state.slots = false;
            state.chats=true
        },
        getTheatres: (state,action) =>  {
            state.allTheatres = action.payload;
        },
        getGames: (state,action) =>  {
            state.allGames = action.payload;
        }
    }
    }
);   


export const {getFacilities,getSlots,getBasic,getTheatres,getGames,getChats } = vendorSlice.actions;

export default vendorSlice.reducer;




