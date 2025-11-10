"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize2, Route } from "lucide-react"
import dynamic from "next/dynamic"
import gsap from "gsap"

// Dynamic imports to avoid SSR issues
const AncientRoutesOverlay = dynamic(
  () => import("@/components/AncientRoutesOverlay"),
  { ssr: false }
)

const LeafletMapOverlay = dynamic(
  () => import("@/components/LeafletMapOverlay"),
  { ssr: false }
)

export default function ClashMap() {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showLeafletMap, setShowLeafletMap] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const routesButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (showLeafletMap && routesButtonRef.current) {
      gsap.from(routesButtonRef.current, {
        scale: 1.2,
        duration: 0.3,
        ease: "bounce.out"
      })
    }
  }, [showLeafletMap])

  const handleWheel = (e: React.WheelEvent) => {
    if (showLeafletMap) return // Disable zooming when Leaflet is active
    e.preventDefault()
    const delta = e.deltaY * -0.001
    const newScale = Math.min(Math.max(1.0, scale + delta), 5)
    setScale(newScale)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (showLeafletMap) return // Disable dragging when Leaflet is active
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || showLeafletMap) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    if (showLeafletMap) return
    setScale(Math.min(scale + 0.3, 5))
  }

  const handleZoomOut = () => {
    if (showLeafletMap) return
    setScale(Math.max(scale - 0.3, 1.0))
  }

  const handleReset = () => {
    if (showLeafletMap) return
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const toggleLeafletMap = () => {
    setShowLeafletMap(!showLeafletMap)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#5a8a8a]">
      {/* Map Container - Both background and routes zoom together */}
      <div
        ref={containerRef}
        className="absolute inset-0"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: showLeafletMap ? 'default' : (isDragging ? 'grabbing' : 'grab')
        }}
      >
        {/* Background Image - Now zooms with the map */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
        >
          <img
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Generated-Image-November-10-2025-3_03PM-1762784204005.png"
            alt="Ancient World Map - 3D Relief Style"
            className="w-full h-full object-cover"
            style={{
              imageRendering: "auto",
            }}
            draggable={false}
          />
        </div>

        {/* Ancient Routes Overlay - Always visible, moves with background */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
        >
          <AncientRoutesOverlay 
            scale={scale}
            position={position}
          />
        </div>
      </div>

      {/* Leaflet Map Overlay - Shows on top when toggled */}
      {showLeafletMap && (
        <LeafletMapOverlay onClose={() => setShowLeafletMap(false)} />
      )}

      {/* Decorative Border Frame */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute inset-0 border-8 border-[#8B6914] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]" />
        <div className="absolute inset-2 border-4 border-[#D4AF37]" />
        
        {/* Corner Decorations */}
        <div className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 border-[#FFD700]" />
        <div className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-[#FFD700]" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4 border-[#FFD700]" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-[#FFD700]" />
      </div>

      {/* Hajj Express Banner - Top Right */}
      <div className="absolute top-8 right-8 z-30">
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl shadow-2xl border-2 border-[#D4AF37] px-6 py-3 flex items-center gap-3">
          <div className="text-4xl">🕋</div>
          <div>
            <h1 className="text-white font-bold text-2xl leading-tight">Hajj Express</h1>
            <p className="text-teal-100 text-sm">Journey to the Holy Land</p>
          </div>
        </div>
      </div>

      {/* Control Panel - Shifted Down */}
      <div className="absolute top-32 right-8 z-30 flex flex-col gap-2">
        <Button
          onClick={handleZoomIn}
          size="lg"
          disabled={showLeafletMap}
          className="bg-[#8B4513] hover:bg-[#A0522D] text-white shadow-xl border-2 border-[#D4AF37] w-14 h-14 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ZoomIn className="w-6 h-6" />
        </Button>
        <Button
          onClick={handleZoomOut}
          size="lg"
          disabled={showLeafletMap}
          className="bg-[#8B4513] hover:bg-[#A0522D] text-white shadow-xl border-2 border-[#D4AF37] w-14 h-14 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ZoomOut className="w-6 h-6" />
        </Button>
        <Button
          onClick={handleReset}
          size="lg"
          disabled={showLeafletMap}
          className="bg-[#8B4513] hover:bg-[#A0522D] text-white shadow-xl border-2 border-[#D4AF37] w-14 h-14 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Maximize2 className="w-6 h-6" />
        </Button>
      </div>

      {/* Leaflet Map Toggle Button - Below Banner */}
      <div className="absolute top-28 left-8 z-30">
        <Button
          ref={routesButtonRef}
          onClick={toggleLeafletMap}
          size="lg"
          className={`${
            showLeafletMap 
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700" 
              : "bg-gradient-to-r from-[#D4AF37] to-[#FFD700] hover:from-[#FFD700] hover:to-[#D4AF37]"
          } text-white shadow-xl border-2 border-[#D4AF37] px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105`}
        >
          <Route className="w-5 h-5 mr-2" />
          {showLeafletMap ? "🗺️ Leaflet Active" : "🌟 Show Leaflet Map"}
        </Button>
      </div>
    </div>
  )
}