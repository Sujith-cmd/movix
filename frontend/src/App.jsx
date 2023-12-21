import { useState, useEffect } from "react";
import { fetchDataFromApi } from "./utils/api";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css'
import { useSelector, useDispatch } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home.jsx";
import Details from "./pages/details/Details.jsx";
import SearchResult from "./pages/searchResult/SearchResult.jsx";
import Explore from "./pages/explore/Explore.jsx";
import PageNotFound from "./pages/404/PageNotFound.jsx";
import VendorSignIn from "./pages/login/VendorLogin.jsx";
import VendorsSignup from "./pages/SignUp/VendorSignUp.jsx";
import AdminSignIn from "./pages/login/AdminLogin.jsx";
import Profile from "./pages/profile/VendorProfile.jsx";
import UserSignUp from "./pages/SignUp/UserSignUp.jsx";
import AdminHome from "./pages/admin/adminHome/AdminHome";
import PrivateRoute from "./components/PrivateRoute.jsx";
import CheckoutSuccess from "./components/checkout/CheckoutSuccess.jsx";
import CheckoutFailure from "./components/checkout/CheckoutFailure.jsx";
import PrivateRouteVendor from "./components/PrivateRouteUser.jsx";
import PrivateRouteViewer from "./components/PrivateRouteViewer.jsx";
import UserSignin from "./pages/login/UserLogin.jsx";
import UserProfile from "./pages/profile/ViewerProfile.jsx";

function App() {
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home);
     
  
//  

  return (
     
    <BrowserRouter>
    <Header />
    <Routes>
        <Route exact path="/" element={<Home />} />
        
        <Route element={<PrivateRouteVendor />} >
            <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<PrivateRoute />} >
        <Route path="/adminHome" element={<AdminHome />} />
            </Route>
        
            <Route element={<PrivateRouteViewer />} >
            <Route path="/userProfile" element={<UserProfile />} />
            </Route>
            
            {/* <Route element={<PrivateRouteViewer />} >
            <Route path="/userProfile" element={<UserProfile />} />
            </Route>
             */}
        
        <Route path="/userSignup" element={<UserSignUp />} />
        <Route path="/userSignin" element={<UserSignin />} />
        <Route path="/vendorSignIn" element={<VendorSignIn />} />
        <Route path="/vendorSignUp" element={<VendorsSignup />} />
        <Route path="/adminSignIn" element={<AdminSignIn />} />
        <Route path="/checkoutSuccess" element={<CheckoutSuccess/>} />
        <Route path="/checkoutFailure" element={<CheckoutFailure/>} />
        <Route path="/vendor/:id" element={<Details />} />
        <Route path="/explore/:type" element={<Explore />} />
        
        <Route path="*" element={<PageNotFound />} />
    </Routes>
    <Footer />
</BrowserRouter>
  
  )
}

export default App
