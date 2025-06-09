"use client"
import { OrbitControls, Stars, Text } from "@react-three/drei"
import { Sun } from "./sun"
import { Planet } from "./planet"
import { OrbitLine } from "./orbit-line"

interface SolarSystemSceneProps {
  isPaused: boolean
  isLightTheme: boolean
  planetSpeeds: number[]
  onPlanetClick: (planet: any) => void
}

export function SolarSystemScene({ isPaused, isLightTheme, planetSpeeds, onPlanetClick }: SolarSystemSceneProps) {
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

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2} distance={300} castShadow />

      {/* Background */}
      {isLightTheme ? (
        <color attach="background" args={["#87CEEB"]} />
      ) : (
        <Stars radius={300} depth={60} count={10000} factor={4} saturation={0} fade speed={0.5} />
      )}

      {/* Sun */}
      <Sun isPaused={isPaused} />

      {/* Orbit Lines */}
      {planetData.map((planet, index) => (
        <OrbitLine key={`orbit-${index}`} radius={planet.distance} />
      ))}

      {/* Planets */}
      {planetData.map((planet, index) => (
        <Planet
          key={planet.name}
          {...planet}
          speed={planetSpeeds[index]}
          isPaused={isPaused}
          onClick={() => onPlanetClick(planet)}
        />
      ))}

      {/* 3D Text */}
      <Text
        position={[0, -15, 0]}
        fontSize={2}
        color={isLightTheme ? "#000000" : "#ffffff"}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter_Bold.json"
      >
        3D Solar System - Three.js Assignment
      </Text>

      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={200}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  )
}
