import React, { useState } from "react";

import Carousel from "../../../components/carousel/Carousel";
import useFetch, { useFetchGet } from "../../../hooks/useFetch";

const Similar = ({data, loading }) => {
    // const { data, loading, error } = useFetchGet(`http://localhost:5000/api/vendors/trending/${type==true?"Theatre":"Game"}`);
    // const title = mediaType === "tv" ? "Similar TV Shows" : "Similar Movies";

    return (
        <Carousel
            title="Similar Stations"
            data={data}
            loading={loading}
           
        />
    );
};

export default Similar;
