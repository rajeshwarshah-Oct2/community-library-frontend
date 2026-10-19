import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Upload, CheckCircle, Image as ImageIcon } from "lucide-react";
import { apiCreateItem, apiUploadImage } from "../services/api";

export default function ListAnItemPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [category, setCategory] = useState("Tools");
    const [condition, setCondition] = useState("Good");
    const [description, setDescription] = useState("");
    const [maxDays, setMaxDays] = useState(5);
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const categories = ["Tools", "Electronics", "Sports", "Kitchen", "Other"];
    const conditions = ["Brand New", "Like New", "Good", "Fair"];

    // Handle local file picking & convert to Base64
    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
            setError("Please select a JPG, PNG, or WEBP image.");
            e.target.value = "";
            return;
        }

        setImageFile(file);
        setImageUrl(URL.createObjectURL(file));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!name || !description || !imageFile) {
            setError("Please fill all required fields and select an image.");
            return;
        }

        try {
            setError("");

            const uploadedImageUrl = await apiUploadImage(imageFile);

            const newItemData = {
                name,
                category,
                condition,
                description,
                maxDays: Number(maxDays),
                imageUrl: uploadedImageUrl
            };
            const res = await apiCreateItem(newItemData);

            if (res.success) {
                setSuccess("Item listed successfully!");
            } else {
                setError(res.message || "Failed to list item.");
            }
        } catch (error) {
            setError(error.message || "Something went wrong.");
        }
        if (res.success) {
            setSuccess("Item listed successfully! Redirecting to Browse Items...");
            setTimeout(() => {
                navigate("/browse");
            }, 1500);
        } else {
            setError("Failed to list item. Please try again.");
        }
    };

    return (
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "var(--text-main)", marginBottom: "6px" }}>
                    List a Tool or Equipment
                </h2>
                <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                    Share your items with community members living in your building or hostel block.
                </p>
            </div>

            {success && (
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
                    <CheckCircle size={18} /> {success}
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

            <form onSubmit={handleSubmit} style={{
                backgroundColor: "#ffffff",
                padding: "30px",
                borderRadius: "16px",
                border: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                gap: "20px"
            }}>
                <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Item Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Electric Hedge Trimmer or Badminton Racket"
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "14px", outline: "none" }}
                    />
                </div>

                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "14px", backgroundColor: "#fff", outline: "none" }}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ flex: 1, minWidth: "200px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Condition</label>
                        <select
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "14px", backgroundColor: "#fff", outline: "none" }}
                        >
                            {conditions.map((cond) => (
                                <option key={cond} value={cond}>{cond}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Description</label>
                    <textarea
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide details about specs, usage instructions, or accessories included..."
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "14px", outline: "none", resize: "vertical" }}
                    />
                </div>

                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Max Borrow Duration (Days)</label>
                        <input
                            type="number"
                            min="1"
                            max="30"
                            value={maxDays}
                            onChange={(e) => setMaxDays(e.target.value)}
                            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "14px", outline: "none" }}
                        />
                    </div>

                    <div style={{ flex: 2, minWidth: "250px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Upload Item Image</label>
                        <label style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            border: "1px dashed var(--primary-color)",
                            backgroundColor: "#f0fdf4",
                            color: "var(--primary-dark)",
                            fontSize: "14px",
                            fontWeight: 500,
                            cursor: "pointer"
                        }}>
                            <Upload size={18} /> Choose Image File
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: "none" }}
                            />
                        </label>
                    </div>
                </div>

                {/* Image Preview */}
                {imageUrl && (
                    <div style={{ marginTop: "4px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Image Preview:</span>
                        <img
                            src={imageUrl}
                            alt="Preview"
                            style={{ width: "160px", height: "120px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--border-color)" }}
                        />
                    </div>
                )}

                <button
                    type="submit"
                    style={{
                        backgroundColor: "var(--primary-color)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "12px",
                        fontSize: "15px",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        marginTop: "10px"
                    }}
                >
                    <PlusCircle size={18} /> Submit Listing
                </button>
            </form>
        </div>
    );
}