import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface Ticket3DFiberProps {
  eventName: string;
  participantName: string;
  ticketId: string;
  date?: string;
  hovering?: boolean;
}

const Ticket3DFiber: React.FC<Ticket3DFiberProps> = ({ 
  eventName, 
  participantName, 
  ticketId,
  date = 'JUNE 15, 2023',
  hovering = false
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const cardRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const borderRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  // For shimmer effect
  const [shimmerPositions, setShimmerPositions] = useState<THREE.Vector3[]>([]);

  // Create shimmer points
  useEffect(() => {
    // Generate random positions for shimmer particles
    const points = [];
    for (let i = 0; i < 50; i++) {
      const x = (Math.random() - 0.5) * 3.3;
      const y = (Math.random() - 0.5) * 1.9;
      const z = (Math.random() * 0.2) + 0.02;
      points.push(new THREE.Vector3(x, y, z));
    }
    setShimmerPositions(points);
  }, []);

  // Animation
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Main ticket floating animation
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.05;
    
    // Subtle rotation based on hovering state or time
    const targetRotationY = hovering ? Math.PI * 0.02 : Math.sin(t * 0.3) * 0.15;
    const targetRotationX = hovering ? -Math.PI * 0.02 : Math.sin(t * 0.2) * 0.05;
    
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY,
      0.05
    );
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotationX,
      0.05
    );
    
    // Glow effect animation
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 
        0.5 + Math.sin(t * 1.5) * 0.15;
    }
    
    // Shimmer animation
    if (particlesRef.current) {
      particlesRef.current.rotation.z = t * 0.1;
      
      // Update shimmer particles material
      const material = particlesRef.current.material as THREE.PointsMaterial;
      material.size = 0.07 + Math.sin(t * 2) * 0.02;
    }
    
    // Border glow effect
    if (borderRef.current) {
      const borderMaterial = borderRef.current.material as THREE.MeshBasicMaterial;
      borderMaterial.opacity = 0.6 + Math.sin(t * 1.2) * 0.2;
    }
  });
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main ticket card */}
      <mesh ref={cardRef} receiveShadow castShadow>
        <roundedBoxGeometry args={[3.5, 2, 0.05, 16, 0.1]} />
        <meshStandardMaterial
          color="#0f0f13"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Reflective surface */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.05, 0]} scale={[3.5, 3, 1]}>
        <planeGeometry />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.8}
        />
      </mesh>
      
      {/* Border glow */}
      <mesh ref={borderRef} position={[0, 0, 0.01]}>
        <roundedBoxGeometry args={[3.56, 2.06, 0.01, 16, 0.1]} />
        <meshBasicMaterial 
          color="#9333ea"
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Inner purple glow */}
      <mesh ref={glowRef} position={[0, 0, 0.02]}>
        <planeGeometry args={[3.3, 1.8]} />
        <meshBasicMaterial 
          color="#9333ea"
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* Decorative elements */}
      <mesh position={[-1.5, 0.85, 0.03]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.2, 0.2, 0.01]} />
        <meshBasicMaterial color="#9333ea" />
      </mesh>
      
      <mesh position={[1.5, -0.85, 0.03]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.2, 0.2, 0.01]} />
        <meshBasicMaterial color="#9333ea" />
      </mesh>
      
      {/* Event name */}
      <Text
        position={[0, 0.6, 0.06]}
        fontSize={0.25}
        maxWidth={3}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        font="/fonts/Inter-Bold.woff"
        color="white"
      >
        {eventName}
      </Text>
      
      {/* Participant name */}
      <Text
        position={[0, 0.1, 0.06]}
        fontSize={0.18}
        maxWidth={3}
        lineHeight={1}
        letterSpacing={0.01}
        textAlign="center"
        font="/fonts/Inter-Regular.woff"
        color="#e4e4e7"
      >
        {participantName}
      </Text>
      
      {/* Date */}
      <Text
        position={[0, -0.2, 0.06]}
        fontSize={0.12}
        maxWidth={3}
        lineHeight={1}
        textAlign="center"
        font="/fonts/Inter-Medium.woff"
        color="#a1a1aa"
      >
        {date}
      </Text>
      
      {/* Ticket ID */}
      <Text
        position={[0, -0.65, 0.06]}
        fontSize={0.09}
        maxWidth={3}
        lineHeight={1}
        textAlign="center"
        font="/fonts/Inter-Regular.woff"
        color="#71717a"
        material-opacity={0.8}
      >
        {ticketId}
      </Text>
      
      {/* RSVPY Logo */}
      <Text
        position={[-1.5, -0.65, 0.06]}
        fontSize={0.12}
        maxWidth={3}
        letterSpacing={0.05}
        lineHeight={1}
        textAlign="center"
        font="/fonts/Inter-Black.woff"
        color="#9333ea"
        material-opacity={0.9}
      >
        RSVPY
      </Text>
      
      {/* Holographic effect */}
      <mesh position={[0, 0, 0.03]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[5, 5]} />
        <meshPhysicalMaterial
          color="white"
          transparent
          opacity={0.03}
          roughness={0.3}
          metalness={1}
          clearcoat={1}
          clearcoatRoughness={0.2}
        />
      </mesh>
      
      {/* Shimmer particles */}
      {shimmerPositions.length > 0 && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={shimmerPositions.length}
              array={new Float32Array(shimmerPositions.flatMap(v => [v.x, v.y, v.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.08}
            color="#ffffff"
            transparent
            opacity={0.6}
            sizeAttenuation
          />
        </points>
      )}
      
      {/* Horizontal decorative line */}
      <mesh position={[0, -0.4, 0.04]} rotation={[0, 0, 0]}>
        <planeGeometry args={[3, 0.003]} />
        <meshBasicMaterial color="#9333ea" opacity={0.8} transparent />
      </mesh>
      
      {/* Corner elements */}
      {[
        [-1.65, 0.9, 0.04],
        [1.65, 0.9, 0.04],
        [-1.65, -0.9, 0.04],
        [1.65, -0.9, 0.04]
      ].map((pos, i) => (
        <mesh key={i} position={pos as any}>
          <circleGeometry args={[0.06, 32]} />
          <meshBasicMaterial color="#9333ea" />
        </mesh>
      ))}
    </group>
  );
};

export default Ticket3DFiber;
