"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

interface SunProps {
  isPaused: boolean
}

export function Sun({ isPaused }: SunProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!isPaused && meshRef.current) {
      meshRef.current.rotation.y += 0.01
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[3, 32, 32]} />
      <meshStandardMaterial 
        color="#ffff00" 
        emissive="#ffaa00" 
        emissiveIntensity={0.3}
        toneMapped={false}
      />
      <pointLight intensity={2} distance={300} decay={2} />
    </mesh>
  )
}
