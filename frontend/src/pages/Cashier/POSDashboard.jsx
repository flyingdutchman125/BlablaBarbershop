import React, { useState, useEffect } from "react";
import POSLayout from "../../layouts/POSLayout";
import {
  Search,
  QrCode,
  Trash2,
  CreditCard,
  Banknote,
  Camera,
} from "lucide-react";
import axios from "axios";
import logoImg from "/src/BLABLA_BAREBER.png";
import Swal from "sweetalert2";

export default function POSDashboard() {
  const [cart, setCart] = useState([]);
  const [ticketInput, setTicketInput] = useState("");
  const [availableServices, setAvailableServices] = useState([]);
  const [currentReservationId, setCurrentReservationId] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [todayReservations, setTodayReservations] = useState([]);
  const [showReservationsDropdown, setShowReservationsDropdown] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [todayExpenses, setTodayExpenses] = useState(0);

  const [memberSearchInput, setMemberSearchInput] = useState("");
  const [activeMember, setActiveMember] = useState(null);
  const [pointsToUseForService, setPointsToUseForService] = useState(0);
  const [pointsToUseForProduct, setPointsToUseForProduct] = useState(0);
  const [showRegisterMember, setShowRegisterMember] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: "",
    phone: "",
    birth_date: "",
  });

  const [activeQueues, setActiveQueues] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [showQueueTicket, setShowQueueTicket] = useState(false);
  const [queueTicketData, setQueueTicketData] = useState(null);

  const fetchActiveQueues = async () => {
    try {
      const token = localStorage.getItem("barbershop_token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/queues`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setActiveQueues(res.data);
    } catch (error) {
      console.error("Error fetching queues:", error);
    }
  };

  const fetchTodayReservations = async () => {
    try {
      const token = localStorage.getItem("barbershop_token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/reservations/today`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodayReservations(res.data);
    } catch (error) {
      console.error("Error fetching today reservations:", error);
    }
  };

  const fetchTodayExpenses = async () => {
    try {
      const token = localStorage.getItem("barbershop_token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/expenses`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const todayStr = new Date().toLocaleDateString("sv-SE");
      const expenses = res.data.filter(e => {
        const d = new Date(e.expense_date).toLocaleDateString("sv-SE");
        return d === todayStr;
      });
      const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
      setTodayExpenses(total);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleCreateQueue = async () => {
    try {
      const token = localStorage.getItem("barbershop_token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/queues`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setQueueTicketData({
        number: String(res.data.queue_number).padStart(3, "0"),
        date: new Date().toLocaleString("id-ID"),
      });
      setShowQueueTicket(true);
      fetchActiveQueues();

      // Otomatis trigger print setelah modal selesai di-render
      setTimeout(() => {
        window.print();
      }, 500);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Gagal membuat nomor antrian",
        icon: "error",
        confirmButtonColor: "#d4af37",
      });
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/services`,
      );
      const colors = [
        "bg-blue-900/40 border-blue-500",
        "bg-green-900/40 border-green-500",
        "bg-purple-900/40 border-purple-500",
        "bg-pink-900/40 border-pink-500",
        "bg-yellow-900/40 border-yellow-500",
      ];

      const servicesWithColors = res.data.map((service, index) => ({
        ...service,
        color: colors[index % colors.length],
      }));
      setAvailableServices(servicesWithColors);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products`,
      );
      const colors = [
        "bg-indigo-900/40 border-indigo-500",
        "bg-teal-900/40 border-teal-500",
        "bg-orange-900/40 border-orange-500",
        "bg-cyan-900/40 border-cyan-500",
      ];
      const productsWithColors = res.data.map((product, index) => ({
        ...product,
        color: colors[index % colors.length],
      }));
      setAvailableProducts(productsWithColors);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchActiveQueues();
    fetchTodayReservations();
    fetchServices();
    fetchProducts();
    fetchTodayExpenses();
  }, []);

  // Event listener untuk tombol 'p' atau 'P' sebagai shortcut antrian walk-in
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Abaikan jika sedang mengetik di input text
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      if (e.key.toLowerCase() === "p") {
        e.preventDefault();
        handleCreateQueue();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const addToCart = (item, overrideType = null) => {
    setCart((prevCart) => {
      const type = overrideType || item.type || "service";
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id && cartItem.type === type);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id && cartItem.type === type
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem,
        );
      } else {
        return [...prevCart, { ...item, qty: 1, type }];
      }
    });
  };

  const removeFromCart = (id, type) => {
    setCart((prevCart) => prevCart.filter((item) => !(item.id === id && item.type === type)));
  };

  const handleSearchMember = async (phoneOverride = null) => {
    const phoneToSearch =
      typeof phoneOverride === "string" ? phoneOverride : memberSearchInput;
    if (!phoneToSearch || !phoneToSearch.trim()) return;
    try {
      const token = localStorage.getItem("barbershop_token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/members/${phoneToSearch}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setActiveMember(res.data);
      setPointsToUseForService(0);
      setPointsToUseForProduct(0);
      setMemberSearchInput(phoneToSearch);
    } catch (error) {
      if (typeof phoneOverride !== "string") {
        Swal.fire({
          title: "Error",
          text: "Member tidak ditemukan!",
          icon: "error",
          confirmButtonColor: "#d4af37",
        });
      }
      setActiveMember(null);
      setPointsToUse(0);
    }
  };

  const handleRegisterMember = async () => {
    try {
      const token = localStorage.getItem("barbershop_token");
      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/members`,
        registerForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const memberService = availableServices.find(
        (s) => s.name === "Registrasi Member",
      );
      if (memberService) addToCart(memberService);

      Swal.fire({
        title: "Sukses",
        text: "Member berhasil didaftarkan! Item Registrasi ditambahkan ke keranjang.",
        icon: "success",
        confirmButtonColor: "#d4af37",
      });
      setShowRegisterMember(false);
      setMemberSearchInput(registerForm.phone);
      setRegisterForm({ name: "", phone: "", birth_date: "" });
      setTimeout(() => {
        handleSearchMember();
      }, 500);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Gagal mendaftar member",
        icon: "error",
        confirmButtonColor: "#d4af37",
      });
    }
  };

  const handleTicketValidation = async (overrideTicket = null) => {
    const idToValidate =
      typeof overrideTicket === "string" ? overrideTicket : ticketInput;
    if (!idToValidate || !idToValidate.trim()) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/reservations/ticket/${idToValidate}`,
      );
      const reservation = res.data;

      const token = localStorage.getItem("barbershop_token");

      if (reservation.status === "pending" || reservation.status === "checked_in") {
        if (reservation.status === "pending") {
          // Update status to checked_in
          await axios.patch(
            `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/reservations/${reservation.id}/status`,
            { status: "checked_in" },
            { headers: { Authorization: `Bearer ${token}` } },
          );
        }
        
        // Auto add reserved service to cart for payment
        const serviceToAdd = availableServices.find(
          (s) => s.id === reservation.service_id,
        );
        if (serviceToAdd) {
          addToCart(serviceToAdd, 'service');
        } else {
          // Fallback if not found in state
          addToCart({
            id: reservation.service_id,
            name: reservation.service_name,
            price: parseFloat(reservation.price),
          }, 'service');
        }

        setCurrentReservationId(reservation.id);
        setTicketInput("");
        setShowReservationsDropdown(false);
        fetchTodayReservations(); // Refresh list

        Swal.fire({
          title: "Sukses",
          text: "Pelanggan di Check-in dan item ditambahkan ke keranjang!",
          icon: "success",
          confirmButtonColor: "#d4af37",
        });

        if (
          reservation.customer_phone &&
          reservation.customer_phone !== "-" &&
          !reservation.customer_phone.startsWith("Antrian")
        ) {
          handleSearchMember(reservation.customer_phone);
        }
      } else if (reservation.status === "completed") {
        Swal.fire({
          title: "Info",
          text: "Tiket ini sudah selesai dan dibayar.",
          icon: "info",
          confirmButtonColor: "#d4af37",
        });
      } else if (reservation.status === "cancelled") {
        Swal.fire({
          title: "Warning",
          text: "Tiket ini sudah dibatalkan.",
          icon: "warning",
          confirmButtonColor: "#d4af37",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Tiket tidak valid atau tidak ditemukan",
        icon: "error",
        confirmButtonColor: "#d4af37",
      });
    }
  };

  useEffect(() => {
    let scanner = null;
    if (showScanner) {
      setTimeout(() => {
        if (window.Html5QrcodeScanner) {
          scanner = new window.Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false,
          );
          scanner.render(
            (decodedText) => {
              setTicketInput(decodedText);
              setShowScanner(false);
              handleTicketValidation(decodedText);
              if (scanner) {
                scanner.clear().catch((e) => console.error(e));
              }
            },
            (error) => {
              // ignore scan failure
            },
          );
        }
      }, 100);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch((e) => console.error(e));
      }
    };
  }, [showScanner]); // handleTicketValidation updates implicitly

  const totalQRIS = todayReservations
    .filter(r => r.status === 'completed' && r.payment_method === 'qris')
    .reduce((sum, r) => sum + (parseFloat(r.price) || 0), 0);

  const totalTunai = todayReservations
    .filter(r => r.status === 'completed' && r.payment_method === 'cash')
    .reduce((sum, r) => sum + (parseFloat(r.price) || 0), 0);

  const serviceTotal = cart
    .filter((item) => item.type !== "product")
    .reduce((total, item) => total + parseFloat(item.price) * item.qty, 0);
  const productTotal = cart
    .filter((item) => item.type === "product")
    .reduce((total, item) => total + parseFloat(item.price) * item.qty, 0);
  const totalAmount = serviceTotal + productTotal;

  const serviceDiscountPercentage = activeMember
    ? Math.min(pointsToUseForService || 0, 100)
    : 0;
  const serviceDiscountAmount =
    serviceTotal * (serviceDiscountPercentage / 100);

  const productDiscountAmount = activeMember
    ? (pointsToUseForProduct || 0) * 100
    : 0;
  const finalProductDiscount = Math.min(productDiscountAmount, productTotal);

  const discountAmount = serviceDiscountAmount + finalProductDiscount;
  const amountAfterDiscount = Math.max(0, totalAmount - discountAmount);

  const handleCheckout = async (paymentMethod) => {
    try {
      const token = localStorage.getItem("barbershop_token");
      const finalAmount = amountAfterDiscount; // without 10% tax

      const payload = {
        reservation_id: currentReservationId,
        items: cart,
        total_amount: finalAmount,
        payment_method: paymentMethod,
        amount_paid: finalAmount, // Assuming exact amount paid for now
        member_phone: activeMember ? activeMember.phone : null,
        points_used: (pointsToUseForService ? parseInt(pointsToUseForService) : 0) + (pointsToUseForProduct ? parseInt(pointsToUseForProduct) : 0),
        queue_number: selectedQueue ? selectedQueue.queue_number : null,
      };

      const txRes = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/transactions`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (selectedQueue) {
        await axios.patch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/queues/${selectedQueue.id}/complete`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        fetchActiveQueues();
      }

      // Refresh products to reflect new stock
      fetchProducts();
      // Refresh daily stats
      fetchTodayReservations();
      fetchTodayExpenses();

      // Calculate per-item details for the receipt
      const receiptItems = cart.map(item => {
        const itemNormalTotal = parseFloat(item.price) * item.qty;
        let itemDiscount = 0;
        let itemDiscountText = "-";
        
        if (item.type === "product") {
           if (productTotal > 0 && finalProductDiscount > 0) {
             itemDiscount = (itemNormalTotal / productTotal) * finalProductDiscount;
             const pointsForThisItem = itemDiscount / 100;
             itemDiscountText = `${Math.round(pointsForThisItem)} Poin`;
           }
        } else {
           if (serviceDiscountPercentage > 0) {
             itemDiscount = itemNormalTotal * (serviceDiscountPercentage / 100);
             itemDiscountText = `${serviceDiscountPercentage}% / ${serviceDiscountPercentage} Poin`;
           }
        }
        
        return {
          ...item,
          normalTotal: itemNormalTotal,
          discountAmount: itemDiscount,
          discountText: itemDiscountText,
          finalTotal: itemNormalTotal - itemDiscount
        };
      });

      setReceiptData({
        items: receiptItems,
        subtotal: totalAmount,
        discount: discountAmount,
        tax: 0,
        total: finalAmount,
        method: paymentMethod,
        date: new Date().toLocaleString("id-ID"),
        points_earned: txRes.data.points_earned || 0,
      });
      setShowReceipt(true);
      // Wait to clear cart until modal is closed
    } catch (error) {
      console.error("Checkout error:", error);
      Swal.fire({
        title: "Error",
        text: "Terjadi kesalahan saat memproses pembayaran",
        icon: "error",
        confirmButtonColor: "#d4af37",
      });
    }
  };

  const closeReceiptAndReset = () => {
    setShowReceipt(false);
    setReceiptData(null);
    setCart([]);
    setCurrentReservationId(null);
    setActiveMember(null);
    setMemberSearchInput("");
    setPointsToUseForService(0);
    setPointsToUseForProduct(0);
    setSelectedQueue(null);
  };

  return (
    <POSLayout>
      <div
        className={`flex h-full w-full ${showReceipt || showQueueTicket ? "print:hidden" : ""}`}
      >
        {/* Left Panel: Services & Search (70%) */}
        <div className="flex-1 p-6 flex flex-col bg-barber-black print:hidden">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-display font-bold">
              Menu Layanan & Produk
            </h1>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowRegisterMember(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center"
              >
                Daftar Member
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Validasi Tiket / Nama Pelanggan..."
                  className="bg-barber-darkgray border border-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:border-barber-gold w-72 relative z-10"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  onFocus={() => setShowReservationsDropdown(true)}
                  onBlur={() => setTimeout(() => setShowReservationsDropdown(false), 200)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleTicketValidation()
                  }
                />
                <QrCode className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 z-10" />

                {/* Dropdown hari ini */}
                {showReservationsDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-barber-darkgray border border-gray-700 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                    {todayReservations
                      .filter(r => 
                         (r.status === 'pending' || r.status === 'checked_in') &&
                         (r.customer_name.toLowerCase().includes(ticketInput.toLowerCase()) || 
                          r.ticket_code.toLowerCase().includes(ticketInput.toLowerCase()))
                       )
                      .map((res) => (
                      <div 
                        key={res.id}
                        className="p-3 border-b border-gray-800 hover:bg-gray-800 cursor-pointer flex justify-between items-center transition-colors"
                        onClick={() => {
                          setTicketInput(res.ticket_code);
                          // Using setTimeout to allow state update before validating
                          setTimeout(() => handleTicketValidation(res.ticket_code), 50);
                        }}
                      >
                        <div>
                          <div className="font-bold text-white text-sm">{res.customer_name}</div>
                          <div className="text-xs text-gray-400">{res.service_name} • {res.booking_time}</div>
                        </div>
                        <div className="text-xs font-mono text-barber-gold">{res.ticket_code}</div>
                      </div>
                    ))}
                    {todayReservations.filter(r => (r.status === 'pending' || r.status === 'checked_in')).length === 0 && (
                      <div className="p-4 text-center text-gray-500 text-sm">Tidak ada reservasi hari ini</div>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowScanner(true)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-700 flex items-center"
                title="Scan QR Code"
              >
                <Camera className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleTicketValidation()}
                className="bg-barber-gold text-black px-4 py-2 rounded-lg font-bold hover:bg-barber-gold-light"
              >
                Proses Tiket
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Cari layanan (e.g. Haircut)"
              className="w-full bg-barber-darkgray border border-gray-700 text-white px-4 py-3 pl-12 rounded-xl focus:outline-none focus:border-barber-gold text-lg"
            />
            <Search className="absolute left-4 top-3.5 w-6 h-6 text-gray-400" />
          </div>

          {/* Daily Stats */}
          <div className="flex space-x-4 mb-6">
            <div className="bg-barber-darkgray border border-gray-700 p-4 rounded-xl flex-1 shadow-lg">
              <p className="text-gray-400 text-xs mb-1 font-semibold uppercase tracking-wider">Pemasukan QRIS</p>
              <h4 className="text-white font-bold text-xl">Rp {totalQRIS.toLocaleString("id-ID")}</h4>
            </div>
            <div className="bg-barber-darkgray border border-gray-700 p-4 rounded-xl flex-1 shadow-lg">
              <p className="text-gray-400 text-xs mb-1 font-semibold uppercase tracking-wider">Pemasukan Tunai</p>
              <h4 className="text-white font-bold text-xl">Rp {totalTunai.toLocaleString("id-ID")}</h4>
            </div>
            <div className="bg-barber-darkgray border border-gray-700 p-4 rounded-xl flex-1 shadow-lg">
              <p className="text-gray-400 text-xs mb-1 font-semibold uppercase tracking-wider">Total Pengeluaran</p>
              <h4 className="text-red-400 font-bold text-xl">Rp {todayExpenses.toLocaleString("id-ID")}</h4>
            </div>
          </div>

          {/* Active Queues Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-display font-bold text-lg text-white">
                Antrian Walk-In Aktif
              </h3>
              <button
                onClick={handleCreateQueue}
                className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
              >
                + Buat No Antrian
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {activeQueues.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Tidak ada antrian aktif.
                </p>
              ) : (
                activeQueues.map((q) => (
                  <button
                    key={q.id}
                    onClick={() =>
                      setSelectedQueue(selectedQueue?.id === q.id ? null : q)
                    }
                    className={`px-4 py-2 rounded-xl font-bold border-2 transition-colors ${
                      selectedQueue?.id === q.id
                        ? "bg-barber-gold text-black border-barber-gold"
                        : "bg-barber-darkgray text-white border-gray-700 hover:border-barber-gold"
                    }`}
                  >
                    {String(q.queue_number).padStart(3, "0")}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-6">
            {availableServices.map((service) => (
              <button
                key={service.id}
                onClick={() => addToCart(service, 'service')}
                className={`${service.color} border-2 rounded-xl p-4 h-32 flex flex-col justify-between items-start hover:opacity-80 transition-opacity text-left relative`}
              >
                <span className="absolute top-2 right-2 bg-black/50 px-2 py-0.5 rounded text-[10px] font-bold text-gray-300">LAYANAN</span>
                <span className="font-display font-bold text-lg leading-tight">
                  {service.name}
                </span>
                <span className="text-gray-300 font-medium tracking-wide">
                  Rp {parseFloat(service.price).toLocaleString("id-ID")}
                </span>
              </button>
            ))}
            
            {availableProducts.map((product) => (
              <button
                key={`prod-${product.id}`}
                onClick={() => addToCart(product, 'product')}
                disabled={product.stock <= 0}
                className={`${product.color} border-2 rounded-xl p-4 h-32 flex flex-col justify-between items-start hover:opacity-80 transition-opacity text-left relative ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="absolute top-2 right-2 bg-black/50 px-2 py-0.5 rounded text-[10px] font-bold text-gray-300">PRODUK</span>
                <span className="font-display font-bold text-lg leading-tight">
                  {product.name}
                </span>
                <div className="flex flex-col">
                  <span className="text-gray-300 font-medium tracking-wide">
                    Rp {parseFloat(product.price).toLocaleString("id-ID")}
                  </span>
                  <span className="text-xs text-gray-400">
                    Sisa Stok: {product.stock}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Cart & Checkout (30%) */}
        <div className="w-[380px] bg-barber-darkgray border-l border-gray-800 flex flex-col shadow-2xl relative z-10">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center print:hidden">
            <div>
              <h2 className="text-xl font-bold font-display">Current Order</h2>
              {selectedQueue && (
                <span className="text-sm font-bold text-barber-gold mt-1 inline-block">
                  Pelanggan: Antrian{" "}
                  {String(selectedQueue.queue_number).padStart(3, "0")}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-barber-gold text-black font-bold px-2 py-1 rounded text-sm">
                {cart.length} Item
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <p>Belum ada layanan yang dipilih.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-barber-black p-3 rounded-lg border border-gray-800"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name} {item.type === 'product' && <span className="text-[10px] bg-gray-700 px-1 rounded ml-1">Produk</span>}</h4>
                    <p className="text-barber-gold text-xs">
                      Rp {parseFloat(item.price).toLocaleString("id-ID")} x{" "}
                      {item.qty}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id, item.type)}
                    className="text-gray-500 hover:text-red-500 transition-colors p-2 print:hidden"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}

            {/* Member Section */}
            <div className="mt-4 pt-4 border-t border-gray-800 print:hidden">
              <h3 className="font-display font-bold text-sm mb-2 text-gray-300">
                Data Member
              </h3>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Cari No WA Member"
                  className="w-full bg-barber-black border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-barber-gold"
                  value={memberSearchInput}
                  onChange={(e) => setMemberSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchMember()}
                />
                <button
                  onClick={handleSearchMember}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600"
                >
                  Cari
                </button>
              </div>

              {activeMember && (
                <div className="bg-green-900/20 border border-green-800 p-3 rounded-lg mt-2">
                  <p className="text-sm font-bold text-green-400">
                    {activeMember.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Poin Tersedia:{" "}
                    <span className="font-bold text-white">
                      {activeMember.points}
                    </span>
                  </p>

                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        max={activeMember.points - pointsToUseForProduct}
                        className="w-20 bg-barber-black border border-gray-700 text-white px-2 py-1 rounded text-sm focus:outline-none focus:border-barber-gold"
                        placeholder="Poin"
                        value={pointsToUseForService}
                        onChange={(e) => {
                          let val = parseInt(e.target.value) || 0;
                          let maxPointsForService = activeMember.points - pointsToUseForProduct;
                          if (val > maxPointsForService) val = maxPointsForService;
                          if (val > 100) val = 100; // max 100% discount
                          setPointsToUseForService(val);
                        }}
                      />
                      <span className="text-xs text-gray-400">
                        Diskon Layanan (1% / Poin)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        max={activeMember.points - pointsToUseForService}
                        className="w-20 bg-barber-black border border-gray-700 text-white px-2 py-1 rounded text-sm focus:outline-none focus:border-barber-gold"
                        placeholder="Poin"
                        value={pointsToUseForProduct}
                        onChange={(e) => {
                          let val = parseInt(e.target.value) || 0;
                          let maxPointsForProduct = activeMember.points - pointsToUseForService;
                          if (val > maxPointsForProduct) val = maxPointsForProduct;
                          // Max discount shouldn't exceed product total
                          let maxAllowedDiscount = productTotal / 100;
                          if (val > maxAllowedDiscount) val = Math.ceil(maxAllowedDiscount);
                          setPointsToUseForProduct(val);
                        }}
                      />
                      <span className="text-xs text-gray-400">
                        Diskon Produk (Rp 100 / Poin)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-barber-black border-t border-gray-800">
            <div className="flex justify-between text-gray-400 mb-2 text-sm">
              <span>Subtotal</span>
              <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
            </div>
            {serviceDiscountAmount > 0 && (
              <div className="flex justify-between text-green-400 mb-1 text-sm">
                <span>Diskon Layanan ({serviceDiscountPercentage}%)</span>
                <span>- Rp {serviceDiscountAmount.toLocaleString("id-ID")}</span>
              </div>
            )}
            {finalProductDiscount > 0 && (
              <div className="flex justify-between text-green-400 mb-2 text-sm">
                <span>Diskon Produk</span>
                <span>- Rp {finalProductDiscount.toLocaleString("id-ID")}</span>
              </div>
            )}
            <div className="flex justify-between font-display font-bold text-2xl text-white mb-6 border-t border-gray-700 pt-4">
              <span>Total</span>
              <span className="text-barber-gold">
                Rp {amountAfterDiscount.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 print:hidden">
              <button
                disabled={cart.length === 0}
                onClick={() => handleCheckout("qris")}
                className="flex items-center justify-center py-4 bg-gray-800 rounded-xl hover:bg-gray-700 disabled:opacity-50 font-bold transition-colors"
              >
                <CreditCard className="w-5 h-5 mr-2" /> QRIS / Card
              </button>
              <button
                disabled={cart.length === 0}
                onClick={() => handleCheckout("cash")}
                className="flex items-center justify-center py-4 bg-barber-gold text-black rounded-xl hover:bg-barber-gold-light disabled:opacity-50 font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-colors"
              >
                <Banknote className="w-5 h-5 mr-2" /> Tunai
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 print:bg-white print:items-start print:p-0">
          <div className="bg-white text-black p-8 rounded-2xl w-96 relative print:shadow-none print:p-0 print:w-full print:rounded-none">
            {/* Action Buttons (Hidden on print) */}
            <div className="flex justify-between mb-6 print:hidden">
              <h3 className="font-bold text-xl">Transaksi Berhasil</h3>
              <div className="space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-barber-gold text-black font-bold rounded-lg hover:bg-barber-gold-light"
                >
                  Print Struk
                </button>
                <button
                  onClick={closeReceiptAndReset}
                  className="px-4 py-2 bg-gray-200 text-black font-bold rounded-lg hover:bg-gray-300"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Receipt Content */}
            <div className="text-center font-mono text-sm border border-gray-200 p-6 print:border-none print:px-3 print:pt-8 print:pb-60 print:w-[48mm] print:max-w-[48mm] print:mx-auto print:leading-tight mx-auto box-border">
              <div className="flex justify-center mb-2 print:mb-1">
                <img
                  src={logoImg}
                  alt="Logo"
                  className="w-12 h-12 print:w-8 print:h-8 grayscale"
                />
              </div>
              <h2 className="text-xl print:text-sm font-bold mb-1 print:mb-1">
                BLABLA BARBER
              </h2>
              <p className="text-xs text-gray-500 mb-1 print:mb-0 print:text-[10px]">
                Wonoayu, Kepuhanyar, Kec. Mojoanyar, Kabupaten Mojokerto, Jawa
                Timur 61364
              </p>
              <p className="text-xs text-gray-500 mb-4 print:mb-2 print:text-[10px]">
                Tel: 0877-8123-3783
              </p>

              <div className="text-left text-xs mb-4 print:mb-3 border-b border-dashed border-gray-400 pb-4 print:pb-3">
                <p>Tgl : {receiptData.date}</p>
                <p>Ksr : Admin</p>
                <p>Met : {receiptData.method.toUpperCase()}</p>
              </div>

              <div className="text-left text-xs print:text-[11px] mb-4 print:mb-3 border-b border-dashed border-gray-400 pb-2 print:pb-1">
                {receiptData.items.map((item, idx) => (
                  <div key={idx} className="mb-3 print:mb-2 border-b border-gray-100 print:border-gray-300 pb-2 print:pb-1 last:border-0">
                    <p className="font-bold print:font-semibold">
                      {item.name} <span className="font-normal text-gray-500">({item.qty}x)</span>
                    </p>
                    <div className="flex justify-between mt-1">
                      <span>Harga Normal</span>
                      <span>{item.normalTotal.toLocaleString("id-ID")}</span>
                    </div>
                    {item.discountAmount > 0 && (
                      <div className="flex justify-between text-gray-600 print:text-gray-800">
                        <span>Disc ({item.discountText})</span>
                        <span>-{Math.round(item.discountAmount).toLocaleString("id-ID")}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold mt-1">
                      <span>Total Item</span>
                      <span>{Math.round(item.finalTotal).toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-left text-xs mb-6 print:mb-3">
                <div className="flex justify-between mb-1 print:mb-0">
                  <span>Sub</span>
                  <span>{receiptData.subtotal.toLocaleString("id-ID")}</span>
                </div>
                {receiptData.discount > 0 && (
                  <div className="flex justify-between mb-1 print:mb-0 text-gray-600 print:text-black">
                    <span>Disc</span>
                    <span>-{receiptData.discount.toLocaleString("id-ID")}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm mt-2 print:mt-1 pt-2 print:pt-1 border-t border-dashed border-gray-400">
                  <span>Tot</span>
                  <span>{receiptData.total.toLocaleString("id-ID")}</span>
                </div>
                {receiptData.points_earned > 0 && (
                  <div className="flex justify-between text-xs mt-2 print:mt-1 pt-2 print:pt-1 border-t border-dashed border-gray-400 font-bold print:font-semibold">
                    <span>+Poin</span>
                    <span>{receiptData.points_earned}</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-center font-bold print:font-semibold mt-2">
                TERIMA KASIH
              </p>
              <p className="text-xs text-center mt-1">
                Gaya Terbaik Mulai Disini
              </p>
              <p className="text-xs text-center mt-1">
                __________________________
              </p>
              <p className="text-xs text-center mt-1">
                __________________________
              </p>
              <p className="text-xs text-center mt-1">
                __________________________
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-black">Scan QR Tiket</h3>
              <button
                onClick={() => setShowScanner(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Tutup
              </button>
            </div>
            <div id="qr-reader" className="w-full"></div>
            <p className="text-sm text-gray-500 text-center mt-4">
              Arahkan kamera ke QR Code pada tiket pelanggan.
            </p>
          </div>
        </div>
      )}

      {/* Register Member Modal */}
      {showRegisterMember && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-barber-darkgray border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="font-display font-bold text-2xl text-white mb-6">
              Pendaftaran Member
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  className="w-full bg-barber-black border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-barber-gold"
                  value={registerForm.name}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, name: e.target.value })
                  }
                  placeholder="Masukkan nama"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Nomor WhatsApp (Unik)
                </label>
                <input
                  type="text"
                  className="w-full bg-barber-black border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-barber-gold"
                  value={registerForm.phone}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, phone: e.target.value })
                  }
                  placeholder="Contoh: 08123456789"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  className="w-full bg-barber-black border border-gray-700 text-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:border-barber-gold"
                  value={registerForm.birth_date}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      birth_date: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  *Digunakan untuk bonus poin ulang tahun
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowRegisterMember(false)}
                className="flex-1 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleRegisterMember}
                disabled={
                  !registerForm.name ||
                  !registerForm.phone ||
                  !registerForm.birth_date
                }
                className="flex-1 py-3 bg-barber-gold text-black rounded-xl hover:bg-barber-gold-light font-bold disabled:opacity-50"
              >
                Daftar & Masukkan Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Queue Ticket Modal */}
      {showQueueTicket && queueTicketData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 print:bg-white print:items-start print:p-0">
          <div className="bg-white text-black p-8 rounded-2xl w-80 relative print:shadow-none print:p-0 print:w-full print:rounded-none">
            <div className="flex justify-between mb-6 print:hidden">
              <h3 className="font-bold text-xl">Antrian Dibuat</h3>
              <div className="space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-barber-gold text-black font-bold rounded-lg hover:bg-barber-gold-light"
                >
                  Print Tiket
                </button>
                <button
                  onClick={() => setShowQueueTicket(false)}
                  className="px-4 py-2 bg-gray-200 text-black font-bold rounded-lg hover:bg-gray-300"
                >
                  Tutup
                </button>
              </div>
            </div>

            <div className="text-center border-2 border-dashed border-gray-400 p-6 print:border-none print:p-0 mx-auto">
              <h2 className="text-xl print:text-sm font-bold mb-1">
                BLABLA BARBER
              </h2>
              <p className="text-xs print:text-[10px] text-gray-500 mb-4 print:mb-2 border-b border-gray-300 pb-2">
                Walk-In Customer
              </p>

              <p className="text-sm print:text-xs mb-1">Nomor Antrian:</p>
              <h1 className="text-6xl print:text-4xl font-bold mb-4 text-black">
                {queueTicketData.number}
              </h1>

              <div className="text-xs print:text-[10px] text-gray-500 border-t border-gray-300 pt-2">
                <p>Tanggal: {queueTicketData.date}</p>
                <p className="mt-2 font-semibold text-black">
                  Harap tunggu panggilan kasir
                </p>
              </div>
              <p className="text-xs text-center mt-1">
                __________________________
              </p>
              <p className="text-xs text-center mt-1">
                __________________________
              </p>
              <p className="text-xs text-center mt-1">
                __________________________
              </p>
            </div>
          </div>
        </div>
      )}
    </POSLayout>
  );
}
