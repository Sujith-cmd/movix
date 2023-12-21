import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import InfiniteScroll from "react-infinite-scroll-component";
// import Select from "react-select";
import "./style.scss";
// import useFetch from "../../hooks/useFetch";
import { useSelector, useDispatch } from 'react-redux';
import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import Spinner from "../../components/spinner/Spinner";
import { useFetchGet } from "../../hooks/useFetch";
const Explore = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { type } = useParams();
    const { allTheatres,allGames } = useSelector((state) => state.vendor);
//    console.log(allTheatres);
//    console.log(allGames);


    const fetchInitialData = async() => {
        setLoading(true);
        if(type=="theatre"){
           const allT= allTheatres.filter((theatre,index)=>{
               
                   return theatre.isAccess=="Allowed"
               
                
                
      })
        
        const response = await fetch(`http://localhost:5000/api/vendors/explore/${type}`,{
                      method:"GET"
                    })
                    const session = await response.json()
                    // console.log("seeeee");
                    // console.log(session);
        setData(session)
    }else{
            setData(allGames)

        }
        
        setLoading(false);
    
    };
    useEffect(() => {
        // filters = {};
        setLoading(true)
        setData(null);
        fetchInitialData();
    }, [type]);
    
    useEffect(() => {
    console.log("data");
    console.log(data);
    }, [data])
    return (
        <div className="explorePage">
            <ContentWrapper>
                <div className="pageHeader">
                    <div className="pageTitle">
                        {type === "theatre"
                            ? "Explore Theatres"
                            : "Explore Game Stations"}
                    </div>
                </div>
                {loading && <Spinner initial={true} />}
                <div className="listing">

                {!loading && (
    <>
        {data?.length > 0 ? (
            data?.map((item, index) => (
                <MovieCard
                    key={index}
                    data={item}
                    // mediaType={mediaType}
                />
            ))
        ) : (
            <span className="resultNotFound">
                Sorry, Results not found!
            </span>
        )}
    </>
)}
                </div>
            </ContentWrapper>
        </div>
    );
};

export default Explore;
