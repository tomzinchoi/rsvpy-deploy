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

  // 씬 초기화
  useEffect(() => {
    if (!canvasRef.current) return;

    // 렌더러 생성
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // 씬 생성
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 카메라 생성
    const camera = new THREE.PerspectiveCamera(
      50, 
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // 조명 생성
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 5);
    scene.add(directionalLight);

    // 티켓 생성을 위한 기본 텍스처
    const defaultTexture = new THREE.Texture();
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 512;
    textureCanvas.height = 256;
    
    const ctx = textureCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);
      ctx.fillStyle = 'rgba(138, 43, 226, 0.2)';
      ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);
      
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

    // 티켓 메쉬 생성
    const ticketGeometry = new THREE.PlaneGeometry(3.5, 2);
    const ticketMaterial = new THREE.MeshStandardMaterial({
      map: defaultTexture,
      side: DoubleSide,
      roughness: 0.4,
      metalness: 0.1
    });
    const ticket = new THREE.Mesh(ticketGeometry, ticketMaterial);
    scene.add(ticket);
    ticketRef.current = ticket;

    // 초기 렌더링
    renderer.render(scene, camera);

    // 반응형 대응
    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 클린업
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

  // 티켓 텍스처 생성 및 업데이트
  useEffect(() => {
    if (!ticketRef.current) return;
    
    const generateTicketTexture = async () => {
      // QR 코드 생성
      const qrCodeDataURL = await QRCode.toDataURL(`RSVPY-TICKET:${ticketId}`, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      // 텍스처용 캔버스 생성
      const textureCanvas = document.createElement('canvas');
      textureCanvas.width = 1024;
      textureCanvas.height = 512;
      
      const ctx = textureCanvas.getContext('2d');
      if (!ctx) return;

      // 티켓 배경
      const gradient = ctx.createLinearGradient(0, 0, textureCanvas.width, textureCanvas.height);
      gradient.addColorStop(0, '#290b5a');  // 짙은 보라
      gradient.addColorStop(1, '#000e30');  // 짙은 파랑
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

      // 배경 장식 효과
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * textureCanvas.width;
        const y = Math.random() * textureCanvas.height;
        const radius = Math.random() * 2 + 1;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 티켓 테두리
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

      // RSVPY 로고
      ctx.font = 'bold 48px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.textAlign = 'left';
      ctx.fillText('RSVPY', 80, 80);

      // 티켓 ID 표시
      ctx.font = '16px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'right';
      ctx.fillText(ticketId, textureCanvas.width - 80, 80);

      // 구분선 추가
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(60, 100);
      ctx.lineTo(textureCanvas.width - 60, 100);
      ctx.stroke();

      // 이벤트 이름
      ctx.font = 'bold 40px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(eventName, textureCanvas.width / 2, 160);
      
      // 참가자 이름
      ctx.font = '32px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(participantName, textureCanvas.width / 2, 210);

      // QR 코드 (showQr이 true일 때만)
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
            
            // QR 코드 레이블
            ctx.font = '16px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fillText('이벤트 입장 시 스캔하세요', textureCanvas.width / 2, 470);
            
            resolve();
          };
        });
      } else {
        // 장식 효과 (QR 대신)
        ctx.fillStyle = 'rgba(138, 43, 226, 0.2)';
        ctx.beginPath();
        ctx.arc(textureCanvas.width / 2, 350, 80, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(textureCanvas.width / 2, 350, 60, 0, Math.PI * 2);
        ctx.stroke();

        // 소개 텍스트
        ctx.font = '18px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText('QR 코드 버튼을 클릭하여 입장 코드를 확인하세요', textureCanvas.width / 2, 450);
      }

      // 현재 텍스처 업데이트 또는 새 텍스처 생성
      if (ticketTextureRef.current) {
        ticketTextureRef.current.image = textureCanvas;
        ticketTextureRef.current.needsUpdate = true;
      } else {
        const newTexture = new THREE.Texture(textureCanvas);
        newTexture.needsUpdate = true;
        ticketTextureRef.current = newTexture;
        
        // 메쉬 머터리얼 업데이트
        if (ticketRef.current) {
          (ticketRef.current.material as THREE.MeshStandardMaterial).map = newTexture;
        }
      }
    };

    generateTicketTexture();
  }, [eventName, participantName, ticketId, showQr]);

  // 회전 업데이트
  useEffect(() => {
    if (!ticketRef.current || !sceneRef.current || !cameraRef.current || !rendererRef.current) return;
    
    // 기존 애니메이션 취소
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // 티켓 회전 설정
    ticketRef.current.rotation.y = rotation;
    
    // 렌더링
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
