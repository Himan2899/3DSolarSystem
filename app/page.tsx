"use client"

import React, { useState, useEffect, useRef } from "react"

// Add type definitions
interface Star {
  x: number
  y: number
  z: number
  size: number
  color: string
  twinkleSpeed: number
  twinkleDelay: number
}

interface Asteroid {
  id: number
  angle: number
  distance: number
  size: number
  speed: number
  verticalOffset: number
  rotationSpeed: number
  shape: number
  color: string
  name: string
  info: string
}

interface Planet {
  name: string
  color: string
  size: number
  distance: number
  info: string
}

interface Comet {
  name: string
  color: string
  size: number
  speed: number
  path: string
  info: string
}

interface SpaceStation {
  name: string
  color: string
  size: number
  distance: number
  speed: number
  altitude: string
  info: string
  shape: string
}

type SelectedObject = {
  type: 'planet' | 'comet' | 'asteroid' | 'station'
  name: string
  color: string
  size: number
  info: string
  // Optional properties based on type
  distance?: number
  speed?: number
  path?: string
  altitude?: string
  shape?: string | number
  id?: number
  angle?: number
  verticalOffset?: number
  rotationSpeed?: number
} & (
  | { type: 'station'; shape: string }
  | { type: 'asteroid'; shape: number }
  | { type: 'planet' | 'comet' }
)

const SolarSystemPage: React.FC = () => {
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [isLightTheme, setIsLightTheme] = useState<boolean>(false)
  const [planetSpeeds, setPlanetSpeeds] = useState<number[]>([4.15, 1.62, 1.0, 0.53, 0.08, 0.03, 0.01, 0.006])
  const [selectedPlanet, setSelectedPlanet] = useState<SelectedObject | null>(null)
  const [showComets, setShowComets] = useState<boolean>(true)
  const [showAsteroids, setShowAsteroids] = useState<boolean>(true)
  const [showSpaceStations, setShowSpaceStations] = useState<boolean>(true)
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [showAboutCreator, setShowAboutCreator] = useState<boolean>(false)
  const animationRef = useRef<number | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState<boolean>(false)
  const [asteroidBeltData, setAsteroidBeltData] = useState<Asteroid[]>([])

  const planetData = [
    { name: "Mercury", color: "#8c7853", size: 8, distance: 80, info: "Closest planet to the Sun" },
    { name: "Venus", color: "#ffc649", size: 12, distance: 110, info: "Hottest planet in our solar system" },
    { name: "Earth", color: "#6b93d6", size: 14, distance: 140, info: "Our home planet with water and life" },
    { name: "Mars", color: "#c1440e", size: 10, distance: 170, info: "The Red Planet with polar ice caps" },
    { name: "Jupiter", color: "#d8ca9d", size: 28, distance: 220, info: "Largest planet with Great Red Spot" },
    { name: "Saturn", color: "#fad5a5", size: 24, distance: 270, info: "Beautiful planet with prominent rings" },
    { name: "Uranus", color: "#4fd0e7", size: 18, distance: 320, info: "Ice giant tilted on its side" },
    { name: "Neptune", color: "#4b70dd", size: 16, distance: 370, info: "Windiest planet in the solar system" },
  ]

  const cometData = [
    {
      name: "Halley's Comet",
      color: "#87CEEB",
      size: 4,
      speed: 0.8,
      path: "elliptical",
      info: "Famous comet visible every 75-76 years",
    },
    {
      name: "Hale-Bopp",
      color: "#FFE4B5",
      size: 3,
      speed: 0.6,
      path: "parabolic",
      info: "Great comet of 1997, visible for 18 months",
    },
    {
      name: "NEOWISE",
      color: "#F0E68C",
      size: 3,
      speed: 1.2,
      path: "hyperbolic",
      info: "Discovered in 2020, visible to naked eye",
    },
  ]

  // Space Stations orbiting Earth
  const spaceStationData = [
    {
      name: "International Space Station (ISS)",
      color: "#C0C0C0",
      size: 3,
      distance: 25,
      speed: 8.0,
      altitude: "408 km",
      info: "Largest human-made object in space, home to astronauts from around the world",
      shape: "rectangular",
    },
    {
      name: "Tiangong Space Station",
      color: "#FFD700",
      size: 2.5,
      distance: 28,
      speed: 7.5,
      altitude: "340-450 km",
      info: "China's modular space station, operational since 2021",
      shape: "modular",
    },
    {
      name: "Hubble Space Telescope",
      color: "#4169E1",
      size: 2,
      distance: 32,
      speed: 7.2,
      altitude: "547 km",
      info: "Famous space telescope providing stunning images of the universe since 1990",
      shape: "cylindrical",
    },
    {
      name: "James Webb Space Telescope",
      color: "#FF6347",
      size: 2.5,
      distance: 35,
      speed: 6.8,
      altitude: "1.5M km",
      info: "Most powerful space telescope ever built, launched in 2021",
      shape: "hexagonal",
    },
    {
      name: "Starlink Satellite",
      color: "#87CEEB",
      size: 1.5,
      distance: 22,
      speed: 9.0,
      altitude: "550 km",
      info: "Part of SpaceX's internet constellation with thousands of satellites",
      shape: "flat",
    },
    {
      name: "GPS Satellite",
      color: "#32CD32",
      size: 1.8,
      distance: 38,
      speed: 6.0,
      altitude: "20,200 km",
      info: "Global Positioning System satellite for navigation worldwide",
      shape: "solar",
    },
  ]

  // Generate star data
  const starData = useRef(
    Array.from({ length: 1000 }, () => {
      const distance = 800 + Math.random() * 1200
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      const x = distance * Math.sin(phi) * Math.cos(theta)
      const y = distance * Math.sin(phi) * Math.sin(theta)
      const z = distance * Math.cos(phi)

      return {
        x,
        y,
        z,
        size: 0.5 + Math.random() * 2,
        color: ["#ffffff", "#fffaf0", "#f8f8ff", "#f0f8ff", "#f0ffff", "#f5f5f5", "#fff0f5", "#fffafa"][
          Math.floor(Math.random() * 8)
        ],
        twinkleSpeed: 0.5 + Math.random() * 2,
        twinkleDelay: Math.random() * 5,
      }
    }),
  ).current

  const updatePlanetSpeed = (index: number, speed: number) => {
    const newSpeeds = [...planetSpeeds]
    newSpeeds[index] = speed
    setPlanetSpeeds(newSpeeds)
  }

  const togglePause = () => setIsPaused(!isPaused)
  const toggleTheme = () => setIsLightTheme(!isLightTheme)

  // Zoom functions
  const handleZoomChange = (newZoom: number) => {
    setZoomLevel(Math.max(0.2, Math.min(3, newZoom)))
  }

  const zoomIn = () => {
    setZoomLevel((prev: number) => Math.min(3, prev + 0.2))
  }

  const zoomOut = () => {
    setZoomLevel((prev: number) => Math.max(0.2, prev - 0.2))
  }

  const resetZoom = () => {
    setZoomLevel(1)
  }

  // Animation loop
  useEffect(() => {
    const startTime = Date.now()

    const animate = () => {
      if (!isPaused) {
        const currentTime = Date.now()
        const elapsed = (currentTime - startTime) / 1000

        // Animate planets
        planetData.forEach((planet, index) => {
          const planetElement = document.getElementById(`planet-${index}`)
          if (planetElement) {
            const angle = elapsed * planetSpeeds[index] * 0.1
            const x = Math.cos(angle) * planet.distance
            const z = Math.sin(angle) * planet.distance

            planetElement.style.transform = `translate3d(${x}px, 0px, ${z}px) rotateY(${elapsed * 50}deg)`
          }
        })

        // Rotate sun
        const sunElement = document.getElementById("sun")
        if (sunElement) {
          sunElement.style.transform = `rotateY(${elapsed * 20}deg) scale(${1 + Math.sin(elapsed * 2) * 0.05})`
        }

        // Animate stars (subtle twinkling)
        starData.forEach((star: Star, index: number) => {
          const starElement = document.getElementById(`star-${index}`)
          if (starElement && !isLightTheme) {
            const twinkle = 0.3 + Math.sin(elapsed * star.twinkleSpeed + star.twinkleDelay) * 0.7
            starElement.style.opacity = twinkle.toString()
          }
        })

        // Animate space stations around Earth
        if (showSpaceStations) {
          const earthAngle = elapsed * planetSpeeds[2] * 0.1 // Earth is index 2
          const earthX = Math.cos(earthAngle) * planetData[2].distance
          const earthZ = Math.sin(earthAngle) * planetData[2].distance

          spaceStationData.forEach((station, index) => {
            const stationElement = document.getElementById(`station-${index}`)
            if (stationElement) {
              const stationAngle = elapsed * station.speed * 0.1
              const localX = Math.cos(stationAngle) * station.distance
              const localZ = Math.sin(stationAngle) * station.distance
              const localY = Math.sin(elapsed * 2 + index) * 3

              // Position relative to Earth
              const finalX = earthX + localX
              const finalZ = earthZ + localZ

              stationElement.style.transform = `translate3d(${finalX}px, ${localY}px, ${finalZ}px) rotateY(${elapsed * 100}deg) rotateX(${elapsed * 80}deg)`
            }
          })
        }

        // Animate asteroids
        if (showAsteroids) {
          asteroidBeltData.forEach((asteroid: Asteroid) => {
            const asteroidElement = document.getElementById(`asteroid-${asteroid.id}`)
            if (asteroidElement) {
              const currentAngle = asteroid.angle + elapsed * asteroid.speed * 0.02
              const x = Math.cos(currentAngle) * asteroid.distance
              const z = Math.sin(currentAngle) * asteroid.distance
              const y = asteroid.verticalOffset + Math.sin(elapsed + asteroid.id) * 5

              const rotationX = elapsed * asteroid.rotationSpeed * 30
              const rotationY = elapsed * asteroid.rotationSpeed * 20
              const rotationZ = elapsed * asteroid.rotationSpeed * 40

              asteroidElement.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg)`
            }
          })
        }

        // Animate comets
        cometData.forEach((comet, index) => {
          const cometElement = document.getElementById(`comet-${index}`)
          if (cometElement && showComets) {
            let x, z, scale

            if (comet.path === "elliptical") {
              const angle = elapsed * comet.speed * 0.05
              const a = 400
              const b = 200
              x = Math.cos(angle) * a
              z = Math.sin(angle) * b
              scale = 1 + Math.sin(angle) * 0.3
            } else if (comet.path === "parabolic") {
              const t = ((elapsed * comet.speed * 0.03) % 10) - 5
              x = t * 80
              z = t * t * 20 - 300
              scale = Math.max(0.5, 1.5 - Math.abs(t) * 0.2)
            } else {
              const t = ((elapsed * comet.speed * 0.04) % 8) - 4
              x = t * 100
              z = Math.sqrt(Math.abs(t)) * 150 * Math.sign(t) - 200
              scale = Math.max(0.3, 1.2 - Math.abs(t) * 0.15)
            }

            cometElement.style.transform = `translate3d(${x}px, ${Math.sin(elapsed + index) * 20}px, ${z}px) scale(${scale})`
            cometElement.style.opacity = scale > 0.5 ? "1" : "0.3"
          }
        })
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPaused, planetSpeeds, showAsteroids, showComets, showSpaceStations, isLightTheme])

  // Apply zoom effect
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `rotateX(15deg) scale(${zoomLevel})`
    }
  }, [zoomLevel])

  // Add this useEffect after the other useEffect hooks, before the return statement
  useEffect(() => {
    setMounted(true)
    document.title = "Himanshu_Bali - 3D Solar System"

    // Generate asteroid belt data client-side
    setAsteroidBeltData(Array.from({ length: 150 }, (_, i) => {
      const angle = (i / 150) * Math.PI * 2 + Math.random() * 0.5
      const distance = 195 + Math.random() * 30
      const size = 1 + Math.random() * 3
      const speed = 0.2 + Math.random() * 0.3
      const verticalOffset = (Math.random() - 0.5) * 20
      const rotationSpeed = Math.random() * 2 - 1
      const shape = Math.floor(Math.random() * 3)
      const color = ["#8B7355", "#A0522D", "#696969", "#778899", "#2F4F4F"][Math.floor(Math.random() * 5)]

      return {
        id: i,
        angle,
        distance,
        size,
        speed,
        verticalOffset,
        rotationSpeed,
        shape,
        color,
        name: `Asteroid ${i + 1}`,
        info: `Small rocky body orbiting between Mars and Jupiter`,
      }
    }))

    // Also set meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute("content", "Advanced 3D Solar System created by Himanshu_Bali")
    } else {
      const meta = document.createElement("meta")
      meta.name = "description"
      meta.content = "Advanced 3D Solar System created by Himanshu_Bali"
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <>
      <div
        className={`w-full h-screen relative overflow-hidden transition-colors duration-500 ${
          isLightTheme ? "bg-gradient-to-b from-sky-300 to-sky-500" : "bg-gradient-to-b from-black to-gray-900"
        }`}
      >
        {/* About Creator Button */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
          <button
            onClick={() => setShowAboutCreator(true)}
            className="px-6 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            👨‍💻 About Creator
          </button>
        </div>

        {/* About Creator Modal */}
        {showAboutCreator && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden">
              {/* Close Button */}
              <button
                onClick={() => setShowAboutCreator(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors z-10"
              >
                ✕
              </button>

              {/* Profile Section */}
              <div className="p-6 pb-4">
                <div className="flex items-start space-x-4">
                  {/* Profile Image */}
                  <div className="relative">
                    <img
                      src="/images/profile-new.png"
                      alt="Himanshu Bali"
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">🚀 Himanshu_Bali</h2>
                    <p className="text-blue-600 font-medium text-sm mt-1">Aspiring Computer Science Engineer</p>
                    <p className="text-gray-600 text-sm mt-1 flex items-center">
                      Passionate About Technology & Innovation 💡
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    I am currently pursuing my{" "}
                    <span className="font-semibold text-gray-900">
                      Bachelor of Technology (BTech) in Computer Science Engineering
                    </span>
                    , with a strong passion for technology and problem-solving. My academic journey is equipping me with
                    a solid foundation in programming languages like{" "}
                    <span className="font-semibold text-blue-600">C++, Java, and Python</span>, as well as a growing
                    understanding of data structures, algorithms, and software development.
                  </p>
                </div>

                {/* Skills */}
                <div className="mt-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-blue-600 font-bold text-lg">C++</div>
                      <div className="text-blue-500 text-xs">Programming</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-green-600 font-bold text-lg">Java</div>
                      <div className="text-green-500 text-xs">Development</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <div className="text-purple-600 font-bold text-lg">Python</div>
                      <div className="text-purple-500 text-xs">AI & ML</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <div className="text-orange-600 font-bold text-lg">DSA</div>
                      <div className="text-orange-500 text-xs">Algorithms</div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center">
                    🎓 BTech CSE Student
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center">
                    💡 Innovation Enthusiast
                  </span>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center">
                    ❤️ Healthcare Tech
                  </span>
                </div>

                {/* Contact Section */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">📧 Get In Touch</h3>
                  <div className="space-y-2">
                    <a
                      href="mailto:himanshuofficialuserid@gmail.com"
                      className="flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                    >
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">📧</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Email</div>
                        <div className="text-sm text-blue-600 group-hover:text-blue-700">
                          himanshuofficialuserid@gmail.com
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stars Background */}
        {!isLightTheme && mounted && (
          <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 1, perspective: "1000px" }}>
            {/* 3D positioned stars */}
            {starData.map((star, index) => (
              <div
                key={`star-${index}`}
                id={`star-${index}`}
                className="absolute rounded-full"
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  backgroundColor: star.color,
                  transform: `translate3d(${star.x}px, ${star.y}px, ${star.z}px)`,
                  left: "50%",
                  top: "50%",
                  opacity: 0.7,
                  boxShadow: star.size > 1.5 ? `0 0 ${star.size}px ${star.color}` : "none",
                }}
              />
            ))}
          </div>
        )}

        {/* Control Panel */}
        <div className="absolute top-4 left-4 z-20 max-w-xs">
          <div
            className={`p-4 rounded-lg border backdrop-blur-sm transition-colors duration-300 ${
              isLightTheme ? "bg-white/90 text-black border-black/20" : "bg-black/80 text-white border-white/20"
            }`}
          >
            <h2 className="text-xl font-bold mb-4 text-center text-yellow-400">🌌 Solar System Controls</h2>

            {/* Main Controls */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={togglePause}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  isPaused ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {isPaused ? "▶️ Resume" : "⏸️ Pause"}
              </button>
              <button
                onClick={toggleTheme}
                className="px-3 py-2 rounded text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                {isLightTheme ? "🌙 Dark" : "☀️ Light"}
              </button>
              <button
                onClick={() => setShowComets(!showComets)}
                className="px-3 py-2 rounded text-sm font-medium bg-purple-500 hover:bg-purple-600 text-white transition-colors"
              >
                {showComets ? "🌠 Hide Comets" : "☄️ Show Comets"}
              </button>
              <button
                onClick={() => setShowAsteroids(!showAsteroids)}
                className="px-3 py-2 rounded text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors"
              >
                {showAsteroids ? "🪨 Hide Asteroids" : "☄️ Show Asteroids"}
              </button>
            </div>

            {/* Space Station Toggle */}
            <div className="mb-4">
              <button
                onClick={() => setShowSpaceStations(!showSpaceStations)}
                className="w-full px-3 py-2 rounded text-sm font-medium bg-cyan-500 hover:bg-cyan-600 text-white transition-colors"
              >
                {showSpaceStations ? "🛰️ Hide Space Stations" : "🚀 Show Space Stations"}
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="mb-4 p-3 rounded bg-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">🔍 Zoom: {Math.round(zoomLevel * 100)}%</span>
                <div className="flex space-x-1">
                  <button
                    onClick={zoomOut}
                    className="px-2 py-1 rounded text-xs font-medium bg-gray-600 hover:bg-gray-700 text-white"
                    aria-label="Zoom out"
                  >
                    -
                  </button>
                  <button
                    onClick={resetZoom}
                    className="px-2 py-1 rounded text-xs font-medium bg-gray-600 hover:bg-gray-700 text-white"
                    aria-label="Reset zoom"
                  >
                    ↺
                  </button>
                  <button
                    onClick={zoomIn}
                    className="px-2 py-1 rounded text-xs font-medium bg-gray-600 hover:bg-gray-700 text-white"
                    aria-label="Zoom in"
                  >
                    +
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="0.2"
                max="3"
                step="0.1"
                value={zoomLevel}
                onChange={(e) => handleZoomChange(Number.parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Planet Speed Controls */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {planetData.map((planet, index) => (
                <div
                  key={planet.name}
                  className={`p-3 rounded transition-colors ${isLightTheme ? "bg-black/10" : "bg-white/10"}`}
                >
                  <label className="block text-sm font-medium mb-1">{planet.name}</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={planetSpeeds[index]}
                    onChange={(e) => updatePlanetSpeed(index, Number.parseFloat(e.target.value))}
                    className="w-full mb-1"
                  />
                  <div className="text-xs text-center opacity-75">Speed: {planetSpeeds[index].toFixed(1)}x</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="absolute bottom-4 right-4 z-20 max-w-xs">
          <div
            className={`p-4 rounded-lg border backdrop-blur-sm transition-colors duration-300 ${
              isLightTheme ? "bg-white/90 text-black border-black/20" : "bg-black/80 text-white border-white/20"
            }`}
          >
            <h3 className="font-bold mb-2">Object Information</h3>

            {selectedPlanet ? (
              <div>
                <strong className="text-yellow-400">
                  {selectedPlanet.type === "comet"
                    ? "☄️ "
                    : selectedPlanet.type === "asteroid"
                      ? "🪨 "
                      : selectedPlanet.type === "station"
                        ? "🛰️ "
                        : "🪐 "}
                  {selectedPlanet.name}
                </strong>
                <br />
                <span className="text-sm">{selectedPlanet.info}</span>
                {selectedPlanet.type === "comet" && (
                  <div className="text-xs mt-2 text-blue-300">
                    Path: {cometData.find((c) => c.name === selectedPlanet.name)?.path}
                  </div>
                )}
                {selectedPlanet.type === "asteroid" && (
                  <div className="text-xs mt-2 text-orange-300">
                    Size: {selectedPlanet.size?.toFixed(1)}km • Distance: {selectedPlanet.distance?.toFixed(0)} AU
                  </div>
                )}
                {selectedPlanet.type === "station" && (
                  <div className="text-xs mt-2 text-cyan-300">
                    Altitude: {selectedPlanet.altitude} • Speed: {selectedPlanet.speed?.toFixed(1)}x
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm space-y-1">
                <p>
                  <strong>Controls:</strong>
                </p>
                <p>🖱️ Click objects for info</p>
                <p>🎚️ Use sliders to control speed</p>
                <p>⏸️ Pause/Resume animation</p>
                <p>🔍 Zoom in/out with slider</p>
                <p>🌙 Toggle day/night theme</p>
              </div>
            )}
          </div>
        </div>

        {/* Space Station Statistics */}
        {showSpaceStations && (
          <div className="absolute top-4 right-4 z-20">
            <div
              className={`p-3 rounded-lg border backdrop-blur-sm transition-colors duration-300 ${
                isLightTheme ? "bg-white/90 text-black border-black/20" : "bg-black/80 text-white border-white/20"
              }`}
            >
              <h4 className="font-bold text-cyan-400 mb-1">🛰️ Earth Orbit</h4>
              <div className="text-xs space-y-1">
                <div>Stations: {spaceStationData.length}</div>
                <div>Altitude: 340-20,200 km</div>
                <div>Status: Active</div>
              </div>
            </div>
          </div>
        )}

        {/* Asteroid Belt Statistics */}
        {showAsteroids && mounted && (
          <div className={`absolute ${showSpaceStations ? "top-20" : "top-4"} right-4 z-20`}>
            <div
              className={`p-3 rounded-lg border backdrop-blur-sm transition-colors duration-300 ${
                isLightTheme ? "bg-white/90 text-black border-black/20" : "bg-black/80 text-white border-white/20"
              }`}
            >
              <h4 className="font-bold text-orange-400 mb-1">🪨 Asteroid Belt</h4>
              <div className="text-xs space-y-1">
                <div>Objects: {asteroidBeltData.length}</div>
                <div>Distance: 195-225 AU</div>
                <div>Status: Active</div>
              </div>
            </div>
          </div>
        )}

        {/* Zoom Level Indicator */}
        <div className="absolute bottom-4 left-4 z-20">
          <div
            className={`p-3 rounded-lg border backdrop-blur-sm transition-colors duration-300 ${
              isLightTheme ? "bg-white/90 text-black border-black/20" : "bg-black/80 text-white border-white/20"
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">🔍 Zoom:</span>
              <span className="text-sm font-bold">{Math.round(zoomLevel * 100)}%</span>
            </div>
          </div>
        </div>

        {/* 3D Solar System Container */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            perspective: "1000px",
            perspectiveOrigin: "center center",
            zIndex: 10,
          }}
        >
          <div
            ref={containerRef}
            className="relative transition-transform duration-300"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(15deg) scale(${zoomLevel})`,
            }}
          >
            {/* Orbit Lines */}
            {planetData.map((planet, index) => (
              <div
                key={`orbit-${index}`}
                className="absolute border border-gray-500/30 rounded-full"
                style={{
                  width: `${planet.distance * 2}px`,
                  height: `${planet.distance * 2}px`,
                  left: `-${planet.distance}px`,
                  top: `-${planet.distance}px`,
                  transform: "rotateX(90deg)",
                }}
              />
            ))}

            {/* Space Station Orbit Lines around Earth */}
            {showSpaceStations && planetData[2] && (
              <>
                {spaceStationData.map((station, index) => (
                  <div
                    key={`station-orbit-${index}`}
                    className="absolute border border-cyan-400/20 rounded-full"
                    style={{
                      width: `${station.distance * 2}px`,
                      height: `${station.distance * 2}px`,
                      left: `-${station.distance}px`,
                      top: `-${station.distance}px`,
                      transform: "rotateX(90deg)",
                    }}
                  />
                ))}
              </>
            )}

            {/* Asteroid Belt Orbit Lines */}
            {showAsteroids && (
              <>
                <div
                  className="absolute border border-orange-400/20 rounded-full"
                  style={{
                    width: "390px",
                    height: "390px",
                    left: "-195px",
                    top: "-195px",
                    transform: "rotateX(90deg)",
                  }}
                />
                <div
                  className="absolute border border-orange-400/20 rounded-full"
                  style={{
                    width: "450px",
                    height: "450px",
                    left: "-225px",
                    top: "-225px",
                    transform: "rotateX(90deg)",
                  }}
                />
              </>
            )}

            {/* Sun */}
            <div
              id="sun"
              className="absolute w-16 h-16 rounded-full shadow-lg"
              style={{
                background: "radial-gradient(circle, #ffff00 0%, #ff8c00 70%, #ff4500 100%)",
                left: "-32px",
                top: "-32px",
                boxShadow: "0 0 50px #ffff00, 0 0 100px #ff8c00",
                transformStyle: "preserve-3d",
              }}
            />

            {/* Planets */}
            {planetData.map((planet, index) => (
              <div
                key={planet.name}
                id={`planet-${index}`}
                className="absolute rounded-full cursor-pointer transition-transform hover:scale-110 shadow-lg"
                style={{
                  width: `${planet.size}px`,
                  height: `${planet.size}px`,
                  backgroundColor: planet.color,
                  left: `-${planet.size / 2}px`,
                  top: `-${planet.size / 2}px`,
                  transformStyle: "preserve-3d",
                  boxShadow: `0 0 ${planet.size}px ${planet.color}40`,
                }}
                onClick={() => {
                  setSelectedPlanet({ ...planet, type: "planet" })
                  setTimeout(() => setSelectedPlanet(null), 5000)
                }}
              >
                {/* Saturn Rings */}
                {planet.name === "Saturn" && (
                  <div
                    className="absolute border-2 border-white/60 rounded-full"
                    style={{
                      width: `${planet.size * 1.8}px`,
                      height: `${planet.size * 1.8}px`,
                      left: `-${planet.size * 0.4}px`,
                      top: `-${planet.size * 0.4}px`,
                      transform: "rotateX(75deg)",
                    }}
                  />
                )}
              </div>
            ))}

            {/* Space Stations */}
            {showSpaceStations &&
              spaceStationData.map((station, index) => (
                <div
                  key={station.name}
                  id={`station-${index}`}
                  className="absolute cursor-pointer transition-transform hover:scale-125"
                  style={{
                    width: `${station.size}px`,
                    height: `${station.size}px`,
                    left: `-${station.size / 2}px`,
                    top: `-${station.size / 2}px`,
                    transformStyle: "preserve-3d",
                  }}
                  onClick={() => {
                    setSelectedPlanet({ ...station, type: "station" })
                    setTimeout(() => setSelectedPlanet(null), 5000)
                  }}
                >
                  {/* Different station shapes */}
                  {station.shape === "rectangular" && (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: station.color,
                        boxShadow: `0 0 ${station.size * 2}px ${station.color}`,
                        clipPath: "polygon(10% 20%, 90% 20%, 90% 80%, 10% 80%)",
                      }}
                    >
                      {/* Solar panels */}
                      <div
                        className="absolute w-6 h-1 bg-blue-400"
                        style={{ left: "-3px", top: "50%", transform: "translateY(-50%)" }}
                      />
                      <div
                        className="absolute w-6 h-1 bg-blue-400"
                        style={{ right: "-3px", top: "50%", transform: "translateY(-50%)" }}
                      />
                    </div>
                  )}
                  {station.shape === "modular" && (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: station.color,
                        boxShadow: `0 0 ${station.size * 2}px ${station.color}`,
                        clipPath: "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
                      }}
                    />
                  )}
                  {station.shape === "cylindrical" && (
                    <div
                      className="w-full h-full rounded-full"
                      style={{
                        backgroundColor: station.color,
                        boxShadow: `0 0 ${station.size * 2}px ${station.color}`,
                      }}
                    />
                  )}
                  {station.shape === "hexagonal" && (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: station.color,
                        boxShadow: `0 0 ${station.size * 2}px ${station.color}`,
                        clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                      }}
                    />
                  )}
                  {station.shape === "flat" && (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: station.color,
                        boxShadow: `0 0 ${station.size * 2}px ${station.color}`,
                        clipPath: "polygon(0% 40%, 100% 40%, 100% 60%, 0% 60%)",
                      }}
                    />
                  )}
                  {station.shape === "solar" && (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: station.color,
                        boxShadow: `0 0 ${station.size * 2}px ${station.color}`,
                      }}
                    >
                      {/* Solar panel wings */}
                      <div
                        className="absolute w-4 h-1 bg-blue-300"
                        style={{ left: "-2px", top: "25%", transform: "rotate(45deg)" }}
                      />
                      <div
                        className="absolute w-4 h-1 bg-blue-300"
                        style={{ right: "-2px", top: "25%", transform: "rotate(-45deg)" }}
                      />
                      <div
                        className="absolute w-4 h-1 bg-blue-300"
                        style={{ left: "-2px", bottom: "25%", transform: "rotate(-45deg)" }}
                      />
                      <div
                        className="absolute w-4 h-1 bg-blue-300"
                        style={{ right: "-2px", bottom: "25%", transform: "rotate(45deg)" }}
                      />
                    </div>
                  )}

                  {/* Blinking lights */}
                  <div
                    className="absolute w-1 h-1 rounded-full bg-red-400 animate-pulse"
                    style={{ top: "10%", left: "10%" }}
                  />
                  <div
                    className="absolute w-1 h-1 rounded-full bg-green-400 animate-pulse"
                    style={{ top: "10%", right: "10%", animationDelay: "0.5s" }}
                  />
                </div>
              ))}

            {/* Asteroid Belt */}
            {showAsteroids && mounted &&
              asteroidBeltData.map((asteroid) => (
                <div
                  key={asteroid.id}
                  id={`asteroid-${asteroid.id}`}
                  className="absolute cursor-pointer transition-transform hover:scale-150"
                  style={{
                    width: `${asteroid.size}px`,
                    height: `${asteroid.size}px`,
                    left: `-${asteroid.size / 2}px`,
                    top: `-${asteroid.size / 2}px`,
                    transformStyle: "preserve-3d",
                  }}
                  onClick={() => {
                    setSelectedPlanet({ ...asteroid, type: "asteroid" })
                    setTimeout(() => setSelectedPlanet(null), 5000)
                  }}
                >
                  {/* Different asteroid shapes */}
                  {asteroid.shape === 0 && (
                    <div
                      className="w-full h-full rounded-full"
                      style={{
                        backgroundColor: asteroid.color,
                        boxShadow: `0 0 ${asteroid.size}px ${asteroid.color}40`,
                      }}
                    />
                  )}
                  {asteroid.shape === 1 && (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: asteroid.color,
                        boxShadow: `0 0 ${asteroid.size}px ${asteroid.color}40`,
                        clipPath: "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)",
                      }}
                    />
                  )}
                  {asteroid.shape === 2 && (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: asteroid.color,
                        boxShadow: `0 0 ${asteroid.size}px ${asteroid.color}40`,
                        clipPath:
                          "polygon(30% 0%, 70% 10%, 90% 30%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 60%, 10% 30%)",
                      }}
                    />
                  )}

                  <div
                    className="absolute inset-0 rounded-full opacity-30"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, transparent 20%, ${asteroid.color} 40%, transparent 60%)`,
                    }}
                  />
                </div>
              ))}

            {/* Comets */}
            {showComets &&
              cometData.map((comet, index) => (
                <div
                  key={comet.name}
                  id={`comet-${index}`}
                  className="absolute cursor-pointer transition-transform hover:scale-125"
                  style={{
                    width: `${comet.size}px`,
                    height: `${comet.size}px`,
                    left: `-${comet.size / 2}px`,
                    top: `-${comet.size / 2}px`,
                    transformStyle: "preserve-3d",
                  }}
                  onClick={() => {
                    setSelectedPlanet({ ...comet, type: "comet" })
                    setTimeout(() => setSelectedPlanet(null), 5000)
                  }}
                >
                  {/* Comet Head */}
                  <div
                    className="absolute w-full h-full rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${comet.color} 0%, ${comet.color}80 50%, transparent 100%)`,
                      boxShadow: `0 0 ${comet.size * 2}px ${comet.color}`,
                      animation: `cometGlow-${index} 2s ease-in-out infinite alternate`,
                    }}
                  />

                  {/* Particle Trail */}
                  <div
                    className="absolute"
                    style={{
                      width: "200px",
                      height: "2px",
                      background: `linear-gradient(90deg, ${comet.color}80 0%, ${comet.color}40 30%, transparent 100%)`,
                      left: `-200px`,
                      top: "50%",
                      transform: "translateY(-50%)",
                      borderRadius: "1px",
                      animation: `trailShimmer-${index} 1.5s ease-in-out infinite`,
                    }}
                  />

                  {/* Additional Trail Particles */}
                  {Array.from({ length: 8 }).map((_, particleIndex) => (
                    <div
                      key={particleIndex}
                      className="absolute w-1 h-1 rounded-full"
                      style={{
                        backgroundColor: comet.color,
                        left: `-${20 + particleIndex * 25}px`,
                        top: `${Math.sin(particleIndex) * 3}px`,
                        opacity: 1 - particleIndex * 0.12,
                        animation: `particle-${index}-${particleIndex} ${1 + particleIndex * 0.2}s ease-in-out infinite`,
                        animationDelay: `${particleIndex * 0.1}s`,
                      }}
                    />
                  ))}

                  {/* Dust Trail */}
                  <div
                    className="absolute"
                    style={{
                      width: "150px",
                      height: "8px",
                      background: `linear-gradient(90deg, transparent 0%, ${comet.color}20 20%, ${comet.color}10 60%, transparent 100%)`,
                      left: `-150px`,
                      top: "50%",
                      transform: "translateY(-50%)",
                      borderRadius: "4px",
                      filter: "blur(2px)",
                      animation: `dustTrail-${index} 3s ease-in-out infinite`,
                    }}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Title */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
          <h1
            className={`text-4xl font-bold text-center transition-colors duration-300 ${
              isLightTheme ? "text-black/20" : "text-white/20"
            }`}
          >
            3D Solar System
          </h1>
        </div>

        {/* Dynamic CSS Animations */}
        <style jsx global>{`
        ${cometData
          .map(
            (comet, index) => `
          @keyframes cometGlow-${index} {
            0% { filter: brightness(1) blur(0px); }
            100% { filter: brightness(1.3) blur(1px); }
          }
          
          @keyframes trailShimmer-${index} {
            0% { opacity: 0.8; transform: translateY(-50%) scaleX(1); }
            50% { opacity: 1; transform: translateY(-50%) scaleX(1.1); }
            100% { opacity: 0.8; transform: translateY(-50%) scaleX(1); }
          }
          
          @keyframes dustTrail-${index} {
            0% { opacity: 0.3; transform: translateY(-50%) scaleX(1); }
            50% { opacity: 0.6; transform: translateY(-50%) scaleX(1.2); }
            100% { opacity: 0.3; transform: translateY(-50%) scaleX(1); }
          }
          
          ${Array.from({ length: 8 })
            .map(
              (_, particleIndex) => `
            @keyframes particle-${index}-${particleIndex} {
              0% { 
                opacity: ${1 - particleIndex * 0.12}; 
                transform: translateY(0px) scale(1); 
              }
              50% { 
                opacity: ${0.8 - particleIndex * 0.1}; 
                transform: translateY(${Math.sin(particleIndex) * 2}px) scale(1.2); 
              }
              100% { 
                opacity: ${1 - particleIndex * 0.12}; 
                transform: translateY(0px) scale(1); 
              }
            }
          `,
            )
            .join("")}
        `,
          )
          .join("")}
      `}</style>
      </div>
    </>
  )
}

export default SolarSystemPage
