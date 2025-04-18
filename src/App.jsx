import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ForgotPasswordPage from "./pages/ForgotPassword";
import RegisterPage from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import OTPPage from "./pages/OTPPage";
import CreateAlertPage from "./pages/CreateAlert";
import ManageProfilePage from "./pages/ManageProfile";
import ManagePillsPage from "./pages/ManagePills";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPasswordPage from "./pages/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/phone-otp" element={<OTPPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />{" "}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-alert" element={<CreateAlertPage />} />
          <Route path="/profile" element={<ManageProfilePage />} />
          <Route path="/pills" element={<ManagePillsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
