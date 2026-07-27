import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Scissors,
  MessageCircle,
  LogOut,
  Calendar,
  Box,
  FileText,
  Gift,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logoImg from "/src/BLABLA_BAREBER.png";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const adminPath = import.meta.env.VITE_SECRET_ADMIN_PATH || "aB3dE9x";
  const kapstersPath = import.meta.env.VITE_SECRET_KAPSTERS_PATH || "kP8sT3r";
  const servicesPath = import.meta.env.VITE_SECRET_SERVICES_PATH || "sR7vC2s";
  const membersPath = import.meta.env.VITE_SECRET_MEMBERS_PATH || "mM5bR9s";
  const reservationsPath =
    import.meta.env.VITE_SECRET_RESERVATIONS_PATH || "rS4vT1n";
  const referralPath = import.meta.env.VITE_SECRET_REFERRAL_PATH || "rF2rL8o";

  const handleLogout = () => {
    localStorage.removeItem("barbershop_token");
    localStorage.removeItem("barbershop_user");
    const loginPath = import.meta.env.VITE_SECRET_LOGIN_PATH || "xL9pQ2m";
    navigate(`/${loginPath}`);
  };

  const getLinkClass = (path) => {
    // Exactly match /admin or partially match others like /admin/kapsters
    const isActive =
      path === `/${adminPath}`
        ? location.pathname === `/${adminPath}`
        : location.pathname.startsWith(path);
    return `flex items-center px-4 py-3 rounded-xl transition-colors ${
      isActive
        ? "bg-barber-gold/20 text-barber-gold font-bold"
        : "text-gray-400 hover:bg-gray-800 hover:text-white font-medium"
    }`;
  };

  return (
    <div className="flex h-screen print:h-auto bg-barber-black text-white font-sans overflow-hidden print:overflow-visible">
      {/* Sidebar */}
      <aside className="w-64 bg-barber-darkgray border-r border-gray-800 flex flex-col hidden md:flex z-20">
        <div className="p-6 border-b border-gray-800 flex justify-center items-center">
          <img src={logoImg} alt="Logo" className="w-12 h-12 grayscale mr-3" />
          <h2 className="text-xl font-bold font-display tracking-wider">
            ADMIN
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link to={`/${adminPath}`} className={getLinkClass(`/${adminPath}`)}>
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          <Link
            to={`/${adminPath}/${kapstersPath}`}
            className={getLinkClass(`/${adminPath}/${kapstersPath}`)}
          >
            <Scissors className="w-5 h-5 mr-3" /> Kapsters
          </Link>
          <Link
            to={`/${adminPath}/${servicesPath}`}
            className={getLinkClass(`/${adminPath}/${servicesPath}`)}
          >
            <Box className="w-5 h-5 mr-3" /> Services
          </Link>
          <Link
            to={`/${adminPath}/${membersPath}`}
            className={getLinkClass(`/${adminPath}/${membersPath}`)}
          >
            <Users className="w-5 h-5 mr-3" /> Members
          </Link>
          <Link
            to={`/${adminPath}/products`}
            className={getLinkClass(`/${adminPath}/products`)}
          >
            <ShoppingBag className="w-5 h-5 mr-3" /> Produk
          </Link>
          <Link
            to={`/${adminPath}/${reservationsPath}`}
            className={getLinkClass(`/${adminPath}/${reservationsPath}`)}
          >
            <FileText className="w-5 h-5 mr-3" /> Laporan
          </Link>
          <Link
            to={`/${adminPath}/${referralPath}`}
            className={getLinkClass(`/${adminPath}/${referralPath}`)}
          >
            <Gift className="w-5 h-5 mr-3" /> Referral Promo
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5 mr-3" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto print:overflow-visible">
        {children}
      </div>
    </div>
  );
}
