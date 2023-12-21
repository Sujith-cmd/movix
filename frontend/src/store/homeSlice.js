import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    url: {},
    genres: {},
    heroBg:{},
    currentData:[],
    currentUser:{},
    token:null,
    admin:false,
    vendor:false,
    viewer:false,
    distributor:false,
    loadingState:false,
    errorState:false
}
 const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        getApiConfiguration: (state, action) => {
            state.url = action.payload;
        },
        getGenres: (state, action) => {
            state.genres = action.payload;
        },
        getHeroBg: (state, action) => {
            state.heroBg = action.payload;
        },
        setCurrentData: (state, action) => {
            state.currentData = action.payload;
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        loading: (state) => {
            state.loadingState = true;
        },
        finishLoading: (state) => {
            state.loadingState = false;
        },
        error: (state) => {
            state.errorState = true;
        },
        finishError: (state) => {
            state.errorState = false;
        },
        signout: (state) => {
            state.currentUser = {};
            state.token=null;
            state.admin = false;
            state.viewer=false
            state.vendor=false
        },
        setToken:(state,action)=> {
            state.token = action.payload;
        },
        setAdminLogin:(state)=> {
            state.admin = true;
            state.viewer=false
            state.vendor=false
        },
        setVendorLogin:(state)=> {
            state.vendor = true;
            state.admin = false;
            state.viewer=false
        },
        setViewerLogin:(state)=> {
            state.vendor = false;
            state.admin = false;
            state.viewer=true
        },
    }
    }
);   


export const { getApiConfiguration, getGenres,setToken,setCurrentData,setCurrentUser ,loading,finishLoading,error,finishError,signout,setAdminLogin,setVendorLogin,setViewerLogin } = homeSlice.actions;

export default homeSlice.reducer;




