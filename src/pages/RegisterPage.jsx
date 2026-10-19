import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wrench, UserPlus } from "lucide-react";
import { apiRegister } from "../services/api";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [building, setBuilding] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (!name || !email || !password || !confirmPassword || !building) {
            setError("Please fill in all required fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const res = await apiRegister({ name, email, password, building });
        if (res.success) {
            navigate("/");
        } else {
            setError(res.message);
        }
    };

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            backgroundColor: "var(--bg-color)",
            padding: "20px"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "420px",
                backgroundColor: "#ffffff",
                padding: "40px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                border: "1px solid var(--border-color)"
            }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
                    <div style={{ backgroundColor: "#ccfbf1", padding: "12px", borderRadius: "14px", color: "var(--primary-color)", marginBottom: "10px" }}>
                        <Wrench size={30} />
                    </div>
                    <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "var(--text-main)" }}>Create Account</h1>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Join your community tool library</p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: "#fee2e2",
                        color: "#991b1b",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        marginBottom: "16px"
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "4px" }}>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Alex Johnson"
                            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "14px", outline: "none" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "4px" }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. alex@college.edu"
                            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "14px", outline: "none" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "4px" }}>Building / Block</label>
                        <input
                            type="text"
                            value={building}
                            onChange={(e) => setBuilding(e.target.value)}
                            placeholder="e.g. Block C - 205"
                            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "14px", outline: "none" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "4px" }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "14px", outline: "none" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "4px" }}>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "14px", outline: "none" }}
                        />
                    </div>

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
                            marginTop: "6px"
                        }}
                    >
                        <UserPlus size={18} /> Register Account
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "18px", fontSize: "14px", color: "var(--text-muted)" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "var(--primary-color)", fontWeight: 600, textDecoration: "none" }}>
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}