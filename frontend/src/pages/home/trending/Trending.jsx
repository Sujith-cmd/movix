import React, { useState, useEffect } from "react";

import Carousel from "../../../components/carousel/Carousel";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import SwitchTabs from "../../../components/switchTabs/SwitchTabs";

import useFetch, { useFetchGet } from "../../../hooks/useFetch";
import { axiosIn } from "../../../utils/api";

const Trending = () => {
    const [endpoint, setEndpoint] = useState("Theatre");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    // const { data, loading } = useFetch(`/trending/movie/${endpoint}`);
   
    // const { data:trendingList, loading:trendingLoading } = useFetchGet(`/vendors/trending/${endpoint}`);
   
    const initial = async () => {
        try {
            axiosIn.get(`/vendors/trending/${endpoint}`).then((resp)=>{
                console.log("remove facility resp");
                console.log(resp);
                
                setData(resp.data)
              }).catch((err)=>{
                console.log("remove facility error");
                console.log(err);
              })
           
        } catch (error) {
            setLoading(true)
        }
              
    };


    const onTabChange = (tab) => {
        setEndpoint(tab === "Theatre" ? "Theatre" : "Game");
    };

   useEffect(() => {
      initial()
   }, [endpoint])
    return (
        <div className="carouselSection">
            <ContentWrapper>
                <span className="carouselTitle">Trending</span>
                <SwitchTabs data={["Theatre", "Game"]} onTabChange={onTabChange} />
            </ContentWrapper>
            <Carousel data={data} loading={loading} />
        </div>
    );
};

export default Trending;