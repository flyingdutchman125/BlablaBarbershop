import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Scissors } from "lucide-react";
import axios from "axios";
import logoImg from "/src/BLABLA_BAREBER.png";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/login`,
        { phone, password },
      );

      const user = response.data.user;
      login(user, response.data.token);

      const adminPath = import.meta.env.VITE_SECRET_ADMIN_PATH || "aB3dE9x";
      const cashierPath =
        import.meta.env.VITE_SECRET_CASHIER_PATH || "vY7tR4nL";

      // Redirect berdasarkan role
      if (user.role === "admin") navigate(`/${adminPath}`);
      else if (user.role === "cashier") navigate(`/${cashierPath}`);
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat login");
    }
  };

  return (
    <div className="min-h-screen bg-barber-black flex items-center justify-center p-4">
      <div className="bg-barber-darkgray p-8 rounded-2xl border border-gray-800 shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img
            src={logoImg}
            alt="Blabla Barber"
            className="w-16 h-16 object-contain rounded-full border border-barber-gold bg-barber-gold mb-4"
          />
          <h2 className="text-2xl font-display font-bold text-white">
            Login Sistem
          </h2>
          <p className="text-gray-400 text-sm mt-1">Masukkan kredensial Anda</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Nomor Telepon
            </label>
            <input
              type="text"
              className="w-full bg-barber-black border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-barber-gold"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Contoh: 08xxxxxxxx"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full bg-barber-black border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-barber-gold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-barber-gold text-black font-bold rounded-xl hover:bg-barber-gold-light transition-colors shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
