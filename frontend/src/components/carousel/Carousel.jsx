import React, { useEffect, useRef, useState } from "react";
import {
    BsFillArrowLeftCircleFill,
    BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import Img from "../lazyLoadImage/Img";
import PosterFallback from "../../assets/no-poster.png";
import CircleRating from "../circleRating/CircleRating";
import Genres from "../genres/Genres";

import "./style.scss";

const Carousel = ({ data, loading, endpoint, title }) => {
    const [array, setArray] = useState(data)
    const [loadingState, setLoadingState] = useState(loading)
    const [len, setLen] = useState(0)
    const carouselContainer = useRef();
    const { url } = useSelector((state) => state.home);
    const navigate = useNavigate();
   
  
    const navigation = (dir) => {
        const container = carouselContainer.current;

        const scrollAmount =
            dir === "left"
                ? container.scrollLeft - (container.offsetWidth + 20)
                : container.scrollLeft + (container.offsetWidth + 20);

        container.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
        });
    };

    const skItem = () => {
        return (
            <div className="skeletonItem">
                <div className="posterBlock skeleton"></div>
                <div className="textBlock">
                    <div className="title skeleton"></div>
                    <div className="date skeleton"></div>
                </div>
            </div>
        );
    };
    
  
    return (
        <div className="carousel">
            <ContentWrapper>
                {title && <div className="carouselTitle">{title}</div>}
                <BsFillArrowLeftCircleFill
                    className="carouselLeftNav arrow"
                    onClick={() => navigation("left")}
                />
                <BsFillArrowRightCircleFill
                    className="carouselRighttNav arrow"
                    onClick={() => navigation("right")}
                />
                {!loading ? (
                    <div className="carouselItems" ref={carouselContainer}>
                        {data?.map((item) => {
                            const posterUrl = item.displayPicture
                                ? item.displayPicture
                                : PosterFallback;
                            return (
                                <div
                                    key={item._id}
                                    className="carouselItem"
                                    onClick={() =>{

                                        navigate(`/vendor/${item._id}`)
                                    }
                                    }
                                >
                                    <div className="posterBlock">
                                        <Img src={posterUrl} />
                                        <CircleRating
                                            rating={item.seatingCapacity}
                                        />
                                        <Genres
                                            data={["4K tv","Dolby"]}
                                        /> 
                                    </div>
                                    <div className="textBlock">
                                        <span className="title">
                                            {item.username}
                                        </span>
                                        <span className="date">
                                           Total Seats : {item.seatingCapacity}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="loadingSkeleton">
                        {skItem()}
                        {skItem()}
                        {skItem()}
                        {skItem()}
                        {skItem()}
                    </div> 
                )}
            </ContentWrapper>
        </div>
    );
};

export default Carousel;
