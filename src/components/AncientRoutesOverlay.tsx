"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { 
  MapPin, 
  Building2, 
  Castle, 
  Ship, 
  Mountain, 
  Palmtree,
  Building,
  Home,
  Church
} from "lucide-react"

interface City {
  City: string
  Lat: number
  Lon: number
  icon?: string
}

interface RouteOverlayProps {
  scale: number
  position: { x: number; y: number }
}

const cities: City[] = [
  { City: "Jakarta", Lat: -6, Lon: 106.8456, icon: "ship" },
  { City: "Dar es Salaam", Lat: -6, Lon: 39, icon: "ship" },
  { City: "Mogadishu", Lat: 3.0, Lon: 45.0, icon: "palmtree" },
  { City: "Kuala Lumpur", Lat: 3.0, Lon: 101.6869, icon: "building" },
  { City: "Timbuktu", Lat: 16.0, Lon: -5.0, icon: "castle" },
  { City: "Kano", Lat: 16.0, Lon: 10.0, icon: "building2" },
  { City: "Khartoum", Lat: 16.0, Lon: 30.0, icon: "palmtree" },
  { City: "Sana'a", Lat: 16.0, Lon: 45.0, icon: "mountain" },
  { City: "Mecca", Lat: 21.3891, Lon: 40.0, icon: "kaaba" },
  { City: "Medina", Lat: 24.5247, Lon: 39.5692, icon: "church" },
  { City: "Karachi", Lat: 24.0, Lon: 67.0, icon: "ship" },
  { City: "Dhaka", Lat: 24.0, Lon: 90.4125, icon: "building" },
  { City: "Cairo", Lat: 31.0, Lon: 30.0, icon: "castle" },
  { City: "Jerusalem", Lat: 31.0, Lon: 36.0, icon: "church" },
  { City: "Lahore", Lat: 31.0, Lon: 74.3436, icon: "castle" },
  { City: "Fez", Lat: 33.0, Lon: -5.0, icon: "building2" },
  { City: "Tripoli", Lat: 33.0, Lon: 13.1913, icon: "palmtree" },
  { City: "Damascus", Lat: 33.5138, Lon: 36.2765, icon: "castle" },
  { City: "Baghdad", Lat: 33.0, Lon: 45.0, icon: "castle" },
  { City: "Tehran", Lat: 33.0, Lon: 50.0, icon: "mountain" },
  { City: "Kabul", Lat: 33.0, Lon: 67.0, icon: "mountain" },
  { City: "Algiers", Lat: 37.0, Lon: 3.0588, icon: "building2" },
  { City: "Tunis", Lat: 37.0, Lon: 10.0, icon: "building2" },
  { City: "Diyarbakir", Lat: 37.0, Lon: 40.0, icon: "castle" },
  { City: "Istanbul", Lat: 41.0, Lon: 30.0, icon: "castle" },
  { City: "Baku", Lat: 41.0, Lon: 50.0, icon: "building" },
  { City: "Tashkent", Lat: 41.0, Lon: 67.0, icon: "building" },
]

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
  [[37, 40], [41, 50]],
]

// Icon mapping with colors
const getIconComponent = (iconName?: string) => {
  const iconMap: Record<string, typeof MapPin> = {
    ship: Ship,
    palmtree: Palmtree,
    building: Building,
    building2: Building2,
    castle: Castle,
    mountain: Mountain,
    church: Church,
    mappin: MapPin,
  }
  return iconMap[iconName || "mappin"] || MapPin
}

const getIconColor = (iconName?: string) => {
  const colorMap: Record<string, string> = {
    ship: "#3b82f6",        // Bright blue
    palmtree: "#10b981",    // Emerald green
    building: "#0ea5e9",    // Sky blue
    building2: "#14b8a6",   // Teal
    castle: "#ec4899",      // Pink/Magenta
    mountain: "#a855f7",    // Purple
    church: "#f97316",      // Orange
    kaaba: "#eab308",       // Golden yellow (for Mecca's circle)
    mappin: "#06b6d4",      // Cyan
  }
  return colorMap[iconName || "mappin"] || "#06b6d4"
}

export default function AncientRoutesOverlay({ scale, position }: RouteOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const citiesRef = useRef<(SVGGElement | null)[]>([])
  const routesRef = useRef<(SVGPathElement | null)[]>([])
  const [clickedCities, setClickedCities] = useState<Set<string>>(new Set())

  // Map Leaflet coordinates to pixel positions on the full-screen 3D relief map
  const latLonToPixel = (lat: number, lon: number) => {
    // World map geographic bounds
    const minLat = -60  // Bottom of world map
    const maxLat = 85   // Top of world map
    const minLon = -180 // Left edge
    const maxLon = 180  // Right edge
    
    // Use full viewport dimensions
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1600
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 900
    
    // Normalize coordinates to 0-1 range
    const normLon = (lon - minLon) / (maxLon - minLon)
    const normLat = (lat - minLat) / (maxLat - minLat)
    
    // Convert to pixel coordinates (invert Y for standard map projection)
    const x = normLon * viewportWidth
    const y = (1 - normLat) * viewportHeight
    
    return { x, y }
  }

  const handleCityClick = (cityName: string) => {
    setClickedCities(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cityName)) {
        newSet.delete(cityName)
      } else {
        newSet.add(cityName)
      }
      return newSet
    })
  }

  useEffect(() => {
    if (!svgRef.current) return

    gsap.killTweensOf(routesRef.current)
    gsap.killTweensOf(citiesRef.current)

    // Animate routes with drawing effect
    routesRef.current.forEach((path, i) => {
      if (path) {
        const length = path.getTotalLength()
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length
        })
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.5,
          delay: i * 0.03,
          ease: "power2.inOut"
        })
      }
    })

    // Animate cities appearing
    citiesRef.current.forEach((city, i) => {
      if (city) {
        gsap.fromTo(
          city,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            delay: 0.6 + i * 0.02,
            ease: "back.out(1.7)"
          }
        )
      }
    })

    // Special pulsing animation for Mecca
    const meccaIndex = cities.findIndex(c => c.City === "Mecca")
    if (meccaIndex !== -1 && citiesRef.current[meccaIndex]) {
      gsap.to(citiesRef.current[meccaIndex], {
        opacity: 0.7,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
    }
  }, [])

  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1600
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 900

  return (
    <svg
      ref={svgRef}
      className="absolute top-0 left-0"
      style={{
        width: `${viewportWidth}px`,
        height: `${viewportHeight}px`,
        overflow: "visible",
        pointerEvents: "auto"
      }}
    >
      <defs>
        {/* Railway track pattern */}
        <pattern id="railwayTrack" x="0" y="0" width="30" height="10" patternUnits="userSpaceOnUse">
          {/* Rails */}
          <line x1="0" y1="3" x2="30" y2="3" stroke="#4a4a4a" strokeWidth="2" />
          <line x1="0" y1="7" x2="30" y2="7" stroke="#4a4a4a" strokeWidth="2" />
          {/* Ties/Sleepers */}
          <rect x="2" y="2" width="4" height="6" fill="#8B4513" />
          <rect x="12" y="2" width="4" height="6" fill="#8B4513" />
          <rect x="22" y="2" width="4" height="6" fill="#8B4513" />
        </pattern>

        {/* Golden glow for Mecca */}
        <filter id="meccaGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Shadow filter */}
        <filter id="dropShadow">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Draw routes first (behind cities) with railway track pattern */}
      <g className="routes-layer">
        {routes.map((route, i) => {
          const start = latLonToPixel(route[0][0], route[0][1])
          const end = latLonToPixel(route[1][0], route[1][1])
          const routeWidth = Math.max(3, 6 / Math.sqrt(scale))
          
          return (
            <g key={`route-${i}`}>
              {/* Base railway track */}
              <line
                ref={el => routesRef.current[i] = el}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#654321"
                strokeWidth={routeWidth}
                opacity="0.5"
              />
              {/* Railway ties */}
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#4a4a4a"
                strokeWidth={routeWidth * 0.5}
                strokeDasharray={`${routeWidth * 0.5} ${routeWidth * 1.7}`}
                strokeLinecap="square"
                opacity="0.7"
              />
              {/* Railway rails - top */}
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#696969"
                strokeWidth={routeWidth * 0.17}
                opacity="0.8"
                style={{
                  transform: `translateY(${-routeWidth * 0.25}px)`
                }}
              />
              {/* Railway rails - bottom */}
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#696969"
                strokeWidth={routeWidth * 0.17}
                opacity="0.8"
                style={{
                  transform: `translateY(${routeWidth * 0.25}px)`
                }}
              />
            </g>
          )
        })}
      </g>

      {/* Draw cities on top with colorful icons */}
      <g className="cities-layer">
        {cities.map((city, i) => {
          const pos = latLonToPixel(city.Lat, city.Lon)
          const isMecca = city.City === "Mecca"
          const isKaaba = city.icon === "kaaba"
          const isClicked = clickedCities.has(city.City)
          const iconSize = isMecca ? 32 : 20
          const circleSize = isMecca ? 36 : 24
          const Icon = getIconComponent(city.icon)
          const iconColor = getIconColor(city.icon)
          
          return (
            <g
              key={city.City}
              ref={el => citiesRef.current[i] = el}
              transform={`translate(${pos.x}, ${pos.y})`}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation()
                handleCityClick(city.City)
              }}
            >
              {/* Special styling for Mecca with Kaaba emoji and glow effect */}
              {isMecca && isKaaba ? (
                <g>
                  {/* Outer golden glow circle */}
                  <circle
                    r={circleSize / 2}
                    fill={iconColor}
                    opacity="0.9"
                    filter="url(#meccaGlow)"
                  />
                  {/* Kaaba Emoji 🕋 */}
                  <foreignObject
                    x={-iconSize / 2}
                    y={-iconSize / 2}
                    width={iconSize}
                    height={iconSize}
                    style={{ pointerEvents: "none" }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: `${iconSize * 0.75}px`,
                        filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.8))'
                      }}
                    >
                      🕋
                    </div>
                  </foreignObject>
                </g>
              ) : (
                <g>
                  {/* Colored circle background */}
                  <circle
                    r={circleSize / 2}
                    fill={iconColor}
                    filter="url(#dropShadow)"
                  />
                  {/* White icon on top */}
                  <foreignObject
                    x={-iconSize / 2}
                    y={-iconSize / 2}
                    width={iconSize}
                    height={iconSize}
                    style={{ pointerEvents: "none" }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon
                        style={{
                          width: `${iconSize * 0.6}px`,
                          height: `${iconSize * 0.6}px`,
                          color: '#ffffff',
                          strokeWidth: 2.5
                        }}
                      />
                    </div>
                  </foreignObject>
                </g>
              )}
              
              {/* City label - only show if clicked */}
              {isClicked && (
                <text
                  y={isMecca ? 38 : 28}
                  textAnchor="middle"
                  style={{
                    fill: isMecca ? "#FFD700" : "#ffffff",
                    fontSize: `${isMecca ? 11 : 10}px`,
                    fontWeight: 700,
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                    textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                    pointerEvents: "none"
                  }}
                >
                  {city.City}
                </text>
              )}
            </g>
          )
        })}
      </g>
    </svg>
  )
}