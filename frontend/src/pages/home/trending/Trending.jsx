import React, { useState, useEffect } from "react";

import Carousel from "../../../components/carousel/Carousel";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import SwitchTabs from "../../../components/switchTabs/SwitchTabs";

import useFetch, { useFetchGet } from "../../../hooks/useFetch";

const Trending = () => {
    const [endpoint, setEndpoint] = useState("Theatre");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    // const { data, loading } = useFetch(`/trending/movie/${endpoint}`);
   
    // const { data:trendingList, loading:trendingLoading } = useFetchGet(`/vendors/trending/${endpoint}`);
   
    const initial = async () => {
        try {
            
            const res= await fetch(`http://localhost:5000/api/vendors/trending/${endpoint}`)
            const datas=await res.json();
            console.log("theatre datas");
            console.log(datas);
            setLoading(false)
            setData(datas)
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