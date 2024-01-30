import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.scss";
import Img from "../../../components/lazyLoadImage/Img";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";

import useFetch, { useFetchGet } from "../../../hooks/useFetch";
import { fetchDataFromBackGet } from "../../../utils/api";

const HeroBanner = () => {
    const [background, setBackground] = useState("");
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const { url } = useSelector((state) => state.home);
    const { data, loading } = useFetchGet("/films/filmsList");

   
   
  
    useEffect(() => {
      
        try {
            const length=data?.length;
            const randomIndex = Math.floor(Math.random() * length);
            const bg = data[randomIndex]?.poster;   
         
            setBackground(bg);
        } catch (error) {
            
        }
       
    }
    )
  


    const searchQueryHandler = (event) => {
        if (event.key === "Enter" && query.length > 0) {
          
            navigate(`/search/${query}`);
        }
    };

    return (
        <div className="heroBanner">
            {!loading && (
                <div className="backdrop-img">
                    <Img src={background} />
                </div>
            )}

            <div className="opacity-layer"></div>
            <ContentWrapper>
                <div className="heroBannerContent">
                    <span className="title">Welcome.</span>
                    <span className="subTitle">
                        Millions of Theatres and Game Stations to discover.
                        Explore now.
                    </span>
                    {/* <div className="searchInput">
                        <input
                            type="text"
                            placeholder="Search for a movie or tv show...."
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyUp={searchQueryHandler}
                        />
                        <button>Search</button>
                    </div> */}
                </div>
            </ContentWrapper>
        </div>    );
}

export default HeroBanner
