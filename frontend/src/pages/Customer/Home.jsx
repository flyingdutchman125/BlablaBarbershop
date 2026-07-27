import React from "react";
import { Link } from "react-router-dom";
import CustomerLayout from "../../layouts/CustomerLayout";
import { ChevronRight, Clock, MapPin, Star } from "lucide-react";

import axios from "axios";

// Data services akan ditarik dari API

export default function Home() {
  const [services, setServices] = React.useState([]);
  const [kapsters, setKapsters] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, kapstersRes] = await Promise.all([
          axios.get(`http://${window.location.hostname}:5000/api/services`),
          axios.get(`http://${window.location.hostname}:5000/api/kapsters`),
        ]);
        setServices(servicesRes.data);
        setKapsters(kapstersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();

    // Dynamically load Elfsight script for reviews
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up if needed
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <CustomerLayout>
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Barbershop Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-barber-black via-barber-black/50 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
            Penampilan Terbaik Dimulai Dari Sini
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Rasakan pengalaman potong rambut premium dengan kapster profesional
            kami. Booking jadwal Anda sekarang tanpa perlu mengantre lama.
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center justify-center px-8 py-3 bg-barber-gold hover:bg-barber-gold-light text-barber-black font-semibold rounded-full transition-all transform hover:scale-105 duration-300 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
          >
            Reservasi Sekarang <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Info Bar */}
      <div className="border-y border-barber-darkgray bg-barber-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 divide-y md:divide-y-0 md:divide-x divide-barber-darkgray">
            <div className="flex items-center justify-center space-x-3 py-2">
              <Clock className="w-5 h-5 text-barber-gold" />
              <span className="text-sm text-gray-300">
                Buka Setiap Hari: 10.00 - 22.00
              </span>
            </div>
            <div className="flex items-center justify-center space-x-3 py-2">
              <MapPin className="w-5 h-5 text-barber-gold" />
              <span className="text-sm text-gray-300">
                Wonoayu, Kepuhanyar, Kec. Mojoanyar, Kabupaten Mojokerto, Jawa
                Timur
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Layanan Signature
          </h2>
          <div className="w-24 h-1 bg-barber-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-barber-darkgray rounded-2xl overflow-hidden border border-gray-800 hover:border-barber-gold/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={
                    service.image_url
                      ? service.image_url.startsWith("http")
                        ? service.image_url
                        : `http://${window.location.hostname}:5000${service.image_url}`
                      : "https://placehold.co/800"
                  }
                  alt={service.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-barber-darkgray to-transparent"></div>
              </div>
              <div className="p-6 relative">
                <div className="absolute -top-6 right-6 bg-barber-gold text-barber-black px-4 py-1 rounded-full font-bold shadow-lg">
                  Rp {parseFloat(service.price).toLocaleString("id-ID")}
                </div>
                <h3 className="text-xl font-display font-bold mb-2">
                  {service.name}
                </h3>
                <div className="flex items-center text-gray-400 text-sm mb-4">
                  <Clock className="w-4 h-4 mr-1" /> {service.duration_minutes}{" "}
                  Min
                </div>
                <Link
                  to="/booking"
                  state={{ preselectedServiceId: service.id }}
                  className="w-full block text-center py-2 border border-barber-gold text-barber-gold rounded-lg hover:bg-barber-gold hover:text-barber-black transition-colors font-medium"
                >
                  Pilih Layanan
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kapsters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-barber-black">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Kapster <span className="text-barber-gold">Profesional</span>
          </h2>
          <div className="w-24 h-1 bg-barber-gold mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Percayakan gaya rambut Anda pada tangan-tangan ahli yang siap
            memberikan hasil terbaik.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {kapsters.map((kapster) => (
            <div
              key={kapster.id}
              className="group relative rounded-2xl overflow-hidden h-96 cursor-pointer shadow-lg border border-gray-800"
            >
              <img
                src={
                  kapster.photo_url
                    ? kapster.photo_url.startsWith("http")
                      ? kapster.photo_url
                      : `http://${window.location.hostname}:5000${kapster.photo_url}`
                    : "https://placehold.co/400x500"
                }
                alt={kapster.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-barber-black via-barber-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end h-full">
                <h3 className="text-2xl font-display font-bold text-white mb-1 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                  {kapster.name}
                </h3>
                <div className="text-barber-gold text-sm font-semibold mb-3 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                  Master Barber
                </div>

                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100 h-0 group-hover:h-auto overflow-hidden">
                  <p className="text-gray-300 text-sm leading-relaxed border-t border-gray-700 pt-3 mt-1 line-clamp-4">
                    {kapster.bio ||
                      "Kapster profesional dengan pengalaman dan dedikasi tinggi."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section (Elfsight) */}
      <div
        className="elfsight-app-85300f3c-e601-4555-abb0-d5aaa4e49032"
        data-elfsight-app-lazy
      ></div>

      {/* About Us Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-barber-darkgray/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800 h-96 lg:h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
              alt="About BLABLA BARBER"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-barber-black/80 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-barber-gold font-bold text-xl mb-1">
                BLABLA BARBER
              </div>
              <div className="text-gray-300 text-sm">Since 2026</div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Tentang <span className="text-barber-gold">Kami</span>
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              BLABLA BARBER bukan sekadar tempat potong rambut, melainkan
              destinasi premium bagi para pria yang menghargai gaya dan
              kenyamanan. Dengan kapster berpengalaman dan peralatan modern,
              kami memastikan setiap pelanggan keluar dengan rasa percaya diri
              yang tinggi.
            </p>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Kenyamanan Anda adalah prioritas kami. Nikmati suasana maskulin,
              rileks, dan bersih sambil menikmati layanan berkualitas tinggi
              dari kami.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-barber-darkgray p-4 rounded-xl border border-gray-800 text-center">
                <div className="text-3xl font-bold text-barber-gold mb-1">
                  {kapsters.length > 0 ? kapsters.length : "5+"}
                </div>
                <div className="text-sm text-gray-400">Kapster Profesional</div>
              </div>
              <div className="bg-barber-darkgray p-4 rounded-xl border border-gray-800 text-center flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-barber-gold mb-1">
                  {services.length > 0 ? services.length : "10"}+
                </div>
                <div className="text-sm text-gray-400">Layanan Premium</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Lokasi <span className="text-barber-gold">Kami</span>
          </h2>
          <div className="w-24 h-1 bg-barber-gold mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Kunjungi gerai kami yang strategis dan nikmati layanan grooming pria
            terbaik di kota Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-barber-darkgray p-6 rounded-2xl border border-gray-800 flex items-start space-x-4 hover:border-barber-gold/50 transition-colors">
              <div className="bg-barber-black p-3 rounded-full text-barber-gold">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Alamat</h3>
                <p className="text-gray-400 text-sm">
                  Wonoayu, Kepuhanyar
                  <br /> Kec. Mojoanyar, Kabupaten Mojokerto
                  <br /> Jawa Timur 61364
                </p>
              </div>
            </div>

            <div className="bg-barber-darkgray p-6 rounded-2xl border border-gray-800 flex items-start space-x-4 hover:border-barber-gold/50 transition-colors">
              <div className="bg-barber-black p-3 rounded-full text-barber-gold">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Jam Operasional</h3>
                <p className="text-gray-400 text-sm">
                  Senin - Minggu
                  <br />
                  10:00 - 22:00 WIB
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-gray-800 h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.9458036743886!2d112.48151317593044!3d-7.471237392540483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e780d000d94c8a7%3A0x7c8bda890f603685!2sBlabla%20Barbershop!5e0!3m2!1sid!2sid!4v1784992668627!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location"
            ></iframe>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
