import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookmarkCheck, CheckCircle2, RotateCcw, Star, Calendar } from "lucide-react";
import {
  apiGetRequests,
  apiGetLoggedInUser,
  apiSubmitReturn
} from "../services/api";

export default function MyBorrowingsPage() {
  const [borrowings, setBorrowings] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedReqForReturn, setSelectedReqForReturn] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const user = apiGetLoggedInUser();

  const loadRequests = async () => {
    const allReqs = await apiGetRequests();
    const myReqs = allReqs.filter((req) => req.borrowerId === user?.id);
    setBorrowings(myReqs);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Submit Return + Rating in a single action
  const handleSubmitReturnWithRating = async (e) => {
    e.preventDefault();
    if (!selectedReqForReturn) return;

    await apiSubmitReturn(selectedReqForReturn.id, rating, comment);
    setMessage("Return request and review submitted! Waiting for owner confirmation.");
    setSelectedReqForReturn(null);
    setRating(5);
    setComment("");
    loadRequests();
  };

  const filteredBorrowings = borrowings.filter((req) => {
    if (req.itemDeleted) return true;

    if (activeTab === "Active") {
      return req.status === "Approved" || req.status === "Waiting Confirmation";
    }

    if (activeTab === "Pending") {
      return req.status === "Pending";
    }

    if (activeTab === "Completed") {
      return req.status === "Returned";
    }

    return true;
  });


  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "var(--text-main)", marginBottom: "6px" }}>
          My Borrowings
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
          Track active borrowings, return borrowed items, and view completed reviews.
        </p>
      </div>

      {message && (
        <div style={{
          backgroundColor: "#d1fae5",
          color: "#065f46",
          padding: "12px 16px",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: 500,
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <CheckCircle2 size={18} /> {message}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {["All", "Active", "Pending", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "1px solid var(--border-color)",
              backgroundColor: activeTab === tab ? "var(--primary-color)" : "#ffffff",
              color: activeTab === tab ? "#ffffff" : "var(--text-main)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {tab} {tab === "All" ? `(${borrowings.length})` : ""}
          </button>
        ))}
      </div>

      {/* List Section */}
      {filteredBorrowings.length === 0 ? (
        <div style={{ backgroundColor: "#ffffff", padding: "40px", borderRadius: "14px", border: "1px solid var(--border-color)", textAlign: "center" }}>
          <BookmarkCheck size={40} style={{ color: "var(--text-muted)", marginBottom: "12px" }} />
          <p style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "16px" }}>No borrowings found.</p>
          <Link to="/browse" style={{ backgroundColor: "var(--primary-color)", color: "#ffffff", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>
            Browse Community Items
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredBorrowings.map((req) => (
            <div
              key={req.id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                border: "1px solid var(--border-color)",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {req.itemImage && (
                  <img
                    src={req.itemImage}
                    alt={req.itemName}
                    style={{ width: "76px", height: "76px", objectFit: "contain", backgroundColor: "#f8fafc", borderRadius: "10px", border: "1px solid var(--border-color)" }}
                  />
                )}
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-main)", marginBottom: "4px" }}>
                    {req.itemName}
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "4px" }}>
                    Lender: <strong>{req.ownerName}</strong>
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={14} /> Duration: {req.startDate} to {req.endDate}
                  </p>


                  {req.itemDeleted && (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "12px",
                        backgroundColor: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "8px"
                      }}
                    >
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#991b1b",
                          marginBottom: "5px"
                        }}
                      >
                        Item Deleted by Lender
                      </p>

                      <p
                        style={{
                          fontSize: "13px",
                          color: "#7f1d1d",
                          lineHeight: 1.5
                        }}
                      >
                        <strong>Reason:</strong>{" "}
                        {req.deletionReason || "No reason provided."}
                      </p>
                    </div>
                  )}

                  {req.status === "Returned" && req.rating && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "6px", fontSize: "12px", color: "#f59e0b" }}>
                      <Star size={14} fill="#f59e0b" />
                      <strong>{req.rating}/5</strong>
                      {req.comment && <span style={{ color: "var(--text-muted)", marginLeft: "4px" }}>"{req.comment}"</span>}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Badge & Action */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "6px 12px",
                  borderRadius: "20px",
                  backgroundColor:
                    req.itemDeleted ? "#fee2e2" :
                      req.status === "Approved" ? "#d1fae5" :
                        req.status === "Pending" ? "#fef3c7" :
                          req.status === "Waiting Confirmation" ? "#e0f2fe" :
                            req.status === "Returned" ? "#f1f5f9" : "#fee2e2",
                  color:
                    req.itemDeleted ? "#991b1b" :
                      req.status === "Approved" ? "#065f46" :
                        req.status === "Pending" ? "#b45309" :
                          req.status === "Waiting Confirmation" ? "#0369a1" :
                            req.status === "Returned" ? "#475569" : "#991b1b"
                }}>
                  ● {req.itemDeleted
                    ? "Item Deleted"
                    : req.status === "Waiting Confirmation"
                      ? "Pending Owner Confirmation"
                      : req.status}
                </span>

                {req.status === "Approved" && !req.itemDeleted && (
                  <button
                    onClick={() => setSelectedReqForReturn(req)}
                    style={{
                      backgroundColor: "var(--primary-color)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 14px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <RotateCcw size={14} /> Return Item
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Immediate Modal for Return + Rating */}
      {selectedReqForReturn && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: "20px"
        }}>
          <div style={{
            backgroundColor: "#ffffff",
            padding: "30px",
            borderRadius: "16px",
            maxWidth: "420px",
            width: "100%",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>
              Return Item & Rate Lender
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
              How was your experience borrowing <strong>{selectedReqForReturn.itemName}</strong> from {selectedReqForReturn.ownerName}?
            </p>

            <form onSubmit={handleSubmitReturnWithRating} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Rating</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: star <= rating ? "#f59e0b" : "#cbd5e1"
                      }}
                    >
                      <Star size={28} fill={star <= rating ? "#f59e0b" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Feedback / Comment (Optional)</label>
                <textarea
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="The item was clean and worked perfectly!"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "13px", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setSelectedReqForReturn(null)}
                  style={{ backgroundColor: "#f1f5f9", color: "var(--text-main)", border: "none", borderRadius: "8px", padding: "10px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: "var(--primary-color)", color: "#ffffff", border: "none", borderRadius: "8px", padding: "10px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                >
                  Submit Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}