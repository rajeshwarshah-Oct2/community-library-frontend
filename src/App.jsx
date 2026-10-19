import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BrowsePage from "./pages/BrowsePage";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import ListAnItemPage from "./pages/ListAnItemPage";
import MyListingsPage from "./pages/MyListingsPage";
import MyBorrowingsPage from "./pages/MyBorrowingsPage";
import Layout from "./components/Layout";
import { apiGetLoggedInUser } from "./services/api";

// Protect pages that require login
function ProtectedRoute({ children }) {
  const user = apiGetLoggedInUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Prevent logged-in users from seeing login/register again
function PublicRoute({ children }) {
  const user = apiGetLoggedInUser();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// NEW: Backend startup screen
function BackendStartup({ children }) {
  const [status, setStatus] = useState("loading");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function startBackend() {
      setStatus("loading");

      try {
        const response = await fetch(
          "https://community-library-backend.onrender.com/api/items",
          {
            signal: controller.signal,
            cache: "no-store"
          }
        );

        if (!response.ok) {
          throw new Error("Backend unavailable");
        }

        setStatus("ready");
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Backend startup failed:", error);
          setStatus("error");
        }
      }
    }

    startBackend();

    return () => controller.abort();
  }, [retryCount]);

  if (status === "ready") {
    return children;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: "#f8fafc",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        textAlign: "center"
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          border: "6px solid #d1fae5",
          borderTop: "6px solid #0d9488",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "25px"
        }}
      />

      <h2 style={{ color: "#0f172a", marginBottom: "10px" }}>
        Starting Community Library
      </h2>

      <p style={{ color: "#64748b", maxWidth: "350px" }}>
        {status === "loading"
          ? "Connecting to our server. Please wait..."
          : "Unable to connect to the server. Please try again."}
      </p>

      {status === "error" && (
        <button
          onClick={() => setRetryCount((count) => count + 1)}
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            background: "#0d9488",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Retry Connection
        </button>
      )}

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <BackendStartup>
        <Routes>
          {/* Login and Register */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Protected application pages */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/browse"
            element={
              <ProtectedRoute>
                <Layout>
                  <BrowsePage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/item/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <ItemDetailsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/list-item"
            element={
              <ProtectedRoute>
                <Layout>
                  <ListAnItemPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-listings"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyListingsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-borrowings"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyBorrowingsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Unknown URLs */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BackendStartup>
    </BrowserRouter>
  );
}