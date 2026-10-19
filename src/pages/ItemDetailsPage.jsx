import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, ShieldCheck, User, Clock, CheckCircle } from "lucide-react";
import { apiGetItems, apiCreateRequest, apiGetLoggedInUser } from "../services/api";

export default function ItemDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = apiGetLoggedInUser();

    const [item, setItem] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadItem = async () => {
            const items = await apiGetItems();
            const found = items.find((i) => i.id === id);
            setItem(found);
        };
        loadItem();
    }, [id]);

    if (!item) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <p>Loading item details or item not found...</p>
                <Link to="/browse" style={{ color: "var(--primary-color)", fontWeight: 600, marginTop: "10px", display: "inline-block" }}>
                    Back to Browse
                </Link>
            </div>
        );
    }

    // Calculates max selectable date: Start Date + item.maxDays
    const getMaxReturnDate = () => {
        if (!startDate) return "";
        const date = new Date(startDate);
        date.setDate(date.getDate() + item.maxDays);
        return date.toISOString().split("T")[0];
    };

    const handleBorrowRequest = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!startDate || !endDate) {
            setError("Please select both start and end dates.");
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            setError("Expected return date cannot be earlier than the start date.");
            return;
        }

        const requestData = {
            itemId: item.id,
            itemName: item.name,
            itemImage: item.imageUrl,
            borrowerId: user ? user.id : "user-1",
            borrowerName: user ? user.name : "Rahul Sharma",
            ownerId: item.ownerId,
            ownerName: item.ownerName,
            startDate,
            endDate
        };

        const res = await apiCreateRequest(requestData);
        if (res.success) {
            setSuccessMessage("Borrow request submitted successfully! The owner will review it soon.");
            setTimeout(() => {
                navigate("/my-borrowings");
            }, 2000);
        } else {
            setError("Failed to submit request. Please try again.");
        }
    };

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            {/* Back button */}
            <Link
                to="/browse"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                    marginBottom: "20px"
                }}
            >
                <ArrowLeft size={16} /> Back to Browse Items
            </Link>

            {successMessage && (
                <div style={{
                    backgroundColor: "#d1fae5",
                    color: "#065f46",
                    padding: "14px 18px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: 500,
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    <CheckCircle size={18} /> {successMessage}
                </div>
            )}

            {error && (
                <div style={{
                    backgroundColor: "#fee2e2",
                    color: "#991b1b",
                    padding: "14px 18px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: 500,
                    marginBottom: "20px"
                }}>
                    {error}
                </div>
            )}

            <div style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid var(--border-color)",
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "0"
            }}>
                {/* Item Image */}
                <div style={{ backgroundColor: "#f8fafc", position: "relative" }}>
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ width: "100%", height: "100%", minHeight: "320px", objectFit: "cover" }}
                    />
                </div>

                {/* Item Details Info */}
                <div style={{ padding: "30px", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--primary-color)", backgroundColor: "#ccfbf1", padding: "4px 10px", borderRadius: "6px" }}>
                            {item.category}
                        </span>
                        <span style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: item.availability === "Available" ? "#059669" : "#d97706",
                            backgroundColor: item.availability === "Available" ? "#d1fae5" : "#fef3c7",
                            padding: "4px 10px",
                            borderRadius: "20px"
                        }}>
                            ● {item.availability}
                        </span>
                    </div>

                    <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "var(--text-main)", marginBottom: "10px" }}>
                        {item.name}
                    </h1>

                    <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "20px" }}>
                        {item.description}
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px", padding: "16px", backgroundColor: "#f8fafc", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-main)" }}>
                            <User size={16} style={{ color: "var(--text-muted)" }} />
                            <strong>Owner:</strong> {item.ownerName}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-main)" }}>
                            <MapPin size={16} style={{ color: "var(--text-muted)" }} />
                            <strong>Building / Block:</strong> {item.building}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-main)" }}>
                            <ShieldCheck size={16} style={{ color: "var(--text-muted)" }} />
                            <strong>Condition:</strong> {item.condition}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-main)" }}>
                            <Clock size={16} style={{ color: "var(--text-muted)" }} />
                            <strong>Max Borrow Duration:</strong> Up to {item.maxDays} days
                        </div>
                    </div>

                    {/* Borrow Request Form */}
                    {item.availability === "Available" ? (
                        <form onSubmit={handleBorrowRequest} style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "auto" }}>
                            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-main)" }}>Request to Borrow</h3>

                            <div style={{ display: "flex", gap: "12px" }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: "block", fontSize: "12px", fontWeight: 500, marginBottom: "4px" }}>Start Date</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        min={new Date().toISOString().split("T")[0]} // Prevents picking past dates
                                        onChange={(e) => {
                                            setStartDate(e.target.value);
                                            setEndDate(""); // Reset return date when start date changes
                                        }}
                                        style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "13px", outline: "none" }}
                                    />
                                </div>

                                <div style={{ flex: 1 }}>
                                    <label style={{ display: "block", fontSize: "12px", fontWeight: 500, marginBottom: "4px" }}>Expected Return</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        disabled={!startDate} // Disabled until Start Date is chosen
                                        min={startDate} // Prevents picking a date earlier than Start Date
                                        max={getMaxReturnDate()} // Dynamically locks calendar past max borrowing days
                                        onChange={(e) => setEndDate(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "8px 10px",
                                            borderRadius: "8px",
                                            border: "1px solid var(--border-color)",
                                            fontSize: "13px",
                                            outline: "none",
                                            backgroundColor: !startDate ? "#f1f5f9" : "#ffffff"
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    backgroundColor: "var(--primary-color)",
                                    color: "#ffffff",
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "12px",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    marginTop: "6px"
                                }}
                            >
                                Submit Borrow Request
                            </button>
                        </form>
                    ) : (
                        <div style={{ padding: "14px", backgroundColor: "#fef3c7", color: "#b45309", borderRadius: "8px", fontSize: "14px", fontWeight: 500, textAlign: "center", marginTop: "auto" }}>
                            This item is currently borrowed and unavailable.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}