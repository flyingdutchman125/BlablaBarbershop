import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  Calendar as CalendarIcon,
  DollarSign,
  Search,
  Filter,
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ReservationFinance() {
  const [reservations, setReservations] = useState([]);
  const [filterMode, setFilterMode] = useState("daily"); // 'daily' or 'monthly'
  const [dateFilter, setDateFilter] = useState(
    new Date().toISOString().split("T")[0],
  );

  // Create a proper local YYYY-MM string for the default month filter
  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const [monthFilter, setMonthFilter] = useState(defaultMonth);

  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: "",
    expense_date: new Date().toISOString().split("T")[0],
  });

  // Derived state
  const filteredReservations = reservations.filter((r) => {
    const effectiveDate = r.transaction_date
      ? r.transaction_date
      : r.booking_date;
    const localDateStr = new Date(effectiveDate).toLocaleDateString("sv-SE"); // YYYY-MM-DD

    if (filterMode === "daily") {
      return (
        (effectiveDate && effectiveDate.toString().startsWith(dateFilter)) ||
        localDateStr === dateFilter
      );
    } else {
      // Monthly mode: match YYYY-MM
      return localDateStr.startsWith(monthFilter);
    }
  });

  const totalRevenue = filteredReservations
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + (parseFloat(r.price) || 0), 0);

  const totalQRIS = filteredReservations
    .filter((r) => r.status === "completed" && r.payment_method === "qris")
    .reduce((sum, r) => sum + (parseFloat(r.price) || 0), 0);

  const totalTunai = filteredReservations
    .filter((r) => r.status === "completed" && r.payment_method === "cash")
    .reduce((sum, r) => sum + (parseFloat(r.price) || 0), 0);

  const filteredExpenses = expenses.filter((e) => {
    const localDateStr = new Date(e.expense_date).toLocaleDateString("sv-SE"); // YYYY-MM-DD
    if (filterMode === "daily") {
      return (
        localDateStr === dateFilter || e.expense_date.startsWith(dateFilter)
      );
    } else {
      return (
        localDateStr.startsWith(monthFilter) ||
        e.expense_date.startsWith(monthFilter)
      );
    }
  });

  const totalExpenses = filteredExpenses.reduce(
    (sum, e) => sum + parseFloat(e.amount),
    0,
  );
  const netProfit = totalRevenue - totalExpenses;

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("barbershop_token");
      const [resData, expData] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/reservations`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setReservations(resData.data);
      setExpenses(expData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    const result = await Swal.fire({
      title: "Ubah Status?",
      text: `Yakin ingin mengubah status menjadi ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d4af37",
      cancelButtonColor: "#374151",
      confirmButtonText: "Ya, Ubah",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("barbershop_token");
      await axios.patch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/reservations/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      Swal.fire({
        title: "Sukses",
        text: "Status berhasil diubah",
        icon: "success",
        confirmButtonColor: "#d4af37",
      });
      // Refresh
      fetchReservations();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Gagal mengubah status",
        icon: "error",
        confirmButtonColor: "#d4af37",
      });
      console.error(error);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("barbershop_token");
      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/expenses`,
        expenseForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      Swal.fire({
        title: "Sukses",
        text: "Pengeluaran berhasil dicatat",
        icon: "success",
        confirmButtonColor: "#d4af37",
      });
      setShowExpenseModal(false);
      setExpenseForm({ description: "", amount: "", expense_date: dateFilter });
      fetchReservations();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Gagal mencatat pengeluaran",
        icon: "error",
        confirmButtonColor: "#d4af37",
      });
    }
  };

  const handleDeleteExpense = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Pengeluaran?",
      text: "Data yang dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#374151",
      confirmButtonText: "Ya, Hapus",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("barbershop_token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/expenses/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      Swal.fire({
        title: "Terhapus",
        text: "Pengeluaran telah dihapus",
        icon: "success",
        confirmButtonColor: "#d4af37",
      });
      fetchReservations();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Gagal menghapus",
        icon: "error",
        confirmButtonColor: "#d4af37",
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-medium">
            Menunggu
          </span>
        );
      case "checked_in":
        return (
          <span className="bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full text-xs font-medium">
            Checked-in
          </span>
        );
      case "completed":
        return (
          <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs font-medium">
            Selesai
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-xs font-medium">
            Batal
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">
            Laporan & Keuangan
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowExpenseModal(true)}
              className="px-4 py-2 bg-red-600/90 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center print:hidden"
            >
              + Input Pengeluaran
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-barber-darkgray text-white font-medium rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors flex items-center print:hidden"
            >
              Cetak Laporan
            </button>
          </div>
        </div>

        {/* Filters and KPI */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Controls */}
          <div className="bg-barber-darkgray p-6 rounded-2xl border border-gray-800 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm flex items-center">
                <Filter className="w-4 h-4 mr-2" /> Filter
              </h3>

              <div className="flex bg-barber-black rounded-lg p-1 border border-gray-700">
                <button
                  onClick={() => setFilterMode("daily")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filterMode === "daily" ? "bg-barber-gold text-black" : "text-gray-400 hover:text-white"}`}
                >
                  Harian
                </button>
                <button
                  onClick={() => setFilterMode("monthly")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filterMode === "monthly" ? "bg-barber-gold text-black" : "text-gray-400 hover:text-white"}`}
                >
                  Bulanan
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <CalendarIcon className="w-5 h-5 text-gray-400 mr-3" />
              {filterMode === "daily" ? (
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-barber-black border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-barber-gold w-full"
                />
              ) : (
                <input
                  type="month"
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="bg-barber-black border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-barber-gold w-full"
                />
              )}
            </div>
          </div>

          {/* Revenue KPI */}
          <div className="bg-barber-darkgray p-6 rounded-2xl border border-gray-800 flex items-center justify-between lg:col-span-1">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Pemasukan</p>
              <h3 className="text-2xl font-bold font-display text-green-400 mb-2">
                Rp {totalRevenue.toLocaleString("id-ID")}
              </h3>
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-gray-400">QRIS: <span className="text-white font-medium">Rp {totalQRIS.toLocaleString("id-ID")}</span></span>
                <span className="text-xs text-gray-400">Tunai: <span className="text-white font-medium">Rp {totalTunai.toLocaleString("id-ID")}</span></span>
              </div>
            </div>
          </div>

          {/* Expense KPI */}
          <div className="bg-barber-darkgray p-6 rounded-2xl border border-gray-800 flex items-center justify-between lg:col-span-1">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Pengeluaran</p>
              <h3 className="text-2xl font-bold font-display text-red-400">
                Rp {totalExpenses.toLocaleString("id-ID")}
              </h3>
            </div>
          </div>

          {/* Profit KPI */}
          <div className="bg-barber-darkgray p-6 rounded-2xl border border-gray-800 flex items-center justify-between lg:col-span-1">
            <div>
              <p className="text-gray-400 text-sm mb-1">Keuntungan Bersih</p>
              <h3
                className={`text-3xl font-bold font-display ${netProfit >= 0 ? "text-barber-gold" : "text-red-500"}`}
              >
                Rp {netProfit.toLocaleString("id-ID")}
              </h3>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-barber-darkgray rounded-2xl border border-gray-800 overflow-hidden print:overflow-visible print:border-none print:bg-white">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center print:hidden">
            <h2 className="text-xl font-bold font-display">Daftar Reservasi</h2>
            <span className="text-sm text-gray-400">
              {filteredReservations.length} Transaksi
            </span>
          </div>

          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-barber-black text-gray-400 text-sm border-b border-gray-800">
                  <th className="p-4 font-medium">Tiket</th>
                  <th className="p-4 font-medium">Waktu</th>
                  <th className="p-4 font-medium">Pelanggan</th>
                  <th className="p-4 font-medium">Layanan & Kapster</th>
                  <th className="p-4 font-medium">Harga</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium print:hidden">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      Tidak ada reservasi pada tanggal ini.
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map((res) => (
                    <tr
                      key={res.id}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="p-4 font-medium text-barber-gold">
                        {res.ticket_code}
                      </td>
                      <td className="p-4">
                        <div className="text-white">{res.booking_time}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-white">
                          {res.customer_name}
                        </div>
                        <div className="text-xs text-gray-400">{res.phone}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-white">{res.service_name}</div>
                        <div className="text-xs text-gray-400">
                          {res.kapster_name}
                        </div>
                      </td>
                      <td className="p-4 text-white">
                        Rp {parseInt(res.price).toLocaleString("id-ID")}
                      </td>
                      <td className="p-4">{getStatusBadge(res.status)}</td>
                      <td className="p-4 print:hidden">
                        <select
                          className="bg-barber-black border border-gray-700 text-sm text-white rounded px-2 py-1 focus:outline-none"
                          value={res.status}
                          onChange={(e) =>
                            handleUpdateStatus(res.id, e.target.value)
                          }
                        >
                          <option value="pending">Menunggu</option>
                          <option value="checked_in">Checked-in</option>
                          <option value="completed">Selesai</option>
                          <option value="cancelled">Batal</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-barber-darkgray rounded-2xl border border-gray-800 overflow-hidden print:overflow-visible print:border-none print:bg-white mt-8">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center print:hidden">
            <h2 className="text-xl font-bold font-display text-red-400">
              Catatan Pengeluaran
            </h2>
            <span className="text-sm text-gray-400">
              {filteredExpenses.length} Data
            </span>
          </div>

          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-barber-black text-gray-400 text-sm border-b border-gray-800">
                  <th className="p-4 font-medium">Tanggal</th>
                  <th className="p-4 font-medium">Deskripsi</th>
                  <th className="p-4 font-medium">Nominal</th>
                  <th className="p-4 font-medium print:hidden">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      Tidak ada pengeluaran pada tanggal ini.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp) => (
                    <tr
                      key={exp.id}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="p-4 text-white">
                        {new Date(exp.expense_date).toLocaleDateString("id-ID")}
                      </td>
                      <td className="p-4 font-medium text-white">
                        {exp.description}
                      </td>
                      <td className="p-4 text-red-400 font-bold">
                        Rp {parseFloat(exp.amount).toLocaleString("id-ID")}
                      </td>
                      <td className="p-4 print:hidden">
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                          title="Hapus"
                        >
                          Hapus
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

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 print:hidden">
          <div className="bg-barber-darkgray border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="font-display font-bold text-2xl text-white mb-6">
              Input Pengeluaran
            </h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Tanggal
                </label>
                <input
                  type="date"
                  required
                  className="w-full bg-barber-black border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-barber-gold"
                  value={expenseForm.expense_date}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
                      expense_date: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Deskripsi Pengeluaran
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Beli Pomade, Bayar Listrik"
                  className="w-full bg-barber-black border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-barber-gold"
                  value={expenseForm.description}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Nominal (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="Contoh: 50000"
                  className="w-full bg-barber-black border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-barber-gold"
                  value={expenseForm.amount}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, amount: e.target.value })
                  }
                />
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="flex-1 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
