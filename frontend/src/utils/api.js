import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = import.meta.env.VITE_APP_TMDB_TOKEN;

const headers = {
    Authorization: "bearer " + TMDB_TOKEN,
};

export const fetchDataFromApi = async (url, params) => {
    try {
        const { data } = await axios.get(url, {
            headers,
            params,
        });
        return data;
    } catch (err) {
        console.log(err)
    
        return err;
    }
};


export const fetchDataFromBackGet = async (url, params) => {
    
    if(params){
        console.log("params");
        console.log(params);
    }
    try {
        const { data } = await axios.get(url, {
            headers,
            params,
        });
      
        return data;
    } catch (err) {
        
        console.log("error in fetchData");
        return err;
    }
};

export const fetchDataFromBackPost = async (url, params) => {
  
    if(params){
        console.log("params");
        console.log(params);
    }
    try {
        const { data } = await axios.post(url, {
          
            params
        });
        console.log(data);
        return data;
    } catch (err) {
        
        console.log(err);
        return err;
    }
};