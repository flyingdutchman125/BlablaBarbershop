import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CustomerLayout from "../../layouts/CustomerLayout";
import {
  Download,
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  User,
  Scissors,
  XCircle,
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import logoImg from "/src/BLABLA_BAREBER.png";

export default function Ticket() {
  const { ticketId } = useParams();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/reservations/ticket/${ticketId}`,
        );
        setTicketData(response.data);
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setLoading(false);
      }
    };
    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  const handleCancelReservation = async () => {
    const result = await Swal.fire({
      title: "Batalkan Reservasi?",
      text: "Anda yakin ingin membatalkan reservasi ini? Tindakan ini tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#4b5563",
      confirmButtonText: "Ya, Batalkan",
      cancelButtonText: "Tutup",
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/reservations/ticket/${ticketId}/cancel`,
        );
        Swal.fire({
          title: "Dibatalkan!",
          text: "Reservasi Anda telah dibatalkan.",
          icon: "success",
          background: "#1a1a1a",
          color: "#fff",
          confirmButtonColor: "#d4af37",
        });
        // Refresh local state to show cancelled status
        setTicketData({ ...ticketData, status: "cancelled" });
      } catch (error) {
        Swal.fire({
          title: "Gagal!",
          text:
            error.response?.data?.message ||
            "Terjadi kesalahan saat membatalkan reservasi.",
          icon: "error",
          background: "#1a1a1a",
          color: "#fff",
          confirmButtonColor: "#d4af37",
        });
      }
    }
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="max-w-md mx-auto px-4 py-12 text-center text-white">
          Memuat tiket...
        </div>
      </CustomerLayout>
    );
  }

  if (!ticketData) {
    return (
      <CustomerLayout>
        <div className="max-w-md mx-auto px-4 py-12 text-center text-red-500">
          Tiket tidak ditemukan.
        </div>
      </CustomerLayout>
    );
  }

  // Format date
  const dateObj = new Date(ticketData.booking_date);
  const formattedDate = dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <CustomerLayout>
      <div className="max-w-md mx-auto px-4 py-12 print:py-0">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-500 mb-4">
            {ticketData.status === "cancelled" ? (
              <XCircle className="w-8 h-8 text-red-500" />
            ) : (
              <CheckCircle className="w-8 h-8" />
            )}
          </div>
          <h2 className="text-2xl font-display font-bold text-white">
            {ticketData.status === "cancelled"
              ? "Reservasi Dibatalkan"
              : "Reservasi Berhasil!"}
          </h2>
          <p className="text-gray-400 mt-2">
            {ticketData.status === "cancelled"
              ? "Tiket ini sudah tidak berlaku."
              : "Tunjukkan tiket ini ke kasir saat Anda tiba."}
          </p>
        </div>

        {/* Boarding Pass Style Ticket */}
        <div className="bg-barber-darkgray rounded-2xl overflow-hidden border border-gray-800 shadow-2xl relative">
          {/* Top section */}
          <div className="bg-gradient-to-r from-barber-gold-dark to-barber-gold p-6 text-black text-center flex flex-col items-center justify-center">
            <img
              src={logoImg}
              alt="Logo"
              className="w-12 h-12 mb-2 object-contain grayscale opacity-80"
            />
            <h3 className="font-display font-bold tracking-widest uppercase">
              BLABLA BARBER
            </h3>
          </div>

          {/* Dashed line */}
          <div className="relative h-0 border-t-2 border-dashed border-gray-700 mx-4">
            <div className="absolute -left-6 -top-3 w-6 h-6 bg-barber-black rounded-full border-r border-gray-800"></div>
            <div className="absolute -right-6 -top-3 w-6 h-6 bg-barber-black rounded-full border-l border-gray-800"></div>
          </div>

          {/* Details */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Kode Tiket
                </p>
                <p className="font-display text-2xl font-bold text-barber-gold">
                  {ticketId || "RES-A1B2C3"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Status
                </p>
                {ticketData.status === "pending" && (
                  <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold">
                    Menunggu
                  </span>
                )}
                {ticketData.status === "completed" && (
                  <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs font-bold">
                    Selesai
                  </span>
                )}
                {ticketData.status === "cancelled" && (
                  <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-xs font-bold">
                    Dibatalkan
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-10 flex justify-center">
                  <User className="text-gray-500 w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Pelanggan</p>
                  <p className="font-medium text-white">
                    {ticketData.customer_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 flex justify-center">
                  <Scissors className="text-gray-500 w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Layanan & Kapster
                  </p>
                  <p className="font-medium text-white">
                    {ticketData.service_name} • {ticketData.kapster_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 flex justify-center">
                  <Calendar className="text-gray-500 w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Tanggal</p>
                  <p className="font-medium text-white">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 flex justify-center">
                  <Clock className="text-gray-500 w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Waktu</p>
                  <p className="font-medium text-white">
                    {ticketData.booking_time}
                  </p>
                </div>
              </div>
            </div>

            {/* Dummy Barcode/QR Code area */}
            <div className="mt-8 pt-8 border-t border-gray-800 text-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketId || "RES-A1B2C3"}&color=ffffff&bgcolor=1e1e1e`}
                alt="QR Code"
                className="mx-auto rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-4">Scan di meja kasir</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col space-y-4">
          {ticketData.status === "pending" && (
            <button
              onClick={() => {
                const adminPhone = "6287781233783";
                const message = encodeURIComponent(
                  `Halo Admin Barbershop!\nSaya telah melakukan reservasi.\n\nKode Tiket Check-in: *${ticketId || "RES-A1B2C3"}*\n\nMohon konfirmasinya ya!`,
                );
                window.open(
                  `https://wa.me/${adminPhone}?text=${message}`,
                  "_blank",
                );
              }}
              className="w-full flex items-center justify-center px-6 py-3 bg-[#25D366] text-white font-bold rounded-lg hover:bg-[#128C7E] transition-colors shadow-lg shadow-green-900/20 print:hidden"
            >
              Kirim Tiket ke WhatsApp Admin
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center px-6 py-3 bg-barber-darkgray text-white font-bold rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors print:hidden"
          >
            <Download className="w-5 h-5 mr-2" /> Unduh Tiket (PDF)
          </button>

          {ticketData.status === "pending" && (
            <button
              onClick={handleCancelReservation}
              className="w-full flex items-center justify-center px-6 py-3 border border-red-500/50 text-red-500 font-bold rounded-lg hover:bg-red-500/10 transition-colors print:hidden"
            >
              Batalkan Reservasi
            </button>
          )}

          <Link
            to="/"
            className="w-full text-center py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors print:hidden"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </CustomerLayout>
  );
}
