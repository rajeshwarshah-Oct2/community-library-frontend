
import React from "react";
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

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
