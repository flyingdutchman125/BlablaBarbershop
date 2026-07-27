import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CustomerLayout({ children }) {
  return (
    <div className="min-h-screen bg-barber-black text-white print:bg-white print:text-black flex flex-col">
      <Navbar />
      <main className="pt-16 pb-20 flex-grow print:pt-0 print:pb-0 print:flex print:items-center print:justify-center print:h-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
