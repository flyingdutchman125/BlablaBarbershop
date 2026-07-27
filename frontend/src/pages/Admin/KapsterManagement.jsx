import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";

export default function KapsterManagement() {
  const [kapsters, setKapsters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    bio: "",
    photo_url: "",
    status: "active",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchKapsters = async () => {
    try {
      const response = await axios.get(
        `http://${window.location.hostname}:5000/api/kapsters?all=true`,
      );
      setKapsters(response.data);
    } catch (error) {
      console.error("Error fetching kapsters:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKapsters();
  }, []);

  const handleOpenModal = (kapster = null) => {
    if (kapster) {
      setFormData(kapster);
      setImagePreview(kapster.photo_url || null);
    } else {
      setFormData({
        id: null,
        name: "",
        bio: "",
        photo_url: "",
        status: "active",
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      id: null,
      name: "",
      bio: "",
      photo_url: "",
      status: "active",
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("barbershop_token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    };

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("bio", formData.bio);
    submitData.append("status", formData.status);
    if (imageFile) {
      submitData.append("photo", imageFile);
    } else if (formData.photo_url) {
      submitData.append("photo_url", formData.photo_url);
    }

    try {
      if (formData.id) {
        await axios.put(
          `http://${window.location.hostname}:5000/api/kapsters/${formData.id}`,
          submitData,
          { headers },
        );
      } else {
        await axios.post(
          `http://${window.location.hostname}:5000/api/kapsters`,
          submitData,
          { headers },
        );
      }
      Swal.fire({
        title: "Sukses",
        text: "Data kapster berhasil disimpan",
        icon: "success",
        confirmButtonColor: "#d4af37",
      });
      fetchKapsters();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving kapster:", error);
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data.",
        icon: "error",
        confirmButtonColor: "#d4af37",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Kapster?",
      text: "Apakah Anda yakin ingin menghapus kapster ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#374151",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem("barbershop_token");
      try {
        await axios.delete(
          `http://${window.location.hostname}:5000/api/kapsters/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        Swal.fire({
          title: "Terhapus!",
          text: "Data kapster berhasil dihapus.",
          icon: "success",
          confirmButtonColor: "#d4af37",
        });
        fetchKapsters();
      } catch (error) {
        console.error("Error deleting kapster:", error);
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

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Manajemen Kapster</h1>
          <button
            onClick={() => handleOpenModal()}
            className="bg-barber-gold text-black px-4 py-2 rounded-xl font-bold hover:bg-barber-gold-light transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" /> Tambah Kapster
          </button>
        </div>

        <div className="bg-barber-darkgray rounded-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-barber-black text-gray-400 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Foto</th>
                  <th className="px-6 py-4 font-medium">Nama</th>
                  <th className="px-6 py-4 font-medium">Bio</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : kapsters.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      Belum ada data kapster.
                    </td>
                  </tr>
                ) : (
                  kapsters.map((kapster) => (
                    <tr
                      key={kapster.id}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        {kapster.photo_url ? (
                          <img
                            src={
                              kapster.photo_url.startsWith("http")
                                ? kapster.photo_url
                                : `http://${window.location.hostname}:5000${kapster.photo_url}`
                            }
                            alt={kapster.name}
                            className="w-12 h-12 rounded-full object-cover border border-gray-700"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs">
                            No img
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-white">
                        {kapster.name}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {kapster.bio}
                      </td>
                      <td className="px-6 py-4">
                        {kapster.status === "active" ? (
                          <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs font-medium border border-green-500/20">
                            Aktif
                          </span>
                        ) : (
                          <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-xs font-medium border border-red-500/20">
                            Non-Aktif
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenModal(kapster)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors mr-2"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(kapster.id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-barber-darkgray border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-barber-black/50">
              <h2 className="text-xl font-display font-bold">
                {formData.id ? "Edit Kapster" : "Tambah Kapster Baru"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-barber-black border border-gray-700 text-white px-4 py-2 rounded-xl focus:border-barber-gold outline-none transition-colors"
                    placeholder="Nama kapster"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Bio Singkat
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full bg-barber-black border border-gray-700 text-white px-4 py-2 rounded-xl focus:border-barber-gold outline-none transition-colors h-24"
                    placeholder="Keahlian, gaya potongan..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Foto Kapster
                  </label>
                  <div className="relative border-2 border-dashed border-gray-700 rounded-xl p-4 text-center hover:border-barber-gold transition-colors bg-barber-black flex flex-col items-center justify-center min-h-[150px]">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {imagePreview ? (
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-600 mb-2">
                        {imagePreview.startsWith("http") ||
                        imagePreview.startsWith("blob") ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={`http://${window.location.hostname}:5000${imagePreview}`}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-2">
                        <Plus className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                    <span className="text-sm text-gray-400">
                      Drag & drop foto atau klik untuk memilih file
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-barber-black border border-gray-700 text-white px-4 py-2 rounded-xl focus:border-barber-gold outline-none transition-colors"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Non-Aktif</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-barber-gold text-black rounded-xl hover:bg-barber-gold-light transition-colors font-bold"
                >
                  {formData.id ? "Simpan Perubahan" : "Tambah Kapster"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
