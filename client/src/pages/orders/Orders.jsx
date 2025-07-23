import React from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  // Fetch orders the user has placed
  const { isLoading, error, data } = useQuery({
    queryKey: ["myOrders"],
    queryFn: () => newRequest.get(`/orders/my-orders`).then((res) => res.data),
  });
  console.log(data);

  const handleContact = async (order) => {
    const sellerId = order.sellerId._id;
    const buyerId = order.buyerId._id;

    // Ensure you are setting the conversation ID based on the correct user roles
    const id = sellerId < buyerId ? sellerId + buyerId : buyerId + sellerId;

    try {
      // Try to fetch the existing conversation
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response.status === 404) {
        // If conversation does not exist, create a new one
        const res = await newRequest.post(`/conversations/`, {
          sellerId,
          buyerId,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };

  return (
    <div className="orders">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>My Orders</h1>
          </div>
          {data.length === 0 ? (
            <p>You don't have any orders.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Seller</th> {/* New column for Seller */}
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {data.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <img className="image" src={order.img} alt="" />
                    </td>
                    <td>{order.title}</td>
                    <td>{order.price}</td>
                    <td className={`status ${order.status}`}>{order.status}</td>
                    <td>{order.sellerId.username}</td>{" "}
                    {/* Display seller's name */}
                    <td>
                      <img
                        className="message"
                        src="./img/message.png"
                        alt="Message"
                        onClick={() => handleContact(order)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
