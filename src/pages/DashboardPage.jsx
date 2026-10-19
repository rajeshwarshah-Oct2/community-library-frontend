import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, BookmarkCheck, Clock, PlusCircle, ArrowRight } from "lucide-react";
import { apiGetItems, apiGetRequests, apiGetLoggedInUser } from "../services/api";

export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const user = apiGetLoggedInUser();

  useEffect(() => {
    const loadData = async () => {
      const allItems = await apiGetItems();
      const allReqs = await apiGetRequests();
      setItems(allItems);
      setRequests(allReqs);
    };
    loadData();
  }, []);

  const userItems = items.filter((item) => item.ownerId === user?.id);
  const userBorrowings = requests.filter((req) => req.borrowerId === user?.id);
  const pendingRequestsForMyItems = requests.filter(
    (req) => req.ownerId === user?.id && req.status === "Pending"
  );

  const statCards = [
    { title: "Total Items Listed", count: userItems.length, icon: Package, color: "#0d9488", bg: "#ccfbf1", path: "/my-listings" },
    { title: "Current Borrowings", count: userBorrowings.filter(r => r.status === "Approved").length, icon: BookmarkCheck, color: "#2563eb", bg: "#dbeafe", path: "/my-borrowings" },
    { title: "Pending Requests", count: pendingRequestsForMyItems.length, icon: Clock, color: "#d97706", bg: "#fef3c7", path: "/my-listings" },
  ];

  return (
    <div>
      <div style={{
        backgroundColor: "#ffffff",
        padding: "24px 30px",
        borderRadius: "14px",
        border: "1px solid var(--border-color)",
        marginBottom: "24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "var(--text-main)", marginBottom: "4px" }}>
            Welcome back, {user ? user.name : "User"}! 👋
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Here is what's happening in your community library today ({user?.building}).
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link
            to="/browse"
            style={{
              backgroundColor: "var(--primary-color)",
              color: "#ffffff",
              padding: "10px 18px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            Browse Items <ArrowRight size={16} />
          </Link>
          <Link
            to="/list-item"
            style={{
              backgroundColor: "#f1f5f9",
              color: "var(--text-main)",
              padding: "10px 18px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <PlusCircle size={16} /> List an Item
          </Link>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
        marginBottom: "30px"
      }}>
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              to={stat.path}
              style={{
                backgroundColor: "#ffffff",
                padding: "20px",
                borderRadius: "14px",
                border: "1px solid var(--border-color)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
              className="hover-card"
            >
              <div>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500, marginBottom: "6px" }}>{stat.title}</p>
                <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "var(--text-main)" }}>{stat.count}</h3>
              </div>
              <div style={{ backgroundColor: stat.bg, color: stat.color, padding: "12px", borderRadius: "12px" }}>
                <Icon size={24} />
              </div>
            </Link>
          );
        })}
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-main)" }}>Recently Added Community Items</h3>
          <Link to="/browse" style={{ fontSize: "14px", color: "var(--primary-color)", fontWeight: 600, textDecoration: "none" }}>
            View All →
          </Link>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "20px"
        }}>
          {items.slice(0, 4).map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid var(--border-color)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column"
              }}
              className="hover-card"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "contain",
                  backgroundColor: "#f8fafc"
                }}
              />
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
                <span style={{
                  alignSelf: "flex-start",
                  backgroundColor: "#f1f5f9",
                  color: "var(--text-muted)",
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "4px 8px",
                  borderRadius: "6px",
                  marginBottom: "8px"
                }}>
                  {item.category}
                </span>
                <h4 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>{item.name}</h4>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
                  Owner: {item.ownerName} ({item.building})
                </p>
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: item.availability === "Available" ? "#059669" : "#d97706"
                  }}>
                    ● {item.availability}
                  </span>

                  {item.ownerId === user?.id ? (
                    <Link
                      to="/my-listings"
                      style={{
                        fontSize: "13px",
                        backgroundColor: "#f1f5f9",
                        color: "var(--text-main)",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        fontWeight: 600,
                        textDecoration: "none"
                      }}
                    >
                      My Item (Manage)
                    </Link>
                  ) : (
                    <Link
                      to={`/item/${item.id}`}
                      style={{
                        fontSize: "13px",
                        color: "var(--primary-color)",
                        fontWeight: 600,
                        textDecoration: "none"
                      }}
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}