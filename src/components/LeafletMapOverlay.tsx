"use client"

import { useEffect, useRef } from "react"

interface LeafletMapOverlayProps {
  onClose?: () => void
}

export default function LeafletMapOverlay({ onClose }: LeafletMapOverlayProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return

    // Load Leaflet CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    // Load Leaflet JS
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js'
    script.async = true
    
    script.onload = () => {
      if (!mapRef.current || mapInstanceRef.current) return
      
      const L = (window as any).L
      
      // Initialize map
      const map = L.map(mapRef.current, { zoomControl: true })
      mapInstanceRef.current = map

      // Add tile layer with vintage/antique style
      L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        maxZoom: 18,
        opacity: 0.85,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map)

      // Fetch and add coastline overlay
      fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_coastline.geojson')
        .then(r => r.json())
        .then(geo => {
          L.geoJSON(geo, {
            style: { color: '#5b3a29', weight: 1.5, opacity: 0.7 }
          }).addTo(map)
        })
        .catch(err => console.warn('Coastline data not available:', err))

      // Icon mapping for different cities
      const getCityIcon = (cityName: string) => {
        const iconMap: { [key: string]: string } = {
          "Mecca": "🕋",
          "Medina": "🕌",
          "Jakarta": "🏝️",
          "Dar es Salaam": "⛵",
          "Mogadishu": "🏖️",
          "Kuala Lumpur": "🏙️",
          "Timbuktu": "🏜️",
          "Kano": "🏛️",
          "Khartoum": "🌴",
          "Sana'a": "🏰",
          "Karachi": "⚓",
          "Dhaka": "🌾",
          "Cairo": "🔺",
          "Jerusalem": "✡️",
          "Lahore": "🕌",
          "Fez": "🏛️",
          "Tripoli": "🏛️",
          "Damascus": "🏛️",
          "Baghdad": "🏛️",
          "Tehran": "🏛️",
          "Kabul": "⛰️",
          "Algiers": "🏛️",
          "Tunis": "🏛️",
          "Diyarbakir": "🏰",
          "Istanbul": "🕌",
          "Baku": "🏛️",
          "Tashkent": "🕌"
        }
        return iconMap[cityName] || "🏙️"
      }

      // Custom icon functions with emojis
      const cityIcon = (cityName: string) => {
        const emoji = getCityIcon(cityName)
        return L.divIcon({
          className: 'custom-city-icon',
          html: `<div style="font-size: 28px; text-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 0 12px rgba(255,255,255,0.6); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${emoji}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })
      }

      const labelIcon = (text: string) => L.divIcon({
        className: 'custom-label',
        html: `<div style="font: 13px/1.1 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight:800; color:#1a1a1a; text-shadow: -1.5px -1.5px 0 #fff, 1.5px -1.5px 0 #fff, -1.5px 1.5px 0 #fff, 1.5px 1.5px 0 #fff, 0 0 10px rgba(255,255,255,0.9); white-space:nowrap; pointer-events:none; letter-spacing: 0.3px;">${text}</div>`,
        iconSize: [0, 0],
        iconAnchor: [0, -18]
      })

      // City data
      const cities = [
        { City: "Jakarta", Lat: -6, Lon: 106.8456 },
        { City: "Dar es Salaam", Lat: -6, Lon: 39 },
        { City: "Mogadishu", Lat: 3.0, Lon: 45.0 },
        { City: "Kuala Lumpur", Lat: 3.0, Lon: 101.6869 },
        { City: "Timbuktu", Lat: 16.0, Lon: -5.0 },
        { City: "Kano", Lat: 16.0, Lon: 10.0 },
        { City: "Khartoum", Lat: 16.0, Lon: 30.0 },
        { City: "Sana'a", Lat: 16.0, Lon: 45.0 },
        { City: "Mecca", Lat: 21.3891, Lon: 40.0 },
        { City: "Medina", Lat: 24.5247, Lon: 39.5692 },
        { City: "Karachi", Lat: 24.0, Lon: 67.0 },
        { City: "Dhaka", Lat: 24.0, Lon: 90.4125 },
        { City: "Cairo", Lat: 31.0, Lon: 30.0 },
        { City: "Jerusalem", Lat: 31.0, Lon: 36.0 },
        { City: "Lahore", Lat: 31.0, Lon: 74.3436 },
        { City: "Fez", Lat: 33.0, Lon: -5.0 },
        { City: "Tripoli", Lat: 33.0, Lon: 13.1913 },
        { City: "Damascus", Lat: 33.5138, Lon: 36.2765 },
        { City: "Baghdad", Lat: 33.0, Lon: 45.0 },
        { City: "Tehran", Lat: 33.0, Lon: 50.0 },
        { City: "Kabul", Lat: 33.0, Lon: 67.0 },
        { City: "Algiers", Lat: 37.0, Lon: 3.0588 },
        { City: "Tunis", Lat: 37.0, Lon: 10.0 },
        { City: "Diyarbakir", Lat: 37.0, Lon: 40.0 },
        { City: "Istanbul", Lat: 41.0, Lon: 30.0 },
        { City: "Baku", Lat: 41.0, Lon: 50.0 },
        { City: "Tashkent", Lat: 41.0, Lon: 67.0 }
      ]

      // Route data
      const routes = [
        [[-6, 39], [3, 45]],
        [[21.3891, 40], [24.5247, 39.5692]],
        [[21.3891, 40], [33, 45]],
        [[21.3891, 40], [16, 45]],
        [[21.3891, 40], [16, 30]],
        [[24.5247, 39.5692], [31, 36]],
        [[24.5247, 39.5692], [31, 30]],
        [[31, 36], [33.5138, 36.2765]],
        [[31, 36], [31, 30]],
        [[33.5138, 36.2765], [33, 45]],
        [[33.5138, 36.2765], [41, 30]],
        [[33.5138, 36.2765], [37, 40]],
        [[33, 45], [33, 50]],
        [[33, 45], [37, 40]],
        [[31, 30], [41, 30]],
        [[31, 30], [33, 13.1913]],
        [[31, 30], [16, 30]],
        [[41, 30], [41, 50]],
        [[-6.2088, 106.8456], [3, 101.6869]],
        [[24, 67], [33, 50]],
        [[24, 67], [31, 74.3436]],
        [[24, 90.4125], [31, 74.3436]],
        [[24, 90.4125], [3, 101.6869]],
        [[33, 50], [33, 67]],
        [[33, 50], [41, 50]],
        [[31, 74.3436], [33, 67]],
        [[33, -5], [37, 3.0588]],
        [[33, -5], [16, -5]],
        [[41, 67], [33, 67]],
        [[16, 45], [3, 45]],
        [[33, 13.1913], [37, 10]],
        [[37, 3.0588], [37, 10]],
        [[16, -5], [16, 10]],
        [[16, 30], [3, 45]],
        [[16, 30], [16, 10]],
        [[37, 40], [41, 30]],
        [[37, 40], [41, 50]]
      ]

      // Draw railway-style routes
      routes.forEach(coords => {
        // Main rail line (darker, solid)
        L.polyline(coords, {
          color: '#4a4a4a',
          weight: 4,
          opacity: 0.8
        }).addTo(map)
        
        // Railway ties (lighter, dashed perpendicular pattern)
        L.polyline(coords, {
          color: '#8B4513',
          weight: 6,
          opacity: 0.6,
          dashArray: '2,10'
        }).addTo(map)
        
        // Outer rails (parallel lines effect)
        L.polyline(coords, {
          color: '#2a2a2a',
          weight: 2,
          opacity: 0.7,
          dashArray: '1,0'
        }).addTo(map)
      })

      // Draw city markers with custom icons
      const markers: any[] = []
      cities.forEach(city => {
        const jitter = (Math.random() - 0.5) * 0.08
        const lat = city.Lat + jitter
        const lon = city.Lon + jitter
        
        // Add city icon marker
        const marker = L.marker([lat, lon], {
          icon: cityIcon(city.City),
          title: city.City,
          zIndexOffset: 500
        }).addTo(map)
        
        markers.push(marker)
        
        // Add label on top
        L.marker([lat, lon], {
          interactive: false,
          icon: labelIcon(city.City),
          zIndexOffset: 1500
        }).addTo(map)
      })

      // Fit map to show all markers
      const group = L.featureGroup(markers)
      map.fitBounds(group.getBounds().pad(0.15))
    }

    document.head.appendChild(script)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div className="absolute inset-0 z-40">
      {/* Leaflet Map Container */}
      <div
        ref={mapRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: '#f5f1e8'
        }}
      />
      
      {/* Info Panel */}
      <div className="absolute top-24 left-8 z-50 bg-gradient-to-br from-amber-50/95 to-yellow-50/95 backdrop-blur-sm border-2 border-amber-700/30 rounded-2xl px-6 py-4 shadow-2xl max-w-sm">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🚂</span>
          <h3 className="font-bold text-xl text-amber-900">Hajj Railway Network</h3>
        </div>
        <p className="text-sm text-amber-800 leading-relaxed">
          Historic pilgrimage railway routes connecting cities to the Holy Cities of <span className="font-bold text-amber-900">Mecca 🕋</span> and <span className="font-bold text-amber-900">Medina 🕌</span>.
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-24 z-50 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-2xl border-2 border-red-800/30 transition-all duration-300 hover:scale-105"
      >
        ✕ Close Map
      </button>
    </div>
  )
}