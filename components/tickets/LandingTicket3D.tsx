import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface LandingTicket3DProps {
  eventName?: string;
  participantName?: string;
  height?: string;
  className?: string;
}

const LandingTicket3D: React.FC<LandingTicket3DProps> = ({
  eventName = "2023 개발자 컨퍼런스",
  participantName = "김민수",
  height = "350px",
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Store mouse position
  const mousePosition = useRef({ x: 0, y: 0 });
  
  // Handle mouse movement
  const handleMouseMove = (e: MouseEvent) => {
    // Get canvas position
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    
    // Calculate normalized mouse position (-1 to 1)
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1; // Not inverted anymore
    
    mousePosition.current = { x, y };
  };
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45, 
      canvasRef.current.clientWidth / canvasRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    // Renderer setup with better quality
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      precision: 'highp'
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Better performance on high-DPI screens
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 5, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    // Accent lights for dramatic effect and professional look
    const purpleLight = new THREE.PointLight(0x9333ea, 1.2);
    purpleLight.position.set(-5, 5, 3);
    scene.add(purpleLight);
    
    const blueLight = new THREE.PointLight(0x3b82f6, 1.0);
    blueLight.position.set(5, -5, 2);
    scene.add(blueLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 0.8);
    cyanLight.position.set(0, 5, 3);
    scene.add(cyanLight);
    
    // Create enhanced ticket texture
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 1024;
    textureCanvas.height = 512;
    
    const ctx = textureCanvas.getContext('2d');
    if (ctx) {
      // Professional gradient background
      const gradient = ctx.createLinearGradient(0, 0, textureCanvas.width, textureCanvas.height);
      gradient.addColorStop(0, '#1e1b4b'); // Deep indigo
      gradient.addColorStop(0.5, '#312e81'); // Mid indigo
      gradient.addColorStop(1, '#1e1b4b'); // Deep indigo again
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);
      
      // Add subtle pattern
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      for (let x = 0; x < textureCanvas.width; x += 20) {
        for (let y = 0; y < textureCanvas.height; y += 20) {
          // Make a subtle grid pattern
          if ((x + y) % 40 === 0) {
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
      
      // Sophisticated background sparkles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      for (let i = 0; i < 80; i++) {
        const x = Math.random() * textureCanvas.width;
        const y = Math.random() * textureCanvas.height;
        const radius = Math.random() * 1.5 + 0.5;
        const opacity = Math.random() * 0.15;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }
      
      // Premium ticket border with rounded corners
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.6)';
      ctx.lineWidth = 8;
      const borderRadius = 40;
      
      // Draw high-quality rounded rectangle
      ctx.beginPath();
      ctx.moveTo(borderRadius, 0);
      ctx.lineTo(textureCanvas.width - borderRadius, 0);
      ctx.quadraticCurveTo(textureCanvas.width, 0, textureCanvas.width, borderRadius);
      ctx.lineTo(textureCanvas.width, textureCanvas.height - borderRadius);
      ctx.quadraticCurveTo(textureCanvas.width, textureCanvas.height, textureCanvas.width - borderRadius, textureCanvas.height);
      ctx.lineTo(borderRadius, textureCanvas.height);
      ctx.quadraticCurveTo(0, textureCanvas.height, 0, textureCanvas.height - borderRadius);
      ctx.lineTo(0, borderRadius);
      ctx.quadraticCurveTo(0, 0, borderRadius, 0);
      ctx.closePath();
      ctx.stroke();
      
      // Add professional inner border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(20, 20, textureCanvas.width - 40, textureCanvas.height - 40);
      ctx.stroke();
      
      // Add diagonal line pattern in corners for a premium look
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      
      // Top left corner pattern
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(20, 20 + i * 10);
        ctx.lineTo(20 + i * 10, 20);
        ctx.stroke();
      }
      
      // Bottom right corner pattern
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(textureCanvas.width - 20, textureCanvas.height - 20 - i * 10);
        ctx.lineTo(textureCanvas.width - 20 - i * 10, textureCanvas.height - 20);
        ctx.stroke();
      }
      
      // Modern gradient overlay for a premium shimmering effect
      const shimmerGradient = ctx.createLinearGradient(0, 0, textureCanvas.width, textureCanvas.height);
      shimmerGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      shimmerGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
      shimmerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = shimmerGradient;
      ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);
      
      // Modern and professional logo design
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'left';
      
      // Create logo background
      const logoX = 60;
      const logoY = 60;
      const logoWidth = 120;
      const logoHeight = 50;
      
      ctx.fillStyle = 'rgba(147, 51, 234, 0.3)';
      ctx.beginPath();
      ctx.roundRect(logoX - 10, logoY - 30, logoWidth, logoHeight, 8);
      ctx.fill();
      
      // Add RSVPY logo text with shadow
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(147, 51, 234, 0.8)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillText('RSVPY', logoX, logoY);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      
      // Professional divider with gradient
      const dividerGradient = ctx.createLinearGradient(0, 0, textureCanvas.width, 0);
      dividerGradient.addColorStop(0, 'rgba(147, 51, 234, 0)');
      dividerGradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.6)');
      dividerGradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
      
      ctx.strokeStyle = dividerGradient;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 100);
      ctx.lineTo(textureCanvas.width - 60, 100);
      ctx.stroke();
      
      // Event name with professional text styling
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      
      // Text shadow for depth
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;
      ctx.fillText(eventName, textureCanvas.width / 2, 160);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      
      // Participant name with high-end styling
      ctx.font = '28px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(participantName, textureCanvas.width / 2, 210);
      
      // Add sophisticated central design element
      const centerX = textureCanvas.width / 2;
      const centerY = 350;
      
      // Create a glowing backdrop
      const glowGradient = ctx.createRadialGradient(
        centerX, centerY, 10,
        centerX, centerY, 80
      );
      glowGradient.addColorStop(0, 'rgba(147, 51, 234, 0.4)');
      glowGradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
      ctx.fill();

      // Decorative circles
      ctx.beginPath();
      ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.stroke();
      
      // Central emblem
      ctx.fillStyle = 'rgba(147, 51, 234, 0.8)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.fill();
      
      // Add a stylish premium ticket icon in the center
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('VIP', centerX, centerY + 8);
      
      // Event date with subtle styling
      ctx.font = '18px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('2023년 6월 15일', centerX, 450);
      
      // Add decorative corners
      const cornerSize = 15;
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.6)';
      ctx.lineWidth = 2;
      
      // Top-left corner
      ctx.beginPath();
      ctx.moveTo(40, 40);
      ctx.lineTo(40, 40 + cornerSize);
      ctx.moveTo(40, 40);
      ctx.lineTo(40 + cornerSize, 40);
      ctx.stroke();
      
      // Top-right corner
      ctx.beginPath();
      ctx.moveTo(textureCanvas.width - 40, 40);
      ctx.lineTo(textureCanvas.width - 40, 40 + cornerSize);
      ctx.moveTo(textureCanvas.width - 40, 40);
      ctx.lineTo(textureCanvas.width - 40 - cornerSize, 40);
      ctx.stroke();
      
      // Bottom-left corner
      ctx.beginPath();
      ctx.moveTo(40, textureCanvas.height - 40);
      ctx.lineTo(40, textureCanvas.height - 40 - cornerSize);
      ctx.moveTo(40, textureCanvas.height - 40);
      ctx.lineTo(40 + cornerSize, textureCanvas.height - 40);
      ctx.stroke();
      
      // Bottom-right corner
      ctx.beginPath();
      ctx.moveTo(textureCanvas.width - 40, textureCanvas.height - 40);
      ctx.lineTo(textureCanvas.width - 40, textureCanvas.height - 40 - cornerSize);
      ctx.moveTo(textureCanvas.width - 40, textureCanvas.height - 40);
      ctx.lineTo(textureCanvas.width - 40 - cornerSize, textureCanvas.height - 40);
      ctx.stroke();
    }
    
    // Create enhanced ticket material
    const texture = new THREE.Texture(textureCanvas);
    texture.needsUpdate = true;
    
    // Create a professional-looking material with better properties
    const ticketMaterial = new THREE.MeshPhysicalMaterial({
      map: texture,
      side: THREE.DoubleSide,
      roughness: 0.2,
      metalness: 0.8,
      reflectivity: 0.9,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.5
    });
    
    // Create ticket geometry with better quality
    const ticketGeometry = new THREE.PlaneGeometry(3.5, 2, 32, 32); // More segments for better quality
    
    // Create ticket mesh
    const ticket = new THREE.Mesh(ticketGeometry, ticketMaterial);
    ticket.castShadow = true;
    ticket.receiveShadow = true;
    scene.add(ticket);
    
    // Add subtle glow effect
    const glowGeometry = new THREE.PlaneGeometry(3.58, 2.08);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x9333ea,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.z = -0.01;
    ticket.add(glow);
    
    // Initial slight rotation for better look
    ticket.rotation.y = 0.05;
    ticket.rotation.x = -0.03;
    
    // Update function for animation - fixed Y-axis movement
    const animate = () => {
      // Smooth follow mouse - fixed Y-axis direction
      const targetRotationY = mousePosition.current.x * 0.2; // Less intense X rotation
      const targetRotationX = mousePosition.current.y * -0.15; // Fixed Y direction and less intense
      
      ticket.rotation.y += (targetRotationY - ticket.rotation.y) * 0.03;
      ticket.rotation.x += (targetRotationX - ticket.rotation.x) * 0.03;
      
      // Subtle breathing animation
      const time = Date.now() * 0.0005;
      ticket.position.y = Math.sin(time) * 0.03;
      
      // Subtle glow animation
      glow.material.opacity = 0.15 + Math.sin(time * 2) * 0.05;
      
      // Render
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Add mouse move listener
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    
    window.addEventListener('resize', handleResize);
    
    // Set loaded state
    setIsLoaded(true);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      scene.remove(ticket);
      ticketGeometry.dispose();
      ticketMaterial.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [eventName, participantName]);
  
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height }}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default LandingTicket3D;
