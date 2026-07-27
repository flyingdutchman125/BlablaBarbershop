import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    price: "",
    stock: "",
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products`,
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        id: null,
        name: "",
        price: "",
        stock: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      id: null,
      name: "",
      price: "",
      stock: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("barbershop_token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      if (formData.id) {
        await axios.put(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products/${formData.id}`,
          formData,
          { headers },
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products`,
          formData,
          { headers },
        );
      }
      Swal.fire({
        title: "Sukses",
        text: "Data produk berhasil disimpan",
        icon: "success",
        confirmButtonColor: "#d4af37",
      });
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving product:", error);
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
      title: "Hapus Produk?",
      text: "Apakah Anda yakin ingin menghapus produk ini?",
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
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        Swal.fire({
          title: "Terhapus!",
          text: "Data produk berhasil dihapus.",
          icon: "success",
          confirmButtonColor: "#d4af37",
        });
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
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
          <h1 className="text-3xl font-display font-bold">Manajemen Produk</h1>
          <button
            onClick={() => handleOpenModal()}
            className="bg-barber-gold text-black px-4 py-2 rounded-xl font-bold hover:bg-barber-gold-light transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" /> Tambah Produk
          </button>
        </div>

        <div className="bg-barber-darkgray rounded-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-barber-black text-gray-400 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Nama Produk</th>
                  <th className="px-6 py-4 font-medium">Harga</th>
                  <th className="px-6 py-4 font-medium">Stok</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      Belum ada data produk.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{product.name}</p>
                      </td>
                      <td className="px-6 py-4 text-barber-gold font-medium">
                        {formatRupiah(product.price)}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {product.stock} pcs
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors mr-2"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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
          <div className="bg-barber-darkgray border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-barber-black/50">
              <h2 className="text-xl font-display font-bold">
                {formData.id ? "Edit Produk" : "Tambah Produk Baru"}
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
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-barber-black border border-gray-700 text-white px-4 py-2 rounded-xl focus:border-barber-gold outline-none transition-colors"
                    placeholder="Contoh: Pomade Suavecito"
                  />
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
                      Stok
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full bg-barber-black border border-gray-700 text-white px-4 py-2 rounded-xl focus:border-barber-gold outline-none transition-colors"
                      placeholder="10"
                    />
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
                  {formData.id ? "Simpan Perubahan" : "Tambah Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
