import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const GigCard = ({ item }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId],
    queryFn: () =>
      newRequest.get(`/users/${item.userId}`).then((res) => {
        return res.data;
      }),
  });

  // Calculate the average rating if there are ratings
  const averageRating = item.starNumber
    ? Math.round(item.totalStars / item.starNumber)
    : 0;

  return (
    <Link to={`/gig/${item._id}`} className="link">
      <div className="gigCard">
        <img src={item.cover} alt={item.title} />
        <div className="info">
          {isLoading ? (
            "Loading..."
          ) : error ? (
            "Something went wrong!"
          ) : (
            <div className="user">
              <img src={data.img || "/img/noavatar.jpg"} alt={data.username} />
              <span>{data.username}</span>
            </div>
          )}
          <p>{item.title.substring(0, 60)}...</p>
          <div className="star">
            <img src="./img/star.png" alt="Star" />
            {item.starNumber === 0 ? (
              <span style={{ color: "black", fontWeight: 400 }}>
                No ratings yet
              </span>
            ) : (
              <span>
                {averageRating} ({item.starNumber})
              </span>
            )}
          </div>
        </div>
        <hr />
        <div className="detail">
          <div className="price">
            <h2>Price: ${item.price}</h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
