import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  TrendingUp,
  Users,
  Calendar,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";
import axios from "axios";

export default function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [kpi, setKpi] = useState({
    revenue: 0,
    customers: 0,
    activeReservations: 0,
  });

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("barbershop_token");
        const res = await axios.get(
          `http://${window.location.hostname}:5000/api/reservations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = res.data;
        // setReservations(data); // Don't set all reservations, we'll filter them first
        // Calculate KPIs
        const today = new Date().toISOString().split("T")[0];

        let todayRevenue = 0;
        let todayCustomers = new Set();
        let activeRes = 0;
        let todayList = [];

        data.forEach((r) => {
          // Determine the effective date for reporting
          // If transaction_date exists (means it was paid), use it. Otherwise use booking_date.
          const effectiveDate = r.transaction_date
            ? r.transaction_date
            : r.booking_date;

          // Check if effective date is today using local timezone
          const localDateStr = new Date(effectiveDate).toLocaleDateString(
            "sv-SE",
          ); // YYYY-MM-DD
          const isToday =
            (effectiveDate && effectiveDate.toString().startsWith(today)) ||
            localDateStr === today;

          if (isToday) {
            todayList.push(r);
            if (r.customer_id) {
              todayCustomers.add(`cust_${r.customer_id}`);
            } else if (r.ticket_code && r.ticket_code.startsWith("WLK-")) {
              const queueMatch = r.ticket_code.match(/^WLK-(\d+)-/);
              if (queueMatch) {
                todayCustomers.add(`queue_${queueMatch[1]}`);
              } else {
                // Legacy walk-in without queue number
                todayCustomers.add(`wlk_${r.ticket_code}`);
              }
            }
            if (r.status === "completed") {
              todayRevenue += parseFloat(r.price); // Assumes base price was paid
            }
            if (r.status === "pending" || r.status === "checked_in") {
              activeRes++;
            }
          }
        });

        setReservations(todayList);

        setKpi({
          revenue: todayRevenue,
          customers: todayCustomers.size,
          activeReservations: activeRes,
        });
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };
    fetchReservations();
  }, []);

  const handleSendWA = (phone, name, kapster, time) => {
    const message = encodeURIComponent(
      `Halo Kak ${name}, mengingatkan jadwal potong rambut di Barbershop kami pada ${time} bersama ${kapster}. Terima kasih!`,
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Ringkasan Bisnis</h1>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-barber-darkgray text-white font-medium rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors flex items-center print:hidden"
          >
            <ArrowUpRight className="w-4 h-4 mr-2" /> Cetak Laporan (PDF)
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-barber-darkgray p-6 rounded-2xl border border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Pendapatan Hari Ini</p>
              <h3 className="text-2xl font-bold font-display text-white">
                Rp {kpi.revenue.toLocaleString("id-ID")}
              </h3>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-barber-darkgray p-6 rounded-2xl border border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Pelanggan Hari Ini</p>
              <h3 className="text-2xl font-bold font-display text-white">
                {kpi.customers}
              </h3>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-barber-darkgray p-6 rounded-2xl border border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">
                Reservasi Aktif (Hari Ini)
              </p>
              <h3 className="text-2xl font-bold font-display text-white">
                {kpi.activeReservations}
              </h3>
            </div>
            <div className="w-12 h-12 bg-barber-gold/20 rounded-full flex items-center justify-center text-barber-gold">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="bg-barber-darkgray rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-bold font-display">
              Reservasi Hari Ini
            </h2>
            <button className="text-sm text-barber-gold hover:underline flex items-center">
              Lihat Semua <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-barber-black text-gray-400 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">ID Tiket</th>
                  <th className="px-6 py-4 font-medium">Pelanggan</th>
                  <th className="px-6 py-4 font-medium">Kapster</th>
                  <th className="px-6 py-4 font-medium">Waktu</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {reservations.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Belum ada reservasi
                    </td>
                  </tr>
                ) : (
                  reservations.slice(0, 10).map((res) => (
                    <tr
                      key={res.id}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-barber-gold">
                        {res.ticket_code}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">
                          {res.customer_name}
                        </p>
                        <p className="text-xs text-gray-500">{res.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {res.kapster_name}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {res.booking_time}
                      </td>
                      <td className="px-6 py-4">
                        {res.status === "pending" && (
                          <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-medium border border-yellow-500/20">
                            Pending
                          </span>
                        )}
                        {res.status === "checked_in" && (
                          <span className="bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20">
                            Checked In
                          </span>
                        )}
                        {res.status === "completed" && (
                          <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs font-medium border border-green-500/20">
                            Selesai
                          </span>
                        )}
                        {res.status === "cancelled" && (
                          <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-xs font-medium border border-red-500/20">
                            Dibatalkan
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            handleSendWA(
                              res.phone,
                              res.customer_name,
                              res.kapster_name,
                              res.booking_time,
                            )
                          }
                          className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-colors flex items-center justify-center ml-auto"
                          title="Kirim Pesan WhatsApp"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
