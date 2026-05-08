import { Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ProfilePage from "@/pages/profile/AccountPage";

import ProtectedRoute from "@/routes/ProtectedRoute";
import HomePage from "@/pages/HomePage";
import TopupPage from "@/pages/TopupPage";
import TransactionHistory from "@/pages/TransactionHistoryPage";
import PaymentPage from "@/pages/PaymentPage";
import AccountPage from "@/pages/profile/AccountPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/topup"
        element={
          <ProtectedRoute>
            <TopupPage />
          </ProtectedRoute>
        }
      />

      <Route path="/payment" element={<Navigate to="/" />} />
      <Route
        path="/payment/:serviceCode"
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/transaction"
        element={
          <ProtectedRoute>
            <TransactionHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
