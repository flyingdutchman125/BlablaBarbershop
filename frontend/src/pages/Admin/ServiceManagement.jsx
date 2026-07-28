import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";

export default function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    duration_minutes: "",
    image_url: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/services`,
      );
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenModal = (service = null) => {
    if (service) {
      setFormData(service);
      setImagePreview(service.image_url || null);
    } else {
      setFormData({
        id: null,
        name: "",
        description: "",
        price: "",
        duration_minutes: "",
        image_url: "",
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
      description: "",
      price: "",
      duration_minutes: "",
      image_url: "",
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
    };

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price);
    submitData.append("duration_minutes", formData.duration_minutes);
    if (imageFile) {
      submitData.append("photo", imageFile);
    } else if (formData.image_url) {
      submitData.append("image_url", formData.image_url);
    }

    try {
      if (formData.id) {
        await axios.put(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/services/${formData.id}`,
          submitData,
          { headers },
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/services`,
          submitData,
          { headers },
        );
      }
      Swal.fire({
        title: "Sukses",
        text: "Data layanan berhasil disimpan",
        icon: "success",
        confirmButtonColor: "#d4af37",
      });
      fetchServices();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving service:", error);
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
      title: "Hapus Layanan?",
      text: "Apakah Anda yakin ingin menghapus layanan ini?",
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
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/services/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        Swal.fire({
          title: "Terhapus!",
          text: "Data layanan berhasil dihapus.",
          icon: "success",
          confirmButtonColor: "#d4af37",
        });
        fetchServices();
      } catch (error) {
        console.error("Error deleting service:", error);
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

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Manajemen Layanan</h1>
          <button
            onClick={() => handleOpenModal()}
            className="bg-barber-gold text-black px-4 py-2 rounded-xl font-bold hover:bg-barber-gold-light transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" /> Tambah Layanan
          </button>
        </div>

        <div className="bg-barber-darkgray rounded-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-barber-black text-gray-400 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Gambar</th>
                  <th className="px-6 py-4 font-medium">Nama Layanan</th>
                  <th className="px-6 py-4 font-medium">Harga</th>
                  <th className="px-6 py-4 font-medium">Durasi (Menit)</th>
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
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      Belum ada data layanan.
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr
                      key={service.id}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        {service.image_url ? (
                          <img
                            src={
                              service.image_url.startsWith("http") || service.image_url.startsWith("data:image")
                                ? service.image_url
                                : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${service.image_url}`
                            }
                            alt={service.name}
                            className="w-16 h-12 rounded-lg object-cover border border-gray-700"
                          />
                        ) : (
                          <div className="w-16 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-gray-500 text-xs">
                            No img
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{service.name}</p>
                        <p className="text-xs text-gray-400 truncate max-w-xs">
                          {service.description}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-barber-gold font-medium">
                        {formatRupiah(service.price)}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {service.duration_minutes} Menit
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenModal(service)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors mr-2"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
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
                {formData.id ? "Edit Layanan" : "Tambah Layanan Baru"}
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
                    Nama Layanan
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-barber-black border border-gray-700 text-white px-4 py-2 rounded-xl focus:border-barber-gold outline-none transition-colors"
                    placeholder="Contoh: Premium Haircut"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full bg-barber-black border border-gray-700 text-white px-4 py-2 rounded-xl focus:border-barber-gold outline-none transition-colors h-20"
                    placeholder="Jelaskan detail layanan..."
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Harga (Rp)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full bg-barber-black border border-gray-700 text-white px-4 py-2 rounded-xl focus:border-barber-gold outline-none transition-colors"
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Durasi (Menit)
                    </label>
                    <input
                      type="number"
                      name="duration_minutes"
                      value={formData.duration_minutes}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full bg-barber-black border border-gray-700 text-white px-4 py-2 rounded-xl focus:border-barber-gold outline-none transition-colors"
                      placeholder="30"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Gambar Layanan
                  </label>
                  <div className="relative border-2 border-dashed border-gray-700 rounded-xl p-4 text-center hover:border-barber-gold transition-colors bg-barber-black flex flex-col items-center justify-center min-h-[150px]">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {imagePreview ? (
                      <div className="relative w-full max-w-[200px] h-32 rounded-lg overflow-hidden border border-gray-600 mb-2">
                        {imagePreview.startsWith("http") ||
                        imagePreview.startsWith("blob") ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${imagePreview}`}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mb-2">
                        <Plus className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                    <span className="text-sm text-gray-400">
                      Drag & drop foto atau klik untuk memilih file
                    </span>
                  </div>
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
                  {formData.id ? "Simpan Perubahan" : "Tambah Layanan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
