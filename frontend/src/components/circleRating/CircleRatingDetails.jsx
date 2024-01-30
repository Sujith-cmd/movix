import  { useEffect, useState } from "react";
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import "./style.scss";

const CircleRating = ({ rating }) => {
    const [rate,setRate] = useState(0)
    useEffect(() => {
        setRate(rating?.toFixed(1))
        // console.log("rating");
        // console.log(rate);
    }, [rating])
    // useEffect(() => {
    //  console.log("rate");
    //  console.log(rate);
    // }, [rate])
    return (
        <div className="circleRating">
            <CircularProgressbar
                value={rating}
                maxValue={5}
                text={rate}
                styles={buildStyles({
                    pathColor:
                        rating < 2 ? "red" : rating < 3.5 ? "orange" : "green",
                })}
            />
        </div>
    );
};

export default CircleRating;
