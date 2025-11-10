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

      // Add vibrant colorful tile layer
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        opacity: 0.4,
        attribution: '&copy; Esri'
      }).addTo(map)

      // Add watercolor overlay for artistic effect
      L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg', {
        maxZoom: 16,
        opacity: 0.6,
        attribution: '&copy; Stamen Design'
      }).addTo(map)

      // Fetch and add colorful coastline overlay
      fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_coastline.geojson')
        .then(r => r.json())
        .then(geo => {
          L.geoJSON(geo, {
            style: { color: '#2E7D32', weight: 2.5, opacity: 0.8 }
          }).addTo(map)
        })
        .catch(err => console.warn('Coastline data not available:', err))

      // Icon mapping with enhanced emojis
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

      // Get vibrant colors for different route types
      const getRouteColor = (index: number) => {
        const colors = [
          '#FF6B6B', '#4ECDC4', '#FFD93D', '#6BCF7F', '#A78BFA',
          '#FB7185', '#38BDF8', '#FBBF24', '#34D399', '#F472B6',
          '#60A5FA', '#FCD34D', '#F97316', '#14B8A6', '#8B5CF6'
        ]
        return colors[index % colors.length]
      }

      // Enhanced custom icon with glow effects
      const cityIcon = (cityName: string) => {
        const emoji = getCityIcon(cityName)
        const isHolyCity = cityName === "Mecca" || cityName === "Medina"
        const glowColor = isHolyCity ? 'rgba(255, 215, 0, 0.9)' : 'rgba(100, 200, 255, 0.7)'
        
        return L.divIcon({
          className: 'custom-city-icon',
          html: `
            <div style="
              font-size: 36px;
              text-shadow: 
                0 0 20px ${glowColor},
                0 0 40px ${glowColor},
                0 2px 12px rgba(0,0,0,0.6);
              filter: 
                drop-shadow(0 4px 8px rgba(0,0,0,0.4))
                drop-shadow(0 0 15px ${glowColor});
              animation: pulse 2s ease-in-out infinite;
            ">
              ${emoji}
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        })
      }

      const labelIcon = (text: string) => {
        const isHolyCity = text === "Mecca" || text === "Medina"
        const labelColor = isHolyCity ? '#D4AF37' : '#1E40AF'
        const bgGradient = isHolyCity 
          ? 'linear-gradient(135deg, rgba(255,215,0,0.95), rgba(255,193,7,0.95))'
          : 'linear-gradient(135deg, rgba(59,130,246,0.95), rgba(147,197,253,0.95))'
        
        return L.divIcon({
          className: 'custom-label',
          html: `
            <div style="
              font: bold 14px/1.2 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: white;
              background: ${bgGradient};
              padding: 4px 12px;
              border-radius: 12px;
              border: 2px solid white;
              white-space: nowrap;
              pointer-events: none;
              letter-spacing: 0.5px;
              box-shadow: 
                0 4px 12px rgba(0,0,0,0.3),
                0 0 20px rgba(255,255,255,0.4),
                inset 0 1px 2px rgba(255,255,255,0.5);
              transform: translateY(-8px);
            ">
              ${text}
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, -24]
        })
      }

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

      // Draw vibrant colorful railway routes
      routes.forEach((coords, index) => {
        const routeColor = getRouteColor(index)
        
        // Outer glow effect
        L.polyline(coords, {
          color: routeColor,
          weight: 10,
          opacity: 0.3,
          className: 'route-glow'
        }).addTo(map)
        
        // Main railway line with gradient effect
        L.polyline(coords, {
          color: routeColor,
          weight: 6,
          opacity: 0.85,
          className: 'route-main'
        }).addTo(map)
        
        // Railway ties pattern
        L.polyline(coords, {
          color: '#FFF',
          weight: 8,
          opacity: 0.4,
          dashArray: '3,12',
          className: 'route-ties'
        }).addTo(map)
        
        // Inner highlight
        L.polyline(coords, {
          color: '#FFFFFF',
          weight: 2,
          opacity: 0.6,
          className: 'route-highlight'
        }).addTo(map)
      })

      // Draw city markers with enhanced icons
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
        
        // Add enhanced label on top
        L.marker([lat, lon], {
          interactive: false,
          icon: labelIcon(city.City),
          zIndexOffset: 1500
        }).addTo(map)
      })

      // Add CSS animations
      const style = document.createElement('style')
      style.textContent = `
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .leaflet-interactive:hover {
          filter: brightness(1.2) drop-shadow(0 0 20px currentColor);
          transition: all 0.3s ease;
        }
      `
      document.head.appendChild(style)

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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      />
      
      {/* Enhanced Info Panel */}
      <div className="absolute top-24 left-8 z-50 bg-gradient-to-br from-purple-600/95 via-pink-500/95 to-orange-400/95 backdrop-blur-lg border-4 border-white/40 rounded-3xl px-8 py-6 shadow-2xl max-w-md">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-5xl animate-bounce">🚂</span>
          <h3 className="font-black text-2xl text-white drop-shadow-lg">Hajj Railway Network</h3>
        </div>
        <p className="text-base text-white/95 leading-relaxed font-medium drop-shadow-md">
          Vibrant pilgrimage railway routes connecting cities to <span className="font-black text-yellow-300 drop-shadow-lg">Mecca 🕋</span> and <span className="font-black text-yellow-300 drop-shadow-lg">Medina 🕌</span>.
        </p>
        <div className="mt-4 flex gap-2">
          <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"></div>
          <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
        </div>
      </div>

      {/* Enhanced Close Button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-24 z-50 bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 hover:from-red-700 hover:via-pink-700 hover:to-rose-700 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-2xl border-4 border-white/40 transition-all duration-300 hover:scale-110 hover:rotate-2"
      >
        ✕ Close Map
      </button>
    </div>
  )
}