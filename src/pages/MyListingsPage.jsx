import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, CheckCircle2, XCircle, Star, MessageSquare } from "lucide-react";
import {
  apiGetItems,
  apiGetRequests,
  apiGetLoggedInUser,
  apiDeleteItem,
  apiUpdateRequestStatus,
  apiConfirmReturnByOwner
} from "../services/api";

export default function MyListingsPage() {
  const [myItems, setMyItems] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [message, setMessage] = useState("");
  const user = apiGetLoggedInUser();
  const [selectedItemForDeletion, setSelectedItemForDeletion] = useState(null);
  const [deletionReason, setDeletionReason] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    const allItems = await apiGetItems();
    const allReqs = await apiGetRequests();

    const filteredItems = allItems.filter((item) => item.ownerId === user?.id);
    const filteredRequests = allReqs.filter((req) => req.ownerId === user?.id);

    setMyItems(filteredItems);
    setIncomingRequests(filteredRequests);
  };

  useEffect(() => {
    loadData();
  }, []);


  const handleDelete = (item) => {
    setSelectedItemForDeletion(item);
    setDeletionReason("");
    setMessage("");
  };

  const confirmDelete = async () => {
    if (!deletionReason.trim()) {
      setMessage("Please enter a reason for deleting this item.");
      return;
    }

    try {
      setIsDeleting(true);

      const result = await apiDeleteItem(
        selectedItemForDeletion.id,
        deletionReason.trim()
      );

      if (result.success) {
        setMyItems((prev) =>
          prev.filter(
            (item) =>
              String(item.id) !==
              String(selectedItemForDeletion.id)
          )
        );

        setSelectedItemForDeletion(null);
        setDeletionReason("");
        setMessage("Item deleted successfully. Borrowers will see your reason.");

        await loadData();
      }
    } catch (error) {
      setMessage(error.message || "Failed to delete item.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    await apiUpdateRequestStatus(requestId, newStatus);
    setMessage(`Request ${newStatus.toLowerCase()} successfully.`);
    loadData();
  };

  // Owner confirms item return from borrower
  const handleConfirmReturnByOwner = async (requestId) => {
    await apiConfirmReturnByOwner(requestId);
    setMessage("Item return confirmed! Item is now available for others.");
    loadData();
  };

  const receivedReviews = incomingRequests.filter(
    (req) => req.status === "Returned" && req.rating
  );

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "var(--text-main)", marginBottom: "6px" }}>
          My Listings & Borrower Feedback
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
          Manage your shared items, review incoming requests, and confirm returned items.
        </p>
      </div>

      {message && (
        <div style={{
          backgroundColor: "#d1fae5",
          color: "#065f46",
          padding: "12px 16px",
          borderRadius: "8px",
          fontSize: "14px",
          marginBottom: "20px"
        }}>
          {message}
        </div>
      )}

      {/* Borrow Requests Received */}
      <div style={{ marginBottom: "36px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-main)", marginBottom: "14px" }}>
          Borrow Requests Received ({incomingRequests.filter(r => r.status === "Pending" || r.status === "Waiting Confirmation").length} Active)
        </h3>

        {incomingRequests.length === 0 ? (
          <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-color)", fontSize: "14px", color: "var(--text-muted)" }}>
            No borrow requests received yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {incomingRequests.map((req) => (
              <div
                key={req.id}
                style={{
                  backgroundColor: "#ffffff",
                  padding: "16px 20px",
                  borderRadius: "12px",
                  border: "1px solid var(--border-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px"
                }}
              >
                <div>
                  <h4 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-main)", marginBottom: "4px" }}>
                    {req.itemName}
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    Requested by: <strong>{req.borrowerName}</strong> | Dates: {req.startDate} to {req.endDate}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: "20px",
                    backgroundColor:
                      req.status === "Pending" ? "#fef3c7" :
                        req.status === "Approved" ? "#d1fae5" :
                          req.status === "Waiting Confirmation" ? "#e0f2fe" : "#f1f5f9",
                    color:
                      req.status === "Pending" ? "#b45309" :
                        req.status === "Approved" ? "#065f46" :
                          req.status === "Waiting Confirmation" ? "#0369a1" : "#475569"
                  }}>
                    {req.status === "Waiting Confirmation" ? "Pending Your Return Confirmation" : req.status}
                  </span>

                  {req.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(req.id, "Approved")}
                        style={{ backgroundColor: "#059669", color: "#ffffff", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <CheckCircle2 size={16} /> Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(req.id, "Rejected")}
                        style={{ backgroundColor: "#dc2626", color: "#ffffff", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </>
                  )}

                  {req.status === "Waiting Confirmation" && (
                    <button
                      onClick={() => handleConfirmReturnByOwner(req.id)}
                      style={{ backgroundColor: "#0284c7", color: "#ffffff", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                    >
                      <CheckCircle2 size={16} /> Confirm Received & Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Received Reviews & Ratings */}
      <div style={{ marginBottom: "36px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-main)", marginBottom: "14px" }}>
          ⭐ Borrower Ratings & Reviews Received ({receivedReviews.length})
        </h3>

        {receivedReviews.length === 0 ? (
          <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-color)", fontSize: "14px", color: "var(--text-muted)" }}>
            No reviews or ratings received from borrowers yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {receivedReviews.map((rev) => (
              <div
                key={rev.id}
                style={{
                  backgroundColor: "#ffffff",
                  padding: "16px 20px",
                  borderRadius: "12px",
                  border: "1px solid var(--border-color)",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <h4 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-main)" }}>
                      {rev.itemName}
                    </h4>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      (Borrowed by {rev.borrowerName})
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#f59e0b", marginBottom: "6px" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < rev.rating ? "#f59e0b" : "none"}
                        color={i < rev.rating ? "#f59e0b" : "#cbd5e1"}
                      />
                    ))}
                    <strong style={{ fontSize: "13px", color: "var(--text-main)", marginLeft: "4px" }}>
                      {rev.rating}/5 Stars
                    </strong>
                  </div>

                  {rev.comment && (
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", fontStyle: "italic", display: "flex", alignItems: "center", gap: "6px" }}>
                      <MessageSquare size={14} style={{ color: "var(--text-muted)" }} /> "{rev.comment}"
                    </p>
                  )}
                </div>

                <span style={{ fontSize: "12px", color: "var(--text-muted)", backgroundColor: "#f1f5f9", padding: "4px 8px", borderRadius: "6px" }}>
                  Completed Return
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shared Items */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-main)" }}>
            My Shared Items ({myItems.length})
          </h3>
          <Link to="/list-item" style={{ fontSize: "14px", color: "var(--primary-color)", fontWeight: 600, textDecoration: "none" }}>
            + Add New Listing
          </Link>
        </div>

        {myItems.length === 0 ? (
          <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "12px", border: "1px solid var(--border-color)", textAlign: "center" }}>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "12px" }}>You haven't listed any items yet.</p>
            <Link to="/list-item" style={{ backgroundColor: "var(--primary-color)", color: "#fff", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>
              List Your First Item
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {myItems.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "14px",
                  border: "1px solid var(--border-color)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "160px", objectFit: "contain", backgroundColor: "#f8fafc" }} />
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--primary-color)", backgroundColor: "#ccfbf1", padding: "3px 8px", borderRadius: "6px" }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: item.availability === "Available" ? "#059669" : "#d97706" }}>
                      ● {item.availability}
                    </span>
                  </div>

                  <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "6px" }}>{item.name}</h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>{item.description}</p>

                  <div style={{ marginTop: "auto", display: "flex", gap: "8px", paddingTop: "12px", borderTop: "1px solid var(--border-color)" }}>


                    <button
                      onClick={() => handleDelete(item)}
                      style={{
                        backgroundColor: "#fee2e2",
                        color: "#991b1b",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px"
                      }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedItemForDeletion && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              width: "100%",
              maxWidth: "440px",
              padding: "24px",
              borderRadius: "14px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)"
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#991b1b",
                marginBottom: "8px"
              }}
            >
              Delete {selectedItemForDeletion.name}?
            </h3>

            <p
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                marginBottom: "18px"
              }}
            >
              Explain why you are deleting this listing. Borrowers
              with existing requests will be able to see your reason.
            </p>

            <textarea
              value={deletionReason}
              onChange={(e) => setDeletionReason(e.target.value)}
              placeholder="Enter the reason for deletion..."
              rows={4}
              maxLength={2000}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                resize: "vertical",
                fontSize: "14px",
                marginBottom: "8px"
              }}
            />

            <p
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                marginBottom: "18px"
              }}
            >
              {deletionReason.length}/2000 characters
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px"
              }}
            >
              <button
                onClick={() => {
                  setSelectedItemForDeletion(null);
                  setDeletionReason("");
                  setMessage("");
                }}
                disabled={isDeleting}
                style={{
                  padding: "9px 14px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "7px",
                  backgroundColor: "#ffffff",
                  cursor: isDeleting ? "not-allowed" : "pointer"
                }}
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={isDeleting || !deletionReason.trim()}
                style={{
                  padding: "9px 14px",
                  border: "none",
                  borderRadius: "7px",
                  backgroundColor:
                    isDeleting || !deletionReason.trim()
                      ? "#fca5a5"
                      : "#dc2626",
                  color: "#ffffff",
                  fontWeight: 600,
                  cursor:
                    isDeleting || !deletionReason.trim()
                      ? "not-allowed"
                      : "pointer"
                }}
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}