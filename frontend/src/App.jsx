import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import { useAuthStore } from "./stores/authStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";

// LoadingSpinner
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

const RedirectAuthenticated = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-blue-500"
        size="w-64 h-64"
        top="-5%"
        left="-10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="-10%"
        delay={6}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-64"
        top="40%"
        left="-10%"
        delay={3}
      />

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticated>
              <Signup />
            </RedirectAuthenticated>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticated>
              <Login />
            </RedirectAuthenticated>
          }
        />
        <Route
          path="/verify-email"
          element={
            <RedirectAuthenticated>
              <EmailVerificationPage />
            </RedirectAuthenticated>
          }
        />
        <Route
          path="/forget"
          element={
            <RedirectAuthenticated>
              <ForgetPassword />
            </RedirectAuthenticated>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticated>
              <ResetPassword />
            </RedirectAuthenticated>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}
