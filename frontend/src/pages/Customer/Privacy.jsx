import React from "react";
import CustomerLayout from "../../layouts/CustomerLayout";
import { ShieldCheck } from "lucide-react";

export default function Privacy() {
  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-barber-darkgray border border-gray-700 text-barber-gold mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Kebijakan Privasi
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
            Di BLABLA BARBER, privasi pelanggan adalah prioritas kami. Kebijakan
            ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan
            melindungi informasi pribadi Anda saat Anda menggunakan layanan
            reservasi dan POS kami.
          </p>

          <h2 className="text-xl font-bold text-barber-gold mt-8 mb-4">
            1. Informasi yang Kami Kumpulkan
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Saat Anda melakukan reservasi atau mendaftar sebagai member, kami
            dapat mengumpulkan informasi berikut:
          </p>
          <ul className="list-disc pl-6 text-gray-300 mb-6 space-y-2">
            <li>Nama lengkap</li>
            <li>Nomor telepon / WhatsApp</li>
            <li>Alamat email (opsional)</li>
            <li>Riwayat kunjungan, layanan, dan transaksi</li>
          </ul>

          <h2 className="text-xl font-bold text-barber-gold mt-8 mb-4">
            2. Penggunaan Informasi
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Informasi yang dikumpulkan digunakan semata-mata untuk:
          </p>
          <ul className="list-disc pl-6 text-gray-300 mb-6 space-y-2">
            <li>Memproses jadwal reservasi potong rambut Anda.</li>
            <li>
              Mengirimkan notifikasi atau pengingat terkait jadwal reservasi
              (misalnya melalui WhatsApp/SMS).
            </li>
            <li>Mengelola sistem poin loyalitas dan diskon member.</li>
            <li>Meningkatkan kualitas layanan dan pengalaman pelanggan.</li>
          </ul>

          <h2 className="text-xl font-bold text-barber-gold mt-8 mb-4">
            3. Perlindungan Data
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Kami menerapkan langkah-langkah keamanan teknis untuk melindungi
            data pribadi Anda dari akses, perubahan, atau pengungkapan yang
            tidak sah. Data Anda disimpan di dalam sistem kami dengan aman dan
            hanya dapat diakses oleh staf yang berwenang (Kasir dan Admin).
          </p>

          <h2 className="text-xl font-bold text-barber-gold mt-8 mb-4">
            4. Berbagi Informasi Pihak Ketiga
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Kami tidak menjual, menyewakan, atau menukar data pribadi pelanggan
            kepada pihak ketiga mana pun. Informasi Anda hanya digunakan untuk
            kepentingan operasional internal BLABLA BARBER.
          </p>

          <h2 className="text-xl font-bold text-barber-gold mt-8 mb-4">
            5. Perubahan Kebijakan
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu.
            Setiap perubahan akan diinformasikan melalui halaman ini atau
            melalui pemberitahuan di outlet kami.
          </p>

          <div className="mt-12 p-6 bg-barber-black rounded-xl border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-2">Hubungi Kami</h3>
            <p className="text-gray-400 text-sm">
              Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini,
              silakan hubungi kami di <strong>hello@blablabarber.com</strong>{" "}
              atau tanyakan langsung kepada staf kasir kami.
            </p>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
