"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"

// Planet data
const planetData = [
  { name: "Mercury", color: "#8c7853", size: 0.4, distance: 8, info: "Closest planet to the Sun" },
  { name: "Venus", color: "#ffc649", size: 0.9, distance: 12, info: "Hottest planet in our solar system" },
  { name: "Earth", color: "#6b93d6", size: 1, distance: 16, info: "Our home planet with water and life" },
  { name: "Mars", color: "#c1440e", size: 0.5, distance: 20, info: "The Red Planet with polar ice caps" },
  { name: "Jupiter", color: "#d8ca9d", size: 3, distance: 28, info: "Largest planet with Great Red Spot" },
  { name: "Saturn", color: "#fad5a5", size: 2.5, distance: 36, info: "Beautiful planet with prominent rings" },
  { name: "Uranus", color: "#4fd0e7", size: 1.8, distance: 44, info: "Ice giant tilted on its side" },
  { name: "Neptune", color: "#4b70dd", size: 1.7, distance: 52, info: "Windiest planet in the solar system" },
]

// Sun Component
function Sun({ isPaused }) {
  const sunRef = useRef()

  useFrame((state) => {
    if (!isPaused && sunRef.current) {
      sunRef.current.rotation.y += 0.01
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      sunRef.current.scale.setScalar(scale)
    }
  })

  return (
    <mesh ref={sunRef} castShadow>
      <sphereGeometry args={[3, 32, 32]} />
      <meshBasicMaterial color="#ffff00" />
      <pointLight intensity={2} distance={300} decay={2} />
    </mesh>
  )
}

// Planet Component
function Planet({ name, color, size, distance, speed, isPaused, onClick }) {
  const orbitRef = useRef()
  const planetRef = useRef()

  useFrame(() => {
    if (!isPaused) {
      if (orbitRef.current) {
        orbitRef.current.rotation.y += speed * 0.01
      }
      if (planetRef.current) {
        planetRef.current.rotation.y += 0.02
      }
    }
  })

  return (
    <group ref={orbitRef}>
      <mesh
        ref={planetRef}
        position={[distance, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onClick({ name, info: planetData.find((p) => p.name === name).info })
        }}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshLambertMaterial color={color} />

        {/* Saturn Rings */}
        {name === "Saturn" && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 1.2, size * 1.8, 32]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} side={2} />
          </mesh>
        )}
      </mesh>
    </group>
  )
}

// Orbit Line Component
function OrbitLine({ radius }) {
  const points = []
  const segments = 64

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    points.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius])
  }

  return (
    <line>
      <bufferGeometry>
        <float32BufferAttribute attach="attributes-position" args={[points.flat(), 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#444444" transparent opacity={0.3} />
    </line>
  )
}

export default function PlanetSystem({ isPaused, planetSpeeds, onPlanetClick }) {
  return (
    <>
      {/* Sun */}
      <Sun isPaused={isPaused} />

      {/* Orbit Lines */}
      {planetData.map((planet) => (
        <OrbitLine key={`orbit-${planet.name}`} radius={planet.distance} />
      ))}

      {/* Planets */}
      {planetData.map((planet, index) => (
        <Planet
          key={planet.name}
          name={planet.name}
          color={planet.color}
          size={planet.size}
          distance={planet.distance}
          speed={planetSpeeds[index]}
          isPaused={isPaused}
          onClick={onPlanetClick}
        />
      ))}

      {/* 3D Text */}
      <Text
        position={[0, -15, 0]}
        fontSize={2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter_Bold.json"
      >
        3D Solar System
      </Text>
    </>
  )
}
