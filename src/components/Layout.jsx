import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  PlusCircle,
  List,
  BookmarkCheck,
  LogOut,
  Menu,
  X,
  Wrench
} from "lucide-react";
import { apiLogout, apiGetLoggedInUser } from "../services/api";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = apiGetLoggedInUser();

  const handleLogout = () => {
    apiLogout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Browse Items", path: "/browse", icon: Package },
    { name: "List an Item", path: "/list-item", icon: PlusCircle },
    { name: "My Listings", path: "/my-listings", icon: List },
    { name: "My Borrowings", path: "/my-borrowings", icon: BookmarkCheck },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-color)" }}>
      {/* Mobile Menu Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 40,
            display: "block"
          }}
          className="md-hidden"
        />
      )}

      {/* Sidebar for Desktop & Mobile */}
      <aside style={{
        width: "260px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid var(--border-color)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        bottom: 0,
        left: sidebarOpen ? 0 : "-260px",
        zIndex: 50,
        transition: "left 0.3s ease-in-out"
      }}
        className="md-sidebar"
      >
        {/* App Logo / Header */}
        <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid var(--border-color)" }}>
          <div style={{ backgroundColor: "#ccfbf1", padding: "10px", borderRadius: "10px", color: "var(--primary-color)" }}>
            <Wrench size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "var(--text-main)" }}>Community Library</h2>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Tool & Equipment Sharing</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: "20px 12px", flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  backgroundColor: isActive ? "#f0fdf4" : "transparent",
                  color: isActive ? "var(--primary-color)" : "var(--text-main)",
                }}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div style={{ padding: "16px", borderTop: "1px solid var(--border-color)", backgroundColor: "#f8fafc" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-main)" }}>{user ? user.name : "Guest User"}</div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "10px" }}>{user ? user.building : "Block A"}</div>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "8px",
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: "0" }} className="main-content-area">
        {/* Top Navbar */}
        <header style={{
          height: "70px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 30
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-main)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-main)" }}>
              {navItems.find((i) => i.path === location.pathname)?.name || "Dashboard"}
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-muted)" }}>
              Hello, {user ? user.name.split(" ")[0] : "User"}
            </span>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-color)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: "14px"
            }}>
              {user ? user.name.charAt(0) : "U"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: "30px", flex: 1, maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}