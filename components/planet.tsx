"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface PlanetProps {
  name: string
  color: string
  size: number
  distance: number
  speed: number
  isPaused: boolean
  info: string
  onClick: () => void
}

export function Planet({ name, color, size, distance, speed, isPaused, onClick }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!isPaused) {
      if (groupRef.current) {
        groupRef.current.rotation.y += speed * 0.01
      }
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.02
      }
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} position={[distance, 0, 0]} onClick={onClick} castShadow receiveShadow>
        <sphereGeometry args={[size, 32, 32]} />
        <meshLambertMaterial color={color} />

        {/* Saturn Rings */}
        {name === "Saturn" && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 1.2, size * 1.8, 32]} />
            <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.6} />
          </mesh>
        )}
      </mesh>
    </group>
  )
}
