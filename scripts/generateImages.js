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
const templatesDir = path.join(baseDir, 'templates');

// 디렉토리 존재 확인
ensureDirectoryExists(baseDir);
ensureDirectoryExists(templatesDir);

// 기본 이미지 생성 함수
function generateImage(filePath, width, height, backgroundColor, text) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 배경 색상
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // 텍스트
  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  // 파일 저장
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, buffer);
  console.log(`이미지 생성 완료: ${filePath}`);
}

// 이미지 생성 실행
generateImage(path.join(baseDir, 'event-page-preview.png'), 700, 500, '#4A90E2', 'Event Preview');
generateImage(path.join(templatesDir, 'wedding.jpg'), 400, 300, '#FF6F61', 'Wedding Template');
generateImage(path.join(templatesDir, 'birthday.jpg'), 400, 300, '#FFD700', 'Birthday Template');
generateImage(path.join(templatesDir, 'business.jpg'), 400, 300, '#4CAF50', 'Business Template');

console.log('모든 이미지 생성 완료!');
