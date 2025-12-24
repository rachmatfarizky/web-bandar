"use client";
import React, { useState, useEffect } from "react";
import DesaBandarUI from "../components/DesaBandarUI";
import { fetchDusunData } from "../lib/supabase";

const DesaBandarPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedDusun, setSelectedDusun] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dusunData, setDusunData] = useState([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchDusunData().then(setDusunData).catch(console.error);
  }, []);

  const filteredDusun = dusunData.filter((dusun) =>
    dusun.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DesaBandarUI
      dusunData={dusunData}
      filteredDusun={filteredDusun}
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
