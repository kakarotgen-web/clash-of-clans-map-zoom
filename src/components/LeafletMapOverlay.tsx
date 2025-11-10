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
      
      // Initialize map with less zoom control
      const map = L.map(mapRef.current, { 
        zoomControl: true,
        minZoom: 3,
        maxZoom: 8
      })
      mapInstanceRef.current = map

      // Use Stamen Watercolor for ancient parchment look (no API key required)
      L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg', {
        maxZoom: 8,
        opacity: 0.85,
        attribution: '&copy; Stamen Design'
      }).addTo(map)

      // Add overlay for ancient aesthetic
      L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain_lines/{z}/{x}/{y}{r}.png', {
        maxZoom: 8,
        opacity: 0.3,
        attribution: ''
      }).addTo(map)

      // Icon mapping with city type classification
      const getCityType = (cityName: string): 'holy' | 'major' | 'port' | 'trade' => {
        if (cityName === "Mecca" || cityName === "Medina") return 'holy'
        if (["Jakarta", "Kuala Lumpur", "Dar es Salaam", "Mogadishu", "Karachi"].includes(cityName)) return 'port'
        if (["Timbuktu", "Kano", "Fez", "Damascus", "Baghdad"].includes(cityName)) return 'trade'
        return 'major'
      }

      // Get ancient-themed colors for routes
      const getRouteColor = (index: number) => {
        const ancientColors = [
          '#8B6914', // Dark gold
          '#A0522D', // Sienna
          '#CD853F', // Peru
          '#D4AF37', // Metallic gold
          '#B8860B', // Dark goldenrod
          '#DAA520', // Goldenrod
          '#8B4513', // Saddle brown
          '#A0522D', // Sienna
        ]
        return ancientColors[index % ancientColors.length]
      }

      // Enhanced Clash of Clans style icons
      const cityIcon = (cityName: string) => {
        const cityType = getCityType(cityName)
        const isHolyCity = cityType === 'holy'
        
        // Get city initial or special symbol
        const getSymbol = () => {
          if (cityName === "Mecca") return "🕋"
          if (cityName === "Medina") return "🕌"
          return cityName.charAt(0).toUpperCase()
        }
        
        return L.divIcon({
          className: 'custom-city-icon',
          html: `
            <div style="
              position: relative;
              width: 52px;
              height: 52px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <!-- Outer golden ring with 3D effect -->
              <div style="
                position: absolute;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
                border-radius: 50%;
                box-shadow: 
                  0 6px 16px rgba(0, 0, 0, 0.7),
                  inset 0 3px 8px rgba(255, 255, 255, 0.6),
                  inset 0 -3px 8px rgba(0, 0, 0, 0.5),
                  0 0 ${isHolyCity ? '30px rgba(255, 215, 0, 0.9)' : '20px rgba(212, 175, 55, 0.6)'};
              "></div>
              
              <!-- Middle golden band -->
              <div style="
                position: absolute;
                width: 46px;
                height: 46px;
                background: linear-gradient(135deg, #8B6914, #D4AF37, #8B6914);
                border-radius: 50%;
                box-shadow: 
                  inset 0 2px 6px rgba(255, 215, 0, 0.5),
                  inset 0 -2px 6px rgba(0, 0, 0, 0.6);
              "></div>
              
              <!-- Inner background circle -->
              <div style="
                position: absolute;
                width: 38px;
                height: 38px;
                background: ${isHolyCity 
                  ? 'radial-gradient(circle, #2C7A7B 0%, #1a4d4e 100%)' 
                  : 'radial-gradient(circle, #8B4513 0%, #5a2d0c 100%)'};
                border-radius: 50%;
                box-shadow: 
                  inset 0 3px 8px rgba(0, 0, 0, 0.8),
                  inset 0 -1px 4px rgba(255, 255, 255, 0.2);
              "></div>
              
              <!-- Icon/Letter -->
              <div style="
                position: relative;
                font-size: ${cityType === 'holy' ? '24px' : '20px'};
                font-weight: 900;
                color: ${isHolyCity ? '#FFD700' : '#D4AF37'};
                z-index: 10;
                text-shadow: 
                  0 2px 4px rgba(0, 0, 0, 0.9),
                  0 0 8px ${isHolyCity ? 'rgba(255, 215, 0, 0.8)' : 'rgba(212, 175, 55, 0.5)'};
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
              ">
                ${getSymbol()}
              </div>
              
              ${isHolyCity ? `
                <!-- Holy city decorative stars -->
                <div style="
                  position: absolute;
                  top: -6px;
                  right: -6px;
                  font-size: 14px;
                  filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.8));
                  animation: starRotate 3s linear infinite;
                ">⭐</div>
                <div style="
                  position: absolute;
                  bottom: -6px;
                  left: -6px;
                  font-size: 14px;
                  filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.8));
                  animation: starRotate 3s linear infinite reverse;
                ">⭐</div>
              ` : ''}
            </div>
          `,
          iconSize: [52, 52],
          iconAnchor: [26, 26]
        })
      }

      const labelIcon = (text: string) => {
        const cityType = getCityType(text)
        const isHolyCity = cityType === 'holy'
        
        return L.divIcon({
          className: 'custom-label',
          html: `
            <div style="
              font: bold 13px/1.3 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
              color: white;
              background: ${isHolyCity 
                ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)' 
                : 'linear-gradient(135deg, #8B6914 0%, #D4AF37 50%, #8B6914 100%)'};
              padding: 5px 12px;
              border-radius: 10px;
              border: 2.5px solid ${isHolyCity ? '#FFD700' : '#D4AF37'};
              white-space: nowrap;
              pointer-events: none;
              letter-spacing: 0.8px;
              box-shadow: 
                0 4px 12px rgba(0, 0, 0, 0.7),
                0 0 ${isHolyCity ? '20px rgba(255, 215, 0, 0.6)' : '12px rgba(139, 105, 20, 0.4)'},
                inset 0 1px 3px rgba(255, 255, 255, 0.5),
                inset 0 -1px 3px rgba(0, 0, 0, 0.4);
              transform: translateY(-8px);
              text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.9);
            ">
              ${text}
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, -30]
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

      // Draw ancient-themed railway routes
      routes.forEach((coords, index) => {
        const routeColor = getRouteColor(index)
        
        // Outer glow shadow
        L.polyline(coords, {
          color: '#000000',
          weight: 12,
          opacity: 0.25,
          className: 'route-shadow'
        }).addTo(map)
        
        // Outer golden border
        L.polyline(coords, {
          color: '#D4AF37',
          weight: 9,
          opacity: 0.8,
          className: 'route-border'
        }).addTo(map)
        
        // Main railway line
        L.polyline(coords, {
          color: routeColor,
          weight: 6,
          opacity: 0.9,
          className: 'route-main'
        }).addTo(map)
        
        // Railway ties pattern (dashed white)
        L.polyline(coords, {
          color: '#FFF',
          weight: 7,
          opacity: 0.5,
          dashArray: '2,10',
          className: 'route-ties'
        }).addTo(map)
        
        // Inner highlight
        L.polyline(coords, {
          color: '#FFE4B5',
          weight: 2,
          opacity: 0.7,
          className: 'route-highlight'
        }).addTo(map)
      })

      // Draw city markers with Clash of Clans style icons
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

      // Add CSS animations
      const style = document.createElement('style')
      style.textContent = `
        @keyframes starRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .custom-city-icon {
          animation: iconFloat 3s ease-in-out infinite;
        }
        
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        
        .leaflet-interactive:hover {
          filter: brightness(1.15);
          transition: all 0.2s ease;
        }
        
        /* Hide default Leaflet attribution */
        .leaflet-control-attribution {
          background: rgba(139, 105, 20, 0.8) !important;
          color: #FFD700 !important;
          font-size: 10px !important;
          padding: 2px 6px !important;
          border-radius: 4px !important;
        }
      `
      document.head.appendChild(style)

      // Fit map to show all markers with padding
      const group = L.featureGroup(markers)
      map.fitBounds(group.getBounds().pad(0.12))
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
          background: 'linear-gradient(135deg, #8B7355 0%, #A0826D 50%, #8B7355 100%)'
        }}
      />
      
      {/* Ancient-themed Info Panel */}
      <div className="absolute top-24 left-8 z-50 bg-gradient-to-br from-[#8B6914]/95 via-[#D4AF37]/95 to-[#8B6914]/95 backdrop-blur-lg border-4 border-[#FFD700] rounded-2xl px-8 py-6 shadow-2xl max-w-md">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-4xl">🚂</span>
          <h3 className="font-black text-2xl text-white drop-shadow-lg">Hajj Railway Network</h3>
        </div>
        <p className="text-base text-white/95 leading-relaxed font-medium drop-shadow-md">
          Ancient pilgrimage routes connecting cities to <span className="font-black text-yellow-200 drop-shadow-lg">Mecca 🕋</span> and <span className="font-black text-yellow-200 drop-shadow-lg">Medina 🕌</span>.
        </p>
        <div className="mt-4 flex gap-2">
          <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-[#8B4513] via-[#D4AF37] to-[#8B6914]"></div>
        </div>
      </div>

      {/* Ancient-themed Close Button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-24 z-50 bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] hover:from-[#A0522D] hover:via-[#8B4513] hover:to-[#A0522D] text-white px-8 py-4 rounded-2xl font-black text-lg shadow-2xl border-4 border-[#D4AF37] transition-all duration-300 hover:scale-105"
      >
        ✕ Close Map
      </button>
    </div>
  )
}