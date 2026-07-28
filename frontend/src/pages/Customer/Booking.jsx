import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CustomerLayout from "../../layouts/CustomerLayout";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  Phone,
  Scissors,
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

// Data kapsters dan services akan difetch dari API

const generateTimeSlots = () => {
  const slots = [];
  for (let i = 10; i <= 21; i++) {
    slots.push(`${i}:00`);
    slots.push(`${i}:30`);
  }
  slots.push("22:00");
  return slots;
};

const timeSlots = generateTimeSlots();

const generateDates = () => {
  const dates = [];
  const today = new Date();
  const hari = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const bulan = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      fullDate: d.toISOString().split("T")[0], // YYYY-MM-DD
      dayName: i === 0 ? "Hari Ini" : i === 1 ? "Besok" : hari[d.getDay()],
      dateNum: d.getDate(),
      month: bulan[d.getMonth()],
    });
  }
  return dates;
};

const availableDates = generateDates();

export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedKapster, setSelectedKapster] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);

  const [services, setServices] = useState([]);
  const [kapsters, setKapsters] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, kapstersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/services`),
          axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/kapsters`),
        ]);
        setServices(servicesRes.data);
        setKapsters(kapstersRes.data.filter((k) => k.status === "active"));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // Tangkap service yang dipilih dari halaman Home
  useEffect(() => {
    if (location.state?.preselectedServiceId && services.length > 0) {
      setSelectedService(location.state.preselectedServiceId);
      setStep(2); // Langsung lompat ke langkah Pilih Kapster
    }
  }, [location.state, services]);

  // Fetch booked times when kapster and date are selected
  useEffect(() => {
    const fetchBookedTimes = async () => {
      if (selectedKapster && selectedDate) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/reservations/booked-times?kapster_id=${selectedKapster}&date=${selectedDate}`,
          );
          setBookedTimes(res.data);
          // if currently selected time becomes booked, reset it
          if (res.data.includes(selectedTime)) {
            setSelectedTime("");
          }
        } catch (error) {
          console.error("Error fetching booked times:", error);
        }
      }
    };
    fetchBookedTimes();
  }, [selectedKapster, selectedDate]);

  // Data diri tamu
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const handleBooking = async () => {
    try {
      const payload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        kapster_id: selectedKapster,
        service_id: selectedService,
        booking_date: selectedDate,
        booking_time: selectedTime,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/reservations`,
        payload,
      );
      navigate(`/ticket/${response.data.ticket_code}`);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        Swal.fire({
          title: "Error",
          text: error.response.data.message,
          icon: "error",
          confirmButtonColor: "#d4af37",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Terjadi kesalahan saat membuat reservasi.",
          icon: "error",
          confirmButtonColor: "#d4af37",
        });
      }
      console.error(error);
    }
  };

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-display font-bold mb-8 text-center">
          Reservasi Jadwal
        </h2>

        {/* Progress Tracker */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? "bg-barber-gold text-black" : "bg-gray-800 text-gray-500"}`}
            >
              1
            </div>
            <div
              className={`w-6 h-1 mx-1 ${step >= 2 ? "bg-barber-gold" : "bg-gray-800"}`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? "bg-barber-gold text-black" : "bg-gray-800 text-gray-500"}`}
            >
              2
            </div>
            <div
              className={`w-6 h-1 mx-1 ${step >= 3 ? "bg-barber-gold" : "bg-gray-800"}`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? "bg-barber-gold text-black" : "bg-gray-800 text-gray-500"}`}
            >
              3
            </div>
            <div
              className={`w-6 h-1 mx-1 ${step >= 4 ? "bg-barber-gold" : "bg-gray-800"}`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 4 ? "bg-barber-gold text-black" : "bg-gray-800 text-gray-500"}`}
            >
              4
            </div>
            <div
              className={`w-6 h-1 mx-1 ${step >= 5 ? "bg-barber-gold" : "bg-gray-800"}`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 5 ? "bg-barber-gold text-black" : "bg-gray-800 text-gray-500"}`}
            >
              5
            </div>
          </div>
        </div>

        <div className="bg-barber-darkgray p-8 rounded-2xl border border-gray-800 shadow-2xl">
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-medium mb-6 flex items-center">
                <Scissors className="mr-2 text-barber-gold w-6 h-6" /> Pilih
                Layanan Utama
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${selectedService === service.id ? "border-barber-gold bg-barber-gold/10" : "border-gray-700 hover:border-gray-500"}`}
                  >
                    <h4 className="font-bold text-lg mb-1">{service.name}</h4>
                    <p className="text-barber-gold font-medium mb-2">
                      Rp {parseInt(service.price).toLocaleString("id-ID")}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />{" "}
                        {service.duration_minutes} Min
                      </span>
                      {selectedService === service.id && (
                        <CheckCircle2 className="text-barber-gold w-5 h-5" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  disabled={!selectedService}
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-barber-gold text-black font-bold rounded-lg disabled:opacity-50 transition-colors hover:bg-barber-gold-light"
                >
                  Lanjut
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-medium mb-6 flex items-center">
                <User className="mr-2 text-barber-gold" /> Pilih Kapster
                Profesional Anda
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {kapsters.map((kapster) => (
                  <div
                    key={kapster.id}
                    onClick={() => setSelectedKapster(kapster.id)}
                    className={`cursor-pointer flex items-center p-4 rounded-xl border-2 transition-all ${selectedKapster === kapster.id ? "border-barber-gold bg-barber-gold/10" : "border-gray-700 hover:border-gray-500"}`}
                  >
                    <img
                      src={
                        kapster.photo_url
                          ? kapster.photo_url.startsWith("http") || kapster.photo_url.startsWith("data:image")
                            ? kapster.photo_url
                            : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${kapster.photo_url}`
                          : "https://placehold.co/150"
                      }
                      alt={kapster.name}
                      className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-700"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg leading-tight mb-1">
                        {kapster.name}
                      </h4>
                      {kapster.bio && (
                        <p
                          className="text-sm text-gray-400 mb-2 line-clamp-2"
                          title={kapster.bio}
                        >
                          {kapster.bio}
                        </p>
                      )}
                      <span className="inline-block text-[10px] text-green-400 bg-green-400/10 px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
                        {kapster.status}
                      </span>
                    </div>
                    {selectedKapster === kapster.id && (
                      <CheckCircle2 className="ml-2 text-barber-gold w-6 h-6 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 mr-4 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Kembali
                </button>
                <button
                  disabled={!selectedKapster}
                  onClick={() => setStep(3)}
                  className="px-6 py-2 bg-barber-gold text-black font-bold rounded-lg disabled:opacity-50 transition-colors hover:bg-barber-gold-light"
                >
                  Lanjut
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-medium mb-6 flex items-center">
                <CalendarIcon className="mr-2 text-barber-gold" /> Pilih Tanggal
              </h3>

              {/* Custom Date Picker Scroller */}
              <div className="flex overflow-x-auto space-x-4 pb-4 mb-8 custom-scrollbar">
                {availableDates.map((dateObj, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(dateObj.fullDate)}
                    className={`flex-shrink-0 w-28 p-4 rounded-xl border-2 text-center cursor-pointer transition-all duration-300 ${
                      selectedDate === dateObj.fullDate
                        ? "border-barber-gold bg-barber-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] transform scale-105"
                        : "border-gray-700 bg-barber-black hover:border-gray-500 hover:bg-gray-800"
                    }`}
                  >
                    <div
                      className={`text-xs mb-1 ${selectedDate === dateObj.fullDate ? "text-black font-semibold" : "text-gray-400"}`}
                    >
                      {dateObj.dayName}
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {dateObj.dateNum}
                    </div>
                    <div
                      className={`text-xs ${selectedDate === dateObj.fullDate ? "text-black font-semibold" : "text-gray-400"}`}
                    >
                      {dateObj.month}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Kembali
                </button>
                <button
                  disabled={!selectedDate}
                  onClick={() => setStep(4)}
                  className="px-6 py-2 bg-barber-gold text-black font-bold rounded-lg disabled:opacity-50 transition-colors hover:bg-barber-gold-light"
                >
                  Lanjut
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-medium mb-6 flex items-center">
                <Clock className="mr-2 text-barber-gold" /> Pilih Jam Tersedia
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-8">
                {timeSlots.map((time) => {
                  const isBooked = bookedTimes.includes(time);

                  return (
                    <button
                      key={time}
                      disabled={isBooked}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 rounded-xl border transition-all font-medium 
                        ${
                          isBooked
                            ? "border-gray-800 bg-gray-900 text-gray-600 cursor-not-allowed opacity-60"
                            : selectedTime === time
                              ? "border-barber-gold bg-barber-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                              : "border-gray-700 hover:border-gray-500"
                        }`}
                    >
                      {time}
                      {isBooked && (
                        <span className="block text-[10px] text-red-500 font-bold mt-1">
                          DIBOOKING
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Kembali
                </button>
                <button
                  disabled={!selectedTime}
                  onClick={() => setStep(5)}
                  className="px-6 py-2 bg-barber-gold text-black font-bold rounded-lg disabled:opacity-50 transition-colors hover:bg-barber-gold-light"
                >
                  Lanjut
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-medium mb-6 flex items-center">
                <User className="mr-2 text-barber-gold" /> Informasi Data Diri
              </h3>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    className="w-full bg-barber-black border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-barber-gold"
                    placeholder="Masukkan nama Anda"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Nomor Telepon (WhatsApp)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      className="w-full bg-barber-black border border-gray-700 rounded-xl p-4 pl-12 text-white focus:outline-none focus:border-barber-gold"
                      placeholder="0812xxxxxx"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                    <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Kembali
                </button>
                <button
                  disabled={!customerName || !customerPhone}
                  onClick={handleBooking}
                  className="px-6 py-2 bg-green-500 text-black font-bold rounded-lg disabled:opacity-50 transition-colors hover:bg-green-400"
                >
                  Konfirmasi Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}
