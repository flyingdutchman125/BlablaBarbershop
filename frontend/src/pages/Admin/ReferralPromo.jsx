import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import { Send, Users, Search } from "lucide-react";

export default function ReferralPromo() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("barbershop_token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/customers`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const generateReferralCode = (id) => {
    return `REF-BB-${id.toString().padStart(4, "0")}`;
  };

  const handleSendWA = (phone, name, code) => {
    // Format phone number to international format if starts with 0
    let formattedPhone = phone;
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "62" + formattedPhone.substring(1);
    }

    const message = encodeURIComponent(
      `Halo Kak ${name}! Terima kasih sudah potong rambut di Barbershop kami. Ini ada kode referral khusus untuk Kakak: *${code}*. Sebarkan ke teman-teman ya, nanti Kakak dapat diskon 15% di kunjungan berikutnya!`,
    );
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm),
  );

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">
              Promo & Referral
            </h1>
            <p className="text-gray-400 mt-2">
              Kirim kode referral unik ke pelanggan via WhatsApp secara gratis.
            </p>
          </div>
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-barber-darkgray rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-bold font-display">Daftar Pelanggan</h2>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama atau nomor HP..."
                className="bg-barber-black border border-gray-700 text-white pl-10 pr-4 py-2 rounded-xl focus:border-barber-gold outline-none transition-colors w-64 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-barber-black text-gray-400 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Nama Pelanggan</th>
                  <th className="px-6 py-4 font-medium">Nomor WhatsApp</th>
                  <th className="px-6 py-4 font-medium">Kode Referral</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      Memuat data pelanggan...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      Tidak ada pelanggan ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => {
                    const refCode = generateReferralCode(customer.id);
                    return (
                      <tr
                        key={customer.id}
                        className="hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-white">
                          {customer.name}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {customer.phone}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-barber-gold bg-barber-gold/10 px-3 py-1 rounded-lg border border-barber-gold/20">
                            {refCode}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              handleSendWA(
                                customer.phone,
                                customer.name,
                                refCode,
                              )
                            }
                            className="bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white px-4 py-2 rounded-xl transition-colors inline-flex items-center text-sm font-bold"
                          >
                            <Send className="w-4 h-4 mr-2" /> Kirim Promo WA
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
