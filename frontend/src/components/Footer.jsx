import React from "react";
import { Link } from "react-router-dom";
import { Instagram, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-barber-darkgray border-t border-gray-800 pt-16 pb-8 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <div className="text-2xl font-display font-bold text-barber-gold mb-4">
              BLABLA BARBER
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Destinasi grooming pria premium untuk penampilan terbaik Anda.
              Dapatkan pengalaman potong rambut yang tak terlupakan dengan
              layanan profesional kami.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-barber-black border border-gray-700 flex items-center justify-center text-gray-400 hover:text-barber-gold hover:border-barber-gold transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-barber-black border border-gray-700 flex items-center justify-center text-gray-400 hover:text-barber-gold hover:border-barber-gold transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-barber-black border border-gray-700 flex items-center justify-center text-gray-400 hover:text-barber-gold hover:border-barber-gold transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M12.031 0C5.385 0 0 5.386 0 12.032c0 2.124.555 4.195 1.611 6.015L.302 24l6.104-1.6c1.748.966 3.738 1.478 5.625 1.478 6.645 0 12.031-5.386 12.031-12.032S18.676 0 12.031 0zm0 21.849c-1.748 0-3.46-.467-4.966-1.36l-.356-.21-3.693.968.986-3.602-.23-.367c-1.026-1.637-1.57-3.524-1.57-5.467 0-5.465 4.448-9.914 9.913-9.914 5.464 0 9.913 4.449 9.913 9.914s-4.449 9.914-9.913 9.914zm5.438-7.447c-.298-.15-1.768-.874-2.042-.975-.274-.1-4.733-.15-6.666-.324-.298-.448-.874-1.222-1.048-1.471-.174-.25-.348-.275-.646-.125-.298.15-1.261.464-3.048 2.052-.774.686-.468 1.348-.17 1.498.298.15 1.768.874 2.042.975.274.1.646.075.895-.299l2.766-4.22c.249-.374.124-.7-.025-.85-.15-.15-.647-.75-1.295-1.598-.124-.15-.248-.15-.546 0-.298.15-1.144.536-1.144 1.31 0 .774.298 1.523.895 2.322.597.798 1.99 3.033 4.825 4.256.674.293 1.202.468 1.614.599.676.216 1.292.185 1.777.112.544-.08 1.768-.724 2.016-1.423.249-.699.249-1.298.174-1.423-.074-.125-.273-.2-.571-.35z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Tautan Cepat</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-barber-gold transition-colors text-sm"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/booking"
                  className="text-gray-400 hover:text-barber-gold transition-colors text-sm"
                >
                  Reservasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Kontak Kami</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <MapPin className="text-barber-gold mr-3 w-5 h-5 flex-shrink-0" />
                <span>
                  Wonoayu, Kepuhanyar, Kec. Mojoanyar, Kabupaten Mojokerto, Jawa
                  Timur 61364
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="text-barber-gold mr-3 w-5 h-5 flex-shrink-0" />
                <span>+62 877-8123-3783</span>
              </li>
              <li className="flex items-center">
                <Mail className="text-barber-gold mr-3 w-5 h-5 flex-shrink-0" />
                <span>hello@blablabarber.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} BLABLA BARBER. Hak cipta
            dilindungi.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <Link
              to="/terms"
              className="hover:text-barber-gold transition-colors"
            >
              Syarat & Ketentuan
            </Link>
            <Link
              to="/privacy"
              className="hover:text-barber-gold transition-colors"
            >
              Kebijakan Privasi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
