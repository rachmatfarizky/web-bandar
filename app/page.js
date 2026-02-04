"use client";
import React, { useState, useEffect } from "react";
import DesaBandarUI from "../components/DesaBandarUI";
// Data diambil dari API agar tidak error di client

const DesaBandarPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedDusun, setSelectedDusun] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dusunData, setDusunData] = useState([]);
  const [artikelData, setArtikelData] = useState([]);
  const [adminData, setAdminData] = useState([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/public-data');
        const data = await res.json();
        if (data.dusun) setDusunData(data.dusun);
        if (data.artikel) setArtikelData(data.artikel);
      } catch (err) {
        console.error(err);
      }
    }
    async function fetchAdmins() {
      try {
        const res = await fetch('/api/admins');
        const data = await res.json();
        if (data.admins) setAdminData(data.admins);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
    fetchAdmins();
  }, []);

  const filteredDusun = dusunData.filter((dusun) =>
    dusun.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DesaBandarUI
      dusunData={dusunData}
      filteredDusun={filteredDusun}
      artikelData={artikelData}
      adminData={adminData}
      scrolled={scrolled}
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
      selectedDusun={selectedDusun}
      setSelectedDusun={setSelectedDusun}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  );
};

export default DesaBandarPage;
