import "./style.scss";
import React from "react";


import ContentWrapper from "../contentWrapper/ContentWrapper"
import { Link, useNavigate } from "react-router-dom";




const CombineLogin = () => {
  const navigate=useNavigate()
 
  return (
    <div className="combineLogin">
     <ContentWrapper>
        <div className="content-block">
          <div className="single-content">
           

            <p className="single-content-text">Do you own a Home Theatre?</p>
            <p className="single-content-text">Are you ready to share it?</p>
            <p className="single-content-text">Need an extra income?</p>
        
          </div>
        <Link to={'/vendorSignIn'}> <button className="single-content-button" >Sign In</button></Link>
        </div>
        <div className="content-block">
          <div className="single-content">
            <p className="single-content-text">Do you want to Upload a film?</p>
            <p className="single-content-text">Are you ready to broadcast it?</p>
            <p className="single-content-text">Need to use an OTT platform?</p>
          </div>
          <button className="single-content-button" >Sign In</button>
        </div>
       
   </ContentWrapper>
    </div>
  )
}

export default CombineLogin