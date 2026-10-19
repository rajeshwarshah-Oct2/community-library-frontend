import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wrench, LogIn } from "lucide-react";
import { apiLogin } from "../services/api";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        const res = await apiLogin(email, password);
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
                maxWidth: "400px",
                backgroundColor: "#ffffff",
                padding: "40px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                border: "1px solid var(--border-color)"
            }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px" }}>
                    <div style={{ backgroundColor: "#ccfbf1", padding: "12px", borderRadius: "14px", color: "var(--primary-color)", marginBottom: "12px" }}>
                        <Wrench size={32} />
                    </div>
                    <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "var(--text-main)" }}>Welcome Back</h1>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Sign in to Community Tool Library</p>
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

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px" }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Your Email Address"
                            style={{
                                width: "100%",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "1px solid var(--border-color)",
                                fontSize: "14px",
                                outline: "none"
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px" }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{
                                width: "100%",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "1px solid var(--border-color)",
                                fontSize: "14px",
                                outline: "none"
                            }}
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
                            marginTop: "8px"
                        }}
                    >
                        <LogIn size={18} /> Sign In
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "var(--text-muted)" }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: "var(--primary-color)", fontWeight: 600, textDecoration: "none" }}>
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}