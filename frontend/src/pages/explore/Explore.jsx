import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import InfiniteScroll from "react-infinite-scroll-component";
// import Select from "react-select";
import "./style.scss";
// import useFetch from "../../hooks/useFetch";
import { useSelector, useDispatch } from 'react-redux';
import { axiosIn, fetchDataFromApi } from "../../utils/api.js";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import Spinner from "../../components/spinner/Spinner";
import { useFetchGet } from "../../hooks/useFetch";
const Explore = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    const { type } = useParams();
    const { allTheatres,allGames } = useSelector((state) => state.vendor);
//    console.log(allTheatres);
//    console.log(allGames);

const searchQueryHandler = (event) => {
console.log("sera");
console.log(query);
    if (event.key === "Enter" && query.length > 0) {

        // Construct a regular expression without the / delimiters
        // var namePattern = new RegExp(query, 'i'); // 'i' for case-insensitive matching
        const namePattern = new RegExp(`${query}`,'i');
        const searchData = data.filter(function (vendor) {
            // Use the test method to check if the vendor name matches the regex pattern
            if (namePattern.test(vendor.username)) {
            // if (vendor.username==`/^${query}/`) {
                return vendor;
            }
        });
        const searchDataState = data.filter(function (vendor) {
            // Use the test method to check if the vendor name matches the regex pattern
            if (namePattern.test(vendor?.address?.state)) {
            // if (vendor.username==`/^${query}/`) {
                return vendor;
            }
        });
        const searchDataDistrict = data.filter(function (vendor) {
            // Use the test method to check if the vendor name matches the regex pattern
            if (namePattern.test(vendor?.address?.district)) {
            // if (vendor.username==`/^${query}/`) {
                return vendor;
            }
        });
        const searchDataPost = data.filter(function (vendor) {
            // Use the test method to check if the vendor name matches the regex pattern
            if (namePattern.test(vendor?.address?.postOffice)) {
            // if (vendor.username==`/^${query}/`) {
                return vendor;
            }
        });

        console.log("searchData");
        console.log(searchData);
        setData([...searchData,...searchDataState,...searchDataDistrict,...searchDataPost])

        // Perform actions with the filtered data, e.g., navigate(`/search/${query}`);
    }
};
const searchQueryHandlerClick = () => {
console.log("sera");
console.log(query);
   

        // Construct a regular expression without the / delimiters
        // var namePattern = new RegExp(query, 'i'); // 'i' for case-insensitive matching
        const namePattern = new RegExp(`^${query}`);
        const searchData = data.filter(function (vendor) {
            // Use the test method to check if the vendor name matches the regex pattern
            if (namePattern.test(vendor.username)) {
            // if (vendor.username==`/^${query}/`) {
                return vendor;
            }
        });
        const searchDataState = data.filter(function (vendor) {
            // Use the test method to check if the vendor name matches the regex pattern
            if (namePattern.test(vendor?.address?.state)) {
            // if (vendor.username==`/^${query}/`) {
                return vendor;
            }
        });
        const searchDataDistrict = data.filter(function (vendor) {
            // Use the test method to check if the vendor name matches the regex pattern
            if (namePattern.test(vendor?.address?.district)) {
            // if (vendor.username==`/^${query}/`) {
                return vendor;
            }
        });
        const searchDataPost = data.filter(function (vendor) {
            // Use the test method to check if the vendor name matches the regex pattern
            if (namePattern.test(vendor?.address?.postOffice)) {
            // if (vendor.username==`/^${query}/`) {
                return vendor;
            }
        });

        console.log("searchData");
        console.log(searchData);
        setData([...searchData,...searchDataState,...searchDataDistrict,...searchDataPost])


        // Perform actions with the filtered data, e.g., navigate(`/search/${query}`);
    
};
    const fetchInitialData = async() => {
        setLoading(true);
        if(type=="theatre"){
           const allT= allTheatres.filter((theatre,index)=>{
               
                   return theatre.isAccess=="Allowed"
               
                
                
      })

      try {
        axiosIn.get(`/vendors/explore/${type}`).then((resp)=>{
            // console.log("remove facility resp");
            // console.log(resp);
            
            setData(resp.data)
          }).catch((err)=>{
            console.log("remove facility error");
            console.log(err);
          })
       
    } catch (error) {
        setLoading(true)
    }
        
        // const response = await fetch(`http://localhost:5000/api/vendors/explore/${type}`,{
        //               method:"GET"
        //             })
        //             const session = await response.json()
        //             console.log("seeeee");
        //             console.log(session);
        // setData(session)
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
    if(query.trim()==""){
        fetchInitialData()
    }
    }, [query])
    return (
        <div className="explorePage">
            <ContentWrapper>
                 <div className="searchInput">
                        <input
                            type="text"
                            placeholder="Search for a movie or tv show...."
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyUp={searchQueryHandler}
                        />
                        <button onClick={searchQueryHandlerClick}>Search</button>
                    </div>
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
