import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { TextureLoader, DoubleSide } from 'three';
import QRCode from 'qrcode';

interface Ticket3DProps {
  eventName: string;
  participantName: string;
  ticketId: string;
  rotation: number;
  showQr: boolean;
}

const Ticket3D: React.FC<Ticket3DProps> = ({
  eventName,
  participantName,
  ticketId,
  rotation,
  showQr
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const ticketRef = useRef<THREE.Mesh | null>(null);
  const ticketTextureRef = useRef<THREE.Texture | null>(null);
  const qrCodeTextureRef = useRef<THREE.Texture | null>(null);
  const animationRef = useRef<number | null>(null);

  // Scene initialization
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      50, 
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Create lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 5);
    scene.add(directionalLight);
    
    // Add accent lights for dramatic effect
    const purpleLight = new THREE.PointLight(0x9333ea, 0.5);
    purpleLight.position.set(-5, 5, 5);
    scene.add(purpleLight);
    
    const blueLight = new THREE.PointLight(0x3b82f6, 0.5);
    blueLight.position.set(5, -5, 5);
    scene.add(blueLight);

    // Create default texture
    const defaultTexture = new THREE.Texture();
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 512;
    textureCanvas.height = 256;
    
    const ctx = textureCanvas.getContext('2d');
    if (ctx) {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, textureCanvas.width, textureCanvas.height);
      gradient.addColorStop(0, '#290b5a');  // Deep purple
      gradient.addColorStop(1, '#000e30');  // Deep blue
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);
      
      // Loading text
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('RSVPY 티켓', textureCanvas.width / 2, 50);
      ctx.font = '16px Arial';
      ctx.fillText('로딩 중...', textureCanvas.width / 2, textureCanvas.height / 2);
    }

    defaultTexture.image = textureCanvas;
    defaultTexture.needsUpdate = true;
    ticketTextureRef.current = defaultTexture;

    // Create ticket geometry with rounded corners
    const ticketWidth = 3.5;
    const ticketHeight = 2;
    const ticketGeometry = new THREE.PlaneGeometry(ticketWidth, ticketHeight, 1, 1);
    
    // Create shimmering material
    const ticketMaterial = new THREE.MeshStandardMaterial({
      map: defaultTexture,
      side: DoubleSide,
      roughness: 0.3,
      metalness: 0.7,
      envMapIntensity: 1
    });
    
    // Create ticket mesh
    const ticket = new THREE.Mesh(ticketGeometry, ticketMaterial);
    scene.add(ticket);
    ticketRef.current = ticket;

    // Initial render
    renderer.render(scene, camera);

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    
    // Animation loop for gentle floating effect
    const animate = () => {
      if (!ticketRef.current || !sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      // Gentle floating animation
      const time = Date.now() * 0.001;
      ticketRef.current.position.y = Math.sin(time * 0.5) * 0.05;
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (ticketRef.current) {
        scene.remove(ticketRef.current);
        ticketRef.current.geometry.dispose();
        (ticketRef.current.material as THREE.MeshStandardMaterial).dispose();
      }
      
      if (ticketTextureRef.current) {
        ticketTextureRef.current.dispose();
      }
      
      if (qrCodeTextureRef.current) {
        qrCodeTextureRef.current.dispose();
      }
      
      renderer.dispose();
    };
  }, []);

  // Generate and update ticket texture
  useEffect(() => {
    if (!ticketRef.current) return;
    
    const generateTicketTexture = async () => {
      // Generate QR code
      const qrCodeDataURL = await QRCode.toDataURL(`RSVPY-TICKET:${ticketId}`, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      // Create texture canvas
      const textureCanvas = document.createElement('canvas');
      textureCanvas.width = 1024;
      textureCanvas.height = 512;
      
      const ctx = textureCanvas.getContext('2d');
      if (!ctx) return;

      // Ticket background gradient
      const gradient = ctx.createLinearGradient(0, 0, textureCanvas.width, textureCanvas.height);
      gradient.addColorStop(0, '#290b5a');  // Deep purple
      gradient.addColorStop(1, '#000e30');  // Deep blue
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

      // Background decorative effect - subtle stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * textureCanvas.width;
        const y = Math.random() * textureCanvas.height;
        const radius = Math.random() * 2 + 1;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ticket border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 10;
      const borderRadius = 40;
      ctx.beginPath();
      ctx.moveTo(borderRadius, 0);
      ctx.lineTo(textureCanvas.width - borderRadius, 0);
      ctx.arc(textureCanvas.width - borderRadius, borderRadius, borderRadius, Math.PI * 1.5, 0, true);
      ctx.lineTo(textureCanvas.width, textureCanvas.height - borderRadius);
      ctx.arc(textureCanvas.width - borderRadius, textureCanvas.height - borderRadius, borderRadius, 0, Math.PI * 0.5, true);
      ctx.lineTo(borderRadius, textureCanvas.height);
      ctx.arc(borderRadius, textureCanvas.height - borderRadius, borderRadius, Math.PI * 0.5, Math.PI, true);
      ctx.lineTo(0, borderRadius);
      ctx.arc(borderRadius, borderRadius, borderRadius, Math.PI, Math.PI * 1.5, true);
      ctx.closePath();
      ctx.stroke();
      
      // Shimmer effect
      const shimmerGradient = ctx.createLinearGradient(0, 0, textureCanvas.width, textureCanvas.height);
      shimmerGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      shimmerGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
      shimmerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = shimmerGradient;
      ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

      // RSVPY logo or text
      ctx.font = 'bold 48px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.textAlign = 'left';
      ctx.fillText('RSVPY', 80, 80);

      // Ticket ID display
      ctx.font = '16px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'right';
      ctx.fillText(ticketId, textureCanvas.width - 80, 80);

      // Divider line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(60, 100);
      ctx.lineTo(textureCanvas.width - 60, 100);
      ctx.stroke();

      // Event name
      ctx.font = 'bold 40px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(eventName, textureCanvas.width / 2, 160);
      
      // Participant name
      ctx.font = '32px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(participantName, textureCanvas.width / 2, 210);

      // QR code (if showing)
      if (showQr) {
        const qrImage = new Image();
        qrImage.src = qrCodeDataURL;
        
        await new Promise<void>((resolve) => {
          qrImage.onload = () => {
            const qrSize = 180;
            ctx.drawImage(
              qrImage, 
              (textureCanvas.width - qrSize) / 2, 
              270, 
              qrSize, 
              qrSize
            );
            
            // QR code label
            ctx.font = '16px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fillText('이벤트 입장 시 스캔하세요', textureCanvas.width / 2, 470);
            
            resolve();
          };
        });
      } else {
        // Decorative effect (instead of QR)
        const centerX = textureCanvas.width / 2;
        const centerY = 350;
        const radius = 80;
        
        // Glow effect
        const glowGradient = ctx.createRadialGradient(
          centerX, centerY, radius * 0.2,
          centerX, centerY, radius
        );
        glowGradient.addColorStop(0, 'rgba(147, 51, 234, 0.3)');
        glowGradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner circle
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
        ctx.stroke();
        
        // Center dot
        ctx.fillStyle = 'rgba(147, 51, 234, 0.5)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
        ctx.fill();

        // Help text
        ctx.font = '18px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText('QR 코드 버튼을 클릭하여 입장 코드를 확인하세요', centerX, 450);
      }

      // Update texture
      if (ticketTextureRef.current) {
        ticketTextureRef.current.image = textureCanvas;
        ticketTextureRef.current.needsUpdate = true;
      } else {
        const newTexture = new THREE.Texture(textureCanvas);
        newTexture.needsUpdate = true;
        ticketTextureRef.current = newTexture;
        
        // Update mesh material
        if (ticketRef.current) {
          (ticketRef.current.material as THREE.MeshStandardMaterial).map = newTexture;
        }
      }
    };

    generateTicketTexture();
  }, [eventName, participantName, ticketId, showQr]);

  // Update rotation
  useEffect(() => {
    if (!ticketRef.current || !sceneRef.current || !cameraRef.current || !rendererRef.current) return;
    
    // Update ticket rotation
    ticketRef.current.rotation.y = rotation;
    
    // Render
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }, [rotation]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full" 
    />
  );
};

export default Ticket3D;
