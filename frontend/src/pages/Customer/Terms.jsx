import React from "react";
import CustomerLayout from "../../layouts/CustomerLayout";
import { ScrollText } from "lucide-react";

export default function Terms() {
  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-barber-darkgray border border-gray-700 text-barber-gold mb-6">
            <ScrollText className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Syarat & Ketentuan
          </h1>
          <div className="w-24 h-1 bg-barber-gold mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400">
            Terakhir diperbarui:{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="bg-barber-darkgray rounded-2xl p-8 md:p-12 border border-gray-800 shadow-xl prose prose-invert max-w-none">
          <p className="text-gray-300 leading-relaxed mb-6">
            Selamat datang di BLABLA BARBER. Dengan menggunakan layanan
            reservasi dan melakukan kunjungan ke outlet kami, Anda menyetujui
            syarat dan ketentuan berikut ini. Harap membacanya dengan saksama.
          </p>

          <h2 className="text-xl font-bold text-barber-gold mt-8 mb-4">
            1. Kebijakan Reservasi & Keterlambatan
          </h2>
          <ul className="list-disc pl-6 text-gray-300 mb-6 space-y-2">
            <li>
              Pelanggan disarankan datang 5-10 menit sebelum waktu reservasi
              yang telah ditentukan.
            </li>
            <li>
              Kami memberikan toleransi keterlambatan maksimal{" "}
              <strong>15 menit</strong>.
            </li>
            <li>
              Jika pelanggan datang lebih dari batas waktu toleransi, reservasi
              dianggap hangus, dan antrean akan dialihkan kepada pelanggan lain
              (Walk-In). Pelanggan yang terlambat harus mengambil antrean baru.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-barber-gold mt-8 mb-4">
            2. Kebijakan Pembatalan
          </h2>
          <ul className="list-disc pl-6 text-gray-300 mb-6 space-y-2">
            <li>
              Jika Anda berhalangan hadir, harap melakukan pembatalan reservasi
              minimal <strong>2 jam</strong> sebelum waktu layanan.
            </li>
            <li>
              Pembatalan dapat dilakukan melalui sistem kami atau dengan
              menghubungi pihak kasir.
            </li>
            <li>
              Pelanggan yang sering tidak hadir (No-Show) tanpa pemberitahuan
              dapat dibatasi aksesnya untuk melakukan reservasi di masa
              mendatang.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-barber-gold mt-8 mb-4">
            3. Harga & Pembayaran
          </h2>
          <ul className="list-disc pl-6 text-gray-300 mb-6 space-y-2">
            <li>Harga layanan yang tertera pada sistem adalah harga tetap.</li>
            <li>
              Pembayaran dapat dilakukan setelah layanan selesai di meja kasir.
              Kami menerima pembayaran Tunai, QRIS, dan Kartu Debit/Kredit.
            </li>
            <li>
              Penggunaan poin member atau diskon promo hanya berlaku sesuai
              dengan syarat dan ketentuan promo yang sedang berjalan.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-barber-gold mt-8 mb-4">
            4. Kenyamanan dan Keamanan
          </h2>
          <ul className="list-disc pl-6 text-gray-300 mb-6 space-y-2">
            <li>
              Kami berhak menolak melayani pelanggan yang bersikap tidak pantas,
              kasar, atau mengganggu kenyamanan pelanggan lain dan staf kami.
            </li>
            <li>
              Pihak barbershop tidak bertanggung jawab atas kehilangan barang
              berharga yang tertinggal di area potong rambut maupun ruang
              tunggu.
            </li>
          </ul>

          <div className="mt-12 p-6 bg-barber-black rounded-xl border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-2">Persetujuan</h3>
            <p className="text-gray-400 text-sm">
              Dengan membuat reservasi atau menjadi member BLABLA BARBER, Anda
              menyatakan telah membaca, memahami, dan menyetujui seluruh Syarat
              & Ketentuan di atas.
            </p>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
