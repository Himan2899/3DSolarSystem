"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import PlanetSystem from "./planet-system"

export default function SolarSystem({ isPaused, isLightTheme, planetSpeeds, onPlanetClick }) {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 30, 60], fov: 75 }} shadows>
        {/* Background */}
        {isLightTheme ? (
          <color attach="background" args={["#87CEEB"]} />
        ) : (
          <Stars radius={300} depth={60} count={10000} factor={4} saturation={0} fade speed={0.5} />
        )}

        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={2} distance={300} castShadow />

        {/* Solar System */}
        <PlanetSystem isPaused={isPaused} planetSpeeds={planetSpeeds} onPlanetClick={onPlanetClick} />

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
      </Canvas>
    </div>
  )
}
