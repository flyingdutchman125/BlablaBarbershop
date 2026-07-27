import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Scissors,
  ShoppingBag,
  X,
  Search,
  Phone,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import logoImg from "/src/BLABLA_BAREBER.png";

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/reservations/phone/${phone}`,
      );
      setHistory(res.data);
    } catch (error) {
      console.error(error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const openTicket = (ticketCode) => {
    setIsCartOpen(false);
    navigate(`/ticket/${ticketCode}`);
  };

  const closeCart = () => {
    setIsCartOpen(false);
    // Optional: reset search when closing
    // setPhone('');
    // setHistory([]);
    // setSearched(false);
  };

  return (
    <>
      <nav className="fixed w-full z-40 bg-barber-black/80 backdrop-blur-md border-b border-barber-darkgray print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="Blabla Barber"
                className="w-10 h-10 object-contain rounded-full border border-barber-gold bg-barber-gold"
              />
              <span className="font-display font-semibold text-xl tracking-wider text-white">
                BLABLA <span className="text-barber-gold">BARBER</span>
              </span>
            </Link>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center text-gray-300 hover:text-barber-gold transition-colors"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Keranjang</span>
              </button>
              <Link
                to={`/${import.meta.env.VITE_SECRET_CASHIER_PATH || "vY7tR4nL"}`}
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                POS Kasir
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart / History Slide-over Panel */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden print:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={closeCart}
          ></div>
          <div className="fixed inset-y-0 right-0 max-w-md w-full flex">
            <div className="w-full h-full bg-barber-darkgray shadow-2xl flex flex-col border-l border-gray-800 animate-slide-in-right">
              <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-barber-black">
                <div className="flex items-center">
                  <ShoppingBag className="w-5 h-5 text-barber-gold mr-3" />
                  <h2 className="text-xl font-display font-bold text-white">
                    Riwayat Booking
                  </h2>
                </div>
                <button
                  onClick={closeCart}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                <form onSubmit={handleSearch} className="mb-8">
                  <label className="block text-sm text-gray-400 mb-2">
                    Masukkan Nomor HP Anda
                  </label>
                  <div className="flex">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0812xxxxxx"
                        className="w-full bg-barber-black border border-gray-700 text-white pl-10 pr-4 py-3 rounded-l-xl focus:outline-none focus:border-barber-gold"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-barber-gold text-black px-4 py-3 rounded-r-xl font-bold hover:bg-barber-gold-light transition-colors"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </form>

                {loading && (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-barber-gold border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {!loading && searched && history.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Belum ada riwayat booking untuk nomor ini.</p>
                  </div>
                )}

                {!loading && history.length > 0 && (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="bg-barber-black p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-barber-gold font-bold">
                              {item.ticket_code}
                            </p>
                            <p className="text-sm text-gray-400">
                              {new Date(item.booking_date).toLocaleDateString(
                                "id-ID",
                              )}{" "}
                              • {item.booking_time}
                            </p>
                          </div>
                          <div>
                            {item.status === "pending" && (
                              <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">
                                Menunggu
                              </span>
                            )}
                            {item.status === "checked_in" && (
                              <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded">
                                Checked-in
                              </span>
                            )}
                            {item.status === "completed" && (
                              <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                                Selesai
                              </span>
                            )}
                            {item.status === "cancelled" && (
                              <span className="text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded">
                                Batal
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mb-4">
                          <p className="font-medium text-white">
                            {item.service_name}
                          </p>
                          <p className="text-sm text-gray-400">
                            Kapster: {item.kapster_name}
                          </p>
                        </div>
                        <button
                          onClick={() => openTicket(item.ticket_code)}
                          className="w-full py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex justify-center items-center"
                        >
                          Lihat Tiket <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
