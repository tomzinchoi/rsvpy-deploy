// 서버 사이드에서만 실행해야 하는 코드입니다.
// 클라이언트에서는 이 파일을 직접 import하지 마세요.

// fs, path는 Node.js 환경에서만 사용 가능
let fs;
let path;

// Node.js 환경일 경우에만 모듈을 로드
if (typeof window === 'undefined') {
  fs = require('fs');
  path = require('path');
}

/**
 * 필요한 디렉토리가 있는지 확인하고 없으면 생성합니다.
 */
function checkAndCreateDirectories() {
  // 브라우저 환경에서는 실행하지 않음
  if (typeof window !== 'undefined') {
    console.warn('Directory setup should not be called on client side');
    return;
  }

  const baseDir = path.join(process.cwd(), 'public', 'images');
  const templateDir = path.join(baseDir, 'templates');
  
  // 기본 이미지 디렉토리 확인
  if (!fs.existsSync(baseDir)) {
    console.log(`Creating directory: ${baseDir}`);
    fs.mkdirSync(baseDir, { recursive: true });
  }
  
  // 템플릿 이미지 디렉토리 확인
  if (!fs.existsSync(templateDir)) {
    console.log(`Creating directory: ${templateDir}`);
    fs.mkdirSync(templateDir, { recursive: true });
  }
  
  // 필요한 이미지 파일 목록
  const requiredFiles = [
    { path: path.join(baseDir, 'event-page-preview.png'), type: 'main' },
    { path: path.join(templateDir, 'wedding.jpg'), type: 'template' },
    { path: path.join(templateDir, 'birthday.jpg'), type: 'template' },
    { path: path.join(templateDir, 'business.jpg'), type: 'template' }
  ];
  
  // 각 파일의 존재 여부 확인
  let missingFiles = [];
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file.path)) {
      missingFiles.push(file);
    }
  });
  
  // 필요한 이미지 파일이 없으면 생성 알림
  if (missingFiles.length > 0) {
    console.log('Missing image files detected:');
    missingFiles.forEach(file => console.log(`- ${file.path}`));
    console.log('\nRun the following command to generate the images:');
    console.log('npm run setup-images');
  } else {
    console.log('All required image files are present!');
  }
}

// 서버 사이드에서만 export
if (typeof window === 'undefined') {
  module.exports = { checkAndCreateDirectories };
} else {
  module.exports = { 
    checkAndCreateDirectories: () => {
      console.warn('Directory setup is not available in browser environment');
    }
  };
}
