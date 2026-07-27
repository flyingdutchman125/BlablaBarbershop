import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Trash2, Users, Search } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

export default function MemberManagement() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("barbershop_token");
      const response = await axios.get(
        `http://${window.location.hostname}:5000/api/members`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal memuat data member.",
        icon: "error",
        confirmButtonColor: "#d4af37",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Member?",
      text: "Data member dan poin akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#374151",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("barbershop_token");
        await axios.delete(
          `http://${window.location.hostname}:5000/api/members/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        Swal.fire({
          title: "Terhapus!",
          text: "Data member berhasil dihapus.",
          icon: "success",
          confirmButtonColor: "#d4af37",
        });

        fetchMembers();
      } catch (error) {
        console.error("Error deleting member:", error);
        Swal.fire({
          title: "Error",
          text:
            error.response?.data?.message ||
            "Terjadi kesalahan saat menghapus data.",
          icon: "error",
          confirmButtonColor: "#d4af37",
        });
      }
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm),
  );

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Manajemen Member
            </h1>
            <p className="text-gray-400">
              Kelola daftar pelanggan member barbershop
            </p>
          </div>
        </div>

        <div className="bg-barber-darkgray rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Cari nama atau no WA..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-barber-black border border-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:border-barber-gold"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            </div>
            <div className="text-gray-400 text-sm">
              Total Member:{" "}
              <span className="text-barber-gold font-bold">
                {members.length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300">
              <thead className="bg-gray-800/50 text-gray-400 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Nama Member</th>
                  <th className="px-6 py-4 font-medium">Nomor WhatsApp</th>
                  <th className="px-6 py-4 font-medium">Tanggal Lahir</th>
                  <th className="px-6 py-4 font-medium text-center">
                    Poin Terkumpul
                  </th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Memuat data...
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Belum ada member.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-barber-gold/20 flex items-center justify-center text-barber-gold font-bold mr-3">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-white">
                            {member.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{member.phone}</td>
                      <td className="px-6 py-4">
                        {member.birth_date
                          ? new Date(member.birth_date).toLocaleDateString(
                              "id-ID",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-green-900/40 text-green-400 px-3 py-1 rounded-full font-bold">
                          {member.points}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Hapus Member"
                        >
                          <Trash2 className="w-5 h-5" />
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
