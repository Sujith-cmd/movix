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
    const [showSearch, setShowSearch] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { allTheatres,allGames } = useSelector((state) => state.vendor);
    const { currentUser } = useSelector((state) => state.home);
    const dispatch=useDispatch()
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

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
                    <li className="menuItem">
                        <HiOutlineSearch onClick={openSearch} />
                    </li>
                </ul>

                <div className="mobileMenuItems">
                    <HiOutlineSearch onClick={openSearch} />
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
               {currentUser && <div className="headerName" onClick={() => navigate("/userProfile")}>{currentUser.username}</div>}
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
