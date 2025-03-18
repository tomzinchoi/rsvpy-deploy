const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// 디렉토리 생성 함수
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`디렉토리 생성: ${dirPath}`);
  }
}

// 이미지 디렉토리 경로
const baseDir = path.join(__dirname, '..', 'public', 'images');

// 디렉토리 존재 확인
ensureDirectoryExists(baseDir);

// 로고 이미지 생성
function generateLogo() {
  console.log('로고 이미지 생성 중...');
  
  const size = 512; // 로고 크기 더 크게 조정 (256 -> 512)
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // 배경을 투명하게 설정
  ctx.clearRect(0, 0, size, size);
  
  // 원형 배경
  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  gradient.addColorStop(0, '#9333ea');
  gradient.addColorStop(1, '#7722cf');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // 텍스트 그리기 - 더 크게
  ctx.font = 'bold 192px Arial'; // 글꼴 크기 키움
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RS', size / 2, size / 2 - 40); // 위치 조정
  ctx.fillText('VPY', size / 2, size / 2 + 120); // 위치 조정
  
  // 파일 저장
  const buffer = canvas.toBuffer('image/png');
  const filePath = path.join(baseDir, 'logo.png');
  fs.writeFileSync(filePath, buffer);
  console.log(`로고 저장: ${filePath}`);
}

// 이미지 생성 실행
generateLogo();

console.log('로고 이미지 생성 완료!');
