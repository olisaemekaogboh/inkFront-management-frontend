import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CookieConsentBanner from "../common/CookieConsentBanner";
function PublicLayout() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieConsentBanner />
    </div>
  );
}

export default PublicLayout;
