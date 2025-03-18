import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 개발 환경이 아닌 경우 접근 거부
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ 
      error: 'This API endpoint is only available in development mode' 
    });
  }

  try {
    // 서버 사이드에서만 directorySetup 모듈 로드
    const { checkAndCreateDirectories } = require('../../../utils/directorySetup');
    
    // 디렉토리 확인 및 생성 함수 실행
    checkAndCreateDirectories();
    
    // 성공 응답
    res.status(200).json({ success: true, message: 'Directory check completed' });
  } catch (error) {
    console.error('Error checking directories:', error);
    res.status(500).json({ 
      error: 'Failed to check directories',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
