import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Monitor, FileText, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logoImg from "/src/BLABLA_BAREBER.png";

export default function POSLayout({ children }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const cashierPath = import.meta.env.VITE_SECRET_CASHIER_PATH || "vY7tR4nL";
  const adminPath = import.meta.env.VITE_SECRET_ADMIN_PATH || "aB3dE9x";

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    const loginPath = import.meta.env.VITE_SECRET_LOGIN_PATH || "xL9pQ2m";
    navigate(`/${loginPath}`);
  };

  return (
    <div className="flex h-screen bg-barber-black text-white font-sans overflow-hidden print:h-auto print:overflow-visible print:bg-white print:text-black">
      {/* Sidebar - minimized for POS to maximize workspace */}
      <div className="w-20 bg-barber-darkgray flex flex-col items-center py-6 border-r border-gray-800 print:hidden z-20">
        <img
          src={logoImg}
          alt="Logo"
          className="w-12 h-12 object-contain mb-8 rounded-full border border-barber-gold p-1 bg-barber-black"
        />

        <div className="flex-1 flex flex-col space-y-4 w-full px-4">
          <Link
            to={`/${cashierPath}`}
            className={`p-3 rounded-xl transition-colors flex justify-center ${location.pathname === `/${cashierPath}` ? "bg-barber-gold/20 text-barber-gold" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
            title="Kasir POS"
          >
            <Monitor className="w-6 h-6" />
          </Link>
          {user?.role === "admin" && (
            <Link
              to={`/${adminPath}`}
              className="p-3 text-gray-400 rounded-xl hover:bg-gray-800 hover:text-white transition-colors flex justify-center"
              title="Admin Dashboard"
            >
              <FileText className="w-6 h-6" />
            </Link>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="p-3 text-red-400 hover:bg-red-500/20 rounded-xl mt-4 transition-colors"
          title="Logout"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-hidden relative print:overflow-visible print:h-auto">
        {children}
      </main>
    </div>
  );
}
