import { useEffect, useState } from "react";
import { fetchDataFromApi, fetchDataFromBackGet, fetchDataFromBackPost } from "../utils/api";
const useFetch = (url) => {
    
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading("loading...");
        setData(null);
        setError(null);

        fetchDataFromApi(url)
            .then((res) => {

                setLoading(false);
                setData(res);
               
               
            })
            .catch((err) => {
                setLoading(false);
                setError("Something went wrong!");
            });
            if(data==null){
               
            }
    }, [url]);

    return { data, loading, error };
};
export const useFetchGet = (endpoint) => {
    const defUrl="http://localhost:5000/api"
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading("loading...");
        setData(null);
        setError(null);

        fetchDataFromBackGet(`${defUrl}${endpoint}`)
            .then((res) => {
                setLoading(false);
                setData(res);
              
               
            }).catch((err) => {
                setLoading(false);
                setError("Something went wrong WITH USEFETCH!");
                console.log("fdfb error");
                console.log(err);
                
        
            });
            if(data==null){
                
                // setLoading(true);
            }
    }, [endpoint]);

    return { data, loading, error };
};
export const useFetchPost = (url) => {
    console.log(url);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading("loading...");
        setData(null);
        setError(null);

        fetchDataFromBackPost(url)
            .then((res) => {
                setLoading(false);
                setData(res);
               
               
            })
            .catch((err) => {
                setLoading(false);
                setError("Something went wrong WITH USEFETCH!");
            });
            if(data==null){
                console.log(url);
                console.log("its nulllll");
            }
    }, [url]);

    return { data, loading, error };
};
export default useFetch;
