import React from "react";

import "./style.scss";

import HeroBanner from "./heroBanner/HeroBanner";
import Trending from "./trending/Trending";
import CombineLogin from "../../components/combineLogin/CombineLogin.jsx";
import Explore from "../explore/Explore.jsx";



const Home = () => {
    return (
        <div className="homePage">
            <HeroBanner />
             <Trending />
             
             
            <CombineLogin/>
            {/* <HeroBanner /> */}
            {/* <Explore></Explore> */}
        </div>
    );
};

export default Home;
