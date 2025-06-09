"use client"

import { useState, useEffect } from "react"

export default function InfoPanel({ selectedPlanet, isLightTheme }) {
  const [showPlanetInfo, setShowPlanetInfo] = useState(false)

  useEffect(() => {
    if (selectedPlanet) {
      setShowPlanetInfo(true)
      const timer = setTimeout(() => setShowPlanetInfo(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [selectedPlanet])

  return (
    <div className="absolute bottom-4 right-4 z-10 max-w-xs">
      <div
        className={`p-4 rounded-lg border backdrop-blur-sm ${
          isLightTheme ? "bg-white/90 text-black border-black/20" : "bg-black/80 text-white border-white/20"
        }`}
      >
        <h3 className="font-bold mb-2">Planet Information</h3>

        {showPlanetInfo && selectedPlanet ? (
          <div>
            <strong className="text-yellow-400">{selectedPlanet.name}</strong>
            <br />
            <span className="text-sm">{selectedPlanet.info}</span>
          </div>
        ) : (
          <div className="text-sm space-y-1">
            <p>
              <strong>Controls:</strong>
            </p>
            <p>🖱️ Click and drag to rotate</p>
            <p>🔍 Scroll to zoom</p>
            <p>🎯 Click planets for info</p>
            <p>🎚️ Use sliders to control speed</p>
          </div>
        )}
      </div>
    </div>
  )
}
