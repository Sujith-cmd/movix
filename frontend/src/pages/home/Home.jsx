import React from "react";

import "./style.scss";

import HeroBanner from "./heroBanner/HeroBanner";
import Trending from "./trending/Trending";
import CombineLogin from "../../components/combineLogin/CombineLogin.jsx";



const Home = () => {
    return (
        <div className="homePage">
            <HeroBanner />
             
             <Trending />
            <CombineLogin/>
        </div>
    );
};

export default Home;
