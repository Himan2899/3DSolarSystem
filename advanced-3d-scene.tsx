"use client"

import type React from "react"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Stars, Text, Html } from "@react-three/drei"
import * as THREE from "three"

// Orbiting Planet Component
function OrbitingPlanet({
  radius = 5,
  speed = 1,
  size = 0.5,
  color = "#4f46e5",
  orbitRadius = 8,
  children,
}: {
  radius?: number
  speed?: number
  size?: number
  color?: string
  orbitRadius?: number
  children?: React.ReactNode
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += speed * 0.01
    }
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.02
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} position={[orbitRadius, 0, 0]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} emissive={color} emissiveIntensity={0.1} />
      </mesh>
      {children}
    </group>
  )
}

// Central Sun Component
function CentralSun() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        color="#fbbf24"
        emissive="#f59e0b"
        emissiveIntensity={0.5}
        roughness={0.1}
        metalness={0.1}
      />
      <pointLight intensity={2} distance={50} decay={2} />
    </mesh>
  )
}

// Asteroid Belt Component
function AsteroidBelt() {
  const asteroids = useMemo(() => {
    const temp = []
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * Math.PI * 2
      const radius = 15 + Math.random() * 3
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = (Math.random() - 0.5) * 2
      const scale = 0.1 + Math.random() * 0.2
      temp.push({ position: [x, y, z], scale, rotation: [Math.random(), Math.random(), Math.random()] })
    }
    return temp
  }, [])

  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002
    }
  })

  return (
    <group ref={groupRef}>
      {asteroids.map((asteroid, i) => (
        <mesh key={i} position={asteroid.position} scale={asteroid.scale} rotation={asteroid.rotation}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#8b5cf6" roughness={0.8} metalness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

// Orbit Ring Component
function OrbitRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
      <meshBasicMaterial color="#374151" transparent opacity={0.3} />
    </mesh>
  )
}

// Floating UI Panel
function FloatingUI() {
  return (
    <Html position={[-8, 4, 0]} transform occlude>
      <div className="bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg border border-white/20 min-w-[200px]">
        <h3 className="text-lg font-bold mb-2">Solar System</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Planets:</span>
            <span className="text-blue-400">8</span>
          </div>
          <div className="flex justify-between">
            <span>Asteroids:</span>
            <span className="text-purple-400">100+</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-green-400">Active</span>
          </div>
        </div>
      </div>
    </Html>
  )
}

// Main 3D Scene Component
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Environment */}
      <Environment preset="night" />
      <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade />

      {/* Central Sun */}
      <CentralSun />

      {/* Orbit Rings */}
      <OrbitRing radius={5} />
      <OrbitRing radius={8} />
      <OrbitRing radius={12} />
      <OrbitRing radius={15} />
      <OrbitRing radius={20} />

      {/* Orbiting Planets */}
      <OrbitingPlanet orbitRadius={5} speed={2} size={0.3} color="#ef4444" />

      <OrbitingPlanet orbitRadius={8} speed={1.5} size={0.4} color="#3b82f6">
        {/* Moon orbiting the blue planet */}
        <OrbitingPlanet orbitRadius={1.2} speed={8} size={0.1} color="#94a3b8" />
      </OrbitingPlanet>

      <OrbitingPlanet orbitRadius={12} speed={1} size={0.6} color="#10b981">
        {/* Two moons */}
        <OrbitingPlanet orbitRadius={1.5} speed={6} size={0.08} color="#fbbf24" />
        <OrbitingPlanet orbitRadius={2} speed={4} size={0.12} color="#f59e0b" />
      </OrbitingPlanet>

      <OrbitingPlanet orbitRadius={20} speed={0.5} size={0.8} color="#8b5cf6">
        {/* Ring system */}
        <mesh position={[20, 0, 0]} rotation={[Math.PI / 4, 0, Math.PI / 6]}>
          <ringGeometry args={[1.2, 1.8, 32]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      </OrbitingPlanet>

      {/* Asteroid Belt */}
      <AsteroidBelt />

      {/* Floating UI */}
      <FloatingUI />

      {/* 3D Text */}
      <Text
        position={[0, -8, 0]}
        fontSize={1.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter_Bold.json"
      >
        Advanced 3D Solar System
      </Text>

      {/* Interactive Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </>
  )
}

// Main Component
export default function Advanced3DScene() {
  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-10 text-white">
        <div className="bg-black/50 backdrop-blur-sm p-4 rounded-lg border border-white/20">
          <h1 className="text-2xl font-bold mb-2">3D Orbit System</h1>
          <div className="text-sm space-y-1 opacity-80">
            <p>🖱️ Drag to rotate view</p>
            <p>🔍 Scroll to zoom</p>
            <p>⚡ Auto-rotation enabled</p>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="absolute top-4 right-4 z-10 text-white">
        <div className="bg-black/50 backdrop-blur-sm p-3 rounded-lg border border-white/20 text-sm">
          <div className="text-green-400">● System Active</div>
          <div>Smooth 60 FPS</div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: [0, 10, 25],
          fov: 60,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        shadows
      >
        <Scene />
      </Canvas>

      {/* Bottom Info */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black/50 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20 text-white text-sm">
          Advanced 3D Web Experience with Responsive Orbit Animations
        </div>
      </div>
    </div>
  )
}
