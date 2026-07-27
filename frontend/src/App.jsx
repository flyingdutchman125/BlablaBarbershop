import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Auth/Login";
import Home from "./pages/Customer/Home";
import Booking from "./pages/Customer/Booking";
import Ticket from "./pages/Customer/Ticket";
import Terms from "./pages/Customer/Terms";
import Privacy from "./pages/Customer/Privacy";
import POSDashboard from "./pages/Cashier/POSDashboard";
import AdminDashboard from "./pages/Admin/Dashboard";
import KapsterManagement from "./pages/Admin/KapsterManagement";
import ServiceManagement from "./pages/Admin/ServiceManagement";
import ReferralPromo from "./pages/Admin/ReferralPromo";
import ReservationFinance from "./pages/Admin/ReservationFinance";
import MemberManagement from "./pages/Admin/MemberManagement";

function App() {
  const loginPath = import.meta.env.VITE_SECRET_LOGIN_PATH || "xL9pQ2m";
  const adminPath = import.meta.env.VITE_SECRET_ADMIN_PATH || "aB3dE9x";
  const cashierPath = import.meta.env.VITE_SECRET_CASHIER_PATH || "vY7tR4nL";
  const kapstersPath = import.meta.env.VITE_SECRET_KAPSTERS_PATH || "kP8sT3r";
  const servicesPath = import.meta.env.VITE_SECRET_SERVICES_PATH || "sR7vC2s";
  const membersPath = import.meta.env.VITE_SECRET_MEMBERS_PATH || "mM5bR9s";
  const reservationsPath =
    import.meta.env.VITE_SECRET_RESERVATIONS_PATH || "rS4vT1n";
  const referralPath = import.meta.env.VITE_SECRET_REFERRAL_PATH || "rF2rL8o";

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path={`/${loginPath}`} element={<Login />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/ticket/:ticketId" element={<Ticket />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Kasir Routes - Hanya role 'cashier' dan 'admin' */}
          <Route
            element={<ProtectedRoute allowedRoles={["cashier", "admin"]} />}
          >
            <Route path={`/${cashierPath}`} element={<POSDashboard />} />
          </Route>

          {/* Admin Routes - Hanya role 'admin' */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path={`/${adminPath}`} element={<AdminDashboard />} />
            <Route
              path={`/${adminPath}/${kapstersPath}`}
              element={<KapsterManagement />}
            />
            <Route
              path={`/${adminPath}/${servicesPath}`}
              element={<ServiceManagement />}
            />
            <Route
              path={`/${adminPath}/${referralPath}`}
              element={<ReferralPromo />}
            />
            <Route
              path={`/${adminPath}/${reservationsPath}`}
              element={<ReservationFinance />}
            />
            <Route
              path={`/${adminPath}/${membersPath}`}
              element={<MemberManagement />}
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
