import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import "./style.scss";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/movix-logo.svg";
import { getTheatres,getGames } from "../../store/vendorSlice";

const Header = () => {
    const [show, setShow] = useState("top");
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [query, setQuery] = useState("");
    const [allReadyUser, setAllReadyUser] = useState(true);
    const [showSearch, setShowSearch] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { allTheatres,allGames } = useSelector((state) => state.vendor);
    const { currentUser } = useSelector((state) => state.home);
    const dispatch=useDispatch()
    useEffect(() => {
        window.scrollTo(0, 0);
        // console.log("location");
        // console.log(location);
        if(location.pathname=='/vendorSignIn'||location.pathname=='/adminSignIn'||location.pathname=='/userSignin'){
            if(currentUser?._id){

                setAllReadyUser(false)
            }
        }else{
            if(currentUser?._id){

                setAllReadyUser(true)
            }
        }
    }, [location,currentUser]);

    const controlNavbar = () => {
        if (window.scrollY > 200) {
            if (window.scrollY > lastScrollY ) {
                setShow("hide");
            } else {
                setShow("show");
            }
        } else {
            setShow("top");
        }
        setLastScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener("scroll", controlNavbar);
        return () => {
            window.removeEventListener("scroll", controlNavbar);
        };
    }, [lastScrollY]);

    const searchQueryHandler = (event) => {
        if (event.key === "Enter" && query.length > 0) {
            navigate(`/search/${query}`);
            setTimeout(() => {
                setShowSearch(false);
            }, 1000);
        }
    };

    const openSearch = () => {
        setMobileMenu(false);
        setShowSearch(true);
    };

    const openMobileMenu = () => {
        setMobileMenu(true);
        setShowSearch(false);
    };

    const navigationHandler =async (type) => {

        if(type=="theatre"){
            
        }
        try {
            const res= await fetch(`http://localhost:5000/api/vendors/explore/theatre`,{
    method: 'GET',
    headers:{
      'Content-Type': 'application/json',
    },
    credentials: 'include',
   
  })
      let allData=await res.json();
    //   console.log(allData);
      dispatch(getTheatres(allData))
      const resp= await fetch(`http://localhost:5000/api/vendors/explore/game`,{
    method: 'GET',
    headers:{
      'Content-Type': 'application/json',
    },
    credentials: 'include',
   
  })
      let allData2=await resp.json();
    //   console.log(allData2);
      dispatch(getGames(allData2))
    } catch (error) {
        
    }
    if (type === "theatre") {
            navigate("/explore/theatre");
           
        } else {
            navigate("/explore/game");
        }
        setMobileMenu(false);
    };

    return (
        <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
            <ContentWrapper>
                <div className="logo" onClick={() => navigate("/")}>
                    <img src={logo} alt="" />
                </div>
                <ul className="menuItems">
                    <li
                        className="menuItem"
                        onClick={() => navigationHandler("theatre")}
                    >
                        Theatres
                    </li>
                    <li
                        className="menuItem"
                        onClick={() => navigationHandler("game")}
                    >
                        Game Stations
                    </li>
                    {/* <li className="menuItem">
                        <HiOutlineSearch onClick={openSearch} />
                    </li> */}
                </ul>

                <div className="mobileMenuItems">
                    {/* <HiOutlineSearch onClick={openSearch} /> */}
                    {mobileMenu ? (
                        <VscChromeClose onClick={() => setMobileMenu(false)} />
                    ) : (
                        <SlMenu onClick={openMobileMenu} />
                        )}
                    
                </div>
                <div className="enter">
                    {!currentUser?._id &&
                    <>
                    
                        <Link className="signIn" to={"/userSignin"}>Sign In</Link>
                        <Link className="signIn" to={"/userSignup"}>Sign Up</Link>
                    </>
                    }
                </div>

              {allReadyUser?(
                  
                  <div >
                 {currentUser?.Role==0?(<div style={{display:"flex",alignItems:"center",gap:"1rem"}} className="headerName" onClick={() => navigate("/userProfile")}><span><img style={{height:"30px",width:"30px",borderRadius:"15px"}} src={currentUser.displayPicture?currentUser.displayPicture:"https://firebasestorage.googleapis.com/v0/b/screenshare-1c657.appspot.com/o/1706451145400avatar-3814049_1280.jpg?alt=media&token=08fc954a-5fec-48e4-90fe-2a7e125e8b33"} alt="" /></span><span>{currentUser?.username}</span></div>):("")}
               {currentUser?.Role==1?(<div style={{display:"flex",alignItems:"center",gap:"1rem"}} className="headerName" onClick={() => navigate("/profile")}>{currentUser?.username}</div>):("")}
               {currentUser?.Role==4?(<div style={{display:"flex",alignItems:"center",gap:"1rem"}} className="headerName" onClick={() => navigate("/adminHome")}>{currentUser?.adminName}</div>):("")}
                </div>):("")}
             
            </ContentWrapper>
            {showSearch && (
                <div className="searchBar">
                    <ContentWrapper>
                        <div className="searchInput">
                            <input
                                type="text"
                                placeholder="Search for a movie or tv show...."
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyUp={searchQueryHandler}
                            />
                            <VscChromeClose
                                onClick={() => setShowSearch(false)}
                            />
                        </div>
                    </ContentWrapper>
                </div>
            )}
        </header>
    );
};

export default Header;
