
import React, { useState } from "react";
import { Users, FileText, Home, LogOut, ChevronDown, ChevronUp, User } from "lucide-react";
import Link from "next/link";

export default function SidebarAdmin({ active, onLogout, user }) {
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-emerald-900 text-white shadow-lg flex flex-col z-40">
      <div className="px-6 py-6 border-b border-emerald-800 flex items-center gap-3">
        <img src="/img/logo-kab-pacitan.png" alt="Logo" className="w-8 h-8 rounded-full" />
        <span className="font-bold text-lg">Admin Desa Bandar</span>
      </div>
      <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
        <Link href="/admin" className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-800 transition ${active === "home" ? "bg-emerald-800" : ""}`}> <Home className="w-5 h-5" /> Dashboard </Link>
        <Link href="/admin/dusun" className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-800 transition ${active === "dusun" ? "bg-emerald-800" : ""}`}> <Users className="w-5 h-5" /> Kelola Dusun </Link>
        <Link href="/admin/artikel" className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-800 transition ${active === "artikel" ? "bg-emerald-800" : ""}`}> <FileText className="w-5 h-5" /> Kelola Artikel </Link>
      </nav>
      <div className="px-6 py-4 border-t border-emerald-800 flex flex-col gap-1">
        <button
          className="flex items-center gap-2 w-full px-2 py-2 rounded-lg hover:bg-emerald-800 font-semibold text-left"
          onClick={() => setProfileOpen(v => !v)}
        >
          <User className="w-5 h-5" />
          <span className="flex-1 truncate">{user?.user_metadata?.name || user?.email || "Profil"}</span>
          {profileOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {profileOpen && (
          <div className="ml-6 mt-1 flex flex-col gap-1">
            <Link href="/admin/profil" className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-emerald-800 text-sm ${active === "profil" ? "bg-emerald-800" : ""}`}>Edit Profil</Link>
            <button onClick={onLogout} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-emerald-800 text-sm text-left"><LogOut className="w-4 h-4" /> Logout</button>
          </div>
        )}
        <div className="text-xs text-emerald-200 mt-4">&copy; {new Date().getFullYear()} Desa Bandar</div>
      </div>
    </aside>
  );
}
