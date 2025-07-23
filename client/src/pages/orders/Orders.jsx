import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import getImageUrl from "../../utils/getImageUrl";
import { toast } from "react-toastify";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch orders the user has placed
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["myOrders"],
    queryFn: () => newRequest.get(`/orders/my-orders`).then((res) => res.data),
  });

  // Filter and sort orders
  const filteredAndSortedOrders = React.useMemo(() => {
    if (!data) return [];
    
    let filtered = data.filter(order => {
      const matchesStatus = !filterStatus || order.status === filterStatus;
      const matchesSearch = !searchTerm || 
        order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.sellerId.username.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });

    return filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'seller') {
        aValue = a.sellerId.username;
        bValue = b.sellerId.username;
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [data, filterStatus, sortBy, sortOrder, searchTerm]);

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
      } else {
        toast.error("Failed to start conversation");
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "#ffc107",
      in_progress: "#007bff", 
      completed: "#28a745",
      cancelled: "#dc3545",
      refunded: "#6c757d"
    };
    
    return {
      backgroundColor: statusColors[status] || "#6c757d",
      color: "white",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "500",
      textTransform: "capitalize"
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const clearFilters = () => {
    setFilterStatus("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setSearchTerm("");
  };

  return (
    <div className="orders">
      <div className="container">
        {/* Header Section */}
        <div className="orders-header">
          <div className="header-content">
            <h1>My Orders</h1>
            <p>Track and manage all your purchased services</p>
          </div>
          
          {/* Stats Cards */}
          {data && (
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-number">{data.length}</div>
                <div className="stat-label">Total Orders</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {data.filter(order => order.status === 'completed').length}
                </div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {data.filter(order => order.status === 'in_progress').length}
                </div>
                <div className="stat-label">In Progress</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {data.filter(order => order.status === 'pending').length}
                </div>
                <div className="stat-label">Pending</div>
              </div>
            </div>
          )}
        </div>

        {/* Controls Section */}
        <div className="orders-controls">
          <div className="controls-left">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <img src="/img/search.png" alt="Search" />
            </div>
            
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="status-filter"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className="controls-right">
            <div className="sort-controls">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="createdAt">Date</option>
                <option value="title">Title</option>
                <option value="price">Price</option>
                <option value="status">Status</option>
                <option value="seller">Seller</option>
              </select>
              
              <button 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="sort-direction"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            <button onClick={clearFilters} className="clear-btn">
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <span>
            {filteredAndSortedOrders.length} of {data?.length || 0} orders
          </span>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>Failed to load orders</p>
            <button onClick={() => refetch()}>Try Again</button>
          </div>
        ) : filteredAndSortedOrders.length === 0 ? (
          <div className="empty-state">
            {data?.length === 0 ? (
              <>
                <img src="/img/no-orders.png" alt="No orders" />
                <h3>No Orders Yet</h3>
                <p>You haven't placed any orders yet. Browse our services to get started!</p>
                <button onClick={() => navigate('/gigs')} className="browse-btn">
                  Browse Services
                </button>
              </>
            ) : (
              <>
                <img src="/img/no-results.png" alt="No results" />
                <h3>No Matching Orders</h3>
                <p>Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="orders-grid">
            {filteredAndSortedOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-image">
                  <img src={getImageUrl(order.img)} alt="" />
                  <div className="status-badge" style={getStatusBadge(order.status)}>
                    {order.status.replace('_', ' ')}
                  </div>
                </div>
                
                <div className="order-content">
                  <h3 className="order-title">{order.title}</h3>
                  
                  <div className="order-details">
                    <div className="detail-row">
                      <span className="label">Seller:</span>
                      <span className="value">{order.sellerId.username}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Price:</span>
                      <span className="value price">${order.price}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Order Date:</span>
                      <span className="value">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="order-actions">
                    <button 
                      onClick={() => handleContact(order)}
                      className="contact-btn"
                    >
                      <img src="/img/message.png" alt="Message" />
                      Contact Seller
                    </button>
                    
                    <button 
                      onClick={() => navigate(`/gig/${order.gigId}`)}
                      className="view-gig-btn"
                    >
                      View Service
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
