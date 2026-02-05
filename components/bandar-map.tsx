// @ts-nocheck

"use client"

import "leaflet/dist/leaflet.css"
import React, { useMemo, useState, useEffect } from "react"
import { MapContainer, TileLayer, CircleMarker, Popup, Marker, useMap } from "react-leaflet"
import L from "leaflet"

type POICategory = "Pemerintahan" | "Pendidikan" | "Kesehatan" | "Ibadah" | "Wisata" | "UMKM"

type POI = {
  id: number | string
  name: string
  category: string
  address?: string
  phone?: string
  lat: number | string
  lng: number | string
}

type LandslidePoint = {
  id: string
  title: string
  status: "Waspada" | "Darurat" | "Selesai"
  description?: string
  date?: string
  lat: number | string
  lng: number | string
}

const CATEGORY_META: Record<POICategory, { label: string; dotClass: string }> = {
  Pemerintahan: { label: "Pemerintahan", dotClass: "bg-emerald-500" },
  Pendidikan: { label: "Pendidikan", dotClass: "bg-blue-500" },
  Kesehatan: { label: "Kesehatan", dotClass: "bg-red-500" },
  Ibadah: { label: "Ibadah", dotClass: "bg-violet-500" },
  Wisata: { label: "Wisata", dotClass: "bg-amber-500" },
  UMKM: { label: "UMKM", dotClass: "bg-cyan-500" },
}

const CATEGORY_COLOR: Record<POICategory, string> = {
  Pemerintahan: "#10b981",
  Pendidikan: "#3b82f6",
  Kesehatan: "#ef4444",
  Ibadah: "#8b5cf6",
  Wisata: "#f59e0b",
  UMKM: "#06b6d4",
}

function openGmaps(lat: number, lng: number) {
  window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank")
}

function normalizeCategory(cat: string): POICategory {
  const cleaned = (cat ?? "").trim()

  const map: Record<string, POICategory> = {
    Pemerintahan: "Pemerintahan",
    Pendidikan: "Pendidikan",
    Kesehatan: "Kesehatan",
    Ibadah: "Ibadah",
    Wisata: "Wisata",
    UMKM: "UMKM",

    pemerintahan: "Pemerintahan",
    pendidikan: "Pendidikan",
    kesehatan: "Kesehatan",
    ibadah: "Ibadah",
    wisata: "Wisata",
    umkm: "UMKM",
  }

  return map[cleaned] ?? map[cleaned.toLowerCase()] ?? "Pemerintahan"
}

function toNum(v: number | string) {
  const n = typeof v === "number" ? v : Number(String(v).trim())
  return Number.isFinite(n) ? n : NaN
}

function landslideIcon(status: LandslidePoint["status"]) {
  const bg = status === "Darurat" ? "#ef4444" : status === "Waspada" ? "#f59e0b" : "#22c55e"

  const html = `
  <div style="
    width: 34px; height: 34px;
    border-radius: 9999px;
    background: ${bg};
    display: grid; place-items: center;
    box-shadow: 0 6px 16px rgba(0,0,0,.25);
    border: 2px solid rgba(255,255,255,.9);
  ">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l10 18H2L12 3z" fill="rgba(255,255,255,.95)"/>
      <path d="M12 9v5" stroke="${bg}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="12" cy="17" r="1.2" fill="${bg}"/>
    </svg>
  </div>
  `
  return L.divIcon({ html, className: "", iconSize: [34, 34], iconAnchor: [17, 34] })
}

// Component to handle auto-fitting bounds
function BoundsHandler({ points, landslides, showLandslides }: { 
  points: Array<{ lat: number; lng: number }>; 
  landslides: Array<{ lat: number; lng: number }>; 
  showLandslides: boolean 
}) {
  const map = useMap()

  useEffect(() => {
    if (points.length === 0 && (!showLandslides || landslides.length === 0)) return

    const allPoints = [
      ...points,
      ...(showLandslides ? landslides : [])
    ]

    if (allPoints.length === 0) return

    const bounds = L.latLngBounds(allPoints.map(p => [p.lat, p.lng]))
    
    // Add some padding to the bounds
    map.fitBounds(bounds, { padding: [20, 20] })
  }, [points, landslides, showLandslides, map])

  return null
}

export default function DesaJerukMap({
  pois,
  center,
  zoom = 13,
}: {
  pois: POI[]
  center: [number, number]
  zoom?: number
}) {
  const categories = useMemo(() => Object.keys(CATEGORY_META) as POICategory[], [])

  const [enabledCategories, setEnabledCategories] = useState<Record<POICategory, boolean>>({
    Pemerintahan: true,
    Pendidikan: true,
    Kesehatan: true,
    Ibadah: true,
    Wisata: true,
    UMKM: true,
  })


  const safePois = useMemo(() => {
    return (pois ?? [])
      .map((p) => ({
        ...p,
        lat: toNum(p.lat),
        lng: toNum(p.lng),
      }))
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
  }, [pois])

  const filteredPois = useMemo(() => {
    return safePois.filter((p) => enabledCategories[normalizeCategory(p.category)])
  }, [safePois, enabledCategories])

  return (
    <div className="relative w-full h-full overflow-hidden">
      <MapContainer center={center} zoom={zoom} className="h-full w-full overflow-hidden rounded-lg">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Only POI bounds and markers */}
        <BoundsHandler 
          points={filteredPois.map(p => ({ lat: p.lat as number, lng: p.lng as number }))}
          landslides={[]}
          showLandslides={false}
        />

        {filteredPois.map((poi) => {
          const c = normalizeCategory(poi.category)

          return (
            <CircleMarker
              key={poi.id}
              center={[poi.lat as number, poi.lng as number]}
              radius={10}
              pathOptions={{
                color: "#ffffff",
                weight: 2,
                fillColor: CATEGORY_COLOR[c],
                fillOpacity: 0.95,
              }}
            >
              <Popup>
                <div className="space-y-2">
                  <div className="font-semibold">{poi.name}</div>
                  <div className="text-xs opacity-80">{poi.category}</div>
                  {poi.address ? <div className="text-sm">{poi.address}</div> : null}
                  {poi.phone ? <div className="text-sm">{poi.phone}</div> : null}
                  <button
                    className="mt-2 w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
                    onClick={() => openGmaps(poi.lat as number, poi.lng as number)}
                    type="button"
                  >
                    Buka di Google Maps
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>

      <div className="absolute right-3 top-3 z-[999] w-64 rounded-xl border bg-background/95 p-4 shadow-lg backdrop-blur">
        <div className="mb-3">
          <div className="text-sm font-bold">Legenda</div>
          <div className="text-xs text-muted-foreground">Tampilkan / sembunyikan layer</div>
        </div>

        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${CATEGORY_META[cat].dotClass}`} />
                <span>{CATEGORY_META[cat].label}</span>
              </div>
              <input
                type="checkbox"
                checked={enabledCategories[cat]}
                onChange={(e) => setEnabledCategories((prev) => ({ ...prev, [cat]: e.target.checked }))}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
