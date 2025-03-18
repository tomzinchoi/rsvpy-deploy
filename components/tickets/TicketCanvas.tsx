import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera, Float } from '@react-three/drei';
import Ticket3DFiber from './Ticket3DFiber';
import { TicketViewerProps } from '../../types/common';

interface TicketCanvasProps extends Pick<TicketViewerProps, 'eventName' | 'participantName' | 'ticketId'> {
  controlsEnabled?: boolean;
  autoRotate?: boolean;
  floatIntensity?: number;
}

const TicketCanvas: React.FC<TicketCanvasProps> = ({
  eventName,
  participantName,
  ticketId,
  controlsEnabled = true,
  autoRotate = true,
  floatIntensity = 1
}) => {
  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <color attach="background" args={['#030303']} />
      
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={40} />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={0.5} 
        castShadow 
      />
      <pointLight position={[-10, -10, -10]} intensity={0.2} />
      
      {/* Accent lights */}
      <pointLight position={[-5, 5, 5]} intensity={0.2} color="#9333ea" />
      <pointLight position={[5, -5, 5]} intensity={0.2} color="#3b82f6" />
      
      <Suspense fallback={null}>
        {/* 3D Ticket with optional floating animation */}
        <Float
          speed={2} 
          rotationIntensity={0.2} 
          floatIntensity={floatIntensity}
          enabled={!controlsEnabled || autoRotate}
        >
          <Ticket3DFiber 
            eventName={eventName} 
            participantName={participantName} 
            ticketId={ticketId}
          />
        </Float>
        
        {/* Environment map for reflections */}
        <Environment preset="city" />
        
        {/* Floor shadow */}
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />
      </Suspense>
      
      {/* Controls */}
      {controlsEnabled && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate={autoRotate}
          autoRotateSpeed={0.6}
        />
      )}
    </Canvas>
  );
};

export default TicketCanvas;
