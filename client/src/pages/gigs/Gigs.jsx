import React, { useEffect, useRef, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";

function Gigs() {
  const [sort, setSort] = useState("starNumber"); // Default sorting is by newest
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(""); // State for selected category
  const minRef = useRef();
  const maxRef = useRef();

  const { search } = useLocation();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs"],
    queryFn: () =>
      newRequest
        .get(
          `/gigs${search}${search ? "&" : "?"}min=${
            minRef.current.value || ""
          }&max=${maxRef.current.value || ""}&sort=${sort}&cat=${category}`
        )
        .then((res) => res.data),
  });

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  const apply = () => {
    refetch();
  };

  useEffect(() => {
    refetch();
  }, [sort, category]); // Refetch gigs when sort or category changes

  return (
    <div className="gigs">
      <div className="container">
        <h1>Browse Gigs</h1>
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>

          <div className="center">
            <span>Category</span>
            <select onChange={(e) => setCategory(e.target.value)}>
              <option value="">All</option>
              <option value="graphics_and_design">Graphics And Design</option>
              <option value="digital_marketing">Digital Marketing</option>
              <option value="writing_and_translation">
                Writing And Translation
              </option>
              <option value="video_and_animation">Video And Animation</option>
              <option value="music_and_audio">Music And Audio</option>
              <option value="programming_and_tech">Programming And Tech</option>
              <option value="web_development">Web Development</option>
              <option value="mobile_app_development">
                Mobile App Development
              </option>
              <option value="business">Business</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="data_analysis">Data Analysis</option>
              <option value="seo_services">SEO Services</option>
              <option value="software_development">Software Development</option>
            </select>
          </div>

          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "createdAt" ? "Newest" : "Popularity"}
            </span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "createdAt" ? (
                  <span onClick={() => reSort("starNumber")}>Popularity</span>
                ) : (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="cards">
          {isLoading ? (
            "Loading..."
          ) : error ? (
            "Something went wrong!"
          ) : data.length === 0 ? (
            <h2>No gigs found</h2>
          ) : (
            data.map((gig) => <GigCard key={gig._id} item={gig} />)
          )}
        </div>
      </div>
    </div>
  );
}

export default Gigs;
